
	var amountRegex = new RegExp('^\\d*(\\.\\d{0,4})?$');
	var rateRegex = new RegExp('^\\d*(\\.\\d{0,2})?%$');

	var custSortFunc = 	function custSort(a,b) {
	  if(a['sName'] == 'Cash Sales')
	 	 return -1;
	 	return a['sName'].toUpperCase() < b['sName'].toUpperCase() ? -1 : b['sName'].toUpperCase() < a['sName'].toUpperCase() ? 1 : 0;
	}

	function group_by(arr,grouper){
    var groups = [];
    arr.forEach(function(element) {
    	groupid = grouper(element).toString();
    	if(!(groupid in groups))
    		groups[groupid] = [];
	    console.log('group_by step');
	    console.log(groups);
    	groups[groupid].push(element);
	    console.log(groups);
    });
    console.log('group_by');
    console.log(groups);
    
	  groups = Object.keys(groups).map(function(key) { return groups[key]; } );
	  
    return groups.filter(function(x) { return x !== undefined && x != null; });
  };

	function createCustFromSource() {
  	return  {
    	localdata: custList,
			datatype: "jsonp",
			datafields: [
  			{ name: 'sName' },
  			{ name: 'lId' }
			],
			data: "",
			id: 'sName'
    };
  }
   
  function createCustFromList(source) {
    $("#CustomerFromList").jqxListBox({ 
    	source: source, 
    	selectedIndex: -1, 
    	width: '100%', 
    	height: '300px', 
    	theme: 'theme1',         	
    	displayMember: 'sName', 
    	valueMember: 'lId',
    	autoHeight: false,
    	multiple: true
    });
    
  }
		
	function createCustToSource() {
  	return  {
    	localdata: tocust,
			datatype: "jsonp",
			datafields: [
  			{ name: 'sName' },
  			{ name: 'lId' }
			],
			data: "",
			id: 'sName'
    };
  }
   
  function createCustToList(source) {
    $("#CustomerToList").jqxListBox({ 
    	source: source, 
    	selectedIndex: -1, 
    	width: '100%', 
    	height: '300px', 
    	theme: 'theme1', 
    	displayMember: 'sName', 
    	valueMember: 'lId',
    	autoHeight: false,
    	multipleextended: true
    });
    
  }
		
	function createItemFromSource() {
  	return  {
    	localdata: productgroups,
			datatype: "jsonp",
			datafields: [
  			{ name: 'lId' },
  			{ name: 'sName' }
			],
			data: "",
			id: 'sName'
    };
  }
   
  function createItemFromList(source) {
    $("#ItemFromList").jqxListBox({ 
    	source: source, 
    	selectedIndex: -1, 
    	width: '100%', 
    	height: '300px', 
    	theme: 'theme1', 
    	displayMember: 'sName', 
    	valueMember: 'sName',
    	autoHeight: false,
    	multipleextended: true
    });
    
  }

	function createAccountTreeSource() {
		return {
			datatype: "json",
			datafields: [
          { name: 'id' },
          { name: 'parentid' },
          { name: 'name' },
          { name: 'html' }
      ],
      id: 'id',
      localdata: [].concat.apply([],productgroups.map(function(account) {
				return [].concat.apply([{'parentid': 0, 'name': account['sName'], 'id': account['lId']}],account['items'].map(function(item) {
					console.log(item);
					if($.grep(offsets,function(offset) {
	  						return $.grep(offset['items'],function(offsetitem) {
	  							return offsetitem['inventid'] == item['inventid'] && offsetitem['isoffset'] == 1;
	  						}).length > 0;
	  					}).length > 0) {
	  				console.log('cust-ind item found');
						return {'parentid': account['lId'], 'name': ('<span style="color: #C00000">' + item['partName'] + '</span>'), 'id': item['inventid'], 'html': ('<span style="color: #C00000">!' + item['partName'] + '</span>') };
	  			} else						
						return {'parentid': account['lId'], 'name': item['partName'], 'id': item['inventid'], 'html': ('<span style="color: #000000">' + item['partName'] + '</span>') };
				}));
			}))
		};
		
	}
	
	function createProductTree(productDataAdapter) {
    productDataAdapter.dataBind();
    // get the tree items. The first parameter is the item's id. The second parameter is the parent item's id. The 'items' parameter represents 
    // the sub items collection name. Each jqxTree item has a 'label' property, but in the JSON data, we have a 'text' field. The last parameter 
    // specifies the mapping between the 'text' and 'label' fields.  
    var records = productDataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'name', map: 'label'}]);
    $('#ProductTree').jqxTree({ source: records, width: '500px', height: '300px', checkboxes: true, hasThreeStates: true});
	}

	
	function createItemToSource() {
  	return  {
    	localdata: toproductgroups,
			datatype: "jsonp",
			datafields: [
  			{ name: 'lId' },
  			{ name: 'sName' }
			],
			data: "",
			id: 'sShortName'
    };
  }
   
  function createItemToList(source) {
    $("#ItemToList").jqxListBox({ 
    	source: source, 
    	selectedIndex: -1, 
    	width: '100%', 
    	height: '300px', 
    	theme: 'theme1', 
    	displayMember: 'sName', 
    	valueMember: 'sName',
    	autoHeight: false,
    	multiple: true
    });
    
  }
  
  function setButtonEvents() {
  	$("#AddAllCustomers").on('click', function(event) {
  		while(custList.length > 0) {
	  		tocust.push(custList.shift())
	  	}
	  	tocust.sort(custSortFunc);
	  	$("#CustomerFromList").jqxListBox('refresh');
	  	$("#CustomerToList").jqxListBox('refresh');
	  	showOffsetGrid();
			setButtonEnabling();
	  });
	  
  	$("#RemoveAllCustomers").on('click', function(event) {
			removeAllCustomers();
	  });
	  
  	$("#AddACustomer").on('click', function(event) {
		  // to add specific customers
		  // get list of selected customers
		  // for each selected customer
		  //   find the element in custlist with matching lid
		  //   push this onto tocust
		  //   splice it out of custList
		  // sort to list
		  // clear from selection(s)
		  // refresh both list boxes  
			$("#CustomerFromList").jqxListBox('getSelectedItems').forEach(function(item) {
				selcust = $.grep(custList, function(cust) { return cust['lId'] == item['originalItem']['lId']; })[0];
				tocust.push(custList.splice(custList.indexOf(selcust),1)[0]);
			});
	  	tocust.sort(custSortFunc);
	  	$("#CustomerFromList").jqxListBox({selectedIndex: -1});
	  	$("#CustomerFromList").jqxListBox('refresh');
	  	$("#CustomerToList").jqxListBox('refresh');
	  	showOffsetGrid();
			setButtonEnabling();
		});			
	  
  	$("#RemoveACustomer").on('click', function(event) {
			$("#CustomerToList").jqxListBox('getSelectedItems').forEach(function(item) {
				selcust = $.grep(tocust, function(cust) { return cust['lId'] == item['originalItem']['lId']; })[0];
				custList.push(tocust.splice(tocust.indexOf(selcust),1)[0]);
			});
	  	custList.sort(custSortFunc);
	  	$("#CustomerFromList").jqxListBox('refresh');
	  	$("#CustomerToList").jqxListBox({selectedIndex: -1});
	  	$("#CustomerToList").jqxListBox('refresh');
	  	showOffsetGrid();
			setButtonEnabling();
		});			
	  
  	$("#AddAllItems").on('click', function(event) {
  		while(productgroups.length > 0) {
	  		toproductgroups.push(productgroups.shift())
	  	}
	  	toproductgroups.sort(custSortFunc);
	  	$("#ItemFromList").jqxListBox('refresh');
	  	$("#ItemToList").jqxListBox('refresh');
	  	showOffsetGrid();
			setButtonEnabling();
	  });
	  
  	$("#AddAnItem").on('click', function(event) {
			$("#ItemFromList").jqxListBox('getSelectedItems').forEach(function(sel) {
				selitem = $.grep(productgroups, function(item) { return item['sName'] == sel['originalItem']['sName']; })[0];
				toproductgroups.push(productgroups.splice(productgroups.indexOf(selitem),1)[0]);
			});
	  	toproductgroups.sort(custSortFunc);
	  	$("#ItemFromList").jqxListBox({selectedIndex: -1});
	  	$("#ItemFromList").jqxListBox('refresh');
	  	$("#ItemToList").jqxListBox('refresh');
	  	showOffsetGrid();
			setButtonEnabling();
		});			
	  
  	$("#RemoveAnItem").on('click', function(event) {
			$("#ItemToList").jqxListBox('getSelectedItems').forEach(function(sel) {
				selitem = $.grep(toproductgroups, function(item) { return item['sName'] == sel['originalItem']['sName']; })[0];
				productgroups.push(toproductgroups.splice(toproductgroups.indexOf(selitem),1)[0]);
			});
	  	productgroups.sort(custSortFunc);
	  	$("#ItemFromList").jqxListBox('refresh');
	  	$("#ItemToList").jqxListBox({selectedIndex: -1});
	  	$("#ItemToList").jqxListBox('refresh');
	  	showOffsetGrid();
			setButtonEnabling();
		});			
	  
  	$("#RemoveAllItems").on('click', function(event) {
			removeAllItems();
	  });
	  
	  $("#RemoveOffset").on('click', function(event) {
	  	if($("#CustomerToList").jqxListBox('getItems').length > 0) {
		  	deleteOffsets($("#CustomerToList").jqxListBox('getItems').map(function(i) {return i['originalItem']['lId'];}),
	  					$("#ProductTree").jqxTree('getCheckedItems').filter(function(i) { return i.parentId == 0; }).map(function(i) {return i.id;}),
	  					$("#ProductTree").jqxTree('getCheckedItems').filter(function(i) { return i.parentId != 0 && 
	  						$("#ProductTree").jqxTree('getItem',i.parentElement).checked != true; 
	  					}).map(function(i) {return i.id;}))
	  	} else{
		  	deleteOffsets([],
	  					[],
	  					$("#ProductTree").jqxTree('getCheckedItems').filter(function(i) { return i.parentId != 0; }).map(function(i) {return i.id;}))
	  	}
	  });	
	  $("#ApplyOffset").on('click', function(event) {
	  	if($("#CustomerToList").jqxListBox('getItems').length > 0)
		  	applyOffsets($("#CustomerToList").jqxListBox('getItems').map(function(i) {return i['originalItem']['lId'];}),
	  					$("#ProductTree").jqxTree('getCheckedItems').filter(function(i) { return i.parentId == 0; }).map(function(i) {return i.id;}),
	  					$("#ProductTree").jqxTree('getCheckedItems').filter(function(i) { return i.parentId != 0 && 
	  						$("#ProductTree").jqxTree('getItem',i.parentElement).checked != true; 
	  					}).map(function(i) {return i.id;}),
		  		$("#OffsetInput").val(),
		  		$('input[name="OffsetType"]:checked').val()
		  		);
		  else
		  	applyOffsets([],
					[],
					$("#ProductTree").jqxTree('getCheckedItems').filter(function(i) {return i.parentId != 0; }).map(function(i) {return i.id}),
		  		$("#OffsetInput").val(),
		  		$('input[name="OffsetType"]:checked').val()
		  		);
	  });	
	  
	  $("#StatusCheckbox").on('change', function(event) {
  		custList.length = 0;
  		tocust.length = 0;
	  	if($("#StatusCheckbox").is(':checked')) {
	  		// so we have changed to status from all
	  		// filter list to status only
	  		// clear to list
	  		// clear selection
	  		origCustList.forEach(function(cust) {
	  			if(!jQuery.isEmptyObject(cust['band']))
	  				custList.push(cust);
	  		});
		  }
		  else {
	  		origCustList.forEach(function(cust) {
  				custList.push(cust);
	  		});
			}	  				
	  	$("#CustomerFromList").jqxListBox('refresh');
	  	$("#CustomerFromList").jqxListBox({selectedIndex: -1});
	  	$("#CustomerToList").jqxListBox('refresh');
			$("#GridTable").hide();
	  });
	  
    $('#ProductTree').on('checkChange', function (event) 
			{
		    var args = event.args;
		    var element = args.element;
		    var checked = args.checked;
		    console.log(event);
		    console.log($("#ProductTree").jqxTree('getCheckedItems'));
		    checkobj = $.grep($("#ProductTree").jqxTree('getItems'),function (item) {
		    	return event.args.element.id == item.id && item.parentId == 0;
		    })
		    if(!jQuery.isEmptyObject(checkobj)) {
		    	console.log('account level change');
		    	accts = $.grep($("#ProductTree").jqxTree('getCheckedItems'), function(item) {
		    		return item.parentId == 0;
		    	}).map(function(item) {
		    		return {'lId': item['id']};
					});		  
					items = $.grep($("#ProductTree").jqxTree('getCheckedItems'), function(item) {
		    		return item.parentId != 0;
		    	}).map(function(item) {
		    		return {'lId': item['id']};
					});		  		
					console.log({'accts': accts, 'items': items});
					showOffsetGrid();
		    }
		  	showOffsetGrid();
				setButtonEnabling();
			}); 
	}
	
	function removeAllCustomers() {
		while(tocust.length > 0) {
  		custList.push(tocust.shift())
  	}
  	custList.sort(custSortFunc);
  	$("#CustomerFromList").jqxListBox('refresh');
  	$("#CustomerToList").jqxListBox('refresh');
  	showOffsetGrid();
		setButtonEnabling();
	}

	function removeAllItems() {
		while(toproductgroups.length > 0) {
  		productgroups.push(toproductgroups.shift())
  	}
  	productgroups.sort(custSortFunc);
  	$("#ItemFromList").jqxListBox('refresh');
  	$("#ItemToList").jqxListBox('refresh');
  	showOffsetGrid();
		setButtonEnabling();
	}

	function initOffsetInput() {
		lastprice = $("#OffsetInput").val();
		$("#OffsetInput").on('input', function(event) {
			if (this.value.match(amountRegex) ||
					this.value.match(rateRegex)) {
				lastprice = this.value;
			}
			else {
				this.value = lastprice;
			}
			setButtonEnabling();
		});
	}
	
	function initDialogOffsetInput() {
		lastprice = $("#DialogOffsetInput").val();
		$("#DialogOffsetInput").on('input', function(event) {
			if (this.value.match(amountRegex) ||
					this.value.match(rateRegex)) {
				lastprice = this.value;
			}
			else {
				this.value = lastprice;
			}
			if($("#DialogOffsetInput").val().length > 0 && parseFloat($("#DialogOffsetInput").val()) > 0)
				$(".ui-dialog-buttonpane button:contains('Apply Offset')").button("enable");
			else
				$(".ui-dialog-buttonpane button:contains('Apply Offset')").button("disable");
		});
	}
	
	function setButtonEnabling() {
	 		if($("#ProductTree").jqxTree('getCheckedItems').length > 0 &&
		 		$("#OffsetInput").val().length >0)
		 			$("#ApplyOffset").prop('disabled', false);
	 	else
	 			$("#ApplyOffset").prop('disabled', true);

	 	if($("#ProductTree").jqxTree('getCheckedItems').length > 0)
	 			$("#RemoveOffset").prop('disabled', false);
	 	else
	 			$("#RemoveOffset").prop('disabled', true);
	}
	
	function showOffsetGrid() {
		// copy any applicable entries from offsets
		//   ie. those that match a customer in the list and match an item in the item list
		// transform the resulting list to an applicable form for grid
		// custname, amt/rate for item1, amt/rate for item2, ...
		// create grid columns
		// destroy existing grid
		// create grid using created columns
		
    var custrenderer = function(row,columnfield,value,defaulthtml,columnproperties) { 
    	console.log('name');
    	console.log(defaulthtml);
    	console.log(value);
    	return defaulthtml.substring(0,defaulthtml.indexOf('>')+1) + value['sName'] + '</div>';
    }
    
		columns = [{ 'text': 'Customer', 'datafield': 'cust', 'width': '20%', 'cellsrenderer': custrenderer, 'sortable': true, 'resizable': true}];
		console.log('columns');
		console.log(columns);

		griddata = [];

		// this xxisxx was a very procedural-like chunk o' code
		// a worthy candidate for reworking into a functional-ly/list-transformy kinda way		
		// i xxamxx was doing two things here - not very functional-ly - getting the grid data and the columns
		// i can extract the grid data functionally as follows
		// the result is a combination of offset data and the custlist
		// griddata = offsets that are for any customer on the customer to list and for a product on the product list merged with the matching customer name from the customer to list
		//   collaped to a single entry for each customer (group by)
		// columns are derived from the resulting grid data - capture all products from the resulting griddata and unique it
		// well after going thru the motions, and finding javascript's functionl-ly/list xformy functions somewhat wanting - i'm going procedural
		console.log('1');
		console.log($.grep(offsets, function(offset) { 
			return $("#CustomerToList").jqxListBox('getItems').length == 0 &&
			$.grep($("#ProductTree").jqxTree('getCheckedItems'),function(item) {
				return item.parentId != 0;
			}).length > 0}).map(function(offset) {
				entry = {'offsetid': offset['offsetid']};
				entry['cust'] = {'sName': 'All', 'custid': -1};
				entry[offset['acctName']] = {'amount': offset['amount'], 'rate': offset['rate'], 'items': offset['items']};
				return entry;
			}));
		console.log('2');
		console.log(group_by($.grep(offsets, function(offset) { 
			return $("#CustomerToList").jqxListBox('getItems').length == 0 &&
			$.grep($("#ProductTree").jqxTree('getCheckedItems'),function(item) {
				return item.parentId != 0;
			}).length > 0}).map(function(offset) {
				entry = {'offsetid': offset['offsetid']};
				entry['cust'] = {'sName': 'All', 'custid': -1};
				entry[offset['acctName']] = {'amount': offset['amount'], 'rate': offset['rate'], 'items': offset['items']};
				return entry;
			}), function(row) { return row['cust']['custid']; }));
		
		griddata = [];
		
		if($("#CustomerToList").jqxListBox('getItems').length == 0) {
			griddata = [].concat(group_by($("#ProductTree").jqxTree('getCheckedItems').filter(function(item) {
				return item.parentId != 0 && $.grep(offsets,function (offset) {
					return $.grep(offset['items'],function(offsetitem) {
						return offsetitem['inventid'] == item.id && offsetitem['isoffset'] == 1;
					}).length > 0; }).length > 0;
				}).map(function(item) {
					return $.grep(offsets,function (offset) {
						return $.grep(offset['items'],function(offsetitem) {
							return offsetitem['inventid'] == item.id && offsetitem['isoffset'] == 1;
					}).length > 0; })[0];
				}).map(function(offset) {
						entry = {'offsetid': offset['offsetid']};
						entry['cust'] = {'sName': 'All', 'custid': -1};
						entry[offset['acctName']] = {'amount': offset['amount'], 'rate': offset['rate'], 'items': offset['items']};
						return entry;
					}), function(row) { return row['cust']['custid']; }).map(function(row) { 
						ret = {'offsetid': row[0]['offsetid'], 'cust': row[0]['cust']}; 
						row.forEach(function(crow) {
							Object.keys(crow).filter(function(key) { return key != 'cust' && key != 'offsetid'; }).forEach(function(key) {
								ret[key] = crow[key];
							});
						});
						return ret;
					}));
					
		} else {
		griddata = group_by($.grep(offsets, function(offset) { 
			return $.grep($("#CustomerToList").jqxListBox('getItems'),function(cust) { return cust['originalItem']['lId'] == offset['custid']; }).length > 0 &&
			$("#ProductTree").jqxTree('getCheckedItems').length > 0}).map(function(offset) {
				entry = {'offsetid': offset['offsetid']};
				entry['cust'] = {'sName': offset['sName'], 'custid': offset['custid']};
				entry[offset['acctName']] = {'amount': offset['amount'], 'rate': offset['rate'], 'items': offset['items']};
				return entry;
			}), function(row) { return row['cust']['custid']; }).map(function(row) { 
				ret = {'offsetid': row[0]['offsetid'], 'cust': row[0]['cust']}; 
				row.forEach(function(crow) {
					Object.keys(crow).filter(function(key) { return key != 'cust' && key != 'offsetid'; }).forEach(function(key) {
						ret[key] = crow[key];
					});
				});
				return ret;
			}).sort(function(a,b) { 
				return a['cust']['sName'].toUpperCase() < b['cust']['sName'].toUpperCase() ? -1 : b['cust']['sName'].toUpperCase() < a['cust']['sName'].toUpperCase() ? 1 : 0; });
		}
		
		columns = [].concat(columns, $.map(griddata.map(function(row) { 
			return Object.keys(row).filter(function(key) { return key != 'cust' && key != 'offsetid'; }); }), function (i) { return i }).reduce(function(p, c) {
        if (p.indexOf(c) < 0) p.push(c);
        return p;
    }, []).map(function(col) {
				return {'text': col, 'datafield': col, 'sortable': false, 'resizable': true};
		}));
    
		if(griddata.length > 0) {
			console.log(columns);
			console.log(griddata);
			showOffsets(griddata,columns);
		}
		else {
			$("#GridTable").hide();
		}
	}
				
	function processItemClick(id) {
		console.log('cell item click');
		console.log(id);
	}
	
	function showOffsets(griddata,itemcolumns) {	
			
		var cellsrenderer = function(row,columnfield,value,defaulthtml,columnproperties) { 
			// if val empty or val[amount] and val[rate] empty
			//   result is blank
			// if val[amount] not null
			//   if val[amount] > 0
			//     colour is red
			// same as above for rate
			// format for amt or pct
			result = '';
			colour = '<span style="color:#000000">';
			if(value != null && (value['amount'] != null || value['rate'] != null)) {
				if(value['amount'] != null) {
					result = Math.abs(parseFloat(value['amount'])).toFixed(4);
					if(parseFloat(value['amount'])>0)
						colour = '<span style="color:#FF0000">';
				}
				else
					result = (Math.abs(parseFloat(value['rate']))*100).toFixed(2) + '%';
					if((parseFloat(value['rate']))>0)
						colour = '<span style="color:#FF0000">';
			}
			if(value['items'] != null && value['items'].length > 0) {
				return '<div style="overflow: hidden; text-overflow: ellipsis; padding-bottom: 2px; text-align: right; margin-right: 2px; margin-left: 4px; margin-top: 4px;">' + 
	  		'<table style="width:100%"><tr><td style="text-align:center">' + colour + result + '</span>' + '</td><td><table style="width:100%;border-collapse:collapse">' + 
	  		(value['items'].map(function(item) {
	  			itemcolour = item['isoffset'] == 1 ? '#C00000' : '#000000'

	  			return '<tr><td style="border: 1px solid #aaa;color:' + itemcolour + '" id="itemcell' + item['id'] + '" onclick="processItemClick(' + item['inventid'] +');">' + item['partName'] + 
	  						'</td><td style="border: 1px solid #aaa;color:' + itemcolour + '" id="itemcell' + item['id'] + '" onclick="processItemClick(' + item['inventid'] +');">' + parseFloat(item['price']).toFixed(4) + 
	  						($("#CustomerToList").jqxListBox('getItems').length > 0 ?
		  						'</td><td style="border: 1px solid #aaa;color:' + itemcolour + '" id="itemcell' + item['id'] + '" onclick="processItemClick(' + item['inventid'] +');">' + 
		  						(value['amount'] !=null ? (parseFloat(item['price']) + parseFloat(value['amount'])).toFixed(4) : (parseFloat(item['price']) * (1 + parseFloat(value['rate']))).toFixed(4))
		  						: "") + 
  							'</td></tr>';}).join('')) + '</table>' + 
					  		'</div>'; 
			}
//	  			return '<tr><td style="border: 1px solid #aaa;color:' + itemcolour + '" id="itemcell' + item['id'] + '" onclick="processItemClick(' + item['inventid'] +');">' + item['partName'] + 
//	  						'</td><td style="border: 1px solid #aaa;color:' + itemcolour + '" id="itemcell' + item['id'] + '" onclick="processItemClick(' + item['inventid'] +');">' + item['price'] + 
//	  						'</td><td style="border: 1px solid #aaa;color:' + itemcolour + '" id="itemcell' + item['id'] + '" onclick="processItemClick(' + item['inventid'] +');">' + 
//	  						(value['amount'] !=null ? (parseFloat(item['price']) + parseFloat(value['amount'])).toFixed(4) : (parseFloat(item['price']) * (1 + parseFloat(value['rate']))).toFixed(4)) + 
//	  						'</td></tr>';}).join('')) + '</table>' + 
//	  		'</div>'; 
//			}
			else
  			return '<div style="overflow: hidden; text-overflow: ellipsis; padding-bottom: 2px; text-align: right; margin-right: 2px; margin-left: 4px; margin-top: 4px;">' + 
	  			colour + result + '</span>' + 
  				'</div>'; 
    };
    
    itemcolumns.forEach(function(column) {
    	if(column['text'] != 'Customer')
	    	column['cellsrenderer'] = cellsrenderer;
    });
    
		datafields = [{name: 'cust'}];
		itemcolumns.forEach(function(col) {
			if(col['datafield'] != 'cust') {
				datafields.push({name: col['datafield']});
			}
		});
		
		console.log(datafields);
		
    var source =
    {
    		datatype: "json",
        localdata: griddata,
        datafields: datafields,
        cache: false
    };
    
		var dataAdapter = new $.jqx.dataAdapter(source);    
		
		$("#OffsetGrid").jqxGrid(
		{
	    source: dataAdapter,
	    width: '100%',
      selectionmode: 'singlecell',
      autoheight: true,
      autorowheight: true,
      sortable: true,
	    columns: itemcolumns,
	    columnsresize: true
    });
    
    $("#OffsetGrid").off('cellselect');
    if($("#CustomerToList").jqxListBox('getItems').length > 0) {
			$("#OffsetGrid").on('cellselect', function (event) {
				console.log(event);
				if(event.args.datafield != 'cust') {
					console.log(event.args.rowindex);
					console.log(event.args.datafield);
					account = $.grep($("#ItemToList").jqxListBox('getItems'), function(item) { return item['originalItem']['sName'].replace("&quot;", '"') == event.args.datafield.replace("&quot;", '"'); })[0];
					console.log(account);
					cust = $("#OffsetGrid").jqxGrid('getrows')[event.args.rowindex]['cust'];
					custid = cust['custid'];
					console.log(custid);
					acctid = account['originalItem']['lId'];
					console.log(acctid);
					offsetval = $("#OffsetGrid").jqxGrid('getcell',event.args.rowindex,event.args.datafield).value;
					if(!jQuery.isEmptyObject(offsetval)) {
						console.log(offsetval);
						console.log(offsetval['amount'] || offsetval['rate']);
						prepareOffsetDialog(cust['sName'],event.args.datafield,custid,acctid,offsetval);
					}
				}
			});
		}
    
    $("#GridTable").show();
		
	}				
	
	function prepareOffsetDialog(cust,account,custid,acctid,defaultval) {
		console.log('prepareOffsetDialog');
		console.log(defaultval);
		$("#DialogProduct").html(account);
		$("#DialogCustomer").html(cust);
		$("#DialogOffsetInput").val('');
		$('input[name="DialogOffsetType"][value="discount"]').prop('checked',true);
		if(defaultval != null && defaultval != 0) {
			val = parseFloat(defaultval['amount'] || defaultval['rate']);
			if(val > 0)
				$('input[name="DialogOffsetType"][value="premium"]').prop('checked',true);
			$("#DialogOffsetInput").val((defaultval['amount'] != null ? Math.abs(parseFloat(defaultval['amount'])).toFixed(4) : ((Math.abs(parseFloat(defaultval['rate']))*100).toFixed(2) + '%')));
		}
		$("#OffsetDialog").dialog( "option", "buttons", 
			{	
		    "Apply Offset": function() {
		    	console.log('apply offset button event');
		    	applyOffsets([custid],[acctid],[],$("#DialogOffsetInput").val(),$('input[name="DialogOffsetType"]:checked').val());
		      $( this ).dialog( "close" );
        },	
        "Remove Offset": function() {
        	console.log('remove offset button event');
        	deleteOffsets([custid],[acctid]);
		      $( this ).dialog( "close" );
        },
	      Cancel: function() {
		      $( this ).dialog( "close" );
  		  }
  		});
		
		$("#OffsetDialog").dialog("open");
	}

	function deleteOffsets(custids,acctids,itemids) {
    $.ajax({
			url: '/offsets/doit.json',
	    type: 'DELETE',
	    data: {custids: custids, 
	    			acctids: acctids,
	    			itemids: itemids},
	    dataType: 'json',
	    crossDomain: false,
	    jsonp: false,
	    async: false,
	    success: function(data) {
	    	console.log('success');
	    	console.log(data);
	    	offsets = data;
	    	removeAllCustomers();
	    	$("#ProductTree").jqxTree('uncheckAll');
	    	$("#OffsetInput").val('');
			},
	    error: function(data) { 
	    	console.log('return from POST');
	    	console.log(data);
	    	prepareAlertDialog('Error detected on save:\n' + data.responseText);
	    }
		});
	}

	function applyOffsets(custids,acctids,itemids,amount,type) {
    $.ajax({
			url: '/offsets.json',
	    type: 'POST',
	    data: {custids: custids, 
	    			acctids: acctids,
	    			itemids: itemids,
	    			amount: amount,
	    			type: type},
	    dataType: 'json',
	    crossDomain: false,
	    jsonp: false,
	    async: false,
	    success: function(data) {
	    	console.log('success');
	    	console.log(data);
	    	offsets = data;
	    	$("#OffsetInput").val('');
	    	$('input[name="OffsetType"][value="discount"]').prop('checked',true);
		  	showOffsetGrid();
		  	setButtonEnabling();
			},
	    error: function(data) { 
	    	console.log('return from POST');
	    	console.log(data);
	    	prepareAlertDialog('Error detected on save:\n' + data.responseText);
	    }
		});
	}
	
	function initializeOffsetDialog() {
    $( "#OffsetDialog" ).dialog({
      autoOpen: false,
      height: 300,
      width: 500,
      modal: true,
      show: "fade",
      title: "Offsets",
      open: function(event, ui) {
				$(".ui-dialog").css("zIndex","10000");
			} ,
      buttons: {
		    "Apply Offset": function() {
        	$( this ).dialog( "close" );
        },	
		    "Remove Offset": function() {
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
		

/*
* jQuery.ajaxQueue - A queue for ajax requests
* 
* (c) 2011 Corey Frang
* Dual licensed under the MIT and GPL licenses.
*
* Requires jQuery 1.5+
*/ 
(function($) {

// jQuery on an empty object, we are going to use this as our Queue
var ajaxQueue = $({});

$.ajaxQueue = function( ajaxOpts ) {
    var jqXHR,
        dfd = $.Deferred(),
        promise = dfd.promise();

    // queue our ajax request
    ajaxQueue.queue( doRequest );

    // add the abort method
    promise.abort = function( statusText ) {

        // proxy abort to the jqXHR if it is active
        if ( jqXHR ) {
            return jqXHR.abort( statusText );
        }

        // if there wasn't already a jqXHR we need to remove from queue
        var queue = ajaxQueue.queue(),
            index = $.inArray( doRequest, queue );

        if ( index > -1 ) {
            queue.splice( index, 1 );
        }

        // and then reject the deferred
        dfd.rejectWith( ajaxOpts.context || ajaxOpts,
            [ promise, statusText, "" ] );

        return promise;
    };

    // run the actual query
    function doRequest( next ) {
        jqXHR = $.ajax( ajaxOpts )
            .done( dfd.resolve )
            .fail( dfd.reject )
            .then( next, next );
    }

    return promise;
};

})(jQuery);