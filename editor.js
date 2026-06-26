(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const legacyEditMode = params.get("edit") === "1" || params.has("edit");
  const editMode = normalizedPath === "/admin/editor";
  if (!editMode) {
    if (legacyEditMode) window.location.replace("/admin/editor");
    return;
  }

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
  let localServerReady = false;
  let selectedElement = null;
  let selectedPath = "";
  let selectedType = "text";
  let panel = null;
  let fieldInput = null;
  let selectedLabel = null;
  let imageButton = null;
  let deleteImageButton = null;
  let deleteCardButton = null;
  let statusBox = null;
  let fileInput = null;
  let categorySelect = null;
  let categoryTitleInput = null;
  let categoryDescriptionInput = null;
  let categoryFileInput = null;
  let uploadList = null;
  let imageMenu = null;
  let loginPanel = null;
  let autosaveTimer = null;

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

  function removeByPath(source, path) {
    const parts = pathParts(path);
    const last = parts.pop();
    const target = parts.reduce((value, part) => (value == null ? undefined : value[part]), source);
    if (Array.isArray(target) && typeof last === "number") {
      target.splice(last, 1);
      return true;
    }
    if (target && last !== undefined) {
      delete target[last];
      return true;
    }
    return false;
  }

  function imagePathToItemPath(path) {
    const match = String(path || "").match(/^portfolio\.items\.(\d+)\.image$/);
    return match ? `portfolio.items.${match[1]}` : "";
  }

  function status(message) {
    if (statusBox) statusBox.textContent = message;
  }

  function scheduleAutosave(message = "Saved into the project folder. Use Save + publish when ready.") {
    window.clearTimeout(autosaveTimer);
    autosaveTimer = window.setTimeout(async () => {
      try {
        await requireLocalEditorServer();
        await saveWithLocalServer();
        status(message);
      } catch (error) {
        if (String(error.message || "").toLowerCase().includes("login")) {
          showLoginPanel("Please log in again to save changes.");
        } else {
          status(error.message || "Autosave could not finish.");
        }
      }
    }, 900);
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

  async function checkEditorAuth() {
    try {
      const response = await fetch("/_local/auth/status", { cache: "no-store" });
      if (!response.ok) throw new Error("Login server not ready");
      return await response.json();
    } catch {
      return {
        ok: false,
        configured: false,
        authenticated: false
      };
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
    const hasWorkCard = Boolean(imagePathToItemPath(selectedPath));
    if (imageButton) imageButton.disabled = selectedType !== "image";
    if (deleteImageButton) deleteImageButton.disabled = selectedType !== "image";
    if (deleteCardButton) deleteCardButton.disabled = selectedType !== "image";
    if (deleteCardButton) deleteCardButton.textContent = hasWorkCard ? "Delete work card" : "Clear image";
    status(selectedType === "image" ? "Use Upload image to replace this picture." : "Type directly on the page or edit the text box here.");
  }

  function closeImageMenu() {
    if (imageMenu) {
      imageMenu.remove();
      imageMenu = null;
    }
  }

  function bindEditableElements() {
    applyStaticBindings();
    makeTextEditable();
    addImageActionOverlays();
  }

  function addImageActionOverlays() {
    document.querySelectorAll("[data-live-image]").forEach((image) => {
      const parent = image.parentElement;
      if (!parent || parent.querySelector(":scope > .live-image-actions")) return;
      const actions = document.createElement("div");
      actions.className = "live-image-actions";

      const updateButton = document.createElement("button");
      updateButton.type = "button";
      updateButton.textContent = "Update";
      updateButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        selectElement(image);
        updateSelectedImage();
      });

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "is-danger";
      deleteButton.textContent = imagePathToItemPath(image.dataset.liveImage) ? "Delete card" : "Delete";
      deleteButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        selectElement(image);
        deleteSelectedImage(Boolean(imagePathToItemPath(image.dataset.liveImage))).catch((error) =>
          status(error.message || "Delete failed.")
        );
      });

      actions.append(updateButton, deleteButton);
      parent.append(actions);
    });
  }

  async function requireLocalEditorServer() {
    if (!localServerReady) await checkLocalServer();
    if (localServerReady) return;
    throw new Error("Open the admin editor from the local preview server before saving or uploading.");
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

  async function deleteUploadWithLocalServer(publicPath) {
    if (!publicPath.startsWith("/assets/uploads/")) return false;
    await requireLocalEditorServer();
    const response = await fetch("/_local/delete-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: publicPath })
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Could not delete the uploaded image.");
    }
    return true;
  }

  async function saveContentFiles() {
    if (!content) return;
    await requireLocalEditorServer();
    try {
      await saveWithLocalServer();
    } catch (error) {
      if (String(error.message || "").toLowerCase().includes("login")) showLoginPanel("Please log in again to save changes.");
      throw error;
    }
    status("Saved into the project folder. Use Save + publish to update GitHub and Netlify.");
  }

  async function publishChanges() {
    await saveContentFiles();
    status("Publishing to GitHub...");
    const response = await fetch("/_local/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Update website content" })
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Publish failed.");
    }
    const result = await response.json();
    status(result.changed ? "Published to GitHub. Netlify should deploy from main." : "No changes to publish.");
  }

  async function saveImageFile(file) {
    await requireLocalEditorServer();
    const data = new FormData();
    data.append("image", file);
    const response = await fetch("/_local/upload", {
      method: "POST",
      body: data
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Could not upload the image.");
    }
    const result = await response.json();
    return result.path;
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
    await saveContentFiles();
    status("Image uploaded and saved. Use Save + publish to update GitHub and Netlify.");
  }

  async function updateSelectedImage() {
    if (!selectedElement || selectedType !== "image") {
      status("Right-click or click an image first.");
      return;
    }
    fileInput.click();
  }

  async function deleteSelectedImage(removeCard) {
    if (!selectedPath || selectedType !== "image") {
      status("Right-click or click an image first.");
      return;
    }

    const currentPath = String(getByPath(content, selectedPath) || "");
    if (currentPath.startsWith("/assets/uploads/")) {
      await deleteUploadWithLocalServer(currentPath);
    }

    const itemPath = imagePathToItemPath(selectedPath);
    const message = removeCard && itemPath ? "Work card deleted and saved." : "Image removed and saved.";
    if (removeCard && itemPath) {
      removeByPath(content, itemPath);
    } else {
      const fallbackImage =
        selectedPath === "landing.heroImageFallback" || selectedPath === "about.image"
          ? "/assets/images/hero-fallback.svg"
          : "/assets/images/placeholder-portfolio-1.svg";
      syncFieldValue(selectedPath, fallbackImage);
    }

    window.JaiwinSite.renderAll(content);
    bindEditableElements();
    clearSelection();
    selectedElement = null;
    closeImageMenu();
    await saveContentFiles();
    status(`${message} Use Save + publish to update GitHub and Netlify.`);
  }

  async function cleanupMissingUploads() {
    if (!localServerReady) {
      status("Cleanup needs the local editor server.");
      return;
    }
    const response = await fetch("/_local/cleanup-missing-uploads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Could not clean missing images.");
    }
    const result = await response.json();
    content = result.content;
    window.JaiwinSite.content = content;
    window.JaiwinSite.renderAll(content);
    bindEditableElements();
    if (result.removed.length) await saveContentFiles();
    status(result.removed.length ? `Removed ${result.removed.length} missing image card(s) and saved.` : "No missing uploaded images found.");
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
    await saveContentFiles();
    status(`Added ${created.length} image${created.length === 1 ? "" : "s"} to ${category} and saved.`);
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

  async function addWorkPost() {
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
    await saveContentFiles();
    status("New work card added and saved. Click its text or image to edit it.");
  }

  function updateColor(path, cssVar, value) {
    if (!/^#[0-9a-f]{6}$/i.test(value)) return;
    syncFieldValue(path, value);
    document.documentElement.style.setProperty(cssVar, value);
    scheduleAutosave("Saved color change into the project folder.");
  }

  function createPanel() {
    panel = document.createElement("aside");
    panel.className = "live-editor-panel";
    panel.setAttribute("aria-label", "Live website editor");

    const title = document.createElement("strong");
    title.textContent = "Admin Live Editor";

    const header = document.createElement("div");
    header.className = "live-editor-header";
    const collapseButton = button("Hide", () => {
      panel.classList.toggle("is-collapsed");
      collapseButton.textContent = panel.classList.contains("is-collapsed") ? "Show" : "Hide";
    });
    header.append(title, collapseButton);

    const topRow = document.createElement("div");
    topRow.className = "live-editor-row";

    const saveButton = button("Save changes", saveContentFiles, true);
    const publishButton = button("Save + publish", publishChanges, true);
    const addButton = button("Add work", addWorkPost);
    const cleanupButton = button("Clean missing images", cleanupMissingUploads);
    const logoutButton = button("Logout", logoutEditor);
    const adminLink = document.createElement("a");
    adminLink.className = "live-editor-link";
    adminLink.href = "/admin/";
    adminLink.textContent = "CMS";
    const exitLink = document.createElement("a");
    exitLink.className = "live-editor-link";
    exitLink.href = "/";
    exitLink.textContent = "View site";

    topRow.append(saveButton, publishButton, addButton, cleanupButton, adminLink, logoutButton, exitLink);

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
      scheduleAutosave("Saved text into the project folder.");
    });
    fieldLabel.append(fieldInput);

    imageButton = button("Upload image", () => fileInput.click());
    imageButton.disabled = true;
    deleteImageButton = button("Delete image", () => deleteSelectedImage(false), false, "is-danger");
    deleteImageButton.disabled = true;
    deleteCardButton = button("Delete work card", () => deleteSelectedImage(true), false, "is-danger");
    deleteCardButton.disabled = true;
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

    const uploadCategoryButton = button("Upload category images", () => categoryFileInput.click(), true);
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

    const imageActions = document.createElement("div");
    imageActions.className = "live-editor-row";
    imageActions.append(imageButton, deleteImageButton, deleteCardButton);

    panel.append(header, topRow, categoryGroup, selectedLabel, fieldLabel, imageActions, fileInput, colorWrap, statusBox);
    document.body.append(panel);
  }

  function showLoginPanel(message = "Log in to edit this website.") {
    if (panel) panel.remove();
    panel = null;
    document.body.classList.remove("live-edit-mode");
    if (loginPanel) loginPanel.remove();

    loginPanel = document.createElement("form");
    loginPanel.className = "live-login-panel";
    loginPanel.innerHTML = `
      <h2>Website editor login</h2>
      <p>${message}</p>
      <label>Email
        <input name="email" type="email" autocomplete="username" required />
      </label>
      <label>Password
        <input name="password" type="password" autocomplete="current-password" required />
      </label>
      <div class="live-editor-row">
        <button class="live-editor-button is-primary" type="submit">Login</button>
        <a class="live-editor-link" href="/">View site</a>
      </div>
      <p class="live-editor-status">Only the website owner can edit.</p>
    `;
    document.body.append(loginPanel);

    loginPanel.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(loginPanel);
      const statusLine = loginPanel.querySelector(".live-editor-status");
      statusLine.textContent = "Checking login...";
      try {
        const response = await fetch("/_local/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.get("email"),
            password: data.get("password")
          })
        });
        if (!response.ok) throw new Error(await response.text());
        loginPanel.remove();
        loginPanel = null;
        initEditor(content);
      } catch (error) {
        statusLine.textContent = error.message || "Login failed.";
      }
    });
  }

  async function logoutEditor() {
    await fetch("/_local/auth/logout", { method: "POST" });
    showLoginPanel("Logged out. Log in again to edit.");
  }

  function button(label, action, primary = false, extraClass = "") {
    const element = document.createElement("button");
    element.type = "button";
    element.className = `live-editor-button${primary ? " is-primary" : ""}${extraClass ? ` ${extraClass}` : ""}`;
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

    document.addEventListener("contextmenu", (event) => {
      const target = event.target.closest("[data-live-image]");
      if (!target || panel?.contains(target)) return;
      event.preventDefault();
      event.stopPropagation();
      selectElement(target);
      openImageMenu(event.clientX, event.clientY);
    });

    document.addEventListener("pointerdown", (event) => {
      if (event.button !== 2) return;
      const target = event.target.closest("[data-live-image]");
      if (!target || panel?.contains(target)) return;
      event.preventDefault();
      event.stopPropagation();
      selectElement(target);
      openImageMenu(event.clientX, event.clientY);
    });

    document.addEventListener("click", (event) => {
      if (imageMenu && !imageMenu.contains(event.target)) closeImageMenu();
    });

    document.addEventListener("input", (event) => {
      const target = event.target.closest("[data-live-text]");
      if (!target || panel?.contains(target)) return;
      const path = target.dataset.liveText;
      const value = getTextFromElement(target);
      syncFieldValue(path, value);
      if (target === selectedElement && fieldInput) fieldInput.value = value;
      scheduleAutosave("Saved text into the project folder.");
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

  function openImageMenu(x, y) {
    closeImageMenu();
    imageMenu = document.createElement("div");
    imageMenu.className = "live-image-menu";

    const updateButton = document.createElement("button");
    updateButton.type = "button";
    updateButton.textContent = "Update image";
    updateButton.addEventListener("click", () => {
      closeImageMenu();
      updateSelectedImage();
    });

    const deleteImageButton = document.createElement("button");
    deleteImageButton.type = "button";
    deleteImageButton.className = "is-danger";
    deleteImageButton.textContent = "Delete image only";
    deleteImageButton.addEventListener("click", () => {
      deleteSelectedImage(false).catch((error) => status(error.message || "Delete failed."));
    });

    const deleteCardButton = document.createElement("button");
    deleteCardButton.type = "button";
    deleteCardButton.className = "is-danger";
    deleteCardButton.textContent = imagePathToItemPath(selectedPath) ? "Delete work card" : "Clear this image";
    deleteCardButton.addEventListener("click", () => {
      deleteSelectedImage(true).catch((error) => status(error.message || "Delete failed."));
    });

    imageMenu.append(updateButton, deleteImageButton, deleteCardButton);
    document.body.append(imageMenu);

    const rect = imageMenu.getBoundingClientRect();
    const left = Math.min(x, window.innerWidth - rect.width - 10);
    const top = Math.min(y, window.innerHeight - rect.height - 10);
    imageMenu.style.left = `${Math.max(10, left)}px`;
    imageMenu.style.top = `${Math.max(10, top)}px`;
  }

  async function initEditor(loadedContent) {
    content = loadedContent;
    const auth = await checkEditorAuth();
    if (!auth.authenticated) {
      showLoginPanel(auth.configured ? "Log in to edit this website." : "Editor login is not configured on this device.");
      return;
    }
    document.body.classList.add("live-edit-mode");
    bindEditableElements();
    createPanel();
    bindEvents();
    const server = await checkLocalServer();
    if (server?.ok) {
      status(server.remote ? "Live editor ready. Local saving and uploads are active." : "Live editor ready. Uploads work locally; GitHub remote is not attached yet.");
    } else {
      status("The local editor server is not connected yet. Open this page from the local preview before saving or uploading.");
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
