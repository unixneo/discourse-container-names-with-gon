# name: discourse-container-names-with-gon
# about: plugin to add container names or ids from yml to backup page
# version: 0.2.0
# date: 19 March 2025
# authors: Neo
# url: https://github.com/unixneo/discourse-container-names-with-gon

register_asset "stylesheets/common/container-names.scss"

enabled_site_setting :enable_container_names_with_gon

gem 'gon', '6.2.0'
require "gon"


load File.expand_path("../app/lib/set_gon_info.rb", __FILE__)


after_initialize do
  GonLayoutChanges.add_gon_to_head
  GetContainerInfo.names
  GetContainerInfo.diskspace
  GetContainerInfo.load_average

  Admin::AdminController.class_eval do
    before_action :do_info

    def do_info
      GetContainerInfo.diskspace
      GetContainerInfo.load_average
    end
  end
end
