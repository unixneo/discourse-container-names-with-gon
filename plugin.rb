# name: container-names-with-gon
# about: plugin to add container names or ids from yml to backup page
# version: 0.0.9.4
# date: 22s Nov 2020
# authors: Neo
# url: https://github.com/unixneo/discourse-container-names-with-gon

register_asset "stylesheets/common/container-names.scss"

gem "gon", "6.2.0"
require "gon"

Gon.global.test = "HELLO GON"

PLUGIN_NAME = "container-names-with-gon".freeze

after_initialize do

  Admin::AdminController.class_eval do
    before_action :do_info
  
    def :do_info
      df = `df | grep shared`.split(" ")
      if df.size > 5
      Gon.global.diskspace = "#{df[0]}  #{df[4]}  #{df[5]}"
      else
      Gon.global.diskspace = "unknown"
      end
      if ENV["DATA_NAME"].present?
        container = ENV["DATA_NAME"].split("/")
        if container.size > 2
          container_main = container[1].chomp
          container_data = container[2].chomp
        elsif container.size > 1
          container_main = container[1].chomp
          container_data = "unknown"
        else
          container_main = "unknown"
          container_data = "unknown"
        end
      else
        if ENV["DISCOURSE_CONTAINER_MAIN"].present?
          container_main = ENV["DISCOURSE_CONTAINER_MAIN"]
        else
          container_main = "DISCOURSE_CONTAINER_MAIN not set."
        end
        if ENV["DISCOURSE_CONTAINER_DATA"].present?
        container_data = ENV["DISCOURSE_CONTAINER_DATA"]
        else
          container_data = "DISCOURSE_CONTAINER_DATA not set."
        end
      end
      Gon.global.container_main = container_main
      Gon.global.container_data = container_data
    end
  end
end
