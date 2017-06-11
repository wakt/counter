class CarbontaxrefundsController < ApplicationController
  # GET /carbontaxrefunds
  # GET /carbontaxrefunds.json
  def index
    @carbontaxrefunds = Carbontaxrefund.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @carbontaxrefunds }
    end
  end

  # GET /carbontaxrefunds/1
  # GET /carbontaxrefunds/1.json
  def show
    @carbontaxrefund = Carbontaxrefund.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @carbontaxrefund }
    end
  end

  # GET /carbontaxrefunds/new
  # GET /carbontaxrefunds/new.json
  def new
    @carbontaxrefund = Carbontaxrefund.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @carbontaxrefund }
    end
  end

  # GET /carbontaxrefunds/1/edit
  def edit
    @carbontaxrefund = Carbontaxrefund.find(params[:id])
  end

  # POST /carbontaxrefunds
  # POST /carbontaxrefunds.json
  def create
    @carbontaxrefund = Carbontaxrefund.new(params)

    respond_to do |format|
#      if @carbontaxrefund.save
        format.html { redirect_to '/carbontaxrefund.pdf', notice: 'Carbon tax refund report was successfully created.' }
        format.json { render json: @carbontaxrefund, status: :created, location: @carbontaxrefund }
#      else
#        format.html { render action: "new" }
#        format.json { render json: @carbontaxrefund.errors, status: :unprocessable_entity }
#      end
    end
  end

  # PUT /carbontaxrefunds/1
  # PUT /carbontaxrefunds/1.json
  def update
    @carbontaxrefund = Carbontaxrefund.find(params[:id])

    respond_to do |format|
      if @carbontaxrefund.update_attributes(params[:carbontaxrefund])
        format.html { redirect_to @carbontaxrefund, notice: 'Carbontaxrefund was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @carbontaxrefund.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /carbontaxrefunds/1
  # DELETE /carbontaxrefunds/1.json
  def destroy
    @carbontaxrefund = Carbontaxrefund.find(params[:id])
    @carbontaxrefund.destroy

    respond_to do |format|
      format.html { redirect_to carbontaxrefunds_url }
      format.json { head :no_content }
    end
  end
end
