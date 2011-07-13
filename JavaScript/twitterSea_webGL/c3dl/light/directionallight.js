
c3dl.DirectionalLight=c3dl.inherit(c3dl.Light,function(){c3dl._superc(this);this.direction=c3dl.makeVector(0,0,1);this.type=c3dl.DIRECTIONAL_LIGHT;this.getDirection=function()
{return c3dl.copyVector(this.direction);}
this.setDirection=function(dir)
{this.direction=c3dl.normalizeVector(dir);}});