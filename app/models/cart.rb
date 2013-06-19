class Cart < ActiveRecord::Base
  # attr_accessible :title, :body
  # see controller for params structure
  def self.new(params)
  	createCart(params)
	end

	def self.createCart(params)

		lineItems = lineItems(params)
		lineTotal = lineItems.inject(0) { | total, item | total + item[:amount].to_f }
#		taxTotal = lineItems.inject(0) { | total, item | total + item[:taxes][:total].to_f }
		taxTotal = taxTotal(lineItems,isNative(params[:band]))
			
		output = {
			:customerName => params[:customerName],
			:band => params[:band],
			:payment => params[:payment],
			:lineItems => lineItems,
			:subtotal => "%.02f" % lineTotal.round(2),
			:taxes =>  { :total => "%.02f" % taxTotal.round(2),
										:taxes => taxDetails(lineItems,isNative(params[:band] ) ) },
			:total => "%.02f" % ( lineTotal + taxTotal ),
#			:invoicenum => Time.new.strftime("%Y%m%d%H%M%S")	
#			:invoicenum => "test"
			:invoicenum => params[:invoicenum]	
		}
	
#		puts "Common:"
#		puts output
		
		output
				
	end	
	
	def self.lineItems(params)
		params[:items].keys.map { |key|
			url = Counter::Application.config.simplyurl + "items/" + params[:items][key][:lId] + ".json"
			resp = Net::HTTP.get_response(URI.parse(url));
			item = JSON.parse(resp.body)

#			puts sellingPrice(item,isNative(params[:band]),params[:payment])
			
			{
				:lId => item['lId'],
				:prodCode => item['sPartCode'],
				:name => item['sName'],
				:packaging => item['sSellUnit'],
				:quantity => params[:items][key][:quantity],
				:price => sellingPrice(item,isNative(params[:band]),params[:payment]),
				:amount => "%.02f" % (sellingPrice(item,isNative(params[:band]),params[:payment]).to_f * params[:items][key][:quantity].to_f),
				:includedTaxes => includedTaxes(item,isNative(params[:band]),params[:items][key][:quantity]),
 				:includedCharges => ehc(item,params[:items][key][:quantity].to_f),
 		 		:taxes => { :total => "%.02f" % (item['taxes'].inject(0) { | total, tax | total + tax['rate'].to_f * params[:items][key][:quantity].to_f * sellingPrice(item,isNative(params[:band]),params[:payment]).to_f } / 100 ), 
 		 								:taxes => item['taxes'].map { |tax|  { :name => tax['name'], :rate => tax['rate'],
 		 										:amount =>  "%.02f" % (sellingPrice(item,isNative(params[:band]),params[:payment]).to_f * params[:items][key][:quantity].to_f * tax['rate'].to_f / 100)} } }
			}
		}
	end
	
	def self.sellingPrice(item,native,payment)
		if( item['sPartCode'] =~ /.*Yard .*/)
			price = item['dPrice'].to_f
			price -= fuelTaxRateDiscount(native,item['sPartCode'])
			if(payment == "0")
				price -= 0.015
			end
			price = sprintf("%.04f", price)
		else
			item['dPrice']
		end
	end

	def self.includedTaxes(item,native,quantity)
		if (item['sPartCode'].match(/.*Yard.*/))
			{ :total => "%.02f" % (fuelTaxTotal (fuelTaxes native, item, quantity),native, item['sPartCode']), :taxes => (fuelTaxes native, item, quantity) }
		else
			nil
		end
	end
	
	def self.ehc(item,quantity)
#		puts item
#		if (! item['sPartCode'].match(/Yard .*/) && ! ( item['sPartCode'] =~ /\AS.*/) )
#			puts item['ehc']['rate']
#			puts item['ehc']['quantity']
#			puts quantity
#			puts ( item['ehc']['rate'].to_f * item['ehc']['quantity'].to_f * quantity )
#		end
		
		(! item['sPartCode'].match(/Yard .*/) && ! ( item['sPartCode'] =~ /\AS.*/) ) ?
			{ :rate => "%.02f" % item['ehc']['rate'], 
				:amount => "%.02f" % 
					( item['ehc']['rate'].to_f * item['ehc']['quantity'].to_f * quantity ) }
			:
				nil
	end

	def self.taxDetails(items,native)
		# this processed could be changed to an inject n the items array
		# with an initial value of {:total=>0.0, taxes=[]}
		# and update with the result of inject'ing taxes list (init'd with result)
		
		result = {}
		items.each do |item|
			item[:taxes][:taxes].each do |tax|
				if( taxApplicable( tax[:name], item[:prodCode], native ) )
					if result[tax[:name]] == nil
						result[tax[:name]] = 0
					end
					result[tax[:name]] += (tax[:rate].to_f * item[:amount].to_f / 100).round(2)
				end
			end
		end
		result
	end

	def self.isNative(band)
		band.length > 0 ? true : false
	end
					
	def self.taxList(native,prodCode)
		if native && prodCode.match(/.*Yard LS.*/)
			[ {:name => "FET", :rate => 0.04} ]
		else
			{ "Yard LS" => [ { :name => "MFT", :rate => 0.15 }, 
												{ :name => "FET", :rate => 0.04 },
												{ :name => "Carbon", :rate => 0.0767 } ],
				"Yard DLSD" => [ { :name => "MFT", :rate => 0.03 },
													{ :name => "FET", :rate => 0.04 },
													{ :name => "Carbon", :rate => 0.0767 } ],
				"Yard RU" => [ { :name => "MFT", :rate => 0.145 },
												{ :name => "FET", :rate => 0.10 },
												{ :name => "Carbon", :rate => 0.0667 } ],
				"Yard SD" => [ { :name => "MFT", :rate => 0.03 },
												{ :name => "FET", :rate => 0.04 },
												{ :nane => "Carbon", :rate => 0.0767 } ] } [prodCode]
		end
	end
	
	def self.fuelTaxRateTotal(native,prodCode)
		total = taxList(native,prodCode).inject(0) do |total, tax|
			total + tax[:rate]
		end
		return total
	end

	def self.fuelTaxTotal(taxes,native,prodCode)
		total = taxes.inject(0.0) do |total, tax|
			total + tax[:amount].to_f
		end
		total
	end

	def self.fuelTaxRateDiscount(native,prodCode)
		puts fuelTaxRateTotal(native,prodCode)
		return fuelTaxRateTotal(false,prodCode) - fuelTaxRateTotal(native,prodCode)
	end
	
	def self.fuelTaxes(native,item,quantity)
		taxList(native,item['sPartCode']).map { |tax|
			{ :name => tax[:name], :rate => ("%.05f" % tax[:rate].to_f), :amount => ("%.02f" % (tax[:rate].to_f * quantity.to_f))}
		}
	end
	
	# change this to just return the result of the compares
	def self.taxApplicable(tax,prodCode,native)
		result = true
		case tax
		when "PST"
			if ( ! prodCode.match(/.*Yard.*/) && ! native )
				result = true
			else
				result = false
			end
		when "GST"
			# for GST
			#  if native purchasing fuel other than  ls or non-native purchasing anything
			#    pay gst	
			#  else - native purchasing ls or non-fuel
			#    no gst
			if ( native && prodCode.match(/^Yard ((?!LS).*)$/) ) || ! native
				result = true
			else
				result = false
			end
		end
		
	end
	
	def self.taxTotal(items,native)
		taxes = items.inject({}) { |result,item| 
			item[:taxes][:taxes].inject(result) { |result,tax|
				if(taxApplicable(tax[:name],item[:prodCode],native)) 
					updateTaxResult(result,tax,item) 
				else 
					result
				end 
			}
		}
		taxes.keys.inject(0) { |total,key| total + key * taxes[key] / 100 }
	end

	def self.updateTaxResult(result,tax,item)
		if result[tax[:rate]] == nil
			result[tax[:rate]] = 0
		end
		result[tax[:rate]] += item[:amount].to_f
		result
	end
	
end
