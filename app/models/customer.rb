require 'net/http'
require 'json'

class Customer < ActiveRecord::Base
  # attr_accessible :title, :body
  
  def self.all
		Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'customers.json'))
	end
	  
end
