try {
    // send events on any engagement click (link click or descendant)
	jQuery("a, a *").on("click", function () {
		
		utag.link({
			'linkClick_class': jQuery(this).attr("class"),
			'linkClick_id': jQuery(this).attr("id"),
			'linkClick_href': jQuery(this).attr("href")
		});

	});

} catch (err) {
    utag.DB('ERROR: Google Analytics - Auxiliary - Link Click Variables');
    utag.DB(err);
}