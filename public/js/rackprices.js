	
	var lastprice = '';
	var keyPressTime = +new Date();

	const JET_ACCT_NAME = 'Jet A-1 Fuel';
	const DYED_DSL_ACCT_NAME = 'LS Diesel Dyed';
	const REG_ACCT_NAME = 'Regular Gas';
	const PREM_ACCT_NAME = 'Premium Gas';

	const JET_DISP_NAME = 'Jet A-1';
	const DYED_DSL_DISP_NAME = 'LS Dyed Diesel';
	const REG_DISP_NAME = 'Regular Gas';
	const PREM_DISP_NAME = 'Premium Gas';
	
	const NAME_MAP = {'Jet A-1': JET_ACCT_NAME,
									'LS Dyed Diesel': DYED_DSL_ACCT_NAME,
									'Regular Gas': REG_ACCT_NAME,
									'Premium Gas': PREM_ACCT_NAME};
		
//	function transformRackData(prices) {
//		dataset = prices.map(function(day) { 
//			ret = {}; 
//			ret['date'] = new Date(day['date'] + "T08:00:00"); 
//			ret['Jet A-1'] = day['prices'][0]['price']; 
//			ret['LS Diesel'] = day['prices'][1]['price']; 
//			ret['Regular Gas'] = day['prices'][2]['price']; 
//			ret['Supreme Gas'] = day['prices'][3]['price']; 
//			return ret; 
//		});
//
//		return dataset;
//	}
			
	function transformChartData(prices) {
		dataset = prices.map(function(day) { 
			ret = {}; 
			ret['date'] = new Date(day['date'] + "T08:00:00"); 
			ret['Jet A-1'] = $.grep(day['prices'], function(price) {return price['acctname'] == JET_ACCT_NAME})[0]['price']; 
			ret['LS Dyed Diesel'] = $.grep(day['prices'], function(price) {return price['acctname'] == DYED_DSL_ACCT_NAME})[0]['price']; 
			ret['Regular Gas'] = $.grep(day['prices'], function(price) {return price['acctname'] == REG_ACCT_NAME})[0]['price']; 
			ret['Premium Gas'] = $.grep(day['prices'], function(price) {return price['acctname'] == PREM_ACCT_NAME})[0]['price']; 
			ret['Avg Jet A-1'] = $.grep(day['prices'], function(price) {return price['acctname'] == JET_ACCT_NAME})[0]['avgprice']; 
			ret['Avg LS Dyed Diesel'] = $.grep(day['prices'], function(price) {return price['acctname'] == DYED_DSL_ACCT_NAME})[0]['avgprice']; 
			ret['Avg Regular Gas'] = $.grep(day['prices'], function(price) {return price['acctname'] == REG_ACCT_NAME})[0]['avgprice']; 
			ret['Avg Premium Gas'] = $.grep(day['prices'], function(price) {return price['acctname'] == PREM_ACCT_NAME})[0]['avgprice']; 
			return ret; 
		});

		return dataset;
	}
			
	function transformGridData(prices) {
		dataset = prices.map(function(day) { 
			ret = {}; 
			ret['date'] = new Date(day['date'] + "T08:00:00"); 
			ret['Jet A-1'] = {};
			ret['LS Dyed Diesel'] = {};
			ret['Regular Gas'] = {};
			ret['Premium Gas'] = {};
			ret['Jet A-1']['price'] = $.grep(day['prices'], function(price) {return price['acctname'] == JET_ACCT_NAME})[0]['price']; 
			ret['LS Dyed Diesel']['price'] = $.grep(day['prices'], function(price) {return price['acctname'] == DYED_DSL_ACCT_NAME})[0]['price']; 
			ret['Regular Gas']['price'] = $.grep(day['prices'], function(price) {return price['acctname'] == REG_ACCT_NAME})[0]['price']; 
			ret['Premium Gas']['price'] = $.grep(day['prices'], function(price) {return price['acctname'] == PREM_ACCT_NAME})[0]['price']; 
			ret['Jet A-1']['avgprice'] = $.grep(day['prices'], function(price) {return price['acctname'] == JET_ACCT_NAME})[0]['avgprice']; 
			ret['LS Dyed Diesel']['avgprice'] = $.grep(day['prices'], function(price) {return price['acctname'] == DYED_DSL_ACCT_NAME})[0]['avgprice']; 
			ret['Regular Gas']['avgprice'] = $.grep(day['prices'], function(price) {return price['acctname'] == REG_ACCT_NAME})[0]['avgprice']; 
			ret['Premium Gas']['avgprice'] = $.grep(day['prices'], function(price) {return price['acctname'] == PREM_ACCT_NAME})[0]['avgprice']; 
			return ret; 
		});

		return dataset;
	}
			
	function createChartSource(prices) {
	
		dataset = transformChartData(prices);
			
		temp = [];
		itemp = 0;
		for(i in dataset) {
			temp[itemp++] = dataset[i];
		}
		
		console.log('create chart source');
		console.log(dataset);
		console.log(temp);
		
    // prepare the data
    var source =
    {
        datatype: "json",
        datafields: [
            { name: 'date' },
            { name: 'Jet A-1' },
            { name: 'LS Dyed Diesel' },
            { name: 'Regular Gas' },
            { name: 'Premium Gas' },
            { name: 'Avg Jet A-1' },
            { name: 'Avg LS Dyed Diesel' },
            { name: 'Avg Regular Gas' },
            { name: 'Avg Premium Gas' }
        ],
//        localdata: dataset
        localdata: temp
    };
    
    console.log(source);
    
    var dataAdapter = new $.jqx.dataAdapter(source);
    
    console.log(dataAdapter);
    
    return dataAdapter;
	}
	
	function createChart(source) {
		
		console.log('createChart');
		
    // prepare jqxChart settings
    var settings = {
        title: "Rack prices",
        description: "",
        enableAnimations: true,
        showLegend: true,
        padding: { left: 10, top: 5, right: 10, bottom: 5 },
        titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
        source: source,
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
                unitInterval: 1,
                showGridLines: true,
                gridLinesInterval: 1,
                gridLinesColor: '#888888',
                valuesOnTicks: false
            },
        colorScheme: 'scheme04',
        seriesGroups:
            [
                {
//                    type: 'line',
                    type: 'spline',
                    formatSettings: {
                    	decimalPlaces: 4
                    },
                    valueAxis:
                    {
                        unitInterval: .0100,
                        minValue: minPrice() - .0100,
                        maxValue: maxPrice() + .0100,
                        displayValueAxis: true,
                        description: 'Rack Price',
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
                    series: [
                            { dataField: 'Jet A-1', displayText: 'Jet A-1', color: '#900000' },
                            { dataField: 'LS Dyed Diesel', displayText: 'LS Dyed Diesel', color: '#0033CC' },
                            { dataField: 'Regular Gas', displayText: 'Regular Gas', color: '#CCFF33' },
                            { dataField: 'Premium Gas', displayText: 'Premium Gas', color: '#FFCC33' },
                            { dataField: 'Avg Jet A-1', displayText: 'Avg Jet A-1 (dashed)', color: '#900000', dashStyle: '10,2' },
                            { dataField: 'Avg LS Dyed Diesel', displayText: 'Avg LS Dyed Diesel (dashed)', color: '#0033CC', dashStyle: '10,2' },
                            { dataField: 'Avg Regular Gas', displayText: 'Avg Regular Gas (dashed)', color: '#CCFF33', dashStyle: '10,2' },
                            { dataField: 'Avg Premium Gas', displayText: 'Avg Premium Gas (dashed)', color: '#FFCC33', dashStyle: '10,2' }
                        ]
                }
            ]
    };
    // setup the chart
    
    console.log('creating chart');
    $('#Chart').width($("#HistoryTable").width());
    $('#Chart').jqxChart(settings);	
  }

	function maxPrice() {
		max=0;
		rackobj.forEach(function(rack) {
			rack['prices'].forEach(function(price) {
				if(price['price']>max)
					max = price['price'];
			});
		});
		console.log('max:' + max);
		return max;
	}
	
	function minPrice() {
		min=1000;
		rackobj.forEach(function(rack) {
			rack['prices'].forEach(function(price) {
				if(price['price']<min && price['price'] != null)
					min = price['price'];
			});
		});
		console.log('min:' + min);
		return min;
	}
	
	function zeroPad(num, places) {
	  var zero = places - num.toString().length + 1;
	  return Array(+(zero > 0 && zero)).join("0") + num;
	}
	
	function initializePriceDialog() {
    $( "#PriceDialog" ).dialog({
      autoOpen: false,
      height: 300,
      width: 500,
      modal: true,
      show: "fade",
      title: "Rack Price",
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

	function initializeConfirmDialog() {
    $( "#ConfirmDialog" ).dialog({
      autoOpen: false,
      height: 250,
      width: 500,
      modal: true,
      show: "fade",
      title: "Confirm",
      open: function(event, ui) {
				$(".ui-dialog").css("zIndex","10000");
			} ,
			close: function(event, ui) {
				$("#ConfirmDialog").off("keypress");
			},
      buttons: {
		    OK: function() {
        	$( this ).dialog( "close" );
        },	
	      Cancel: function() {
		      $( this ).dialog( "close" );
  		  }
  		}
    });
    
	}
	
	function prepareConfirmDialog(date,price,acctname,acct) {
		$("#ConfirmPrice").html(parseFloat(price).toFixed(4));
		$("#ConfirmProduct").html(acctname);
		$("#ConfirmDate").html(date);
		
    $("#ConfirmDialog").dialog("option", "buttons", [
		    { text: "OK", click: function() {
        	$( this ).dialog( "close" );
					preparePriceDialog(date,price,acctname,acct);
        }},	
	      { text: "Cancel", click: function() {
		      $( this ).dialog( "close" );
  		  }}
  		]);
  	$("#ConfirmDialog").off( "dialogopen");
  	$("#ConfirmDialog").on( "dialogopen", function( event, ui ) {
			$('#ConfirmDialog').keypress(function(e) {
				console.log('dialog keypress enter');
		    if (e.keyCode == $.ui.keyCode.ENTER) {
        	$( this ).dialog( "close" );
					preparePriceDialog(date,price,acctname,acct);
		    }
			});  		
  	} );

		$("#ConfirmDialog").dialog("open");
	}
		

	function preparePriceDialog(date,price,acctname,acct) {
		console.log(date);
		console.log(acctname);
		console.log(acct);
		console.log(price);
		$("#DialogDate").html(date);
		$("#DialogProduct").html(acctname);
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
						updatePrice($("#PriceDialog").data('date'),$("#PriceDialog").data('acctname'),$("#PriceDialog").data('acct'));
    	   	}
	  		}
	  	}
		});
		$("#PriceDialog").dialog( "option", "buttons", 
			{	
		    "Update Price": function() {
		    	console.log('update price button event');
		    	updatePrice($("#PriceDialog").data('date'),$("#PriceDialog").data('acctname'),$("#PriceDialog").data('acct'));
//        	$( this ).dialog( "close" );
        },	
	      Cancel: function() {
		      $( this ).dialog( "close" );
  		  }
  		});
				
//		$("#PriceDialog").data('date', date).data('acct', NAME_MAP[acct]).dialog("open");
		$("#PriceDialog").data('date', date).data('acct', acct).data('acctname', acctname).dialog("open");
	}    
		
			
	function updatePrice(date,acctname,acct) {
		price = parseFloat($("#PriceInput").val()).toFixed(4);
 		console.log(price);
 		console.log(date);
 		console.log(acct);
 		$("#PriceDialog" ).dialog( "close" );
 		data = {'acct': acct, price: $("#PriceInput").val()};
 		console.log(data);
 		
    $.ajax({
			url: '/rackprices/' + date + '.json',
	    type: 'PUT',
	    data: data,
	    dataType: 'json',
	    crossDomain: false,
	    jsonp: false,
	    async: false,
	    success: function() {
	    	console.log('success');
		 		// ok, we have a date, a price and an acct
		 		// update the database
		 		// update the dataset
		 		prices = $.grep($.grep(rackobj, function(day) {
		 			return (day === undefined ? false : day['date'] == date);
		 		})[0]['prices'], function(price) {
			 		return price['acctname'] == NAME_MAP[acctname];
			 	})[0];
			 	prices['price']=price;
		   	$("#Chart").jqxChart('source', createChartSource(rackobj)); 
		   	$("#Chart").jqxChart('seriesGroups')[0]['valueAxis'].minValue = minPrice() - .0100;
		   	$("#Chart").jqxChart('seriesGroups')[0]['valueAxis'].maxValue = maxPrice() + .0100;
		   	$("#Chart").jqxChart('update');
		   	console.log($("#RackGrid").jqxGrid('source'));
//		   	row = $("#RackGrid").jqxGrid('getrows').indexOf($.grep($("#RackGrid").jqxGrid('getrows'), function(row) { return row['date'].getTime() == new Date(date + "T08:00:00").getTime() })[0]); 
		   	row = $("#RackGrid").jqxGrid('getdisplayrows').indexOf($.grep($("#RackGrid").jqxGrid('getdisplayrows'), 
		   		function(row) { return (row['date'] === undefined ? false : row['date'].getTime() == new Date(date + "T08:00:00").getTime() ) })[0]); 
		   	pageinfo = $("#RackGrid").jqxGrid('getpaginginformation');
				$("#RackGrid").jqxGrid('setcellvalue', 
					row , acctname, {'price': price, 'avgprice': prices['avgprice'] });
//					pageinfo.pagenum * pageinfo.pagesize + row + 1, partName, {'price': price, 'avgprice': prices['avgprice'] });
			},
			error: function(data) {
				console.log(data);
				prepareAlertDialog(data.responseText);
			}
		});
 		
 	}
 	
	function createScrollableRackGrid() {
		
		console.log('createRackGrid');
		
		var cellsrenderer = function(row,columnfield,value,defaulthtml,columnproperties) { 
        		return '<div style="overflow: hidden; text-overflow: ellipsis; padding-bottom: 2px; text-align: left; margin-right: 2px; margin-left: 4px; margin-top: 4px;">' + 
        		'<table "style="width:100%;height:100%;padding:0"><tr>' +
        		'<td style="width:40%;height:100%;padding:0"><span style="color: #000000">' + ((value['price'] == null || value['price'].length == 0) ? "" : parseFloat(value['price']).toFixed(4)) + '</span></td>' +
        		'<td style="width:20%;height:100%;padding:0"></td>' + 
        		'<td style="width:40%;height:100%;padding:0"><span style="color:' + 
        		((value['price'] != null && value['price'].length > 0 && value['avgprice'] != null && value['avgprice'].length > 0) ? 
        			(parseFloat(value['avgprice']) < parseFloat(value['price']) ? '#FF0000' : '#0000FF') : '#0000FF') +
        		';text-align:right">' + ((value['avgprice'] == null || value['avgprice'].length == 0) ? "" : ('(' + parseFloat(value['avgprice']).toFixed(4) + ')')) + '</span></td>' +
        		'</tr></table>' +
        		'</div>'; 
    }
    
    var columnsrenderer = function(value) {
    	console.log('columnsrenderer');
    	console.log(value);
    	return '<div style="overflow: hidden; text-overflow: ellipsis; padding-bottom: 2px; text-align: left; margin-right: 2px; margin-left: 4px; margin-top: 4px;">' +
        		'<table "style="width:100%;height:100%;padding:0"><tr>' +
        		'<td style="width:40%;height:100%;padding:0"><span style="color: #000000">' + value + '</span></td>' +
        		'<td style="width:20%;height:100%;padding:0"></td>' + 
        		'<td style="width:40%;height:100%;padding:0"><span style="color: #0000FF;text-align:right">(Avg Cost)</span></td></tr></table>' +
    	'</div>';
    }
		
    var source =
    {
        datatype: "json",
        datafields: [{name: 'date'},
        						{name: 'prices'}],
        url: 'rackprices.json',
        cache: false, 
        async: false,
        totalRecords: 1000
    };
    
		var dataAdapter = new $.jqx.dataAdapter(source,
	    {
	        beforeLoadComplete: function (records) {
		        	console.log('before');
	            console.log(records);
					   	rackobj = records;
				    	$("#Chart").jqxChart('source', createChartSource(records)); 
					   	$("#Chart").jqxChart('seriesGroups')[0]['valueAxis'].minValue = minPrice() - .0100;
					   	$("#Chart").jqxChart('seriesGroups')[0]['valueAxis'].maxValue = maxPrice() + .0100;
					   	$("#Chart").jqxChart('update');
//	            return transformRackData(records);
	            return transformGridData(records);
	        }
	    }
		);    
		
		$("#RackGrid").jqxGrid(
		{
	    source: dataAdapter,
	    width: '100%',
	    virtualmode: true,
	    rendergridrows: function (params) {
				console.log(params.startindex);
				console.log(params.endindex);
				console.log(params);
				return params.data;
			},
      selectionmode: 'singlecell',
//      autoheight: true,
			pagesize: 15,
	    columns: [
        { text: 'Date', datafield: 'date', width: '20%',
//        		cellsrenderer: function(row,columnfield,value,defaulthtml,columnproperties) { console.log('renderer'); console.log(value); console.log(defaulthtml); return (jQuery.isEmptyObject(value) ? "" : 
        		cellsrenderer: function(row,columnfield,value,defaulthtml,columnproperties) { 
        			return ((value == null || value.length == 0)? "" : 
        			('<div style="overflow: hidden; text-overflow: ellipsis; padding-bottom: 2px; text-align: left; margin-right: 2px; margin-left: 4px; margin-top: 4px;">' + 
        			(value.getFullYear() + '-' + zeroPad((value.getMonth() + 1),2) + '-' + zeroPad(value.getDate(),2)) + 
        			'</div>')); } 
        },
        { text: 'Jet A-1', datafield: 'Jet A-1', width: '20%', cellsrenderer: cellsrenderer, renderer: columnsrenderer },
        { text: 'LS Dyed Diesel', datafield: 'LS Dyed Diesel', width: '20%', cellsrenderer: cellsrenderer, renderer: columnsrenderer },
        { text: 'Regular Gas', datafield: 'Regular Gas', width: '20%', cellsrenderer: cellsrenderer, renderer: columnsrenderer },
        { text: 'Premium Gas', datafield: 'Premium Gas', width: '20%', cellsrenderer: cellsrenderer, renderer: columnsrenderer }
	    ]
		});
		
		$("#RackGrid").on('cellselect', function (event) {
			console.log(event);
			if(event.args.datafield != 'date') {
//				console.log($.grep(rackobj[event.args.rowindex]['prices'], function(item) { console.log("'" + item['acct'] + "':'" + event.args.datafield + "'"); return item['acct'] == event.args.datafield }));
//				console.log(rackobj[event.args.rowindex]['prices'][NAME_MAP[event.args.datafield]]);
				console.log($.grep(rackobj[event.args.rowindex]['prices'], function(item) { console.log("'" + item['acctname'] + "':'" + NAME_MAP[event.args.datafield] + "'"); return item['acctname'] == NAME_MAP[event.args.datafield] }));
				price = $.grep(rackobj[event.args.rowindex]['prices'], function(item) { return item['acctname'] == NAME_MAP[event.args.datafield] })[0];
//				price = $.grep(rackobj[event.args.rowindex]['prices'], function(item) { return item['acct'] == event.args.datafield })[0];
//				price = rackobj[event.args.rowindex]['prices'][NAME_MAP[event.args.datafield]];
				if(price['price'] != null)
					prepareConfirmDialog(rackobj[event.args.rowindex]['date'],price['price'],event.args.datafield,price['acct']);
				else
					preparePriceDialog(rackobj[event.args.rowindex]['date'],price['price'],event.args.datafield,price['acct']);
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
		
