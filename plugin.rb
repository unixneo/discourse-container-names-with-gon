# name: container-names-with-gon
# about: plugin to add container names or ids from yml to backup page
# version: 0.0.9.15
# date: 12 Nov 2020
# authors: Neo
# url: https://github.com/unixneo/discourse-container-names-with-gon

register_asset "stylesheets/common/container-names.scss"

gem "gon", "6.2.0"
require "gon"

after_initialize do
  if defined?(GlobalSetting)
    if GlobalSetting.container_main.to_s.length > 1
      Gon.global.container_main = GlobalSetting.container_main.dup
    else
      Gon.global.container_main = "Enabled but unspecified."
    end
    if GlobalSetting.container_data.to_s.length > 1
      Gon.global.container_data = GlobalSetting.container_data.dup
    else
      Gon.global.container_data = "Enabled but unspecified."
    end
  else
    Gon.global.container_main = "No global settings"
    Gon.global.container_data = "No global settings"
  end
end
