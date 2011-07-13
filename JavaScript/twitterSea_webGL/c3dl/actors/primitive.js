
c3dl.Primitive=c3dl.inherit(c3dl.Actor,function(){c3dl._superc(this);this.isPickable=true;this.visible=true;this.insideFrustum=false;this.dirtyFlag=true;this.staticObject=false;});c3dl.Primitive.prototype.getPickable=function(){return this.isPickable;}
c3dl.Primitive.prototype.isVisible=function(){return this.visible;}
c3dl.Primitive.prototype.isInsideFrustum=function(){return this.insideFrustum;}
c3dl.Primitive.prototype.isStatic=function(){return this.staticObject;}
c3dl.Primitive.prototype.isDirty=function(){return this.dirtyFlag;}
c3dl.Primitive.prototype.setVisible=function(show){this.visible=show;}
c3dl.Primitive.prototype.setInsideFrustum=function(inside){this.insideFrustum=inside;}
c3dl.Primitive.prototype.setStatic=function(staticObject){this.staticObject=staticObject;}
c3dl.Primitive.prototype.setDirty=function(dirty){this.dirtyFlag=dirty;}
c3dl.Primitive.prototype.setPickable=function(isPickable){this.isPickable=isPickable;}
c3dl.Primitive.prototype.getCopy=function(){var primitive=new c3dl.Primitive();primitive.clone(this);return primitive;}
c3dl.Primitive.prototype.clone=function(other){c3dl._super(this,arguments,"clone");this.visible=other.visible;this.isPickable=other.isPickable;this.insideFrustum=other.insideFrustum;this.staticObject=other.staticObject;this.dirtyFlag=other.dirtyFlag;}
c3dl.Primitive.prototype.render=function(glCanvas3D,scene){}