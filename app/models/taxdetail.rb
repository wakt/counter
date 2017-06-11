require 'net/http'
require 'prawn'

class Taxdetail < ActiveRecord::Base
  # attr_accessible :title, :body
  
  def self.new(params)
  	puts "taxdetail create"
  	# query for taxdetails
  	# process for report
  	# details is grouped by fuel, type, status
  	#		collapse yard and tank farm fuels
  	#   type is significant only if pst applicable
  	# summary is grouped by tax, unique line item selections and summations
		url = Counter::Application.config.simplyurl + %Q{fuelsales.json?startdate=#{params[:startdate]}&enddate=#{params[:enddate]}&}
		resp = Net::HTTP.get_response(URI.parse(url));
		fuelsales = JSON.parse(resp.body)
 	 
 	 	puts 'c1'
 	 	puts fuelsales.inspect
 	 	puts 'd'
=begin
	 	details = fuelsales.map {|fuelsale|
	 			if(fuelsale['partCode'].match(/Yard.*/) != nil)
	 				fuelsale['partCode'] = {'Yard LS' => 'TF000962', 'Yard DLSD' => 'TF000963', 'Yard RU' => 'TF000940', 'Yard SD' => 'TF000222'}[fuelsale['partCode']]
	 				fuelsale['custinfo'] = (fuelsale['custinfo'].sub /RC:\d*/, '') + '|RC:950'
	 				fuelsale['shiptoinfo'] = (fuelsale['shiptoinfo'].sub /T:./, '') + '|T:R'
	 			end
	 			fuelsale
#	 		a['partCode'] <=> b['partCode'] }.inject([]) {|accum,fuelsale|
#	 			fuelsale['partCode'].match(/Yard.*/) != nil ?
#	 			( base = {'Yard LS' => 'TF000962', 'Yard DLSD' => 'TF000963', 'Yard RU' => 'TF000940', 'Yard SD' => 'TF000222'}[fuelsale['partCode']]
#			 	accum.select{|item| item['partCode'] == base}[0]['quantity'] =
#			 	accum.select{|item| item['partCode'] == base}[0]['quantity'].to_i + fuelsale['quantity'].to_i ) :
#			 	accum << fuelsale
#			 	accum
			 }.sort {|a,b| 
=end
			 details = fuelsales.sort {|a,b| 
		 		a['partCode'] <=> b['partCode'] }.group_by{|fuelsale| fuelsale['partCode']}.values.map{|fuelgroup|
#		 		a['partCode'] <=> b['partCode'] }.partition{|fuelsale| fuelsale['partCode']}.map{|fuelgroup|
		 		{'partCode' => fuelgroup[0]['partCode'], 
		 		 'itemname' => fuelgroup[0]['itemname'],
			 	'fuelgroups' => fuelgroup.map{|fuelsale|
			 		
			 		puts  (fuelsale['shiptoinfo'].match(/T:(.)/) != nil ? fuelsale['shiptoinfo'].match(/T:(.)/)[1] : 'R')
			 		puts fuelsale['taxes']
			 	  puts fuelsale['taxes'].select{|application| application['taxes'].select {|tax| tax['name'] == 'PST' && tax['type'] == 'base'}.length > 0 }.length
			 		
				 	fuelsale.slice(*['date','shiptoname','shiptoinfo','name','quantity','invoicenum','custinfo','taxes','exemptions'])}.partition{|fuelsale|
					!(fuelsale['taxes'].select{|application| application['taxes'].select {|tax| tax['name'] == 'PST' && tax['type'] == 'base'}.length > 0 }.length > 0 &&
					(fuelsale['shiptoinfo'].match(/T:(.)/) != nil ? fuelsale['shiptoinfo'].match(/T:(.)/)[1] : 'R')  == 'C')}.map{|taxgroup| 
						taxgroup.partition{|fuelsale|
#							puts fuelsale
							!(fuelsale['custinfo'].match(/Band:(\d*-*\d*)/) != nil && 
							fuelsale['custinfo'].match(/RC:(\d*)/) != nil && 
							['300','550','950'].index(fuelsale['custinfo'].match(/RC:(\d*)/)[1]) != nil) }.map {|statusgroup|
								puts 'z'
								puts statusgroup[0]['taxes'].inspect if statusgroup.length > 0
								puts 'z1'
								puts statusgroup[0]['taxes'].map {|application|
									application['taxes'] = application['taxes'].delete_if {|tax| 
											tax['name'] == 'GST'} 
									application }.inspect if statusgroup.length > 0
								puts statusgroup[0]['taxes'].map {|application|
									application['taxes'] = application['taxes'].delete_if {|tax| 
											tax['name'] == 'GST'}.sort {|a,b| a['name'] <=> b['name'] } 
									application }.inspect if statusgroup.length > 0
								puts statusgroup[0]['taxes'].map {|application|
									application['taxes'] = application['taxes'].delete_if {|tax| 
											tax['name'] == 'GST'}.sort {|a,b|
												puts 'a' 
												puts a.inspect
												puts 'b' 
												puts b.inspect
												(['FET','MFT','PST','Carbon tax'].index(a['name'])) <=>
												(['FET','MFT','PST','Carbon tax'].index(b['name'])) } 
									application }.inspect if statusgroup.length > 0
								{ 'taxes' => (statusgroup.length > 0 ? statusgroup[0]['taxes'] : []).map {|application|
#									application['taxes'].delete_if {|tax| tax['name'] == 'GST'}
									application['taxes'] = application['taxes'].delete_if {|tax| 
											tax['name'] == 'GST'}.sort {|a,b| 
												['FET','MFT','PST','Carbon tax'].index(a['name']) <=>
												['FET','MFT','PST','Carbon tax'].index(b['name']) } 
									application },
									'exemptions' => (statusgroup.length > 0 ? statusgroup[0]['exemptions'] : []).map {|application|
									application['taxes'] = application['taxes'].delete_if {|tax| 
											tax['name'] == 'GST'}.sort {|a,b| 
												['FET','MFT','PST','Carbon tax'].index(a['name']) <=>
												['FET','MFT','PST','Carbon tax'].index(b['name']) } 
									application },
#								{ 'taxes' => statusgroup.length > 0 ? statusgroup[0]['taxes'] : [],
								'sales' => statusgroup.map {|sale| sale.slice(*['date','shiptoname','shiptoinfo','name','quantity','invoicenum','custinfo']) }
								}
							}
						}   
			 	}
			}
				 		
 	 	puts details.inspect

		list = []
		 	 	
#		Prawn::Document.generate("public\\invoice\\taxdetail.pdf",
#														:page_size => "LETTER",
#														:page_layout => :landscape,
#														:layout => :landscape ) do
		Prawn::Document.generate("public\\invoice\\taxdetail.pdf") do

			firstpage = true 	 	
			taxgrandtotals = {}
			exemptiongrandtotals = {}
	 	 	details.each {|partgroup|
#				start_new_page( :layout => :landscape )
				if !firstpage 
					start_new_page()
				end
				firstpage = false
#				move_cursor_to 500
				text partgroup['partCode'] + ' - ' + partgroup['itemname']
				
=begin
	 	 		puts partgroup['partCode']
	 	 		list = []
	# 	 		puts partgroup
	 	 		puts 'residential' if partgroup['fuelgroups'][0][0].length > 0 || partgroup['fuelgroups'][0][1].length > 0
	 	 		if partgroup['fuelgroups'][0][0].length > 0
	 	 			list = []
		 	 		puts 'non-status'
					list << (['date','name'] << 
						partgroup['fuelgroups'][0][0]['taxes'][0]['taxes'].sort {|a,b| a['name'] <=> b['name'] }.map {|tax| tax['name'] } ).flatten
	
		 	 		partgroup['fuelgroups'][0][0]['sales'].each	{|sale|
		 	 			puts sale['date'].to_s + ':' + sale['name'] +
				 	 		partgroup['fuelgroups'][0][0]['taxes'].map {|application| 
				 	 			application['taxes'].sort {|a,b| a['name'] <=> b['name'] }.map {|tax| 
				 	 				tax['rate'].to_s}}.flatten.join(',')
				 	}
				 	 				
		 	 		partgroup['fuelgroups'][0][0]['sales'].each	{|sale|
				 	 	list << ([ sale['date'].to_s, sale['name'] ] << partgroup['fuelgroups'][0][0]['taxes'].map {|application| 
				 	 			application['taxes'].sort {|a,b| a['name'] <=> b['name'] }.map {|tax| 
				 	 					tax['rate'].to_s}}).flatten 
		 	 		}

					table(list) do
					end
					
		 	 	end
=end
				[[0,'Retail'],[1,'Wholesale']].each do |params|
	 	 			if partgroup['fuelgroups'][params[0]][0]['sales'].length > 0 ||
	 	 				partgroup['fuelgroups'][params[0]][1]['sales'].length > 0
	 	 				# Residential/Commercial only matters if Furnace or Stove
	 	 				if ['TF000948','TF000951'].index(partgroup['partCode']) != nil
				 	 		text "\n" + params[1]
				 	 	end
			 	 		[[0,'Non-status'],[1,'Status']].each do |params2|
			 	 			if partgroup['fuelgroups'][params[0]][params2[0]]['sales'].length > 0
				 	 			list = []
					 	 		text "\n" + params2[1]
					 	 		
					 	 		puts params[0]
					 	 		puts params2[0]
					 	 		puts partgroup['fuelgroups'][params[0]][params2[0]].inspect
					 	 		
								list << (['Date','Name','Quantity'] << 
#									partgroup['fuelgroups'][params[0]][params2[0]]['taxes'][0]['taxes'].sort {|a,b| a['name'] <=> b['name'] }.map {|tax| tax['name'] + "\n" + tax['rate'].to_s } ).flatten
									[['taxes',''],['exemptions','Exempt ']].map {|section|
										(partgroup['fuelgroups'][params[0]][params2[0]][section[0]].length > 0 ?
									partgroup['fuelgroups'][params[0]][params2[0]][section[0]][0]['taxes'].map {|tax| 
									section[1] + tax['name'] + "\n" + "%.04f" % tax['rate'].to_f } : [] )}).flatten
=begin
									(partgroup['fuelgroups'][params[0]][params2[0]]['taxes'].length > 0 ?
									partgroup['fuelgroups'][params[0]][params2[0]]['taxes'][0]['taxes'].map {|tax| 
										tax['name'] + "\n" + tax['rate'].to_s } : [] ) <<
									(partgroup['fuelgroups'][params[0]][params2[0]]['exemptions'].length > 0 ?
									partgroup['fuelgroups'][params[0]][params2[0]]['exemptions'][0]['taxes'].map {|tax| 
										'Exempt ' + tax['name'] + "\n" + tax['rate'].to_s } : [] )).flatten
=end
				
								taxtotals = {}
								exemptiontotals = {}
								qtytotal = 0.0
					 	 		partgroup['fuelgroups'][params[0]][params2[0]]['sales'].each	{|sale|
									qtytotal += sale['quantity'].to_f
							 	 	list << ([ DateTime.parse(sale['date'].to_s).strftime("%Y/%m/%d"), sale['name'],sale['quantity'] ] << 
							 	 		[['taxes',taxtotals],['exemptions',exemptiontotals]].map{|section|
							 	 			partgroup['fuelgroups'][params[0]][params2[0]][section[0]].map {|application| 
							 	 			application['taxes'].map {|tax| 
							 	 				section[1][tax['name']] = "%.02f" % (taxtotals[tax['name']].to_f + 
							 	 				(tax['type'] == 'volume' ? (tax['rate'].to_f * sale['quantity'].to_f).round(2) : sale['quantity'].to_f));
							 	 				
						 	 				(tax['type'] == 'volume' ? ("%.02f" % (tax['rate'].to_f * sale['quantity'].to_f)) : "") }}}).flatten 
					 	 		}
=begin
							 	 		partgroup['fuelgroups'][params[0]][params2[0]]['taxes'].map {|application| 
#							 	 			application['taxes'].sort {|a,b| a['name'] <=> b['name'] }.map {|tax| 
							 	 			application['taxes'].map {|tax| 
#							 	 				puts 'x'
#							 	 				puts tax['rate']
#							 	 				puts sale['quantity']
#							 	 				puts tax['name']
#							 	 				puts taxtotals[tax['name']]
#							 	 				puts tax['rate'].to_f
#							 	 				puts sale['quantity'].to_f
#							 	 				puts taxtotals[tax['name']].to_f
#							 	 				puts 'y'
							 	 				taxtotals[tax['name']] = taxtotals[tax['name']].to_f + 
							 	 				(tax['type'] == 'volume' ? (tax['rate'].to_f * sale['quantity'].to_f).round(2) : sale['quantity'].to_f);
							 	 				
						 	 					(tax['type'] == 'volume' ? ("%.02f" % (tax['rate'].to_f * sale['quantity'].to_f)) : "") }}).flatten 
					 	 		}
=end
					 	 		puts ([ "", "Totals" ] << qtytotal << taxtotals.values ).flatten.inspect
					 	 		list << ([ "", "Totals"] << qtytotal << taxtotals.values << exemptiontotals.values ).flatten
			
								puts 'length:' + list[0].length.to_s
								
								
								table(list, :column_widths => ([60,200,60] << [60] * (list[0].length - 3)).flatten,
														:cell_style => { :size => 10 } ) do
								end
								
								taxtotals.map {|k,v|
									taxgrandtotals[k] = taxgrandtotals[k].to_f + v.to_f
								}
								exemptiontotals.map {|k,v|
									exemptiongrandtotals[k] = exemptiongrandtotals[k].to_f + v.to_f
								}
								
					 	 	end # end if there are sales in stat/non-stat section
					 	end # end status and non-status iteration
					end # end if sales in res/comm section
			 	end # end residential/commercial call

=begin		 	 	
	 	 		puts 'status' if partgroup['sales'][0][1]['sales'].length > 0
	 	 		partgroup['sales'][0][1]['sales'].each {|sale|
	 	 			puts sale['date'].to_s + ':' + sale['name']
	 	 		}
	 	 		puts 'commercial' if partgroup['sales'][1][0]['sales'].length > 0 || partgroup['sales'][1][1]['sales'].length > 0
	 	 		puts 'non-status' if partgroup['sales'][1][0]['sales'].length > 0
	 	 		partgroup['sales'][1][0]['sales'].each {|sale|
	 	 			puts sale['date'].to_s + ':' + sale['name']
	 	 		}
	 	 		puts 'status' if partgroup['sales'][1][1]['sales'].length > 0
	 	 		partgroup['sales'][1][1]['sales'].each {|sale|
	 	 			puts sale['date'].to_s + ':' + sale['name']
	 	 		}
=end
	 	 	}
	 	 	
	 	 	list = [] << (['Received'] << 
	 	 		Hash[taxgrandtotals.sort {|a,b| 
												['FET','MFT','PST','Carbon tax'].index(a[0]) <=>
												['FET','MFT','PST','Carbon tax'].index(b[0]) }].map {|k,v| k}).flatten << 
	 	 			(['Grand totals'] << taxgrandtotals.map {|k,v| "%.02f" % v.to_f }).flatten
	 	 	puts list.inspect
			start_new_page()
			text 'Summary'
		 	table(list, :column_widths => ([140] << [60] * (list[0].length - 1)).flatten,
									:cell_style => { :size => 10 } ) do
			end
			text "\n\n"
			
			puts exemptiongrandtotals.inspect
	 	 	list = [] << (['Exemptions'] << 
	 	 		Hash[exemptiongrandtotals.sort {|a,b| 
												['FET','MFT','PST','Carbon tax'].index(a[0]) <=>
												['FET','MFT','PST','Carbon tax'].index(b[0]) }].map {|k,v| k}).flatten << 
	 	 			(['Grand totals'] << exemptiongrandtotals.map {|k,v| "%.02f" % v.to_f }).flatten
		 	table(list, :column_widths => ([140] << [60] * (list[0].length - 1)).flatten,
									:cell_style => { :size => 10 } ) do
			end

		end  # end prawn doc gen
	 	 	
  end # end def
  
end
