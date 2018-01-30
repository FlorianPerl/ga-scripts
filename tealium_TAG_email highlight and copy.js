try {
	// Script returning highlighted text

	function getSelected() {
		var text = "";
		if (window.getSelection) {
			text = window.getSelection().toString();
		} else if (document.selection && document.selection.type != "Control") {
			text = document.selection.createRange().text;
		}
		return text;
	}

	// Tealium link event on 'copy' of email address

		jQuery('body').on('copy', function() {
			var copiedSelection = getSelected();
console.log(copiedSelection);
			var copiedSelection = new String(copiedSelection);
			var copiedEmail = copiedSelection.indexOf('info@dct.ac.ae');
			if (copiedEmail > -1){
				utag.link({
					'dtcm_event_type': 'intent',
					'ga_eventCategory': 'Contact',
					'ga_eventAction': 'Email',
					'ga_eventLabel': 'Highlight & Copy',
					'ga_eventValue': 10
				});	;
			}
		});

	
} catch (err) {
    utag.DB('ERROR: DoubleClick Engagement');
    utag.DB(err);
}