require 'prawn'

Prawn::Document.generate("public\\MFT Test.pdf", :template => "public\\MFTRef.pdf", :margin => 25) do
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
	draw_text "2013/10/01", :at => [120,385], :style => :bold
	draw_text "2013/10/31", :at => [285,385], :style => :bold
	text_box "$0.00", :at => [462,357], :height => 100, :width => 100, :align => :right, :style => :bold
	text_box "$3,621.51", :at => [462,336], :height => 100, :width => 100, :align => :right, :style => :bold
	text_box "$27,646.39", :at => [462,315], :height => 100, :width => 100, :align => :right, :style => :bold
	text_box "$894.09", :at => [462,294], :height => 100, :width => 100, :align => :right, :style => :bold
	text_box "$120.96", :at => [462,273], :height => 100, :width => 100, :align => :right, :style => :bold
	text_box "$516.74", :at => [462,252], :height => 100, :width => 100, :align => :right, :style => :bold
	text_box "$9.963.46", :at => [462,231], :height => 100, :width => 100, :align => :right, :style => :bold
	text_box "$0.00", :at => [462,210], :height => 100, :width => 100, :align => :right, :style => :bold
	text_box "$0.00", :at => [462,189], :height => 100, :width => 100, :align => :right, :style => :bold
	text_box "$0.00", :at => [462,168], :height => 100, :width => 100, :align => :right, :style => :bold
	text_box "$0.00", :at => [462,147], :height => 100, :width => 100, :align => :right, :style => :bold
	text_box "$0.00", :at => [462,126], :height => 100, :width => 100, :align => :right, :style => :bold
	text_box "$42,763.15", :at => [462,105], :height => 100, :width => 100, :align => :right, :style => :bold
	draw_text "Tracy Auchter, secretary", :at => [195,15], :style => :bold
end

Prawn::Document.generate("public\\Carbon Test.pdf", :template => "public\\CarbonRef.pdf", :margin => 25) do
	go_to_page(3)
	font_size(10)
	draw_text "Fast Fuel Services Ltd.", :at => [0,570], :style => :bold
	draw_text "136231420", :at => [450,570], :style => :bold
	draw_text "PO Box 219", :at => [0,545], :style => :bold
	draw_text "Queen Charlotte, BC", :at => [0,533], :style => :bold
	draw_text "V0T 1S0", :at => [0,521], :style => :bold
	draw_text "Tracy Auchter", :at => [340,546], :style => :bold
	draw_text "250    559-4611", :at => [483,546], :style => :bold
	draw_text "tracy.auchter@fastfuel.ca", :at => [340,521], :style => :bold
	draw_text "250    559-4512", :at => [483,521], :style => :bold
	draw_text "\x0fc", :at => [350,505], :style => :bold
	draw_text "2013/10/01", :at => [60,403], :style => :bold
	draw_text "2013/10/31", :at => [152,403], :style => :bold
	draw_text "Diesel/Furnace", :at => [312,372], :style => :bold
	draw_text "Gasoline", :at => [412,372], :style => :bold
	draw_text "Stove Oil", :at => [501,372], :style => :bold
	text_box "11,459", :at => [295,236], :height => 100, :width => 100, :align => :center, :style => :bold
	text_box "68,714", :at => [380,220], :height => 100, :width => 100, :align => :center, :style => :bold
	text_box "1,316", :at => [465,236], :height => 100, :width => 100, :align => :center, :style => :bold
	text_box "11,459", :at => [295,150], :height => 100, :width => 100, :align => :center, :style => :bold
	text_box "68,714", :at => [380,150], :height => 100, :width => 100, :align => :center, :style => :bold
	text_box "1,316", :at => [465,150], :height => 100, :width => 100, :align => :center, :style => :bold
	text_box "$0.0767", :at => [295,135], :height => 100, :width => 100, :align => :center, :style => :bold
	text_box "$0.0667", :at => [380,135], :height => 100, :width => 100, :align => :center, :style => :bold
	text_box "$0.0783", :at => [465,135], :height => 100, :width => 100, :align => :center, :style => :bold
	text_box "$878.91", :at => [295,121], :height => 100, :width => 100, :align => :center, :style => :bold
	text_box "$4,583.22", :at => [380,121], :height => 100, :width => 100, :align => :center, :style => :bold
	text_box "$103.04", :at => [465,121], :height => 100, :width => 100, :align => :center, :style => :bold
	text_box "$5,565.17", :at => [465,106], :height => 100, :width => 100, :align => :center, :style => :bold
	draw_text "Tracy Auchter, secretary", :at => [239,15], :style => :bold
end