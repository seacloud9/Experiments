
c3dl.Texture=function()
{var textureImage=null;var isSetup=false;var tCanvas=document.createElement('CANVAS');var tCtx=tCanvas.getContext("2d");var sourcecan=null;this.getTextureID=function()
{return textureImage.ID;}
this.getAbsolutePath=function()
{if(textureImage!=null)
{return textureImage.src;}
else
{c3dl.debug.logError('getTexturePath() error - texture has not been setup.');return false;}}
this.getRelativePath=function()
{return textureImage.relativePath;}
this.getIsSetup=function()
{return isSetup;}
this.setup=function(glCanvas3D,source,sourceCanvas)
{var returnCode=true;if(source!=null&&glCanvas3D!=null&&this.getIsSetup()==false)
{if(sourceCanvas==null){textureImage=new Image();textureImage.src=source;textureImage.relativePath=source;}
else{if(sourceCanvas instanceof HTMLCanvasElement||sourceCanvas instanceof HTMLVideoElement||sourceCanvas instanceof HTMLImageElement){if(sourceCanvas.width<1||sourceCanvas.height<1){tCanvas.width=1024;tCanvas.height=1024;}
else{tCanvas.width=c3dl.roundUpToNextPowerOfTwo(sourceCanvas.width);tCanvas.height=c3dl.roundUpToNextPowerOfTwo(sourceCanvas.height);}
sourcecan=sourceCanvas;textureImage=tCanvas;}
else{textureImage=document.getElementById(sourceCanvas);}
textureImage.relativePath=sourceCanvas;}
textureImage.glCanvas3D=glCanvas3D;textureImage.ID=glCanvas3D.createTexture();glCanvas3D.activeTexture(glCanvas3D.TEXTURE0);textureImage.setupWebGL=function()
{glCanvas3D.bindTexture(glCanvas3D.TEXTURE_2D,this.ID);}
textureImage.resizeImage=function()
{var w=c3dl.roundUpToNextPowerOfTwo(this.width);var h=c3dl.roundUpToNextPowerOfTwo(this.height);var canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;var context=canvas.getContext('2d');context.drawImage(this,0,0,w,h);this.canvas=canvas;}
textureImage.texImage2DWrapper=function(){try
{this.glCanvas3D.texImage2D(glCanvas3D.TEXTURE_2D,0,glCanvas3D.RGBA,glCanvas3D.RGBA,glCanvas3D.UNSIGNED_BYTE,this);}catch(ex){this.glCanvas3D.texImage2D(glCanvas3D.TEXTURE_2D,0,this,false);}}
textureImage.onload=function()
{this.setupWebGL();try
{this.texImage2DWrapper();this.glCanvas3D.generateMipmap(glCanvas3D.TEXTURE_2D);this.isSetup=true;}
catch(ex)
{c3dl.debug.logError('Texture exception: '+ex);}};if(sourceCanvas!=null)
{textureImage.onload();}
if(this.getIsSetup())
{returnCode=true;}}
else
{c3dl.debug.logError('null value was passed into texture load function or texture was already setup');returnCode=false;}
return returnCode;}
this.update=function(){if(sourcecan instanceof HTMLImageElement){if(sourcecan.src&&sourcecan.src!=tCanvas.oldSrc&&sourcecan.complete){tCtx.drawImage(sourcecan,0,0,tCanvas.width,tCanvas.height);textureImage.onload();tCanvas.oldSrc=sourcecan.src;}}
else{tCtx.drawImage(sourcecan,0,0,tCanvas.width,tCanvas.height);textureImage.onload();}}}