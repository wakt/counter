class OrdersController < ApplicationController
  # GET /orders
  # GET /orders.json
  def index
  	# somewhat counter-intutive - this returns the customers, which are then selected from to get order info
#    @orders = Order.all
		@customers = Customer.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @orders }
    end
  end

  # GET /orders/1
  # GET /orders/1.json
  def show
#    @order = Order.find(params[:id])
		@orders = Order.find(params);
		
#		puts @orders.inspect

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @orders }
    end
  end

  # GET /orders/new
  # GET /orders/new.json
  def new
  	puts params
  	response = Order.new(params)
  	
  	puts response.inspect
  	
    respond_to do |format|
      format.html { render :text => response.code == :ok ? "" : response.body, status: response.code }
      format.json { render :text => response.code == :ok ? "" : response.body, status: response.code }
		end
		
  end

  # GET /orders/1/edit
  def edit
    @order = Order.find(params[:id])
  end

  # POST /orders
  # POST /orders.json
  def create
  	response = Order.fulfill(params)
#    @order = Order.new(params[:order])

    respond_to do |format|
	    format.html { render :text => response.code == :ok ? "" : response.body, status: response.code }
	    format.json { render :text => response.code == :ok ? "" : response.body, status: response.code }
	  end
  end

  # PUT /orders/1
  # PUT /orders/1.json
  def update
  	response = Order.update(params)
#    @order = Order.find(params[:id])

    respond_to do |format|
	    format.html { render :text => response.code == :ok ? "" : response.body, status: response.code }
	    format.json { render :text => response.code == :ok ? "" : response.body, status: response.code }
	  end
  end

  # DELETE /orders/1
  # DELETE /orders/1.json
  def destroy
#    @order = Order.find(params[:id])
#    @order.destroy
    response = Order.destroy(params)

    respond_to do |format|
	    format.html { render :text => response.code == :ok ? "" : response.body, status: response.code }
	    format.json { render :text => response.code == :ok ? "" : response.body, status: response.code }
	  end
  end
  
end
