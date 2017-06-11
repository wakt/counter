require 'net/http'
require "uri"
require 'json'

class Order < ActiveRecord::Base
  # attr_accessible :title, :body
  
  def self.all
#		@customers = Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'customers.json'))
		Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'orders.json'))
	end
	
	def self.find(params)
		if !params[:recordstartindex].blank? then
			@orders = Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'orders/' + params[:id] + '.json?type=' + params[:type] + 
				'&start=' + params[:recordstartindex].to_s + '&count=' + (params[:recordendindex].to_i - params[:recordstartindex].to_i).to_s ) )
		else
			@orders = Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'orders/' + params[:id] + '.json?type=' + params[:type]))
#			puts @orders.inspect
			@orders
		end
	end
	
	def self.new(params)
		uri = URI(Counter::Application.config.simplyurl + 'orders/new.json')
		uri.query = URI.encode_www_form(params);
		return Net::HTTP.get_response(uri);
	end
	
	def self.update(params)
		uri = URI.parse(Counter::Application.config.simplyurl)
		http = Net::HTTP.new(uri.host, uri.port)
		
		request = Net::HTTP::Put.new('/orders/' + params[:id] + '.json')
		request.set_form_data(params)
		return http.request(request)
	end
	
	def self.destroy(params)
		uri = URI.parse(Counter::Application.config.simplyurl)
		http = Net::HTTP.new(uri.host, uri.port)

		request = Net::HTTP::Delete.new('/orders/' + params[:id] + '.json')
		request.set_form_data(params)
		return http.request(request)
	end
	
	def self.fulfill(params)
		uri = URI.parse(Counter::Application.config.simplyurl)
		http = Net::HTTP.new(uri.host, uri.port)
		
		request = Net::HTTP::Post.new('/orders.json')
		
		# ok, this join stuff is bogus - it encodes properly, but the other side only sees the last element and loses the array type - it's just string
		# this way, i 'split' it at the other side to recover my array
		# it should work without the join/split crap, but it doesn't
		request.set_form_data(params)
		
		response = http.request(request)
	end
		
end
