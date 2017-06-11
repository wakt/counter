require 'prawn'

class Carbontaxrefund < ActiveRecord::Base
  # attr_accessible :title, :body

	totalA = 0
	totalB = 0
	totalC = 0
	
	def self.new(params)

		fuelsales = JSON.parse(Net::HTTP.get_response(URI.parse(
			Counter::Application.config.simplyurl + %Q{fuelsales.json?startdate=#{params[:startdate]}&enddate=#{params[:enddate]}&})).body)
	
		totalA = 0
		totalB = 0
		totalC = 0
		
		Prawn::Document.generate("public\\carbontaxrefund.pdf", :template => "public\\CarbonRef.pdf", :margin => 25) do
			go_to_page(3)
			font_size(10)
			draw_text "Fast Fuel Services Ltd.", :at => [0,570], :style => :bold
			draw_text "136231420", :at => [450,570], :style => :bold
			draw_text "PO Box 219", :at => [0,545], :style => :bold
			draw_text "Queen Charlotte, BC", :at => [0,533], :style => :bold
			draw_text "V0T 1S0", :at => [0,521], :style => :bold
			draw_text "Tracy Auchter", :at => [340,546], :style => :bold
			draw_text "250    559-4611", :at => [483,546], :style => :bold
			draw_text "tracy.auchter@fastfuel.ca", :at => [340,521], :style => :bold
			draw_text "250    559-4512", :at => [483,521], :style => :bold
			draw_text "\x0fc", :at => [350,505], :style => :bold
#			draw_text "2013/10/01", :at => [60,403], :style => :bold
			draw_text params[:startdate], :at => [60,403], :style => :bold
#			draw_text "2013/10/31", :at => [152,403], :style => :bold
			draw_text params[:enddate], :at => [152,403], :style => :bold
			draw_text "Diesel/Furnace", :at => [312,372], :style => :bold
			draw_text "Gasoline", :at => [412,372], :style => :bold
			draw_text "Stove Oil", :at => [501,372], :style => :bold
			# clear diesel and furnace oil sold to status indians or indian bands
#			text_box "11,459", :at => [295,236], :height => 100, :width => 100, :align => :center, :style => :bold
			x = fuelsales.select {|sale| (sale['partCode'] == 'TF000962' || sale['partCode'] == 'TF000948') &&
				sale['exemptions'].length > 0 }.inject(0.0) {|tot,sale|
				tot +  sale['quantity'].to_f }
			text_box "%d" % x.round(0), :at => [295,236], :height => 100, :width => 100, :align => :center, :style => :bold
			totalA += x
			# gasoline sold to exempt fuel retailers
#			text_box "68,714", :at => [380,220], :height => 100, :width => 100, :align => :center, :style => :bold
			x = fuelsales.select {|sale| 
				sale['partCode'] == 'TF000940' && 
				sale['shiptoinfo'] =~ /.*T:[C1].*/ && 
				['300','550','950'].index(getRC(invoice)) != nil}.inject(0.0) {|tot,sale|
					tot + sale['quantity'].to_f }
			text_box "%d" % x.round(0), :at => [380,220], :height => 100, :width => 100, :align => :center, :style => :bold
			totalB += x
			# stove oil sold to status indians or indian bands
#			text_box "1,316", :at => [465,236], :height => 100, :width => 100, :align => :center, :style => :bold
			x = fuelsales.select {|sale| sale['partCode'] == 'TF000948' && sale['exemptions'].length > 0 }.inject(0.0) {|tot,sale|
				tot + sale['quantity'].to_f }
			text_box "%d" % x.round(0), :at => [465,236], :height => 100, :width => 100, :align => :center, :style => :bold
			totalC += x
#			text_box "11,459", :at => [295,150], :height => 100, :width => 100, :align => :center, :style => :bold
			text_box "%d" % totalA.round(0), :at => [295,150], :height => 100, :width => 100, :align => :center, :style => :bold
#			text_box "68,714", :at => [380,150], :height => 100, :width => 100, :align => :center, :style => :bold
			text_box "%d" % totalB.round(0), :at => [380,150], :height => 100, :width => 100, :align => :center, :style => :bold
#			text_box "1,316", :at => [465,150], :height => 100, :width => 100, :align => :center, :style => :bold
			text_box "%d" % totalC.round(0), :at => [465,150], :height => 100, :width => 100, :align => :center, :style => :bold
#			text_box "$0.0767", :at => [295,135], :height => 100, :width => 100, :align => :center, :style => :bold
			taxA = Carbontaxrefund.getCarbonTax('TF000962')
			text_box "$" + "%.04f" % taxA, :at => [295,135], :height => 100, :width => 100, :align => :center, :style => :bold
#			text_box "$0.0667", :at => [380,135], :height => 100, :width => 100, :align => :center, :style => :bold
			taxB = Carbontaxrefund.getCarbonTax('TF000940')
			text_box "$" + "%.04f" % taxB, :at => [380,135], :height => 100, :width => 100, :align => :center, :style => :bold
#			text_box "$0.0783", :at => [465,135], :height => 100, :width => 100, :align => :center, :style => :bold
			taxC = Carbontaxrefund.getCarbonTax('TF000948')
			text_box "$" + "%.04f" % taxC, :at => [465,135], :height => 100, :width => 100, :align => :center, :style => :bold
#			text_box "$878.91", :at => [295,121], :height => 100, :width => 100, :align => :center, :style => :bold
			text_box ActionController::Base.helpers.number_to_currency(totalA * taxA), :at => [295,121], :height => 100, :width => 100, :align => :center, :style => :bold
#			text_box "$4,583.22", :at => [380,121], :height => 100, :width => 100, :align => :center, :style => :bold
			text_box ActionController::Base.helpers.number_to_currency(totalB * taxB), :at => [380,121], :height => 100, :width => 100, :align => :center, :style => :bold
#			text_box "$103.04", :at => [465,121], :height => 100, :width => 100, :align => :center, :style => :bold
			text_box ActionController::Base.helpers.number_to_currency(totalC * taxC), :at => [465,121], :height => 100, :width => 100, :align => :center, :style => :bold
#			text_box "$5,565.17", :at => [465,106], :height => 100, :width => 100, :align => :center, :style => :bold
			text_box ActionController::Base.helpers.number_to_currency((totalA * taxA).round(2) + (totalB * taxB).round(2) + (totalC * taxC).round(2)), :at => [465,106], :height => 100, :width => 100, :align => :center, :style => :bold
			draw_text "Tracy Auchter, secretary", :at => [239,15], :style => :bold
		end	
	end

	def self.getCarbonTax(partCode)
		JSON.parse(Net::HTTP.get_response(URI.parse(
			Counter::Application.config.simplyurl + 
				%Q{items/#{partCode}.json?status=false&type=C&priceList=1&search=prodcode})).body)['taxes'][0]['taxes'].select {|tax| 
					tax['name'] == 'Carbon tax'}[0]['rate'].to_f
	end
		
end
