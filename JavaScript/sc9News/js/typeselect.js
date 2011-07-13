/*****************************************************************
Name:		TypeSelect  
Version:		0.1
URL:		http://www.typeselect.org

Copyright (c) 2009, OrangeCoat Services, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*****************************************************************/
	var typeselect = 
	{	
		browser : {
			'mac'				: navigator.platform.indexOf("Mac") >= 0 ? true : false // used in key detection
		},
		
		/*
		** Storage of font and glyph details 
		*/
		fontproperties : {
			'height' 			: '',
			'overrideSize'		: '',	// mostly for demonstration purposes
			'color'				: '',
			'family'			: '',
			'width'				: '',
			'weight'			: '',
			'style'				: ''
		}, // end fontproperties
		
		selectionVars : {
			'direction' 		: -1,	// direction of the selection increment
			'selection'			: ''
		},
	
		
		/*
		** myTextRender(text, classname, mode)
		**
		** Accepts: 
		** 		- Text string or (preferrably) a single character 
		**		- a CSS classname to set the appropriate style properties
		**      - a string that denotes the rendering mode of operation
		**        OPTIONS:
		**            - "word": used to render a word and not individual characters of a word
		**            - "char": used to render individual characters inside a word
		**            - "firstchar": used to fully render all the ligaments on the left side of the first letter in a word
		**            - "lastchar": used to fully render all the ligaments on the right side of the last letter in a word
		**            - "firstandlastchar": the mode used when a character happens to be the only letter in a word
		**
		** Returns: 
		**		- Rendered PNG of the text 
		**		- Canvas object if toDataURL() is not supported
		**		- zero if fail
		** 
		** How it works: 
		**		- Hijacks the rendering capabilities of Typeface.js and exports a transparent PNG of a glyph / character
		**
		*/
		myTextRender : function(text, el_style) {
		
			var rendered = 0;
			
			/* VERY IMPORTANT -- the following is a silly workaround for Chrome / Safari (see previous comments where it's initialized) */
			spanWrapper = document.getElementById("fake");//document.createElement('span'); 
			
			/* Prime the zombie element for conversion */
			
			if ( spanWrapper.hasChildNodes() ) { spanWrapper.removeChild( spanWrapper.firstChild );	} 					// clear element
			$(spanWrapper).css(el_style);                                                                               // apply style
			spanWrapper.appendChild(document.createTextNode(text));														// insert the text
			
			/* Start employing Typeface.js tools */
			if (_typeface_js) {															// if the code's included
				
				if(spanWrapper.hasChildNodes()) {										// if there is indeed text in the element
					var textNode = spanWrapper.childNodes[0];							// grab that text
					rendered = _typeface_js.getRenderedText(textNode);					// render text to canvas
				}
				
				if(rendered) {
					this.fontproperties.height = rendered.span.childNodes[0].height;		// set the font dimensions for this glyph based on the PNG
					this.fontproperties.width = rendered.span.childNodes[0].width;			// set the font dimensions for this glyph based on the PNG
					var png = rendered.span.childNodes[0].toDataURL();						// convert canvas to PNG (keep rendered variable for dimensions)
					if(typeof png == "undefined") { return rendered.span; }					// if no support for toDataURL(), return rendered canvas object this would be a good place to fix for IE support (beyond my skills at this time)
					else { return {png: png, fontface: rendered.fontface, style: rendered.styleObj} }												// otherwise, return the png
					
				}
				
			} 
			
			// Return zero, if all else fails.
			return rendered;	
			
		}, // end myTextRender


		/*
		** replaceText(element)
		**
		** Accepts: 
		** 		- An element object 
		**
		** Returns: 
		**		- Nothing
		** 
		** How it works: 
		**		- This function replaces each character of text in an element with child and grandchild inline span 
		**		  elements.   The grandchild is a text node (which is selectable), and the child has the rendered 
		**		  glyph PNG from myTextRender set as its CSS background.
		**
		*/
		replaceText : function (el) {
		    /*
		    **  Get all relevent style information about the element
		    */
		    var el_style = {
                "font-family" : $(el).css("font-family"),
                "font-size" : $(el).css("font-size"),
                "font-weight" : $(el).css("font-weight"),
                "font-style" : $(el).css("font-style"),
                "font-stretch" : $(el).css("font-stretch"),
                "text-decoration" : $(el).css("text-decoration"),
                "text-transform" : $(el).css("text-transform"),
                "color" : $(el).css("color"),
                "line-height" : $(el).css("line-height"),
                "letter-spacing" : ($(el).css("letter-spacing") == "normal" ? "0" : $(el).css("letter-spacing")),
                "word-spacing" : ($(el).css("word-spacing") == "normal" ? "0" : $(el).css("word-spacing"))
		    };
            
            
			/*
			**	Prepare the element and gather spacing variables
			*/
			var word_array 	= el.text().replace(/^\s+|\s+$/g,"").split(/\s/); 	// trim every word and then split into array of words
			el.empty();															// empty the containing element
			
			var dummyWord = $("<span></span>");
			el.append(dummyWord);
			dummyWord = el.find("span:last");
			el.empty();
			
			
			var space			= " ";
			var spacePNG 		= typeselect.myTextRender(space, el_style);			
			var face 			= spacePNG.fontface;
			var style 			= spacePNG.style;
			var spaceWidth 		= typeselect.fontproperties.width;
			var letterSpacing 	= parseInt(el_style["letter-spacing"]);		
			var wordSpacing 	= parseInt(el_style["word-spacing"]);
						
			/*
			**	Lopp through all the words
			*/
			for ( var i in word_array ) { 
				
				/*
				**	Prepare the word for rendering
				*/
				var word 	= word_array[i] + " ";								// append a space onto end of words
				if(i == word_array.length-1) { word = word_array[i]; }			// don't append a space to the last word in an element	
							
				var char_array	= word.split('');								// split the word into individual characters
				
				var minusX = 0;													// this is used for glyphs at the front of words that appear outside the boundary of the character
				if(face.glyphs[char_array[0]].x_min < 0) { 						// if the first character of word spills over the left side
				    word = " " + word;											// pad the word with a space so that the character will render
					minusX = spaceWidth;										// account for this added "phantom" space
				}

				/*
				**	Render word and assemble element container
				*/
				var wordObject 	= typeselect.myTextRender(word, el_style);		// generate rendered word
				var wordWidth 	= typeselect.fontproperties.width;
				var wordPNG 	= wordObject.png;								// the PNG image generated by myTextRender()
				
							
				wordSpan = dummyWord.clone().appendTo(el);
				
				wordSpan.css({
					"background"		: "transparent url(" + wordPNG + ") no-repeat 0 50%",
				    "line-height"		: typeselect.fontproperties.height + "px",
				    "height"			: typeselect.fontproperties.height + "px",
					"font-size"			: typeselect.fontproperties.height + "px"   // this line fixes cropping issue on firefox on Mac, but is costly on performance
					// asserting font style, weight, and family here costs a lot of time
				});
								
				/*
				**	Loop through all the characters
				*/	
				for ( var j in char_array ) { 
					//if(char_array[j] == '"' && j == 0) { char_array[j] = "&#8220;"; }
					
					// build the character structure of nested spans
					var character = $("<span></span>").append("<span>" + char_array[j] + "</span>");
				
				
					// get the base widths from typeface of the character from typeface
					var base_width_max 	= Math.max(face.glyphs[char_array[j]].ha, face.glyphs[char_array[j]].x_max);
					var base_width_min 	= Math.min(face.glyphs[char_array[j]].ha, face.glyphs[char_array[j]].x_max);
					var base_width 		= base_width_max;
					
					
					//if(char_array[j] == '"' && char_array[j-1] == ' ') { char_array[j] = '&#8220;'; }
					
					// handle spaces and add word-spacing
					if(char_array[j] == " ") { base_width = _typeface_js.pixelsFromPoints(face, style, spaceWidth, "horizontal") + wordSpacing + 130; } 
					if(style.fontStyle == "italic") {  base_width = base_width_min; } // this is the best I could determine about when to use min versus max
					
					
					// add in the letter-spacing and calculate the width of the character's PNG as if it were rendered in the given typeface
					var PNGWidth = _typeface_js.pixelsFromPoints(face, style, base_width + _typeface_js.pointsFromPixels(face, style, style.letterSpacing, 'horizontal'), 'horizontal'); 
										
					// adjust width if the glyph extends to the left
					var x_min = _typeface_js.pixelsFromPoints(face, style, face.glyphs[char_array[j]].x_min);
					if(j == 0 && face.glyphs[char_array[j]].x_min < 0) {
					   PNGWidth -= x_min;
					}				
					
					wordSpan.append(character);		// add character to the word					
					
					/*
					**	Use letter-spacing to control width of inline elements
					**	adjust the width of the inner span using letter-spacing 
					**	to exactly match the width of the rendered glyph
					*/
					var x_max = _typeface_js.pixelsFromPoints(face, style, face.glyphs[char_array[j]].x_max, "horizontal");	
					var charWidth = parseInt(character.width());								// width of the text character
					var spacingAdjust = PNGWidth - charWidth + minusX + letterSpacing;			// calculate the offset between PNG and HTML text
					minusX = 0;																	// resest the negative offset
										
					if(	j == char_array.length-2 &&			// if second to last character
						char_array[j] != " " &&				// and not a space
						x_max > PNGWidth) { 				// and the right side of the glyph extends beyond edge
						spacingAdjust += x_max - PNGWidth;	// adjust the spacing variable
					}
					
					character.css({"letter-spacing": spacingAdjust + "px"});					// apply all spacing adjustments
								
				}	// end character loop
			}	// end word loop
			
			// Check if this is an anchor tag and apply some hover state
			/* NOTE: This is not the ideal solution.  Better to recurse through the elements and set properties from the actual link */
			if(el.get(0).tagName == "A") {
				var tempEl = $("<span></span>");
				hoverColor = tempEl.addClass('hilite').css('background-color');
				tempEl.remove();
				
				el.find("span").css("cursor", "pointer");
				el.hover(
					function() { 	
						$(this).css({
							"background-color" : hoverColor
						});
					},
					function() {	
						$(this).css({
							"background-color" : "transparent"
						});
					}
					
				);
			} // end link handling
		},	// end function
		


		/*
		**	setHighlights()
		**
		**	This function highlights the appropriate characters in a given text selection.
		**	There are some peculiarities with how different browsers handle selections.  
		**	Specifically, the way that anchor / focus nodes are set.  Anchor nodes are the 
		**	elements at the beginning of a selection (where the mouse press started). 
		**	Focus nodes are at the end of a selection (where the mouse press is released).
		**	
		**	This deserves a lot more explanation.
		**
		**	Todos: 
		**
		**		- This function should/could be adapted to work with Internet Explorer and it's 
		**		  RANGE properties, but since the whole approach currently does not work in IE 
		**		  it was not pursued
		**		- Explore some efficiency optimizations, especially where it loops through EVERY
		**		  SPAN.  If there is a lot of text, that could become terribly expensive.  If we could
		**		  constrain the limits of that loop to everything between the anchor and the focus
		**
		*/
		resetHighlights : function () {
				$(".hilite").each(function(){
					c = $(this).get(0).firstChild;
					if(!typeselect.selectionVars.selection.containsNode(c, false) || c != selectionVars.selection.focusNode) {
						$(this).removeClass('hilite');
					}
				});
		},
		recurseHighlights : function (c, dir) {
			if(typeselect.selectionVars.selection.containsNode(c, false) && c.parentNode.nodeName.toLowerCase() == "span") {
				$(c).parent().parent().addClass("hilite");
				return typeselect.recurseHighlights(typeselect.incrementNode(c, typeselect.selectionVars.direction));
			} else {
				$(c).parent().parent().removeClass("hilite");
				return 0;
			}
		},
		setHighlights : function (mode) {
			
			typeselect.selectionVars.selection = window.getSelection();										// grab the selection range
			var selText = typeselect.selectionVars.selection.toString();									// convert to string
			var a = typeselect.selectionVars.selection.anchorNode;											// anchor node (beginning of selection)
			var f = typeselect.selectionVars.selection.focusNode;											// end of selection

			if(selText != "") { // if there's some text selected
			

				// double-click
				if(mode == "dblclick"){
				
					f = typeselect.incrementNode(f, -1);
					
					if ($.browser.mozilla) {
						if(a.parentNode.parentNode.previousSibling == null ) { // detect if anchor is first character in first letter
							f = typeselect.incrementNode(f, -1);
						}
					}
					
				}
				
				// it's a triple-click on a Mac or PC-Mozilla 		
				if((typeselect.browser.mac || $.browser.mozilla) && a == f) { 				
					a = a.firstChild.firstChild.firstChild.firstChild;			// reset the anchor properly
					f = f.lastChild.lastChild.lastChild.lastChild;				// reset the focus properly	

				} 
							
							
				typeselect.selectionVars.direction = -1;		
				typeselect.recurseHighlights(f);
				typeselect.selectionVars.direction = 1;		
				typeselect.recurseHighlights(f);
				
				// this is for triple-clicks in webkit
				typeselect.selectionVars.direction = 1;
				typeselect.recurseHighlights(a);
				typeselect.selectionVars.direction = -1;
				typeselect.recurseHighlights(a);
				//typeselect.resetHighlights();  // or something like this
				
			} // end if 
			

		}, // end setHighlights
		
		incrementNode : function(node, dir) {
					
					dir = !dir ? 0 : dir;
					
					if(dir <= 0) {
					
						ns = node.parentNode.parentNode.previousSibling;
	
						if(ns == null) return node.parentNode.parentNode.parentNode.previousSibling.lastChild.lastChild.lastChild;
						return node.parentNode.parentNode.previousSibling.lastChild.lastChild;

					} else {
					
						ns = node.parentNode.parentNode.nextSibling;
						
						if(ns == null)  return node.parentNode.parentNode.parentNode.nextSibling.firstChild.firstChild.firstChild;
						return node.parentNode.parentNode.nextSibling.firstChild.firstChild;
					
					}
					

		},
						
		init : function(){
					
		
			
			/* 
			* The magic 
			*/
			// integral work around for webkit.  The createElement does not work as expected in the myTextRender() function
			$("<span id='fake'></span>").css("visibility", "hidden").appendTo("body");
			
			var replacement = $('.select');
			if(_typeface_js.vectorBackend == "vml") {
                _typeface_js.renderDocument();
            } else {
                replacement.each(function() {
                    typeselect.replaceText($(this));
                });
				
				
              
    			$(document)
    			
    			// KEYDOWN / KEYPRESS
    			.keydown(
					/* 
					** Todos:
					**
					** 		- We could also capture CTRL+ and CTRL- strokes and adjust the type size based on that too
					*/					
					// highlight the text when the select all shortcut is pressed (control+a for windows, apple+a for mac)					
					function(e){						
    					var key = e.charCode || e.keyCode || 0;
						if(((key == 97 || key == 65) && e.metaKey) && !e.ctrlKey && typeselect.browser.mac) { replacement.find("span span").addClass("hilite"); return false;}  // Apple+A
						else if (((key == 97 || key == 65) && e.ctrlKey) && !typeselect.browser.mac) { replacement.find("span span").addClass("hilite"); return false;}			// Ctrl+A
						return true;
					}
    			 )
				.bind('tripleclick', function(event) {
					typeselect.setHighlights();
				})				 
    			.dblclick(function(){
					typeselect.setHighlights("dblclick");
				})
				.mousemove( function(e) {  		
					//typeselect.resetHighlights();					
					typeselect.setHighlights();
					
    			})
    			.mousedown(function(){    				
    				$(".hilite").removeClass("hilite"); 				// reset all the selection highlights / hovers when mouse is clicked
    			})
    			
    			// MOUSEUP
    			// when the mouse button is released
    			// Doesn't recognize the mouseup event in Safari, but (oddly) works in Chrome.
    			.mouseup(function(){     
					typeselect.setHighlights();	
									
    			});
				
            } // end if
		} // end init		
	}; // end typeselect

	
	jQuery.event.special.tripleclick = {

		setup: function(data, namespaces) {

			var elem = this, $elem = jQuery(elem);
			$elem.bind('click', jQuery.event.special.tripleclick.handler);

		},

		teardown: function(namespaces) {

			var elem = this, $elem = jQuery(elem);
			$elem.unbind('click', jQuery.event.special.tripleclick.handler);

		},

		handler: function(event) {

			var elem = this, $elem = jQuery(elem), clicks = $elem.data('clicks') || 0;
			clicks += 1;
			if ( clicks === 3 ) {

				clicks = 0;

				// set event type to "tripleclick"
				event.type = "tripleclick";

				// let jQuery handle the triggering of "tripleclick" event handlers
				jQuery.event.handle.apply(this, arguments)
			}
			$elem.data('clicks', clicks);
		}
	};
	
	window.onload = function() {
    if(!window.opera) {
    	typeselect.init();
    }
}