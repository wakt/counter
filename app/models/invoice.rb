require 'prawn'
require 'mail'

class Invoice < ActiveRecord::Base
  # attr_accessible :title, :body  

	def self.taxNumber(taxName)
		case taxName
		when "GST"
			"GST #: 136231420"
		when "PST"
			"PST #: 1012-5384"
		end
	end

  def self.new(params)

		puts 'i'
		puts params.inspect
		puts params[:invoicenum]
		
		blockfillopacity = 0.05
		
		Prawn::Document.generate("public\\invoice\\" + params[:invoicenum] + ".pdf") do
#		Prawn::Document.generate("public\\invoice\\test.pdf") do
	
			image "public/images/logo.jpg", :at => [335,740], :width => 180, :height => 180

			transparent(blockfillopacity,1.0) do
				fill_rectangle [0,740], 300, 179.5
			end

			stroke_color "ffffff"
			transparent(blockfillopacity,0.0) do
				fill_rectangle [0,560.5], 540, 11
			end
			transparent(blockfillopacity,0.0) do
				fill_rectangle [0,549.5], 150, 20.5
			end
			transparent(blockfillopacity,0.0) do
				fill_rectangle [0,529], 540, 9
			end
			transparent(blockfillopacity,0.0) do
				fill_rectangle [520,549.5], 20, 20.5
			end
			transparent(blockfillopacity,0.0) do
				fill_rectangle [0,520], 150, 20.5
			end
			transparent(blockfillopacity,0.0) do
				fill_rectangle [0,499.5], 540, 8.5
			end
			transparent(blockfillopacity,0.0) do
				fill_rectangle [240,520], 100, 20.5
			end
			transparent(blockfillopacity,0.0) do
				fill_rectangle [520,520], 20, 20.5
			end
			
			fill_color "000000"
			t = Time.new
			font_size(18)
			bounding_box([20,720],:width => 210,:height => 25) do
				text "Fast Fuel Services Ltd."
			end
			font_size(12)
			bounding_box([20,690],:width => 130,:height => 140) do
				text "Box 219\n" +
						"Queen Charlotte, BC,\n" +
						"V0T 1S0"
			end
			bounding_box([150,690],:width => 140,:height => 140) do
				text "phone:#{Prawn::Text::NBSP * 5}(250) 559-4611\n" +
						"fax:#{Prawn::Text::NBSP * 5}(250) 559-4512\n" +
						"fastfuel@qcislands.net\n\n"
			end
			bounding_box([20,640],:width => 160,:height => 80) do
				text "Date: " + t.strftime("%b %-d, %Y") + "\n" +
						"Invoice #: " + params[:invoicenum] + "\n\n"
				["GST","PST"].each do |key|		
					text Invoice::taxNumber(key)
				end
			end

			fill_color "000000"
			bounding_box([20,544],:width => 120,:height => 20) do
				text "Customer Name"
			end
			bounding_box([160,544],:width => 350,:height => 20) do
				text params[:customerName]
			end
			
			fill_color "000000"
			bounding_box([20,514],:width => 120,:height => 20) do
				text "Band Number"
			end
			
			if params[:band] != nil
				bounding_box([160,514],:width => 100,:height => 20) do
					text params[:band]
				end
			end
			
			fill_color "000000"
			bounding_box([260,514],:width => 80,:height => 20) do
				text "PO Number"
			end
			if params[:comment] != nil
				bounding_box([360,514],:width => 100,:height => 20) do
					text params[:comment]
				end
			end
			
			move_cursor_to 480
			
			# create the table contents from the line items
			# then call table
			list =  [ [ "Product Code", "Product", "Quantity", "Price", "Amount"] ]
			linenumber = 0
			mainlines = Array.new
			params[:lineItems].each do |lineItem|
				puts '1'
				puts lineItem
				lineItem[:taxapplications].each do |application|
					puts '2'
					puts application
					puts "%.02f" % (lineItem[:amount].to_f * application[:ratio].to_f)
					puts lineItem[:amount]
					puts application[:ratio]
					
					list << Array.new
					mainlines << linenumber
					linenumber += 1
					list.last << lineItem[:prodCode]
					list.last << lineItem[:name]
					list.last << lineItem[:quantity].to_f * application[:ratio].to_f
					
#					list.last << lineItem[:price]
					if( lineItem[:includedCharges] != nil )
						list.last << "%.02f" % (lineItem[:price].to_f - lineItem[:includedCharges][:amount].to_f)
						list.last << "%.02f" % 
							((lineItem[:amount].to_f - lineItem[:includedCharges][:amount].to_f * lineItem[:quantity].to_f) * application[:ratio].to_f)
					else
						list.last << lineItem[:price]
						list.last << "%.02f" % (lineItem[:amount].to_f * application[:ratio].to_f)
					end
					
#					list.last << "%.02f" % (lineItem[:amount].to_f * application[:ratio].to_f)
					if( application[:includedTaxes] != nil )
						subtable = [ [ "Incl. taxes", "Rate $/L", "Amount"] ]
						application[:includedTaxes][:taxes].each do |tax|
							subtable << [ tax['name'], tax['rate'], "%.02f" % (tax[:amount].to_f * application[:ratio].to_f) ]
						end
						if application[:includedTaxes][:taxes].length > 1
							subtable << [ "Total", "", "%.02f" % (application[:includedTaxes][:total].to_f * application[:ratio].to_f) ]
						end
#					horizontal_padding(2)
						subtable = make_table subtable, 
																		 	:column_widths => [75,75,100],
																			:cell_style => { :size => 8	 } do
																			column(1).style :align => :right
																			column(2).style :align => :right
																			row(0..row_length).style( :padding_top => 2 )
													end
						list << [ "", subtable, "", "", "" ] 
						linenumber += 1
					end
				end

#				if( lineItem[:includedCharges] != nil )
##					subtable = [ [ "Incl. charges", "Rate $/L", "Amount"] ]
#					subtable = [ [ "Extra charges", "Rate $/L", "Amount"] ]
#					subtable << [ "EHC", lineItem[:includedCharges][:rate], lineItem[:includedCharges][:amount] ]
#					subtable = make_table subtable, 
#																	 :column_widths => [75,75,100],
#																	:cell_style => { :size => 8 } do
#																		column(1).style :align => :right
#																		column(2).style :align => :right
#																		row(0..row_length).style( :padding_top => 2 )
##																		style(row(0..row_length), :horizontal_padding => 2)
#												end
#					list << [ "", subtable, "", "", "" ] 
#					linenumber += 1
#				end

				if( lineItem[:includedCharges] != nil )
#					subtable = [ [ "Incl. charges", "Rate $/L", "Amount"] ]
					subtable = [ [ "Extra charges", "Rate $/L", "Amount"] ]
					subtable << [ "EHC", lineItem[:includedCharges][:rate], lineItem[:includedCharges][:amount] ]
					subtable = make_table subtable, 
																	 :column_widths => [75,75,100],
																	:cell_style => { :size => 8 } do
																		column(1).style :align => :right
																		column(2).style :align => :right
																		row(0..row_length).style( :padding_top => 2 )
#																		style(row(0..row_length), :horizontal_padding => 2)
												end
					list << [ "", subtable, "", lineItem[:includedCharges][:amount], 
						"%.02f" % (lineItem[:includedCharges][:amount].to_f * lineItem[:quantity].to_f) ] 
					linenumber += 1
				end

			end
			list << [ "", "Subtotal", "", "", params[:subtotal] ]
#			list << [ "", "", "", "", params[:taxes][:total]
			params[:lineItems].inject([]) {|applications,lineItem| 
				applications << lineItem[:taxapplications].inject([]) {|taxes,application| 
					taxes << application[:taxes][:taxes] } }.flatten.sort {|x,y| x[:name] <=> y[:name]}.group_by {|tax|
						tax[:name] }.map {|taxname, taxdetails| {:name => taxname, :amount => taxdetails.inject(0.0) {|total,tax| 
							total + tax[:taxableamount].to_f * tax[:rate].to_f } } }.each do |taxtotal|
								list << ["", taxtotal[:name], "", "", "%.02f" % taxtotal[:amount] ]
							end		
							
			list << [ "", "Total", "", "", params[:total] ]

			font_size(10)

#			table([["a","b","c","d","e"]]) do
			table(list) do
#				style(row(0..row_length), :vertical_padding => 2)
#				padding = 0
				row(0..row_length).style( :padding_top => 2, :padding_bottom => 2 )
#				horizontal_padding(2)
				column(2).style { |c| c.align = :right }
				column(3).style { |c| c.align = :right }
				column(4).style { |c| c.align = :right }
				
				header = true
				column(0).width = 100
				column(2).width = 60
				column(3).width = 60
				column(4).width = 70
				
				row(0).font_style = :bold
	#			row((row_length-params[:taxes][:taxes].keys.length-2)..row_length-1).font_style = :bold
#				column_widths = [50,225,60,70,55]
				row_colors = ["F0F0F0", "FFFFFF"]
				
#				style(row(0..row_length), :size => 10 )
#				mainlines.each do |line|
#					style(row(line), :padding => 2)
#				end
			end

			if params[:payment] == "2"
				bounding_box([0,20],:width => 80,:height => 20) do
					text "On Account"
				end
			end
			
			bounding_box([190,20],:width => 80,:height => 20) do
				text "Signature:"
			end
			
			line_width(1)
			stroke_color "000000"
			stroke do
				horizontal_line 250, 540, :at => 10 
			end
			stroke_color "ffffff"

		end
		
#		puts "pdf created"
		
	end
	
end
