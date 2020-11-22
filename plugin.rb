# name: container-names-with-gon
# about: plugin to add container names or ids from yml to backup page
# version: 0.0.9.51
# date: 22s Nov 2020
# authors: Neo
# url: https://github.com/unixneo/discourse-container-names-with-gon

register_asset "stylesheets/common/container-names.scss"

gem "gon", "6.2.0"
require "gon"

Gon.global.test = "HELLO GON"

PLUGIN_NAME = "container-names-with-gon".freeze

after_initialize do
  app_root = "#{Rails.root}/plugins/discourse-container-names-with-gon/app"
  plugin_logic = "#{app_root}/lib/plugin_logic.rb"
  load File.open(plugin_logic)

  Admin::AdminController.class_eval do
    before_action :do_info

    def do_info
      app_root = "#{Rails.root}/plugins/discourse-container-names-with-gon/app"
      plugin_logic = "#{app_root}/lib/plugin_logic.rb"
      load File.open(plugin_logic)
    end
  end
end
