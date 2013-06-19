module TaxableContainer

	# change this to just return the result of the compares
	def taxApplicable(tax,prodCode,native)
		case tax
		when "PST"
			if ( ! prodCode.match(/.*Yard.*/) && ! native )
				true
			else
				false
			end
		when "GST"
			# for GST
			#  if native purchasing fuel other than  ls or non-native purchasing anything
			#    pay gst
			#  else - native purchasing ls or non-fuel
			#    no gst
			if ( native && prodCode.match(/^Yard ((?!LS).*)$/) && prodCode.match(/.*Yard.*/)) || ! native
				true
			else
				false
			end
		end
	end
	
	def isNative(band)
		band.length > 0 ? true : false
	end

	def taxList(native,prodCode)
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
	
	def fuelTaxTotal(native,prodCode)
		total = 0
		taxList(native,prodCode).inject({}) do |result, tax|
			total += tax[:rate]
		end
		return total
	end

	def fuelTaxDiscount(native,prodCode)
		return fuelTaxTotal(false,prodCode) - fuelTaxTotal(native,prodCode)
	end
		
end