# discourse-container-names-with-gon

### version 0.0.9.17

## Current Status

### Live testing on https://community.unix.com/

This Discourse plugin uses two environmental variables to show the names of containers in the admin area:

- The container names or ids of the containers listed in the yml file for two env vars should be as follows:

```
DISCOURSE_CONTAINER_MAIN = "your_app_container_name"
DISCOURSE_CONTAINER_DATA = "your_data_container_name"
```

## REQUIRES GON GEM

Refer To:

https://community.unix.com/t/an-easy-way-to-setup-the-gon-gem-in-a-discourse-plugin/380693/2

### INSTALL INSTRUCTIONS

https://community.unix.com/t/discourse-plugin-discourse-container-names-with-gon/380701

## TODO

- Make the ENV variables more flexible.

## Version Info

- v0.0.9.17: 12 November 2020 move logic to theme. Remove EmberJS code from plugin.
- v0.0.9.4: 11 November 2020 remove SiteSetting (gon-gem branch)
- v0.0.88: 10 November 2020 add gon gem (branch)
- v0.0.87: 02 August 2020 change let to var
- v0.0.86: 22 July 2020 add comments regarding TODO issues
- v0.0.80: 21 July 2020 live testing on production docker container, changed env var names
- v0.0.60: 20 July 2020 begin plugin
