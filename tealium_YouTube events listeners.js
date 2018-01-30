utag.DB('-- Extension: YouTube - Event Listeners');

function mileStoneCheck(player) {
    try {
        var duration = player.getDuration();
        var percComplete = (player.getCurrentTime() / player.getDuration()) * 100;
        var ms_len = window.mileStones.length;
        if (ms_len > 0) {
            utag.DB('ms_len > 0');
            var next_ms = window.mileStones[0];
            if (next_ms <= percComplete) {
                console.log('next_ms: ' + next_ms);
                window.mileStones.shift();
                utag.DB("mileStoneCheck", next_ms, percComplete, player.getCurrentTime());
                console.log("mileStoneCheck", next_ms, percComplete, player.getCurrentTime())
                utag.link({
                    ev_cat: "Video",
                    event: next_ms + "% Played",
                });

            }
        }
    } catch (error) {
        utag.DB("-- ERROR: YouTube - Event Listeners - mileStoneCheck(player)");
        utag.DB(error);
    }

}

try {
    // -----------------------------------------------
    // Add IDs to found YouTube video containers
    // -----------------------------------------------
    utag.DB('-- Extension: YouTube - Event Listeners - Add IDs to embedded YouTube iframes');
    jQuery('iframe').each(function () {
        var iframeSrc = jQuery(this).attr('src');
        var kwframeid = jQuery(this).attr('kwframeid');
        if (iframeSrc != undefined && iframeSrc.indexOf('//www.youtube.com/embed/') > -1 && iframeSrc.indexOf("&enablejsapi=1") > -1 && kwframeid != undefined) {
            jQuery(this).attr('id', 'video_youtube_' + kwframeid);
        }
    });

    // -----------------------------------------------
    // Add event listeners to found YouTube video containers
    // -----------------------------------------------
    utag.DB('-- Extension: YouTube - Event Listeners - Add event listeners to embedded YouTube iframes');

    window.players = {};
    window.videos = [];
    window.playerCheckInterval;
    window.mileStones = [1, 2, 25, 50, 75];

    window.videoplayer;
    window.onYouTubeIframeAPIReady = function () {
        utag.DB('YouTube: onYouTubeIframeAPIReady');
        jQuery('iframe[id^="video_youtube_"],iframe[id="player"],( "#telium_data" ).data( "videoid" )').each(function () {
            var id = jQuery(this).attr('id');
            utag.DB('YouTube: Video ID - ' + id);
            //window.players[id] = new YT.Player(id, {
            window.videoplayer = new YT.Player(id, {
                events: {
                    'onReady': window.onPlayerReady,
                    'onStateChange': window.onPlayerStateChange
                }
            });
        })
    }

    window.onPlayerReady = function (event) {
        videos.push(event.target.getVideoUrl());
        utag_data.video_url = videos.join(',');
    }

    window.onPlayerStateChange = function (event) {
        var videoplayer = event.target;
        var video_data = videoplayer["getVideoData"](),
            label = video_data.title;
        //This will catch when the player is played
        if (event.data == YT.PlayerState.PLAYING) {
            utag.DB('YouTube: Video PLAYING - ' + label);
            window.playerCheckInterval = window.setInterval(mileStoneCheck(videoplayer), 100);
            var c = videoplayer.getVideoUrl();

            utag.link({
                video_play_url: c,
                ga_eventCategory: "Videos",
                ga_eventAction: "Play",
                ga_eventLabel: label
            });
        } else if (event.data == YT.PlayerState.PAUSED) {
            //This will catch when the player is paused
            utag.DB('YouTube: Video PAUSED - ' + label);
            window.clearInterval(window.playerCheckInterval);
            utag.link({
                video_play_url: c,
                ga_eventCategory: "Videos",
                ga_eventAction: "Pause",
                ga_eventLabel: label
            });
        } else if (event.data == YT.PlayerState.ENDED) {
            //This will catch when the player has completed
            utag.DB('YouTube: Video ENDED - ' + label);
            window.clearInterval(window.playerCheckInterval);
            var c = videoplayer.getVideoUrl();
            utag.link({
                video_play_url: c,
                ga_eventCategory: "Videos",
                ga_eventAction: "100% Video Played",
                ga_eventLabel: label
            });
        }
    }
} catch (error) {
    utag.DB("-- ERROR: YouTube - Event Listeners");
    utag.DB(error);
}