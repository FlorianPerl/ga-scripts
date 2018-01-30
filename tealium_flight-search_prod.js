	utag.DB("---------- EXTENSION: Flight Search")
	// set global variables
	var o;
	var dd;
	var rd;
	var sd;
	var ap;
	var cp;
	var tp;
	var cl;
	var rn;
	var rt;
	
	var result_tracker_loaded = 1;
	var search_data_sent = 1;
	var clickToSearch = 0;
	
	// 0. Auto run (automatic search), redirected from in-page search form on another page
	
	
	
	// ----- Auto run mutation observer
	var target_autoRun = document.querySelector('.dot_spinner');
		 
	var observer_autoRun = new MutationObserver(function(mutations) {					

		mutations.forEach(function(mutation) {
			utag.DB( "----> mutation oldValue: " + mutation.oldValue );
			if ( mutation.oldValue == 'display: inline-block;' ) {
				if ( clickToSearch == 0 )  {
					rn = jQuery( '#flightHeaderCount' ).html().trim();		// number of results
					o = jQuery('input#tbFrom').val();												// flight origin
					dd = jQuery('input#tbDepartDate').val();										// departure date
					rd = jQuery('input#tbReturnDate').val();										// return date
					var ddarr = dd.split('/'),														// stay duration
					ddd = ddarr[0], ddm = ddarr[1], ddy = ddarr[2];							
					var rdarr = rd.split('/'),													
					rdd = rdarr[0], rdm = rdarr[1], rdy = rdarr[2];
					ddd = new Date(ddy, ddm, ddd);
					rdd = new Date(rdy, rdm, rdd);	
					sd = (rdd - ddd)/1000/60/60/24;														// end stay duration
					ap = parseInt( jQuery('input#travel-and-cabin-adult-passenger-count').val() );		// adult passengers
					cp = parseInt( jQuery('input#travel-and-cabin-children-passenger-count').val() );	// child passengers
					tp = ap + cp;																		// total passengers
					cl = jQuery('select.cabin_class').val();											// class
					window.rt = 'Redirection';
					utag.link({
						'dtcm_event_type': 'Engagement',
						'ga_eventCategory': 'Flight & Hotel Search',
						'ga_eventAction': 'Search Flight Results',
						'ga_eventLabel': o,
						'flight_action_type': 'Search Flight Results',
						'flight_action': 1,
						'flight_origin': o,
						'flight_departure_date': dd,
						'flight_return_date': rd,
						'flight_stay_duration': sd,
						'flight_adult_passengers': ap,
						'flight_child_passengers': cp,
						'flight_total_passengers': tp,
						'flight_class': cl,
						'flight_results': rn,
						'flight_result_type': rt
					});
					observer_autoRun.disconnect();
					
					// set up Select Flight tracker
					setTimeout( selectFlight, 500 );
				}
			}
		});
	});
	 
	var config_autoRun = { 
		attributes: true, 
		childList: true, 
		characterData: true, 
	//	attributeFilter: ['style'], 
		attributeOldValue: true
	}
	// ----- end Auto run mutation observer
	
	
	// run observer during auto run only
	if ( document.location.search.indexOf("departureDate") > -1 && clickToSearch == 0 ) {
		utag.DB("--------> autoRun condition met");
		observer_autoRun.observe( target_autoRun, config_autoRun );
	}

	// 1. SEARCH (complete)
	
	utag.DB ("--------> search_data_sent base: " + search_data_sent);

	jQuery( 'a#btnSearch, span.glyphicon.glyphicon-search, a.button_done' ).click( function() {			// click on the search button
	utag.DB ("--------> search_data_sent: " + search_data_sent);
		
		if ( search_data_sent == 0 ) {
			search_data_sent = 1;
		} else if ( search_data_sent == 1 ) {
			result_tracker_loaded = 0;
			o = jQuery('input#tbFrom').val();												// flight origin
			dd = jQuery('input#tbDepartDate').val();										// departure date
			rd = jQuery('input#tbReturnDate').val();										// return date
			var ddarr = dd.split('/'),														// stay duration
				ddd = ddarr[0], ddm = ddarr[1], ddy = ddarr[2];							
			var rdarr = rd.split('/'),													
				rdd = rdarr[0], rdm = rdarr[1], rdy = rdarr[2];
			ddd = new Date(ddy, ddm, ddd);
			rdd = new Date(rdy, rdm, rdd);	
			sd = (rdd - ddd)/1000/60/60/24;														// end stay duration
			ap = parseInt( jQuery('input#travel-and-cabin-adult-passenger-count').val() );			// adult passengers
			cp = parseInt( jQuery('input#travel-and-cabin-children-passenger-count').val() );		// child passengers
			tp = ap + cp;																		// total passengers
			cl = jQuery('select.cabin_class').val();													// class

			utag.link({
				'dtcm_event_type': 'Engagement',
				'ga_eventCategory': 'Flight & Hotel Search',
				'ga_eventAction': 'Search Flights',
				'ga_eventLabel': o,
				'flight_action_type': 'Search Flights',
				'flight_action': 1,
				'flight_origin': o,
				'flight_departure_date': dd,
				'flight_return_date': rd,
				'flight_stay_duration': sd,
				'flight_adult_passengers': ap,
				'flight_child_passengers': cp,
				'flight_total_passengers': tp,
				'flight_class': cl
			});
			searchResults();
			search_data_sent = 0;
			clickToSearch = 1;
		}
	})
	
// 2. Zero results/first results

	// set up MutationObserver

	var target_firstResults = document.querySelector('.spinner');
	 
	// create an observer instance
	var observer_firstResults = new MutationObserver(function(mutations) {					
		mutations.forEach(function(mutation) {
			rn = jQuery( '#flightHeaderCount' ).html().trim();
			utag.DB( "----> firstResult mutation: " + mutation.oldValue );
			utag.DB( "----> firstResult results: " + rn );
			o = jQuery('input#tbFrom').val();												// flight origin
			dd = jQuery('input#tbDepartDate').val();										// departure date
			rd = jQuery('input#tbReturnDate').val();										// return date
			var ddarr = dd.split('/'),														// stay duration
			ddd = ddarr[0], ddm = ddarr[1], ddy = ddarr[2];							
			var rdarr = rd.split('/'),													
			rdd = rdarr[0], rdm = rdarr[1], rdy = rdarr[2];
			ddd = new Date(ddy, ddm, ddd);
			rdd = new Date(rdy, rdm, rdd);	
			sd = (rdd - ddd)/1000/60/60/24;														// end stay duration
			ap = parseInt( jQuery('input#travel-and-cabin-adult-passenger-count').val() );		// adult passengers
			cp = parseInt( jQuery('input#travel-and-cabin-children-passenger-count').val() );	// child passengers
			tp = ap + cp;																		// total passengers
			cl = jQuery('select.cabin_class').val();			
			
			if ( mutation.oldValue == 'spinner on' ) {
				if ( rn == "0" ) {
					utag.DB( "----> first results sent: " + rn )
					utag.link({
						'dtcm_event_type': 'Engagement',
						'ga_eventCategory': 'Flight & Hotel Search',
						'ga_eventAction': 'Search Flight Results: 0',
						'ga_eventLabel': o,
						'flight_action_type': 'Search Flight Results',
						'flight_action': 1,
						'flight_origin': o,
						'flight_departure_date': dd,
						'flight_return_date': rd,
						'flight_stay_duration': sd,
						'flight_adult_passengers': ap,
						'flight_child_passengers': cp,
						'flight_total_passengers': tp,
						'flight_class': cl,
						'flight_results': 0,
						'flight_result_type': rt
					})
				}
			}
		});
	});
	 
	// configuration of the observer:
	var config_firstResults = { 
		attributes: true, 
		childList: false, 
		characterData: false, 
		attributeFilter: ['class'], 
		attributeOldValue: true
	}
	 
	// pass in the target node, as well as the observer options
	observer_firstResults.observe( target_firstResults, config_firstResults );

	// end MutationObserver
	
	
// 3. SEARCH RESULTS (event required)

	// set up MutationObserver
	
	function searchResults() {
	// select the target node
	
		var target_results = document.querySelector('.dot_spinner');
		 
		// create an observer instance
		var observer_results = new MutationObserver(function(mutations) {					
			mutations.forEach(function(mutation) {
				if ( mutation.oldValue == 'display: inline-block;' ) {
					if ( result_tracker_loaded == 0 )  {
						result_tracker_loaded = 1;
						rn = jQuery( '#flightHeaderCount' ).html().trim();		// number of results
						window.rt = 'Search';
						
						utag.link({
							'dtcm_event_type': 'Engagement',
							'ga_eventCategory': 'Flight & Hotel Search',
							'ga_eventAction': 'Search Flight Results',
							'ga_eventLabel': o,
							'flight_action_type': 'Search Flight Results',
							'flight_action': 1,
							'flight_origin': o,
							'flight_departure_date': dd,
							'flight_return_date': rd,
							'flight_stay_duration': sd,
							'flight_adult_passengers': ap,
							'flight_child_passengers': cp,
							'flight_total_passengers': tp,
							'flight_class': cl,
							'flight_results': rn,
							'flight_result_type': rt
						});
						
						// set up Select Flight tracker
						setTimeout( selectFlight, 500 );
					}
				}
			});
		});
		 
		// configuration of the observer:
		var config_results = { 
			attributes: true, 
			childList: false, 
			characterData: false, 
			attributeFilter: ['style'], 
			attributeOldValue: true
		}
		 
		// pass in the target node, as well as the observer options
		observer_results.observe( target_results, config_results );
	}
	// end MutationObserver
	


	// 4. SELECT FLIGHT from search result list

	function selectFlight() {
		jQuery( 'a.button_select_flight' ).click( function() {
			
			pr = jQuery(this).parent().find('.mainquote-deals').html();		
			cu = pr.trim().substr( 0, 3 );									// get currency
			pr = pr.trim().substr( 4, ).replace( ',', '' ); 				// get price
						o = jQuery('input#tbFrom').val();					// flight origin
			dd = jQuery('input#tbDepartDate').val();						// departure date
			rd = jQuery('input#tbReturnDate').val();						// return date
			var ddarr = dd.split('/'),										// stay duration
				ddd = ddarr[0], ddm = ddarr[1], ddy = ddarr[2];							
			var rdarr = rd.split('/'),													
				rdd = rdarr[0], rdm = rdarr[1], rdy = rdarr[2];
			ddd = new Date(ddy, ddm, ddd);
			rdd = new Date(rdy, rdm, rdd);	
			sd = (rdd - ddd)/1000/60/60/24;									// end stay duration
			ap = parseInt( jQuery('input#travel-and-cabin-adult-passenger-count').val() );			// adult passengers
			cp = parseInt( jQuery('input#travel-and-cabin-children-passenger-count').val() );		// child passengers
			tp = ap + cp;																			// total passengers
			cl = jQuery('select.cabin_class').val();												// class
			rn = jQuery( '#flightHeaderCount' ).html().trim();				// number of results
			
			utag.link({
				'dtcm_event_type': 'Engagement',
				'ga_eventCategory': 'Flight & Hotel Search',
				'ga_eventAction': 'Select Flight',
				'ga_eventLabel': o,
				'flight_action_type': 'Select Flight',
				'flight_action': 1,
				'flight_origin': o,
				'flight_departure_date': dd,
				'flight_return_date': rd,
				'flight_stay_duration': sd,
				'flight_adult_passengers': ap,
				'flight_child_passengers': cp,
				'flight_total_passengers': tp,
				'flight_class': cl,
				'flight_results': rn,
				'flight_result_type': rt,
				'flight_price': pr,
				'flight_currency': cu
			});
			//setTimeout( selectAgent, 1000 );
			
		})
	}

	/*

// 4. SELECT AGENT

	// interaction tracker within 'Select Agent' window (#flight_info)

	function selectAgent() {
		
		alert("4.1 tracker loaded; result tracker: " + result_tracker_loaded);
		jQuery('li > .vdf_flight_mainquote_table_cell > a.button_select_flight').click( function() {
		//jQuery('#modal-content-agents-popup > .vdf_flight_options > li > .vdf_flight_mainquote_table_cell > a').click(function() {
			
			alert("4.2 data sent; result tracker: " + result_tracker_loaded);
		})

	}
	
	/*
	
	/*
	// 5. LOAD MORE RESULTS
	
	// mutation observer
	var target_more = document.querySelector('ul#flightDetailContainer');
	var observer_more = new MutationObserver(function(mutations) {					
		alert( "5.1 observer loaded" );
		mutations.forEach(function(mutation) {
			alert( 'mutation: ' + mutation );
			selectFlight();
		});
	});
		
	var config_more = { 
		attributes: false, 
		childList: true
	}
	 
	// pass in the target node, as well as the observer options
	observer_more.observe( target_more, config_more );
	
	
	*/



