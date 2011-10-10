(function($){

	$.containers = {
		last: null,
		map: {
			"c1": [null,null,null,"c2","c5","c4",null,null],
			"c2": [null,null,null,"c3","c6","c5","c4","c1"],
			"c3": [null,null,null,null,null,"c6","c5","c2"],
			"c4": [null,"c1","c2","c5",null,null,null,null],
			"c5": ["c1","c2","c3","c6",null,null,null,"c4"],
			"c6": ["c2","c3",null,null,null,null,null,"c5"],
			// "c4": [null,"c1","c2","c5","c8","c7",null,null],
			// "c5": ["c1","c2","c3","c6","c9","c8","c7","c4"],
			// "c6": ["c2","c3",null,null,null,"c9","c8","c5"],
			// "c7": [null,"c4","c5","c8",null,null,null,null],
			// "c8": ["c4","c5","c6","c9",null,null,null,"c7"],
			// "c9": ["c5","c6",null,null,null,null,null,"c8"]
		},
		refresh: function(o) {

			var self = this;
			
			//Prepare right size for content containers
			var wsize = [$(window).width(),$(window).height()];	
			
			//Resize elements with constant ratio
			$(o.items).each(function() {
				$(this).css("width", wsize[0]-300);
				$(this).css("height", (wsize[0]-300)*0.5625);	
			});
			
			//Resize wrapper for proper floating
			$(this).css("width", (wsize[0]-300)*5 + parseInt($(o.items).css("margin-top"))*10);
			
			//Properly center the dir buttons
			$("#g-t").css("left", wsize[0]/2-10);
			$("#g-b").css("left", wsize[0]/2-10);
			$("#g-l").css("top", wsize[1]/2-10);
			$("#g-r").css("top", wsize[1]/2-10);
			
			//Goto last container
			var el = $($.containers.last || o.startsWith)[0];
			var co = $(el).offset({ border: false, scroll: false });
			co.left = co.left - parseInt($(self).css("left"));
			co.top = co.top - parseInt($(self).css("top"));
			
			var offsetX = (($(window).width() - el.offsetWidth) / 2);
			var offsetY = (($(window).height() - el.offsetHeight) / 2);
			
			$("#wrapper").css({ left : -co.left+offsetX, top: -co.top+offsetY });
						
		},
		init: function(o) {
	
			var self = this;
			
			//Prepare right size for content containers
			var wsize = [$(window).width(),$(window).height()];
			
			//Resize elements with constant ratio
			$(o.items).each(function() {
				$(this).css("width", wsize[0]-300);
				$(this).css("height", (wsize[0]-300)*0.5625);	
			});
			
			//Resize wrapper for proper floating
			$(this).css("width", (wsize[0]-300)*5 + parseInt($(o.items).css("margin-top"))*10);
			
			//Properly center the dir buttons
			$("#g-t").css("left", wsize[0]/2-10);
			$("#g-b").css("left", wsize[0]/2-10);
			$("#g-l").css("top", wsize[1]/2-10);
			$("#g-r").css("top", wsize[1]/2-10);
			
			//Make goto pointers clickables
			$("#g-tl").bind("click", function() { $.containers.goto(self,$("#"+$.containers.map[$.containers.last.id][0])); });
			$("#g-t").bind("click", function() { $.containers.goto(self,$("#"+$.containers.map[$.containers.last.id][1])); });
			$("#g-tr").bind("click", function() { $.containers.goto(self,$("#"+$.containers.map[$.containers.last.id][2])); });
			$("#g-r").bind("click", function() { $.containers.goto(self,$("#"+$.containers.map[$.containers.last.id][3])); });
			$("#g-br").bind("click", function() { $.containers.goto(self,$("#"+$.containers.map[$.containers.last.id][4])); });
			$("#g-b").bind("click", function() { $.containers.goto(self,$("#"+$.containers.map[$.containers.last.id][5])); });
			$("#g-bl").bind("click", function() { $.containers.goto(self,$("#"+$.containers.map[$.containers.last.id][6])); });
			$("#g-l").bind("click", function() { $.containers.goto(self,$("#"+$.containers.map[$.containers.last.id][7])); });
			
			//Make goto pointer hovers
			function ht(el,l,t,i) {
				var co = $(el).offset({ border: false });
				$("<div id='p-helper' style='font: 18px Avantgarde, Arial, sans-serif; position: absolute; z-index: 10; color: #003974;'>"+$("#"+$.containers.map[$.containers.last.id][i]).attr("ctitle")+"</div>").css({ left: co.left+l, top: co.top+t }).appendTo("body");					
			}
			
			$("#g-tl").hover(function() { ht(this,20,20,0);	}, function() { $("#p-helper").remove(); });
			$("#g-t").hover(function() { ht(this,-20,30,1);	}, function() { $("#p-helper").remove(); });
			$("#g-tr").hover(function() { ht(this,-80,20,2);	}, function() { $("#p-helper").remove(); });
			$("#g-r").hover(function() { ht(this,-110,15,3);	}, function() { $("#p-helper").remove(); });
			$("#g-br").hover(function() { ht(this,-100,-10,4);	}, function() { $("#p-helper").remove(); });
			$("#g-b").hover(function() { ht(this,-30,-30,5);	}, function() { $("#p-helper").remove(); });
			$("#g-bl").hover(function() { ht(this,20,-10,6);	}, function() { $("#p-helper").remove(); });
			$("#g-l").hover(function() { ht(this,40,15,7);	}, function() { $("#p-helper").remove(); });
			
			//Bind resize listener
			$(window).bind("resize", function(e) {
				$.containers.refresh.apply(self, [o]);
			});
			
			//Goto main page
			if(o.startWith) $.containers.goto(self,$(o.startWith));
			
		},
		goto: function(wrapper,el,force) {
			
			if(!el || !el.length || $(el)[0] == $.containers.last) return;
			
			if($.containers.last) $($.containers.last).animate({ opacity: 0.1 },500);
		
			var el = $(el)[0];
			var co = $(el).offset({ border: false, scroll: false });
			co.left = co.left - parseInt($(wrapper).css("left"));
			co.top = co.top - parseInt($(wrapper).css("top"));
			
			var offsetX = (($(window).width() - el.offsetWidth) / 2);
			var offsetY = (($(window).height() - el.offsetHeight) / 2);
			
			$("#wrapper").animate({ left : -co.left+offsetX, top: -co.top+offsetY }, 1000);
			$(el).animate({ opacity: 1 },500);
			$.containers.last = el;
			
			//Hide arrows that have nowhere to go
			if(!$.containers.map[el.id][0]) $("#g-tl").fadeOut(); else if(!$("#g-tl").is(":visible")) $("#g-tl").fadeIn();
			if(!$.containers.map[el.id][1]) $("#g-t").fadeOut(); else if(!$("#g-t").is(":visible")) $("#g-t").fadeIn();
			if(!$.containers.map[el.id][2]) $("#g-tr").fadeOut(); else if(!$("#g-tr").is(":visible")) $("#g-tr").fadeIn();
			if(!$.containers.map[el.id][3]) $("#g-r").fadeOut(); else if(!$("#g-r").is(":visible")) $("#g-r").fadeIn();
			if(!$.containers.map[el.id][4]) $("#g-br").fadeOut(); else if(!$("#g-br").is(":visible")) $("#g-br").fadeIn();
			if(!$.containers.map[el.id][5]) $("#g-b").fadeOut(); else if(!$("#g-b").is(":visible")) $("#g-b").fadeIn();
			if(!$.containers.map[el.id][6]) $("#g-bl").fadeOut(); else if(!$("#g-bl").is(":visible")) $("#g-bl").fadeIn();
			if(!$.containers.map[el.id][7]) $("#g-l").fadeOut(); else if(!$("#g-l").is(":visible")) $("#g-l").fadeIn();
			
		}
		
	}
	
	$.fn.comic = $.containers.init;	
	
})(jQuery)


$(document).ready(function() {
	
	//Initialize fisheye menue
		$('#dock').Fisheye({
			maxWidth: 50,
			items: 'a',
			itemsText: 'span',
			container: '.dock-container',
			itemWidth: 40,
			proximity: 80,
			alignment : 'left',
			valign: 'bottom',
			halign : 'center'
		});
		
	
	$("#wrapper").comic({
		items: "div.content",
		startWith: "#c2"
	});


});

