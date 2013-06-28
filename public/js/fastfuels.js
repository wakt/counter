			var workingItem = {};
			var itemClickTime = +new Date();
			var keyPressTime = +new Date();
			var cart = {};
			cart[ 'items' ] = [];
			var lastBand = '';
			var lastCust = '';
			var quantity = '';
			var quantitydecimals = 0;
			var lastquantity = '';
			var spinner;
			
			function getCartTestData() {
				return {'total': '114.24', 
													'taxes': {'total': '12.239999999999998', 
														'taxes': {'GST': 5.1, 'PST': 7.14}
													}, 
													'subTotal': 102.0, 
													'lineItems': [
														{	'lId': 344, 
															'sName': '20L Pail Arox EP 100',
															'sSellUnit': '20L Pail', 
															'dPrice': 102.0, 
															'taxes': [{	'name': 'GST', 
																					'rate': 5.0, 
																					'status': 0, 
																					'subTotal': 102.0}, 
																				{	'name': 'PST', 
																					'rate': 7.0, 
																					'status': 0, 
																					'subTotal': 102.0}], 
															'quantity': '1', 
															'subTotal': 102.0}]};
			}
									
    	function findCustomer(id) {
    		for ( i= 0; i < custList.length; i++) {
    			if(id === custList[i]['lId']) {
    				return custList[i];
    			}
    		}
    	}
    	
    	function findCustomerIndexByName(name) {
    		for ( i= 0; i < custList.length; i++) {
    			if(name === custList[i]['sName']) {
    				return i;
    			}
    		}
    	}
    	
    	function selectCustomerByName(name) {
    		$("#custCombo").jqxComboBox("selectIndex", findCustomerIndexByName(name));
    	}
    	
    	function findItem(section,id) {
    		for ( i= 0; i < items[section].length; i++) {
    			if(id === items[section][i]['lId']) {
    				return items[section][i];
    			}
    		}
    	}
    	
    	function findItemIndexByName(section,name) {
    		for ( i= 0; i < items[section].length; i++) {
    			if(name === items[section][i]['sShortName']) {
    				return i;
    			}
    		}
    	}
    	
    	function selectItemByName(section,name) {
    		(section == 1 ? $("#ItemList") : $("#MiscList") ).jqxListBox("selectIndex", findItemIndexByName(section,name));
    	}
    	
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
      			{ name: 'spostalzip' }, 
      			{ name: 'band' }, 
      			{ name: 'drCrLimit' }
					],
					data: "",
					id: 'sName'
        };
    	}
    	
    	function createCustomerComboBox(custDataAdapter, theme) {
        $("#custCombo").jqxComboBox(
        {
          width: $(window).width() - 100,
          height: 30,
          source: custDataAdapter,
          theme: theme,
          selectedIndex: -1,
          autoComplete: true,
          searchMode: 'containsignorecase',
          minLength: 1,
          enableBrowserBoundsDetection: true,
          enableHover: true,
          displayMember: "sName",
          valueMember: "lId",
          openDelay: 0,
          closeDelay: 0,
          itemHeight: -1,
          placeHolder: 'Customer Name',
          autoDropDownHeight: true,
//          dropDownHeight: $(window).height() - 100,
					renderer: function (index, label, value) {
          	var item = custDataAdapter.records[index];
  					if (item != null) {
  						var label = '<div style="margins: 0px; padding: 0px; font-size: 24px; height: 32px;">' + item['sName'] + '   -   ' + item['sStreet1'] + ' ' + item['sCity'] + ' ' + item['sProvState'] + '</div>';
        			return label;
      			}
  	  			return "";
					},
					renderSelectedItem: function(index, item)
					{
//						console.log(index);
//						console.log(item);
//  					var item = custDataAdapter.records[index];
  					if (item != null) {
      				var label = item.originalItem['sName'];
      				return label;
  					}
  					return "";   
					}
      	});

		    $('#custCombo').on('select', function (event) 
				{
  					itemClickTime = +new Date();
				    var args = event.args;
				    if (args) {
				    	var cust = findCustomer(args.item.originalItem['lId']);
              if (cust != null) {
              	if(cust['drCrLimit'] > 0) {
              		$("#OnAccount").show();
              	}
              	else {
              		if($("#PaymentButtons").jqxButtonGroup('getSelection') == 2)
						     		$("#PaymentButtons").jqxButtonGroup('setSelection', 1);
              		$("#OnAccount").hide();
              	}

              	if(cust['band'].length > 0) {
              		$("#BandInput").jqxMaskedInput('val',cust['band']);
              	}
              	else {
              		$("#BandInput").jqxMaskedInput('clear');
              	}

				     		cart[ 'customerName'] = $("#custCombo").jqxComboBox('val');
				    		cart[ 'band' ] = cust['band'];
				    		cart[ 'payment' ] = $("#PaymentButtons").jqxButtonGroup('getSelection');

			     			if(cart[ 'items' ].length > 0) {
	              	$("#InvoiceButton").show();
	              }
              }
						}
				}); 			


				$('#custCombo').on('change', function (event)
				{
					if(args.item && args.item.originalItem) {
						if(args.item.originalItem.sName.match(new RegExp('.*cash sale*.','i'))) {
							if($("#BandInput").is(':visible')) {
								$("#BandInput").hide();
								cart ['band'] = '';
								if(cart[ 'items' ].length > 0) refreshCart();
							}
						}
						else {
							if($("#BandInput").not(':visible')) {
									$("#BandInput").show();
									cart ['band'] = $("#BandInput").jqxMaskedInput('val');
									if(cart[ 'items' ].length > 0) refreshCart();
							}
						}
					}
					if($("custCombo").jqxComboBox('val') != null &&
							$("custCombo").jqxComboBox('val').length > 0 &&
							lastCust.length == 0) {
						if($("#InvoiceButton").not(':visible') && 
								cart != null && cart['items'].length > 0)
							$("#InvoiceButton").show();
						lastCust = $("custCombo").jqxComboBox('val');
					}
					if($("custCombo").jqxComboBox('val') == null ||
							$("custCombo").jqxComboBox('val').length == 0)
						$("#InvoiceButton").hide();

	     		cart[ 'customerName'] = $("#custCombo").jqxComboBox('val');
	    		cart[ 'band' ] = $("#BandInput").is(":visible") ? $("#BandInput").jqxMaskedInput('val') : '';
	    		cart[ 'payment' ] = $("#PaymentButtons").jqxButtonGroup('getSelection');

     			if(cart[ 'items' ].length > 0) {
          	$("#InvoiceButton").show();
          }
				} );
				
    	}

			function createPaymentButtons(theme) {
        $("#PaymentButtons").jqxButtonGroup({ theme: theme, mode: 'radio' });
     		$("#OnAccount").hide();
     		$("#PaymentButtons").jqxButtonGroup('setSelection', 1);
     		$("#PaymentButtons").on('selected', function(event) {
//     			console.log($("#PaymentButtons").jqxButtonGroup('getSelection'));
     			if(cart[ 'items' ].length > 0) {
		    		cart[ 'payment' ] = $("#PaymentButtons").jqxButtonGroup('getSelection');
	     			refreshCart();
	     		}
     		} ) ; 
			}
			
			function createProductTabs(theme) {
		    $('#jqxTabs').jqxTabs({ width: '100%', height: 300, scrollable: false, theme: theme	});
//		    $('#TabList').append('<li style="float: left; position: static; height: 18px;"><div style="float: left; margin-top: 0px;"><table><tr><td style="width: 30%;"></td><td style="width: 30%;"><input type="button" value="Invoice" id="InvoiceButton" /></td><td style="width: 30%;"></td></div></li>');
		    $('#TabList').append('<li class="jqx-reset jqx-disableselect jqx-tabs-title jqx-tabs-title-theme1 jqx-item jqx-item-theme1 jqx-rc-t jqx-rc-t-theme1" style="float: left; position: static; height: 30px; margin: 0px; padding: 0px; border: 0px;"><table style="width: 450px;"><tr><td style="width: 200px;"></td><td style="width: 30%; padding: 0px; height 100%;"><input type="button" value="Print Invoice" id="InvoiceButton" style="margin: 0px; height: 20px; padding: 0px; font-size: 24px; vertical-align: middle;"/></td></tr></table></li>');
//		    $('#TabList').append('<li class="jqx-reset jqx-disableselect jqx-tabs-title jqx-tabs-title-theme1 jqx-item jqx-item-theme1 jqx-rc-t jqx-rc-t-theme1" style="float: left; position: static; height: 18px;"><input type="button" value="Invoice" id="InvoiceButton" /></li>');
			}
			
			function createBandInput(theme) {
        $("#BandInput").jqxMaskedInput({ width: 150, height: 25, mask: '##########', theme: theme, rtl: true, promptChar: '' });
        $("#BandInput").on('valuechanged', function(event) {
     			if( ( ( $("#BandInput").jqxMaskedInput('val').length > 0 && lastBand.length == 0 ) ||
     						( $("#BandInput").jqxMaskedInput('val').length == 0 && lastBand.length > 0 ) ) &&
     					cart[ 'items' ].length > 0) {
		    		cart[ 'band' ] = $("#BandInput").jqxMaskedInput('val');
	     			refreshCart();
//	     			console.log('band status change');
	     		}
	     		lastBand = $("#BandInput").jqxMaskedInput('val');
        } ) ;
			}			
				
			function createFuelButtons(theme) {

				htmlStr = '<table><tr>';
				items[0].forEach(function(element,index,itemList) {
					label = element['sShortName'] + "\n" + element['packaging'][0]['dPrice']
					if(element['packaging'][0]['statusprice'] != null)
						label += "\n(status: " + element['packaging'][0]['statusprice'] + ")"
					htmlStr += '<td><input type="button" value="' + label + '" id="' + noSpaces(element['packaging'][0]['sPartCode']) + '" /></td>';
				});
				htmlStr += '</tr></table>'
				$("#FuelButtons").html(htmlStr);
				// for each item
				//   create the button with the id of the part code as built above
				//   create its click method 
				//     the method must specify the index properly for each button
				i = 0;
				items[0].forEach(function(element,index,itemList) {
					cmdStr = "$('#" + noSpaces(element['packaging'][0]['sPartCode']) + "').jqxButton({ theme: theme, width: 250, height: 100});" +
	        	"$('#" + noSpaces(element['packaging'][0]['sPartCode']) + "').on('click', function (event) {" +
		        	"initializeWorkItem(items[0][" + i + "]['packaging'][0]['lId']);" + 
							"prepareQuantityDialog(0," + i + ",0," + fuelDecimals(element['packaging'][0]['sPartCode']) + ");" +
	  	 	      "$( '#ItemDialog' ).dialog( 'open' );" + 
						"}); "
//					console.log(cmdStr);
					eval(cmdStr);
	   	    i++;
			  });

			}

			function fuelDecimals(partCode) {
				var match = /.*Yard.*LS.*/
				if(/.*Yard.*LS.*/.exec(partCode))
					return 1;
				else
					return 3;
			}
			
			function noSpaces(inStr) {
				return inStr.replace(' ','');
			}
			
			function initializeWorkItem(itemId) {
				workingItem = {};
				workingItem['lId'] = itemId;
			}
			
			function createItemSource(items) {
				return {
          datatype: "json",
          datafields: [
              { name: 'sShortName' },
              { name: 'packaging' }
          ],
          id: 'lId',
          localdata: items
	      };
			}			
			
			function itemPackagingChoiceCount(index) {
				return items[$('#jqxTabs').jqxTabs('selectedItem')][index]['packaging'].length;
			}
			
			function createPackagingButtons(index) {
				html = "";
				for (i=0;i<itemPackagingChoiceCount(index);i++) {
					html = html + '<button style="margin: 3px; padding:4px 32px; font-size: 24px; height: 50px; width: 75%; border-radius: 10px;" id="' + items[1][index]['packaging'][i]['lId'] + '">' + items[1][index]['packaging'][i]['sSellUnit'] + '</button>';
				}
				$("#PackagingButtons").html(html);
        $("#PackagingButtons").jqxButtonGroup({ theme: theme, mode: 'radio'});

	      $('#PackagingButtons').on('buttonclick', function (event) {
	      	if((+new Date()) > itemClickTime + 500) {
						prepareQuantityDialog(1,$("#ItemList").jqxListBox('getSelectedItem').index,$("#PackagingButtons").jqxButtonGroup('getSelection'),0);
						console.log($("#ItemList").jqxListBox('getSelectedItem').index);
						workingItem['lId'] = items[1][$("#ItemList").jqxListBox('getSelectedItem').index]['packaging'][event.args.index]['lId'];
					}
  			});
			}
			
			function createOilLubeItemListBox(oilLubeItemDataAdapter,theme){
				$("#ItemList").jqxListBox({
					selectedIndex: -1, 
					source: oilLubeItemDataAdapter, 
					width: '100%',
					searchMode: 'containsignorecase',
					itemHeight: '42px;', 
					height: '250px', 
					theme: theme,
					renderer: function (index, label, value) {
						return '<div><table><td style="font-size: 24px; ">' + oilLubeItemDataAdapter.records[index]['sShortName'] + '</td></table></div>';
					}  
				});        
				$('#ItemList').on('select', function (event) {
	      	if((+new Date()) > itemClickTime + 500) {
				    var args = event.args;
				    if (args) {
			        var index = args.index;
			        var item = args.item;
			        var originalEvent = args.originalEvent;
			        // get item's label and value.
			        var label = item.label;
			        var value = item.value;
	  
	  					itemClickTime = +new Date();
							if(items[1][index]['packaging'].length == 1)	{
								initializeWorkItem(items[1][index]['packaging'][0]['lId']);
								prepareQuantityDialog(1,index,0,0);
				      }
							else {
								initializeWorkItem(null);
								preparePackagingDialog(index);
				      }
				      $( "#ItemDialog" ).dialog( "open" );
				    }
				   } else {
         		$("#ItemList").jqxListBox('clearSelection');
         		$("#MiscList").jqxListBox('clearSelection');
         	}
				   	
				});
			}	
			
			function createMiscellaneousItemListBox(miscellaneousItemDataAdapter,theme){
				$("#MiscList").jqxListBox({
					selectedIndex: -1, 
					source: miscellaneousItemDataAdapter, 
					width: '100%',
					searchMode: 'containsignorecase',
					itemHeight: '42px;', 
					height: '250px', 
					theme: theme,
					renderer: function (index, label, value) {
						return '<div><table><td style="font-size: 24px; ">' + miscellaneousItemDataAdapter.records[index]['sShortName'] + '</td></table></div>';
					}  
				});        
				$('#MiscList').on('select', function (event) {
			    var args = event.args;
			    if (args) {
		        var index = args.index;
		        var item = args.item;
		        var originalEvent = args.originalEvent;
		        // get item's label and value.
		        var label = item.label;
		        var value = item.value;
  
  					itemClickTime = +new Date();
						if(items[2][index]['packaging'].length == 1)	{
							initializeWorkItem(items[2][index]['packaging'][0]['lId']);
							prepareQuantityDialog(2,index,0,0);
			      }
						else {
							initializeWorkItem(null);
							preparePackagingDialog(index);
			      }
			      $( "#ItemDialog" ).dialog( "open" );
			    }
				});
			}	
			
			function prepareQuantityDialog(listIndex,itemIndex,packagingIndex,decimals) {
				setQuantityDialogHTML();
				setQuantityDialogOptions(listIndex,itemIndex,packagingIndex,decimals);
			}
			
			function preparePackagingDialog(index) {
				setPackagingDialogHTML();
				setPackagingDialogOptions(index);
			}
				
			function setPackagingDialogHTML() {
				$("#ItemDialog").html(
					'<table style="height: 100%; padding: 0px; margins: 0px;">' +
						'<tr  style="padding: 0px; margins: 0px;">' +
							'<td style="padding: 0px; margins: 0px;">' +
								'<div id="ItemProduct"></div>' +
							'</td>' +
						'</tr>' +
						'<tr>' +
							'<td>' +
								'<div id="PackagingButtons" style="margin: 20px; width: 100%;">' +
								'</div>' +
							'</td>' +
						'</tr>' +
					'</table>');
			}
			
			function setPackagingDialogOptions(index) {
				createPackagingButtons(index);
				$( "#ItemDialog" ).dialog( "option", "height", 240 + ( 60 * itemPackagingChoiceCount(index) ) );
				$( "#ItemDialog" ).dialog( "option", "title", "Select Packaging" );
				$("#ItemProduct").html("<p style='font-size: 24px; padding: 0px; margins: 0px;'>" + items[$('#jqxTabs').jqxTabs('selectedItem')][index]['sShortName'] + "</p>");
				$( "#ItemDialog" ).dialog( "option", "buttons", 
					{ Cancel: function() {
    		     	$( this ).dialog( "close" );
      		 	}	
      	  }
      	);
			}
		
			function setQuantityDialogHTML() {
				$("#ItemDialog").html(
					'<table style="width: 100%;, height: 100%; padding: 0px; margins: 0px;">' +
						'<tr style="padding: 0px; margins: 0px;">' +
							'<td style="padding: 0px; margins: 0px;">' +
								'<div id="ItemProduct" style="padding: 0px; margins: 0px;"></div>' +
							'</td>' +
						'</tr>' +
						'<tr style="padding: 0px; margins: 0px;">' +
							'<td style="padding: 0px; margins: 0px;">' +
								'<div id="ItemPackaging" style="padding: 0px; margins: 0px;"></div>' +
							'</td>' +
						'</tr>' +
						'<tr>' +
							'<td style="width: 100%;">' +
								'<input type="text" id="QuantityInput" style="text-align: right;" ></input>' +
							'</td>' +
						'</tr>' +
					'</table>');
			}
			
			function getQuantityVal() {
				return $('#QuantityInput')[0].value;
			}
			
			function setQuantityDialogOptions(listIndex,itemIndex,packagingIndex,decimals) {
				quantitydecimals = decimals;
				lastquantity = '';
				$("#QuantityInput")[0].value = '';
				$("#QuantityInput").on('keyup', function(event) {
					if (+new Date() > keyPressTime + 500) {
		      	if(event.keyCode != 13)  {
 		   	  		if (decimals == 0) {
	 	   	  			this.value = this.value.replace(/[^0-9]/g,'');
	 	   	  			if (/^\d*$/.test(this.value)) {
	 	   	  				lastquantity = this.value;
	 	   	  			}
	 	   	  			else {
	 	   	  				this.value = lastquantity;
	 	   	  			}
 		   	  		}
 	  	 	  		else {
 	   		  			this.value = this.value.replace(/[^0-9\.]/g,'');
 	  	 	  			if (this.value.match(new RegExp('^\\d*(\\.\\d{0,' + quantitydecimals + '})?$'))) {
 	  	 	  				lastquantity = this.value;
 	  	 	  			}
 	  	 	  			else {
 	  	 	  				this.value = lastquantity;
 	  	 	  			}
 	   	  			}
 	   	  			quantity = parseFloat(this.value).toFixed(quantitydecimals);
	    	  	}
  	  	  	else {
							if( parseFloat(getQuantityVal()) > 0.0) {
		  	    		$( "#ItemDialog" ).dialog( "close" );
		  	    		// need to format quantity to correct # of decimmals here
	    		  		updateCart();
	    	  			keyPressTime = +new Date();
	  	       		$("#ItemList").jqxListBox('clearSelection');
	    	     		$("#MiscList").jqxListBox('clearSelection');
	      	   	}
    	  		}
    	  	}
				});
				$( "#ItemDialog" ).dialog( "option", "height", 300);
				// this is where to set the mask
				$( "#ItemDialog" ).dialog( "option", "title", "Enter Quantity" );
				workingItem['lId'] = items[listIndex][itemIndex]['packaging'][0]['lId'];
				$("#ItemProduct").html("<p style='font-size: 24px; padding: 0px; margins: 0px;'>" + items[listIndex][itemIndex]['sShortName'] + "</p>");
				$("#ItemPackaging").html("<p style='font-size: 24px; padding: 0px; margins: 0px;'>" + items[listIndex][itemIndex]['packaging'][packagingIndex]['sSellUnit'] + "</p>");
				$( "#ItemDialog" ).dialog( "option", "buttons", 
						{ "Add Item": function() {
								if( parseFloat(getQuantityVal()) > 0) {
		          		$( this ).dialog( "close" );
		          		updateCart();
		          		$("#ItemList").jqxListBox('clearSelection');
		          	}
		        } ,
		        Cancel: function() {
    		      	$( this ).dialog( "close" );
	          		$("#ItemList").jqxListBox('clearSelection');
      		  }
      		 }
     		);
			}

			function updateCartContents() {
				// if same id already in cart
				//   increase cart item quantity
				var found = false;
    		cart[ 'items' ].forEach(function(element,index,cartItems) {
	    		if (workingItem['lId'] == element['lId']) {
//	    			to retain various formats, i could have gone over the top
//	    			and associated formatting with each quantity and maybe one day i'll do that
//						even the fmt doesn't do much due to the lack of built-in formatting
//						need to investigate plugins
	    			element['quantity'] = (parseFloat(workingItem['quantity']) + parseFloat(element['quantity'])).toFixed(quantitydecimals);
	    			found = true;
	    		}
	    	});
	    	if (!found)
	    		cart[ 'items' ].push(workingItem);
			}
						
			function updateCart() {
     		workingItem['quantity'] = quantity; 	 
     		cart[ 'customerName'] = $("#custCombo").jqxComboBox('val');
     		updateCartContents();
//    		cart[ 'items' ].forEach(function(element,index,cartItems) {
//	    		console.log(element['lId']);	
//	    	});
    		cart[ 'band' ] = $("#BandInput").is(':visible') ? $("#BandInput").jqxMaskedInput('val') : '';
    		cart[ 'payment' ] = $("#PaymentButtons").jqxButtonGroup('getSelection');
	      refreshCart();
	     }
	     
	     function refreshCart() {
//	     	startCartSpinner();
	      $.ajax({
					url: '/carts.json',
			    type: 'POST',
			    data: cart,
			    dataType: 'json',
			    crossDomain: true,
			    cache: true,
			    jsonp: false,
			    success: function(data) {
//			    	stopCartSpinner(); 
						$("#CartGrid").show();
						createCartGrid(data['lineItems']);
						$("#CartGrid").jqxGrid('addrow', null, { 'name': '<b>Subtotal</b>', 'packaging': '', 'quantity': '', 'price': '', 'amount': data['subtotal']} ) ;
						$("#CartGrid").jqxGrid('addrow', null, { 'name': '<b>Taxes</b>', 'packaging': '', 'quantity': '', 'price': '', 'amount': data['taxes']['total'] } ) ;
						$("#CartGrid").jqxGrid('addrow', null, { 'name': '<b>Total</b>', 'packaging': '', 'quantity': '', 'price': '', 'amount': data['total'] } ) ;
						if($("#custCombo").jqxComboBox('val').length >0 )
							$('#InvoiceButton').show();
					}
				});
			}
				
			function createCartGrid(data) {
				var source =
				{
			    localdata: data,
			    datatype: "array"
				};
				var dataAdapter = new $.jqx.dataAdapter(source, {
			    loadComplete: function (data) { },
			    loadError: function (xhr, status, error) { }    
				});
				$("#CartGrid").jqxGrid(
				{
			    source: dataAdapter,
			    width: $(window).width() - 90,
			    autoheight: true,
			    columns: [
		        { text: 'Item', datafield: 'name', width: ($(window).width() - 90) * 0.41, },
		        { text: 'Packaging', datafield: 'packaging', width: ($(window).width() - 90) * 0.23 },
		        { text: 'Quantity', datafield: 'quantity', width: ($(window).width() - 90) * 0.10, cellsalign: 'right'},
		        { text: 'Unit Price', datafield: 'price', width: ($(window).width() - 90) * 0.12, cellsalign: 'right', cellsformat: 'f' },
		        { text: 'Amount', datafield: 'amount', width: ($(window).width() - 90) * 0.14, cellsalign: 'right', cellsformat: 'f' }
			    ]
				});

				$("#CartGrid").on('keyup', function(event) {
					if(event.keyCode == 46 && 
						$("#CartGrid").jqxGrid('selectedrowindex') > -1 &&
						$("#CartGrid").jqxGrid('selectedrowindex') < $("#CartGrid").jqxGrid('getrows').length - 3 && 
						(+new Date()) > keyPressTime + 500 ) {
						keyPressTime = +new Date();
						deleteCartItem();
					}
	      } ) ;
			}
	
			function deleteCartItem() {
				cart['items'].splice($("#CartGrid").jqxGrid('selectedrowindex'), 1);
				if(cart['items'].length > 0)
					refreshCart();
				else {
					$("#CartGrid").hide();
					$("#InvoiceButton").hide();
				}
			}
									
			function initializeItemDialog() {
		    $( "#ItemDialog" ).dialog({
		      autoOpen: false,
		      height: 300,
		      width: 500,
		      modal: true,
		      show: "fade",
		      open: function(event, ui) {
						$(".ui-dialog").css("zIndex","10000");
					} ,
					close: function(event, ui) {
         		$("#ItemList").jqxListBox('clearSelection');
         		$("#MiscList").jqxListBox('clearSelection');
         	} ,
		      buttons: {
    		    "Add Item": function() {
	          	$( this ).dialog( "close" );
		        },	
  		      Cancel: function() {
    		      $( this ).dialog( "close" );
      		  }
      		}
		    });
			}

			function initializePostDialog() {
		    $( "#PostDialog" ).dialog({
		      autoOpen: false,
		      height: 300,
		      width: 500,
		      modal: true,
		      show: "fade",
		      open: function(event, ui) {
						$(".ui-dialog").css("zIndex","10000");
					} ,
		      buttons: {
    		    "Continue to next transaction": function() {
    		    	// forward to home
	          	$( this ).dialog( "close" );
	          	location.reload();
		        },	
  		      "Reprint invoice": function() {
  		      	// ajax call to print invoice
				      $.ajax({
								url: '/invoices/' + cart['invoicenum'] + '.json',
						    type: 'GET',
						    data: '',
						    dataType: 'json',
						    crossDomain: false,
						    cache: true,
						    jsonp: false
							});
      		  }
      		}
		    });
			}

			function initializeInvoiceButton() {
//				$("#InvoiceButton").jqxButton({ theme: theme, width: $(window).width() - 100, height: 100 });
				$("#InvoiceButton").jqxButton({ theme: theme, width: 200, height: 25 });
				$("#InvoiceButton").hide();
				$("#InvoiceButton").on('click', function (event) {
					if(cart['invoicenum'] == null) {
						cart['invoicenum'] = new Date().toISOString().replace(/-/g,'').replace(/:/g,'').replace(/T/g,'').replace('.','');
						cart['invoicenum'] = cart['invoicenum'].substring(0,cart['invoicenum'].length - 6);
					}
		      $.ajax({
						url: '/invoices.json',
				    type: 'POST',
				    data: cart,
				    dataType: 'json',
				    crossDomain: false,
				    cache: true,
				    jsonp: false,
				    success: function(data) { 
				    	alert('POST to invoice completed');
				    }
					});
					$("#PostDialog").dialog('open');
				});
			}
			
			function startCartSpinner() {
				if($("#CartGrid").is(':visible')) {
					var opts = {
					  lines: 13, // The number of lines to draw
					  length: 20, // The length of each line
					  width: 10, // The line thickness
					  radius: 30, // The radius of the inner circle
					  corners: 1, // Corner roundness (0..1)
					  rotate: 0, // The rotation offset
					  direction: 1, // 1: clockwise, -1: counterclockwise
					  color: '#000', // #rgb or #rrggbb
					  speed: 1, // Rounds per second
					  trail: 60, // Afterglow percentage
					  shadow: true, // Whether to render a shadow
					  hwaccel: false, // Whether to use hardware acceleration
					  className: 'spinner', // The CSS class to assign to the spinner
					  zIndex: 2e9, // The z-index (defaults to 2000000000)
//					  top: 100, // Top position relative to parent in px
//					  left: 1000 // Left position relative to parent in px
					};
					spinner = new Spinner(opts).spin();
					$("#Cart").append(spinner.el);
				}
			}
			
			function stopCartSpinner() {
				if($("#CartGrid").is(':visible')) {
					spinner.stop();
					$("#Cart").removeChild(spinner.el);
				}
			}