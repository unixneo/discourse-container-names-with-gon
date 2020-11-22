class GetPluginInfo
  def initialize
    Gon.global.container_main = "initialize"
    Gon.global.container_data = "initialize"
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
      if !ENV["DATA_NAME"].present?
        container_main = "unknown"
        container_data = "unknown"
      else
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
      end
    end
    Gon.global.container_main = container_main
    Gon.global.container_data = container_data
  end
end

GetPluginInfo.new
