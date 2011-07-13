
c3dl.PositionalLight=c3dl.inherit(c3dl.Light,function(){c3dl._superc(this);this.position=c3dl.makeVector(0,0,0);this.attenuation=c3dl.makeVector(1,0,0);this.type=c3dl.POSITIONAL_LIGHT;this.getAttenuation=function()
{return c3dl.copyVector(this.attenuation);}
this.getPosition=function()
{return c3dl.copyVector(this.position);}
this.setAttenuation=function(attenuation)
{this.attenuation[0]=attenuation[0];this.attenuation[1]=attenuation[1];this.attenuation[2]=attenuation[2];}
this.setPosition=function(vec)
{this.position[0]=vec[0];this.position[1]=vec[1];this.position[2]=vec[2];}});