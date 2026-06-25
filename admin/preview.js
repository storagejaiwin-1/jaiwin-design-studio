(function () {
  "use strict";

  var CMS = window.CMS;
  var React = window.React;
  var h = (React && React.createElement) || window.h;

  if (!CMS || !h) return;

  CMS.registerPreviewStyle("/style.css");
  CMS.registerPreviewStyle("/admin/preview.css");

  function dataFrom(entry) {
    var data = entry && entry.getIn ? entry.getIn(["data"]) : null;
    if (!data) return {};
    return typeof data.toJS === "function" ? data.toJS() : data;
  }

  function assetUrl(value, getAsset, fallback) {
    if (!value) return fallback || "";
    try {
      var asset = getAsset ? getAsset(value) : value;
      return String(asset || fallback || value);
    } catch (error) {
      return fallback || String(value);
    }
  }

  function safeList(value) {
    return Array.isArray(value) ? value : [];
  }

  function formatDate(value) {
    if (!value) return "";
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function previewShell(children) {
    return h("div", { className: "cms-preview" }, children);
  }

  function HeaderPreview(props) {
    var settings = props.settings || {};
    var navLinks = safeList(settings.navLinks).length
      ? settings.navLinks
      : [
          { label: "About", url: "#about" },
          { label: "Services", url: "#services" },
          { label: "Portfolio", url: "#portfolio" },
          { label: "Process", url: "#process" },
          { label: "Contact", url: "#contact" }
        ];
    var logoMark = settings.logoMarkText || "JD";
    var logoText = settings.logoText || settings.businessName || "Jaiwin Design Studio";

    return h(
      "header",
      { className: "site-header" },
      h(
        "a",
        { className: "brand", href: "#home" },
        h("span", { className: "brand__mark" }, logoMark),
        h("span", { className: "brand__text" }, logoText)
      ),
      h(
        "nav",
        { className: "site-nav", "aria-label": "Preview navigation" },
        navLinks.map(function (link, index) {
          return h("a", { key: index, href: link.url || "#" }, link.label || "Link");
        }),
        h("a", { className: "nav-cta", href: "#contact" }, settings.navCtaLabel || "WhatsApp")
      )
    );
  }

  function LandingPreview(props) {
    var entry = props.entry;
    var getAsset = props.getAsset;
    var data = dataFrom(entry);
    var image = assetUrl(data.heroImageFallback, getAsset, "/assets/images/hero-fallback.svg");

    return previewShell([
      h(HeaderPreview, { key: "header" }),
      h(
        "section",
        { key: "hero", className: "hero section-shell", id: "home" },
        h(
          "div",
          { className: "hero__copy" },
          h("p", { className: "eyebrow" }, data.eyebrowText || "Premium creative design studio"),
          h(
            "h1",
            { className: "hero__title" },
            h("span", null, data.mainHeadline || "Designs That Make Your Moments"),
            h("span", { className: "gradient-text" }, data.highlightedHeadlineWord || "Unforgettable")
          ),
          h("p", { className: "hero__text" }, data.subheadline || "Your homepage text will appear here."),
          h(
            "div",
            { className: "hero__actions" },
            h("a", { className: "button button--primary", href: data.primaryCtaLink || "#portfolio" }, h("span", null, data.primaryCtaLabel || "View Portfolio")),
            h("a", { className: "button button--ghost", href: data.secondaryCtaLink || "#contact" }, h("span", null, data.secondaryCtaLabel || "Contact on WhatsApp"))
          )
        ),
        h(
          "div",
          { className: "hero__visual is-fallback" },
          h("img", {
            className: "hero__fallback",
            src: image,
            alt: data.heroImageAlt || "Creative studio preview"
          }),
          h(
            "div",
            { className: "hero__glass-card" },
            h("span", null, data.heroCardEyebrow || "Print"),
            h("strong", null, data.heroCardTitle || "Ready"),
            h("small", null, data.heroCardText || "Digital + flex artwork")
          )
        )
      )
    ]);
  }

  function PortfolioPreview(props) {
    var entry = props.entry;
    var getAsset = props.getAsset;
    var data = dataFrom(entry);
    var items = safeList(data.items);

    return previewShell([
      h(HeaderPreview, { key: "header" }),
      h(
        "p",
        { key: "note", className: "cms-preview-note" },
        "This preview uses the same portfolio layout your visitors see on the website."
      ),
      h(
        "section",
        { key: "portfolio", className: "portfolio section-shell", id: "portfolio" },
        h("div", { className: "section-kicker" }, data.sectionKicker || "Portfolio"),
        h(
          "div",
          { className: "section-heading section-heading--split" },
          h(
            "div",
            null,
            h("h2", null, data.heading || "Recent visual stories."),
            h("p", null, data.subheading || "Your work posts will appear here.")
          ),
          h("a", { className: "button button--outline", href: data.ctaLink || "#contact" }, data.ctaLabel || "Start a project")
        ),
        items.length
          ? h(
              "div",
              { className: "portfolio__grid" },
              items.map(function (item, index) {
                var image = assetUrl(item.image, getAsset, "/assets/images/placeholder-portfolio-1.svg");
                var date = formatDate(item.postedDate);
                return h(
                  "article",
                  { key: index, className: "portfolio-card" },
                  h(
                    "div",
                    { className: "portfolio-card__media" },
                    h("img", {
                      className: "portfolio-image",
                      src: image,
                      alt: item.altText || item.title || "Portfolio item"
                    })
                  ),
                  h(
                    "div",
                    { className: "portfolio-card__body" },
                    h(
                      "div",
                      { className: "portfolio-card__meta" },
                      h("span", { className: "portfolio-card__category" }, item.category || "Design"),
                      item.featured ? h("span", { className: "portfolio-card__badge" }, data.featuredLabel || "Featured") : null
                    ),
                    date ? h("p", { className: "portfolio-card__date" }, date) : null,
                    h("h3", null, item.title || "New work title"),
                    h("p", null, item.description || "Write a short description for this work.")
                  )
                );
              })
            )
          : h("div", { className: "cms-preview-empty" }, "Add a work post to see it here.")
      )
    ]);
  }

  function ServicesPreview(props) {
    var data = dataFrom(props.entry);
    var items = safeList(data.items);

    return previewShell([
      h(HeaderPreview, { key: "header" }),
      h(
        "section",
        { key: "services", className: "services section-shell", id: "services" },
        h("div", { className: "section-kicker" }, data.sectionKicker || "Services"),
        h(
          "div",
          { className: "section-heading" },
          h("h2", null, data.heading || "Design services for every visual need."),
          h("p", null, data.subheading || "Your service text will appear here.")
        ),
        h(
          "div",
          { className: "services__grid" },
          items.map(function (item, index) {
            return h(
              "article",
              { key: index, className: "service-card" + (item.featured ? " is-featured" : "") },
              h("span", { className: "service-card__icon" }, String(item.iconName || item.name || "JD").slice(0, 2).toUpperCase()),
              h("h3", null, item.name || "Service name"),
              h("p", null, item.description || "Service description"),
              item.featured ? h("span", { className: "service-card__tag" }, data.featuredLabel || "Featured") : null
            );
          })
        )
      )
    ]);
  }

  function AboutPreview(props) {
    var data = dataFrom(props.entry);
    var image = assetUrl(data.image, props.getAsset, "/assets/images/hero-fallback.svg");

    return previewShell([
      h(HeaderPreview, { key: "header" }),
      h(
        "section",
        { key: "about", className: "about section-shell", id: "about" },
        h("div", { className: "section-kicker" }, data.sectionKicker || "About the studio"),
        h(
          "div",
          { className: "section-heading" },
          h("h2", null, data.heading || "Color, craft, and clarity."),
          h("p", null, data.highlightText || "Your about highlight will appear here.")
        ),
        h(
          "div",
          { className: "about__grid" },
          h("div", { className: "about__media" }, h("img", { src: image, alt: data.imageAlt || "About preview" })),
          h(
            "div",
            { className: "about__content" },
            h(
              "div",
              { className: "about__paragraphs" },
              safeList(data.paragraphs).map(function (paragraph, index) {
                return h("p", { key: index }, paragraph);
              })
            )
          )
        )
      )
    ]);
  }

  function ContactPreview(props) {
    var data = dataFrom(props.entry);

    return previewShell([
      h(HeaderPreview, { key: "header" }),
      h(
        "section",
        { key: "contact", className: "contact section-shell", id: "contact" },
        h(
          "div",
          { className: "contact__panel" },
          h(
            "div",
            { className: "contact__copy" },
            h("div", { className: "section-kicker" }, data.sectionKicker || "Contact"),
            h("h2", null, data.heading || "Tell us what you want to create."),
            h("p", null, data.subheading || "Your contact text will appear here."),
            h("address", null, data.address || "Studio address")
          ),
          h(
            "form",
            { className: "contact-form" },
            h("label", null, h("span", null, data.nameLabel || "Your name"), h("input", { readOnly: true })),
            h("label", null, h("span", null, data.phoneLabel || "Phone or WhatsApp"), h("input", { readOnly: true })),
            h("label", null, h("span", null, data.messageLabel || "Message"), h("textarea", { readOnly: true, rows: 5, placeholder: data.messagePlaceholder || "" })),
            h("button", { className: "button button--primary", type: "button" }, data.submitLabel || "Send enquiry")
          )
        )
      )
    ]);
  }

  function SettingsPreview(props) {
    var data = dataFrom(props.entry);
    var style = {
      "--bg": data.backgroundColor || "#07081d",
      "--bg-2": data.surfaceColor || "#10143a",
      "--ink": data.textColor || "#ffffff",
      "--muted": data.mutedTextColor || "#b9c0dc",
      "--primary": data.primaryBrandColor || "#8f42ff",
      "--secondary": data.secondaryBrandColor || "#ff4fb7",
      "--cyan": data.highlightColor || "#23d9ff"
    };

    return h(
      "div",
      { style: style },
      previewShell([
        h(HeaderPreview, { key: "header", settings: data }),
        h(
          "section",
          { key: "settings", className: "hero section-shell" },
          h(
            "div",
            { className: "hero__copy" },
            h("p", { className: "eyebrow" }, data.location || "Studio location"),
            h(
              "h1",
              { className: "hero__title" },
              h("span", null, data.businessName || "Jaiwin Design Studio"),
              h("span", { className: "gradient-text" }, data.logoText || "Creative Studio")
            ),
            h("p", { className: "hero__text" }, data.footerText || data.seoDescription || "Your business settings preview.")
          )
        )
      ])
    );
  }

  function SimpleSectionPreview(props) {
    var data = dataFrom(props.entry);
    var title = data.highlightsHeading || data.heading || "Section preview";
    var subtitle = data.highlightsSubheading || data.subheading || "Your section text will appear here.";
    var kicker = data.sectionKicker || "Website section";
    var list = safeList(data.highlights || data.steps);

    return previewShell([
      h(HeaderPreview, { key: "header" }),
      h(
        "section",
        { key: "section", className: "section-shell" },
        h("div", { className: "section-kicker" }, kicker),
        h("div", { className: "section-heading" }, h("h2", null, title), h("p", null, subtitle)),
        h(
          "div",
          { className: "highlights__grid" },
          list.map(function (item, index) {
            return h(
              "article",
              { key: index, className: "highlight-card" },
              h("span", { className: "highlight-card__icon" }, String(item.iconName || index + 1).slice(0, 2).toUpperCase()),
              h("h3", null, item.title || "Title"),
              h("p", null, item.description || "Description")
            );
          })
        )
      )
    ]);
  }

  CMS.registerPreviewTemplate("site_settings", SettingsPreview);
  CMS.registerPreviewTemplate("landing", LandingPreview);
  CMS.registerPreviewTemplate("services", ServicesPreview);
  CMS.registerPreviewTemplate("portfolio", PortfolioPreview);
  CMS.registerPreviewTemplate("about", AboutPreview);
  CMS.registerPreviewTemplate("contact", ContactPreview);
  CMS.registerPreviewTemplate("homepage_sections", SimpleSectionPreview);
  CMS.registerPreviewTemplate("process", SimpleSectionPreview);
})();
