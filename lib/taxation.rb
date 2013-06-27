module Taxation

	def self.sellingPrice(item,native,payment)
		if( item['sPartCode'] =~ /.*Yard .*/)
			price = item['dPrice'].to_f
			price -= Taxation::fuelTaxRateDiscount(native,item['sPartCode'])
			if(payment == "0")
				price -= 0.015
			end
			if item['statuspremium'] != nil
				price += item['statuspremium'].to_f
			end
			price = sprintf("%.04f", price)
		else
			item['dPrice']
		end
	end

	def self.fuelTaxRateDiscount(native,prodCode)
#		puts fuelTaxRateTotal(native,prodCode)
		return fuelTaxRateTotal(false,prodCode) - fuelTaxRateTotal(native,prodCode)
	end
	
	def self.fuelTaxRateTotal(native,prodCode)
		total = taxList(native,prodCode).inject(0) do |total, tax|
			total + tax[:rate]
		end
		return total
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
	
end