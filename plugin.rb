# name: discourse-container-names-with-gon
# about: plugin to add container names or ids from yml to backup page
# version: 0.1.77
# date: 10 April 2021
# authors: Neo
# url: https://github.com/unixneo/discourse-container-names-with-gon

register_asset "stylesheets/common/container-names.scss"
register_asset "javascripts/containernames.js.es6"

gem 'gon', '6.2.0'
require "gon"


load File.expand_path("../app/lib/set_gon_info.rb", __FILE__)

after_initialize do
  GonLayoutChanges.add_gon_to_head
  GetContainerInfo.names
  GetContainerInfo.diskspace

  Admin::AdminController.class_eval do
    before_action :do_info

    def do_info
      GetContainerInfo.diskspace
    end
  end
end
