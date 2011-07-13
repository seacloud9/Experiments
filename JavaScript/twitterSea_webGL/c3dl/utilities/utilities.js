
c3dl.isContextSupported=function(contextVersion)
{var isSupported=true;var dynamicCanvas;var contextString;if(contextVersion!=c3dl.GLES_CONTEXT_20)
{return false;}
try
{if(dynamicCanvas=document.createElement('canvas'))
{dynamicCanvas.getContext("moz-glweb20");}}
catch(err)
{isSupported=false;}
return isSupported;}
c3dl.copyObj=function(object)
{if(object instanceof Array)
{return object.slice();}
else
{var obj=new Object();for(i in object)
{obj[i]=object[i];}
return obj;}}
c3dl.isPathAbsolute=function(path)
{var isAbsolute=false;for(var i=0,len=path.length;i<len&&i<8;i++)
{if(path.charAt(i)==":")
{isAbsolute=true;}}
return isAbsolute;}
c3dl.getPathWithoutFilename=function(path)
{var pathWithoutFilename="";if(path!="")
{var lastForwardSlashPos=path.lastIndexOf('/');var lastBackSlashPos=path.lastIndexOf('\\');var lastSlashPos=lastForwardSlashPos>lastBackSlashPos?lastForwardSlashPos:lastBackSlashPos;for(var i=0;i<lastSlashPos+1;i++)
{pathWithoutFilename+=path[i];}}
return pathWithoutFilename;}
c3dl.getObjectPosition=function(obj)
{var currleft=0;var currtop=0;if(obj.offsetParent)
{do
{currleft+=obj.offsetLeft;currtop+=obj.offsetTop;}while(obj=obj.offsetParent);return[currleft,currtop];}}
c3dl.isValidColor=function(color)
{if(color instanceof Array)
{if(color.length==4)
{for(var i=0;i<4;i++)
{if(isNaN(color[i]))return false;}
return true;}}
else
{return false;}}