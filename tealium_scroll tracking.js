//extension scoped to DOM ready
try{
 //Only run on the home page.  The pathname is everything after the domain and doesn't include query string parameters.
 if(utag_data['dom.pathname'] === '/en'){
   //Global variable to keep track of which events we have already fired.
   window.scrollTracker = {
     "25" : 0,
     "50" : 0,
     "75" : 0,
     "100" : 0
   };
   jQuery(window).on('scroll', function(){ 
    

        //Capture the full length of the page
        var windowHeight = jQuery(document).height();
        //Capture where the top of the page is after scroll
        var currentPosition = jQuery(document).scrollTop();
        //Capture how many pixels can be viewed by the user
        var windowViewingArea = jQuery(window).height();
        //Figure out the bottom of what the user has scrolled to
        var bottomScrollPosition = currentPosition + windowViewingArea;
        //Figure out the rounded percentage of how much was scrolled
        var percentScrolled = parseInt((bottomScrollPosition / windowHeight * 100).toFixed(0));
        utag.DB('User scrolled '+percentScrolled+'%');
        //Store a variable to see if we can post the event
        var fireEvent = 0;
        //Store which quarter the user scrolled to
        var scrollBucket = 0;
        if(percentScrolled >= 25 && percentScrolled < 50){
       if(scrollTracker["25"] === 0){
         fireEvent = 1;
         scrollTracker["25"] = 1;
         scrollBucket = "25";
       }
     }else if(percentScrolled >= 50 && percentScrolled < 75){
       if(scrollTracker["50"] === 0){
         fireEvent = 1;
         scrollTracker["50"] = 1;
         scrollBucket = "50";
       }
     }else if(percentScrolled >= 75 && percentScrolled < 100){
       if(scrollTracker["75"] === 0){
         fireEvent = 1;
         scrollTracker["75"] = 1;
         scrollBucket = "75";
       }
     }else if(percentScrolled === 100){
       if(scrollTracker["100"] === 0){
         fireEvent = 1;
         scrollTracker["100"] = 1;
         scrollBucket = "100";
       }
     }
     if(fireEvent !== 0)
      {
       utag.DB('sending event for '+scrollBucket+' bucket');
       utag.link({
         event_name: 'user_scroll',
         ga_eventCategory: 'Behavior',
            ga_eventAction: 'Scroll',
            ga_eventLabel: scrollBucket
        });
      }
    });
 }
}catch(e){

 utag.DB('Error with performing the scroll tracker: '+e);
}