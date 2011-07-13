
c3dl.Light=function()
{this.type=c3dl.ABSTRACT_LIGHT;this.name="unnamed";this.ambient=c3dl.makeVector(0,0,0);this.diffuse=c3dl.makeVector(0,0,0);this.specular=c3dl.makeVector(0,0,0);this.on=false;this.getName=function()
{return this.name;}
this.getAmbient=function()
{return c3dl.copyVector(this.ambient);}
this.getDiffuse=function()
{return c3dl.copyVector(this.diffuse);}
this.getSpecular=function()
{return c3dl.copyVector(this.specular);}
this.getType=function()
{return this.type;}
this.isOn=function()
{return this.on;}
this.setOn=function(isOn)
{this.on=isOn;}
this.setName=function(name)
{this.name=name;}
this.setAmbient=function(color)
{this.ambient[0]=color[0];this.ambient[1]=color[1];this.ambient[2]=color[2];}
this.setDiffuse=function(color)
{this.diffuse[0]=color[0];this.diffuse[1]=color[1];this.diffuse[2]=color[2];}
this.setSpecular=function(color)
{this.specular[0]=color[0];this.specular[1]=color[1];this.specular[2]=color[2];}}