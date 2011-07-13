
c3dl.mainCallBacks=[];c3dl.preloadModels=[];c3dl.addProgressBars=function()
{var canvases=document.getElementsByTagName('canvas');for(var i=0,len=canvases.length;i<len;i++)
{var pos=c3dl.getObjectPosition(canvases[i]);var xOffset=pos[0];var yOffset=pos[1];var progressBar=document.createElement("img");progressBar.src=basePath+"/loading.gif";progressBar.style.position='absolute';progressBar.style.left=(canvases[i].width/2)+xOffset-(50);progressBar.style.top=(canvases[i].height/2)+yOffset-(50);progressBar.style.opacity=0.5;progressBar.style.zIndex=100;progressBar.id='c3dl_progress_bar_'+i;document.body.appendChild(progressBar);}}
c3dl.removeProgressBars=function()
{var numProgressBars=document.getElementsByTagName('canvas').length;for(var i=0;i<numProgressBars;i++)
{var progressBarID='c3dl_progress_bar_'+i;var progressBar=document.getElementById(progressBarID);document.body.removeChild(progressBar);}}
c3dl.init=function()
{if(c3dl.preloadModels.length==0)
{for(var i=0,len=c3dl.mainCallBacks.length;i<len;i++)
{var func=c3dl.mainCallBacks[i].f;var tag=c3dl.mainCallBacks[i].t;func(tag);}}
else
{c3dl.addProgressBars();for(var i=0,len=c3dl.preloadModels.length;i<len;i++)
{var preloadColadda=new c3dl.Collada();preloadColadda.init(c3dl.preloadModels[i]);}}}
c3dl.addModel=function(model)
{c3dl.preloadModels.push(model);}
c3dl.addMainCallBack=function(func,tagName)
{var obj={f:func,t:tagName};c3dl.mainCallBacks.push(obj);}
if(document.addEventListener)
{document.addEventListener("DOMContentLoaded",c3dl.init,false);}