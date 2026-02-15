import { apiInitializer } from "discourse/lib/api";
import I18n from "discourse-i18n";

export default apiInitializer("1.0.0", (api) => {
  const siteSettings = api.container.lookup("service:site-settings");

  if (!siteSettings.enable_container_names_with_gon) {
    return;
  }

  const currentUser = api.getCurrentUser();
  if (!currentUser?.staff) {
    return;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function getContainerInfo() {
    const site = api.container.lookup("service:site");
    return site.container_info;
  }

  function createContainerInfoElement(data) {
    const container = document.createElement("div");
    container.className = "container-names-info";
    container.id = "container-names-widget";

    if (data) {
      const timestamp = new Date().toLocaleString();

      container.innerHTML = `
        <div class="container-names-title">
          <span>${I18n.t("container_names.title")}</span>
        </div>
        <div class="container-names-grid">
          <div class="container-info-item">
            <div class="info-label">${I18n.t("container_names.main_container")}</div>
            <div class="info-value">${escapeHtml(data.container_main || "unknown")}</div>
          </div>
          <div class="container-info-item">
            <div class="info-label">${I18n.t("container_names.data_container")}</div>
            <div class="info-value">${escapeHtml(data.container_data || "unknown")}</div>
          </div>
          <div class="container-info-item">
            <div class="info-label">${I18n.t("container_names.diskspace")}</div>
            <div class="info-value">${escapeHtml(data.diskspace || "unknown")}</div>
          </div>
          <div class="container-info-item">
            <div class="info-label">${I18n.t("container_names.load_average")}</div>
            <div class="info-value">${escapeHtml(data.load_average || "unknown")}</div>
          </div>
        </div>
        <div class="container-names-timestamp">
          ${I18n.t("container_names.last_updated")}: ${timestamp}
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="container-names-title">
          <span>${I18n.t("container_names.title")}</span>
        </div>
        <div style="padding: 20px; text-align: center;">
          No container info available
        </div>
      `;
    }

    return container;
  }

  async function insertContainerInfo() {
    // Wait for the page to render
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Don't insert if already present
    if (document.getElementById("container-names-widget")) {
      return;
    }

    const data = getContainerInfo();
    if (!data) {
      return;
    }

    // Find insertion point - try multiple selectors
    const selectors = [
      ".admin-backups",
      ".admin-dashboard",
      ".d-page-header",
      ".admin-config-page__main-area",
      ".admin-contents",
      ".admin-container"
    ];

    let insertPoint = null;
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        insertPoint = element;
        break;
      }
    }

    if (!insertPoint) {
      return;
    }

    const widget = createContainerInfoElement(data);
    insertPoint.insertBefore(widget, insertPoint.firstChild);
  }

  // Listen for page changes
  api.onPageChange((url) => {
    if (url.includes("/admin/backups") || url.includes("/admin/dashboard") || url === "/admin" || url === "/admin/") {
      insertContainerInfo();
    }
  });
});
