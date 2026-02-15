# discourse-container-names-with-gon

### Version 1.0.0 (Updated for Discourse 2026)

## Overview

This Discourse plugin displays Docker container information to admin users in the admin area (Backups page and Dashboard). Information shown includes:

- Main container name
- Data container name
- Disk space usage
- System load average

## What's New in v1.0.0

This is a complete rewrite of the original plugin to work with modern Discourse (2025/2026):

- **Removed the gon gem dependency** - No longer requires the gon gem or modifying core Discourse files
- **Uses Discourse's native serializer API** - Data is passed to the frontend using `add_to_serializer`
- **Modern JavaScript** - Uses the new `api-initializers` pattern instead of deprecated script tags
- **Custom admin endpoint** - Fresh data can be fetched via `/admin/plugins/container-names/info`
- **Improved UI** - Modern styling that respects Discourse's theme variables
- **Better error handling** - Graceful fallbacks when system commands fail

## Configuration

The container names are determined from environment variables in this priority order:

1. **Explicit environment variables** (preferred):
   - `DISCOURSE_CONTAINER_MAIN` - Name/ID of your main app container
   - `DISCOURSE_CONTAINER_DATA` - Name/ID of your data container

2. **Automatic detection** (fallback):
   - If the above aren't set, the plugin attempts to detect container names from `ENV["DISCOURSE_DB_HOST"]` and the corresponding `*_NAME` environment variable

Add these to your `app.yml` container configuration:

```yaml
env:
  DISCOURSE_CONTAINER_MAIN: "your_app_container_name"
  DISCOURSE_CONTAINER_DATA: "your_data_container_name"
```

## Installation

Add this plugin to your `app.yml` container configuration:

```yaml
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - git clone https://github.com/unixneo/discourse-container-names-with-gon.git
```

Then rebuild your container:

```bash
./launcher rebuild app
```

## Usage

Once installed and enabled:

1. Navigate to **Admin → Backups** or **Admin → Dashboard**
2. You'll see a "Container Information" box at the top of the page
3. Click "Refresh" to fetch the latest container information

## Settings

- **enable_container_names_with_gon** - Enable or disable the plugin (default: enabled)

## API Endpoint

Admins can fetch container info programmatically:

```
GET /admin/plugins/container-names/info
```

Response:
```json
{
  "container_info": {
    "container_main": "app_container_name",
    "container_data": "data_container_name",
    "diskspace": "/dev/sda1  85%  /shared",
    "load_average": "0.42, 0.38, 0.35"
  },
  "timestamp": "2026-02-15T10:30:00Z"
}
```

## Development vs Production

In development environments (`RAILS_ENV != production`), all values display as "dev" to avoid running system commands unnecessarily.

## Upgrading from Previous Versions

If you're upgrading from version 0.2.x or earlier, the old `gon` gem dependency and legacy files have been completely removed. Simply update to the latest version and rebuild your container. You may need to clear your browser cache for the new JavaScript to load.

## Compatibility

- **Discourse**: 2025.x and later (tested with v2026.1.0)
- **Ruby**: 3.2+ (uses frozen_string_literal)
- **Browser**: Modern browsers with ES6 support

## Troubleshooting

### Container info shows "unknown"

- Check that your environment variables are set correctly
- Verify the `df` and `uptime` commands are available in your container
- Check the Rails logs for any error messages from the plugin

### Widget doesn't appear

- Ensure you're logged in as an admin or staff member
- Check that the plugin is enabled in Settings → Plugins
- Try refreshing the page or clearing your browser cache

## License

MIT License - See LICENSE file

## Credits

- Original plugin by Neo (unixneo)
- Updated for Discourse 2026 compatibility

## Links

- [GitHub Repository](https://github.com/unixneo/discourse-container-names-with-gon)
- [Unix/Linux Community](https://community.unix.com/)
- [Meta Discourse Discussion](https://meta.discourse.org/t/discourse-container-names-with-gon-for-sys-admins-and-developers/170973)
