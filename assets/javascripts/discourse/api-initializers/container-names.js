import { apiInitializer } from "discourse/lib/api";
import { ajax } from "discourse/lib/ajax";
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

  async function fetchContainerInfo() {
    try {
      const response = await ajax("/admin/plugins/container-names/info");
      return response;
    } catch (error) {
      console.error("Container Names Plugin: Error fetching container info:", error);
      // Fall back to site data if endpoint fails
      const site = api.container.lookup("service:site");
      if (site.container_info) {
        return {
          container_info: site.container_info,
          timestamp: null
        };
      }
      return null;
    }
  }

  function createContainerInfoElement(data, isLoading = false) {
    const container = document.createElement("div");
    container.className = "container-names-info";
    container.id = "container-names-widget";

    if (isLoading) {
      container.innerHTML = `
        <div class="container-names-title">
          <span>${I18n.t("container_names.title")}</span>
        </div>
        <div style="padding: 20px; text-align: center;">
          ${I18n.t("container_names.loading")}
        </div>
      `;
    } else if (data) {
      const timestamp = data.timestamp
        ? new Date(data.timestamp).toLocaleString()
        : new Date().toLocaleString();

      container.innerHTML = `
        <div class="container-names-title">
          <span>${I18n.t("container_names.title")}</span>
          <button class="btn btn-small container-names-refresh" id="refresh-container-info">
            ${I18n.t("container_names.refresh")}
          </button>
        </div>
        <div class="container-names-grid">
          <div class="container-info-item">
            <div class="info-label">${I18n.t("container_names.main_container")}</div>
            <div class="info-value">${escapeHtml(data.container_info?.container_main || "unknown")}</div>
          </div>
          <div class="container-info-item">
            <div class="info-label">${I18n.t("container_names.data_container")}</div>
            <div class="info-value">${escapeHtml(data.container_info?.container_data || "unknown")}</div>
          </div>
          <div class="container-info-item">
            <div class="info-label">${I18n.t("container_names.diskspace")}</div>
            <div class="info-value">${escapeHtml(data.container_info?.diskspace || "unknown")}</div>
          </div>
          <div class="container-info-item">
            <div class="info-label">${I18n.t("container_names.load_average")}</div>
            <div class="info-value">${escapeHtml(data.container_info?.load_average || "unknown")}</div>
          </div>
        </div>
        <div class="container-names-timestamp">
          ${I18n.t("container_names.last_updated")}: ${timestamp}
        </div>
      `;
    }

    return container;
  }

  function attachRefreshHandler(container) {
    const refreshBtn = container.querySelector("#refresh-container-info");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        refreshBtn.classList.add("loading");
        refreshBtn.textContent = I18n.t("container_names.loading");

        const newData = await fetchContainerInfo();
        if (newData) {
          const newContainer = createContainerInfoElement(newData);
          container.replaceWith(newContainer);
          attachRefreshHandler(newContainer);
        } else {
          refreshBtn.classList.remove("loading");
          refreshBtn.textContent = I18n.t("container_names.refresh");
        }
      });
    }
  }

  async function insertContainerInfo() {
    // Wait for the admin content to be rendered
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Don't insert if already present
    if (document.getElementById("container-names-widget")) {
      return;
    }

    // Find the appropriate insertion point - try multiple selectors for different Discourse versions
    let insertPoint = null;
    let insertMethod = "prepend"; // default to prepend

    // Modern Discourse 2026+ selectors
    const selectors = [
      // Admin dashboard (2026+) - after the page header
      { selector: ".admin-dashboard .d-page-header", method: "after" },
      // Admin dashboard content area
      { selector: ".admin-dashboard .admin-config-page__main-area", method: "prepend" },
      // Admin backups page
      { selector: ".admin-backups", method: "prepend" },
      // Fallback: any admin main content area
      { selector: ".admin-main-content", method: "prepend" },
      // Older Discourse selectors
      { selector: ".admin-contents", method: "prepend" },
      { selector: ".admin-container", method: "prepend" },
      // Generic admin area
      { selector: "[class*='admin-dashboard']", method: "prepend" }
    ];

    for (const { selector, method } of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        insertPoint = element;
        insertMethod = method;
        break;
      }
    }

    if (!insertPoint) {
      console.log("Container Names Plugin: Could not find insertion point on this page");
      return;
    }

    // Create loading placeholder
    const placeholder = createContainerInfoElement(null, true);

    if (insertMethod === "after") {
      insertPoint.after(placeholder);
    } else {
      insertPoint.prepend(placeholder);
    }

    // Fetch and display container info
    const data = await fetchContainerInfo();

    if (data) {
      const container = createContainerInfoElement(data);
      placeholder.replaceWith(container);
      attachRefreshHandler(container);
    } else {
      placeholder.innerHTML = `
        <div class="container-names-title">
          <span>${I18n.t("container_names.title")}</span>
        </div>
        <div style="padding: 20px; text-align: center; color: var(--danger);">
          Error loading container info
        </div>
      `;
    }
  }

  // Listen for page changes to admin areas
  api.onPageChange((url) => {
    if (url.includes("/admin/backups") || url.includes("/admin/dashboard") || url === "/admin" || url === "/admin/") {
      insertContainerInfo();
    }
  });
});
