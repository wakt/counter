class RamcardsController < ApplicationController
  # GET /ramcards
  # GET /ramcards.json
  
  def index
  @detailfields = [ "RecType","AccessNumber", "GrossDel","NetDel","AvgTemp","TicketNo","SaleNo","OpNo","ProdCode",
  						"EndUse","OdoStart","OdoChg","PricePerUnit","PriceNoTax","PctTaxCat1","TaxPerUnitCat1","PctTaxCat2",
  						"TaxPerUnitCat2","PctTaxSubtAnd12","PctTaxCat3","TaxPerUnitCat3","PctTaxCat4","TaxPerUnitCat4",
  						"TotalTax","VolDisc","MiscChg","GrandTotal","CashDisc","PmtRcvd","PmtType","BalDue","PctTankFull",
  						"AcctNo","StartDate","StartTime","EndDate","EndTime" ]
  @detailfieldnames = [ "Record Type","Access Number","Gross Volume Delivered","Net Volume Delivered","Average Temperature This Delivery",
"Ticket Number","Sale Number","Operator Number","Product Code","End Use Code","Odometer Start","Odometer Change",
"Price/Unit","Price of Product No Tax","% Tax Category 1","Tax/Unit Category 1","% Tax Category 2",
"Tax/Unit Category 2","% Tax on Subtotal + Categories 1&2","% Tax Category 3","Tax/Unit Category 3",
"% Tax Category 4","Tax/Unit Category 4","Total Tax This Delivery","Volume Discount Applied",
"Miscellaneous Charge","Grand Total This Delivery","Cash Discount","Payment Received",
"Type of Payment Received","Balance Due","% Tank Full","Order Number","Start of Delivery Date",
"Start of Delivery Time","End of Delivery Date","End of Delivery Time" ]

	@headerfields = [ "RecType","NoNum","NoText","RAMStatus","RAMID","UnitID","TruckNo","OdoDeltaPostLoad","CurrentOdo",
	"TotNetVolThisRAM","TotGrossVolThisRAM","1stTickAfterLoad","FinalTickBeforeRead","FinalSaleNoBeforeRead","FinalMiscBeforeRead",
	"TotNetVol","TotGrossVol","TotSalesNoTax","CumTaxPctCat1","CumTaxPerUnitCat1","CumTaxPctCat2","CumTaxPerUnitCat2",
	"SubTotCat1And2Tax","CumTaxPctCat3","CumTaxPerUnitCat3","CumTaxPctCat4","CumTaxPerUnitCat4",
	"TotTax","TotSalesInclTax","TotMisc","TotPmt","TotUnmtrdVolDeld","TotGrossVolNotPriced","TotNetVolNotPriced",
	"StartDate","StartTime","EndDate","EndTime" ]
	
	@headerfieldnames = [ "Record Type","RAM card use status","RAM card ID","Unit ID","Truck Number","Miles driven after loading RAM card",
"Current odometer reading","Total Net volume this RAM Card","Total Gross volume this RAM card",
"First ticket number after loading RAM card","Final ticket number before reading RAM card",
"Final sale number before reading RAM card","Final Misc. Trans No. before reading RAM card",
"Total Net volume","Total Gross volume","Total Sales No Tax","Cumulative Tax % Category 1",
"Cumulative Tax/Unit Category 1","Cumulative Tax % Category 2","Cumulative Tax/Unit Category 2",
"Sub-total + Category 1 & Category 2 Taxes","Cumulative Tax % Category 3",
"Cumulative Tax/Unit Category 3","Cumulative Tax % Category 4","Cumulative Tax/Unit Category 4",
"Total Tax","Total Sales Including Tax","Total Miscellaneous Charges","Total Payment Received",
"Total Unmetered Volume Delivered","Total Gross Volume Not Priced","Total Net Volume Not Priced",
"Start of Deliveries","Start of Deliveries","End of Deliveries","End of Deliveries" ]
  						
		@ramdata = IO.read("DELREAD.DAT")
		puts @ramdata

#		@ramheader = ActiveSupport::JSON.encode(
#			[@ramdata.gsub(/\"/,'').split("\n").first()].map { |line| 
#				Hash[Array.new(line.split(',').length).fill {|i| "col" + i.to_s}.zip(line.split(','))] })
		@ramheader = ActiveSupport::JSON.encode(
			[@ramdata.gsub(/\"/,'').split("\n").first()].map { |line| 
				Hash[@headerfields.zip(line.split(','))] })
		
#		@ramdata = ActiveSupport::JSON.encode(
#			@ramdata.gsub(/\"/,'').split("\n").last(@ramdata.split("\n").length-1).map { |line| 
#				Hash[Array.new(line.split(',').length).fill {|i| "col" + i.to_s}.zip(line.split(','))] })
		@ramdata = ActiveSupport::JSON.encode(
			@ramdata.gsub(/\"/,'').split("\n").last(@ramdata.split("\n").length-1).map { |line| 
				Hash[@detailfields.zip(line.split(','))] })
			
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @ramcards }
    end
  end

  # GET /ramcards/1
  # GET /ramcards/1.json
  def show
    @ramcard = Ramcard.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @ramcard }
    end
  end

  # GET /ramcards/new
  # GET /ramcards/new.json
  def new
    @ramcard = Ramcard.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @ramcard }
    end
  end

  # GET /ramcards/1/edit
  def edit
    @ramcard = Ramcard.find(params[:id])
  end

  # POST /ramcards
  # POST /ramcards.json
  def create
    @ramcard = Ramcard.new(params[:ramcard])

    respond_to do |format|
#      if @ramcard.save
        format.html { redirect_to @ramcard, notice: 'Ramcard was successfully created.' }
#        format.json { render json: @ramcard, status: :created, location: @ramcard }
        format.json { render json: [], status: :created}
#      else
#        format.html { render action: "new" }
#        format.json { render json: @ramcard.errors, status: :unprocessable_entity }
#      end
    end
  end

  # PUT /ramcards/1
  # PUT /ramcards/1.json
  def update
    @ramcard = Ramcard.find(params[:id])

    respond_to do |format|
      if @ramcard.update_attributes(params[:ramcard])
        format.html { redirect_to @ramcard, notice: 'Ramcard was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @ramcard.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /ramcards/1
  # DELETE /ramcards/1.json
  def destroy
    @ramcard = Ramcard.find(params[:id])
    @ramcard.destroy

    respond_to do |format|
      format.html { redirect_to ramcards_url }
      format.json { head :no_content }
    end
  end
end
