require 'taxation' 

class Cart < ActiveRecord::Base
	
  # attr_accessible :title, :body
  # see controller for params structure
  def self.new(params)
  	# default to a yard sale
#  	puts ({ :regioncode => 950 }.merge(params))
  	createCart({ :regioncode => 950 }.merge(params))
#  	createCart(params)
	end

	def self.createCart(params)

#		puts params
#		lineItems = lineItems(params)
		lineItems = lineItemsNew(params)
		lineTotal = lineItems.inject(0) { | total, item | total + item[:amount].to_f }
#		taxTotal = lineItems.inject(0) { | total, item | total + item[:taxes][:total].to_f }
#		taxTotal = taxTotal(lineItems,isNative(params['band']))
		taxTotal = taxTotal(lineItems)
		
#		puts 'taxtotal GST'
#		puts lineItems.inject([]) {|applications,lineItem| 
#			applications << lineItem[:taxapplications].inject([]) {|taxes,application| 
#				taxes << application[:taxes][:taxes] } }.flatten.sort {|x,y| x[:name] <=> y[:name]}.group_by {|tax|
#				tax[:name] }
#		puts 'a'
#		puts lineItems.inject([]) {|applications,lineItem| 
#			applications << lineItem[:taxapplications].inject([]) {|taxes,application| 
#				taxes << application[:taxes][:taxes] } }.flatten.sort {|x,y| x[:name] <=> y[:name]}.group_by {|tax|
#					tax[:name] }.map {|taxname, taxdetails| {:name => taxname, :amount => taxdetails.inject(0.0) {|total,tax| 
#						total + tax[:taxableamount].to_f * tax[:rate].to_f } } }
#		puts 'a1'
#		puts "%.02f" % lineItems.inject([]) {|applications,lineItem| 
#			applications << lineItem[:taxapplications].inject([]) {|taxes,application| 
#				taxes << application[:taxes][:taxes] } }.flatten.sort {|x,y| x[:name] <=> y[:name]}.group_by {|tax|
#					tax[:name] }.map {|taxname, taxdetails| taxdetails.inject(0.0) {|total,tax| 
#						total + tax[:taxableamount].to_f * tax[:rate].to_f } }.inject(:+)
#		puts 'b'
#		puts lineItems.inject([]) {|applications,lineItem| 
#			applications << lineItem[:taxapplications].inject([]) {|taxes,application| 
#				taxes << application[:taxes][:taxes] } }.flatten.sort {|x,y| x[:name] <=> y[:name]}.group_by {|tax|
#				tax[:name] }['GST'].inject(0.0) {|total,tax| total + tax[:taxableamount].to_f}
#		puts 'c'
#		puts lineItems.inject([]) {|applications,lineItem| 
#			applications << lineItem[:taxapplications].inject([]) {|taxes,application| 
#				taxes << application[:taxes][:taxes] } }.flatten.sort {|x,y| x[:name] <=> y[:name]}.group_by {|tax|
#				tax[:name] }['GST'][0][:rate]
#		puts 'taxtotal PST'
#		puts lineItems.inject([]) {|applications,lineItem| 
#			applications << lineItem[:taxapplications].inject([]) {|taxes,application| 
#				taxes << application[:taxes][:taxes] } }.flatten.sort {|x,y| x[:name] <=> y[:name]}.group_by {|tax|
#					tax[:name] }['PST']
			
		output = {
			:customerName => params['customerName'],
			:band => params[:band],
			:payment => params['payment'],
			:lineItems => lineItems,
			:subtotal => "%.02f" % lineTotal.round(2),
#			:taxes =>  { :total => "%.02f" % taxTotal.round(2),
#										:taxes => taxDetails(lineItems,isNative(params[:'band'] ) ) },
			:taxes =>  { :total => "%.02f" % taxTotal.round(2) },
			:total => "%.02f" % ( lineTotal + taxTotal ),
#			:invoicenum => Time.new.strftime("%Y%m%d%H%M%S")	
#			:invoicenum => "test"
			:invoicenum => params['invoicenum'],
			:comment => params['comment']	
		}
	
		puts "Common:"
		puts output
		
		output
				
	end	
	
	def self.lineItems(params)
		params['items'].keys.map { |key|
			url = Counter::Application.config.simplyurl + "items/" + params['items'][key][:lId] + ".json"
			resp = Net::HTTP.get_response(URI.parse(url));
			item = JSON.parse(resp.body)

#			puts sellingPrice(item,isNative(params[:band]),params[:payment])
			
			{
				:lId => item['lId'],
				:prodCode => item['sPartCode'],
				:name => item['sName'],
				:packaging => item['sSellUnit'],
				:quantity => params['items'][key][:quantity],
				:price => Taxation::sellingPrice(item,isNative(params[:band]),params[:payment]),
				:amount => "%.02f" % (Taxation::sellingPrice(item,isNative(params[:band]),params[:payment]).to_f * params['items'][key][:quantity].to_f),
				:includedTaxes => includedTaxes(item,isNative(params[:band]),params['items'][key][:quantity]),
 				:includedCharges => ehc(item,params['items'][key][:quantity].to_f),
 		 		:taxes => { :total => "%.02f" % (item['taxes'].inject(0) { | total, tax | total + tax['rate'].to_f * params['items'][key][:quantity].to_f * Taxation::sellingPrice(item,isNative(params[:band]),params[:payment]).to_f } / 100 ), 
 		 								:taxes => item['taxes'].map { |tax|  { :name => tax['name'], :rate => tax['rate'],
 		 										:amount =>  "%.02f" % (Taxation::sellingPrice(item,isNative(params[:band]),params[:payment]).to_f * params['items'][key][:quantity].to_f * tax['rate'].to_f / 100)} } }
			}
		}
	end
	
	def self.lineItemsNew(params)
		puts 'a'
		puts params
#		puts 'b'
#		puts params['items']
#		puts params['items']["0"]
#		puts params['items']["0"][:lId].to_s
#		puts 'c'
#		puts isNative(params[:band]).to_s
#		puts 'd'
#		puts params[:type].to_s
#		puts 'e'
		params['items'].keys.map { |key|
			
			item = ( params['items'][key][:item] != nil ? params['items'][key][:item] : (
				url = Counter::Application.config.simplyurl + "items/" + params['items'][key][:lId].to_s + ".json?status=" +
					params['status'].to_s + "&type=" + params['type'].to_s + "&priceList=" + params['priceList'] + "&"
				resp = Net::HTTP.get_response(URI.parse(url));
				JSON.parse(resp.body)
			))

#			puts 'a'
#			puts item
#			puts 'b'
#			puts item['taxes'].select {|tax| tax['type'] == 'volume'}
#			puts 'c'
				
#			puts sellingPrice(item,isNative(params[:band]),params[:payment])
			
			{
				:lId => item['lId'],
				:prodCode => item['sPartCode'],
				:name => item['sName'],
				:packaging => item['sSellUnit'],
				:quantity => params['items'][key][:quantity],
				:price => sellingPrice(item,params),
				:baseprice => item['baseprice'],
				:amount => "%.02f" % (sellingPrice(item,params).to_f * params['items'][key][:quantity].to_f),
				:taxapplications => item['taxes'].map {|application|
					{
					:ratio => application['ratio'],
					:includedTaxes => (item['sPartCode'] =~ /^Yard.*/ || item['sPartCode'] =~ /^TF.*/) ?
						{ :total => "%.02f" %  application['taxes'].select {|tax| 
								tax['type'] == 'volume'}.inject(0.0) {|accum,tax| accum + tax['rate'].to_f * 
								params['items'][key][:quantity].to_f} * application['ratio'].to_f, 
							:taxes=> application['taxes'].select {|tax| tax['type'] == 'volume'}.map {|tax|
								tax.merge(
									{ :amount => "%.02f" % (tax['rate'].to_f * params['items'][key][:quantity].to_f ),
										:effectiverate => tax['rate'].to_f * application['ratio'].to_f } ) } } : nil,
	 		 		:taxes => { 
	 		 								:total => "%.02f" % (application['taxes'].select {|tax| 
	 		 										tax['type'] != 'volume' }.inject(0) { |total,tax | total + tax['rate'].to_f * 
	 		 									params['items'][key][:quantity].to_f *
#	 		 									(tax['type'] == 'base' ? item['baseprice'].to_f : 
	 		 									(tax['type'] == 'base' ? baseprice(item,params) : 
	 		 									sellingPrice(item,params).to_f) *
	 		 								  application['ratio'].to_f } ), 
	 		 								:taxes => application['taxes'].select {|tax| tax['type'] != 'volume' }.map {|tax|
	 		 									  {:name => tax['name'], :rate => tax['rate'],
	 		 									   :slot => tax['slot'],
#	 		 										:amount =>  "%.02f" % (Taxation::sellingPrice(item,isNative(params['band']),params['payment']).to_f * 
#		 		 									:taxableamount => "%.02f" % ( (tax['type'] == 'base' ? item['baseprice'].to_f : 
#	 		 											sellingPrice(item,params['payment']).to_f) * 
		 		 									:taxableamount => "%.02f" % ( (tax['type'] == 'base' ? baseprice(item,params) : 
	 		 											sellingPrice(item,params).to_f) * 
		 		 										params['items'][key]['quantity'].to_f * 
				 		 								application['ratio'].to_f),
				 		 							:effectiverate => tax['rate'].to_f * application['ratio'].to_f,	
#	 		 										:amount =>  "%.02f" % ( (tax['type'] == 'base' ? item['baseprice'].to_f : 
	 		 										:amount =>  "%.02f" % ( (tax['type'] == 'base' ? baseprice(item,params) : 
	 		 											sellingPrice(item,params).to_f) * 
		 		 										params['items'][key]['quantity'].to_f * tax['rate'].to_f *
				 		 								application['ratio'].to_f)} } } } },	
	 				:includedCharges => ehc(item,params['items'][key][:quantity].to_f),
			}
		}
	end

	def self.sellingPrice(item,params) 
#		puts 'selling'
#		puts item['dPrice'].to_f + item['taxes'].
#			inject(item['baseprice'].to_f) {|accum,application| 
#					application['ratio'].to_f * (application['taxes'].select {|tax|
#					tax['type'] == 'volume' }.inject(0) {|taxtotal,tax| taxtotal + tax['rate'].to_f } ) } +
#					(item['sPartCode'] =~ /Yard.*/ && params['payment'] == "0" ? (0 - 0.015) + item['statuspremium'].to_f : 0)

#		puts 'cc'
#		puts item.inspect
#		puts 'cc1'
#		puts item['taxes']
#		puts 'cc2'
		
		
		x = item['baseprice'].to_f + item['taxes'].
			inject(item['baseprice'].to_f) {|accum,application| 
					application['ratio'].to_f * (application['taxes'].select {|tax|
					tax['type'] == 'volume' }.inject(0) {|taxtotal,tax| taxtotal + tax['rate'].to_f } ) } +
					(item['sPartCode'] =~ /Yard.*/ && params['payment'] == "0" ? (0 - 0.015) + statuspremium(item,params) : statuspremium(item,params))
		puts params
		puts "selling price: %.04f" % x
		x
	end
	
	def self.baseprice(item,params)
		item['baseprice'].to_f + (item['sPartCode'] =~ /Yard.*/ && params['payment'] == "0" ? (0 - 0.015) : 0.0)
		puts "baseprice: %.04f" % (item['baseprice'].to_f + (item['sPartCode'] =~ /Yard.*/ && params['payment'] == "0" ? (0 - 0.015) : 0.0))
		x
	end
	
	def self.includedTaxes(item,native,quantity)
		if (item['sPartCode'].match(/.*Yard.*/))
			{ :total => "%.02f" % (fuelTaxTotal (fuelTaxes native, item, quantity),native, item['sPartCode']), :taxes => (fuelTaxes native, item, quantity) }
		else
			nil
		end
	end
	
	def self.statuspremium(item,params)
		return params['status'] == 'true' ? item['statuspremium'].to_f : 0.0
	end
	
	def self.ehc(item,quantity)
#		puts item
#		if (! item['sPartCode'].match(/Yard .*/) && ! ( item['sPartCode'] =~ /\AS.*/) )
#			puts item['ehc']['rate']
#			puts item['ehc']['quantity']
#			puts quantity
#			puts ( item['ehc']['rate'].to_f * item['ehc']['quantity'].to_f * quantity )
#		end
#		puts item
#		puts item['sPartCode']
		(  item['sPartCode'].match(/^\d.*/) ) ?
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
		#format the accumulated values to 2 dec place
		result.map {|key,val| result[key] = "%.02f" % val}
		result
	end

	def self.isNative(band)
		band != nil && band.length > 0 ? true : false
	end
					
#	def self.taxList(native,prodCode)
#		if native && prodCode.match(/.*Yard LS.*/)
#			[ {:name => "FET", :rate => 0.04} ]
#		else
#			{ "Yard LS" => [ { :name => "MFT", :rate => 0.15 }, 
#												{ :name => "FET", :rate => 0.04 },
#												{ :name => "Carbon", :rate => 0.0767 } ],
#				"Yard DLSD" => [ { :name => "MFT", :rate => 0.03 },
#													{ :name => "FET", :rate => 0.04 },
#													{ :name => "Carbon", :rate => 0.0767 } ],
#				"Yard RU" => [ { :name => "MFT", :rate => 0.145 },
#												{ :name => "FET", :rate => 0.10 },
#												{ :name => "Carbon", :rate => 0.0667 } ],
#				"Yard SD" => [ { :name => "MFT", :rate => 0.03 },
#												{ :name => "FET", :rate => 0.04 },
#												{ :nane => "Carbon", :rate => 0.0767 } ] } [prodCode]
#		end
#	end
#	
#	def self.fuelTaxRateTotal(native,prodCode)
#		total = taxList(native,prodCode).inject(0) do |total, tax|
#			total + tax[:rate]
#		end
#		return total
#	end

	def self.fuelTaxTotal(taxes,native,prodCode)
		total = taxes.inject(0.0) do |total, tax|
			total + tax[:amount].to_f
		end
		total
	end

#	def self.fuelTaxRateDiscount(native,prodCode)
#		puts fuelTaxRateTotal(native,prodCode)
#		return fuelTaxRateTotal(false,prodCode) - fuelTaxRateTotal(native,prodCode)
#	end
	
	def self.fuelTaxes(native,item,quantity)
		Taxation::taxList(native,item['sPartCode']).map { |tax|
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
	
#	def self.taxTotal(items,native)
#		taxes = items.inject({}) { |result,item| 
#			item[:taxes][:taxes].inject(result) { |result,tax|
#				if(taxApplicable(tax[:name],item[:prodCode],native)) 
#					updateTaxResult(result,tax,item) 
#				else 
#					result
#				end 
#			}
#		}
#		taxes.keys.inject(0) { |total,key| total + key * taxes[key].to_f / 100 }
#	end

	def self.taxTotal(items)
		
		taxes = items.inject(0) {|total,item| 
			total + item[:taxapplications].inject(0) {|accum,application|
				application[:taxes][:total].to_f * application[:ratio].to_f
			}
		}
	end

	def self.updateTaxResult(result,tax,item)
		if result[tax[:rate]] == nil
			result[tax[:rate]] = 0
		end
		result[tax[:rate]] += item[:amount].to_f
		result
	end
	
end
