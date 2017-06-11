require 'net/http'
require "uri"
require 'json'

class RackpricesController < ApplicationController
  # GET /rackprices
  # GET /rackprices.json
  def index
#    @rackprices = Rackprice.all

		if(!params['recordstartindex'].blank?) then
#			@rackprices = Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 
#				'rackprices.json?partcodes[]=TF000942&partcodes[]=TF000953&&partcodes[]=TF000940&partcodes[]=TF000963&startdate=' + 
#				(DateTime.now.to_date - params['recordstartindex'].to_i).strftime("%Y-%m-%d") + '&duration=' + (params['recordendindex'].to_i - params['recordstartindex'].to_i).to_s))
			@rackprices = Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'rackprices.json?startdate=' + 
				(DateTime.now.to_date - params['recordstartindex'].to_i).strftime("%Y-%m-%d") + '&duration=' + (params['recordendindex'].to_i - params['recordstartindex'].to_i).to_s))
			@rackobj = JSON.parse(@rackprices)
		else
			@rackprices = Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'rackprices.json?startdate=' + 
#				'rackprices.json?partcodes[]=TF000942&partcodes[]=TF000953&&partcodes[]=TF000940&partcodes[]=TF000963&startdate=' + 
				DateTime.now.strftime("%Y-%m-%d") + '&duration=10'))
			@rackobj = JSON.parse(@rackprices)
		end
		
		puts @rackprices.class
		puts @rackobj.class
		puts 'rackobj'
		puts @rackobj
		puts '[0]'
		puts @rackobj[0]

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @rackprices }
    end
  end

  # GET /rackprices/1
  # GET /rackprices/1.json
  def show
  	puts params.inspect
  	
#    @rackprice = Rackprice.find(params[:id])
		@rackprices = Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 
			'rackprices.json?' + 
			params['partcodes'].map {|partcode| 'partcodes[]=' + partcode}.join('&') + '&startdate=' + params['id'] + '&duration=' + params['duration']))
		@rackobj = JSON.parse(@rackprices)
		
		puts @rackprices

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @rackprices }
    end
  end

  # GET /rackprices/new
  # GET /rackprices/new.json
  def new
    @rackprice = Rackprice.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @rackprice }
    end
  end

  # GET /rackprices/1/edit
  def edit
    @rackprice = Rackprice.find(params[:id])
  end

  # POST /rackprices
  # POST /rackprices.json
  def create
    @rackprice = Rackprice.new(params[:rackprice])

    respond_to do |format|
      if @rackprice.save
        format.html { redirect_to @rackprice, notice: 'Rackprice was successfully created.' }
        format.json { render json: @rackprice, status: :created, location: @rackprice }
      else
        format.html { render action: "new" }
        format.json { render json: @rackprice.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /rackprices/1
  # PUT /rackprices/1.json
  def update
#    @rackprice = Rackprice.find(params[:id])

		puts params
		
		uri = URI.parse(Counter::Application.config.simplyurl)
		http = Net::HTTP.new(uri.host, uri.port)
		
		request = Net::HTTP::Put.new('/rackprices/' + params[:id] + '.json')
		request.set_form_data(params.slice(*['acct','price']))
		response = http.request(request)
		
		puts response.inspect

    respond_to do |format|
      format.html { render :text => response.body, status: response.code }
      format.json { render :text => response.body, status: response.code }
    end
#    respond_to do |format|
#      if @rackprice.update_attributes(params[:rackprice])
#        format.html { redirect_to @rackprice, notice: 'Rackprice was successfully updated.' }
#        format.json { head :no_content }
#      else
#        format.html { render action: "edit" }
#        format.json { render json: @rackprice.errors, status: :unprocessable_entity }
#      end
#    end
  end

  # DELETE /rackprices/1
  # DELETE /rackprices/1.json
  def destroy
    @rackprice = Rackprice.find(params[:id])
    @rackprice.destroy

    respond_to do |format|
      format.html { redirect_to rackprices_url }
      format.json { head :no_content }
    end
  end
end
