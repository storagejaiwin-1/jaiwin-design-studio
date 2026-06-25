(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const editMode = params.get("edit") === "1" || params.has("edit");
  if (!editMode) return;

  const CONTENT_FILES = Object.freeze({
    siteSettings: "site-settings.json",
    landing: "landing.json",
    services: "services.json",
    portfolio: "portfolio.json",
    about: "about.json",
    contact: "contact.json",
    process: "process.json",
    homepageSections: "homepage-sections.json"
  });

  const STATIC_TEXT_BINDINGS = Object.freeze([
    ["[data-logo-text]", "siteSettings.logoText"],
    [".brand__mark", "siteSettings.logoMarkText"],
    ["[data-site-location]", "siteSettings.location"],
    ["[data-location-label]", "siteSettings.locationLabel"],
    ["[data-footer-business]", "siteSettings.businessName"],
    ["[data-footer-text]", "siteSettings.footerText"],
    ["[data-footer-phone]", "siteSettings.phone"],
    ["[data-footer-email]", "siteSettings.email"],
    ["[data-footer-instagram]", "siteSettings.instagramHandle"],
    ["[data-landing-eyebrow]", "landing.eyebrowText"],
    ["[data-landing-headline]", "landing.mainHeadline"],
    ["[data-landing-highlight]", "landing.highlightedHeadlineWord"],
    ["[data-landing-subheadline]", "landing.subheadline"],
    ["[data-primary-cta] span", "landing.primaryCtaLabel"],
    ["[data-secondary-cta] span", "landing.secondaryCtaLabel"],
    ["[data-hero-card-eyebrow]", "landing.heroCardEyebrow"],
    ["[data-hero-card-title]", "landing.heroCardTitle"],
    ["[data-hero-card-text]", "landing.heroCardText"],
    ["[data-about-kicker]", "about.sectionKicker"],
    ["[data-about-heading]", "about.heading"],
    ["[data-about-highlight]", "about.highlightText"],
    ["[data-services-kicker]", "services.sectionKicker"],
    ["[data-services-heading]", "services.heading"],
    ["[data-services-subheading]", "services.subheading"],
    ["[data-portfolio-kicker]", "portfolio.sectionKicker"],
    ["[data-portfolio-heading]", "portfolio.heading"],
    ["[data-portfolio-subheading]", "portfolio.subheading"],
    ["[data-portfolio-cta]", "portfolio.ctaLabel"],
    ["[data-highlights-kicker]", "homepageSections.sectionKicker"],
    ["[data-highlights-heading]", "homepageSections.highlightsHeading"],
    ["[data-highlights-subheading]", "homepageSections.highlightsSubheading"],
    ["[data-process-kicker]", "process.sectionKicker"],
    ["[data-process-heading]", "process.heading"],
    ["[data-process-subheading]", "process.subheading"],
    ["[data-contact-kicker]", "contact.sectionKicker"],
    ["[data-contact-heading]", "contact.heading"],
    ["[data-contact-subheading]", "contact.subheading"],
    ["[data-contact-address]", "contact.address"],
    ["[data-business-hours]", "contact.businessHours"],
    ["[data-contact-whatsapp] strong", "contact.whatsappCtaText"],
    ["[data-contact-email] strong", "contact.emailCtaText"],
    ["[data-contact-instagram-label]", "contact.instagramCtaText"],
    ["[data-map-link]", "contact.mapCtaText"],
    ["[data-contact-name-label]", "contact.nameLabel"],
    ["[data-contact-phone-label]", "contact.phoneLabel"],
    ["[data-contact-project-type-label]", "contact.projectTypeLabel"],
    ["[data-contact-message-label]", "contact.messageLabel"],
    ["[data-contact-submit]", "contact.submitLabel"],
    ["[data-form-success]", "contact.contactFormSuccessMessage"]
  ]);

  const STATIC_IMAGE_BINDINGS = Object.freeze([
    ["[data-hero-fallback]", "landing.heroImageFallback"],
    ["[data-about-image]", "about.image"]
  ]);

  const COLOR_FIELDS = Object.freeze([
    ["Background", "siteSettings.backgroundColor", "--bg"],
    ["Surface", "siteSettings.surfaceColor", "--bg-2"],
    ["Text", "siteSettings.textColor", "--ink"],
    ["Muted", "siteSettings.mutedTextColor", "--muted"],
    ["Primary", "siteSettings.primaryBrandColor", "--primary"],
    ["Secondary", "siteSettings.secondaryBrandColor", "--secondary"],
    ["Highlight", "siteSettings.highlightColor", "--cyan"]
  ]);

  const PORTFOLIO_CATEGORIES = Object.freeze([
    "Sports Banner",
    "Sports Flyer",
    "Event Poster",
    "Wedding Banner",
    "Invitation",
    "Logo Design",
    "Shop Banner",
    "Memorial Banner",
    "Web Design",
    "Other"
  ]);

  let content = null;
  let rootHandle = null;
  let localServerReady = false;
  let selectedElement = null;
  let selectedPath = "";
  let selectedType = "text";
  let panel = null;
  let fieldInput = null;
  let selectedLabel = null;
  let imageButton = null;
  let statusBox = null;
  let fileInput = null;
  let categorySelect = null;
  let categoryTitleInput = null;
  let categoryDescriptionInput = null;
  let categoryFileInput = null;
  let uploadList = null;

  function pathParts(path) {
    return String(path || "")
      .split(".")
      .filter(Boolean)
      .map((part) => (/^\d+$/.test(part) ? Number(part) : part));
  }

  function getByPath(source, path) {
    return pathParts(path).reduce((value, part) => (value == null ? undefined : value[part]), source);
  }

  function setByPath(source, path, nextValue) {
    const parts = pathParts(path);
    const last = parts.pop();
    const target = parts.reduce((value, part) => value[part], source);
    if (target && last !== undefined) target[last] = nextValue;
  }

  function status(message) {
    if (statusBox) statusBox.textContent = message;
  }

  async function checkLocalServer() {
    try {
      const response = await fetch("/_local/status", { cache: "no-store" });
      if (!response.ok) throw new Error("Local server not ready");
      const details = await response.json();
      localServerReady = Boolean(details.ok);
      return details;
    } catch {
      localServerReady = false;
      return null;
    }
  }

  function cleanText(value) {
    return String(value || "").replace(/\u00a0/g, " ").replace(/[ \t]+\n/g, "\n").trim();
  }

  function getTextFromElement(element) {
    return cleanText(element.innerText || element.textContent || "");
  }

  function syncFieldValue(path, value) {
    if (!content || !path) return;
    setByPath(content, path, value);
  }

  function applyStaticBindings() {
    STATIC_TEXT_BINDINGS.forEach(([selector, path]) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.dataset.liveText = path;
      });
    });

    STATIC_IMAGE_BINDINGS.forEach(([selector, path]) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.dataset.liveImage = path;
      });
    });
  }

  function makeTextEditable() {
    document.querySelectorAll("[data-live-text]").forEach((element) => {
      element.setAttribute("contenteditable", "true");
      element.setAttribute("spellcheck", "false");
    });
  }

  function clearSelection() {
    if (selectedElement) selectedElement.classList.remove("live-edit-selected");
  }

  function selectElement(element) {
    clearSelection();
    selectedElement = element;
    selectedElement.classList.add("live-edit-selected");
    selectedPath = element.dataset.liveText || element.dataset.liveImage || "";
    selectedType = element.dataset.liveImage ? "image" : "text";

    if (selectedLabel) selectedLabel.textContent = selectedPath ? `Selected: ${selectedPath}` : "Selected field";
    if (fieldInput) {
      fieldInput.disabled = selectedType === "image";
      fieldInput.value = selectedType === "image" ? String(getByPath(content, selectedPath) || "") : getTextFromElement(element);
    }
    if (imageButton) imageButton.disabled = selectedType !== "image";
    status(selectedType === "image" ? "Use Upload image to replace this picture." : "Type directly on the page or edit the text box here.");
  }

  function bindEditableElements() {
    applyStaticBindings();
    makeTextEditable();
  }

  async function ensureWritePermission(handle) {
    if (!handle) return false;
    if (!handle.queryPermission || !handle.requestPermission) return true;
    const options = { mode: "readwrite" };
    if ((await handle.queryPermission(options)) === "granted") return true;
    return (await handle.requestPermission(options)) === "granted";
  }

  async function getDirectory(handle, names, options = {}) {
    let current = handle;
    for (const name of names) {
      current = await current.getDirectoryHandle(name, options);
    }
    return current;
  }

  async function chooseWebsiteFolder() {
    if (!window.showDirectoryPicker) {
      status("This browser cannot save directly to a folder. Use Chrome or Edge for local live editing.");
      return;
    }

    rootHandle = await window.showDirectoryPicker({ mode: "readwrite" });
    const permitted = await ensureWritePermission(rootHandle);
    if (!permitted) {
      rootHandle = null;
      status("Folder permission was not granted.");
      return;
    }

    await rootHandle.getDirectoryHandle("content");
    await getDirectory(rootHandle, ["assets", "uploads"]);
    status("Website folder connected. You can save text and upload images locally now.");
  }

  async function writeTextFile(relativePath, text) {
    if (!rootHandle) await chooseWebsiteFolder();
    if (!rootHandle) return;

    const parts = relativePath.split("/");
    const fileName = parts.pop();
    const dir = await getDirectory(rootHandle, parts, { create: true });
    const fileHandle = await dir.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(text);
    await writable.close();
  }

  async function saveWithLocalServer() {
    const response = await fetch("/_local/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Could not save through the local server.");
    }
    return response.json();
  }

  async function saveContentFiles() {
    if (!content) return;
    if (localServerReady) {
      await saveWithLocalServer();
      status("Saved into the website files. Commit and push from VS Code to update GitHub/Netlify.");
      return;
    }

    if (!rootHandle) await chooseWebsiteFolder();
    if (!rootHandle) return;

    await Promise.all(
      Object.entries(CONTENT_FILES).map(([key, fileName]) =>
        writeTextFile(`content/${fileName}`, `${JSON.stringify(content[key], null, 2)}\n`)
      )
    );
    status("Saved into the website folder. Commit and push from VS Code to update GitHub/Netlify.");
  }

  function safeFileName(file) {
    const extension = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const base = file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 56);
    return `${base || "jaiwin-work"}-${Date.now()}.${extension || "jpg"}`;
  }

  async function saveImageFile(file) {
    if (localServerReady) {
      const data = new FormData();
      data.append("image", file);
      const response = await fetch("/_local/upload", {
        method: "POST",
        body: data
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Could not upload through the local server.");
      }
      const result = await response.json();
      return result.path;
    }

    if (!rootHandle) await chooseWebsiteFolder();
    if (!rootHandle) return "";

    const fileName = safeFileName(file);
    const uploads = await getDirectory(rootHandle, ["assets", "uploads"], { create: true });
    const imageHandle = await uploads.getFileHandle(fileName, { create: true });
    const writable = await imageHandle.createWritable();
    await writable.write(file);
    await writable.close();
    return `/assets/uploads/${fileName}`;
  }

  async function uploadSelectedImage(file) {
    if (!selectedPath || selectedType !== "image" || !file) {
      status("Click a website image first, then upload.");
      return;
    }

    const publicPath = await saveImageFile(file);
    if (!publicPath) return;
    syncFieldValue(selectedPath, publicPath);
    if (selectedElement && selectedElement.tagName === "IMG") {
      selectedElement.src = publicPath;
    }
    if (fieldInput) fieldInput.value = publicPath;
    status("Image saved locally. Press Save changes to update the website content file.");
  }

  async function addCategoryImages(files) {
    const selectedFiles = Array.from(files || []);
    if (!selectedFiles.length) {
      status("Choose one or more images first.");
      return;
    }
    if (!content?.portfolio) return;
    if (!Array.isArray(content.portfolio.items)) content.portfolio.items = [];

    const category = categorySelect?.value || "Other";
    const baseTitle = cleanText(categoryTitleInput?.value || "");
    const baseDescription =
      cleanText(categoryDescriptionInput?.value || "") || `New ${category.toLowerCase()} design from Jaiwin Design Studio.`;

    setUploadList([]);
    const created = [];
    for (const file of selectedFiles) {
      status(`Uploading ${file.name}...`);
      const imagePath = await saveImageFile(file);
      if (!imagePath) continue;
      const title = baseTitle || file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      const item = {
        title,
        description: baseDescription,
        category,
        postedDate: new Date().toISOString().slice(0, 10),
        image: imagePath,
        videoUpload: "",
        externalVideoUrl: "",
        featured: false,
        altText: `${title} design`
      };
      content.portfolio.items.unshift(item);
      created.push(`${category}: ${file.name}`);
    }

    window.JaiwinSite.renderAll(content);
    bindEditableElements();
    setUploadList(created);
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth", block: "start" });
    status(`Added ${created.length} image${created.length === 1 ? "" : "s"} to ${category}. Press Save changes.`);
  }

  function setUploadList(items) {
    if (!uploadList) return;
    uploadList.innerHTML = "";
    items.forEach((item) => {
      const row = document.createElement("li");
      row.textContent = item;
      uploadList.append(row);
    });
  }

  function addWorkPost() {
    if (!content?.portfolio) return;
    if (!Array.isArray(content.portfolio.items)) content.portfolio.items = [];
    content.portfolio.items.unshift({
      title: "New work title",
      description: "Write a short description for this design.",
      category: "Other",
      postedDate: new Date().toISOString().slice(0, 10),
      image: "/assets/images/placeholder-portfolio-1.svg",
      videoUpload: "",
      externalVideoUrl: "",
      featured: false,
      altText: "Jaiwin Design Studio work"
    });
    window.JaiwinSite.renderAll(content);
    bindEditableElements();
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth", block: "start" });
    status("New work card added at the top. Click its text or image to edit it.");
  }

  function updateColor(path, cssVar, value) {
    if (!/^#[0-9a-f]{6}$/i.test(value)) return;
    syncFieldValue(path, value);
    document.documentElement.style.setProperty(cssVar, value);
  }

  function createPanel() {
    panel = document.createElement("aside");
    panel.className = "live-editor-panel";
    panel.setAttribute("aria-label", "Live website editor");

    const title = document.createElement("strong");
    title.textContent = "Live Edit Mode";

    const topRow = document.createElement("div");
    topRow.className = "live-editor-row";

    const chooseButton = button("Choose folder", chooseWebsiteFolder);
    const saveButton = button("Save changes", saveContentFiles, true);
    const addButton = button("Add work", addWorkPost);
    const exitLink = document.createElement("a");
    exitLink.className = "live-editor-link";
    exitLink.href = window.location.pathname;
    exitLink.textContent = "Exit";

    topRow.append(chooseButton, saveButton, addButton, exitLink);

    selectedLabel = document.createElement("p");
    selectedLabel.className = "live-editor-selected-label";
    selectedLabel.textContent = "Click website text or an image";

    const fieldLabel = document.createElement("label");
    fieldLabel.textContent = "Selected text or image path";
    fieldInput = document.createElement("textarea");
    fieldInput.disabled = true;
    fieldInput.addEventListener("input", () => {
      if (!selectedPath || selectedType !== "text" || !selectedElement) return;
      const value = cleanText(fieldInput.value);
      syncFieldValue(selectedPath, value);
      selectedElement.textContent = value;
    });
    fieldLabel.append(fieldInput);

    imageButton = button("Upload image", () => fileInput.click());
    imageButton.disabled = true;
    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/png,image/jpeg,image/webp,image/gif";
    fileInput.className = "live-editor-file-input";
    fileInput.addEventListener("change", () => {
      const file = fileInput.files && fileInput.files[0];
      if (file) uploadSelectedImage(file);
      fileInput.value = "";
    });

    const categoryGroup = document.createElement("div");
    categoryGroup.className = "live-editor-group";
    const categoryHeading = document.createElement("p");
    categoryHeading.className = "live-editor-group-title";
    categoryHeading.textContent = "Add images by category";

    const categoryGrid = document.createElement("div");
    categoryGrid.className = "live-editor-grid";

    const categoryLabel = document.createElement("label");
    categoryLabel.textContent = "Category";
    categorySelect = document.createElement("select");
    PORTFOLIO_CATEGORIES.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.append(option);
    });
    categoryLabel.append(categorySelect);

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Title";
    categoryTitleInput = document.createElement("input");
    categoryTitleInput.placeholder = "Leave empty to use file name";
    titleLabel.append(categoryTitleInput);

    categoryGrid.append(categoryLabel, titleLabel);

    const descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Description";
    categoryDescriptionInput = document.createElement("textarea");
    categoryDescriptionInput.rows = 3;
    categoryDescriptionInput.placeholder = "Short text for these uploaded designs";
    descriptionLabel.append(categoryDescriptionInput);

    categoryFileInput = document.createElement("input");
    categoryFileInput.type = "file";
    categoryFileInput.accept = "image/png,image/jpeg,image/webp,image/gif";
    categoryFileInput.multiple = true;
    categoryFileInput.className = "live-editor-file-input";
    categoryFileInput.addEventListener("change", () => {
      addCategoryImages(categoryFileInput.files).catch((error) => status(error.message || "Upload failed."));
      categoryFileInput.value = "";
    });

    const uploadCategoryButton = button("Choose category images", () => categoryFileInput.click());
    uploadList = document.createElement("ul");
    uploadList.className = "live-editor-upload-list";

    categoryGroup.append(categoryHeading, categoryGrid, descriptionLabel, uploadCategoryButton, categoryFileInput, uploadList);

    const colorWrap = document.createElement("div");
    colorWrap.className = "live-editor-colors";
    COLOR_FIELDS.forEach(([label, path, cssVar]) => {
      const colorLabel = document.createElement("label");
      colorLabel.className = "live-editor-color";
      const text = document.createElement("span");
      text.textContent = label;
      const input = document.createElement("input");
      input.type = "color";
      input.value = getByPath(content, path) || "#ffffff";
      input.addEventListener("input", () => updateColor(path, cssVar, input.value));
      colorLabel.append(text, input);
      colorWrap.append(colorLabel);
    });

    statusBox = document.createElement("p");
    statusBox.className = "live-editor-status";
    statusBox.textContent = "Checking local editor server...";

    panel.append(title, topRow, categoryGroup, selectedLabel, fieldLabel, imageButton, fileInput, colorWrap, statusBox);
    document.body.append(panel);
  }

  function button(label, action, primary = false) {
    const element = document.createElement("button");
    element.type = "button";
    element.className = `live-editor-button${primary ? " is-primary" : ""}`;
    element.textContent = label;
    element.addEventListener("click", async () => {
      try {
        await action();
      } catch (error) {
        status(error.message || "Something stopped the editor action.");
      }
    });
    return element;
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-live-text], [data-live-image]");
      if (!target || panel?.contains(target)) return;
      event.preventDefault();
      event.stopPropagation();
      selectElement(target);
    });

    document.addEventListener("input", (event) => {
      const target = event.target.closest("[data-live-text]");
      if (!target || panel?.contains(target)) return;
      const path = target.dataset.liveText;
      const value = getTextFromElement(target);
      syncFieldValue(path, value);
      if (target === selectedElement && fieldInput) fieldInput.value = value;
    });

    document.addEventListener("keydown", (event) => {
      const target = event.target.closest("[data-live-text]");
      if (!target) return;
      const allowLineBreak = target.matches("p, address, small") || target.dataset.liveMultiline === "true";
      if (event.key === "Enter" && !allowLineBreak) {
        event.preventDefault();
        target.blur();
      }
    });
  }

  async function initEditor(loadedContent) {
    content = loadedContent;
    document.body.classList.add("live-edit-mode");
    bindEditableElements();
    createPanel();
    bindEvents();
    const server = await checkLocalServer();
    if (server?.ok) {
      status(server.remote ? "Live editor ready. Local saving and uploads are active." : "Live editor ready. Uploads work locally; GitHub remote is not attached yet.");
    } else {
      status("Live editor ready. Local server is not active, so choose the website folder before saving or uploading.");
    }
  }

  if (window.JaiwinSite?.content) {
    initEditor(window.JaiwinSite.content);
  } else {
    window.addEventListener(
      "jaiwin:content-ready",
      (event) => {
        initEditor(event.detail.content);
      },
      { once: true }
    );
  }
})();
