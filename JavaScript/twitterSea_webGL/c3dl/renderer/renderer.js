
c3dl.Renderer=function()
{this.version=0.0;this.versionString="Renderer interface.";this.fillMode=c3dl.FILL;this.lightingOn=true;this.contextWidth=0;this.contextHeight=0;this.getLighting=function()
{return this.lightingOn;}
this.getMaxLineWidth=function()
{}
this.getVersion=function()
{return this.version;}
this.getVersionString=function()
{return this.versionString;}
this.getFillMode=function()
{return this.fillMode;}
this.setClearColor=function(clearColor)
{}
this.setFillMode=function(mode)
{if(mode==c3dl.FILL||mode==c3dl.WIRE_FRAME)
{this.fillMode=mode;}
else
{c3dl.debug.logWarning('Invalid value "'+mode+'" passed to setFillMode()');}}
this.setLighting=function(isOn)
{this.lightingOn=isOn;}
this.getContextWidth=function()
{return this.contextWidth;}
this.getContextHeight=function()
{return this.contextHeight;}}