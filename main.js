"use strict";

const CONTENT_PATHS = Object.freeze({
  siteSettings: "content/site-settings.json",
  landing: "content/landing.json",
  services: "content/services.json",
  portfolio: "content/portfolio.json",
  about: "content/about.json",
  contact: "content/contact.json",
  process: "content/process.json",
  homepageSections: "content/homepage-sections.json"
});

const FALLBACK_DATA = Object.freeze({
  siteSettings: {
    businessName: "Jaiwin Design Studio",
    logoMarkText: "JD",
    logoText: "Jaiwin Design Studio",
    loaderEyebrow: "Creative studio loading",
    phone: "+91 95975 51805",
    whatsappNumber: "+91 95975 51805",
    email: "jaiwindesignstudio@gmail.com",
    instagramHandle: "@jaiwindesignstudio",
    instagramUrl: "https://www.instagram.com/jaiwindesignstudio/",
    location: "Lionstown, Thoothukudi",
    locationLabel: "LOC",
    fullAddress: "359/66, 2nd Street, Mini Sahaya Puram, Lionstown, Thoothukudi - 628001",
    navLinks: [
      { label: "About", url: "#about" },
      { label: "Services", url: "#services" },
      { label: "Portfolio", url: "#portfolio" },
      { label: "Process", url: "#process" },
      { label: "Contact", url: "#contact" }
    ],
    navCtaLabel: "WhatsApp",
    footerText: "Designed for moments that deserve to be remembered clearly, colorfully, and beautifully.",
    footerCreditText: "Jaiwin Design Studio. Designed for Jaiwin Design Studio.",
    seoTitle: "Jaiwin Design Studio | Creative Design Studio in Thoothukudi",
    seoDescription:
      "Premium banners, flex designs, invitations, photo gifts, frames, photography, branding, and web design in Lionstown, Thoothukudi.",
    backgroundColor: "#07081d",
    surfaceColor: "#10143a",
    textColor: "#ffffff",
    mutedTextColor: "#b9c0dc",
    primaryBrandColor: "#8f42ff",
    secondaryBrandColor: "#ff4fb7",
    highlightColor: "#23d9ff"
  },
  landing: {
    eyebrowText: "Premium creative design studio in Thoothukudi",
    mainHeadline: "Designs That Make Your Moments",
    highlightedHeadlineWord: "Unforgettable",
    subheadline:
      "From vibrant flex banners and invitations to brand visuals, photo gifts, frames, and web design - Jaiwin Design Studio brings your ideas to life with color, clarity, and creativity.",
    primaryCtaLabel: "View Portfolio",
    primaryCtaLink: "#portfolio",
    secondaryCtaLabel: "Contact on WhatsApp",
    secondaryCtaLink: "whatsapp",
    heroImageFallback: "/assets/images/hero-fallback.svg",
    heroImageAlt: "Colorful abstract creative studio display",
    heroCardEyebrow: "Print",
    heroCardTitle: "Ready",
    heroCardText: "Digital + flex artwork",
    threeDMode: "custom-three"
  },
  services: {
    enabled: true,
    sectionKicker: "Services",
    heading: "Design services for every visual need.",
    subheading: "Colorful, print-ready, and digital-ready creative work for events, brands, businesses, and families.",
    featuredLabel: "Featured",
    items: [
      {
        name: "Graphic Designing",
        description: "Polished visual layouts for announcements, promotions, brands, and special occasions.",
        iconName: "palette",
        featured: true
      },
      {
        name: "Banner / Flex",
        description: "High-impact flex artwork prepared with clean spacing, readable text, and print clarity.",
        iconName: "banner",
        featured: true
      },
      {
        name: "Photo Frames / Gifts",
        description: "Personalized keepsakes, frames, and gifting designs made with care.",
        iconName: "gift",
        featured: false
      },
      {
        name: "Photography",
        description: "Event and product photography support for memorable visuals.",
        iconName: "camera",
        featured: false
      }
    ]
  },
  portfolio: {
    enabled: true,
    sectionKicker: "Portfolio",
    heading: "Recent visual stories.",
    subheading: "Featured posters, banners, flyers, and digital designs rendered directly from CMS content.",
    ctaLabel: "Start a project",
    ctaLink: "#contact",
    featuredLabel: "Featured",
    videoLabel: "Watch video",
    items: [
      {
        title: "Beach Legends Premier League Sports Banner",
        description: "A bold coastal sports banner with tournament energy, team hierarchy, and vivid action color.",
        category: "Sports Banner",
        image: "/assets/images/placeholder-portfolio-1.svg",
        videoUpload: "",
        externalVideoUrl: "",
        featured: true,
        altText: "Beach Legends Premier League sports banner design"
      },
      {
        title: "Jai Sports Badminton Tournament Flyer",
        description: "A fast, social-ready tournament flyer with court-inspired motion and clean event details.",
        category: "Sports Flyer",
        image: "/assets/images/placeholder-portfolio-2.svg",
        videoUpload: "",
        externalVideoUrl: "",
        featured: true,
        altText: "Jai Sports Badminton Tournament flyer design"
      },
      {
        title: "21st Birthday Commemorative Poster",
        description: "A premium birthday poster with portrait focus, soft glow, and celebration-ready typography.",
        category: "Event Poster",
        image: "/assets/images/placeholder-portfolio-3.svg",
        videoUpload: "",
        externalVideoUrl: "",
        featured: true,
        altText: "21st birthday commemorative poster design"
      }
    ]
  },
  about: {
    enabled: true,
    sectionKicker: "About the studio",
    heading: "Color, craft, and clarity for every celebration.",
    highlightText:
      "Local studio energy with premium design polish - built for personal events, shops, campaigns, sports, and brands.",
    image: "/assets/images/hero-fallback.svg",
    imageAlt: "Jaiwin Design Studio creative workspace",
    paragraphs: [
      "Jaiwin Design Studio is a creative design studio in Lionstown, Thoothukudi, helping customers turn ideas into vibrant visuals for print, digital sharing, and memorable gifting.",
      "The studio creates banners, flex designs, invitations, cards, frames, photo gifts, photography visuals, logo design, posters, resumes, lamination work, and web design with a clear focus on readability and finish.",
      "Whether it is a wedding banner, sports event, shop promotion, memorial design, birthday poster, or brand visual, every design is shaped to feel personal, polished, and ready to use."
    ],
    stats: [
      { value: "18+", label: "Creative services" },
      { value: "100%", label: "Editable website content" },
      { value: "Local", label: "Thoothukudi studio support" }
    ]
  },
  contact: {
    enabled: true,
    sectionKicker: "Contact",
    heading: "Tell us what you want to create.",
    subheading:
      "Share your event, shop, brand, or gifting idea and Jaiwin Design Studio will help shape it into a polished visual.",
    whatsappCtaText: "WhatsApp",
    emailCtaText: "Email",
    instagramCtaText: "Instagram",
    address: "359/66, 2nd Street, Mini Sahaya Puram, Lionstown, Thoothukudi - 628001",
    mapCtaText: "Open map",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Jaiwin%20Design%20Studio%20Lionstown%20Thoothukudi",
    businessHours: "Open Monday to Saturday, 9:30 AM - 8:30 PM",
    nameLabel: "Your name",
    phoneLabel: "Phone or WhatsApp",
    projectTypeLabel: "Project type",
    projectTypePlaceholder: "Select one",
    projectTypeOptions: ["Banner / Flex", "Invitation / Card", "Logo / Branding", "Photography", "Web Design", "Other Design Work"],
    messageLabel: "Message",
    messagePlaceholder: "Tell us your event, size, date, and design idea.",
    submitLabel: "Send enquiry",
    contactFormSuccessMessage: "Thank you. We will reply soon with the next step."
  },
  process: {
    enabled: true,
    sectionKicker: "Process",
    heading: "A simple path from idea to finished design.",
    subheading: "Clear previews, easy corrections, and final files ready for use.",
    steps: [
      {
        title: "Share Your Idea",
        description: "Send the occasion, content, size, photos, references, and deadline."
      },
      {
        title: "Design Preview",
        description: "Review a polished draft prepared for your event, brand, or print need."
      },
      {
        title: "Final Corrections",
        description: "Request small edits so the layout, names, dates, and details are accurate."
      },
      {
        title: "Print / Delivery / Digital Handover",
        description: "Receive final artwork for printing, sharing, or studio production."
      }
    ]
  },
  homepageSections: {
    enabled: true,
    sectionKicker: "Why choose us",
    highlightsHeading: "Sharp ideas, quick delivery, polished output.",
    highlightsSubheading: "Every detail is prepared to look strong on screen and in print.",
    highlights: [
      {
        title: "Fast Turnaround",
        description: "Quick design support for events, shop needs, and urgent announcements.",
        iconName: "speed"
      },
      {
        title: "Creative Custom Designs",
        description: "Layouts made around your words, photos, style, and occasion.",
        iconName: "spark"
      },
      {
        title: "Print-Ready Quality",
        description: "Artwork prepared with practical sizing, clarity, and production needs in mind.",
        iconName: "print"
      },
      {
        title: "Local Trusted Studio",
        description: "Easy communication and nearby support from Lionstown, Thoothukudi.",
        iconName: "local"
      },
      {
        title: "Social Media Friendly Designs",
        description: "Posters and flyers that work beautifully on WhatsApp, Instagram, and screens.",
        iconName: "social"
      },
      {
        title: "Wedding & Event Specialists",
        description: "Memorable banners, cards, and celebration designs with a polished finish.",
        iconName: "event"
      }
    ]
  }
});

const state = {
  reduceMotion: false,
  isTouch: false,
  isMobile: false,
  lowPower: false,
  heroStarted: false,
  distortionStarted: false,
  threeDMode: "custom-three"
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const coarsePointer = window.matchMedia("(pointer: coarse)");
const mobileQuery = window.matchMedia("(max-width: 767px)");

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $$(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value, fallback = "#") {
  const raw = String(value ?? "").trim();
  if (!raw) return fallback;
  if (raw.startsWith("#") || raw.startsWith("/") || raw.startsWith("./") || raw.startsWith("../")) {
    return raw;
  }

  try {
    const parsed = new URL(raw, window.location.origin);
    const allowed = ["http:", "https:", "mailto:", "tel:"];
    return allowed.includes(parsed.protocol) ? parsed.href : fallback;
  } catch {
    return fallback;
  }
}

function setText(selector, value, root = document) {
  const element = $(selector, root);
  if (element) element.textContent = String(value ?? "");
}

function setHTML(selector, html, root = document) {
  const element = $(selector, root);
  if (element) element.innerHTML = html;
}

function setAttr(selector, attr, value, root = document) {
  const element = $(selector, root);
  if (element && value) element.setAttribute(attr, String(value));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function enabled(value) {
  return value !== false;
}

function toggleSection(selector, value) {
  const element = $(selector);
  if (element) element.hidden = !enabled(value);
}

function iconLabel(iconName, fallbackText) {
  const source = String(iconName || fallbackText || "JD").replace(/[^a-z0-9]/gi, "");
  return (source.slice(0, 2) || "JD").toUpperCase();
}

function normalizePhone(number) {
  return String(number || "").replace(/[^\d+]/g, "");
}

function normalizeWhatsApp(number) {
  const digits = String(number || "").replace(/\D/g, "");
  if (!digits) return "919597551805";
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function getWhatsAppUrl(settings) {
  return `https://wa.me/${normalizeWhatsApp(settings.whatsappNumber || settings.phone)}`;
}

function applyBrandColor(cssVar, value) {
  const color = String(value || "").trim();
  if (/^#[0-9a-f]{3,8}$/i.test(color)) {
    document.documentElement.style.setProperty(cssVar, color);
  }
}

function renderNavigation(settings, whatsappUrl) {
  const menu = $("#site-menu");
  if (!menu) return;

  const fallbackLinks = FALLBACK_DATA.siteSettings.navLinks;
  const links = asArray(settings.navLinks).length ? settings.navLinks : fallbackLinks;
  const navItems = links
    .filter((link) => link?.label)
    .map(
      (link) =>
        `<a class="magnetic" href="${escapeHTML(safeUrl(link.url, "#home"))}">${escapeHTML(link.label)}</a>`
    )
    .join("");

  const ctaLabel = settings.navCtaLabel || FALLBACK_DATA.siteSettings.navCtaLabel;
  menu.innerHTML = `${navItems}
    <a class="nav-cta magnetic" href="${escapeHTML(whatsappUrl)}" data-whatsapp-link rel="noopener noreferrer">
      ${escapeHTML(ctaLabel)}
    </a>`;
}

function setMeta(selector, value) {
  const element = $(selector);
  if (element && value) element.setAttribute("content", String(value));
}

async function loadJSON(path, fallback) {
  try {
    const response = await fetch(path, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Unable to load ${path}`);
    return await response.json();
  } catch (error) {
    console.warn(error.message);
    return typeof structuredClone === "function" ? structuredClone(fallback) : JSON.parse(JSON.stringify(fallback));
  }
}

async function loadAllContent() {
  const entries = await Promise.all(
    Object.entries(CONTENT_PATHS).map(async ([key, path]) => [key, await loadJSON(path, FALLBACK_DATA[key])])
  );
  return Object.fromEntries(entries);
}

function renderSiteSettings(settings, servicesData) {
  const whatsappUrl = getWhatsAppUrl(settings);
  const phoneHref = `tel:${normalizePhone(settings.phone)}`;
  const emailHref = `mailto:${settings.email || FALLBACK_DATA.siteSettings.email}`;
  const instagramUrl = safeUrl(settings.instagramUrl, FALLBACK_DATA.siteSettings.instagramUrl);
  const businessName = settings.businessName || FALLBACK_DATA.siteSettings.businessName;
  const logoText = settings.logoText || businessName;
  const servicesSummary = asArray(servicesData?.items)
    .slice(0, 8)
    .map((item) => item.name)
    .filter(Boolean)
    .join(", ");

  applyBrandColor("--primary", settings.primaryBrandColor);
  applyBrandColor("--secondary", settings.secondaryBrandColor);
  applyBrandColor("--bg", settings.backgroundColor);
  applyBrandColor("--bg-2", settings.surfaceColor);
  applyBrandColor("--ink", settings.textColor);
  applyBrandColor("--muted", settings.mutedTextColor);
  applyBrandColor("--cyan", settings.highlightColor);

  document.title = settings.seoTitle || FALLBACK_DATA.siteSettings.seoTitle;
  setMeta('meta[name="description"]', settings.seoDescription);
  setMeta('meta[property="og:title"]', settings.seoTitle);
  setMeta('meta[property="og:description"]', settings.seoDescription);

  renderNavigation(settings, whatsappUrl);
  setText("[data-loader-eyebrow]", settings.loaderEyebrow || FALLBACK_DATA.siteSettings.loaderEyebrow);
  setText("[data-loader-name]", businessName);
  setText("[data-logo-text]", logoText);
  setText("[data-site-location]", settings.location);
  setText("[data-location-label]", settings.locationLabel || FALLBACK_DATA.siteSettings.locationLabel);
  setText("[data-footer-business]", businessName);
  setText("[data-footer-text]", settings.footerText);
  setText("[data-footer-services]", servicesSummary || "Graphic design, banners, invitations, frames, gifts, photography, branding, and web design.");
  setText("[data-footer-phone]", settings.phone);
  setText("[data-footer-email]", settings.email);
  setText("[data-footer-instagram]", settings.instagramHandle);
  setAttr("[data-footer-phone]", "href", phoneHref);
  setAttr("[data-footer-email]", "href", emailHref);
  setAttr("[data-footer-instagram]", "href", instagramUrl);

  $$("[data-whatsapp-link]").forEach((link) => {
    link.href = whatsappUrl;
  });

  const contactEmail = $("[data-contact-email]");
  if (contactEmail) contactEmail.href = emailHref;

  const contactInstagram = $("[data-contact-instagram]");
  if (contactInstagram) contactInstagram.href = instagramUrl;

  const brandMarkText =
    settings.logoMarkText ||
    businessName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  $$(".brand__mark").forEach((mark) => {
    mark.textContent = brandMarkText || "JD";
  });

  setHTML(
    "[data-footer-credit]",
    `<span data-current-year>${new Date().getFullYear()}</span> ${escapeHTML(
      settings.footerCreditText || FALLBACK_DATA.siteSettings.footerCreditText
    )}`
  );
}

function renderLanding(landing, settings) {
  const whatsappUrl = getWhatsAppUrl(settings);
  state.threeDMode = landing.threeDMode || "custom-three";
  setText("[data-landing-eyebrow]", landing.eyebrowText);
  setText("[data-landing-headline]", landing.mainHeadline);
  setText("[data-landing-highlight]", landing.highlightedHeadlineWord);
  setText("[data-landing-subheadline]", landing.subheadline);

  const primary = $("[data-primary-cta]");
  if (primary) {
    primary.href = safeUrl(landing.primaryCtaLink, "#portfolio");
    primary.querySelector("span").textContent = landing.primaryCtaLabel || "View Portfolio";
  }

  const secondary = $("[data-secondary-cta]");
  if (secondary) {
    const link = String(landing.secondaryCtaLink || "").toLowerCase() === "whatsapp" ? whatsappUrl : safeUrl(landing.secondaryCtaLink, whatsappUrl);
    secondary.href = link;
    secondary.querySelector("span").textContent = landing.secondaryCtaLabel || "Contact on WhatsApp";
  }

  const fallbackImage = $("[data-hero-fallback]");
  if (fallbackImage) {
    fallbackImage.src = safeUrl(landing.heroImageFallback, "/assets/images/hero-fallback.svg");
    fallbackImage.alt = landing.heroImageAlt || FALLBACK_DATA.landing.heroImageAlt;
  }

  setText("[data-hero-card-eyebrow]", landing.heroCardEyebrow || FALLBACK_DATA.landing.heroCardEyebrow);
  setText("[data-hero-card-title]", landing.heroCardTitle || FALLBACK_DATA.landing.heroCardTitle);
  setText("[data-hero-card-text]", landing.heroCardText || FALLBACK_DATA.landing.heroCardText);
}

function renderServices(services) {
  toggleSection("#services", services.enabled);
  setText("[data-services-kicker]", services.sectionKicker || FALLBACK_DATA.services.sectionKicker);
  setText("[data-services-heading]", services.heading);
  setText("[data-services-subheading]", services.subheading);

  const items = asArray(services.items);
  const featuredLabel = services.featuredLabel || FALLBACK_DATA.services.featuredLabel;
  const html = items
    .map((item) => {
      const featured = Boolean(item.featured);
      return `
        <article class="service-card${featured ? " is-featured" : ""}" data-tilt-card>
          <span class="service-card__icon" aria-hidden="true">${escapeHTML(iconLabel(item.iconName, item.name))}</span>
          <h3>${escapeHTML(item.name)}</h3>
          <p>${escapeHTML(item.description)}</p>
          ${featured ? `<span class="service-card__tag">${escapeHTML(featuredLabel)}</span>` : ""}
        </article>
      `;
    })
    .join("");

  setHTML("#services-grid", html);
}

function renderPortfolio(portfolio) {
  toggleSection("#portfolio", portfolio.enabled);
  setText("[data-portfolio-kicker]", portfolio.sectionKicker || FALLBACK_DATA.portfolio.sectionKicker);
  setText("[data-portfolio-heading]", portfolio.heading);
  setText("[data-portfolio-subheading]", portfolio.subheading);

  const cta = $("[data-portfolio-cta]");
  if (cta) {
    cta.href = safeUrl(portfolio.ctaLink, "#contact");
    cta.textContent = portfolio.ctaLabel || FALLBACK_DATA.portfolio.ctaLabel;
  }

  const items = asArray(portfolio.items);
  const featuredLabel = portfolio.featuredLabel || FALLBACK_DATA.portfolio.featuredLabel;
  const videoLabel = portfolio.videoLabel || FALLBACK_DATA.portfolio.videoLabel;
  const html = items
    .map((item) => {
      const image = safeUrl(item.image, "/assets/images/placeholder-portfolio-1.svg");
      const alt = escapeHTML(item.altText || item.title || "Jaiwin Design Studio portfolio item");
      const videoHref = safeUrl(item.externalVideoUrl || item.videoUpload || "", "");
      const hasVideo = Boolean(videoHref);
      const rawPostedDate = item.postedDate ? new Date(item.postedDate) : null;
      const postedDate =
        rawPostedDate && !Number.isNaN(rawPostedDate.getTime())
          ? rawPostedDate.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })
          : "";
      return `
        <article class="portfolio-card magnetic" data-tilt-card>
          <div class="portfolio-card__media">
            <img class="portfolio-image" src="${escapeHTML(image)}" alt="${alt}" loading="lazy" decoding="async" />
          </div>
          <div class="portfolio-card__body">
            <div class="portfolio-card__meta">
              <span class="portfolio-card__category">${escapeHTML(item.category || "Design")}</span>
              ${item.featured ? `<span class="portfolio-card__badge">${escapeHTML(featuredLabel)}</span>` : ""}
            </div>
            ${postedDate ? `<p class="portfolio-card__date">${escapeHTML(postedDate)}</p>` : ""}
            <h3>${escapeHTML(item.title)}</h3>
            <p>${escapeHTML(item.description)}</p>
            ${
              hasVideo
                ? `<a class="portfolio-card__video" href="${escapeHTML(videoHref)}" rel="noopener noreferrer">${escapeHTML(videoLabel)}</a>`
                : ""
            }
          </div>
        </article>
      `;
    })
    .join("");

  setHTML("#portfolio-grid", html);
}

function renderAbout(about) {
  toggleSection("#about", about.enabled);
  setText("[data-about-kicker]", about.sectionKicker || FALLBACK_DATA.about.sectionKicker);
  setText("[data-about-heading]", about.heading);
  setText("[data-about-highlight]", about.highlightText);
  setAttr("[data-about-image]", "src", safeUrl(about.image, "/assets/images/hero-fallback.svg"));
  setAttr("[data-about-image]", "alt", about.imageAlt || FALLBACK_DATA.about.imageAlt);

  const paragraphHTML = asArray(about.paragraphs)
    .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
    .join("");
  setHTML("[data-about-paragraphs]", paragraphHTML);

  const statsHTML = asArray(about.stats)
    .map(
      (stat) => `
        <div class="stat-card">
          <strong>${escapeHTML(stat.value)}</strong>
          <span>${escapeHTML(stat.label)}</span>
        </div>
      `
    )
    .join("");
  setHTML("[data-about-stats]", statsHTML);
}

function renderContact(contact, settings) {
  toggleSection("#contact", contact.enabled);
  const whatsappUrl = getWhatsAppUrl(settings);
  const emailHref = `mailto:${settings.email || FALLBACK_DATA.siteSettings.email}`;
  setText("[data-contact-kicker]", contact.sectionKicker || FALLBACK_DATA.contact.sectionKicker);
  setText("[data-contact-heading]", contact.heading);
  setText("[data-contact-subheading]", contact.subheading);
  setText("[data-contact-address]", contact.address || settings.fullAddress);
  setText("[data-business-hours]", contact.businessHours);
  setText("[data-form-success]", contact.contactFormSuccessMessage);
  setAttr("[data-contact-whatsapp]", "href", whatsappUrl);
  setAttr("[data-contact-email]", "href", emailHref);
  setAttr("[data-map-link]", "href", safeUrl(contact.mapLink, "#contact"));

  const whatsappLabel = $("[data-contact-whatsapp] strong");
  const emailLabel = $("[data-contact-email] strong");
  if (whatsappLabel) whatsappLabel.textContent = contact.whatsappCtaText || "WhatsApp";
  if (emailLabel) emailLabel.textContent = contact.emailCtaText || "Email";

  setText("[data-contact-instagram-label]", contact.instagramCtaText || FALLBACK_DATA.contact.instagramCtaText);
  setText("[data-map-link]", contact.mapCtaText || FALLBACK_DATA.contact.mapCtaText);
  setText("[data-contact-name-label]", contact.nameLabel || FALLBACK_DATA.contact.nameLabel);
  setText("[data-contact-phone-label]", contact.phoneLabel || FALLBACK_DATA.contact.phoneLabel);
  setText("[data-contact-project-type-label]", contact.projectTypeLabel || FALLBACK_DATA.contact.projectTypeLabel);
  setText("[data-contact-message-label]", contact.messageLabel || FALLBACK_DATA.contact.messageLabel);
  setAttr("[name='message']", "placeholder", contact.messagePlaceholder || FALLBACK_DATA.contact.messagePlaceholder);
  setText("[data-contact-submit]", contact.submitLabel || FALLBACK_DATA.contact.submitLabel);

  const select = $("[name='project-type']");
  if (select) {
    const options = asArray(contact.projectTypeOptions).length ? contact.projectTypeOptions : FALLBACK_DATA.contact.projectTypeOptions;
    const placeholder = contact.projectTypePlaceholder || FALLBACK_DATA.contact.projectTypePlaceholder;
    select.innerHTML = `<option value="">${escapeHTML(placeholder)}</option>${options
      .filter(Boolean)
      .map((option) => `<option>${escapeHTML(option)}</option>`)
      .join("")}`;
  }
}

function renderProcess(processData) {
  toggleSection("#process", processData.enabled);
  setText("[data-process-kicker]", processData.sectionKicker || FALLBACK_DATA.process.sectionKicker);
  setText("[data-process-heading]", processData.heading);
  setText("[data-process-subheading]", processData.subheading);

  const html = asArray(processData.steps)
    .map(
      (step, index) => `
        <article class="process-card" data-tilt-card>
          <span class="process-card__index">${String(index + 1).padStart(2, "0")}</span>
          <h3>${escapeHTML(step.title)}</h3>
          <p>${escapeHTML(step.description)}</p>
        </article>
      `
    )
    .join("");

  setHTML("[data-process-list]", html);
}

function renderHomepageSections(sections) {
  toggleSection("#highlights", sections.enabled);
  setText("[data-highlights-kicker]", sections.sectionKicker || FALLBACK_DATA.homepageSections.sectionKicker);
  setText("[data-highlights-heading]", sections.highlightsHeading);
  setText("[data-highlights-subheading]", sections.highlightsSubheading);

  const html = asArray(sections.highlights)
    .map(
      (item) => `
        <article class="highlight-card" data-tilt-card>
          <span class="highlight-card__icon" aria-hidden="true">${escapeHTML(iconLabel(item.iconName, item.title))}</span>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.description)}</p>
        </article>
      `
    )
    .join("");

  setHTML("[data-highlights-grid]", html);
}

function renderAll(content) {
  renderSiteSettings(content.siteSettings, content.services);
  renderLanding(content.landing, content.siteSettings);
  renderAbout(content.about);
  renderServices(content.services);
  renderPortfolio(content.portfolio);
  renderHomepageSections(content.homepageSections);
  renderProcess(content.process);
  renderContact(content.contact, content.siteSettings);
  setText("[data-current-year]", new Date().getFullYear());
}

function initReducedMotionSupport() {
  state.reduceMotion = prefersReducedMotion.matches;
  document.body.classList.toggle("reduce-motion", state.reduceMotion);

  prefersReducedMotion.addEventListener("change", (event) => {
    state.reduceMotion = event.matches;
    document.body.classList.toggle("reduce-motion", state.reduceMotion);
  });
}

function refreshPerformanceFlags() {
  state.isTouch = coarsePointer.matches || "ontouchstart" in window;
  state.isMobile = mobileQuery.matches;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  state.lowPower = Boolean(connection?.saveData) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
  document.body.classList.toggle("is-touch", state.isTouch);
  document.body.classList.toggle("is-mobile", state.isMobile);
  document.body.classList.toggle("is-low-power", state.lowPower);
}

function initPerformanceSafeguards() {
  refreshPerformanceFlags();
  mobileQuery.addEventListener("change", refreshPerformanceFlags);
  coarsePointer.addEventListener("change", refreshPerformanceFlags);
}

function initLoader() {
  const loader = $("#loader");
  const startedAt = Date.now();
  return function completeLoader() {
    if (!loader) return;
    const delay = Math.max(0, 620 - (Date.now() - startedAt));
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
    }, delay);
  };
}

function initSmartHeader() {
  const header = $("[data-header]");
  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function initMobileMenu() {
  const toggle = $(".menu-toggle");
  const menu = $("#site-menu");
  if (!toggle || !menu) return;

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    menu.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  $$("a", menu).forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function initCursor() {
  const cursor = $("#custom-cursor");
  if (!cursor || state.isTouch || state.reduceMotion) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  const render = () => {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    window.requestAnimationFrame(render);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.classList.add("is-visible");
    },
    { passive: true }
  );

  document.addEventListener("pointerover", (event) => {
    if (event.target.closest("a, button, input, textarea, select, .portfolio-card, .service-card, .highlight-card, .process-card, img")) {
      cursor.classList.add("is-active");
    }
  });

  document.addEventListener("pointerout", (event) => {
    if (event.target.closest("a, button, input, textarea, select, .portfolio-card, .service-card, .highlight-card, .process-card, img")) {
      cursor.classList.remove("is-active");
    }
  });

  render();
}

function initMagneticElements() {
  if (state.isTouch || state.reduceMotion) return;

  $$(".magnetic, .portfolio-card, .service-card, .contact-link").forEach((element) => {
    if (element.dataset.magneticReady === "true") return;
    element.dataset.magneticReady = "true";

    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      const strength = element.classList.contains("portfolio-card") ? 0.05 : 0.18;
      const nextX = x * strength;
      const nextY = y * strength;
      if (window.gsap) {
        window.gsap.to(element, { x: nextX, y: nextY, duration: 0.35, ease: "power3.out" });
      } else {
        element.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
      }
    });

    element.addEventListener("pointerleave", () => {
      if (window.gsap) {
        window.gsap.to(element, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.55, ease: "elastic.out(1, 0.45)" });
      } else {
        element.style.transform = "";
      }
    });
  });
}

function initTiltCards() {
  if (state.isTouch || state.reduceMotion || state.lowPower) return;

  $$("[data-tilt-card]").forEach((card) => {
    if (card.dataset.tiltReady === "true") return;
    card.dataset.tiltReady = "true";

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 5;
      const rotateX = (0.5 - py) * 5;
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
      card.style.setProperty("--tilt-x", `${(px - 0.5) * 10}px`);
      card.style.setProperty("--tilt-y", `${(py - 0.5) * 10}px`);
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
      card.style.transform = "";
    });
  });
}

function initScrollAnimations() {
  if (state.reduceMotion || !window.gsap) return;

  const gsap = window.gsap;
  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
  }

  gsap.from(".reveal-line", {
    y: 34,
    opacity: 0,
    duration: 0.95,
    ease: "power3.out",
    stagger: 0.1,
    delay: 0.12
  });

  const revealGroups = [
    { selector: ".section-heading", trigger: ".about" },
    { selector: ".about__media, .about__content", trigger: ".about" },
    { selector: ".service-card", trigger: "#services" },
    { selector: ".portfolio-card", trigger: "#portfolio" },
    { selector: ".highlight-card", trigger: "#highlights" },
    { selector: ".process-card", trigger: "#process" },
    { selector: ".contact__panel", trigger: "#contact" },
    { selector: ".site-footer", trigger: ".site-footer" }
  ];

  revealGroups.forEach((group) => {
    const elements = $$(group.selector);
    if (!elements.length) return;
    gsap.from(elements, {
      scrollTrigger: window.ScrollTrigger
        ? {
            trigger: group.trigger,
            start: "top 78%",
            once: true
          }
        : undefined,
      y: 42,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.07
    });
  });
}

function initParallax() {
  if (state.isMobile || state.reduceMotion || state.lowPower || !window.gsap || !window.ScrollTrigger) return;

  window.gsap.utils.toArray("[data-parallax]").forEach((layer) => {
    const speed = Number(layer.dataset.speed || 0.1);
    window.gsap.to(layer, {
      y: () => window.innerHeight * speed,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });
  });
}

function initImageDistortions() {
  if (state.distortionStarted || state.isMobile || state.isTouch || state.reduceMotion || state.lowPower) return;
  state.distortionStarted = true;

  $$(".portfolio-card").forEach((card) => {
    card.addEventListener(
      "pointermove",
      (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
      },
      { passive: true }
    );
  });

  try {
    if (window.Shery && typeof window.Shery.imageEffect === "function") {
      window.Shery.imageEffect(".portfolio-card__media", {
        style: 5,
        gooey: true,
        config: {
          a: { value: 1.2 },
          b: { value: -0.85 },
          zindex: { value: 2 },
          aspect: { value: 1.33 },
          ignoreShapeAspect: { value: true },
          shapePosition: { value: { x: 0, y: 0 } },
          shapeScale: { value: { x: 0.5, y: 0.5 } },
          shapeEdgeSoftness: { value: 0.18 },
          onMouse: { value: 1 },
          noise_speed: { value: 0.64 },
          metaball: { value: 0.18 },
          discard_threshold: { value: 0.46 },
          antialias_threshold: { value: 0.02 }
        }
      });
    }
  } catch (error) {
    console.warn("Shery image effect skipped:", error.message);
  }
}

function initHero3D() {
  if (state.heroStarted) return;
  state.heroStarted = true;

  const canvas = $("#hero-canvas");
  const visual = $("[data-hero-visual]");
  if (!canvas || !visual) return;

  const THREE = window.THREE;
  const shouldFallback = state.threeDMode === "fallback" || state.isMobile || state.reduceMotion || state.lowPower || !THREE;
  visual.classList.toggle("is-fallback", shouldFallback);
  if (shouldFallback) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.28, 6.2);

  const group = new THREE.Group();
  scene.add(group);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.18, 3),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.22,
      clearcoat: 0.75,
      clearcoatRoughness: 0.24,
      emissive: 0x3e6dff,
      emissiveIntensity: 0.12
    })
  );
  group.add(core);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x23d9ff,
    transparent: true,
    opacity: 0.68,
    side: THREE.DoubleSide
  });

  const ringOne = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.018, 18, 160), ringMaterial);
  ringOne.rotation.x = Math.PI / 2.6;
  ringOne.rotation.y = Math.PI / 6;
  group.add(ringOne);

  const ringTwo = new THREE.Mesh(
    new THREE.TorusGeometry(2.12, 0.014, 18, 180),
    new THREE.MeshBasicMaterial({ color: 0xff4fb7, transparent: true, opacity: 0.48, side: THREE.DoubleSide })
  );
  ringTwo.rotation.x = Math.PI / 2.1;
  ringTwo.rotation.z = Math.PI / 4;
  group.add(ringTwo);

  const satelliteMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcf69,
    emissive: 0xff4fb7,
    emissiveIntensity: 0.22,
    roughness: 0.32,
    metalness: 0.15
  });

  const satellites = [];
  for (let index = 0; index < 7; index += 1) {
    const satellite = new THREE.Mesh(new THREE.SphereGeometry(0.075 + index * 0.006, 18, 18), satelliteMaterial);
    const angle = (index / 7) * Math.PI * 2;
    satellite.position.set(Math.cos(angle) * 2.05, Math.sin(angle * 1.4) * 0.86, Math.sin(angle) * 1.2);
    group.add(satellite);
    satellites.push({ mesh: satellite, angle, radius: 2.05 + index * 0.05 });
  }

  const particleCount = 120;
  const positions = new Float32Array(particleCount * 3);
  for (let index = 0; index < particleCount; index += 1) {
    const radius = 2.4 + Math.random() * 2.4;
    const angle = Math.random() * Math.PI * 2;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = (Math.random() - 0.5) * 2.5;
    positions[index * 3 + 2] = Math.sin(angle) * radius;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.022, transparent: true, opacity: 0.72 })
  );
  scene.add(particles);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x0b102c, 1.15));
  const cyanLight = new THREE.PointLight(0x23d9ff, 2.4, 12);
  cyanLight.position.set(3.2, 2, 3);
  scene.add(cyanLight);
  const pinkLight = new THREE.PointLight(0xff4fb7, 2, 10);
  pinkLight.position.set(-2.8, -1.2, 3);
  scene.add(pinkLight);

  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };

  const resize = () => {
    const rect = visual.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(320, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const onPointerMove = (event) => {
    const rect = visual.getBoundingClientRect();
    target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  resize();

  const clock = new THREE.Clock();
  const animate = () => {
    const elapsed = clock.getElapsedTime();
    current.x += (target.x - current.x) * 0.055;
    current.y += (target.y - current.y) * 0.055;

    group.rotation.y = elapsed * 0.18 + current.x * 0.42;
    group.rotation.x = current.y * 0.24;
    ringOne.rotation.z = elapsed * 0.28;
    ringTwo.rotation.z = -elapsed * 0.2;
    particles.rotation.y = elapsed * 0.04;
    camera.position.x = current.x * 0.34;
    camera.position.y = 0.28 - current.y * 0.22;
    camera.lookAt(0, 0, 0);

    satellites.forEach((satellite, index) => {
      const angle = satellite.angle + elapsed * (0.35 + index * 0.025);
      satellite.mesh.position.x = Math.cos(angle) * satellite.radius;
      satellite.mesh.position.z = Math.sin(angle) * 1.12;
      satellite.mesh.position.y = Math.sin(angle * 1.45) * 0.92;
    });

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  };

  animate();
}

function initNetlifyIdentityRedirect() {
  if (!window.netlifyIdentity) return;
  window.netlifyIdentity.on("init", (user) => {
    if (!user && window.location.hash.includes("invite_token")) {
      window.netlifyIdentity.open("signup");
    }
  });
}

function initInteractions() {
  initSmartHeader();
  initMobileMenu();
  initCursor();
  initMagneticElements();
  initTiltCards();
  initScrollAnimations();
  initParallax();
  initImageDistortions();
  initHero3D();
  initNetlifyIdentityRedirect();
}

async function initApp() {
  initReducedMotionSupport();
  initPerformanceSafeguards();
  const completeLoader = initLoader();
  const content = await loadAllContent();
  renderAll(content);
  initInteractions();
  completeLoader();
}

document.addEventListener("DOMContentLoaded", initApp);
