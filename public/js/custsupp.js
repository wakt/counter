			var workingCustomer = {};

			var taxationList = [{"name": "Residential Taxation", "value": "R"},{"name": "Commercial Taxation", "value": "C"},{"name": "Marine Taxation", "value": "M"},{"name": "Taaw Naay Taxation", "value": "1"}];
			
			var fuelList = [{"name": "LS Diesel", "value": "3"},{"name": "Dyed Diesel", "value": "4"},{"name": "Dyed Furnace Oil", "value": "6"},{"name": "Dyed Stove Oil", "value": "8"},
        							{"name": "Regular Gas", "value": "11"},{"name": "Dyed Regular Gas", "value": "12"},{"name": "Supreme Gas", "value": "15"},{"name": "Jet A-1 Fuel", "value": "19"},
        							{"name": "Dyed Supreme Gas", "value": "23"}];
        							
      var positionList = [{"name": "1 - Front Left Tank Position", "value": "1"},{"name": "2 - Left Tank Position", "value": "2"},{"name": "3 - Back Left Tank Position", "value": "3"},
        							{"name": "4 - Back Tank Position", "value": "4"},	{"name": "5 - Back Right Tank Position", "value": "5"},{"name": "6 - Right Tank Position", "value": "6"},
        							{"name": "7 - Front Right Tank Position", "value": "7"},{"name": "8 - Front Tank Position", "value": "8"}];
        							
      var regionCodeList = [{"name": "100 - Sandspit", "value": "100"},{"name": "150 - Alliford Bay, Pallent Creek, etc", "value": "150"},{"name": "200 - Queen Charlotte", "value": "200"},
        							{"name": "250 - Rennel Sound, etc.", "value": "250"},{"name": "300 - Skidegate", "value": "300"},{"name": "350 - Tlell, Lawn Hill, Miller Creek, etc", "value": "350"},
        							{"name": "400 - Port Clements", "value": "400"},{"name": "450 - Juskatla, Fergusen, etc", "value": "450"},{"name": "500 - Masset", "value": "500"},
        							{"name": "550 - Old Masset", "value": "550"},{"name": "575 - Tow Hill Road, Old Beach Road", "value": "575"},{"name": "600 - Various Locations", "value": "600"},
        							{"name": "950 - Yard Sales", "value": "950"}];

//			var currentCust;
						
    	function createCustomerSource(data) {
      	return  {
        	localdata: data,
					datatype: "jsonp",
 					datafields: [
      			{ name: 'sName' },
 						{ name: 'lId' },
      			{ name: 'sStreet1' },
      			{ name: 'sCity' },
      			{ name: 'sProvState' }, 
      			{ name: 'sPostalZip' }, 
      			{ name: 'band' }, 
      			{ name: 'custno' },
      			{ name: 'taxation' }, 
      			{ name: 'isHold' }, 
      			{ name: 'isEmployee' }, 
      			{ name: 'isPriceHidden' }, 
      			{ name: 'tankInfo' },
      			{ name: 'dCrLimit' },
      			{ name: 'priceList' },
      			{ name: 'shipToInfo' },
      			{ name: 'fobs' }
					],
					data: "",
					id: 'sName'
        };
    	}
    	
    	function createCustomerList(source) {
        $("#CustomerList").jqxDropDownList({ 
        	source: source, 
        	selectedIndex: -1, 
        	width: '100%', 
        	height: '25px', 
        	theme: 'theme1', 
        	displayMember: 'sName', 
        	valueMember: 'lId',
        	placeHolder: 'Select Customer:'
        });
        
        // bind to 'select' event.
        $('#CustomerList').bind('select', function (event) {
						$("#DetailsTable").show();
						$("#UpdateCustomer").show();
        	
            var args = event.args;
            var item = $('#CustomerList').jqxDropDownList('getItem', args.index);
            console.log(item);
//            console.log(args.item.originalItem['lId']);
            removeBindings();
            refreshCustomerData(args.item.originalItem);
            refreshBindings(args.item.originalItem, args.index);
            
//            currentCust = args.item.originalItem;
        });
      }
      
      function refreshCustomerData(cust) {
     		$("#BandInput").jqxMaskedInput('clear');
      	$("#BandInput").val(cust['band']);
//      	$("#BandInput").jqxMaskedInput('val', cust['band']);
      	
    		$("#OnHold").prop('checked', cust['isHold']==0 ? false : true);
    		$("#Employee").prop('checked', cust['isEmployee']==0 ? false : true);
    		$("#HidePrice").prop('checked', cust['isPriceHidden']==0 ? false : true);
    		
    		$("#CustNo").html(cust['custno']);
    		
//    		cust = args.item.originalItem;
    		$("#TaxationList").jqxDropDownList('selectIndex', findTaxationIndex(cust['taxation']));
        createTankInfoHeaderOrList(cust);
        $("#TankInfo").jqxListBox('height', $("#TankInfoCell").height());
        $("FobInputTable").show();
        refreshFobList(cust);
			}      	

			function removeBindings() {
				$("#BandInput").off('valuechanged');
				$("#TaxationList").off('select');
				$("#OnHold").off('change');
				$("#Employee").off('change');
				$("#HidePrice").off('change');
				$("#RemoveFob").off('click');
				$("#AddFob").off('click');
				$("#UpdateCustomer").off('click');
			}
										
			function refreshBindings(cust, index) {
				console.log('refreshBindings');
				console.log(cust);
				$("#BandInput").on('valuechanged', function(event) {
					console.log('band:' + $("#BandInput").jqxMaskedInput('val'));
					cust['band'] = $("#BandInput").jqxMaskedInput('val');
				});
				
				$("#TaxationList").on('select', function(event) {
					cust['taxation'] = $("#TaxationList").jqxDropDownList('getSelectedItem')['value'];
				});

				$("#OnHold").on('change', function(event) {
					cust['isHold'] = $("#OnHold").prop('checked') == true ? 1 : 0;
				});
				
				$("#Employee").on('change', function (event) {
					cust['isEmployee'] = $("#Employee").prop('checked') == true ? 1 : 0;
				});
				
				$("#HidePrice").on('change', function (event) {
					cust['isPriceHidden'] = $("#HidePrice").prop('checked') == true ? 1 : 0;
				});
				
				$("#RemoveFob").on('click', function(event) {
					// remove from list
					// remove from cust
					// if list empty, hide list
					items = $("#FobList").jqxListBox('getSelectedItems');
					items.sort(function(a,b) {
						return b['index'] - a['index'];
					});
					
					for(i=0;i<items.length;i++) {
						cust['fobs'].splice(items[i]['index'],1);
					}
					refreshFobList(cust);
				});
				
				$("#AddFob").on('click', function(event) {
					if($("#FobNumberInput").val().length > 0) {
						cust.fobs.push({'fobnum': $("#FobNumberInput").val(), 'fobdesc': $("#FobDescInput").val()});
						refreshFobList(cust);
					}
					else
						alert('Please enter a fob number!');
					$("#FobNumberInput").val('');
					$("#FobDescInput").val('');
				});
				
				$("#UpdateCustomer").on('click', function(event) {
					console.log('updating customer:');
					console.log(cust);
					if(validate(cust)) {
			      $.ajax({
							url: '/customers',
					    type: 'POST',
		//			    data: { manifest: $("#triporders").jqxGrid('getrows') },
							// need more than just the orders,
							// basically a deep copy of the trip except the orders component
							// orders come from create...
							// on 2nd thought
							// if i don't reorder the trip orders as the grid is reordered
							//   then the grid will be incorrect when redisplayed
							// so, i must reorder the trip orders as i reorder the grid
							// hence the data is the trip - sweet
							// and create trip orders (and maybe frind triporder) becomes obsolete
					    data: { customer: cust },
	//				    dataType: 'json',
					    crossDomain: false,
		//			    cache: true,
	//				    jsonp: true,
					    async: false,
					    success: function(data) { 
					    	console.log('return from POST');
					    	console.log(data);
					    	alert('Customer update successful!\nCustomer no: ' + data);
					    	cust['custno'] = data;
	    	    		$("#CustNo").html(cust['custno']);

					    },
					    error: function(data) { 
					    	console.log('return from POST');
					    	console.log(data);
					    	alert('Error detected on save:\n' + data.responseText);
					    },
					    
						});
					}
					
				});
			}
			
			function validate(cust) {
				if(jQuery.isEmptyObject(cust['shipToInfo']) == true ||
					cust['shipToInfo'].length == 1) {
					if(isTankInfoStarted()) {
						if(!isAllTankInfoEntered()) {
							alert('Please enter all tank info');
							return false;
						}
						else
							return true;
					}
				}
				else {
					tanksOK=true;
					cust['shipToInfo'].forEach(function(shipto) {
						console.log(shipto['shipToName']);
						console.log(shipto['shipaccesscode']);
						console.log(shipto['shipcapacity']);
						console.log(shipto['shipregioncode']);
						console.log(shipto['shipfuel']);
						console.log(shipto['shipposition']);						
						console.log(((!isEmpty(shipto['shipaccesscode']) ||
								!isEmpty(shipto['shipcapacity']) ||
								!isEmpty(shipto['shipregioncode']) ||
								!isEmpty(shipto['shipfuel']) ||
								!isEmpty(shipto['shipposition'])) &&
							!(!isEmpty(shipto['shipaccesscode']) &&
								!isEmpty(shipto['shipcapacity']) &&
								!isEmpty(shipto['shipregioncode']) &&
								!isEmpty(shipto['shipfuel']) &&
								!isEmpty(shipto['shipposition']))));
						console.log((isEmpty(shipto['shipaccesscode']) &&
								isEmpty(shipto['shipcapacity']) &&
								isEmpty(shipto['shipregioncode']) &&
								isEmpty(shipto['shipfuel']) &&
								isEmpty(shipto['shipposition']))
								);
						if((!isEmpty(shipto['shipaccesscode']) ||
								!isEmpty(shipto['shipcapacity']) ||
								!isEmpty(shipto['shipregioncode']) ||
								!isEmpty(shipto['shipfuel']) ||
								!isEmpty(shipto['shipposition'])) &&
							!(!isEmpty(shipto['shipaccesscode']) &&
								!isEmpty(shipto['shipcapacity']) &&
								!isEmpty(shipto['shipregioncode']) &&
								!isEmpty(shipto['shipfuel']) &&
								!isEmpty(shipto['shipposition']))
								) {
							console.log('validation failure');
							tanksOK = false;
						}
					});
					if(tanksOK == false) {
						alert('Please enter all tank info');
						return false;
					}
					else
						return true;
				}
				return true;
			}
							
				
			function isEmpty(t) {
				return (t === undefined ||
									t == null ||
									(t !=null && t.length == 0));
			}
			
			function isTankInfoStarted() {
				return ($("#AccessCodeInput").val().length > 0 ||
						$("#CapacityInput").val().length > 0 ||
						$("#FuelList").jqxDropDownList('getSelectedIndex') != -1 ||
						$("#PositionList").jqxDropDownList('getSelectedIndex') != -1 ||
						$("#RegionCodeList").jqxDropDownList('getSelectedIndex') != -1);
			}
						
			function isAllTankInfoEntered() {
				return ($("#AccessCodeInput").val().length > 0 &&
						$("#CapacityInput").val().length > 0 &&
						$("#FuelList").jqxDropDownList('getSelectedIndex') != -1 &&
						$("#PositionList").jqxDropDownList('getSelectedIndex') != -1 &&
						$("#RegionCodeList").jqxDropDownList('getSelectedIndex') != -1);
			}
						
			function findTaxationIndex(type) {
				if(type==null || type.length==0)
					type='R';
    		for ( i= 0; i < taxationList.length; i++) {
    			if(type === taxationList[i]['value']) {
    				return i;
    			}
    		}
    		return -1;
    	}
				
			function createBandInput(theme) {
        $("#BandInput").jqxMaskedInput({ width: 150, height: 25, mask: '##########', theme: theme, rtl: true, promptChar: '' });
//        $("#BandInput").on('valuechanged', function(event) {
//		    		cart[ 'band' ] = $("#BandInput").jqxMaskedInput('val');
//        } ) ;
			}			
				
			function createAccessCodeInput(theme) {
        $("#AccessCodeInput").jqxMaskedInput({ width: 150, height: 25, mask: '############', theme: theme, rtl: true, promptChar: '' });
			}			
				
			function createCapacityInput(theme) {
        $("#CapacityInput").jqxMaskedInput({ width: 150, height: 25, mask: '#######', theme: theme, rtl: true, promptChar: '' });
			}			
				
    	function createTaxationSource() {
      	return  {
        	localdata: taxationList,
					datatype: "json",
 					datafields: [
      			{ name: 'name' },
 						{ name: 'value' }
					],
					data: "",
					id: 'value'
        };
    	}
    	
    	function createTaxationList(source) {
        $("#TaxationList").jqxDropDownList({ 
        	source: source, 
        	selectedIndex: -1, 
        	width: '100%', 
        	height: '25px', 
        	theme: 'theme1', 
        	displayMember: 'name',
        	valueMember: 'value',
        	placeHolder: 'Select Taxation Scheme:'
        });
        
        // bind to 'select' event.
//        $('#TaxationList').bind('select', function (event) {
//            var args = event.args;
//            var item = $('#TaxationList').jqxDropDownList('getItem', args.index);
//            console.log(item);
//            console.log(args.item.originalItem['value']);
//        });
      }

			function createTankSource(cust) {
      	return  {
        	localdata: cust['shipToInfo'],
					datatype: "jsonp",
 					datafields: [
      			{ name: 'shipToName' },
      			{ name: 'shipid' },
 						{ name: 'shipfuel' },
      			{ name: 'shipposition' },
      			{ name: 'shipcapacity' },
      			{ name: 'shipaccesscode' }, 
      			{ name: 'shipregioncode' }
					],
					data: "",
					id: 'shipaccesscode'
        };
      }
       
      function createTankList(source) {
        $("#TankInfo").jqxListBox({ 
        	source: source, 
        	selectedIndex: -1, 
        	width: '100%', 
        	height: '25px', 
        	theme: 'theme1', 
        	displayMember: 'shipToName', 
        	valueMember: 'shipaccesscode',
        	autoHeight: true
        });
        
        // bind to 'select' event.
//        $('#TankInfo').bind('select', function (event) {
//            var args = event.args;
//            var item = $('#TankInfo').jqxDropDownList('getItem', args.index);
////            console.log(item);
//            tank = args.item.originalItem;
//            index = args.index;
//            console.log(tank);
//						removeTankInputBindings();
//						populateTankFields(tank['shipaccesscode'],tank['shipcapacity'],tank['shipfuel'],tank['shipposition'],tank['shipregioncode']);
//						$("#TankInputTable").show();
//						$("#AccessCodeInput").on('input', function(event) {
//							tank['shipaccesscode'] = $("#AccessCodeInput").val();
//						});
//						$("#CapacityInput").on('input', function(event) {
//							tank['shipcapacity'] = $("#CapacityInput").val();
//						});
//						$("#FuelList").on('select', function(event) {
//							console.log('fuel change');
//							console.log(currentCust);
//							console.log(tank);
//							currentCust['shipto'][index]['shipfuel'] = Number($("#FuelList").jqxDropDownList('getSelectedItem')['value']);
//							console.log(currentCust);
//							console.log(tank);
//						});
//						$("#PositionList").on('select', function(event) {
//							tank['shipposition'] = $("#PositionList").jqxDropDownList('getSelectedItem')['value'];
//						});
//						$("#RegionCodeList").on('select', function(event) {
//							tank['shipregioncode'] = $("#RegionCodeList").jqxDropDownList('getSelectedItem')['value'];
//						});
//        });
        $('#TankInfo').bind('unselect', function (event) {
						$("#TankInputTable").hide();
        });
      }
				
			function createTankInfoHeaderOrList(cust) {
				if(jQuery.isEmptyObject(cust['shipToInfo']) == true ||
					cust['shipToInfo'].length == 1) {
					console.log(cust);
//					console.log(cust['tankInfo']);
					$("#TankInfo").hide();
					$("#TankListTable").show();
					if(jQuery.isEmptyObject(cust['shipToInfo']) == true)
						$("#TankLabel").html('Tank at Mailing Address');
					else
						$("#TankLabel").html(cust['shipToInfo'][0]['shipToName']);
					$("#SingleTank").show();
					$("#TankInputTable").show();
					removeTankInputBindings();
					if(jQuery.isEmptyObject(cust['shipToInfo']) == true)
						populateTankFields(cust['tankInfo']['custaccesscode'],cust['tankInfo']['custcapacity'],cust['tankInfo']['custfuel'],cust['tankInfo']['custposition'],cust['tankInfo']['custregioncode']);
					else
						populateTankFields(cust['shipToInfo'][0]['shipaccesscode'],cust['shipToInfo'][0]['shipcapacity'],cust['shipToInfo'][0]['shipfuel'],cust['shipToInfo'][0]['shipposition'],
							cust['shipToInfo'][0]['shipregioncode']);
					$("#AccessCodeInput").on('valuechanged', function(event) {
						if(jQuery.isEmptyObject(cust['shipToInfo']) == true)
							cust['tankInfo']['custaccesscode'] = $("#AccessCodeInput").jqxMaskedInput('val');
						else
							cust['shipToInfo'][0]['shipaccesscode'] = $("#AccessCodeInput").jqxMaskedInput('val');
					});
					$("#CapacityInput").on('valuechanged', function(event) {
						if(jQuery.isEmptyObject(cust['shipToInfo']) == true)
							cust['tankInfo']['custcapacity'] = Number($("#CapacityInput").jqxMaskedInput('val'));
						else
							cust['shipToInfo'][0]['shipcapacity'] = Number($("#CapacityInput").jqxMaskedInput('val'));
					});
					$("#FuelList").on('select', function(event) {
						if(jQuery.isEmptyObject(cust['shipToInfo']) == true)
							cust['tankInfo']['custfuel'] = Number($("#FuelList").jqxDropDownList('getSelectedItem')['value']);
						else
							cust['shipToInfo'][0]['shipfuel'] = Number($("#FuelList").jqxDropDownList('getSelectedItem')['value']);
					});
					$("#PositionList").on('select', function(event) {
						if(jQuery.isEmptyObject(cust['shipToInfo']) == true)
							cust['tankInfo']['custposition'] = Number($("#PositionList").jqxDropDownList('getSelectedItem')['value']);
						else
							cust['shipToInfo'][0]['shipposition'] = Number($("#PositionList").jqxDropDownList('getSelectedItem')['value']);
					});
					$("#RegionCodeList").on('select', function(event) {
						if(jQuery.isEmptyObject(cust['shipToInfo']) == true)
							cust['tankInfo']['custregioncode'] = Number($("#RegionCodeList").jqxDropDownList('getSelectedItem')['value']);
						else
							cust['shipToInfo'][0]['shipregioncode'] = Number($("#RegionCodeList").jqxDropDownList('getSelectedItem')['value']);
					});
				}
				else {
					removeTankInputBindings();
					$("#SingleTank").hide();
					$("#TankListTable").show();
					$("#TankInputTable").hide();
					$("#AccessCodeInput").jqxMaskedInput('clear');
					$("#CapacityInput").jqxMaskedInput('clear');
					$("#FuelList").jqxDropDownList('selectIndex', -1);
					$("#PositionList").jqxDropDownList('selectIndex', -1);
					$("#RegionCodeList").jqxDropDownList('selectIndex', -1);
					tankSource = createTankSource(cust);
	        var tankDataAdapter = new $.jqx.dataAdapter(tankSource);
					$("#TankInfo").jqxListBox({source: tankDataAdapter});
					$("#TankInfo").jqxListBox('refresh');

        // bind to 'select' event.
        $('#TankInfo').on('select', function (event) {
            var args = event.args;
            var item = $('#TankInfo').jqxDropDownList('getItem', args.index);
//            console.log(item);
            tank = args.item.originalItem;
            index = args.index;
            console.log(tank);
						removeTankInputBindings();
						populateTankFields(tank['shipaccesscode'],tank['shipcapacity'],tank['shipfuel'],tank['shipposition'],tank['shipregioncode']);
						$("#TankInputTable").show();
						$("#AccessCodeInput").on('valuechanged', function(event) {
							tank['shipaccesscode'] = $("#AccessCodeInput").jqxMaskedInput('val');
							cust['shipToInfo'][index]['shipaccesscode'] = $("#AccessCodeInput").jqxMaskedInput('val');
						});
						$("#CapacityInput").on('valuechanged', function(event) {
							tank['shipcapacity'] = Number($("#CapacityInput").jqxMaskedInput('val'));
							cust['shipToInfo'][index]['shipcapacity'] = Number($("#CapacityInput").jqxMaskedInput('val'));
						});
						
						// interesting behaviour when updating nested elements
						// i have to update both the tank as held by the list box
						// and the cust as provided by the cust selection
						$("#FuelList").on('select', function(event) {
//							console.log('fuel change');
//							console.log(currentCust);
//							console.log(tank);
							tank['shipfuel'] = Number($("#FuelList").jqxDropDownList('getSelectedItem')['value']);
							cust['shipToInfo'][index]['shipfuel'] = Number($("#FuelList").jqxDropDownList('getSelectedItem')['value']);
//							console.log(currentCust);
//							console.log(tank);
						});
						$("#PositionList").on('select', function(event) {
							tank['shipposition'] = Number($("#PositionList").jqxDropDownList('getSelectedItem')['value']);
							cust['shipToInfo'][index]['shipposition'] = Number($("#PositionList").jqxDropDownList('getSelectedItem')['value']);
						});
						$("#RegionCodeList").on('select', function(event) {
							tank['shipregioncode'] = Number($("#RegionCodeList").jqxDropDownList('getSelectedItem')['value']);
							cust['shipToInfo'][index]['shipregioncode'] = Number($("#RegionCodeList").jqxDropDownList('getSelectedItem')['value']);
						});

        });
					$("#TankInfo").show();
	      }
	    }
	    
	    function removeTankInputBindings() {
				$("#AccessCodeInput").off('valuechanged');
				$("#CapacityInput").off('valuechanged');
				$("#FuelList").off('select');
				$("#PositionList").off('select');
				$("#RegionCodeList").off('select');
			}
			    
	    function populateTankFields(accesscode,capacity,fuel,position,regioncode) {
    		$("#AccessCodeInput").jqxMaskedInput('clear');
	    	if(!(accesscode === undefined))
					$("#AccessCodeInput").jqxMaskedInput('val',accesscode);
				$("#CapacityInput").jqxMaskedInput('clear');
				if(!(capacity === undefined))
					$("#CapacityInput").jqxMaskedInput('val',capacity == null ? 0 : capacity.toString());
				$("#FuelList").jqxDropDownList('selectIndex', findFuelIndex(fuel));
				$("#PositionList").jqxDropDownList('selectIndex', findPositionIndex(position));
				$("#RegionCodeList").jqxDropDownList('selectIndex', findRegionCodeIndex(regioncode));
			}
			
			function findFuelIndex(fuel) {
				if(fuel === undefined || fuel == null)
					return -1;
				f = fuel.toString();
    		for ( i= 0; i < fuelList.length; i++) {
    			if(f === fuelList[i]['value']) {
    				return i;
    			}
    		}
    		return -1;
			}
			
			function findPositionIndex(position) {
				if(position === undefined || position == null)
					return -1;
				p = position.toString();
    		for ( i= 0; i < positionList.length; i++) {
    			if(p === positionList[i]['value']) {
    				return i;
    			}
    		}
    		return -1;
			}
								
			function findRegionCodeIndex(regionCode) {
				if(regionCode === undefined || regionCode == null)
					return -1;
				r = regionCode.toString();
    		for ( i= 0; i < regionCodeList.length; i++) {
    			if(r === regionCodeList[i]['value']) {
    				return i;
    			}
    		}
    		return -1;
			}
								
    	function createFuelSource() {
      	return  {
        	localdata: fuelList,
					datatype: "json",
 					datafields: [
      			{ name: 'name' },
 						{ name: 'value' }
					],
					data: "",
					id: 'value'
        };
    	}
    	
    	function createFuelList(source) {
        $("#FuelList").jqxDropDownList({ 
        	source: source, 
        	selectedIndex: -1, 
        	width: '100%', 
        	height: '25px', 
        	theme: 'theme1', 
        	displayMember: 'name',
        	valueMember: 'value',
        	placeHolder: 'Select Fuel:'
        });
        
        // bind to 'select' event.
        $('#FuelList').bind('select', function (event) {
            var args = event.args;
            var item = $('#FuelList').jqxDropDownList('getItem', args.index);
//          if(item != null) {
//            console.log(item);
//            console.log(args.item.originalItem['value']);
//	        }
        });
      }

    	function createRegionCodeSource() {
      	return  {
        	localdata: regionCodeList,
					datatype: "json",
 					datafields: [
      			{ name: 'name' },
 						{ name: 'value' }
					],
					data: "",
					id: 'value'
        };
    	}
    	
    	function createRegionCodeList(source) {
        $("#RegionCodeList").jqxDropDownList({ 
        	source: source, 
        	selectedIndex: -1, 
        	width: '100%', 
        	height: '25px', 
        	theme: 'theme1', 
        	displayMember: 'name',
        	valueMember: 'value',
        	placeHolder: 'Select Region Code:'
        });
      }
        
    	function createPositionSource() {
      	return  {
        	localdata: positionList,
					datatype: "json",
 					datafields: [
      			{ name: 'name' },
 						{ name: 'value' }
					],
					data: "",
					id: 'value'
        };
    	}
    	
    	function createPositionList(source) {
        $("#PositionList").jqxDropDownList({ 
        	source: source, 
        	selectedIndex: -1, 
        	width: '100%', 
        	height: '25px', 
        	theme: 'theme1', 
        	displayMember: 'name',
        	valueMember: 'value',
        	placeHolder: 'Select Tank Position:'
        });
        
        // bind to 'select' event.
        $('#PositionList').bind('select', function (event) {
            var args = event.args;
            var item = $('#PositionList').jqxDropDownList('getItem', args.index);
//            if(item != null) {
//	            console.log(item);
//	            console.log(args.item.originalItem['value']);
//	          }
        });
      }

    	function createFobSource(data) {
      	return  {
        	localdata: data,
					datatype: "json",
 					datafields: [
      			{ name: 'fobnum' },
 						{ name: 'fobdesc' }
					],
					data: "",
					id: 'name'
        };
    	}
    	
    	function createFobList(source) {
        $("#FobList").jqxListBox({ 
        	source: source, 
        	selectedIndex: -1, 
        	width: '100%', 
        	height: '25px', 
        	theme: 'theme1',
         	multiple: true,
//        	autoHeight: true,
					renderer: function (index, label, value) {
//						console.log($("#FobList").jqxListBox('source').length);
						if($("#FobList").jqxListBox('source').length >0) {
	          	var item = $("#FobList").jqxListBox('source')[index];
	  					if (item != null) {
	  						var label = item['fobnum'] + (item['fobdesc'].length == 0 ? '' : (' - ' + item['fobdesc']));
	        			return label;
	      			}
	      		}
  	  			return "";
					}        	
        });
        
        // bind to 'select' event.
        $('#FobList').bind('select', function (event) {
            var args = event.args;
            var item = $('#FobList').jqxDropDownList('getItem', args.index);
//            console.log(item);
//            console.log(args.item.originalItem);
        });
      }

			function refreshFobList(cust) {
//				console.log(cust['fobs']);
				$("#FobListTable").show();
				$("#FobInputTable").show();
				
				if(cust['fobs'].length == 0) {
					$("#FobList").hide();
					$("#RemoveFob").hide();
				}
				else {
					$("#FobList").show();
					$("#RemoveFob").show();
	        $("#FobList").jqxListBox('height', $("#FobListCell").height());
				}
				
				$("#FobList").jqxListBox({source: cust['fobs']});
				$("#FobList").jqxListBox('refresh');
			}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Automated testing support functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	function selectCustomer(custName) {
		var index=-1;
//		console.log('in select' + custName);
    $("#CustomerList").jqxDropDownList('source').records.some(function(entry, i) {
//			console.log(entry.sName);
    	if (entry.sName == custName) {
      	  index = i;
        	return true;
    	}
    });
    $("#CustomerList").jqxDropDownList('selectIndex', index);
  }

	function selectTank(tankName) {
		var index=-1;
		console.log('in select' + tankName);
    $("#TankInfo").jqxListBox('source').records.some(function(entry, i) {
    	console.log(entry.shipToName);
    	if (entry.shipToName == tankName) {
      	  index = i;
        	return true;
    	}
    });
    $("#TankInfo").jqxListBox('selectIndex', index);
  }

	function selectTaxation(taxation) {
		var index=-1;
		console.log('in select' + taxation);
    $("#TaxationList").jqxDropDownList('source').records.some(function(entry, i) {
    	console.log(entry.name);
    	if (entry.name == taxation) {
      	  index = i;
        	return true;
    	}
    });
    $("#TaxationList").jqxDropDownList('selectIndex', index);
  }

	function getFobIndex(fobLabel) {
		index = -1;
		$("#FobList").jqxListBox("getItems").some(function(entry, i) {
			if((entry.originalItem.fobnum + " - " + entry.originalItem.fobdesc) == fobLabel) {
				index = i;
				return true;
			}
		});
		return index;
	}