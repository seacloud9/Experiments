
c3dl.Geometry=function(){this.primitiveSets=[];this.effect=null;this.firstTimeRender=true;this.addPrimitiveSet=function(primitiveSet){this.primitiveSets.push(primitiveSet);}
this.clone=function(other){for(var i=0,len=other.primitiveSets.length;i<len;i++){this.primitiveSets.push(other.primitiveSets[i].getCopy());}}
this.getCopy=function(){var geometry=new c3dl.Geometry();geometry.clone(this);return geometry;}
this.getEffect=function(){return this.effect;}
this.getPrimitiveSets=function(){return this.primitiveSets;}
this.rayIntersectsEnclosures=function(rayOrigin,rayDir){for(var i=0,len=this.primitiveSets.length;i<len;i++){if(this.getPrimitiveSets()[i].getType()!=="lines"){var bv=this.primitiveSets[i].getBoundingVolume();var pos=bv.getPosition();var radius=bv.getRadius();if(c3dl.rayIntersectsSphere(rayOrigin,rayDir,pos,radius)&&c3dl.rayAABBIntersect(rayOrigin,rayDir,bv.aabb.maxMins)&&c3dl.rayOBBIntersect(rayOrigin,rayDir,pos,bv.getAxis(),bv.getSizeInAxis())){return true;}}}
return false;}
this.rayIntersectsTriangles=function(rayOrigin,rayDir){var mat=c3dl.inverseMatrix(c3dl.peekMatrix());var rayorigin=c3dl.multiplyMatrixByVector(mat,rayOrigin);var raydir=c3dl.normalizeVector(c3dl.multiplyMatrixByDirection(mat,rayDir));var vert1=new C3DL_FLOAT_ARRAY(3);var vert2=new C3DL_FLOAT_ARRAY(3);var vert3=new C3DL_FLOAT_ARRAY(3);for(var i=0,len=this.primitiveSets.length;i<len;i++){if(this.getPrimitiveSets()[i].getType()!=="lines"){var vertices=this.primitiveSets[i].getVertices();for(var j=0,len2=vertices.length;j<len2;j+=9){vert1[0]=vertices[j];vert1[1]=vertices[j+1]
vert1[2]=vertices[j+2];vert2[0]=vertices[j+3];vert2[1]=vertices[j+4];vert2[2]=vertices[j+5];vert3[0]=vertices[j+6];vert3[1]=vertices[j+7];vert3[2]=vertices[j+8];if(c3dl.rayIntersectsTriangle(rayorigin,raydir,vert1,vert2,vert3)){return true;}}}}
return false;}
this.render=function(glCanvas3D,scene){if(glCanvas3D==null){c3dl.debug.logWarning('Geometry::render() called with a null glCanvas3D');return false;}
if(this.getPrimitiveSets()[0].getType()==="lines"){}
else{if(this.firstTimeRender==true){for(var i=0,len=this.primitiveSets.length;i<len;i++){this.primitiveSets[i].setupVBO(glCanvas3D);}
this.firstTimeRender=false;}
for(var i=0,len=this.primitiveSets.length;i<len;i++){scene.getRenderer().texManager.updateTexture(this.primitiveSets[i].texture);}
scene.getRenderer().renderGeometry(this,scene);}}
this.renderBoundingVolumes=function(scene){for(var i=0,len=this.primitiveSets.length;i<len;i++){var bv=this.primitiveSets[i].getBoundingVolume();if(bv){bv.renderAabb(scene);bv.renderObb(scene);bv.renderSphere(scene);}}}
this.setEffect=function(effect){this.effect=effect;}
this.setMaterial=function(material){for(var i=0,len=this.primitiveSets.length;i<len;i++){this.primitiveSets[i].setMaterial(material);}}
this.setTexture=function(texture){for(var i=0,len=this.primitiveSets.length;i<len;i++){this.primitiveSets[i].setTexture(texture);}}
this.updateTextureByName=function(oldTexturePath,newTexturePath)
{for(var i=0,len=this.primitiveSets.length;i<len;i++)
{this.primitiveSets[i].updateTextureByName(oldTexturePath,newTexturePath);}}
this.update=function(timeStep,scaleVec){for(var i=0,len=this.primitiveSets.length;i<len;i++){var bv=this.primitiveSets[i].getBoundingVolume();var trans=c3dl.peekMatrix();c3dl.matrixMode(c3dl.PROJECTION);var rot=c3dl.peekMatrix();c3dl.matrixMode(c3dl.MODELVIEW);if(bv){bv.set(new C3DL_FLOAT_ARRAY([trans[12],trans[13],trans[14]]),rot,scaleVec);}}}}