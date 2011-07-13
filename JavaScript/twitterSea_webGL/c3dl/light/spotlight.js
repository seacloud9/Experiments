
c3dl.SpotLight=c3dl.inherit(c3dl.PositionalLight,function(){c3dl._superc(this);this.cutoff=180;this.type=c3dl.SPOT_LIGHT;this.direction=c3dl.makeVector(0,0,-1);this.exponent=0;this.getCutoff=function()
{return this.cutoff;}
this.getDirection=function()
{return c3dl.copyVector(this.direction);}
this.getExponent=function()
{return this.exponent;}
this.setCutoff=function(cutoff)
{if((cutoff>=0&&cutoff<=90)||cutoff==180)
{this.cutoff=cutoff;}}
this.setDirection=function(dir)
{this.direction=c3dl.normalizeVector(dir);}
this.setExponent=function(exponent)
{if(exponent>=0&&exponent<=128)
{this.exponent=exponent;}}});