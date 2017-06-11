class LineItemController < ApplicationController

	def self.getLineItems(params)
	
		output = {}
		output[:customerName] = params[:customerName]
		output[:band] = params[:band]
		output[:payment] = params[:payment]
		output[:invoicenum] = params[:invoicenum]
		output[:lineItems] = []
		output[:taxes] = Hash.new
		output[:subtotal] = 0
		output[:total] = 0
		
		params[:items].keys.each do |key|
			url = Counter::Application.config.simplyurl + "items/" + params[:items][key][:lId] + ".json"
			resp = Net::HTTP.get_response(URI.parse(url));
			item = JSON.parse(resp.body)
			
			output[:lineItems] << Hash.new

			output[:lineItems] << Hash.new
			lineItem = output[:lineItems].last
			lineItem[:prodCode] = item['sPartCode']
			lineItem[:name] = item['sName']
			lineItem[:quantity] = params[:items][key][:quantity]
			lineItem[:price] = item['dPrice']
			if( lineItem[:prodCode] =~ /.*Yard .*/)
				lineItem[:price] -= fuelTaxDiscount(isNative(params[:band]),lineItem[:prodCode])
				if(params[:payment] == "0")
					lineItem[:price] = sprintf("%.4f", lineItem[:price].to_f - 0.015)
				end
			end
			lineItem[:amount] = "%.02f" % (lineItem[:price].to_f * params[:items][key][:quantity].to_f).round(2)
			lineItem[:taxes] = item['taxes']
			if (lineItem[:prodCode].match(/.*Yard.*/))
				lineItem[:includedTaxes] = { :total => "%.02f" % (taxTotal isNative(params[:band]), lineItem[:prodCode]), :taxes => (fuelTaxes isNative(params[:band]), lineItem) }
			end
	 		if (! lineItem[:prodCode].match(/Yard .*/) && ! ( lineItem[:prodCode] =~ /\AS.*/) )
				lineItem[:includedCharges] = ehc(item,params[:items][key][:quantity].to_f)
			end		
			# tax rules re: GST/PST
			# lube & misc
			#		if native
			#			no gst or pst
			#		else
			#			both
			# if fuel
			#   clr dsl & native
			#			no gst
			#		else
			#			gst	
			item['taxes'].each do |tax|
				if( taxApplicable( tax['name'], item['sPartCode'], isNative(params[:band]) ) )
					if output[:taxes][tax['name']] == nil
						output[:taxes][tax['name']] = 0
					end
					output[:taxes][tax['name']] += tax['rate'].to_f * lineItem[:amount].to_f / 100
				end
			end
			output[:subtotal] += lineItem[:amount].to_f
		end
		output[:total] = output[:subtotal]		
		output[:taxes].keys.each do |key|
			output[:total] += output[:taxes][key]
			output[:taxes][key] = "%.02f" % output[:taxes][key]
		end
		output[:subtotal] = "%.02f" % output[:subtotal]
		output[:total] = "%.02f" % output[:total]
		output[:invoicenum] = Time.new.strftime("%Y%m%d%H%M%S")
		
		puts output
		
	end			
end
		