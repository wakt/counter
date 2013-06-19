require 'net/http'

class CartsController < ApplicationController
	
  # GET /carts
  # GET /carts.json
  def index
    #	copy of create to conform to cross domai scripting - get vs post

  	# @cart will take the form of a hash contaning elements for the total, taxes (as applicable)
  	# and an array of line hashes eash of which contains name, packaging, quantity & total
  	# parameters are id's
  	# process
  	# for each item
  	#   get item details
  	#   determine line totals and taxes
  	#   tally totals
  	#   append to response
  	# append total an taxes to response
  	# input
  	#   payment parameters, item parameters
  	#     { :payment => Credit, :band => 6700098765, :items => [
  	#				{ :lId => 345, "quantity => 2 },
  	#				{ :lId => 346, "quantity => 5 },
  	#				]
  	#			}
  	#	output
  	#		total, taxes, line items
  	#			{ :total => 999.99, :taxes => [ 
  	#				{ :name => "GST", :total => 12.34 },
  	#				{ :name => "PST", :total => 56.78 }
  	#				],
  	#				:lineItems => [
  	#					{ :lId => 345, :name => "Some oil", :quantity => 2, :total => 234.56 },
  	#					{ :lId => 346, :name => "Fuel", :quantity => 200, :total => 678.90 }
  	#				]
  	#			}

		puts "get carts"
    @cart = Cart.new(params)

		params[:items].each do |item|
			url = Counter::Application.config.simplyurl + "items/" + item[1]['lId'] + ".json"
			resp = Net::HTTP.get_response(URI.parse(url));
			item = JSON.parse(resp.body)
							
		end
		
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @cart }
    end
  end

  # GET /carts/1
  # GET /carts/1.json
  def show
    @cart = Cart.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @cart }
    end
  end

  # GET /carts/new
  # GET /carts/new.json
  def new
  	"puts get carts new"
    @cart = Cart.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @cart }
    end
  end

  # GET /carts/1/edit
  def edit
    @cart = Cart.find(params[:id])
  end

  # POST /carts
  # POST /carts.json
  def create
  	# @cart will take the form of a hash contaning elements for the total, taxes (as applicable)
  	# and an array of line hashes eash of which contains name, packaging, quantity & total
  	# parameters are id's
  	# process
  	# for each item
  	#   get item details
  	#   determine line totals and taxes
  	#   tally totals
  	#   append to response
  	# append total an taxes to response
  	# input
  	#   payment parameters, item parameters
  	#     { :payment => Credit, :band => 6700098765, :items => [
  	#				{ :lId => 345, "quantity => 2 },
  	#				{ :lId => 346, "quantity => 5 },
  	#				]
  	#			}
  	#	output
  	#		total, taxes, line items
  	#			{ :total => 999.99, :taxes => [ 
  	#				{ :name => "GST", :total => 12.34 },
  	#				{ :name => "PST", :total => 56.78 }
  	#				],
  	#				:lineItems => [
  	#					{ :lId => 345, :name => "Some oil", :quantity => 2, :total => 234.56 },
  	#					{ :lId => 346, :name => "Fuel", :quantity => 200, :total => 678.90 }
  	#				]
  	#			}

		puts "cart create"
    @cart = Cart.new(params)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @cart }
    end
  end

  # PUT /carts/1
  # PUT /carts/1.json
  def update
    @cart = Cart.find(params[:id])

    respond_to do |format|
      if @cart.update_attributes(params[:cart])
        format.html { redirect_to @cart, notice: 'Cart was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @cart.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /carts/1
  # DELETE /carts/1.json
  def destroy
    @cart = Cart.find(params[:id])
    @cart.destroy

    respond_to do |format|
      format.html { redirect_to carts_url }
      format.json { head :no_content }
    end
  end
end
