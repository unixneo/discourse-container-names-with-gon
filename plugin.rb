# name: container-names-with-gon
# about: plugin to add container names or ids from yml to backup page
# version: 0.0.9.10
# date: 12 Nov 2020
# authors: Neo
# url: https://github.com/unixneo/container-names

#enabled_site_setting :container_names_with_gon_enabled

register_asset "stylesheets/common/container-names.scss"

gem "gon", "6.2.0"
require "gon"

after_initialize do
  if GlobalSetting.container_main.to_s.length > 1
    Gon.global.container_main = GlobalSetting.container_main.dup
  else
    Gon.global.container_main = "enabled but unspecified"
  end
  if GlobalSetting.container_data.to_s.length > 1
    Gon.global.container_data = GlobalSetting.container_data.dup
  else
    Gon.global.container_data = "enabled but unspecified"
  end
end
