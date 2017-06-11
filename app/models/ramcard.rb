require 'net/http'
require 'json'
require 'cart'

class Ramcard < ActiveRecord::Base
  # attr_accessible :title, :body

	@@incltaxrate = lambda {|applications,selector| taxrate(:includedTaxes,applications,selector)}
	@@subtaxrate = lambda {|applications,selector| taxrate(:taxes,applications,selector)}
=begin	  
  def self.test
  	content = ""
  	self.new( {:truck => '365', :orders => [
  			{:lid => 1, :ordernum => "000001", :clientname => "Popeye", :itemname => "Spinach", 
  				:addrname => "ship ahoy", :contact => "1234567:*1*0", :streetaddr => "the dock", :city => "seaside", 
  				:shipto => "ship ahoy, the dock, seaside",
  				:orderdate => "2013/08/06", :itemcode => "100", :quantity => 1000, 
  				:interval => true, :comment => "xxxx", :custno => "80808080", :price => 1.3497,
  				:custid => 210, :truckcode => '3', :regioncode => '150' },
  			{:lid => 2, :ordernum => "000002", :clientname => "Hannibal Smith", :itemname => "Cigar", 
  				:addrname => "a van", :contact => "1234568:*1*0", :streetaddr => "on the move", :city => "passing thru", 
  				:shipto => "a van, on the move, passing thru",
  				:orderdate => "2013/08/05", :itemcode => "200", :quantity => 900, 
  				:interval => false, :comment => "yyyy", :custno => "97979797", :price => 1.6429,
  				:custid => 210, :truckcode => '4', :regioncode => '250'  }
  		] } ).each do |line|
  			content += line + "\n"
  		end
  	File.open("DELLOAD.DAT",'w') { |ramcard| ramcard.write(content) }
  end
=end
  		 
  def self.new(params)
  	# params is in the form of a hash containing overall details and an array containing hashes for each delivery
  	# each hash is a delivery
#  	puts params
#  	puts params[:truck]
#  	File.open("DELLOAD.DAT",'w') { |ramcard| ramcard.write(([] << createheader(params) << createdetail(params)).flatten.join("\n")) }
  	File.open("DELLOAD.DAT",'w') { |ramcard| ramcard.write(([] << createheader() << createdetail()).flatten.join("\n")) }

#		return ([] << createheader(params) << createdetail(params)).flatten		
		return true
#		return createheader(params) + "\n"
	end
	
#	def self.createheader(params)
	def self.createheader()
  	return '"1",' + # record type - header
  	'"35",' + # Number of numeric fields in record
		'"4",' + # Number of alpha fields in record
		'"1",' + # RAM Card Status
		'"0",' + # RAM Card Identifier
		'"0",' + # Unit Identifier
#		'"' + params[:truck].to_s[0..3].rjust(4,'0') + '",' + # Truck Number
		'"0568",' + # Truck Number
		'"0",' + # Miles from start of shift till now
		'"0",' + # Current Odometer Reading
		'"0",' + # Total Net Delivered this shift
		'"0",' + # Total Gross Delivered this shift
		'"0",' + # First Ticket Number
		'"0",' + # Last Ticket Number
		'"0",' + # Last Sale Number
		'"0",' + # Last Misc Trans Number
		'"0",' + # Grand total – net delivered (this shift)
		'"0",' + # Grand total – gross delivered (this shift)
		'"0",' + # Grand total – all sales not incl tax
		'"0",' + # Grand total – cat 1 % tax on all sales
		'"0",' + # Grand total – cat 1 per unit on all sales
		'"0",' + # Grand total – cat 2 % tax on all sales
		'"0",' + # Grand total – cat 2 per unit on all sales
		'"0",' + # Grand total - % tax on subtot, cat 1 & 2 taxes
		'"0",' + # Grand total – cat 3 % tax on all sales
		'"0",' + # Grand total – cat 3 per unit on all sales
		'"0",' + # Grand total – cat 4 % tax on all sales
		'"0",' + # Grand total – cat 4 per unit on all sales
		'"0",' + # Grand total – all taxes on all sales
		'"0",' + # Grand total – all sales incl all taxes
		'"0",' + # Grand total – all misc charges
		'"0",' + # Grand total – payment received
		'"0",' + # Grand total – unmetered volume delivered
		'"0",' + # Grand total – gross vol not priced
		'"0",' + # Grand total – net vol not priced
		'"0",' + # you just need this, believe me
		'"0",' + # you just need this, believe me
		'"0",' + # you just need this, believe me
		'"0",' + # you just need this, believe me
		'"        ",' + # Date of run of first ship report
		'"        ",' + # Time of run of first ship report
		'"        ",' + # Date of last RAM Card access
		'"        "' # Time of last RAM Card access
	end
	
#	def self.createdetail(params)
	def self.createdetail()
	
		@ramcarddetails = ActiveSupport::JSON.decode(Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'ramcardrecords.json'))).map {|detail|
			detail.merge({ 				:cart => Cart.new({ 'items' => {"0" => { :item => detail['items']['0']} }, # we only want the taxes 
																								 :customerName => nil, # this might not matter,
																							 	 :band => detail['band'], # the customer band,
																							   :payment =>"1", 
																								 :status => ((detail['band'] != nil && detail['band'].length > 0 && ['300','550','950'].index(detail['regioncode']) != nil) ?
																									true : false), 
																								 :type => detail['taxationtype'] # we need the taxation type from the customer
								 }) })
					}.map {|detail| getdetaillinetext(detail) }.join("\n")
			
=begin
		# need to query all customers first
#		@customers = ActiveSupport::JSON.decode(Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'customers.json')))
		@shiptos = ActiveSupport::JSON.decode(Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'shiptos.json')))
#		puts @customers
#		return getdetailline(params,@customers[4])
#		@orders = ActiveSupport::JSON.decode(Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'orders.json')))
		@orders = ActiveSupport::JSON.decode(Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'orders.json'))).map {|order|
#			puts '1'
#			puts order
#			puts '2'
#			puts  ({ :items => {"0" => {:lid => order['lInventId'], :quantity => order['quantity'] }}, 
#							:customerName => order['clientname'], :band => order['band'], :payment =>"1", 
#							:status => ((order['band'] != nil && order['band'].length > 0 && ['300','550'].index(order['regioncode']) != nil) ?
#								true : false), :type => typecode(order['accesscode']) })
#			puts '3'
#			puts Cart.new({ 'items' => {"0" => {:lId => order['lInventId'], :quantity => order['quantity'] }}, 
#							:customerName => order['clientname'], :band => order['band'], :payment =>"1", 
#							:status => ((order['band'] != nil && order['band'].length > 0 && ['300','550'].index(order['regioncode']) != nil) ?
#								true : false), :type => typecode(order['taxationtype']) })
#			puts '4'
                          
			order.merge({ :cart => Cart.new({ 'items' => {"0" => {:lId => order['lInventId'], :quantity => order['quantity'] }}, 
							'customerName' => order['clientname'], 'band' => order['band'], 'payment' =>"1", 
							:status => ((order['band'] != nil && order['band'].length > 0 && ['300','550'].index(order['regioncode']) != nil) ?
							true : false), :type => typecode(order['taxationtype']) }) })
		}
		
#		puts @orders
		
		return @shiptos.map { |shipto|
#			getdetaillines(params,shipto,@orders)
			getdetaillines(shipto,@orders)
		}
=end
	end
	
#	def self.typecode(taxationtype)
#		return '0' if taxationtype == 'R' || taxationtype == nil || taxationtype.length == 0
#		return '-1' if taxationtype == 'C'
#		return taxationtype
#	end

	def self.taxrate(set,taxapplications,selector)
#		taxapplications.map {|application|
#			appl[set]}.flatten.select {|tax| test}.inject(0.0) {|rate,tax|
#			total + tax[:effectiverate] }
			
		taxapplications.inject([]) {|accum,appl| 
			accum << appl[set][:taxes]}.flatten.select {|tax| 
				selector.call(tax) }.inject(0.0) {|total,tax|
					total + tax[:effectiverate].to_f }
	end

=begin
#	def self.getdetaillines(params,shipto,orders)			
	def self.getdetaillines(shipto,orders)			
		# must change to find multiple orders for same client!
#		return getdetailline(params,shipto,findorders(orders,shipto['lid']))
		return getdetailline(shipto,findorders(orders,shipto['lid']))
	end

#	def self.getdetailline(params,shipto,orders)
	def self.getdetailline(shipto,orders)
	
#		return orders.empty? ? 
#			getdetaillinetext(params,customer,nil) : 
		# this gets called for each shipto
		# for each order a detail line will be created
		# if no orders, then a nil order is used and mapped upon once to create a single detail line
#		return ( orders.empty? ? [nil] : orders ).map { |order| getdetaillinetext(params,shipto,order) }
		return ( orders.empty? ? 
			[{'truckcode' => (shipto['tankfuel'] == nil || shipto['tankfuel'].length == 0 ? "6" : shipto['tankfuel']),
			  'price' => 0.00,
			  'ordernum' => "        ",
				'comment' => "",
				:cart => Cart.new({ 'items' => {"0" => {:lId => shipto['lInventId'], #inventoryid of tank fuel,
																							:quantity => 0 } }, # we only want the taxes 
																								 :customerName => nil, # this might not matter,
																							 	 :band => shipto['band'], # the customer band,
																							   :payment =>"1", 
																								 :status => ((shipto['band'] != nil && shipto['band'].length > 0 && ['300','550'].index(shipto['regioncode']) != nil) ?
																									true : false), 
																								 :type => shipto['taxationtype'] # we need the taxation type from the customer
														})}] :
#					{ :lineItems => [ { :baseprice => 0.00, :taxapplications => [] } ] } } ] : 
#			orders ).map { |order| getdetaillinetext(params,shipto,order) }
			orders ).map { |order| getdetaillinetext(shipto,order) }
	end
=end
	
	def self.getdetaillinetext(detail)
	
#		puts detail.inspect
		
		incltaxrate = @@incltaxrate.curry[detail[:cart][:lineItems][0][:taxapplications]]
		subtaxrate = @@subtaxrate.curry[detail[:cart][:lineItems][0][:taxapplications]]
		
		'"5",' + # Record Type (no preset)
		'"17",' + # Number of numeric fields in record
		'"7",' + # Number of alpha fields in record
		'"' + detail['accesscode'].to_s + '",' + # Access Number - this needs to change to udf1 field after filled
		'"' + detail['truckcode'] + '",' + 
		'"' + (detail['regioncode'] == nil || detail['regioncode'].length == 0 ?
					'950' : detail['regioncode'])  + '",' + # End Use Code - needs xref - will come from shipto - in order query
		'"0",' + # Preset Amount
		'"' + ("%.06f" % detail[:cart][:lineItems][0][:baseprice]) + '",' + # Product Price per unit vol - needs proper formatting
		'"' + ("%.06f" % incltaxrate[Proc.new {|tax| tax['name'] == 'Carbon tax'}]) + '",' + # cat 1 % tax on all sales
		'"' + ("%.06f" % incltaxrate[Proc.new {|tax| tax['name'] == 'FET'}]) + '",' + # cat 1 per unit on all sales
		'"0",' + # cat 2 % tax on all sales
		'"' + ("%.06f" % incltaxrate[Proc.new {|tax| tax['name'] == 'MFT'}]) + '",' + # cat 2 per unit on all sales
		'"' + ("%.02f" % (subtaxrate[Proc.new {|tax| tax[:name] == 'GST'}].to_f * 100) ) + '",' + # % tax on subtot, cat 1 & 2 taxes
		'"' + ("%.02f" % 0) + '",' + # cat 3 % tax on all sales
		'"0",' + # cat 3 per unit on all sales
		'"0",' + # cat 4 % tax on all sales
		'"0",' + # cat 4 per unit on all sales
		'"0",' + # vol disc on this del?
		'"0",' + # cash disc cat (0=none, or 1,2,3)
		'"0",' + # amt of misc “other” charge
		'"                ",' + # text desc of other chg (N17)
		'"' + detail['custAdd1'].to_s[0..7].rjust(8,' ') + '",' + # Cust acct number - trunc/pad to 8
		'"' + detail['sName'][0..23].ljust(24,' ').upcase + '",' + # Cust name - trunc/pad to 24
		'"' + detail['sStreet1'][0..23].ljust(24,' ').upcase + '",' + # Cust street addr - trunc/pad to 24
		'"' + detail['sCity'][0..23].ljust(24,' ').upcase + '",' + # Cust town - trunc/pad to 24
		'"' + fueldata(detail['tankposition'],detail['tankcapacity']).ljust(24,' ') + '",' + # 24 bytes reserved - this is some magic string that we must procure from the contact info
		'"' + detail['sStreet2'][0..23].ljust(24,' ').upcase + '"' # 24 bytes reserved - trunc/pad to 24
	end
	
=begin	
#	def self.getdetaillinetext(params,shipto,order)
	def self.getdetaillinetext(shipto,order)
	
#		puts 'z'
#		puts order
#		puts 'a'
#		puts order[:cart]
#		puts 'b'
#		puts order[:cart][:lineItems]
#		puts 'c'
#		puts order[:cart][:lineItems][0]
		
		incltaxrate = @@incltaxrate.curry[order[:cart][:lineItems][0][:taxapplications]]
		subtaxrate = @@subtaxrate.curry[order[:cart][:lineItems][0][:taxapplications]]
		
#		puts 'a'
#		puts order
#		puts 'b'
#		puts order[:cart][:lineItems][0][:taxapplications]
#		puts 'c'
#		puts order[:cart][:lineItems][0][:taxapplications].inject([]) {|accum,appl| accum << appl[:includedTaxes][:taxes]}
#		puts 'd'
#		puts order[:cart][:lineItems][0][:taxapplications].inject([]) {|accum,appl| 
#			accum << appl[:taxes][:taxes]}.flatten.select {|tax| tax[:name] == 'GST'}
#		puts 'e'
#		puts order[:cart][:lineItems][0][:taxapplications].inject([]) {|accum,appl| 
#			accum << appl[:taxes][:taxes]}.flatten.select {|tax| 
#				tax[:name] == 'GST'}.inject(0.0) {|total,tax|
#					total + tax[:effectiverate].to_f }
#		puts 'carbon'
#		puts taxrate(:includedTaxes,order[:cart][:lineItems][0][:taxapplications],
#			Proc.new {|tax| tax['name'] == 'Carbon tax'})
#		puts 'mft'
#		puts taxrate(:includedTaxes,order[:cart][:lineItems][0][:taxapplications],
#			Proc.new {|tax| tax['name'] == 'MFT'})
#		puts 'fet'
#		puts taxrate(:includedTaxes,order[:cart][:lineItems][0][:taxapplications],
#			Proc.new {|tax| tax['name'] == 'FET'})
#		puts 'gst'
#		puts taxrate(:taxes,order[:cart][:lineItems][0][:taxapplications],
#			Proc.new {|tax| tax['name'] == 'GST'})
#		puts subtaxrate[Proc.new {|tax| tax[:name] == 'GST'}]
#		puts 'ice'
#		puts taxrate(:taxes,order[:cart][:lineItems][0][:taxapplications],
#			Proc.new {|tax| tax['name'] == 'PST' && tax['type'] == 'base'})
#		puts 'end'
		
		'"5",' + # Record Type (no preset)
		'"17",' + # Number of numeric fields in record
		'"7",' + # Number of alpha fields in record
		'"' + shipto['accesscode'].to_s + '",' + # Access Number - this needs to change to udf1 field after filled
		'"' + order['truckcode'] + '",' + 
#		'"' + (order == nil ? 
#			(shipto['tankfuel'] == nil || shipto['tankfuel'].length == 0 ? "6" : shipto['tankfuel']) : order['truckcode']) + '",' + # Product Code - this needs an xref - will come from item info - in order query
		'"' + (shipto['regioncode'] == nil || shipto['regioncode'].length == 0 ?
					'950' : shipto['regioncode'])  + '",' + # End Use Code - needs xref - will come from shipto - in order query
		'"0",' + # Preset Amount
#		'"' + (order == nil ? "0.00" : "%.06f" % order['price']) + '",' + # Product Price per unit vol - needs proper formatting
#		'"' + ("%.06f" % order['price']) + '",' + # Product Price per unit vol - needs proper formatting
		'"' + ("%.06f" % order[:cart][:lineItems][0][:baseprice]) + '",' + # Product Price per unit vol - needs proper formatting
		# all these taxes below need review - 0 filler till we figure out correct approach
		# in addition, these are aligned to the actual load file - no matching documentation found - close but not exact
		'"' + ("%.06f" % incltaxrate[Proc.new {|tax| tax['name'] == 'Carbon tax'}]) + '",' + # cat 1 % tax on all sales
#		'"' + ("%.06f" % 0) + '",' + # cat 1 % tax on all sales
		'"' + ("%.06f" % incltaxrate[Proc.new {|tax| tax['name'] == 'FET'}]) + '",' + # cat 1 per unit on all sales
#		'"' + ("%.06f" % 0) + '",' + # cat 1 per unit on all sales
		'"0",' + # cat 2 % tax on all sales
#		'"0",' + # cat 2 per unit on all sales
		'"' + ("%.06f" % incltaxrate[Proc.new {|tax| tax['name'] == 'MFT'}]) + '",' + # cat 2 per unit on all sales
#		'"' + ("%.02f" % (taxrate(:taxes,order[:cart][:lineItems][0][:taxapplications],
#			Proc.new {|tax| tax[:name] == 'GST'}).to_f * 100) ) + '",' + # % tax on subtot, cat 1 & 2 taxes
		'"' + ("%.02f" % (subtaxrate[Proc.new {|tax| tax[:name] == 'GST'}].to_f * 100) ) + '",' + # % tax on subtot, cat 1 & 2 taxes
#		'"' + ("%.02f" % 0) + '",' + # % tax on subtot, cat 1 & 2 taxes
		'"' + ("%.02f" % 0) + '",' + # cat 3 % tax on all sales
		'"0",' + # cat 3 per unit on all sales
		'"0",' + # cat 4 % tax on all sales
		'"0",' + # cat 4 per unit on all sales
		'"0",' + # vol disc on this del?
		'"0",' + # cash disc cat (0=none, or 1,2,3)
		'"0",' + # amt of misc “other” charge
		'"                ",' + # text desc of other chg (N17)
#		'"' + (order == nil ? "        " : order['ordernum'].to_s[0..7].rjust(8,' ')) + '",' + # Cust acct number - trunc/pad to 8
		'"' + order['ordernum'].to_s[0..7].rjust(8,' ') + '",' + # Cust acct number - trunc/pad to 8
		'"' + shipto['sName'][0..23].ljust(24,' ') + '",' + # Cust name - trunc/pad to 24
		'"' + shipto['sStreet1'][0..23].ljust(24,' ') + '",' + # Cust street addr - trunc/pad to 24
		'"' + shipto['sCity'][0..23].ljust(24,' ') + '",' + # Cust town - trunc/pad to 24
#			'"*1*0                    ",' + # 24 bytes reserved - this is some magic string that we must procure from the contact info
		'"' + fueldata(shipto['tankposition'],shipto['tankcapacity']).ljust(24,' ') + '",' + # 24 bytes reserved - this is some magic string that we must procure from the contact info
#		'"' + (order == nil ? "" : order['comment'])[0..23].ljust(24,' ') + '"' # 24 bytes reserved - trunc/pad to 24
		'"' + order['comment'][0..23].ljust(24,' ') + '"' # 24 bytes reserved - trunc/pad to 24
	end
	
	def self.findorders(orders,lcusid)
#		puts lcusid
		return orders.select{|order| 
#			puts order[:custid]
			order['custid'] == lcusid}
			
#		puts index
		
		return index == nil ? nil : orders[index]
	end
=end
	
	def self.fueldata(tankposition,tankcapacity)
		(tankposition == nil || tankposition.length == 0 ? "" : tankposition) +
			"*" + 
			"1" +
			"*" +
			(tankcapacity == nil || tankcapacity.length == 0  ? "0" : tankcapacity)
	end
	
end
