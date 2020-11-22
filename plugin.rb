# name: container-names-with-gon
# about: plugin to add container names or ids from yml to backup page
# version: 0.0.9.52
# date: 22s Nov 2020
# authors: Neo
# url: https://github.com/unixneo/discourse-container-names-with-gon

register_asset "stylesheets/common/container-names.scss"

gem "gon", "6.2.0"
require "gon"

Gon.global.test = "HELLO GON"

app_root = "#{Rails.root}/plugins/discourse-container-names-with-gon/app"
PLUGIN_NAME = "container-names-with-gon".freeze
PLUGIN_LOGIC = "#{app_root}/lib/plugin_logic.rb"

after_initialize do
  load File.open(PLUGIN_LOGIC)

  Admin::AdminController.class_eval do
    before_action :do_info

    def do_info
      load File.open(PLUGIN_LOGIC)
    end
  end
end
