# discourse-container-names-with-gon

### version 0.0.9.55

## Current Status

### Live testing on https://community.unix.com/

This Discourse plugin uses either (A) two environmental variables specified in the Discourse container ```yml``` file or (B) the Discourse system ```ENV["DATA_NAME"]``` environmental variable to show the names of the containers in the admin area:

If you wish to override  ```ENV["DATA_NAME"]``` then the container names or ids of the containers listed in the ```yml``` file for two env vars should be as follows:

```
DISCOURSE_CONTAINER_MAIN = "your_app_container_name"
DISCOURSE_CONTAINER_DATA = "your_data_container_name"
```

However, the two environmental variables above are not required because the container names are derived from another Discourse system environmental variable in this version of the plugin:  

```
ENV["DATA_NAME"]
```

## REQUIRES GON GEM

Refer To:

https://community.unix.com/t/an-easy-way-to-setup-the-gon-gem-in-a-discourse-plugin/380693/2

### INSTALL INSTRUCTIONS

https://community.unix.com/t/discourse-plugin-discourse-container-names-with-gon/380701

## Version Info

- v0.0.9.55: 22 November 2020 test new logic using ENV["DATA_NAME"] and 'df' extending Admin controller.
- v0.0.9.17: 12 November 2020 move logic to theme. Remove EmberJS code from plugin.
- v0.0.9.4: 11 November 2020 remove SiteSetting (gon-gem branch)
- v0.0.88: 10 November 2020 add gon gem (branch)
- v0.0.87: 02 August 2020 change let to var
- v0.0.86: 22 July 2020 add comments regarding TODO issues
- v0.0.80: 21 July 2020 live testing on production docker container, changed env var names
- v0.0.60: 20 July 2020 begin plugin
