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

  let refreshTimer = null;

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function getContainerInfo() {
    const site = api.container.lookup("service:site");
    return site.container_info;
  }

  async function fetchLoadAverage() {
    try {
      const response = await ajax("/admin/plugins/container-names/load");
      return response;
    } catch (error) {
      console.error("Container Names Plugin: Error fetching load average:", error);
      return null;
    }
  }

  function updateLoadAverage(data) {
    const loadValueEl = document.querySelector("#container-names-panel .load-average-value");
    const diskValueEl = document.querySelector("#container-names-panel .disk-space-value");
    const timestampEl = document.querySelector("#container-names-panel .container-names-timestamp");

    if (loadValueEl && data.load_average) {
      loadValueEl.textContent = data.load_average;
    }
    if (diskValueEl && data.diskspace) {
      diskValueEl.textContent = data.diskspace;
    }
    if (timestampEl) {
      const timestamp = data.timestamp
        ? new Date(data.timestamp).toLocaleString()
        : new Date().toLocaleString();
      timestampEl.textContent = `${I18n.t("container_names.last_updated")}: ${timestamp}`;
    }
  }

  function createContainerInfoElement(data) {
    const panel = document.createElement("div");
    panel.className = "container-names-info";
    panel.id = "container-names-panel";

    if (data) {
      const timestamp = new Date().toLocaleString();

      panel.innerHTML = `
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
            <div class="info-value disk-space-value">${escapeHtml(data.diskspace || "unknown")}</div>
          </div>
          <div class="container-info-item">
            <div class="info-label">${I18n.t("container_names.load_average")}</div>
            <div class="info-value load-average-value">${escapeHtml(data.load_average || "unknown")}</div>
          </div>
        </div>
        <div class="container-names-timestamp">
          ${I18n.t("container_names.last_updated")}: ${timestamp}
        </div>
      `;
    } else {
      panel.innerHTML = `
        <div class="container-names-title">
          <span>${I18n.t("container_names.title")}</span>
        </div>
        <div style="padding: 20px; text-align: center;">
          No container info available
        </div>
      `;
    }

    return panel;
  }

  function startAutoRefresh() {
    stopAutoRefresh();

    const refreshSeconds = siteSettings.container_names_refresh_seconds || 30;
    if (refreshSeconds < 10) {
      return;
    }

    refreshTimer = setInterval(async () => {
      if (!document.getElementById("container-names-panel")) {
        stopAutoRefresh();
        return;
      }

      const data = await fetchLoadAverage();
      if (data) {
        updateLoadAverage(data);
      }
    }, refreshSeconds * 1000);
  }

  function stopAutoRefresh() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  }

  async function insertContainerInfo() {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (document.getElementById("container-names-panel")) {
      startAutoRefresh();
      return;
    }

    const data = getContainerInfo();
    if (!data) {
      return;
    }

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

    const panel = createContainerInfoElement(data);
    insertPoint.insertBefore(panel, insertPoint.firstChild);

    startAutoRefresh();
  }

  api.onPageChange((url) => {
    if (url.includes("/admin/backups") || url.includes("/admin/dashboard") || url === "/admin" || url === "/admin/") {
      insertContainerInfo();
    } else {
      stopAutoRefresh();
    }
  });

  api.cleanupStream(() => {
    stopAutoRefresh();
  });
});
