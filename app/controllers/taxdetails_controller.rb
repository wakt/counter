class TaxdetailsController < ApplicationController
  # GET /taxdetails
  # GET /taxdetails.json
  def index
#    @taxdetails = Taxdetail.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @taxdetails }
    end
  end

  # GET /taxdetails/1
  # GET /taxdetails/1.json
  def show
    @taxdetail = Taxdetail.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @taxdetail }
    end
  end

  # GET /taxdetails/new
  # GET /taxdetails/new.json
  def new
    @taxdetail = Taxdetail.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @taxdetail }
    end
  end

  # GET /taxdetails/1/edit
  def edit
    @taxdetail = Taxdetail.find(params[:id])
  end

  # POST /taxdetails
  # POST /taxdetails.json
  def create
#    @taxdetail = Taxdetail.new(params[:taxdetail])
    @taxdetail = Taxdetail.new(params)

    respond_to do |format|
#      if @taxdetail.save
#        format.html { redirect_to @taxdetail, notice: 'Taxdetail was successfully created.' }
        format.html { redirect_to '/invoice/taxdetail.pdf', notice: 'Taxdetail was successfully created.' }
        format.json { render json: @taxdetail, status: :created, location: @taxdetail }
#      else
#        format.html { render action: "new" }
#        format.json { render json: @taxdetail.errors, status: :unprocessable_entity }
#      end
    end
  end

  # PUT /taxdetails/1
  # PUT /taxdetails/1.json
  def update
    @taxdetail = Taxdetail.find(params[:id])

    respond_to do |format|
      if @taxdetail.update_attributes(params[:taxdetail])
        format.html { redirect_to @taxdetail, notice: 'Taxdetail was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @taxdetail.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /taxdetails/1
  # DELETE /taxdetails/1.json
  def destroy
    @taxdetail = Taxdetail.find(params[:id])
    @taxdetail.destroy

    respond_to do |format|
      format.html { redirect_to taxdetails_url }
      format.json { head :no_content }
    end
  end
end
