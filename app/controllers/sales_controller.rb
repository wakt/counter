require 'net/http'
require 'json'
require 'taxation'

class SalesController < ApplicationController
  # GET /sales
  # GET /sales.json
  def index
#  	@sales = Sale.all

#		@customers = Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'customers.json'))
		@customers = Customer.all
#		@customers = Net::HTTP.get(URI.parse('http://127.0.0.1:3001/customers.json'))
#		@items = Net::HTTP.get(URI.parse('http://127.0.0.1:3001/items.json'))
		@items = Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'items.json'))
#		puts "raw items"
#		puts @items
#		puts "parsed items"
#		puts ActiveSupport::JSON.decode(@items).size
		@items = ActiveSupport::JSON.decode(@items).map { |group|
#			puts group
			group.map { |item|
#				puts item 
				item['packaging'] = item['packaging'].map { |pkg|
					if pkg['statuspremium'] != nil
						pkg['statusprice'] = Taxation::sellingPrice(pkg,true,"1")
					end
					pkg
				}
				item
			}
		}
		@items = ActiveSupport::JSON.encode(@items)
#		puts "reencoded items"
#		puts @items
			
    respond_to do |format|
      format.html # index.html.erb
#      format.json { render json: @sales }
    end
  end

  # GET /sales/1
  # GET /sales/1.json
  def show
    @sale = Sale.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @sale }
    end
  end

  # GET /sales/new
  # GET /sales/new.json
  def new
    @sale = Sale.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @sale }
    end
  end

  # GET /sales/1/edit
  def edit
    @sale = Sale.find(params[:id])
  end

  # POST /sales
  # POST /sales.json
  def create
    @sale = Sale.new(params[:sale])

    respond_to do |format|
      if @sale.save
        format.html { redirect_to @sale, notice: 'Sale was successfully created.' }
        format.json { render json: @sale, status: :created, location: @sale }
      else
        format.html { render action: "new" }
        format.json { render json: @sale.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /sales/1
  # PUT /sales/1.json
  def update
    @sale = Sale.find(params[:id])

    respond_to do |format|
      if @sale.update_attributes(params[:sale])
        format.html { redirect_to @sale, notice: 'Sale was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @sale.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /sales/1
  # DELETE /sales/1.json
  def destroy
    @sale = Sale.find(params[:id])
    @sale.destroy

    respond_to do |format|
      format.html { redirect_to sales_url }
      format.json { head :no_content }
    end
  end
end
