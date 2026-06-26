"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const { execFile } = require("node:child_process");
const express = require("express");
const multer = require("multer");

const root = __dirname;
const port = Number(process.env.PORT || 8088);
const sessions = new Map();

const contentFiles = Object.freeze({
  siteSettings: "site-settings.json",
  landing: "landing.json",
  services: "services.json",
  portfolio: "portfolio.json",
  about: "about.json",
  contact: "contact.json",
  process: "process.json",
  homepageSections: "homepage-sections.json"
});

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 18 * 1024 * 1024,
    files: 20
  },
  fileFilter(_request, file, callback) {
    if (!/^image\/(png|jpe?g|webp|gif)$/i.test(file.mimetype)) {
      callback(new Error("Only JPG, PNG, WebP, or GIF images can be uploaded."));
      return;
    }
    callback(null, true);
  }
});

app.use(express.json({ limit: "6mb" }));

async function loadLocalEnv() {
  try {
    const raw = await fs.readFile(path.join(root, ".env"), "utf8");
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const index = trimmed.indexOf("=");
      if (index <= 0) return;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    });
  } catch {
    // Local .env is optional. The editor falls back to locked mode if missing.
  }
}

function parseCookies(header) {
  return String(header || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const index = part.indexOf("=");
      if (index > 0) cookies[part.slice(0, index)] = decodeURIComponent(part.slice(index + 1));
      return cookies;
    }, {});
}

function editorCredentialsReady() {
  return Boolean(process.env.EDITOR_EMAIL && process.env.EDITOR_PASSWORD);
}

function getSession(request) {
  const token = parseCookies(request.headers.cookie).jds_editor_session;
  if (!token) return null;
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

function requireEditorLogin(request, response, next) {
  if (getSession(request)) {
    next();
    return;
  }
  response.status(401).send("Editor login required.");
}

function safeUploadName(originalName) {
  const parsed = path.parse(originalName || "image.jpg");
  const extension = parsed.ext.toLowerCase().replace(/[^a-z0-9.]/g, "") || ".jpg";
  const base =
    parsed.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 56) || "jaiwin-work";
  return `${base}-${Date.now()}-${crypto.randomBytes(3).toString("hex")}${extension}`;
}

function runGit(args) {
  return new Promise((resolve) => {
    execFile("git", args, { cwd: root, windowsHide: true, timeout: 15000 }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        text: String(stdout || stderr || "").trim()
      });
    });
  });
}

async function gitStatus() {
  const [branch, remote, status] = await Promise.all([
    runGit(["branch", "--show-current"]),
    runGit(["remote", "get-url", "origin"]),
    runGit(["status", "--short"])
  ]);
  return {
    branch: branch.text || "main",
    remote: remote.ok ? remote.text : "",
    changed: Boolean(status.text),
    status: status.text
  };
}

app.get("/_local/status", async (_request, response) => {
  response.json({
    ok: true,
    root,
    ...(await gitStatus())
  });
});

app.get("/_local/auth/status", (request, response) => {
  response.json({
    ok: true,
    configured: editorCredentialsReady(),
    authenticated: Boolean(getSession(request))
  });
});

app.post("/_local/auth/login", (request, response) => {
  if (!editorCredentialsReady()) {
    response.status(500).send("Editor login is not configured on this device.");
    return;
  }

  const email = String(request.body?.email || "").trim().toLowerCase();
  const password = String(request.body?.password || "");
  const expectedEmail = String(process.env.EDITOR_EMAIL || "").trim().toLowerCase();
  const expectedPassword = String(process.env.EDITOR_PASSWORD || "");

  if (email !== expectedEmail || password !== expectedPassword) {
    response.status(401).send("Wrong email or password.");
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, {
    email,
    expiresAt: Date.now() + 1000 * 60 * 60 * 12
  });
  response.setHeader("Set-Cookie", `jds_editor_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=43200`);
  response.json({ ok: true });
});

app.post("/_local/auth/logout", (request, response) => {
  const token = parseCookies(request.headers.cookie).jds_editor_session;
  if (token) sessions.delete(token);
  response.setHeader("Set-Cookie", "jds_editor_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
  response.json({ ok: true });
});

app.post("/_local/upload", requireEditorLogin, upload.single("image"), async (request, response) => {
  if (!request.file) {
    response.status(400).send("No image was uploaded.");
    return;
  }

  const uploadsDir = path.join(root, "assets", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const fileName = safeUploadName(request.file.originalname);
  await fs.writeFile(path.join(uploadsDir, fileName), request.file.buffer);
  response.json({
    path: `/assets/uploads/${fileName}`,
    fileName
  });
});

app.post("/_local/delete-upload", requireEditorLogin, async (request, response) => {
  const publicPath = String(request.body?.path || "");
  if (!publicPath.startsWith("/assets/uploads/")) {
    response.status(400).send("Only uploaded files can be deleted.");
    return;
  }

  const fileName = path.basename(publicPath);
  const target = path.join(root, "assets", "uploads", fileName);
  const uploadsRoot = path.join(root, "assets", "uploads");
  const resolved = path.resolve(target);
  if (!resolved.startsWith(path.resolve(uploadsRoot))) {
    response.status(400).send("Invalid upload path.");
    return;
  }

  let deleted = false;
  try {
    await fs.unlink(resolved);
    deleted = true;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  response.json({
    ok: true,
    deleted,
    path: publicPath
  });
});

app.post("/_local/cleanup-missing-uploads", requireEditorLogin, async (request, response) => {
  const incoming = request.body && request.body.content;
  if (!incoming || typeof incoming !== "object") {
    response.status(400).send("Missing website content.");
    return;
  }

  const uploadsDir = path.join(root, "assets", "uploads");
  const items = Array.isArray(incoming.portfolio?.items) ? incoming.portfolio.items : [];
  const nextItems = [];
  const removed = [];

  for (const item of items) {
    const image = String(item.image || "");
    if (!image.startsWith("/assets/uploads/")) {
      nextItems.push(item);
      continue;
    }

    const fileName = path.basename(image);
    try {
      await fs.access(path.join(uploadsDir, fileName));
      nextItems.push(item);
    } catch {
      removed.push(item.title || image);
    }
  }

  incoming.portfolio.items = nextItems;
  response.json({
    ok: true,
    removed,
    content: incoming
  });
});

app.post("/_local/content", requireEditorLogin, async (request, response) => {
  const incoming = request.body && request.body.content;
  if (!incoming || typeof incoming !== "object") {
    response.status(400).send("Missing website content.");
    return;
  }

  const contentDir = path.join(root, "content");
  await fs.mkdir(contentDir, { recursive: true });

  await Promise.all(
    Object.entries(contentFiles).map(([key, fileName]) => {
      const value = incoming[key];
      if (value === undefined) return Promise.resolve();
      return fs.writeFile(path.join(contentDir, fileName), `${JSON.stringify(value, null, 2)}\n`, "utf8");
    })
  );

  response.json({
    ok: true,
    ...(await gitStatus())
  });
});

app.post("/_local/publish", requireEditorLogin, async (request, response) => {
  const message = String(request.body?.message || "Update website content").trim().slice(0, 120);
  const statusBefore = await runGit(["status", "--short"]);
  if (!statusBefore.text) {
    response.json({
      ok: true,
      changed: false,
      message: "No changes to publish.",
      ...(await gitStatus())
    });
    return;
  }

  const add = await runGit(["add", "-A"]);
  if (!add.ok) {
    response.status(500).send(add.text || "Could not stage changes.");
    return;
  }

  const commit = await runGit(["-c", "user.name=storagejaiwin-1", "-c", "user.email=262747217+storagejaiwin-1@users.noreply.github.com", "commit", "-m", message]);
  if (!commit.ok && !commit.text.includes("nothing to commit")) {
    response.status(500).send(commit.text || "Could not commit changes.");
    return;
  }

  const push = await runGit(["push", "-u", "origin", "main"]);
  if (!push.ok) {
    response.status(500).send(push.text || "Could not push to GitHub.");
    return;
  }

  response.json({
    ok: true,
    changed: true,
    message: push.text || "Published to GitHub.",
    ...(await gitStatus())
  });
});

app.use(express.static(root, {
  extensions: ["html"]
}));

loadLocalEnv().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Jaiwin local editor running at http://127.0.0.1:${port}/`);
  });
});
