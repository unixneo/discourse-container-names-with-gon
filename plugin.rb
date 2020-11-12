# name: container-names-with-gon
# about: plugin to add container names or ids from yml to backup page
# version: 0.0.9.17
# date: 12 Nov 2020
# authors: Neo
# url: https://github.com/unixneo/discourse-container-names-with-gon

register_asset "stylesheets/common/container-names.scss"

gem "gon", "6.2.0"
require "gon"

after_initialize do
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

  Gon.global.container_main = container_main
  Gon.global.container_data = container_data
end
