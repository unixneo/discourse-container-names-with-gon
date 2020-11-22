# name: container-names-with-gon
# about: plugin to add container names or ids from yml to backup page
# version: 0.0.9.18
# date: 12 Nov 2020
# authors: Neo
# url: https://github.com/unixneo/discourse-container-names-with-gon

register_asset "stylesheets/common/container-names.scss"

gem "gon", "6.2.0"
require "gon"

after_initialize do
  df = `df | grep shared`.split(" ")
  if df.size > 5
    Gon.global.diskspace = "#{df[5]}: #{df[4]}"
  else
    Gon.global.diskspace = ""
  end
  if ENV["DATA_NAME"].present?
    container = ENV["DATA_NAME"].split("/")
    if container.size > 2
      containers = "Containers: #{container[1].chomp}, #{container[2].chomp}"
      Gon.global.container_main = container[1].chomp
      Gon.global.container_data = container[2].chomp
    elsif container.size > 1
      containers = "Containers: #{container[1].chomp}"
      Gon.global.container_main = container[1].chomp
      Gon.global.container_data = ""
    else
      containers = "Containers: unknown, unknown"
      Gon.global.container_main = "unknown"
      Gon.global.container_data = "unknown"
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
    Gon.global.container_main = container_main
    Gon.global.container_data = container_data
  end
end
