
c3dl.Point=function()
{this.color=c3dl.makeVector(0,0,0);this.position=c3dl.makeVector(0,0,0);this.visible=true;this.name="";this.getName=function()
{return this.name;}
this.setName=function(name)
{this.name=name;}
this.getPosition=function()
{return c3dl.copyVector(this.position);}
this.setPosition=function(pos)
{if(pos.length==3)
{this.position[0]=pos[0];this.position[1]=pos[1];this.position[2]=pos[2];}
else
{c3dl.debug.logWarning("invalid value passed to Point::setPosition()");}}
this.getColor=function()
{return c3dl.copyVector(this.color);}
this.setColor=function(color)
{if(color.length==3)
{this.color[0]=color[0];this.color[1]=color[1];this.color[2]=color[2];}
else
{c3dl.debug.logWarning("invalid value passed to Point::setColor()");}}
this.isVisible=function()
{return this.visible;}
this.setVisible=function(visible)
{this.visible=visible;}
this.getObjectType=function()
{return c3dl.POINT;}}