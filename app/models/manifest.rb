require 'prawn'
require 'json'

class Manifest < ActiveRecord::Base
	def self.new(params)
		# if we don't need price (ie. if everything cann come off the page
		# then we can pass as params and won't have to do any lookups
		 
#		params[:orders].each do |delivery|
#			puts "delivery"
#			puts delivery[1]
#		end
#		
#		params[:orders].map { |delivery|  puts delivery
#								[ [ [ delivery['name'] ] ] ] }
#		
#		tabledata = params['orders'].map { |delivery|  [ [ [ delivery[1]['name'], delivery[1]['shipTo'], delivery[1]['product'], delivery[1]['quantity'].to_s + " Litres" ],
#																										[ "Order: " + delivery[1]['ordernum'], "Due date: " + delivery[1]['orderdate'], "Capacity: " + delivery[1]['capacity'].to_s, (delivery[1]['interval'] == true ? "Interval" : "") ] ] ] }
#
#		puts ActiveSupport::JSON.encode(tabledata)
#				
		Prawn::Document.generate("public\\manifest.pdf") do

			puts params['orders']
			puts params['orders'].values
			
			tabledata = params['orders'].map { |delivery|  t = [ [ delivery[1]['accesscode'], delivery[1]['name'], delivery[1]['shipTo'], delivery[1]['product'], delivery[1]['quantity'].to_s + " L" ],
#																											[ "", "Order: " + delivery[1]['ordernum'], "Due date: " + delivery[1]['orderdate'], "Capacity: " + delivery[1]['capacity'].to_s + " Litres", (delivery[1]['interval'] == true ? "Interval" : "") ] ]
																											[ "", "Order: " + delivery[1]['ordernum'], "Due date: " + DateTime.iso8601(delivery[1]['orderdate']).strftime("%Y-%m-%d"), "Capacity: " + delivery[1]['capacity'].to_s + " Litres", (delivery[1]['interval'] == true ? "Interval" : "") ] ]
																						 [ (make_table t, :cell_style => {:border_width => 0.5, :height => 25 } do
																						 			column(0).width = 75
																						 			column(1).width = 100
																						 			column(2).width = 200
																						 			column(3).width = 75
																						 			column(4).width = 50
																						 		end) ] }
	
#			puts ActiveSupport::JSON.encode(tabledata)
					
			line_width(0.5)
			bounding_box([0,740],:width => 80,:height => 30) do
				stroke_bounds
			end
			bounding_box([10,730],:width => 80,:height => 20) do
				text "Truck: " + params['truck']
			end

			bounding_box([200,740],:width => 150,:height => 30) do
				stroke_bounds
			end
			bounding_box([210,730],:width => 150,:height => 20) do
				text "Driver: " + (params['driver'] == nil ? "" : params['driver'])
			end

			bounding_box([350,740],:width => 150,:height => 30) do
				stroke_bounds
			end
			bounding_box([360,730],:width => 150,:height => 20) do
				text Time.new.strftime("%a, %b %e, %Y")
			end

			font_size(8)
			
			table (tabledata)
				
		end # end Prawn do
	end
end
