module Taxation

	def fuelTaxRateDiscount(native,prodCode)
		puts fuelTaxRateTotal(native,prodCode)
		return fuelTaxRateTotal(false,prodCode) - fuelTaxRateTotal(native,prodCode)
	end
	
	def fuelTaxRateTotal(native,prodCode)
		total = taxList(native,prodCode).inject(0) do |total, tax|
			total + tax[:rate]
		end
		return total
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
	
end