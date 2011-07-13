
c3dl.EffectTemplate=function()
{this.vertexShaders=[];this.fragmentShaders=[];this.isInitialized=false;this.params=[];this.renderingCB=null;this.programObjects=[];this.init=function()
{var rc=false;if(this.isInitialized==false)
{if(this.renderingCB&&this.vertexShaders.length>0&&this.fragmentShaders.length>0)
{this.isInitialized=true;rc=true;}}
return rc;}
this.addFragmentShader=function(fragmentShader)
{if(this.isInitialized==false)
{if(fragmentShader&&typeof(fragmentShader)=="string")
{this.fragmentShaders.push(fragmentShader);}
else
{c3dl.debug.logWarning("Invalid argument passed to Effect's addFragmentShader().");}}}
this.addParameter=function(paramName,paramType,paramDefaultValue)
{if(this.isInitialized==false)
{if(paramName&&typeof(paramName)=="string")
{var val;if(paramType==Array)
{val=c3dl.copyObj(paramDefaultValue);}
else
{val=paramDefaultValue;}
this.params.push({name:paramName,type:paramType,value:val});}
else
{c3dl.debug.logWarning("Invalid argument(s) passed to Effect's addParameter().");}}
else
{c3dl.debug.logWarning("Effect addParameter(): cannot be called once an effect has been initialized.");}}
this.addVertexShader=function(vertexShader)
{if(this.isInitialized==false)
{if(vertexShader&&typeof(vertexShader)=="string")
{this.vertexShaders.push(vertexShader);}
else
{c3dl.debug.logWarning("Invalid argument passed to Effect's addVertexShader().");}}}
this.getVertexShaders=function()
{return this.vertexShaders;}
this.getParameters=function()
{var ret=[];for(var i=0,len=this.params.length;i<len;i++)
{var val;if(typeof this.params[i].value=="Array")
{val=c3dl.copyObj(this.params[i].value);}
else
{val=this.params[i].value;}
ret.push({name:this.params[i].name,type:this.params[i].type,value:val});}
return ret;}
this.getFragmentShaders=function()
{return this.fragmentShaders;}
this.getRenderingCallback=function()
{return this.renderingCB;}
this.setRenderingCallback=function(func)
{if(this.isInitialized==false)
{if(func instanceof Function)
{this.renderingCB=func;}
else
{c3dl.debug.logWarning("Invalid argument passed to Effect's setRenderingCB().");}}}
this.getProgramID=function(rendererID)
{var programID=-1;var found=false;for(var i=0,len=this.programObjects.length;found==false&&i<len;i++)
{if(found===false)
{if(rendererID==this.programObjects[i].getRendererID())
{found=true;programID=this.programObjects[i].getProgramID();}}}
return programID;}
this.addProgramObject=function(programObject)
{this.programObjects.push(programObject);}
this.toString=function(delimiter)
{if(!delimiter&&typeof(delimiter)!="string")
{delimiter=",";}
return"Initialized = "+this.isInitialized+delimiter+"Vertex Shaders = "+
this.vertexShaders+delimiter+"Fragment Shaders = "+this.fragmentShaders+
delimiter+"Rendering Callback = "+this.renderingCB+delimiter+"Parameters = "+
this.parameters;}}