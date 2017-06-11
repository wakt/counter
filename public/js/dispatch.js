	var fuelList = [{"name": "LS Diesel", "value": "3", "internalvalue": "962"},{"name": "Dyed Diesel", "value": "4", "internalvalue": "963"},{"name": "Dyed Furnace Oil", "value": "6", "internalvalue": "951"},
									{"name": "Dyed Stove Oil", "value": "8", "internalvalue": "948"},{"name": "Regular Gas", "value": "11", "internalvalue": "940"},{"name": "Dyed Regular Gas", "value": "12", "internalvalue": "941"},
									{"name": "Supreme Gas", "value": "15", "internalvalue": "942"},{"name": "Jet A-1 Fuel", "value": "19", "internalvalue": "953"},{"name": "Dyed Supreme Gas", "value": "23", "internalvalue": "222"}];
    							

	  var columns = [
        { text: 'ordernum', datafield: 'ordernum', width: 0, },
        { text: 'Name', datafield: 'sname', width: ($(window).width() - 90) * 0.28, },
        { text: 'Regn', datafield: 'regioncode', width: ($(window).width() - 90) * 0.10, },
        { text: 'Ship To', datafield: 'shipTo', width: ($(window).width() - 90) * 0.21 },
        { text: 'Product', datafield: 'product', width: ($(window).width() - 90) * 0.18, },
        { text: 'Quantity', datafield: 'quantity', width: ($(window).width() - 90) * 0.08, },
        { text: 'Date', datafield: 'orderdate', width: ($(window).width() - 90) * 0.08, },
        { text: 'Intrvl', datafield: 'interval', width: ($(window).width() - 90) * 0.05, },
	    ];
	    
			var keyPressTime = +new Date();
			var dragStart;
			var currentTrip;
			var itemClickTime = +new Date();
			
			function addDays(dateStart,increment) {
				return new Date(dateStart.getTime() + increment * 1000 * 60 * 60 * 24);
			}

			function addOrderToTrip(trip,order) {
				if(trip['orders'] == null)
					trip['orders'] = [];
				trip['orders'].push(order);
			}
						
			function createOutstandingOrderGrid() {
				console.log('xform');
//				console.log(
//					[].concat.apply([],orderSource.map(function(cust) {
//				    		return cust['orders'].map(function(order) {
//				    			order['product'] = ($.grep(fuelList,function(fuel) { return parseInt(fuel['value']) == parseInt(cust['tankfuel']); } )[0] || {'name': cust['tankfuel']})['name'];
//				    			order['sname'] = cust['sname'];
//				    			order['regioncode'] = cust['regioncode'];
//				    			order['shipTo'] = [cust['shipto1'],cust['shipto2'],cust['shipto3'],cust['shipto4'],cust['shipto5']].join(' ');
//				    			return order;
//				    		});
//								return cust;
//							}) )
//				);
				var source =
				{
					localdata: [].concat.apply([],orderSource.map(function(cust) {
				    		return cust['orders'].map(function(order) {
				    			order['product'] = ($.grep(fuelList,function(fuel) { return parseInt(fuel['value']) == parseInt(cust['tankfuel']); } )[0] || {'name': cust['tankfuel']})['name'];
				    			order['sname'] = cust['sname'];
				    			order['regioncode'] = cust['regioncode'];
				    			order['shipTo'] = [cust['shipto1'],cust['shipto2'],cust['shipto3'],cust['shipto4'],cust['shipto5']].join(' ');
				    			return order;
				    		});
								return cust;
							}) ),
//			    localdata: orderSource.map(function(cust) {
//			    		cust['product'] = ($.grep(fuelList,function(fuel) { return parseInt(fuel['value']) == parseInt(cust['tankfuel']); } )[0] || {'name': cust['tankfuel']})['name'];
//							return cust;
//						}),
			    datatype: "array",
			    id: 'ordernum',
			    deleterow: function (rowid,commit) {
			    	console.log(rowid);
			    	commit(true);
			    },
				};
				var dataAdapter = new $.jqx.dataAdapter(source, {
			    loadComplete: function (data) { },
			    loadError: function (xhr, status, error) { }    
				});
				$("#Orders").jqxGrid(
				{
			    source: dataAdapter,
			    width: $(window).width()-20,
//					height: '100%',
					autoheight: true,
			    sortable: true,
			    columns: columns,
			    rendered: function () {
	          // select all grid cells.
            var gridCells = $('#Orders').find('.jqx-grid-cell');

            // initialize the jqxDragDrop plug-in. Set its drop target to the second Grid.
            gridCells.jqxDragDrop({
//              appendTo: 'schedRow', theme: theme1, dragZIndex: 99999,
              appendTo: 'body', 
				 			opacity: 0.75,
              dragZIndex: 99999,
              dropAction: 'none',
              initFeedback: function (feedback) {
                feedback.height(120);
                feedback.width(450);
              }
            });
            
            // initialize the dragged object.
            gridCells.on('dragStart', function (event) {
              var value = $(this).text();
              var position = $.jqx.position(event.args);
              var cell = $("#Orders").jqxGrid('getcellatposition', position.left, position.top);
              rowdata = $("#Orders").jqxGrid('getrowdata', cell.row);
              $(this).jqxDragDrop({'data': rowdata});
//              $(this).jqxDragDrop({'data': rowdata});
//              var groupslength = $('#grid').jqxGrid('groups').length;
              // update feedback's display value.
              var feedback = $(this).jqxDragDrop('feedback');
              var feedbackContent = $(this).parent().clone();
//              var table = '<table style="border: 3px solid #404040 ; width: 100%; height: 100%;">';
//              var table = '<table style="border: 3px solid #404040 ; width: 100%; height: 100%;background-color: #D8D8D8;">' +
              console.log($(this));
              console.log(typeof $(this));
              console.log(cell);
              console.log(rowdata);
              var table = '<table style="border: 3px solid #404040 ; width: 100%; height: 100%;background-color: #D8D8D8;">' +
//              '<tr><td>Name</td><td>' + rowdata['name'] + '</td></tr>' +
//              '<tr><td>Ship To</td><td>' + (rowdata['shipTo2'] === undefined ? '' : rowdata['shipTo2']) + '</td></tr>' +
              '<tr style="margin:0px;padding:0px;"><td style="margin:0px;padding:0px;">Name</td><td style="margin:0px;padding:0px;">' + rowdata['sname'] + '</td></tr>' +
              '<tr style="margin:0px;padding:0px;"><td style="margin:0px;padding:0px;">Ship To</td><td style="margin:0px;padding:0px;">' + (rowdata['shipTo'] === undefined ? '' : rowdata['shipTo']) + '</td></tr>' +
              '<tr style="margin:0px;padding:0px;"><td style="margin:0px;padding:0px;">Product</td><td style="margin:0px;padding:0px;">' + rowdata['product'] + '</td></tr>' +
              '</table>';
//              $.each(feedbackContent.children(), function (index) {
////                if (index < groupslength)
////                  return true;
//	
////									console.log(index);
////									console.log(columns[index].text);
////									console.log($(this).text());
//									
//									if(index==1 || index==3 || index==4) {
//	                  table += '<tr>';
//	                  table += '<td>';
//	                  table += columns[index].text + ': ';
//	                  table += '</td>';
//	                  table += '<td>';
//	                  table += $(this).text();
//	                  table += '</td>';
//	                  table += '</tr>';                           
//	                }
//              });
//
//              table += '</table>';
              feedback.html(table);
            });

            gridCells.on('dragEnd', function (event) {
			      	// when an order is dropped onto a trip
			      	//   if it's new
			      	//		create a new trip
			      	// 		repaint day
			      	console.log('drag end');
            	
//       				trips.forEach(function (trip) {
//								console.log(trip);
//							});
							console.log($(this).jqxDragDrop('data'));

//              var value = $(this).jqxDragDrop('data');
              var value = $(this).jqxDragDrop('data');
              if(value==null)
              	return;	
              var position = $.jqx.position(event.args);
              console.log(position);
              var pageX = position.left;
              var pageY = position.top;
              
              var found = false;
              
              trips.some (function (day) {
              	console.log('searching day:' + day['tripdate']);
//              	day['trips'].forEach (function (trip) {
              	day['trips'].some (function (trip) {
//		              var button = $("#" + trip['buttonid']);

		              console.log('searching trip:' + trip['buttonid']);
		
									if(isOnWidget(trip['buttonid'],pageX,pageY)) {
										console.log('found');
										moveOutstandingOrderToTrip(value,trip,$("#Orders").jqxGrid('getselectedrowindex'));
//										trip['orders'].push ( { 'ordernum': '00001' } );
										showTripDetails(trip);
										saveTrip(trip);
										found = true;
	                }
	                return found;
              	}); 
              	// if day search failed - check for new
              	buttonid = day['tripdate'] + '-new';
//              	console.log(buttonid);
              	if(isOnWidget(buttonid,pageX,pageY)) {
              		console.log('day');
              		console.log(day);
//              		newtrip = { 'truck': 'unassigned', 'index': day.size, 'orders': [] };
              		newtrip = { 'index': day['trips'].length + 1, 'orders': [], 'buttonid':  day['tripdate'] + '-' +(day['trips'].length + 1)};
              		day['trips'].push(newtrip);
              		console.log(newtrip);
              		console.log(value['orderid']);
              		order = findOutstandingOrder(value['orderid']);
              		order['index'] = 0;
									moveOutstandingOrderToTrip(order,newtrip,$("#Orders").jqxGrid('getselectedrowindex'));
              		console.log(newtrip);
									showTripDetails(newtrip);
                	$("#div" + day['tripdate']).html(tripHtml(day));
//                	console.log(findOutstandingOrder(value['ordernum']));
									enableTripDrag();
									saveTrip(newtrip);
									drawSched();
                	found = true;
                }
                return found;
              });
              return found;
            });

					}
				});
				$("#Orders").jqxGrid('hideColumn','ordernum');
			}

			function createTripOrderGrid(trip) {
				var tripsource =
				{
//			    localdata: trip['orders'],
					// can this not be done at time of acquisition? once?!
			    localdata: trip['orders'].map(function(order) {
			    	if(jQuery.isEmptyObject(order['product']) || order['product'] == 'partName')
				    	order['product'] = ($.grep(fuelList,function(fuel) { return parseInt(fuel['value']) == parseInt(order['fuel']); } )[0] || {'name': ''})['name'];
			    	if(jQuery.isEmptyObject(order['shipTo']))
				    	order['shipTo'] = [order['shipto1'],order['shipto2'],order['shipto3'],order['shipto4'],order['shipto5']].join(' ');
			    	return order;
			    }),
			    datatype: "array"
				};
				var tripdataAdapter = new $.jqx.dataAdapter(tripsource, {
			    loadComplete: function (data) { },
			    loadError: function (xhr, status, error) { }    
				});
				$("#triporders").jqxGrid(
				{
			    source: tripdataAdapter,
			    width: $(window).width() - 90,
					height: '100%',
			    sortable: true,
			    columns: columns
				});
				$("#triporders").jqxGrid('hideColumn','ordernum');

				enableTripOrderDrag(trip,$("#triporders"));
				
//				$("#triporders").on('keyup', function(event) {
//					console.log($("#triporders").jqxGrid('selectedrowindex'));
//					console.log($("#triporders").jqxGrid('getrows').length);
//					if(event.keyCode == 46 && 
//						$("#triporders").jqxGrid('selectedrowindex') > -1 &&
//						$("#triporders").jqxGrid('selectedrowindex') < $("#triporders").jqxGrid('getrows').length && 
//						(+new Date()) > keyPressTime + 500 ) {
//						keyPressTime = +new Date();
//						unassignOrder();
//					}
//	      } ) ;
			}
/*			
			function drawSched() {
//				$("#schedContainer").html("<table id='schedTable' style='height: 100%; width: 100%;'><tr id='schedRow'></tr></table>");
				$("#schedContainer").html("<table id='schedTable' style='width: 100%;'><tr id='schedRow'></tr></table>");
				for(dayIndex=0;dayIndex<7;dayIndex++) {
					$("#schedRow").html($("#schedRow").html() + 
//						"<td><table style='height: 100%; width: 100%;'><tr><td><table class='inner-day' style='height: 100%; width: 100%;'><tr><th class='date-header' style='font-family:  Arial;'>" + 
						"<td style='height:100%;'><table style='width: 100%;height:100%;'><tr><td><table class='inner-day' style='width: 100%;'><tr><th class='date-header' style='font-family:  Arial;'>" + 
						formatdatestring(trips[dayIndex]['tripdate']) + " - " +
						["Su","Mo","Tu","We","Th","Fr","Sa"][new Date(formatdatestring(trips[dayIndex]['tripdate'])).getDay()] +
//						'</th></tr><tr><td style="vertical-align: top;height: 100%"><div style="overflow-y: scroll; height: 100%;" id="div' + 
//						trips[dayIndex]['tripdate'] + '" class="tripDroppable">' + tripHtml(trips[dayIndex]) + "</div></td></tr>" +
						'</th></tr><tr><td style="vertical-align: top">' + tripHtml(trips[dayIndex]) + "</td></tr>" +
						"</td></tr></table></td></tr></table></td>");
				}
				enabletripclicks();
        enableTripDrag();
        setDateRollerDates(trips[0]['tripdate']);
			}
*/			
			function drawSched() {
				console.log('drawsched');
				html = "<table id='schedTable' style='width: 100%;'><tr id='schedHeaderRow' style='width:100%;'>";
				for(dayIndex=0;dayIndex<7;dayIndex++) {
					html += "<td class='inner-day date-header''>" + formatdatestring(trips[dayIndex]['tripdate']) + " - " +
					["Su","Mo","Tu","We","Th","Fr","Sa"][new Date(formatdatestring(trips[dayIndex]['tripdate'])).getDay()] +
					'</td>';
				}
				html += '</tr>';
				
				html += '<tr>';
				for(dayIndex=0;dayIndex<7;dayIndex++) {
				 	tripdate = new Date(formatdatestring(trips[dayIndex]['tripdate']));
				 	buttonid = tripdate.getFullYear() + '' + zeroPad((tripdate.getMonth() + 1),2) + '' + zeroPad(tripdate.getDate(),2) + "-new";
					
				 	html += "<td style='height: 50px;'><button style='background-image: -webkit-linear-gradient(top, #E8E8E8, #BBC8F9); height: 100%; width: 100%;' id='" + 
					 	buttonid + "'>New Trip</button></td>";
				}
				html += '</tr>';
				
				for(tripindex=0;tripindex < Math.max.apply(null,trips.map(function(trip) { return trip['trips'].length; } ));tripindex++) {
					html += '<tr>';
					for(dayIndex=0;dayIndex<7;dayIndex++) {
						html += singleTripHtml(trips[dayIndex],tripindex);
					}
					html += '</tr>';
				}
				
				$("#schedContainer").html(html);
				console.log(html);
				
				enabletripclicks();
        enableTripDrag();
        setDateRollerDates(trips[0]['tripdate']);
			}
			
			function setDateRollerDates(startDate) {
				console.log(startDate);
				console.log(new Date(formatdatestring(startDate)));
				console.log(addDays(new Date(formatdatestring(startDate)),-7));
     		$("#lastWeek").off('click.tripdetails');
     		$("#lastDay").off('click.tripdetails');
     		$("#nextDay").off('click.tripdetails');
     		$("#nextWeek").off('click.tripdetails');
     		$("#lastWeek").on('click.tripdetails', function () { updateDays(addDays(new Date(formatdatestring(startDate)),-7)); } );
     		$("#lastDay").on('click.tripdetails', function () { updateDays(addDays(new Date(formatdatestring(startDate)),-1)); } );
     		$("#nextDay").on('click.tripdetails', function () { updateDays(addDays(new Date(formatdatestring(startDate)),1)); } );
     		$("#nextWeek").on('click.tripdetails', function () { updateDays(addDays(new Date(formatdatestring(startDate)),7)); } );
     	}

			function driverchanged(trip) {
				trip['driver'] = $("#driver").val();
				enabletripclicks();
				saveTrip(trip);
			}

			function enableTripOrderDrag(trip,dragger) {
				getTripOrderRows().jqxDragDrop( {
		 			appendTo: 'body', 
		 			dragZIndex: 99999,
		 			opacity: 0.75,
        	dropAction: 'none',
          initFeedback: function (feedback) {
            feedback.height(120);
            feedback.width(450);
          }
       	});
        getTripOrderRows().bind('dragStart', function (event) {
          var position = $.jqx.position(event.args);
          var cell = $("#triporders").jqxGrid('getcellatposition', position.left, position.top);
          rowdata = $("#triporders").jqxGrid('getrowdata', cell.row);
          $(this).jqxDragDrop('data', rowdata);
//          console.log("start: " + $("#triporders").jqxGrid('getrowdata', cell.row)['ordernum']);

//              var feedback = $(this).jqxDragDrop('feedback');
              var feedback = $(this).jqxDragDrop('feedback');
              var feedbackContent = $(this).parent().clone();
//              var table = '<table>';
              var table = '<table style="border: 3px solid #404040 ; width: 100%; height: 100%;background-color: #D8D8D8;">' +
//              var table = '<table style="border: 3px solid #404040 ; width: 100%; height: 100%;">' +
              '<tr><td>Name</td><td>' + rowdata['sname'] + '</td></tr>' +
              '<tr><td>Ship To</td><td>' + (rowdata['shipTo'] === undefined ? '' : rowdata['shipTo']) + '</td></tr>' +
              '<tr><td>Product</td><td>' + rowdata['product'] + '</td></tr>' +
              '</table>';
//              $.each(feedbackContent.children(), function (index) {
//									if(index==1 || index==3 || index==4) {
//	                  table += '<tr><td>';
//	                  table += columns[index].text + ': ';
//	                  table += '</td><td>';
//	                  table += $(this).text();
//	                  table += '</td></tr>';                           
//	                }
//              });
              console.log($(this));
              console.log(typeof $(this));
              console.log(event.target);
              console.log($("#triporders").jqxGrid('getrowdata', cell.row));

//              table += '</table>';
              feedback.html(table);
         });
        getTripOrderRows().bind('dragEnd', {trip: trip}, function (event) {
//          console.log('drop');
          
//          var value = $(this).jqxDragDrop('data');
//          if(value==null)
//          	return;	
					src = $(this)[0];
          var position = $.jqx.position(event.args);
          var pageX = position.left;
          var pageY = position.top;
          var value = $(this).jqxDragDrop('data');
//          console.log("src: " + value['ordernum']);

          var cell = $("#triporders").jqxGrid('getcellatposition', position.left, position.top);
          targetdata = $("#triporders").jqxGrid('getrowdata', cell.row);
//          console.log(targetdata);
//          console.log("src: " + value['ordernum']);
//          console.log('drop');
//          console.log(pageX);
//          console.log(pageY);
          // if within bounds of grid
          //   for each row in the orders grid
          //     (this is constrained by the number of orders in the trip)
          //     if position y < row y
          //       reorder trip orders
          //     if not found
          //       append
          //     refresh grid data
//          console.log(event.data.trip);
          
 					if(isOnWidget("triporders",pageX,pageY)) {
 						found=false;
	          for(var i=0;i<trip.orders.length;i++) {
	          	targetY = $("#row" + i + "triporders").offset().top;
	          	height = $("#row" + i + "triporders").height();
	          	if(pageY < targetY + height) {
	          		console.log("dropping: " + value['ordernum'] + " in front of " + targetdata['ordernum']);
	          		moveTripOrder(trip,value['ordernum'],targetdata['ordernum']);
	          		found=true;
	          		break;
	          	}
	          }
	          if(found==false)
	          	moveTripOrder(trip,value['ordernum'],trip['orders'].length-1);
	          	
	          saveTrip(trip);
						$("#triporders").jqxGrid('refreshdata');
						enableTripOrderDrag(trip,$(this));
	        }
 					if(isOnWidget("Orders",pageX,pageY)) {
 						unassignOrder(trip,value['ordernum']);
 					}
        });
			}
						
			function unassignOrder(trip,ordernum) {
				console.log("order being unassigned");
				orderSource.push(findTripOrder(trip['orders'],ordernum));
				trip['orders'].splice(findTripOrderIndex(trip['orders'],ordernum),1);
				$("#Orders").jqxGrid('refreshdata');
				$("#triporders").jqxGrid('refreshdata');
				console.log('date:' + findDayByTrip(trip)['tripdate']);
				saveDays([findDayByTrip(trip)]);
			}

			function enabletripclicks() {			
        trips.forEach (function (day) {
        	day['trips'].forEach (function (trip) {
//        		console.log('seeting onclick for:' + "#" + trip['buttonid']);
        		$("#" + trip['buttonid']).click(function () { showTripDetails(trip); } );
        	});
        });
      }
      
			function enableTripDrag() {
				if($(".draggabletrip").length > 0) {
					console.log('declare dragdrop');
			 		$(".draggabletrip").jqxDragDrop({
			 			appendTo: 'body', 
			 			opacity: 0.75,
			 			dragZIndex: 99999,
	          dropAction: 'none',
	          initFeedback: function (feedback) {
	            feedback.height(100);
	            feedback.width(150);
	          }
	 				});
					console.log('drag start binding');
					$(".draggabletrip").bind('dragStart', function (event) {
						console.log('drag start');
	//					console.log($(this).height);
	//					console.log($(this).width);
						trip = findTrip($(this)[0].id);
						day = findDay($(this)[0].id.split('-')[0]);
						dragStart = trip;
	          var feedback = $(this).jqxDragDrop('feedback');
	          feedback.html('<table style="font-size: 12px; border: 3px solid #404040 ; width: 100%; height: 100%;background-color: #D8D8D8;">' +
	//          feedback.html('<table style="font-size: 12px;">' +
	          			'<tr><td>Date: ' + formatdatestring(day['tripdate']) + '</td></tr>' +
	          			'<tr><td>Truck: ' + (!jQuery.isEmptyObject(trip.truck) || trip.truck > 0 ? trip.truck : '') + '</td></tr>' +
	          			'<tr><td>Driver: ' + trip.driver + '</td></tr>' +
	          			'</table>');
					} );			
					console.log('drag end binding');
	        $(".draggabletrip").bind('dragEnd', function (event) {
	          console.log('drop');
	          
	//          var value = $(this).jqxDragDrop('data');
	//          if(value==null)
	//          	return;	
						src = $(this)[0];
	          var position = $.jqx.position(event.args);
	          var pageX = position.left;
	          var pageY = position.top;
	          console.log('drop');
	          console.log(pageX);
	          console.log(pageY);
	
						trips.some (function (day) {
							dayret = false;
	//	          console.log('searching day:' + day['tripdate']);
		          div = $("#div" + day['tripdate']);
	//	          console.log("div dim's");
	//						console.log(div.offset().left);
	//						console.log(div.offset().top);
	//						console.log(div.width());
	//						console.log(div.height());
							
							if(pageX > div.offset().left && pageX < div.offset().left + div.width() &&
								pageY > div.offset().top && pageY < div.offset().top + div.height()) {
								console.log("found day: " + day['tripdate']);
								dayret = true;
	
		  	       	found = day['trips'].some (function (index,el) {
		  	       		console.log('some');
		  	       		console.log(index);
		  	       		console.log(el);
		    		      console.log('searching trip:' + trip['buttonid']);
					        var widget = $("#" + trip['buttonid']);
					
	//								console.log(widget.offset().left);
	//								console.log(widget.offset().top);
					        var targetX = widget.offset().left;
					        var targetY = widget.offset().top;
					        var width = widget.width();
					        var height = widget.height();
	//				        console.log(width);
	//				        console.log(height);
					        
					        if(pageY < targetY + height) {
					        	console.log("found: " + trip['buttonid']);
	//				        	moveTrip(src.id,trip['buttonid']);
					        	moveTrip(dragStart['buttonid'],trip['buttonid']);
					        	return true;
					        }
								});
								
								if(found == false) {
									console.log("before new");
	//								moveTrip(src.id,day['tripdate']);
									moveTrip(dragStart['buttonid'],day['tripdate']);
								}
							}						
							return dayret;
						});
	        });
	      }
			}
										
			function findDay(day) {
				return $.grep(trips, function(tripday) { return tripday.tripdate == day; } )[0];
			}
			
			function findDayByTrip(trip) {
				return $.grep(trips, function(tripday) { return $.grep(tripday['trips'], function(daytrip) { daytrip === trip }) ; } )[0];
			}
						
			function findOutstandingOrder(ordernum) {
				foundorder = null;
				[].concat.apply([],orderSource.map(function(cust) {
		  		return cust['orders'].map(function(order) {
		  			order['product'] = ($.grep(fuelList,function(fuel) { return parseInt(fuel['value']) == parseInt(cust['tankfuel']); } )[0] || {'name': cust['tankfuel']})['name'];
		  			order['sname'] = cust['sname'];
		  			order['regioncode'] = cust['regioncode'];
		  			order['shipTo'] = [cust['shipto1'],cust['shipto2'],cust['shipto3'],cust['shipto4'],cust['shipto5']].join(' ');
		  			return order;
		  		});
				}) ).some(function (order) {
					if(order['orderid'] == ordernum) {
						foundorder = order;
						return true;
					}
					return false;
				});
				return foundorder;
			}
			
			function findTrip(buttonid) {
				console.log(buttonid);
				console.log(buttonid.split('-')[0]);
				console.log(findDay(buttonid.split('-')[0]));
				return $.grep(
					findDay(buttonid.split('-')[0])['trips']
					, function(trip) { 
							console.log(buttonid + ":" + trip.buttonid);
							return trip.buttonid == buttonid; } )[0];
			}
			
			function findTripOrder(orders,ordernum) {
				for(var i=0;i<orders.length;i++) {
					if(orders[i]['ordernum'] == ordernum) {
						return orders[i];
					}
				}
				return -1;
			}
			
			function findTripOrderIndex(orders,ordernum) {
				for(var i=0;i<orders.length;i++) {
					if(orders[i]['ordernum'] == ordernum) {
						return i;
					}
				}
				return -1;
			}
			
			function formatdatestring(datestr) {
				return datestr.substr(0,4) + '/' + datestr.substr(4,2) + '/' + datestr.substr(6,2);
			}
			
//			function future(days) { 
//				anchorDate = addDays(anchorDate,days);
//				updateDays();
//			}

			function getTripOrderRows() {
				return $('div').filter(function () { return this.id.match(/row.*triporders/); });
			}
			
			function isOnWidget(widgetid,pageX,pageY) {
        var widget = $("#" + widgetid);

        var targetX = widget.offset().left;
        var targetY = widget.offset().top;
        var width = widget.width();
        var height = widget.height();

        // check for position
        if (pageX >= targetX && pageX <= targetX + width) {
          if (pageY >= targetY && pageY <= targetY + height) {
          	return true;
          }
        }
        
        return false;
			}
						
			function manifest(trip) {
//			function manifest(event) {
//				trip = event.data.trip;
//      	if((+new Date()) > itemClickTime + 500) {
      		console.log(trip);
      		console.log(trips[0]['trips'][0]);
		      $.ajax({
						url: '/manifests',
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
				    data: { manifest: trip },
				    dataType: 'json',
				    crossDomain: false,
	//			    cache: true,
				    jsonp: true,
				    async: false,
				    success: function(data) { 
	//			    	alert('POST to manifefst completed');
				    	window.open('/manifest.pdf','_blank');
				    }
					});
//				}
//				itemClickTime = +new Date();				
			}

			function moveOutstandingOrderToTrip(order,trip,rowid) {
      	// when an order is dropped onto a trip
      	//	add the order to the trip
      	//		the order is in the feedback data
      	// remove this order from the outstanding list
      	// paint/repaint the detail box
      	trip['orders'].push(order);
      	order['index'] = trip['orders'].length + 1
      	console.log('deleting:' + rowid);
      	$("#Orders").jqxGrid('deleterow',rowid);
//      	$("#Orders").jqxGrid('refresh');
			}
			
			function moveTrip(src,dest) {
				console.log('moving ' + src + ' to ' + dest);
				// if dest is in form of yyyymmdd-i
				//   move to empty day
				// else insert in front of dest
				// remove from src
				// reindex both
				// redraw both
				srcday = findDay(src.split('-')[0]);
				destday = findDay(dest.split('-')[0]);
				srcindex = src.split('-')[1];
				destindex = dest.split('-')[1];
				console.log("src:" + findTrip(src));
				if (destindex === undefined)
					destday['trips'].push(findTrip(src));
				else
					destday['trips'].splice(destindex-1, 0, findTrip(src));
				srcday['trips'].splice(srcindex-1,1);
				reindextrips(destday['trips']);
				reindextrips(srcday['trips']);
       	$("#div" + src.split('-')[0]).html(tripHtml(srcday));
       	$("#div" + dest.split('-')[0]).html(tripHtml(destday));
        enableTripDrag();
        enabletripclicks();
        if(srcday!= destday)
	        saveDays([srcday,destday]);
	      else
	      	saveDays([srcday]);
	      drawSched();
			}

			function moveTripOrder(trip,from,to) {
				indexfrom = findTripOrderIndex(trip['orders'],from);
				indexto = findTripOrderIndex(trip['orders'],to);
				if(indexfrom != indexto) {
					trip['orders'].move(indexfrom,indexto);
				}
			}

//			function past(days) { 
//				anchorDate = addDays(anchorDate,0-days);
//				updateDays();
//			}
			
//			function updateDays() {
			function updateDays(startDate) {
	      $.ajax({
//					url: 'http://yard.fastfuels.com:3001/days/' + anchorDate.getFullYear() + '' + zeroPad((anchorDate.getMonth() + 1),2) + '' + zeroPad(anchorDate.getDate(),2) + '.json',
					url: 'http://yard.fastfuels.com:3001/days/' + startDate.getFullYear() + '' + zeroPad((startDate.getMonth() + 1),2) + '' + zeroPad(startDate.getDate(),2) + '.json',
			    type: 'GET',
			    data: {days: '7', callback: 'processDateChange' },
			    dataType: 'jsonp',
			    crossDomain: true,
			    jsonp: false,
			    async: false
				});
			}
			
			function processDateChange(data) {
				console.log(data);
				trips = data;
				drawSched();
//				showTripDetails(trips[0]['trips'][0]);
			}
			
//			function ramcard(trip) {
			function ramcard() {
	      $.ajax({
					url: '/ramcards',
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
//			    data: { ramcard: trip },
			    dataType: 'json',
			    crossDomain: false,
//			    cache: true,
			    jsonp: true,
			    async: false,
			    success: function(data) { 
			    	alert('Ramcard completed');
			    }
				});
			}
			
			function reindextrips(trips) {
				index=0;
				trips.forEach (function(trip) {
					trip['index']=index;
					index++;
				});
			}
			
			function saveDays(days) {
				console.log("save days");
				days.forEach(function (day) {
					console.log('saving:');
					console.log(day);
		      $.ajax({
//						url: 'http://yard.fastfuels.com:3001/days.json',
						url: 'http://yard.fastfuels.com/days.json',
				    type: 'POST',
				    data: {day: day, callback: 'doneSaveDay' },
				    dataType: 'json',
				    crossDomain: true,
				    jsonp: false,
				    async: false,
				    success: function(data) {
				    	console.log('success');
				    }
					});
				});
			}
			
			function doneSaveDay(data) {
				console.log('save day');
				console.log(data);
			}

			function saveTrip(trip) {
				// called from
				// order assign
				// trip order reorder
				// trip order sort
				// driver change
				// truck change
				console.log("trip save");
				srcday = findDay(trip.buttonid.split('-')[0]);
				saveDays([srcday]);
			}
			
			function showTripDetails(trip) {
				if(trip != undefined) {
					console.log(trip['buttonid']);
					$(".tripbutton").removeClass('selectedbutton');
					$(".tripbutton").addClass('unselectedbutton');
					$("#" + trip['buttonid']).removeClass('unselectedbutton');
					$("#" + trip['buttonid']).addClass('selectedbutton');
					
					currentTrip = trip;
					if(!jQuery.isEmptyObject(trip['truck']) || trip['truck'] > 0)
						$("#truck").val(trip['truck']);
					else
						$("#truck").val('');
					if(trip['driver'] != null && typeof trip['driver'] != 'undefined')
						$("#driver").val(trip['driver']);
					else
						$("#driver").val('');
					// this breaks on new trip because there may be no trip
					$("#datecell").html("Date: " + formatdatestring(trip['buttonid'].split('-')[0]));					
					createTripOrderGrid(trip);
	     		$("#truck").off('change.tripdetails');
	     		$("#driver").off('change.tripdetails');
	//     		$("#manifest").off('click.tripdetails', manifest);
	     		$("#manifest").off('click.tripdetails');
	//     		$("#ramcard").off('click.tripdetails');
	     		console.log(trip);
	     		$("#truck").on('change.tripdetails', function () { truckchanged(trip); } );
	     		$("#driver").on('change.tripdetails', function () { driverchanged(trip); } );
	     		$("#manifest").on('click.tripdetails', function () { manifest(trip); } );
	//     		$("#manifest").on('click.tripdetails', {trip: trip}, manifest);
	//     		$("#ramcard").on('click.tripdetails', function () { ramcard(trip); } );
	     		console.log(trip);
	     	}
			}
			
			function singleTripHtml(day,index) {
			 	tripdate = new Date(formatdatestring(day['tripdate']));
				buttonid = tripdate.getFullYear() + '' + zeroPad((tripdate.getMonth() + 1),2) + '' + zeroPad(tripdate.getDate(),2) + "-" + index;

				ret = '<td>';
				trip = day['trips'][index];				
				if(!jQuery.isEmptyObject(trip)) {
					console.log('creating button:' + buttonid);
			 		ret = "<td style='height: 50px; vertical-align: top;' class='tripDroppable'>" + 
			 			"<button style='height: 100%; width: 100%;' id='" + 
			 			buttonid + "' class='tripbutton draggabletrip unselectedbutton'>Truck: " + ( ( !jQuery.isEmptyObject(trip['truck']) || trip['truck'] > 0 ) ? trip['truck'] : "TBD" ) + "</button>";
			 		trip['buttonid'] = buttonid;
			 	}
			 	ret += '</td>';
			 	return ret;
		 	}
				
			function tripHtml(day) {
//				tableTag = '<table style="display: block; width: 100%;" class="tripDroppable">';
				tableTag = '<table style="display: block; width: 100%;overflow-y: scroll; height: 100%; id="div' + day['tripdate'] + '" class="tripDroppable">';
				ret = tableTag;
				console.log(day['tripdate']);
//			 	tripdate = new Date(day['tripdate'].substr(0,4) + '/' + day['tripdate'].substr(4,2) + '/' + day['tripdate'].substr(6,2));
			 	tripdate = new Date(formatdatestring(day['tripdate']));
				day['trips'].forEach (function(trip) {
					buttonid = tripdate.getFullYear() + '' + zeroPad((tripdate.getMonth() + 1),2) + '' + zeroPad(tripdate.getDate(),2) + "-" + trip['index'];
					
					console.log('creating button:' + buttonid);
					
//					f = function() {showTripDetails(trip); };
//					f = function() { console.log('click'); };
			 		ret = ret + "<tr class='tripDroppable'><td style='height: 50px; vertical-align: top;' class='tripDroppable'>" + 
			 			"<button style='height: 100%; width: 100%;' id='" + 
//			 			"<button style='background-image: -webkit-linear-gradient(top, #E8E8E8, #BBC8F9); height: 100%; width: 100%;' id='" + 
			 			buttonid + "' class='draggabletrip unselectedbutton'>Truck: " + ( !jQuery.isEmptyObject(trip['truck']) || trip['truck'] > 0  ? trip['truck'] : "TBD" ) + "</button></td></tr>";
//			 		$("#" + buttonid).onclick = function () { console.log('click'); };
			 		trip['buttonid'] = buttonid;
//			 		trip['onclick'] = f;
			 	});
			 	buttonid = tripdate.getFullYear() + '' + zeroPad((tripdate.getMonth() + 1),2) + '' + zeroPad(tripdate.getDate(),2) + "-new";
				console.log(tripdate);					
				console.log(tripdate.getDay());
				console.log(zeroPad(tripdate.getDay(),2));
				console.log('creating button:' + buttonid);
					
			 	ret = ret + "<tr><td style='height: 50px;'><button style='background-image: -webkit-linear-gradient(top, #E8E8E8, #BBC8F9); height: 100%; width: 100%;' id='" + 
			 	buttonid + "'>New Trip</button></td></tr>";
//			 	tripids.push(buttonid);
			 	ret = ret + '</table>';
			 	
//			 	console.log(tripids);
			 	
			 	return ret;
			}

			function truckchanged(trip) {
				console.log('changing:' + trip['truck'] + ' to: ' + $("#truck").val());
				trip['truck'] = $("#truck").val();
				$("#" + trip['buttonid']).html("Truck: " + $("#truck").val());
				enabletripclicks();
//        enableTripDrag();
				saveTrip(trip);
			}
			
			function zeroPad(num, places) {
			  var zero = places - num.toString().length + 1;
			  return Array(+(zero > 0 && zero)).join("0") + num;
			}
			