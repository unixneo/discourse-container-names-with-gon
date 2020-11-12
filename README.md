# discourse-container-names-with-gon

### version 0.0.9.11

## Current Status

### Live testing on https://community.unix.com/

This Discourse plugin adds:

- The container names or ids of the containers listed in the yml file for two env vars:

1.  DISCOURSE_CONTAINER_MAIN
2.  DISCOURSE_CONTAINER_DATA

## REQUIRES GON GEM

Refer To:

https://community.unix.com/t/an-easy-way-to-setup-the-gon-gem-in-a-discourse-plugin/380693/2

### INSTALL INSTRUCTIONS

https://community.unix.com/t/discourse-plugin-discourse-container-names-with-gon/380701

## TODO

- Fix issue when container info does update unless page is reloaded (computed property issue?)
- Add / cleanup / fix I18N locale info for added `<span>` element.

## Version Info

- v0.0.9.5: 12 November 2020 move logic to theme. Remove EmberJS code from plugin.
- v0.0.9.4: 11 November 2020 remove SiteSetting (gon-gem branch)
- v0.0.88: 10 November 2020 add gon gem (branch)
- v0.0.87: 02 August 2020 change let to var
- v0.0.86: 22 July 2020 add comments regarding TODO issues
- v0.0.80: 21 July 2020 live testing on production docker container, changed env var names
- v0.0.60: 20 July 2020 begin plugin
