require 'net/http'

class InvoicesController < ApplicationController
	
  # GET /invoices
  # GET /invoices.json
  def index
    @invoices = Invoice.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @invoices }
    end
  end

  # GET /invoices/1
  # GET /invoices/1.json
  def show

    if Counter::Application.config.printinvoices
    	puts "Executing:" + (Counter::Application.config.acrordcmd % params[:id])
    	system(Counter::Application.config.acrordcmd % params[:id])
  	end

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @invoice }
    end
  end

  # GET /invoices/new
  # GET /invoices/new.json
  def new
    @invoice = Invoice.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @invoice }
    end
  end

  # GET /invoices/1/edit
  def edit
    @invoice = Invoice.find(params[:id])
  end

  # POST /invoices
  # POST /invoices.json
  def create
  	# input
  	#   invoice - JSON representation of following structure
  	#     { :payment => [0,1,2], 
  	#				:customerName => "...",
  	#				:band => "...",
  	#				:lineItems => [ {
  	#					:lId => "...",
  	#					:quantity => "..."
  	#				} ]
  	#			}
  	
  	# output
  	#   :customerName
  	#		:band
  	#		:payment
  	#		:lineItems
  	#			:prodCode
  	#			:name
  	#			:quantity
  	#			:price
  	#			:amount
  	#			:includedItems
  	#				:lineItems
  	#					:name
  	#					:rate
  	#					:amount
  	#				:total
  	#			:includedCharges
  	#				:rate
  	#				:amount
  	#		:total
  	#		:subtotal
  	#		:taxes
  	#			:name
  	#			:rate
  	#			:amount
  	#
  	# for each lineItem
  	#   query item
  	#		if item fuel
  	#			subitems = fuelTaxes(native=false,item)
  	#		if item lube
  	#			subitems = ehc(item)
  	#
  	#	fuelTaxes(native,item)
  	#		if native
  	#			[ { :name => "FET", :rate => "0.10000", :amount => "15.00"} ]
  	#		else
  	#			[ { :name => "FET", :rate => "0.10000", :amount => "15.00"},
  	#				{ :name => "MFT", :rate => "0.14500", :amount => "21.75"},
  	#				{ :name => "Carbon", :rate => "0.07670", :amount => "11.51"} ]
  	#
  	# ehc(item)
  	#		{ :rate => "0.15", :amount => "6.00" }
  	
		@cart = Cart.new(params)
    @invoice = Invoice.new(@cart)
    
    if Counter::Application.config.printinvoices
#    	puts @cart[:invoicenum]
    	puts "Executing:" + Counter::Application.config.acrordcmd % [@cart[:invoicenum]]
    	system(Counter::Application.config.acrordcmd % [@cart[:invoicenum]])
  	end

		if Counter::Application.config.mailinvoices
			Mail.deliver do
				from Counter::Application.config.invoicefrom
				to Counter::Application.config.invoiceto
				subject 'Invoice: ' + @cart[:invoicenum]
				body Counter::Application.config.counterurl + 'invoices/' + @cart[:invoicenum] + '.pdf'
			end
		end

		render :nothing => true, :status => 200
  end

  # PUT /invoices/1
  # PUT /invoices/1.json
  def update
    @invoice = Invoice.find(params[:id])

    respond_to do |format|
      if @invoice.update_attributes(params[:invoice])
        format.html { redirect_to @invoice, notice: 'Invoice was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @invoice.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /invoices/1
  # DELETE /invoices/1.json
  def destroy
    @invoice = Invoice.find(params[:id])
    @invoice.destroy

    respond_to do |format|
      format.html { redirect_to invoices_url }
      format.json { head :no_content }
    end
  end
end
