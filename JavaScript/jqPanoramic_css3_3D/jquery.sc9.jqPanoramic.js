// This plugin has been created by Brendon Smith aka SeaCloud9 Design
// This plugin requires jQuery UI as well to work properly
// Please follow me on http://twitter.com/seacloud9

;(function($) {
	$.fn.jqPanoramic = function(options){
	var opts = $.extend({}, $.fn.jqPanoramic.defaults, options);
	return this.each(function(){
	var mainPanoramic = '<button id="enablePanoramicTurn">Enable Spin</button><div id="slideCam_Horizontal"></div><div id="slideCam_Vertical"></div><div id="camera"><div id="cube"><div class="sky"><img src="'+ opts.cubeTop +'" /></div><div class="side1"><img src="'+ opts.cubeSide1 +'" /></div><div class="side2"><img src="'+ opts.cubeSide2 +'" /></div><div class="side3"><img src="'+ opts.cubeSide3 +'" /></div><div class="side4"><img src="'+ opts.cubeSide4 +'" /></div><div class="ground"><img src="'+ opts.cubeBottom +'" /></div></div></div>';
	$(this).append(mainPanoramic);
	var oW = opts.dWidth+"px";
	var oH = opts.dHeight+"px";
	var oS = parseInt( opts.dWidth);
	oS = oS/2;
	var oSi = oS;
	oS = oS.toString() + "px";
	$('#cube').css('width', oW);
	$('#cube').css('height',oH);
	$('#cube').css('display', 'block');
	$('.sky').css('-webkit-transform', 'rotateX(90deg) translateZ('+oS+')');
	$('.sky').css('-moz-transform', 'rotateX(90deg) translateZ('+oS+')');
	$('.sky').css('height',oW);
	$('.side1').css('-webkit-transform', 'translateZ('+oS+')');
	$('.side1').css('-moz-transform', 'translateZ('+oS+')');
	$('.side1').css('height',oH);
	$('.side2').css('-webkit-transform', 'rotateY(90deg) translateZ('+oS+')');
	$('.side2').css('-moz-transform', 'rotateY(90deg) translateZ('+oS+')');
	$('.side2').css('height',oH);
	$('.side3').css('-webkit-transform', 'rotateY(180deg) translateZ('+oS+')');
	$('.side3').css('-moz-transform', 'rotateY(180deg) translateZ('+oS+')');
	$('.side3').css('height',oH);
	$('.side4').css('-webkit-transform', 'rotateY(-90deg) translateZ('+oS+')');
	$('.side4').css('-moz-transform', 'rotateY(-90deg) translateZ('+oS+')');
	$('.side4').css('height',oH);
	$('.ground').css('height',oW);	
	$('#cube > div').css('width',oW);
	var stamp = '<div style="position:absolute; bottom:25px; left:60px; color:#fff;-webkit-transform: translateZ(120px);-webkit-transform-style: preserve-3d; ">jQPanoramic by <a href="http://seacloud9.com" target="_blank" style="color:#fff">SeaCloud9</a></div>';
	$(this).append(stamp);
	
		$("#slideCam_Horizontal").slider({
			orientation: "horizontal",
			range: "min",
			min: 0,
			max: 360,
			value: 0,
			slide: function(event, ui) {
				var cube = document.getElementById('cube');
				cube.style.webkitTransform = "rotateY("+ui.value+"deg)";
			}
		});
		
		
		$("#slideCam_Vertical").slider({
			orientation: "vertical",
			range: "min",
			min: 0,
			max: 1000,
			value: 300,
			slide: function(event, ui) {
				var camera = document.getElementById('camera');
				camera.style.webkitTransform = "perspective("+ui.value+")";
			}
		});
		
		$("#enablePanoramicTurn").button();
		$('#enablePanoramicTurn').toggle(function() {
 		 var cube = document.getElementById('cube');
		 cube.style.webkitAnimation = "panoramicTurn 45s infinite linear"
		 $("#slideCam_Vertical").css('display', 'none');
		 $("#slideCam_Horizontal").css('display', 'none');
		}, function() {
  		 var cube = document.getElementById('cube');
		 cube.style.webkitAnimation = "";
		 $("#slideCam_Vertical").css('display', 'block');
		 $("#slideCam_Horizontal").css('display', 'block');
		});
		
	});
	};
	$.fn.jqPanoramic.defaults ={
		dHeight:"640",
		dWidth:"1600",
		cubeSide1:"http://i-create.org/JavaScript/jqPanoramic/cubicSide1.jpg",
		cubeSide2:"http://i-create.org/JavaScript/jqPanoramic/cubicSide2.jpg",
		cubeSide3:"http://i-create.org/JavaScript/jqPanoramic/cubicSide3.jpg",
		cubeSide4:"http://i-create.org/JavaScript/jqPanoramic/cubicSide4.jpg",
		cubeTop:"http://i-create.org/JavaScript/jqPanoramic/top.jpg",
		cubeBottom:"http://i-create.org/JavaScript/jqPanoramic/bottom.jpg"
	};
})(jQuery);