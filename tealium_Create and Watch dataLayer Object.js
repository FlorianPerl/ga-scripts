// --- Vars
var _validEvents = /^(generic)$/i;

// -- Functions
function checkParameter(parameter) {
  var returnValue = undefined;
  if (parameter != undefined && parameter != '') {
    returnValue = parameter;
  }
  return returnValue;
}

function processPush() {
  // ... this will be called on each .push to the GTM Data Layer
  if (typeof utag == 'object') {
    utag.DB('----------------------------------------');
    utag.DB('-- GTM Event pushed to Data Layer');
    utag.DB('----------------------------------------');
  }
  if (window.dataLayer.length > 0) {
    var gtmEvent = window.dataLayer[window.dataLayer.length - 1];
    if (typeof utag == 'object') {
      utag.DB(gtmEvent);
    }
    var gtmEventName = checkParameter(gtmEvent.event);
    var gtmEventCategory = checkParameter(gtmEvent.eventCategory);
    var gtmEventAction = checkParameter(gtmEvent.eventAction);
    var gtmEventLabel = checkParameter(gtmEvent.eventLabel);
    
    if (gtmEventName.match(_validEvents)) {
      if (typeof utag == 'object') {
	utag.DB('-- GTM Event \'' + gtmEventName + '\' valid for Tealium IQ pickup');
      }
      utag.link({
	'event_name': 'gtmEvent-' + gtmEventName,
	'ga_eventCategory': gtmEventCategory,
	'ga_eventAction': gtmEventAction,
	'ga_eventLabel': gtmEventLabel
      });
    }
    else {
      if (typeof utag == 'object') {
	utag.DB('-- GTM Event \'' + gtmEventName + '\' not valid for Tealium IQ pickup');
      }
    }
  }
}

// --- Run
window.dataLayer = window.dataLayer || [];
window.dataLayer.push = function () {
  Array.prototype.push.apply(this, arguments);
  processPush();
};
