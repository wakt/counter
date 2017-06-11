class FuelpricesController < ApplicationController
  # GET /fuelprices
  # GET /fuelprices.json
  def index
    @fuelprices = Fuelprice.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @fuelprices }
    end
  end

  # GET /fuelprices/1
  # GET /fuelprices/1.json
  def show
  	puts 'show'
  	
    @fuelprices = Fuelprice.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @fuelprice }
    end
  end

  # GET /fuelprices/new
  # GET /fuelprices/new.json
  def new
    @fuelprice = Fuelprice.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @fuelprice }
    end
  end

  # GET /fuelprices/1/edit
  def edit
    @fuelprice = Fuelprice.find(params[:id])
  end

  # POST /fuelprices
  # POST /fuelprices.json
  def create
    @fuelprice = Fuelprice.new(params[:fuelprice])

    respond_to do |format|
      if @fuelprice.save
        format.html { redirect_to @fuelprice, notice: 'Fuelprice was successfully created.' }
        format.json { render json: @fuelprice, status: :created, location: @fuelprice }
      else
        format.html { render action: "new" }
        format.json { render json: @fuelprice.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /fuelprices/1
  # PUT /fuelprices/1.json
  def update
		uri = URI.parse(Counter::Application.config.simplyurl)
		http = Net::HTTP.new(uri.host, uri.port)
		
		request = Net::HTTP::Put.new('/fuelprices/' + params[:id] + '.json')
		request.set_form_data(params.slice(*['lid','price']))
		response = http.request(request)

    respond_to do |format|
      format.html { render :text => "ok", status: :ok }
      format.json { render :text => response.body, status: response.code }
    end
#    @fuelprice = Fuelprice.find(params[:id])

#    respond_to do |format|
#      if @fuelprice.update_attributes(params[:fuelprice])
#        format.html { redirect_to @fuelprice, notice: 'Fuelprice was successfully updated.' }
#        format.json { head :no_content }
#      else
#        format.html { render action: "edit" }
#        format.json { render json: @fuelprice.errors, status: :unprocessable_entity }
#      end
#    end
  end

  # DELETE /fuelprices/1
  # DELETE /fuelprices/1.json
  def destroy
    @fuelprice = Fuelprice.find(params[:id])
    @fuelprice.destroy

    respond_to do |format|
      format.html { redirect_to fuelprices_url }
      format.json { head :no_content }
    end
  end
end
