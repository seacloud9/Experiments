
c3dl.Effect=function()
{this.effectTemplate=null;this.instanceParams=[];this.isInitialized=false;this.init=function(effectTemplate)
{var check=true;if(check||effectTemplate instanceof c3dl.EffectTemplate)
{this.effectTemplate=effectTemplate;this.instanceParams=c3dl.copyObj(effectTemplate.getParameters());this.isInitialized=true;}
else
{c3dl.debug.logWarning("Invalid argument passed to c3dl.Effect's init().");}}
this.getEffectTemplate=function()
{return this.effectTemplate;}
this.getParameter=function(paramName)
{var isFound=false;var returnVal=null;for(var i=0,len=this.instanceParams.length;i<len;i++)
{if(this.instanceParams[i].name==paramName)
{isFound=true;returnVal=this.instanceParams[i].value;}}
if(!isFound)
{c3dl.debug.logWarning("Effect getParameter(): '"+paramName+"' does not exist.");}
return returnVal;}
this.setParameter=function(paramName,paramValue)
{if(this.isInitialized==false)
{c3dl.debug.logWarning("Effect must be initialized with init() "+"before setting its parameters.");}
else
{var isFound=false;for(var i=0,len=this.instanceParams.length;!isFound&&i<len;i++)
{if(paramName==this.instanceParams[i].name)
{isFound=true;if(paramValue.constructor==this.instanceParams[i].type)
{this.instanceParams[i].value=paramValue;}
else
{c3dl.debug.logWarning("The value '"+paramValue+"' cannot be assigned "+"to parameter '"+paramName+"' because it is the "+"incorrect type. Check the c3dl.effects documentation "+" for the correct type.");}}}
if(!isFound)
{c3dl.debug.logWarning("Effect setParameter(): '"+paramName+"' does not exist.");}}}}