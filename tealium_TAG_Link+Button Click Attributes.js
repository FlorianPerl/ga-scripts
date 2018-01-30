// scope: All Tags
// Execution: Once After Load Rules 
try {
    // send events on any engagement click (link click or descendant)
	jQuery("button, a").on("click", function () {
		
		utag.link({
			'click_class': jQuery(this).attr("class"),
			'click_id': jQuery(this).attr("id"),
			'click_href': jQuery(this).attr("href"),
			'click_name': jQuery(this).attr("name"),
		        'click_target': jQuery(this).attr("target")
		});

	});

} catch (err) {
    utag.DB('ERROR: Google Analytics - Auxiliary - Link Click Variables');
    utag.DB(err);
}