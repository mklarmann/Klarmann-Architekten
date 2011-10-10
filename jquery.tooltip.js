/**
 *  jQuery Tooltip Plugin
 *@requires jQuery v1.2.6
 *  http://www.socialembedded.com/labs
 *
 *  Copyright (c)  Hernan Amiune (hernan.amiune.com)
 *  Dual licensed under the MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 * 
 *  Version: 1.3
 */
 
(function($){ $.fn.tooltips = function(options){

    var defaults = {
        cssClass: "",     		// CSS class or classes to style the tooltip
		delay : 100,        	// The number of milliseconds before displaying the tooltip
        duration : 1000,   		// The number of milliseconds after moving the mouse cusor before removing the tooltip.
		stickyDuration : 15000, // [Steve Favorito] added a delay before removing a sticky tooltip.
        xOffset : 10,     		// X offset will allow the tooltip to appear offset by x pixels.
        yOffset : 10,     		// Y offset will allow the tooltip to appear offset by y pixels.
		opacity : 0,      		// 0 is completely opaque and 100 completely transparent
		sticky : false,   		// true to make the tooltip sticky
		fadeDuration: 2000 		// [toxi20090112] added fade duration in millis (default = "normal")
	};
  
    var options = $.extend(defaults, options);
	
	
	return this.each(function(index) {
		
		var $this = $(this);
		
		//use just one div for all tooltips
		// [toxi20090112] allow the tooltip div to be already present (would break currently)
		$tooltips=$("#divTooltips");
		if($tooltips.length == 0){
			$tooltip = $('<div id="divTooltips"></div>');			
			$('body').append($tooltip);
			$tooltip.hide();
		}
		
		function displayTooltips(e){
		    //compatibility issue
			e = e ? e : window.event;
			
			//don't hide the tooltip if the mouse is over the element again
			clearTimeout($tooltips.data("hideTimeoutId"));
			
			//set the tooltip class
			$tooltips.removeClass($tooltip.attr("class"));
			$tooltips.css("width","");
			$tooltips.css("height","");
			$tooltips.addClass(options.cssClass);
			$tooltips.css("opacity",1-options.opacity/100);
			$tooltips.css("position","absolute");			
			
			//save the title text and remove it from title to avoid showing the default tooltip
			$tooltip.data("title",$this.attr("title"));
			if(!options.sticky)$this.attr("title","");
			$tooltips.data("alt",$this.attr("alt"));
			if(!options.sticky)$this.attr("alt","");
			
			//set the tooltip content
			$tooltip.html($tooltips.data("title"));
			// [toxi20090112] only use ajax if there actually is an href attrib present
			var href=$this.attr("lang"); // [Steve Favorito] Changed from "href" to "lang" (allows for use on img tags with xhtml validation, without using anchor tags)
			// [Peter] href!="" added
			if(href!=undefined && href!="" && href != "#")
			    $tooltips.html($.ajax({url:$this.attr("lang"),async:false}).responseText); // [Steve Favorito] Changed from "href" to "lang" (allows for use on img tags with xhtml validation, without using anchor tags)
			
			//set the tooltip position
			winw = $(window).width();
			w = $tooltips.width();
			xOffset = options.xOffset;
			
			//right priority
			if(w+xOffset+50 < winw-e.clientX)
			  $tooltips.css("left", $(document).scrollLeft() + e.clientX+xOffset);
			else if(w+xOffset+50 < e.clientX)
			  $tooltips.css("left", $(document).scrollLeft() + e.clientX-(w+xOffset));
			else{
			  //there is more space at left, fit the tooltip there
			  if(e.clientX > winw/2){
				$tooltips.width(e.clientX-50);
				$tooltips.css("left", $(document).scrollLeft() + 25);
			  }
			  //there is more space at right, fit the tooltip there
			  else{
				$tooltips.width((winw-e.clientX)-50);
				$tooltips.css("left", $(document).scrollLeft() + e.clientX+xOffset);
			  }
			}
			
			winh = $(window).height();
			h = $tooltips.height();
			yOffset = options.yOffset;
			//top position priority
			if(h+yOffset + 50 < e.clientY)
			  $tooltips.css("top", $(document).scrollTop() + e.clientY-(h+yOffset));
			else if(h+yOffset + 50 < winh-e.clientY)
			  $tooltips.css("top", $(document).scrollTop() + e.clientY+yOffset);
			else 
			  $tooltips.css("top", $(document).scrollTop() + 10);
			
			//start the timer to show the tooltip
			//[toxi20090112] modified to make use of fadeDuration option
			if(!options.sticky)$tooltips.data("showTimeoutId", setTimeout("$tooltip.fadeIn("+options.fadeDuration+")",options.delay));
			else $tooltips.toggle();
		}
		
		
		if(options.sticky){
			
			
			
			$this.click(function(e){  // [Steve Favorito] Modified
                e.preventDefault();
				displayTooltips(e);
				$this.attr("title",$tooltips.data("title"));
				$this.attr("alt",$tooltips.data("alt"));
				clearTimeout($tooltips.data("showTimeoutId"));
				$tooltips.data("hideTimeoutId", setTimeout("$tooltips.fadeOut("+options.fadeDuration+")",options.stickyDuration));
		    });

			
		}
		else{
		    
			//displays the tooltip
			$this.click( function(e){
				displayTooltips(e);
			});
			
			$this.mouseout(function(e){
				//restore the title
				$this.attr("title",$tooltips.data("title"));
				$this.attr("alt",$tooltips.data("alt"));
				//don't show the tooltip if the mouse left the element before the delay time
				clearTimeout($tooltips.data("showTimeoutId"));
				//start the timer to hide the tooltip
				//[toxi20090112] modified to make use of fadeDuration option
				$tooltips.data("hideTimeoutId", setTimeout("$tooltips.fadeOut("+options.fadeDuration+")",options.duration));
			});
			
			$this.click(function(e){
		        e.preventDefault();
		    });
		}
		
		

	});

}})(jQuery);