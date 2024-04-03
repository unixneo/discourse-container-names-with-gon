class GetContainerInfo
  def self.names
    if SiteSetting.enable_container_names_with_gon?
        Gon.global.container_main = "initialize"
        Gon.global.container_data = "initialize"
        if ENV["RAILS_ENV"] == "production"
          if ENV["DISCOURSE_CONTAINER_MAIN"].present?
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
          else
            if ENV["DISCOURSE_DB_HOST"].present?
              data_container = ENV["DISCOURSE_DB_HOST"].upcase
              data_env = data_container + "_NAME"
            end

            if !ENV[data_env].present?
              container_main = "unknown"
              container_data = "unknown"
            else
              container = ENV[data_env].split("/")
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
            end
          end
        else
          container_main = "dev"
          container_data = "dev"
        end

        Gon.global.container_main = container_main
        Gon.global.container_data = container_data
    end
  end

  def self.diskspace
    if SiteSetting.enable_container_names_with_gon?
      if ENV["RAILS_ENV"] == "production"
        raw = `df | grep shared`
        if raw.length.present?
          df = raw.split(" ")
          if df.size > 5
            Gon.global.diskspace = "#{df[0]}  #{df[4]}  #{df[5]}"
          else
            Gon.global.diskspace = "unknown"
          end
        else
          Gon.global.diskspace = "unknown"
        end
      else
        Gon.global.diskspace = "dev"
      end
    end
  end

end

class GonLayoutChanges
  def self.add_gon_to_head
    if SiteSetting.enable_container_names_with_gon?
      head_file = "#{Rails.root}/app/views/layouts/_head.html.erb"
      if File.readlines(head_file).grep(/include_gon/)&.empty?
        if ENV["RAILS_ENV"] == "production"
          tmp_file = "/shared/tmp/work.tmp.txt"
        else
          tmp_file = "#{Rails.root}/work.tmp.txt"
        end
        gon_text = "<%= include_gon if defined? gon && gon.present? %>\n"
        IO.write(tmp_file, gon_text)
        IO.foreach(head_file) do |line|
          IO.write(tmp_file, line, mode: "a")
        end
        FileUtils.mv(tmp_file, head_file)
      end
    end
  end
end
