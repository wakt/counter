require 'net/http'
require "uri"
require 'json'

class OffsetsController < ApplicationController
  # GET /offsets
  # GET /offsets.json
  def index
		@customers = Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'customers.json'))
		@productgroups = Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'productgroups.json'))
		@offsets = Net::HTTP.get(URI.parse( Counter::Application.config.simplyurl + 'offsets.json'))

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @offsets }
    end
  end

  # GET /offsets/1
  # GET /offsets/1.json
  def show
    @offset = Offset.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @offset }
    end
  end

  # GET /offsets/new
  # GET /offsets/new.json
  def new
    @offset = Offset.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @offset }
    end
  end

  # GET /offsets/1/edit
  def edit
    @offset = Offset.find(params[:id])
  end

  # POST /offsets
  # POST /offsets.json
  def create
		uri = URI.parse(Counter::Application.config.simplyurl)
		http = Net::HTTP.new(uri.host, uri.port)
		
		request = Net::HTTP::Post.new('/offsets.json')
		puts params
		puts params.slice(*['custids','acctids','itemids'])
		
		# ok, this join stuff is bogus - it encodes properly, but the other side only sees the last element and loses the array type - it's just string
		# this way, i 'split' it at the other side to recover my array
		# it should work without the join/split crap, but it doesn't
		request.set_form_data({:custids => ( params['custids'] || []).join(','), :acctids => ( params['acctids'] || []).join(','), :itemids => ( params['itemids'] || []).join(','), :amount => params['amount'], :type => params['type']})
		
		puts request.body
		
		response = http.request(request)
		puts response.body

    respond_to do |format|
      format.html { render :text => response.code == :ok ? "" : response.body, status: response.code }
      format.json { render :text => response.code == :ok ? "" : response.body, status: response.code }
    end
  end

  # PUT /offsets/1
  # PUT /offsets/1.json
  def update 
    @offset = Offset.find(params[:id])

    respond_to do |format|
      if @offset.update_attributes(params[:offset])
        format.html { redirect_to @offset, notice: 'Offset was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @offset.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /offsets/1
  # DELETE /offsets/1.json
  def destroy

		uri = URI.parse(Counter::Application.config.simplyurl)
		http = Net::HTTP.new(uri.host, uri.port)
		
		request = Net::HTTP::Delete.new('/offsets/doit.json')
		puts params
		puts params.slice(*['custids','acctids'])
		
		# ok, this join stuff is bogus - it encodes properly, but the other side only sees the last element and loses the array type - it's just string
		# this way, i 'split' it at the other side to recover my array
		# it should work without the join/split crap, but it doesn't
		request.set_form_data({:custids => ( params['custids'] || []).join(','), :acctids => ( params['acctids'] || []).join(','), :itemids => ( params['itemids'] || []).join(',')})
		
		puts request.body
		
		response = http.request(request)
		puts response.body

    respond_to do |format|
      format.html { render :text => response.code == :ok ? "" : response.body, status: response.code }
      format.json { render :text => response.code == :ok ? "" : response.body, status: response.code }
    end
  end
  
end
