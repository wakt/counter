require 'net/http'
require "uri"
require 'json'

class Fuelprice < ActiveRecord::Base
  # attr_accessible :title, :body
  
  def self.find(list)
  	return Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + %Q{fuelprices/#{list}.json}))
  end

end
