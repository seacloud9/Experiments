
c3dl.hasCorrectDimensions=function(texture)
{var isCorrect=false;if(texture.width<=1||texture.height<=1)
{c3dl.debug.logWarning('Texture '+texture.src+' is too small.'+'Dimensions are: '+
texture.width+"x"+texture.height+". "+'<br/>Texture was resized.');}
else if((texture.width&(texture.width-1))||(texture.height&(texture.height-1)))
{c3dl.debug.logWarning('Texture '+texture.src+' must have a width and height of a power of 2.'+'Dimensions are: '+texture.width+"x"+texture.height+". "+'Dimensions must be something like: 2x2, 2x4, 4x4, 4x8, 8x8, 16x8, 16x16, etc..'+'<br />Texture has been resized.');}
else
{isCorrect=true;}
return isCorrect;}