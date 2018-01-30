// scope: ALl Tags
// execution: Once Before Load Rules


utag.DB("---------- EXTENSION: Google Analytics - Config - Unique interaction functions");

// set utag.ext object
utag.ext = {};

//asign the functions
utag.ext.bakeCookie = function(name, value){
  var cookie = [name, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
  document.cookie = cookie;
};
utag.DB("------------------ bakeCookie ready");

utag.ext.readCookie = function(name) {
		var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
		result && (result = JSON.parse(result[1]));
		return result;
}

utag.ext.addToCookie = function(name, value) {
		var oldValue = utag.ext.readCookie(name);
		if (oldValue) {
			var newValue = oldValue + "," + value;
		} else {
			var newValue = value;
		}
		utag.ext.bakeCookie(name, newValue);
}