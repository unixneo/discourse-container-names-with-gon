# frozen_string_literal: true

# name: discourse-container-names-with-gon
# about: Plugin to display container names, disk space, and load average to admin users
# version: 1.1.0
# date: 15 February 2026
# authors: Neo (original), Updated for Discourse 2026
# url: https://github.com/unixneo/discourse-container-names-with-gon
# required_version: 3.2.0

enabled_site_setting :enable_container_names_with_gon

register_asset "stylesheets/common/container-names.scss"

module ::DiscourseContainerNames
  PLUGIN_NAME = "discourse-container-names-with-gon"

  class << self
    def container_names
      return { main: "dev", data: "dev" } unless Rails.env.production?

      if ENV["DISCOURSE_CONTAINER_MAIN"].present?
        {
          main: ENV["DISCOURSE_CONTAINER_MAIN"] || "DISCOURSE_CONTAINER_MAIN not set",
          data: ENV["DISCOURSE_CONTAINER_DATA"] || "DISCOURSE_CONTAINER_DATA not set"
        }
      elsif ENV["DISCOURSE_DB_HOST"].present?
        data_container = ENV["DISCOURSE_DB_HOST"].upcase
        data_env = "#{data_container}_NAME"

        if ENV[data_env].present?
          container = ENV[data_env].split("/")
          if container.size > 2
            { main: container[1].chomp, data: container[2].chomp }
          elsif container.size > 1
            { main: container[1].chomp, data: "unknown" }
          else
            { main: "unknown", data: "unknown" }
          end
        else
          { main: "unknown", data: "unknown" }
        end
      else
        { main: "unknown", data: "unknown" }
      end
    end

    def diskspace
      return "dev" unless Rails.env.production?

      begin
        raw = `df | grep shared 2>/dev/null`.strip
        if raw.present?
          df = raw.split(" ")
          if df.size > 5
            "#{df[0]}  #{df[4]}  #{df[5]}"
          else
            "unknown"
          end
        else
          "unknown"
        end
      rescue => e
        Rails.logger.warn("#{PLUGIN_NAME}: Error getting disk space: #{e.message}")
        "error"
      end
    end

    def load_average
      return "dev" unless Rails.env.production?

      begin
        raw = `uptime 2>/dev/null`.strip
        if raw.present?
          raw.split("load average:").last&.strip || "unknown"
        else
          "unknown"
        end
      rescue => e
        Rails.logger.warn("#{PLUGIN_NAME}: Error getting load average: #{e.message}")
        "error"
      end
    end

    def container_info
      {
        container_main: container_names[:main],
        container_data: container_names[:data],
        diskspace: diskspace,
        load_average: load_average
      }
    end
  end
end

after_initialize do
  # Add container info to the admin site serializer so it's available to staff
  add_to_serializer(:site, :container_info, include_condition: -> { scope.is_staff? }) do
    return nil unless SiteSetting.enable_container_names_with_gon

    ::DiscourseContainerNames.container_info
  end

  # Also create a custom endpoint for fetching fresh data
  module ::DiscourseContainerNames
    class Engine < ::Rails::Engine
      engine_name PLUGIN_NAME
      isolate_namespace DiscourseContainerNames
    end

    class ContainerInfoController < ::ApplicationController
      requires_plugin PLUGIN_NAME
      before_action :ensure_admin

      def show
        render json: {
          container_info: ::DiscourseContainerNames.container_info,
          timestamp: Time.now.iso8601
        }
      end
    end
  end

  DiscourseContainerNames::Engine.routes.draw do
    get "/info" => "container_info#show"
  end

  Discourse::Application.routes.append do
    mount ::DiscourseContainerNames::Engine, at: "/admin/plugins/container-names"
  end
end
