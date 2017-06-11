class ManifestsController < ApplicationController
  # GET /manifests
  # GET /manifests.json
  def index
    @manifests = Manifest.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @manifests }
    end
  end

  # GET /manifests/1
  # GET /manifests/1.json
  def show
    @manifest = Manifest.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @manifest }
    end
  end

  # GET /manifests/new
  # GET /manifests/new.json
  def new
    @manifest = Manifest.new(params)

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @manifest }
    end
  end

  # GET /manifests/1/edit
  def edit
    @manifest = Manifest.find(params[:id])
  end

  # POST /manifests
  # POST /manifests.json
  def create
#    @manifest = Manifest.new(params[:manifest])
		puts params[:manifest]
#		@manifest = ActiveSupport::JSON.decode(params)
#		puts @manifest

#		params = { :truck => "369", :driver => "Diamond Dave", :orders => [ 
#			{ :ordernum => "000002", :name => "Bob Smith", :shipTo => "123 Main St., Timbuktu", :product => "Stove Oil", :quantity => 77, :capacity => 5000, :orderdate => "07/01/2013", :interval => true }, 
#			{ :ordernum => "000005", :name => "Billy Bob Redneck", :shipTo => "Last house on back road, Pot Clements", :product => "Jet Fuel", :quantity => 280, :capacity => 25000, :orderdate => "07/02/2013", :interval => true }, 
#			{ :ordernum => "000003", :name => "John Doe", :shipTo => "345 Back Rd., Nowhere", :product => "Jet Fuel", :quantity => 153, :capacity => 15000, :orderdate => "07/01/2013", :interval => false  } 
#		] }
		

    @manifest = Manifest.new(params[:manifest])

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: [] }
    end
#		render :nothing => true, :status => 200
#    respond_to do |format|
#      if @manifest.save
#        format.html { redirect_to @manifest, notice: 'Manifest was successfully created.' }
#        format.json { render json: @manifest, status: :created, location: @manifest }
#      else
#        format.html { render action: "new" }
#        format.json { render json: @manifest.errors, status: :unprocessable_entity }
#      end
#    end
  end

  # PUT /manifests/1
  # PUT /manifests/1.json
  def update
    @manifest = Manifest.find(params[:id])

    respond_to do |format|
      if @manifest.update_attributes(params[:manifest])
        format.html { redirect_to @manifest, notice: 'Manifest was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @manifest.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /manifests/1
  # DELETE /manifests/1.json
  def destroy
    @manifest = Manifest.find(params[:id])
    @manifest.destroy

    respond_to do |format|
      format.html { redirect_to manifests_url }
      format.json { head :no_content }
    end
  end
end
