class MftrefundsController < ApplicationController
  # GET /mftrefunds
  # GET /mftrefunds.json
  def index
    @mftrefunds = Mftrefund.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @mftrefunds }
    end
  end

  # GET /mftrefunds/1
  # GET /mftrefunds/1.json
  def show
    @mftrefund = Mftrefund.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @mftrefund }
    end
  end

  # GET /mftrefunds/new
  # GET /mftrefunds/new.json
  def new
    @mftrefund = Mftrefund.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @mftrefund }
    end
  end

  # GET /mftrefunds/1/edit
  def edit
    @mftrefund = Mftrefund.find(params[:id])
  end

  # POST /mftrefunds
  # POST /mftrefunds.json
  def create
    @mftrefund = Mftrefund.new(params)

    respond_to do |format|
#      if @mftrefund.save
        format.html { redirect_to '/mftrefund.pdf', notice: 'Carbon tax refund report was successfully created.' }
        format.json { render json: @mftrefund, status: :created, location: @mftrefund }
#      else
#        format.html { render action: "new" }
#        format.json { render json: @mftrefund.errors, status: :unprocessable_entity }
#      end
    end
  end

  # PUT /mftrefunds/1
  # PUT /mftrefunds/1.json
  def update
    @mftrefund = Mftrefund.find(params[:id])

    respond_to do |format|
      if @mftrefund.update_attributes(params[:mftrefund])
        format.html { redirect_to @mftrefund, notice: 'Mftrefund was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @mftrefund.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /mftrefunds/1
  # DELETE /mftrefunds/1.json
  def destroy
    @mftrefund = Mftrefund.find(params[:id])
    @mftrefund.destroy

    respond_to do |format|
      format.html { redirect_to mftrefunds_url }
      format.json { head :no_content }
    end
  end
end
