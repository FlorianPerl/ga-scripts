<script>
  
//on page load OR event "articleScrollLoad"

	//scroll tracking function
	function scrollTracking(s, c){
		if (c == "100%") {
			readType = "";
			if (wordsPerSecond < 5) {
				readType = "read";
			} else if (wordsPerSecond >= 5 && wordsPerSecond < 40) {
				readType = "scanned";
			} else if (wordsPerSecond >= 40 ) {
				readType = "scrolled through"
			} ;
			dataLayer.push({
				'event':'scrollTracking',
				'articleTitle': s,
				'scrollPercentage': c,
				'readType': readType,
				'readTime': timeDiff,
				'wordsPerSecond': wordsPerSecond
			});
			console.log('=== readType: ' + readType);
			dataLayer.push({
				'event':'datalayer flush',
				'readType': undefined,
				'readTime': undefined,
				'wordsPerSecond': undefined
			})
		} else {
			dataLayer.push({
				'event':'scrollTracking',
				'articleTitle': s,
				'scrollPercentage': c
			});	
		};
	};
	
	//variable used to stop checking current article height
	var articleEndReached = false;
	
	//identify current article and offset
	articles = jQuery( 'article.node' );
	l = articles.length;
	currentArticle = articles[l-1];
	articleOffset = jQuery( currentArticle ).offset().top;
	
	//function checking article height for changes
	function checkArticleHeight() {
		articleHeight = jQuery( currentArticle ).height();

		//calculating current article reading progress thresholds [px]
		progress_0 = articleOffset + 100;
		progress_25 = articleOffset + (articleHeight * 0.25);
		progress_50 = articleOffset + (articleHeight * 0.50);
		progress_75 = articleOffset + (articleHeight * 0.75);
		progress_100 = articleOffset + (articleHeight * 1);
	
		if ( articleEndReached ){
			window.clearInterval( refreshArticleHeight );
		}
	}
	
	var refreshArticleHeight = window.setInterval( checkArticleHeight, 2000 );
	
	//current article title
	ogTitle = jQuery('meta[property="og:title"]').attr("content");
	articleTitle = ogTitle.substr( 0, ogTitle.length - 9 );
	
	//word count
	wordCount = {{dL - wordsCount}};
	
	
	//array for storing progress thresholds already sent	
	if (typeof wasVisible == "undefined") {
		wasVisible = [];
	}
	
	//initiate global variables for storing times
	var timeStart, timeEnd, timeDiff, oldArticleTitle;
	
	//initiate dictionary for storing start time
	if (typeof timeStartDict == "undefined") {
		timeStartDict = [];
	};
	
	//current article ID
	articleId = currentArticle.id;

	jQuery(window).scroll(function() {
		setTimeout(function() {
			//position of top of window
			
			visible = Math.round( jQuery( window ).scrollTop() + jQuery( window ).height() - 100 );
			if (visible > (articleOffset + 100) && jQuery.inArray(articleTitle + "0", wasVisible) == -1) {

				timeStart = new Date( jQuery.now() );
				//add timeStart to dictionary
				timeStartDict[articleTitle] = timeStart;
				console.log("----> " + articleTitle + ": progress 0%");

				scrollTracking( articleTitle, "0%" );
				wasVisible.push(articleTitle + "0");
			};
			if (visible > (articleOffset + (articleHeight * 0.25)) && jQuery.inArray(articleTitle + "25", wasVisible) == -1) {
				console.log("----> " + articleTitle + ": progress 25%");
				scrollTracking( articleTitle, "25%" );
				wasVisible.push(articleTitle + "25");
			};
			if (visible > (articleOffset + (articleHeight * 0.50)) && jQuery.inArray(articleTitle + "50", wasVisible) == -1) {
				console.log("----> " + articleTitle + ": progress 50%");
				scrollTracking( articleTitle, "50%" );
				wasVisible.push( articleTitle + "50" );
			};
			if (visible > (articleOffset + (articleHeight * 0.75)) && jQuery.inArray(articleTitle + "75", wasVisible) == -1) {
				console.log("----> " + articleTitle + ": progress 75%");
				scrollTracking( articleTitle, "75%" );
				wasVisible.push(articleTitle + "75");
			};
			if (visible > (articleOffset + articleHeight - 100) && jQuery.inArray(articleTitle + "100", wasVisible) == -1) {
				timeEnd = new Date( jQuery.now() );
				//get timeStart from dictionary
				timeDiff = Math.round( (timeEnd - timeStartDict[articleTitle])/1000 );
				wordsPerSecond = Math.round( wordCount / timeDiff );
				console.log("----> " + articleTitle + ": progress 100%; time: " + timeDiff + " s");
				scrollTracking( articleTitle, "100%" );
				wasVisible.push(articleTitle + "100");
				articleEndReached = true;
				
			};
	
		}, 50);
		
	});
  
</script>