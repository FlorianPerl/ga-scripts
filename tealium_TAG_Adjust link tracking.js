try {
	utag.DB( "----- ADJUST URL SWAP EXTENSION" );
	jQuery( document ).ready( function() {
		if( jQuery("a[href*='itunes.apple.com']") ) {
			iosLink = jQuery("a[href*='itunes.apple.com']")[0];
			iosLink.href = "https://app.adjust.com/mm8zqa?redirect=https%3A%2F%2Fitunes.apple.com%2Fae%2Fapp%2Fdubai-fitness-challenge%2Fid1290311605%3Fmt%3D8";
		};
		if( jQuery("a[href*='play.google.com']") ) {
			androidLink = jQuery("a[href*='play.google.com']")[0];
			androidLink.href = "https://app.adjust.com/mm8zqa?redirect=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.dtcm.dubaichallenge";
		};
	})
} catch( err ) {
	utag.DB( "----- ADJUST URL SWAP ERROR: " + err.message );
}