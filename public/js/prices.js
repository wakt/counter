	var lastprice = '';
	var keyPressTime = +new Date();

	function prepareGridData(fuelprices) {
		console.log(fuelprices);
		if(jQuery.isEmptyObject(fuelprices) ||
			jQuery.isEmptyObject(fuelprices['days']))
			return [];
		
		x = fuelprices['days'][0]['accts'].map(function(acct) { return {'acctname': acct['acctname']}; });
		console.log(x);
		console.log(fuelprices['days'][0]['accts'].map(function(acct) { return {'lid': acct['acct']}; }));
		
		griddata = fuelprices['days'][0]['accts'].map(function(acct) { return {'lid': acct['acct'], 'acctname': acct['acctname']}; }).map(function(acct) {
//			console.log('acct');
//			console.log(acct);
			x = fuelprices['days'].map(function(day) { 
//				console.log('day');
//				console.log(day);
				ret = {'acct': {'lid': acct['lid'], 'acctname': acct['acctname']}};
				found = $.grep(day['accts'],function(inneracct) { return inneracct['acct'] == acct['lid']; });
				if(!jQuery.isEmptyObject(found)) {
//					console.log('found');
//					console.log(found);
					ret[day['pricedate']] = found[0]['price'];
				}
				return ret;
			});
			
			avgs = fuelprices['days'].map(function(day) { 
				ret = {'acct': {'lid': acct['lid'], 'acctname': acct['acctname']}};
				found = $.grep(day['accts'],function(inneracct) { return inneracct['acct'] == acct['lid']; });
				if(!jQuery.isEmptyObject(found)) {
					ret[day['pricedate']] = found[0]['avgcost'];
				}
				return ret;
			});
			
			console.log('avgs');
			console.log(x);
			console.log(avgs);
			console.log(avgs.reduce(function(acc,acct) {
				return $.extend(acc,acct);
			}));
			
//			console.log(x);
//			console.log(x.reduce(function(acc,acct) {
//				return $.extend(acc,acct);
//			}));
//			return x;
			return x.reduce(function(acc,acct) {
				return $.extend(acc,acct);
			});
		});
		
		console.log(griddata);
		
		return griddata;
	}
		
	function createGridSource(fuelprices) {
		return     {
        datatype: "json",
        datafields: Object.keys(fuelprices[0]).map(function(key) {
        return {'name': key}; }),
        localdata: fuelprices,
    };
   }
		
	function showGrid(fuelprices) {
		
//		console.log('keys');
//		console.log(Object.keys(fuelprices[0]).map(function(key) {
//        return {'name': key}; }));
        	
//    console.log('columns');
//    console.log(Object.keys(fuelprices[0]).filter(function(key) { return key != 'acctname'; } ).map(function(key) {
//		    return {'text': key, 'datafield': key}; } ) );
//    console.log([{text: 'Account', datafield: 'acctname'}].concat(Object.keys(fuelprices[0]).filter(function(key) { return key != 'acctname'; } ).map(function(key) {
//		    return {'text': key, 'datafield': key}; } )));
		    	
		var cellsrenderer = function(row,columnfield,value,defaulthtml,columnproperties) { 
			console.log('renderer');
			console.log(value);
			return value['acctname'];
		}
		
		var source = createGridSource(fuelprices);
//    var source =
//    {
//        datatype: "json",
//        datafields: Object.keys(fuelprices[0]).map(function(key) {
//        return {'name': key}; }),
//        localdata: fuelprices,
//    };
    
  	var dataAdapter = new $.jqx.dataAdapter(source);    
		
		$("#PriceGrid").jqxGrid(
		{
	    source: dataAdapter,
	    width: '100%',
	    autoheight: true,
	    columns: [{text: 'Account', datafield: 'acct', 'pinned': true, width: 150, cellsrenderer: cellsrenderer}].concat(Object.keys(fuelprices[0]).filter(function(key) { return key != 'acct'; } ).map(function(key) {
		    return {'text': key, 'datafield': key, width: 150, cellsformat: 'f4'}; } ) ),
      selectionmode: 'singlecell',
      enableellipsis: false
		});
		
		$("#PriceGrid").on('cellselect', function (event) {
			console.log(event);
			if(event.args.datafield != 'acctname') {
				console.log('click');
				console.log($("#PriceGrid").jqxGrid('source')['originaldata'][args.rowindex]['acct']);
				console.log($("#PriceGrid").jqxGrid('source')['originaldata'][args.rowindex][args.datafield]);
				today = new Date;
				console.log((today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate()));
				if(args.datafield == (today.getFullYear() + '-' + zeroPad(today.getMonth() + 1,2) + '-' + zeroPad(today.getDate(),2))) {
					preparePriceDialog(args.datafield,
						$("#PriceGrid").jqxGrid('source')['originaldata'][args.rowindex][args.datafield],
						$("#PriceGrid").jqxGrid('source')['originaldata'][args.rowindex]['acct'])
				}
			}
		});
		
		$("#PriceGrid").jqxGrid('sortby','acctname','asc');
		$("#PriceGrid").jqxGrid('scrolloffset',0,1000);

	}
	
	function maxPrice(fuelprices) {
		max=0;
		fuelprices['days'].forEach(function(day) {
			day['accts'].forEach(function(acct) {
				if(acct['price']>max)
					max = acct['price'];
			});
		});
		console.log('max:' + max);
		return max;
	}
	
	function minPrice(fuelprices) {
		min=1000;
		fuelprices['days'].forEach(function(day) {
			day['accts'].forEach(function(acct) {
				if(acct['price']<min && acct['price'] != null)
					min = acct['price'];
			});
		});
		console.log('min:' + min);
		return min;
	}
	
	function prepareChartData(fuelprices) {
		return fuelprices['days'].map(function(day) {
			ret = {}; 
			ret['date'] = new Date(day['pricedate'] + "T08:00:00"); 
			day['accts'].forEach(function(acct) {
				ret[acct['acctname']] = parseFloat(acct['price']).toFixed(4);
			});
			return ret;
		});			
	}
	
	function createChartSource(fuelprices) {
	
    // prepare the data
    var source =
    {
        datatype: "json",
        datafields: [{ name: 'date' }].concat(fuelprices['days'][0]['accts'].map(function(acct) { return {'name': acct['acctname']}; })),
        localdata: prepareChartData(fuelprices)
    };
    
    console.log(source);
    
    var dataAdapter = new $.jqx.dataAdapter(source);
    
    console.log(dataAdapter);
    
    return dataAdapter;
	}
	
	function createChart(fuelprices) {
		
		console.log('createChart');
		
    // prepare jqxChart settings
    var settings = {
        title: "Prices",
        description: "",
        enableAnimations: true,
        showLegend: true,
        padding: { left: 10, top: 5, right: 10, bottom: 5 },
        titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
        source: createChartSource(fuelprices),
        categoryAxis:
            {
                dataField: 'date',
                formatFunction: function (value) {
                    return ((value.getMonth()+1) + "/" + value.getDate());
                },
                type: 'date',
                displayText: 'Date',
                baseUnit: 'day',
                showTickMarks: true,
                tickMarksInterval: 1,
                tickMarksColor: '#888888',
                unitInterval: 7,
                showGridLines: true,
                gridLinesInterval: 7,
                gridLinesColor: '#888888',
                valuesOnTicks: false
            },
        colorScheme: 'scheme04',
        seriesGroups:
            [
                {
                    type: 'line',
//                    type: 'spline',
                    formatSettings: {
                    	decimalPlaces: 4
                    },
                    valueAxis:
                    {
                        unitInterval: .0100,
                        minValue: minPrice(fuelprices) - .0100,
                        maxValue: maxPrice(fuelprices) + .0100,
                        displayValueAxis: true,
                        description: 'Price',
                        axisSize: 'auto',
                        tickMarksColor: '#888888',
                        tickMarksInterval: .01,
                        gridLinesInterval: .01,
				                formatFunction: function (value) {
				                    return value.toFixed(4);
				                },
				                toolTipFormatFunction: function (value) {
			                    return value;
				                },
				                formatSettings: {
				                	decimalPlaces: 4
				                }
                    },
                    series: fuelprices['days'][0]['accts'].map(function(acct) {
                    					return { 'dataField': acct['acctname'], 'displayText': acct['acctname']};
                    				})
                }
            ]
    };
    // setup the chart
    
    console.log('creating chart');
//    $('#Chart').width($("#HistoryTable").width());
    $('#PriceChart').jqxChart(settings);	
  }

	function initializePriceDialog() {
    $( "#PriceDialog" ).dialog({
      autoOpen: false,
      height: 300,
      width: 500,
      modal: true,
      show: "fade",
      title: "Price",
      open: function(event, ui) {
				$(".ui-dialog").css("zIndex","10000");
			} ,
      buttons: {
		    "Update Price": function() {
        	$( this ).dialog( "close" );
        },	
	      Cancel: function() {
		      $( this ).dialog( "close" );
  		  }
  		}
    });
    
	}

	function preparePriceDialog(date,price,acct) {
		console.log(date);
		console.log(acct);
		console.log(price);
		$("#DialogDate").html(date);
		$("#DialogProduct").html(acct['acctname']);
		if(price != null) {
			$("#PriceInput").val(parseFloat(price).toFixed(4));
			lastprice = price;
		}
		else {
			lastprice = '';
			$("#PriceInput").val('');
		}
		$("#PriceInput").off('input');
		$("#PriceInput").on('input', function(event) {
			this.value = this.value.replace(/[^0-9\.]/g,'');
			if (this.value.match(new RegExp('^\\d*(\\.\\d{0,4})?$'))) {
				lastprice = this.value;
			}
			else {
				this.value = lastprice;
			}
		});
			
		$("#PriceInput").off('keyup');
		$("#PriceInput").on('keyup', function(event) {
			if (+new Date() > keyPressTime + 500) {
      	if(event.keyCode == 13)  {
					if( parseFloat($("#PriceInput").val()) > 0.0) {
						console.log('keyup event');
						updatePrice($("#PriceDialog").data('date'),$("#PriceDialog").data('acct'));
    	   	}
	  		}
	  	}
		});
		$("#PriceDialog").dialog( "option", "buttons", 
			{	
		    "Update Price": function() {
		    	console.log('update price button event');
		    	updatePrice($("#PriceDialog").data('date'),$("#PriceDialog").data('acct'));
        },	
	      Cancel: function() {
		      $( this ).dialog( "close" );
  		  }
  		});
				
		$("#PriceDialog").data('date', date).data('acct', acct).dialog("open");
	}    

	function updatePrice(date,acct) {
		price = parseFloat($("#PriceInput").val()).toFixed(4);
 		console.log(price);
 		console.log(date);
 		console.log(acct);
 		$("#PriceDialog" ).dialog( "close" );
 		
    $.ajax({
			url: '/fuelprices/' + pricelist + '.json',
	    type: 'PUT',
	    data: {lid: acct['lid'], price: $("#PriceInput").val()},
	    dataType: 'json',
	    crossDomain: false,
	    jsonp: false,
	    async: false,
	    success: function(data) {
	    	console.log('success');
	    	console.log(data);
      	griddata = prepareGridData(data);
	    	$("#PriceGrid").jqxGrid('source',createGridSource(griddata));
	    	$("#PriceGrid").jqxGrid('refreshdata');
			},
			error: function(data) {
	    	prepareAlertDialog('Error detected on save:\n' + data.responseText);
	    }
		});
 		
 	}
 	
	function zeroPad(num, places) {
	  var zero = places - num.toString().length + 1;
	  return Array(+(zero > 0 && zero)).join("0") + num;
	}
	
	function initializeAlertDialog() {
    $( "#AlertDialog" ).dialog({
      autoOpen: false,
      height: 300,
      width: 500,
      modal: true,
      show: "fade",
      title: "Alert!",
      open: function(event, ui) {
				$(".ui-dialog").css("zIndex","10000");
			} ,
      buttons: {
		    OK: function() {
        	$( this ).dialog( "close" );
        }
  		}
    });
    
	}

	function prepareAlertDialog(msg) {
		$("#AlertMsg").html(msg);
		
    $("#AlertDialog").dialog("option", "buttons", [
		    { text: "OK", click: function() {
        	$( this ).dialog( "close" );
        }}
  		]);
  	$("#AlertDialog").off( "dialogopen");
  	$("#AlertDialog").on( "dialogopen", function( event, ui ) {
			$('#AlertDialog').keypress(function(e) {
				console.log('dialog keypress enter');
		    if (e.keyCode == $.ui.keyCode.ENTER) {
        	$( this ).dialog( "close" );
		    }
			});  		
  	} );

		$("#AlertDialog").dialog("open");
	}
