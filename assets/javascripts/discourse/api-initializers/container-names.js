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

  // Add container info display to admin backups page
  api.onPageChange((url) => {
    if (url.includes("/admin/backups") || url.includes("/admin/dashboard")) {
      insertContainerInfo();
    }
  });

  function createContainerInfoHTML(data) {
    const timestamp = data.timestamp
      ? new Date(data.timestamp).toLocaleString()
      : new Date().toLocaleString();

    return `
      <div class="container-names-info" id="container-names-widget">
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
      </div>
    `;
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
      console.error("Error fetching container info:", error);
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

  async function insertContainerInfo() {
    // Wait for the admin content to be rendered
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Don't insert if already present
    if (document.getElementById("container-names-widget")) {
      return;
    }

    // Find the appropriate insertion point
    let insertPoint = null;

    // For backups page, insert at the top of the admin content
    const backupsContainer = document.querySelector(".admin-backups");
    if (backupsContainer) {
      insertPoint = backupsContainer;
    }

    // For dashboard, insert in the admin main area
    if (!insertPoint) {
      const adminContent = document.querySelector(".admin-contents");
      if (adminContent) {
        insertPoint = adminContent;
      }
    }

    if (!insertPoint) {
      return;
    }

    // Create loading placeholder
    const placeholder = document.createElement("div");
    placeholder.id = "container-names-widget";
    placeholder.className = "container-names-info";
    placeholder.innerHTML = `
      <div class="container-names-title">
        <span>${I18n.t("container_names.title")}</span>
      </div>
      <div style="padding: 20px; text-align: center;">
        ${I18n.t("container_names.loading")}
      </div>
    `;

    insertPoint.insertBefore(placeholder, insertPoint.firstChild);

    // Fetch and display container info
    const data = await fetchContainerInfo();

    if (data) {
      placeholder.outerHTML = createContainerInfoHTML(data);

      // Add refresh button handler
      const refreshBtn = document.getElementById("refresh-container-info");
      if (refreshBtn) {
        refreshBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          refreshBtn.classList.add("loading");
          refreshBtn.textContent = I18n.t("container_names.loading");

          const newData = await fetchContainerInfo();
          if (newData) {
            const widget = document.getElementById("container-names-widget");
            if (widget) {
              widget.outerHTML = createContainerInfoHTML(newData);
              // Re-attach event listener
              attachRefreshHandler();
            }
          }

          refreshBtn.classList.remove("loading");
          refreshBtn.textContent = I18n.t("container_names.refresh");
        });
      }
    }
  }

  function attachRefreshHandler() {
    const refreshBtn = document.getElementById("refresh-container-info");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        refreshBtn.classList.add("loading");
        refreshBtn.textContent = I18n.t("container_names.loading");

        const newData = await fetchContainerInfo();
        if (newData) {
          const widget = document.getElementById("container-names-widget");
          if (widget) {
            widget.outerHTML = createContainerInfoHTML(newData);
            attachRefreshHandler();
          }
        }

        refreshBtn.classList.remove("loading");
        refreshBtn.textContent = I18n.t("container_names.refresh");
      });
    }
  }
});
