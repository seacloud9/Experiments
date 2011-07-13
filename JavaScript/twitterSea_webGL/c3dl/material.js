
c3dl.Material=function()
{this.emission=c3dl.makeVector(0,0,0);this.ambient=c3dl.makeVector(0,0,0);this.diffuse=c3dl.makeVector(0,0,0);this.specular=c3dl.makeVector(0,0,0);this.shininess=0;this.name="unnamed";this.getCopy=function()
{var copy=new c3dl.Material();copy.emission=c3dl.copyVector(this.emission);copy.ambient=c3dl.copyVector(this.ambient);copy.diffuse=c3dl.copyVector(this.diffuse);copy.specular=c3dl.copyVector(this.specular);copy.shininess=this.shininess;copy.name=this.name;return copy;}
this.getEmission=function()
{return c3dl.copyVector(this.emission);}
this.getAmbient=function()
{return c3dl.copyVector(this.ambient);}
this.getDiffuse=function()
{return c3dl.copyVector(this.diffuse);}
this.getName=function()
{return this.name;}
this.getSpecular=function()
{return c3dl.copyVector(this.specular);}
this.getShininess=function()
{return this.shininess;}
this.setEmission=function(color)
{if(this.assertColor(color))
{this.emission[0]=color[0];this.emission[1]=color[1];this.emission[2]=color[2];}}
this.setAmbient=function(color)
{if(this.assertColor(color))
{this.ambient[0]=color[0];this.ambient[1]=color[1];this.ambient[2]=color[2];}}
this.setDiffuse=function(color)
{if(this.assertColor(color))
{this.diffuse[0]=color[0];this.diffuse[1]=color[1];this.diffuse[2]=color[2];}}
this.setSpecular=function(color)
{if(this.assertColor(color))
{this.specular[0]=color[0];this.specular[1]=color[1];this.specular[2]=color[2];}}
this.setShininess=function(shine)
{this.shininess=shine;}
this.setName=function(name)
{this.name=name;}
this.toString=function()
{var breakStr="<br />";return"Name: "+this.getName()+breakStr+"Emission: "+this.getEmission()+breakStr+"Ambient: "+this.getAmbient()+breakStr+"Diffuse: "+this.getDiffuse()+breakStr+"Specular: "+this.getSpecular()+breakStr+"Shininess: "+this.getShininess();}
this.assertColor=function(color)
{if(color instanceof Array&&color.length==3)
{return true;}
else
{c3dl.debug.logWarning("Invalid argument passed to material set* method."+"Color values must be arrays with exactly 3 elements.");return false;}}}