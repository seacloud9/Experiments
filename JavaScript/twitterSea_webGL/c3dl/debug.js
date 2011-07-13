
c3dl.debug={BENCHMARK:false,DUMMY:false,DUMP:false,SHARK:false,isVisible:true,numLinesLogged:0,maxLinesToLog:100,isSetUp:false,logDiv:null,isFirebugEnabled:false,getVisible:function()
{return c3dl.debug.isVisible;},setup:function()
{windowWidth=document.body.clientWidth-50;windowHeight=document.body.clientHeight;logWindowWidth=windowWidth;logWindowHeight=200;c3dl.debug.logDiv=document.createElement("div");c3dl.debug.logDiv.style.width=logWindowWidth+"px";c3dl.debug.logDiv.style.position='absolute';c3dl.debug.logDiv.style.top=windowHeight-logWindowHeight;c3dl.debug.logDiv.style.left=5;c3dl.debug.logDiv.style.padding=5;c3dl.debug.logDiv.style.opacity=.8;c3dl.debug.logDiv.style.border='1px solid #000';c3dl.debug.logDiv.id='logdiv';c3dl.debug.logDiv.name='logdiv';document.body.appendChild(c3dl.debug.logDiv);try
{if(console)
{c3dl.debug.isFirebugEnabled=true;}}
catch(err)
{c3dl.debug.isFirebugEnabled=false;}
c3dl.debug.isSetUp=true;},inspect:function(functionName,object)
{var f;f=(object)?object.functionName:window.funcName;object.functionName=function()
{var r=f.call(args);return r;}},setVisible:function(isVisible)
{c3dl.debug.isVisible=isVisible;},doLog:function(str,type,color)
{if(c3dl.debug.getVisible())
{if(c3dl.debug.numLinesLogged==c3dl.debug.maxLinesToLog)
{str="Too many lines to log ("+c3dl.debug.numLinesLogged+"). Logging stopped.";type=c3dl.DEBUG_WARNING;colour="yellow";}
if(c3dl.debug.numLinesLogged>c3dl.debug.maxLinesToLog)
{return;}
if(!c3dl.debug.isSetUp)
{c3dl.debug.setup();}
var currentTime=new Date();var node=document.createElement('p');node.innerHTML=currentTime.getHours()+':'+currentTime.getMinutes()+':'+
currentTime.getSeconds()+' '+type+': '+str;node.style.background=color;c3dl.debug.logDiv.insertBefore(node,c3dl.debug.logDiv.firstChild);if(c3dl.debug.isFirebugEnabled)
{switch(type)
{case c3dl.DEBUG_WARNING:console.warn(str);break;case c3dl.DEBUG_ERROR:console.error(str);break;case c3dl.DEBUG_INFO:console.info(str);break;default:break;}}
c3dl.debug.numLinesLogged++;}},logInfo:function(infoMsg)
{c3dl.debug.doLog(infoMsg,c3dl.DEBUG_INFO,'#CCFFFF');},logWarning:function(warningMsg)
{c3dl.debug.doLog(warningMsg,c3dl.DEBUG_WARNING,'#FFFF00');},logException:function(exceptionMsg)
{c3dl.debug.doLog(exceptionMsg,c3dl.DEBUG_EXCEPTION,'#FF6600');},logError:function(errorMsg)
{c3dl.debug.doLog(errorMsg,c3dl.DEBUG_ERROR,'#FF2222');}}