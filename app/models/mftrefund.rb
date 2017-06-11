require 'prawn'

class Mftrefund < ActiveRecord::Base
  # attr_accessible :title, :body

  ITEM_TAXES = [ { :partCode => 'TF000222', :taxes => [ { 'MFT' => 0.115 } ] }, 	# dyed supreme
  								{ :partCode => 'TF000940', :taxes => [ { 'MFT' => 0.110 } ] }, 	# clear gas
  								{ :partCode => 'TF000941', :taxes => [ { 'MFT' => 0.115 } ] },	# dyed gas
  								{ :partCode => 'TF000942', :taxes => [ { 'MFT' => 0.110 } ] },	# clear supreme
  								{ :partCode => 'TF000962', :taxes => [ { 'MFT' => 0.110 } ] },	# clear diesel
  								{ :partCode => 'TF000998', :taxes => [ { 'MFT' => 0.120 } ] },	# bogus - represents purchases of clear diesel dyed by purchaser
  								{ :partCode => 'TF000999', :taxes => [ { 'MFT' => 0.120 } ] }		# bogus - represents purchases of clear diesel dyed by purchaser for sale as furnace oil
  							]
  							
	def self.new(params)
	
#		url = Counter::Application.config.simplyurl + %Q{fuelsales.json?startdate=#{params[:startdate]}&enddate=#{params[:enddate]}&}
#		resp = Net::HTTP.get_response(URI.parse(url));
#		fuelsales = JSON.parse(resp.body)
		fuelsales = JSON.parse(Net::HTTP.get_response(URI.parse(
			Counter::Application.config.simplyurl + %Q{fuelsales.json?startdate=#{params[:startdate]}&enddate=#{params[:enddate]}&})).body)
	
		puts ['TF000222','TF000941'].inject(0.0) {|tot,partCode|
			tot + fuelsales.select {|sale| sale['partCode'] == partCode}.inject(0.0) {|saletot,sale|
				saletot + (sale['quantity'].to_f * (ITEM_TAXES.select {|tax| tax[:partCode] == partCode}[0])[:taxes][0]['MFT'].to_f).round(2)
			}
		}
		
		puts ['TF000962','TF000940','TF000942'].inject(0.0) {|tot,partCode|
			tot + fuelsales.select {|sale| sale['partCode'] == partCode}.inject(0.0) {|saletot,sale|
				saletot + (sale['quantity'].to_f * (ITEM_TAXES.select {|tax| tax[:partCode] == partCode}[0])[:taxes][0]['MFT'].to_f).round(2)
			}
		}
		
#		refitem = JSON.parse(Net::HTTP.get_response(URI.parse(
#			Counter::Application.config.simplyurl + %Q{items/TF000963.json?status=false&type=C&priceList=1&search=prodcode})).body)
 
#		puts refitem.inspect

		puts 'rate'
		puts JSON.parse(Net::HTTP.get_response(URI.parse(
			Counter::Application.config.simplyurl + 
				%Q{items/TF000963.json?status=false&type=C&priceList=1&search=prodcode})).body)['taxes'][0]['taxes'].select {|tax| 
					tax['name'] == 'MFT'}[0]['rate']
		
		puts fuelsales.select {|sale| sale['partCode'] == 'TF000962'}.inject(0.0) {|tot,sale|
			tot + (sale['exemptions'].length > 0 ?
				sale['exemptions'].inject(0.0) {|extot,app|
					extot + app['taxes'].select {|tax| tax['name'] == 'MFT'}.inject(0.0) {|taxtot,tax| taxtot + app['ratio'].to_f * tax['rate'].to_f } }
			: 0 ) * sale['quantity'].to_f }
			
		puts fuelsales.select {|sale| sale['partCode'] == 'TF000940' && sale['shiptoinfo'] =~ /.*T:[C1].*/ && ['300','550','950'].index(getRC(invoice)) != nil}.inject(0.0) {|tot,sale|
			tot + (sale['exemptions'].length > 0 ?
				sale['exemptions'].inject(0.0) {|extot,app|
					extot + app['taxes'].select {|tax| tax['name'] == 'MFT'}.inject(0.0) {|taxtot,tax| taxtot + app['ratio'].to_f * tax['rate'].to_f } }
			: 0 ) * sale['quantity'].to_f }
			
		grandtotal = 0.0
		
		Prawn::Document.generate("public\\mftrefund.pdf", :template => "public\\MFTRef.pdf", :margin => 25) do
			go_to_page(3)
			font_size(12)
			draw_text "Fast Fuel Services Ltd.", :at => [0,575], :style => :bold
			draw_text "136231420", :at => [450,575], :style => :bold
			draw_text "PO Box 219 Queen Charlotte, BC, V0T 1S0", :at => [0,548], :style => :bold
			draw_text "Tracy Auchter", :at => [0,521], :style => :bold
			draw_text "250  559-4611", :at => [447,521], :style => :bold
			draw_text "Brenda Winter, Fast Fuel Services Ltd.", :at => [0,468], :style => :bold
			draw_text "250  559-4611", :at => [447,468], :style => :bold
			draw_text "tracy.auchter@fastfuel.ca", :at => [0,430], :style => :bold
			draw_text "brenda.winter@fastfuel.ca", :at => [285,430], :style => :bold
#			draw_text "2013/10/01", :at => [120,385], :style => :bold
#			draw_text "2013/10/31", :at => [285,385], :style => :bold
			draw_text params[:startdate], :at => [120,385], :style => :bold
			draw_text params[:enddate], :at => [285,385], :style => :bold
			# fuel exported for sale outside bc - hardcoded to 0
			text_box "$0.00", :at => [462,357], :height => 100, :width => 100, :align => :right, :style => :bold
			# clear gas and diesel that was dyed and sold as oloured fuel
#			text_box "$3,621.51", :at => [462,336], :height => 100, :width => 100, :align => :right, :style => :bold
			x = ['TF000222','TF000941'].inject(0.0) {|tot,partCode|
				tot + fuelsales.select {|sale| sale['partCode'] == partCode}.inject(0.0) {|saletot,sale|
					saletot + (sale['quantity'].to_f * (ITEM_TAXES.select {|tax| 
						tax[:partCode] == partCode}[0])[:taxes][0]['MFT'].to_f).round(2)
					}
				}
			text_box ActionController::Base.helpers.number_to_currency(x), :at => [462,336], :height => 100, :width => 100, :align => :right, :style => :bold
			grandtotal += x
			# clear gas and diesel purchased withn the SCTA or VRTA and sold outside
#			text_box "$27,646.39", :at => [462,315], :height => 100, :width => 100, :align => :right, :style => :bold
			x = ['TF000962','TF000940','TF000942'].inject(0.0) {|tot,partCode|
				tot + fuelsales.select {|sale| sale['partCode'] == partCode}.inject(0.0) {|saletot,sale|
					saletot + (sale['quantity'].to_f * (ITEM_TAXES.select {|tax| 
						tax[:partCode] == partCode}[0])[:taxes][0]['MFT'].to_f).round(2)
				}
			}
			text_box ActionController::Base.helpers.number_to_currency(x), :at => [462,315], :height => 100, :width => 100, :align => :right, :style => :bold
			grandtotal += x
			# dyed diesel sold as heating oil
#			text_box "$894.09", :at => [462,294], :height => 100, :width => 100, :align => :right, :style => :bold
			x = fuelsales.select {|sale| 
				sale['partCode'] == 'TF000951'}.inject(0.0) {|tot,sale| 
					tot + sale['quantity'].to_f } * Mftrefund.getMFT('TF000963') 
			text_box ActionController::Base.helpers.number_to_currency(x), :at => [462,294], :height => 100, :width => 100, :align => :right, :style => :bold
			grandtotal += x
			# fuel relabelled and sold at lower tax rate
#			text_box "$120.96", :at => [462,273], :height => 100, :width => 100, :align => :right, :style => :bold
			x = fuelsales.select {|sale| 
				sale['partCode'] == 'TF000953'}.inject(0.0) {|tot,sale| 
					tot + sale['quantity'].to_f } * Mftrefund.getMFT('TF000953') 
			text_box ActionController::Base.helpers.number_to_currency(x), :at => [462,273], :height => 100, :width => 100, :align => :right, :style => :bold
			grandtotal += x
			# fuel sold to status indians and indian bands
#			text_box "$516.74", :at => [462,252], :height => 100, :width => 100, :align => :right, :style => :bold
			x = fuelsales.inject(0.0) {|tot,sale|
				tot + (sale['exemptions'].length > 0 ?
					sale['exemptions'].inject(0.0) {|extot,app|
						extot + app['taxes'].select {|tax| tax['name'] == 'MFT'}.inject(0.0) {|taxtot,tax| taxtot + app['ratio'].to_f * tax['rate'].to_f } }
				: 0 ) * sale['quantity'].to_f }
			text_box ActionController::Base.helpers.number_to_currency(x), :at => [462,252], :height => 100, :width => 100, :align => :right, :style => :bold
			grandtotal += x
			# fuel sold to exempt fuel retailers (just gas)
#			text_box "$9.963.46", :at => [462,231], :height => 100, :width => 100, :align => :right, :style => :bold
			x = fuelsales.select {|sale| 
				sale['partCode'] == 'TF000940' && 
				sale['shiptoinfo'] =~ /.*T:[C1].*/ && 
				['300','550','950'].index(getRC(invoice)) != nil}.inject(0.0) {|tot,sale|
					tot + (sale['exemptions'].length > 0 ?
						sale['exemptions'].inject(0.0) {|extot,app|
							extot + app['taxes'].select {|tax| tax['name'] == 'MFT'}.inject(0.0) {|taxtot,tax| taxtot + app['ratio'].to_f * tax['rate'].to_f } }
					: 0 ) * sale['quantity'].to_f }
			text_box ActionController::Base.helpers.number_to_currency(x), :at => [462,231], :height => 100, :width => 100, :align => :right, :style => :bold
			grandtotal += x
			
			# dyed fuel sold to farmers - do we assume 0?
			text_box "$0.00", :at => [462,210], :height => 100, :width => 100, :align => :right, :style => :bold
			# fuel sold to registered consumers, visiting forces or diplomats/consular eempt of tax
			text_box "$0.00", :at => [462,189], :height => 100, :width => 100, :align => :right, :style => :bold
			# substances sold as non-fuel motor oil
			text_box "$0.00", :at => [462,168], :height => 100, :width => 100, :align => :right, :style => :bold
			# propane sold exempt of tax
			text_box "$0.00", :at => [462,147], :height => 100, :width => 100, :align => :right, :style => :bold
			# other
			text_box "$0.00", :at => [462,126], :height => 100, :width => 100, :align => :right, :style => :bold
			# total
#			text_box "$42,763.15", :at => [462,105], :height => 100, :width => 100, :align => :right, :style => :bold
			text_box ActionController::Base.helpers.number_to_currency(grandtotal), :at => [462,105], :height => 100, :width => 100, :align => :right, :style => :bold
			draw_text "Tracy Auchter, secretary", :at => [195,15], :style => :bold
		end
	end
	
	def self.getMFT(partCode)
		JSON.parse(Net::HTTP.get_response(URI.parse(
			Counter::Application.config.simplyurl + 
				%Q{items/#{partCode}.json?status=false&type=C&priceList=1&search=prodcode})).body)['taxes'][0]['taxes'].select {|tax| 
					tax['name'] == 'MFT'}[0]['rate'].to_f
	end
	
	def self.isStatus(sale)
	
		sale['custinfo'].match(/Band:(\d*-*\d*)/) != nil &&
			['300','550','950'].index(getRC(invoice)) != nil
	end
	
	def self.getRC(sale)
		sale['custinfo'].match(/RC:(\d*)/) != nil ? sale['custinfo'].match(/RC:(\d*)/)[1] : ''
	end
	
end
