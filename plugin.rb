# name: discourse-container-names-with-gon
# about: plugin to add container names or ids from yml to backup page
# version: 0.1.1
# date: 4 Dec 2020
# authors: Neo
# url: https://github.com/unixneo/discourse-container-names-with-gon

register_asset "stylesheets/common/container-names.scss"

gem "gon", "6.2.0"
require "gon"

Gon.global.test = "HELLO GON"

APP_ROOT = "#{Rails.root}/plugins/discourse-container-names-with-gon/app".freeze
PLUGIN_NAME = "container-names-with-gon".freeze
PLUGIN_LOGIC = "#{APP_ROOT}/lib/set_gon_info.rb".freeze
load File.open(PLUGIN_LOGIC)

after_initialize do
  GetContainerInfo.new
  GetDiskSpace.new

  Admin::AdminController.class_eval do
    before_action :do_info

    def do_info
      GetDiskSpace.new
    end
  end
end
