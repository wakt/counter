require 'net/http'
require 'json'

class SchedulesController < ApplicationController
  # GET /schedules
  # GET /schedules.json
  
#  @@fldmap = [:ordernum, :name, :shipTo, :product, :quantity, :orderdate, :interval, :regioncode, :accesscode, :capacity, :lId]
  @@fldmap = ['ordernum', 'name', 'shipTo', 'product', 'quantity', 'orderdate', 'interval', 'regioncode', 'accesscode', 'capacity', 'lId', 'invoices']
					
  def index
#    @schedules = Schedule.all
		@schedules = []
#		@orders = Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'orders.json'))
		@orders = Order.all
		puts @orders
		# need to map response to structure required by page
		# select items with applicable product codes
		# mark items as interval or not
		puts 'Order mapping'
#		puts ActiveSupport::JSON.encode((ActiveSupport::JSON.decode(@orders).select {|order| 
#			isPartCodeApplicable(order['itemcode'])}).map {|fuelorder|
#				Hash[fuelorder.map {|k,v| [k.to_s,v] } ]
#			} )

#		@orders = ActiveSupport::JSON.encode(ActiveSupport::JSON.decode(@orders).select {|order| 
#		isPartCodeApplicable(order['itemcode'])}.map {|order| order.slice(*@@fldmap) }.map {|order| order['interval'] = (order['interval'] == true ? 'Y' : 'N'); order} )
		
=begin				 
		@orders = ActiveSupport::JSON.encode((ActiveSupport::JSON.decode(@orders).select {|order| 
			isPartCodeApplicable(order['itemcode'])}).map {|fuelorder|
				{:ordernum => fuelorder['ordernum'], :name => fuelorder['clientname'], :shipTo => fuelorder['shipto'],
					:product => fuelorder['itemname'], :quantity => fuelorder['quantity'],
					:orderdate => fuelorder['orderdate'], :interval => (fuelorder['interval'] == true ? 'Y' : 'N'),
					:regioncode => fuelorder['regioncode'], :accesscode => fuelorder['accesscode'],
					:capacity => fuelorder['tankcapacity'], :lId => fuelorder['lid'] }
				 })
=end
		puts @orders
		
		@trips = ActiveSupport::JSON.encode([ { :tripdate => DateTime.new(2013,7,1).strftime('%Y%m%d'), :trips => 
								[ { :truck => '368', :index => 0, :orders => [
									{:ordernum => "000001",:name => "Aaron Mark Services",
										:product => "20L Pail Arox EP 150",:shipTo => "Aaron Mark Services PO Box 7 Queen Charlotte, BC  V0T 1S0   ",
										:orderdate => "20130731",:quantity => 1.0,:interval => false}
									] },
								{ :truck => '367', :index => 1, :orders => [] } ] },
							 { :tripdate => DateTime.new(2013,7,2).strftime('%Y%m%d'), :trips => 
								[ { :truck => '369', :index => 0, :orders => [] },
								{ :truck => '370', :index => 1, :orders => [] } ] },
							 { :tripdate => DateTime.new(2013,7,3).strftime('%Y%m%d'), :trips => [] },
							 { :tripdate => DateTime.new(2013,7,4).strftime('%Y%m%d'), :trips => [] },
							 { :tripdate => DateTime.new(2013,7,5).strftime('%Y%m%d'), :trips => [] },
							 { :tripdate => DateTime.new(2013,7,6).strftime('%Y%m%d'), :trips => [] },
							 { :tripdate => DateTime.new(2013,7,7).strftime('%Y%m%d'), :trips => [] } ])
							 
		# get the trip data and pad to one week, if necessary
		@trips = ActiveSupport::JSON.decode(Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'days/' + Date.today.strftime("%Y%m%d") + '.json?days=7')))
#		@trips = ActiveSupport::JSON.decode(Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'days/20130901.json?days=7')))
#		anchordate=Date.parse(@trips[0]['tripdate'])
		
#		((@trips.length)..6).each do |i|
#			@trips.push({'tripdate' => (anchordate + i).strftime('%Y%m%d'), 'trips' => [] })
#		end
		@trips = ActiveSupport::JSON.encode(@trips)

		puts "trips"
		puts @trips
							
    respond_to do |format|
      format.html {render layout: false} # index.html.erb
      format.json { render json: @trips }
    end
  end
  
  def isPartCodeApplicable(sPartCode)
  	return true
  end

  # GET /schedules/1
  # GET /schedules/1.json
  def show
    @schedule = Schedule.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @schedule }
    end
  end

  # GET /schedules/new
  # GET /schedules/new.json
  def new
    @schedule = Schedule.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @schedule }
    end
  end

  # GET /schedules/1/edit
  def edit
    @schedule = Schedule.find(params[:id])
  end

  # POST /schedules
  # POST /schedules.json
  def create
    @schedule = Schedule.new(params[:schedule])

    respond_to do |format|
      if @schedule.save
        format.html { redirect_to @schedule, notice: 'Schedule was successfully created.' }
        format.json { render json: @schedule, status: :created, location: @schedule }
      else
        format.html { render action: "new" }
        format.json { render json: @schedule.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /schedules/1
  # PUT /schedules/1.json
  def update
    @schedule = Schedule.find(params[:id])

    respond_to do |format|
      if @schedule.update_attributes(params[:schedule])
        format.html { redirect_to @schedule, notice: 'Schedule was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @schedule.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /schedules/1
  # DELETE /schedules/1.json
  def destroy
    @schedule = Schedule.find(params[:id])
    @schedule.destroy

    respond_to do |format|
      format.html { redirect_to schedules_url }
      format.json { head :no_content }
    end
  end
end
