	var currentaddressid = -1;

//	var fuelList = [{"name": "LS Diesel", "truckvalue": "3", "value": "962"},{"name": "Dyed Diesel", "truckvalue": "4", "value": "963"},{"name": "Dyed Furnace Oil", "truckvalue": "6", "value": "951"},
//									{"name": "Dyed Stove Oil", "truckvalue": "8", "value": "948"},{"name": "Regular Gas", "truckvalue": "11", "value": "940"},{"name": "Dyed Regular Gas", "truckvalue": "12", "value": "941"},
//									{"name": "Supreme Gas", "truckvalue": "15", "value": "942"},{"name": "Jet A-1 Fuel", "truckvalue": "19", "value": "953"},{"name": "Dyed Supreme Gas", "truckvalue": "23", "value": "222"}];
    							
	var fuelList = [{"name": "LS Diesel", "value": "3", "internalvalue": "962"},{"name": "Dyed Diesel", "value": "4", "internalvalue": "963"},{"name": "Dyed Furnace Oil", "value": "6", "internalvalue": "951"},
									{"name": "Dyed Stove Oil", "value": "8", "internalvalue": "948"},{"name": "Regular Gas", "value": "11", "internalvalue": "940"},{"name": "Dyed Regular Gas", "value": "12", "internalvalue": "941"},
									{"name": "Supreme Gas", "value": "15", "internalvalue": "942"},{"name": "Jet A-1 Fuel", "value": "19", "internalvalue": "953"},{"name": "Dyed Supreme Gas", "value": "23", "internalvalue": "222"}];
    							
  var positionList = [{"name": "1 - Front Left Tank Position", "value": "1"},{"name": "2 - Left Tank Position", "value": "2"},{"name": "3 - Back Left Tank Position", "value": "3"},
    							{"name": "4 - Back Tank Position", "value": "4"},	{"name": "5 - Back Right Tank Position", "value": "5"},{"name": "6 - Right Tank Position", "value": "6"},
    							{"name": "7 - Front Right Tank Position", "value": "7"},{"name": "8 - Front Tank Position", "value": "8"}];
    							
  var regionCodeList = [{"name": "100 - Sandspit", "value": "100"},{"name": "150 - Alliford Bay, Pallent Creek, etc", "value": "150"},{"name": "200 - Queen Charlotte", "value": "200"},
    							{"name": "250 - Rennel Sound, etc.", "value": "250"},{"name": "300 - Skidegate", "value": "300"},{"name": "350 - Tlell, Lawn Hill, Miller Creek, etc", "value": "350"},
    							{"name": "400 - Port Clements", "value": "400"},{"name": "450 - Juskatla, Fergusen, etc", "value": "450"},{"name": "500 - Masset", "value": "500"},
    							{"name": "550 - Old Masset", "value": "550"},{"name": "575 - Tow Hill Road, Old Beach Road", "value": "575"},{"name": "600 - Various Locations", "value": "600"},
    							{"name": "950 - Yard Sales", "value": "950"}];


	var custSortFunc = 	function custSort(a,b) {
	  if(a['sName'] == 'Cash Sales')
	 	 return -1;
	 	return a['sName'].toUpperCase() < b['sName'].toUpperCase() ? -1 : b['sName'].toUpperCase() < a['sName'].toUpperCase() ? 1 : 0;
	}

	function onlyAccessCoded(custs) {
		return custs.filter(function(cust) {
				return !jQuery.isEmptyObject(cust['tankInfo']) ?
					!jQuery.isEmptyObject(cust['tankInfo']['custaccesscode']) :
					cust['shipToInfo'].some(function(shipto) {
						return !jQuery.isEmptyObject(shipto['shipaccesscode']);
					});
//					$.grep(cust['shipToInfo'],function(shipto) {
//						return !jQuery.isEmptyObject(shipto['shipaccesscode']);
//					}).length > 0;
				}
			).map(function(cust) {
				cust['shipToInfo'] = cust['shipToInfo'].filter(function(shipto) { return !jQuery.isEmptyObject(shipto['shipaccesscode']); } ); 
				return cust;
			});
	}
	
	function createCustomerList(customers) {
		
		var source = {
      datatype: "json",
      datafields: [
          { name: 'id' },
          { name: 'name' },
          { name: 'parentid' },
          { name: 'addresses' }
      ],
      localdata: customers.map(function(cust) {
					x = {'name': cust['sName'], 'id': cust['lId'], 'parentid': 0, 'addresses': []};
					if(jQuery.isEmptyObject(cust['shipToInfo'])) {
						x['addresses'] = [{'name': [cust['sStreet1'], cust['sCity']].join(' '), 'id': cust['lId'], 'parentid': cust['lId'] }];
					} else {
						x['addresses'] = cust['shipToInfo'].map(function(shipto) {
							return {'name': [shipto['sStreet1'], shipto['sCity']].join(' '), 'id': shipto['lId'], 'parentid': cust['lId'] };
						});
					}
					return x;
				})
	  };

		source = [].concat.apply([],customers.map(function(cust) {
			if(jQuery.isEmptyObject(cust['shipToInfo'])) {
//      	return {html: "<div style='padding: 1px;'><div>Address: " + [cust['sStreet1'], cust['sCity']].join(' ') + "</div></div>", title: "Do the Work", group: cust['sName'] };
      	return {html: "<div style='padding: 1px;'><div>Address: " + [cust['sName'],cust['sStreet1'], cust['sCity']].join(' ') + "</div></div>", id: cust['lId'], isShipTo: false, group: cust['sName'] };
			} else {
				return cust['shipToInfo'].map(function(shipto) {
//	      	return {html: "<div style='padding: 1px;'><div>Address: " + shipto['shipToName'] + "</div></div>", title: "Do the Work", group: cust['sName'] };
	      	return {html: "<div style='padding: 1px;'><div>Address: " + shipto['shipToName'] + "</div></div>", id: cust['lId'], isShipTo: true, group: cust['sName'] };
				});
			}
		}));
		
		console.log(source);

		var source = {
      datatype: "json",
      datafields: [
          { name: 'id' },
          { name: 'name' },
          { name: 'addresses' }
      ],
      localdata: customers.map(function(cust) {
					x = {'name': [cust['sName']+':', cust['sStreet1'], cust['sCity']].join(' '), 'id': cust['lId'], 'addresses': []};
					if(jQuery.isEmptyObject(cust['shipToInfo'])) {
						x['addresses'] = [{'name': [cust['sStreet1'], cust['sCity']].join(' '), 'id': cust['lId'], 'parentid': cust['lId'] }];
					} else {
						x['addresses'] = cust['shipToInfo'].map(function(shipto) {
							return {'name': shipto['shipToName'], 'id': shipto['shipid'], 'parentid': cust['lId'] };
						});
					}
					return x;
				})
	  };

		console.log(source);

	  var dataAdapter = new $.jqx.dataAdapter(source);
//    dataAdapter.dataBind();
//    var records = dataAdapter.getRecordsHierarchy('id', 'parentid', 'addresses', [{ name: 'name', map: 'label'}]);
//    $('#CustomerList').jqxDropDownList({ source: records, displayMember: 'name', valueMember: 'lId'});
//    $('#CustomerList').jqxDropDownList({ source: source, width: '600px', displayMember: 'name', valueMember: 'id'});
    $('#CustomerList').jqxDropDownList({ source: dataAdapter, width: '500px', displayMember: 'name', valueMember: 'id', theme: 'theme1'});
    
    $('#CustomerList').on('select', function (event) {
    	console.log('select');
    	console.log(event);
    	currentaddressid = -1;
			if(event.args.item.originalItem['addresses'].length > 1) {
				prepareAddressDialog(args.item.originalItem);
			} else {
				setLocationData(-1);
				getOrderInfo(args.item.originalItem,-1);
			}
    });
	}
	
	function getOrderInfo(item,addressindex) {
		console.log(item);
	  $.ajax({
//			url: '/orders/' + (addressindex == -1 ? 'Mailing' : 'ShipTo') + '.json',
			url: '/orders/' + (addressindex == -1 ? item['id'] : item['addresses'][addressindex]['id']) + '.json',
	    type: 'GET',
//	    data: (addressindex == -1 ? {custid: item['id']} : {custid: item['id'], shiptoid: item['addresses'][addressindex]['id']}),
	    data: {'type': (addressindex == -1 ? 'cust' : 'ship')},
	    dataType: 'json',
	    crossDomain: false,
	    jsonp: false,
	    async: false,
	    success: function(data) {
	    	console.log('success');
	    	console.log(data);
	    	setOrderInfo(data,$("#CustomerList").jqxDropDownList('getSelectedItem')['originalItem']);
    		$("#ShipToList").jqxListBox('selectIndex',-1);
	    	$("#ShipToDialog").dialog('close');
	    	console.log('showing grid');
	    	console.log(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]);
		   	showHistoryGrid(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['lId'],addressindex == -1 ? -1 : item['addresses'][addressindex]['id']);
	    	$("#InfoTable").show();
	    	console.log('selecting tab');
//	    	console.log($("#OrderTabs").jqxTabs('length')-1);
//	    	$("#OrderTabs").jqxTabs('select',$("#OrderTabs").jqxTabs('length')-1);
			},
			error: function(data) {
	    	prepareAlertDialog('Error getting order information');
	    }
		});
	}
	
	function getFuelType(index) {
		console.log($("#ShipToList").jqxListBox('getSelectedIndex'));
		if(index == -1)
			return fuelTypeToString(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['tankInfo']['custfuel']);
		else {
			return fuelTypeToString(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['shipToInfo'][index]['shipfuel']);
		}
	}
	
	function fuelTypeToString(fuelType) {
		if(fuelType == undefined || fuelType == null)
			return "Unknown";
		result = $.grep(fuelList,function(fuel) {
			return parseInt(fuel['value']) == fuelType;
		});
		if(jQuery.isEmptyObject(result))
		 result = [{'name': 'Unknown'}];
		return result[0]['name'];	
	}
	
	function getAccessCode(index) {
		if(index == -1)
			return custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['tankInfo']['custaccesscode'] || 'Unknown';
		else {
			return custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['shipToInfo'][index]['shipaccesscode'] || 'Unknown';
		}
	}

	function getTankPosition(index) {
		if(index == -1)
			return tankPositionToString(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['tankInfo']['custposition']) || 'Unknown';
		else {
			return tankPositionToString(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['shipToInfo'][index]['shipposition']) || 'Unknown';
		}
	}
	
	function tankPositionToString(position) {
		if(position == undefined || position == null)
			return "Unknown";
		return $.grep(positionList,function(pos) {
			return parseInt(pos['value']) == position;
		})[0]['name'];
	}
	
	function getTankCapacity(index) {
		if(index == -1)
			return custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['tankInfo']['custcapacity'] || 'Unknown';
		else {
			return custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['shipToInfo'][index]['shipcapacity'] || 'Unknown';
		}
	}
	
	function getRegionCode(index) {
		if(index == -1)
			return regionCodeToString(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['tankInfo']['custregioncode']) || 'Unknown';
		else {
			return regionCodeToString(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['shipToInfo'][index]['shipregioncode']) || 'Unknown';
		}
	}
	
	function regionCodeToString(code) {
		if(code == undefined || code == null)
			return "Unknown";
		return $.grep(regionCodeList,function(region) {
			return parseInt(region['value']) == code;
		})[0]['name'];
	}
	
	function getInitTabContentsFunction(orders) {
		taborders = [].concat.apply([],orders.map(function(ordergroup) { return ordergroup['orders'] }));
		
		console.log('get tab contents');
//		console.log(orders);
		console.log(taborders);
		
		return (function(tab) {
			console.log('tab contents');
			console.log(tab);
			console.log(taborders);
			
			if(tab < taborders.length) {
				console.log(taborders[tab]['creationdate']);
				console.log(taborders[tab]['requestdate']);
				console.log($('#OrderTabs').jqxTabs('getTitleAt',tab));
				
				if(!jQuery.isEmptyObject(taborders[tab]['creationdate'])) {
					$("#Interval" + taborders[tab]['orderid']).html(getIntervalHtml(taborders[tab]));
					console.log("#IntervalDate" + taborders[tab]['orderid']);
					$("#IntervalDate" + taborders[tab]['orderid']).jqxDateTimeInput({'value': taborders[tab]['orderdate'],formatString: 'yyyy-MM-dd'}); 	
					$("#UpdateInterval" + taborders[tab]['orderid']).off('click');
					$("#UpdateInterval" + taborders[tab]['orderid']).on('click',function(event) {
						updateOrder({'orderid': taborders[tab]['orderid'],
						'requestquantity': $("#IntervalQuantityInput" + taborders[tab]['orderid']).val(), 'requestamount': $("#NewQuantityAmount").val(), 'requestperiod': $("#NewPeriodInput").val(),
						'requestdate': $("#IntervalDate" + taborders[tab]['orderid']).jqxDateTimeInput('val'), 
						'accesscode': currentaddressid == -1 ? custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['tankInfo']['custaccesscode'] :
							$.grep(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['shipToInfo'],function(address) {
								return address['shipid'] = currentaddressid; })[0]['shipaccesscode'] , 
						'custid': custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['lId'], 
						'shipid': currentaddressid,
						'period': $("#IntervalPeriodInput" + taborders[tab]['orderid']).val()} );
					});
					$("#DeleteInterval" + taborders[tab]['orderid']).off('click');
					$("#DeleteInterval" + taborders[tab]['orderid']).on('click',function(event) {
						removeOrder({'orderid': taborders[tab]['orderid'],
						'custid': custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['lId'], 
						'shipid': currentaddressid,
						'isinterval': true} );
					});
				}
				if(!jQuery.isEmptyObject(taborders[tab]['requestdate'])) {
					$("#Outstanding" + taborders[tab]['orderid']).html(getOutstandingOrderHtml(taborders[tab]));
					console.log("#OrderOutstandingDate" + taborders[tab]['orderid']);
					$("#OrderOutstandingDate" + taborders[tab]['orderid']).jqxDateTimeInput({'value': taborders[tab]['requestdate'],formatString: 'yyyy-MM-dd'}); 	
					$("#UpdateOrder" + taborders[tab]['orderid']).off('click');
					$("#UpdateOrder" + taborders[tab]['orderid']).on('click',function(event) {
						updateOrder({'orderid': taborders[tab]['orderid'],
						'requestquantity': $("#OrderQuantityInput" + taborders[tab]['orderid']).val(), 'requestamount': $("#NewQuantityAmount").val(), 'requestperiod': $("#NewPeriodInput").val(),
						'requestdate': $("#OrderOutstandingDate" + taborders[tab]['orderid']).jqxDateTimeInput('val'), 
						'accesscode': currentaddressid == -1 ? custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['tankInfo']['custaccesscode'] :
							$.grep(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['shipToInfo'],function(address) {
								return address['shipid'] = currentaddressid; })[0]['shipaccesscode'] , 
						'custid': custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['lId'], 
						'shipid': currentaddressid} );
					});
					$("#DeleteOrder" + taborders[tab]['orderid']).off('click');
					$("#DeleteOrder" + taborders[tab]['orderid']).on('click',function(event) {
						removeOrder({'orderid': taborders[tab]['orderid'],
						'custid': custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['lId'], 
						'shipid': currentaddressid,
						'isinterval': false} );
					});
					$("#FulfillOrder" + taborders[tab]['orderid']).off('click');
					$("#FulfillOrder" + taborders[tab]['orderid']).on('click',function(event) {
						fulfillOrder({'orderid': taborders[tab]['orderid'],
						'requestquantity': $("#OrderQuantityInput" + taborders[tab]['orderid']).val(), 'requestamount': $("#NewQuantityAmount").val(), 'requestperiod': $("#NewPeriodInput").val(),
						'requestdate': $("#OrderOutstandingDate" + taborders[tab]['orderid']).jqxDateTimeInput('val'), 
						'accesscode': currentaddressid == -1 ? custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['tankInfo']['custaccesscode'] :
							$.grep(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['shipToInfo'],function(address) {
								return address['shipid'] = currentaddressid; })[0]['shipaccesscode'] , 
						'custid': custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['lId'], 
						'shipid': currentaddressid} );
					});
				}
			}
			if($('#OrderTabs').jqxTabs('getTitleAt',tab) == 'New Order') {
				console.log('new order paint');
				$("#NewOrder").html(getNewOrderHtml());
				console.log('init datetime');
				$("#NextDate").jqxDateTimeInput({formatString: 'yyyy-MM-dd'}); 	

				console.log('setting click');		
				$("#SaveOrder").off('click');
				$("#SaveOrder").on('click', function(event) {
					console.log('save click');
					console.log({'requestQuantity': $("#NewQuantityInput").val(), 'requestAmount': $("#NewQuantityAmount").val(), 'requestPeriod': $("#NewPeriodInput").val(),
						});
					saveOrder({'requestquantity': $("#NewQuantityInput").val(), 'requestamount': $("#NewQuantityAmount").val(), 'requestperiod': $("#NewPeriodInput").val(),
						'requestdate': $("#NextDate").jqxDateTimeInput('val'), 
						'accesscode': currentaddressid == -1 ? custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['tankInfo']['custaccesscode'] :
							$.grep(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['shipToInfo'],function(address) {
								return address['shipid'] = currentaddressid; })[0]['shipaccesscode'] , 
						'custid': custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['lId'], 
						'shipid': currentaddressid,
						'period': $("#IntervalPeriodInput" + taborders[tab]['orderid']).val()} );
				});
			} 
		});
	}
	
	function setOrderInfo(orders,cust) {
		console.log(orders);
		console.log(cust);

		// recreate tabs cleanly every time - least headaches		
		// remove old ordertabs control
		// recreate div template before data xform and creation
		console.log('destroying order tabs');
		try {
			$("#OrderTabs").jqxTabs('destroy');
		} catch(e) {
			console.log('no order tabs');
		}
		console.log('destroyed order tabs');
		$("#OrdersContainer").html('<div id="OrderTabs"></div>');
		
		console.log('init tabs');

		// create html tabs template from cust orders - intervals, outstanding, & scheduled
		// code seems ripe for common element refactoring
		tabhtml = '<ul>' + ($.grep(orders,function(ordertype) {
			return ordertype['state'] == 'interval'; 
		}) || [{'orders': []}]).map(function(shipto) {
			return shipto['orders'].map(function(order) {
				return '<li style="font-family: ' + "'" + 'Trebuchet MS' + "'" + ', Tahoma, Verdana, Arial, sans-serif;font-size: 20px;font-style: normal;">Interval:' + order['orderdate'] + '</li>';
			}).join(''); }).join('')	+
		($.grep(orders,function(ordertype) {
			return ordertype['state'] == 'outstanding' || ordertype['state'] == 'scheduled'; 
		}) || [{'orders': []}]).map(function(shipto) {
			return shipto['orders'].map(function(order) {
			console.log('painting outstanding tab heading');
			console.log(order['orderid']);
			return '<li style="font-family: ' + "'" + 'Trebuchet MS' + "'" + ', Tahoma, Verdana, Arial, sans-serif;font-size: 20px;font-style: normal;">Outstanding:' + order['requestdate'] + '</li>';
			}).join(''); }).join('')	+
		'<li style="font-family: ' + "'" + 'Trebuchet MS' + "'" + ', Tahoma, Verdana, Arial, sans-serif;font-size: 20px;font-style: normal;">New Order</li></ul>' + 
		($.grep(orders,function(ordertype) {
			return ordertype['state'] == 'interval'; 
		}) || [{'orders': []}]).map(function(shipto) {
			return shipto['orders'].map(function(order) {
				return '<div id="Interval' + order['orderid'] + '">' + getIntervalHtml(order) + '</div>';
		}).join(''); }).join('') +
		($.grep(orders,function(ordertype) {
			return ordertype['state'] == 'outstanding' || ordertype['state'] == 'scheduled'; 
		}) || [{'orders': []}]).map(function(shipto) {
			return shipto['orders'].map(function(order) {
				return '<div id="Outstanding' + order['orderid'] + '">' + getOutstandingOrderHtml(order) + '</div>';
		}).join(''); }).join('') +
		'<div id = "NewOrder"></div>';

//			console.log(tabhtml);
			$("#OrderTabs").html(tabhtml);

		$("#OrderTabs").jqxTabs({initTabContent: getInitTabContentsFunction(orders), theme: 'theme1'});
	}	
	
	function setLocationData(index) {
		$("#FuelType").html('Fuel Type: ' + getFuelType(index));
		$("#AccessCode").html('Access Code: ' + getAccessCode(index));
		$("#TankPosition").html('Tank Position: ' + getTankPosition(index));
		$("#TankCapacity").html('Tank Capacity: ' + getTankCapacity(index));
		$("#RegionCode").html('RegionCode: ' + getRegionCode(index));
	}
	
	function getNewOrderHtml() {	
		return [
			'<table style="width: 100%">',
				'<tr>',
					'<td style="width;20%;text-align:right;"><span style="text-align:right;font-family: ' + "'Trebuchet MS'" + ', Tahoma, Verdana, Arial, sans-serif;font-size: 20px;font-style: normal;">Quantity:</span></td>',
					'<td style="width:20%;text-align:center;align:center">',
  	    		'<input style="margin-top: 3px;width:350px;text-align:right;" id="NewQuantityInput" placeHolder="Quantity"/>',
					'</td>',
					'<td style="width;20%;text-align:right"><span style="text-align:right;font-family: ' + "'Trebuchet MS'" + ', Tahoma, Verdana, Arial, sans-serif;font-size: 20px;font-style: normal;">Amount:</span></td>',
					'<td style="width:20%">',
						'<input style="margin-top: 3px;width:350px;text-align:right;" id="NewAmountInput" placeHolder="Amount"/>',
					'</td>',
					'<td></td>',
				'</tr>',
				'<tr>',
					'<td style="width;20%;text-align:right;"><span style="text-align:right;font-family: ' + "'Trebuchet MS'" + ', Tahoma, Verdana, Arial, sans-serif;font-size: 20px;font-style: normal;">Delivery date:</span></td>',
					'<td style="width:20%"><div id="NextDate"></div></td>',
					'<td style="width;20%;text-align:right;"><span style="text-align:right;font-family: ' + "'Trebuchet MS'" + ', Tahoma, Verdana, Arial, sans-serif;font-size: 20px;font-style: normal;">Period:</span></td>',
					'<td style="width:20%">',
  	    		'<input style="margin-top: 3px;width:350px;text-align:right;" id="NewPeriodInput" placeHolder="Interval Period (if setting up an interval)"/>',
					'</td>',
					'<td style="text-align:center">',
						'<button id="SaveOrder" style="width:170px">Save Order</button>',
					'</td>',
				'</tr>',
			'</table>'].join("\n");
	}
	
	function getOutstandingOrderHtml(order) {	
		return [
			'<table style="width: 100%">',
				'<tr>',
					'<td style="width;20%;text-align:right;"><span style="text-align:right;font-family: ' + "'Trebuchet MS'" + ', Tahoma, Verdana, Arial, sans-serif;font-size: 20px;font-style: normal;">Quantity:</span></td>',
					'<td style="width:20%;text-align:center;align:center">',
  	    		'<input style="margin-top: 3px;width:350px;text-align:right;" id="OrderQuantityInput' + order['orderid'] + '" placeHolder="Quantity" value="' + order['requestquantity'] + '"/>',
					'</td>',
					'<td style="width;20%;text-align:right;"><span style="text-align:right;font-family: ' + "'Trebuchet MS'" + ', Tahoma, Verdana, Arial, sans-serif;font-size: 20px;font-style: normal;">Amount:</span></td>',
					'<td style="width:20%">',
						'<input style="margin-top: 3px;width:350px;text-align:right;" id="OrderAmountInput' + order['orderid'] + '" placeHolder="Amount"/>',
					'</td>',
					'<td style="text-align:center">',
						'<button id="UpdateOrder' + order['orderid'] + '" style="width:170px">Update Order</button>',
					'</td>',
				'</tr>',
				'<tr>',
					'<td style="width;20%;text-align:right;"><span style="text-align:right;font-family: ' + "'Trebuchet MS'" + ', Tahoma, Verdana, Arial, sans-serif;font-size: 20px;font-style: normal;">Delivery date:</span></td>',
					'<td style="width:20%"><div id="OrderOutstandingDate' + order['orderid'] + '"></div></td>',
					'<td style="width;20%"></td>',
					'<td style="width:20%"></td>',
					'<td style="text-align:center">',
						'<button id="DeleteOrder' + order['orderid'] + '" style="width:170px">Remove Order</button>',
					'</td>',
				'</tr>',
				'<tr>',
					'<td style="width;20%"></td>',
					'<td style="width;20%"></td>',
					'<td style="width;20%"></td>',
					'<td style="width;20%"></td>',
					'<td style="text-align:center">',
						'<button id="FulfillOrder' + order['orderid'] + '" style="width:170px">Fulfill Order</button>',
					'</td>',
				'</tr>',
			'</table>'].join("\n");
	}
	
	function getIntervalHtml(order) {	
		return [
			'<table style="width: 100%">',
				'<tr>',
					'<td style="width;20%;text-align:right"><span style="text-align:right;font-family: ' + "'Trebuchet MS'" + ', Tahoma, Verdana, Arial, sans-serif;font-size: 20px;font-style: normal;">Quantity:</span></td>',
					'<td style="width:20%;text-align:center;align:center">',
  	    		'<input style="margin-top: 3px;width:350px;text-align:right;" id="IntervalQuantityInput' + order['orderid'] + '" placeHolder="Quantity" value="' + order['requestquantity'] + '"/>',
					'</td>',
					'<td style="width;20%"></td>',
					'<td style="width:20%"></td>',
					'<td style="text-align:center">',
						'<button id="UpdateInterval' + order['orderid'] + '" style="width:170px">Update Interval</button>',
					'</td>',
				'</tr>',
				'<tr>',
					'<td style="width;20%;text-align:right"><span style="text-align:right;font-family: ' + "'Trebuchet MS'" + ', Tahoma, Verdana, Arial, sans-serif;font-size: 20px;font-style: normal;">Delivery date:</span></td>',
					'<td style="width:20%"><div id="IntervalDate' + order['orderid'] + '"></div></td>',
					'<td style="width;20%;text-align:right"><span style="text-align:right;font-family: ' + "'Trebuchet MS'" + ', Tahoma, Verdana, Arial, sans-serif;font-size: 20px;font-style: normal;">Period:</span></td>',
					'<td style="width:20%">',
  	    		'<input style="margin-top: 3px;width:350px;text-align:right;" id="IntervalPeriodInput' + order['orderid'] + '" placeHolder="Interval Period (if setting up an interval)" value="' + order['period'] + '"/>',
					'</td>',
					'<td style="text-align:center">',
						'<button id="DeleteInterval' + order['orderid'] + '" style="width:170px">Remove Interval</button>',
					'</td>',
				'</tr>',
			'</table>'].join("\n");
	}
	
	function initializeShipToDialog() {
    $( "#ShipToDialog" ).dialog({
      autoOpen: false,
      resize: 'auto',
//      height: 'auto',
//      width: '500px',
      modal: true,
      show: "fade",
      title: "Select Ship To",
      open: function(event, ui) {
				$(".ui-dialog").css("zIndex","10000");
			}
    });
    
	}	
	function prepareAddressDialog(item) {
		console.log(item);
		
		var shipToSource = createShipToSource(item['addresses']);
		var shipToDataAdapter = new $.jqx.dataAdapter(shipToSource);
		createShipToList(shipToDataAdapter);
				
		$( "#ShipToDialog" ).dialog('open');
		
	}
	
	function createShipToSource(addresses) {
  	return  {
    	localdata: addresses.map(function(shipto) {
    		return {id: shipto['id'], name: shipto['name']};
    	}),
			datatype: "jsonp",
			datafields: [
  			{ name: 'id' },
  			{ name: 'name' }
			],
			data: "",
			id: 'id'
    };
  }
   
  function createShipToList(source) {
    $("#ShipToList").jqxListBox({ 
    	source: source, 
    	selectedIndex: -1, 
//    	width: '100%', 
//    	height: '300px', 
    	theme: 'theme1', 
    	displayMember: 'name', 
    	valueMember: 'id',
    	autoHeight: true
    });
    
    $("#ShipToList").on('select', function(event) {
    	console.log(event);
    	if(event.args.index != -1) {
//    		currentaddressid = event.args.originalItem['addresses'][event.args.index]['id'];
    		currentaddressid = event.args.item.originalItem['id'];
				setLocationData(event.args.index);
	    	getOrderInfo($("#CustomerList").jqxDropDownList('getSelectedItem')['originalItem'],event.args.index);
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
		
	function showHistoryGrid(custid, shipid) {
		if($("#History").jqxGrid('source') === undefined)
			createHistoryGrid(custid, shipid);
		else
			updateHistoryGrid(custid,shipid);
	}
	
	function createNewDataAdapter(custid,shipid) {
		source = {
        datatype: "json",
        datafields: [{name: 'date'},
        						{name: 'quantity'}
										],
        url: 'orders/' + (custid == -1 ? shipid.toString() : custid.toString()) + '.json?type=' + (custid == -1 ? 'ship' : 'cust'),
        cache: false, 
        async: false,
        totalRecords: 1000
    };
    
		var dataAdapter = new $.jqx.dataAdapter(source,
    {
      beforeLoadComplete: function (records,originals) {
      	console.log('beforeLoadComplete');
      	console.log(records);
      	console.log(originals);
      	// transform records from server structure to grid requirements and return result
        return (!jQuery.isEmptyObject(originals) && !jQuery.isEmptyObject(originals[0]['orders']) ? originals : [{'orders': []}])[0]['orders'].map(function(record) {
        	console.log(record);
        	return {'date': record['fulfillmentdate'], 'quantity': record['fulfillmentquantity']};
        });
      }
    });
    
    return dataAdapter;
  }
		
	function updateHistoryGrid(custid,shipid) {
		$("#History").jqxGrid('clear');

		dataAdapter = createNewDataAdapter(custid,shipid);
		
    $("#History").jqxGrid('source',dataAdapter);    
    dataAdapter.dataBind();

		$("#History").jqxGrid('updatebounddata');
	}
	
	function createHistoryGrid(custid,shipid) {
		
		dataAdapter = createNewDataAdapter(custid,shipid);
		$("#History").jqxGrid(
		{
	    source: dataAdapter,
	    width: '100%',
	    virtualmode: true,
	    rendergridrows: function (params) {
	    	console.log('render grid rows');
				console.log(params.startindex);
				console.log(params.endindex);
				console.log(params);
				return params.data;
			},
      selectionmode: 'none',
//      autoheight: true,
			pagesize: 10,
	    columns: [
        { text: 'Date', datafield: 'date', width: '20%'},
        { text: 'Quantity', datafield: 'quantity', width: '20%'}
	    ]
		});
	}
		
	function saveOrder(order) {
		console.log('save');
 
	  $.ajax({
			url: '/orders/new.json',
	    type: 'GET',
//	    data: (addressindex == -1 ? {custid: item['id']} : {custid: item['id'], shiptoid: item['addresses'][addressindex]['id']}),
	    data: order,
	    dataType: 'json',
	    crossDomain: false,
	    jsonp: false,
	    async: false,
	    success: function(data) {
	    	console.log('success');
	    	console.log(data);
	    	setOrderInfo(data,$("#CustomerList").jqxDropDownList('getSelectedItem')['originalItem']);
    		$("#ShipToList").jqxListBox('selectIndex',-1);
	    	$("#ShipToDialog").dialog('close');
	    	console.log('showing grid');
	    	console.log(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]);
		   	showHistoryGrid(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['lId'],currentaddressid == -1 ? -1 : currentaddressid);
	    	$("#InfoTable").show();
//	    	console.log('selecting tab');
//	    	console.log($("#OrderTabs").jqxTabs('length')-1);
//	    	$("#OrderTabs").jqxTabs('select',$("#OrderTabs").jqxTabs('length')-1);
			},
			error: function(data) {
	    	prepareAlertDialog('Error saving order information');
	    }
		});
	}
	
	function updateOrder(order) {
		console.log('update');
 
	  $.ajax({
			url: '/orders/' + order['orderid'] + '.json',
	    type: 'PUT',
//	    data: (addressindex == -1 ? {custid: item['id']} : {custid: item['id'], shiptoid: item['addresses'][addressindex]['id']}),
	    data: order,
	    dataType: 'json',
	    crossDomain: false,
	    jsonp: false,
	    async: false,
	    success: function(data) {
	    	console.log('success');
	    	console.log(data);
	    	setOrderInfo(data,$("#CustomerList").jqxDropDownList('getSelectedItem')['originalItem']);
    		$("#ShipToList").jqxListBox('selectIndex',-1);
	    	$("#ShipToDialog").dialog('close');
	    	console.log('showing grid');
	    	console.log(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]);
		   	showHistoryGrid(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['lId'],currentaddressid == -1 ? -1 : currentaddressid);
	    	$("#InfoTable").show();
//	    	console.log('selecting tab');
//	    	console.log($("#OrderTabs").jqxTabs('length')-1);
//	    	$("#OrderTabs").jqxTabs('select',$("#OrderTabs").jqxTabs('length')-1);
			},
			error: function(data) {
	    	prepareAlertDialog('Error saving order information');
	    }
		});
	}
	
	function removeOrder(order) {
		console.log('remove');
 
	  $.ajax({
			url: '/orders/' + order['orderid'] + '.json',
	    type: 'DELETE',
	    data: order,
	    dataType: 'json',
	    crossDomain: false,
	    jsonp: false,
	    async: false,
	    success: function(data) {
	    	console.log('success');
	    	console.log(data);
	    	setOrderInfo(data,$("#CustomerList").jqxDropDownList('getSelectedItem')['originalItem']);
    		$("#ShipToList").jqxListBox('selectIndex',-1);
	    	$("#ShipToDialog").dialog('close');
	    	console.log('showing grid');
	    	console.log(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]);
		   	showHistoryGrid(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['lId'],currentaddressid == -1 ? -1 : currentaddressid);
	    	$("#InfoTable").show();
			},
			error: function(data,arg2,arg3) {
				console.log('error');
				console.log(data);
				console.log(arg2);
				console.log(arg3);
	    	prepareAlertDialog('Error saving order information');
	    }
		});
	}
	
	function fulfillOrder(order) {
		console.log('fulfill');
 
	  $.ajax({
			url: '/orders.json',
	    type: 'POST',
	    data: order,
	    dataType: 'json',
	    crossDomain: false,
	    jsonp: false,
	    async: false,
	    success: function(data) {
	    	console.log('success');
	    	console.log(data);
	    	setOrderInfo(data,$("#CustomerList").jqxDropDownList('getSelectedItem')['originalItem']);
    		$("#ShipToList").jqxListBox('selectIndex',-1);
	    	$("#ShipToDialog").dialog('close');
	    	console.log('showing grid');
	    	console.log(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]);
		   	showHistoryGrid(custList[$("#CustomerList").jqxDropDownList('getSelectedIndex')]['lId'],currentaddressid == -1 ? -1 : currentaddressid);
	    	$("#InfoTable").show();
			},
			error: function(data) {
	    	prepareAlertDialog('Error saving order information');
	    }
		});
	}
	
		