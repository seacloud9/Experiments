
c3dl.Line=function()
{this.coords=new C3DL_FLOAT_ARRAY([0,0,0,0,0,0]);this.colors=new C3DL_FLOAT_ARRAY([0,0,0,0,0,0]);this.visible=true;this.width=1.0;this.setCoordinates=function(beginCoord,endCoord)
{if(beginCoord.length==3&&endCoord.length==3)
{this.coords[0]=beginCoord[0];this.coords[1]=beginCoord[1];this.coords[2]=beginCoord[2];this.coords[3]=endCoord[0];this.coords[4]=endCoord[1];this.coords[5]=endCoord[2];}
else
{c3dl.debug.logWarning("invalid values passed to Line::setCoordinates()");}}
this.setColors=function(beginColor,endColor)
{if(beginColor.length==3&&endColor.length==3)
{this.colors[0]=beginColor[0];this.colors[1]=beginColor[1];this.colors[2]=beginColor[2];this.colors[3]=endColor[0];this.colors[4]=endColor[1];this.colors[5]=endColor[2];}
else
{c3dl.debug.logWarning("invalid values passed to Line::setColors");}}
this.setVisible=function(visible)
{this.visible=visible;}
this.isVisible=function()
{return this.visible;}
this.setWidth=function(width)
{if(width>=1)
{this.width=width;}}
this.getWidth=function()
{return this.width;}
this.getCoordinates=function()
{return new C3DL_FLOAT_ARRAY([this.coords[0],this.coords[1],this.coords[2],this.coords[3],this.coords[4],this.coords[5]]);}
this.getColors=function()
{return new C3DL_FLOAT_ARRAY([this.colors[0],this.colors[1],this.colors[2],this.colors[3],this.colors[4],this.colors[5]]);}
this.getObjectType=function()
{return c3dl.LINE;}}