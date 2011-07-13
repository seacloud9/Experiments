
c3dl.Collada=c3dl.inherit(c3dl.Primitive,function(){c3dl._superc(this);this.boundingVolume=new c3dl.BoundingVolume();this.renderObb=false;this.renderAabb=false;this.renderBoundingSphere=false;this.path=null;this.sceneGraph=null;});c3dl.Collada.prototype.getPath=function(){if(this.isReady()){return this.path;}}
c3dl.Collada.prototype.getAngularVel=function(){if(this.isReady()){return this.sceneGraph.getAngularVel();}}
c3dl.Collada.prototype.getLinearVel=function(){if(this.isReady()){return this.sceneGraph.getLinearVel();}}
c3dl.Collada.prototype.getPosition=function(){if(this.isReady()){return this.sceneGraph.getPosition();}}
c3dl.Collada.prototype.setAngularVel=function(vec){if(this.isReady()){this.sceneGraph.setAngularVel(vec);}}
c3dl.Collada.prototype.getUp=function(){if(this.isReady()){return this.sceneGraph.getUp();}}
c3dl.Collada.prototype.getLeft=function(){if(this.isReady()){return this.sceneGraph.getLeft();}}
c3dl.Collada.prototype.getDirection=function(){if(this.isReady()){return this.sceneGraph.getDirection();}}
c3dl.Collada.prototype.getPickable=function(){if(this.isReady()){return this.sceneGraph.getPickable();}}
c3dl.Collada.prototype.setPickable=function(isPickable){if(this.isReady()){this.sceneGraph.setPickable(isPickable);}}
c3dl.Collada.prototype.setLinearVel=function(vec){if(this.isReady()){this.sceneGraph.setLinearVel(vec);}}
c3dl.Collada.prototype.init=function(daePath){this.path=daePath;if(c3dl.ColladaManager.isFileLoaded(this.path)){this.sceneGraph=c3dl.ColladaManager.getSceneGraphCopy(this.path);}
else{c3dl.ColladaQueue.pushBack(this);}
if(this.isReady()){c3dl.pushMatrix();c3dl.loadIdentity();var allVerts=this.sceneGraph.getAllVerts();this.boundingVolume.init(allVerts);c3dl.popMatrix();}}
c3dl.Collada.prototype.update=function(timeStep){if(this.isReady()){if(!this.isStatic()||this.isStatic()&&this.isDirty()){scaleVec=[1,1,1];c3dl.pushMatrix();c3dl.loadIdentity();c3dl.matrixMode(c3dl.PROJECTION);c3dl.pushMatrix();c3dl.loadIdentity();c3dl.matrixMode(c3dl.MODELVIEW);var currNode=this.sceneGraph;while(currNode){if(currNode.children&&currNode.children.length){var flag=true;if(!currNode.pushed){c3dl.multiplyVectorByVector(scaleVec,currNode.scaleVec,scaleVec);c3dl.multiplyVector(currNode.linVel,timeStep,c3dl.vec1);c3dl.addVectors(currNode.pos,c3dl.vec1,currNode.pos);currNode.pitch(currNode.angVel[0]*timeStep);currNode.yaw(currNode.angVel[1]*timeStep);currNode.roll(currNode.angVel[2]*timeStep);c3dl.pushMatrix();c3dl.multMatrix(currNode.getTransform());c3dl.matrixMode(c3dl.PROJECTION);c3dl.pushMatrix();c3dl.multMatrix(currNode.getRotateMat());c3dl.matrixMode(c3dl.MODELVIEW);currNode.pushed=true;}
for(var i=0,len=currNode.children.length;i<len;i++){if(!currNode.children[i].updated){currNode=currNode.children[i];i=len;flag=false;}}
if(flag){c3dl.popMatrix();c3dl.matrixMode(c3dl.PROJECTION);c3dl.popMatrix();c3dl.matrixMode(c3dl.MODELVIEW);c3dl.divideVectorByVector(scaleVec,currNode.scaleVec,scaleVec);for(var i=0,len=currNode.children.length;i<len;i++){currNode.children[i].updated=null;}
currNode.updated=true;currNode.pushed=null;currNode=currNode.parent;}}
else{if(currNode.primitiveSets){for(var i=0,len=currNode.primitiveSets.length;i<len;i++){var bv=currNode.primitiveSets[i].getBoundingVolume();var trans=c3dl.peekMatrix();c3dl.matrixMode(c3dl.PROJECTION);var rot=c3dl.peekMatrix();c3dl.matrixMode(c3dl.MODELVIEW);if(bv){bv.set(new C3DL_FLOAT_ARRAY([trans[12],trans[13],trans[14]]),rot,scaleVec);}}}
currNode.updated=true;currNode=currNode.parent;}}
c3dl.popMatrix();c3dl.popMatrix();c3dl.matrixMode(c3dl.PROJECTION);c3dl.popMatrix();c3dl.popMatrix();c3dl.matrixMode(c3dl.MODELVIEW);if(this.isStatic()){this.setDirty(false);}
var pos=this.sceneGraph.pos;var rotateMat=this.sceneGraph.getRotateMat();var scaleVec=this.boundingVolume.scaleVec;this.boundingVolume.set(pos,rotateMat,scaleVec);}}
else{c3dl.debug.logError('You must call addModel("'+this.path+'"); before canvasMain.');if(c3dl.ColladaManager.isFileLoaded(this.path)){this.sceneGraph=c3dl.ColladaManager.getSceneGraphCopy(this.path);}}}
c3dl.Collada.prototype.setSceneGraph=function(sg){this.sceneGraph=sg;}
c3dl.Collada.prototype.render=function(glCanvas3D,scene){if(this.sceneGraph&&this.isVisible()){var currNode=this.sceneGraph;while(currNode){if(currNode.children&&currNode.children.length){var flag=true;if(!currNode.rpushed){c3dl.pushMatrix();c3dl.multMatrix(currNode.getTransform());currNode.rpushed=true;}
for(var i=0,len=currNode.children.length;i<len;i++){if(!currNode.children[i].rupdated){currNode=currNode.children[i];i=len;flag=false;}}
if(flag){c3dl.popMatrix();for(var i=0,len=currNode.children.length;i<len;i++){currNode.children[i].rupdated=null;}
currNode.rupdated=true;currNode.rpushed=null;currNode=currNode.parent;}}
else{if(currNode.primitiveSets){if(currNode.getPrimitiveSets()[0].getType()==="lines"){}
else{if(currNode.firstTimeRender==true){for(var i=0,len=currNode.primitiveSets.length;i<len;i++){currNode.primitiveSets[i].setupVBO(glCanvas3D);}
currNode.firstTimeRender=false;}
for(var i=0,len=currNode.primitiveSets.length;i<len;i++){scene.getRenderer().texManager.updateTexture(currNode.primitiveSets[i].texture);}
scene.getRenderer().renderGeometry(currNode,scene);}}
currNode.rupdated=true;currNode=currNode.parent;}}
c3dl.popMatrix();if(scene.getBoundingVolumeVisibility()){this.sceneGraph.renderBoundingVolumes(scene);}
if(this.renderObb){this.boundingVolume.renderObb(scene);}
if(this.renderAabb){this.boundingVolume.renderAabb(scene);}
if(this.renderBoundingSphere){this.boundingVolume.renderSphere(scene);}}}
c3dl.Collada.prototype.scale=function(scaleVec){if(this.isReady()){this.sceneGraph.scale(scaleVec);this.boundingVolume.scale(scaleVec);this.setDirty(true);}}
c3dl.Collada.prototype.translate=function(trans){if(this.isReady()){this.sceneGraph.translate(trans);this.boundingVolume.setPosition(trans);this.setDirty(true);}}
c3dl.Collada.prototype.setPosition=function(pos){if(this.isReady()){this.sceneGraph.setPosition(pos);this.boundingVolume.setPosition(pos);this.setDirty(true);}}
c3dl.Collada.prototype.getSceneGraph=function(){return this.sceneGraph;}
c3dl.Collada.prototype.setTexture=function(texturePath){if(this.isReady()){this.sceneGraph.setTexture(texturePath);}}
c3dl.Collada.prototype.updateTextureByName=function(oldTexturePath,newTexturePath)
{if(this.isReady()){var modelPath=this.path.split("/");modelPath.pop();var addModelPath="";for(var i=0;i<modelPath.length;i++){addModelPath+=modelPath[i]+"/";}
if(typeof newTexturePath!=="string"){this.sceneGraph.updateTextureByName(addModelPath+oldTexturePath,newTexturePath);}
else{this.sceneGraph.updateTextureByName(addModelPath+oldTexturePath,addModelPath+newTexturePath);}}}
c3dl.Collada.prototype.setMaterial=function(material){if(this.isReady()){this.sceneGraph.setMaterial(material);}}
c3dl.Collada.prototype.setEffect=function(effect){this.sceneGraph.setEffect(effect);}
c3dl.Collada.prototype.rotateOnAxis=function(axisVec,angle){if(this.isReady()){this.sceneGraph.rotateOnAxis(axisVec,angle);this.boundingVolume.rotateOnAxis(axisVec,angle);this.setDirty(true);}}
c3dl.Collada.prototype.yaw=function(angle){if(this.isReady()){this.sceneGraph.yaw(angle);this.boundingVolume.rotateOnAxis(this.sceneGraph.up,angle);this.setDirty(true);}}
c3dl.Collada.prototype.pitch=function(angle){if(this.isReady()){this.sceneGraph.pitch(angle);this.boundingVolume.rotateOnAxis(this.sceneGraph.left,angle);this.setDirty(true);}}
c3dl.Collada.prototype.isReady=function(){return this.sceneGraph!=null?true:false;}
c3dl.Collada.prototype.roll=function(angle){if(this.isReady()){this.sceneGraph.roll(angle);this.boundingVolume.rotateOnAxis(this.sceneGraph.dir,angle);this.setDirty(true);}}
c3dl.Collada.prototype.getCopy=function(){var collada=new Collada();collada.clone(this);return collada;}
c3dl.Collada.prototype.getTransform=function(){if(this.sceneGraph){return this.sceneGraph.getTransform();}}
c3dl.Collada.prototype.clone=function(other){c3dl._super(this,arguments,"clone");this.path=other.path;this.sceneGraph=other.sceneGraph.getCopy();this.boundingVolume=other.boundingVolume.getCopy();}
c3dl.Collada.prototype.rayIntersectsEnclosures=function(rayOrigin,rayDir){var result;if(c3dl.rayIntersectsSphere(rayOrigin,rayDir,this.boundingVolume.getPosition(),this.boundingVolume.getRadius())&&c3dl.rayAABBIntersect(rayOrigin,rayDir,this.boundingVolume.aabb.maxMins)&&c3dl.rayOBBIntersect(rayOrigin,rayDir,this.boundingVolume.getPosition(),this.boundingVolume.getAxis(),this.boundingVolume.getSizeInAxis())){result=this.sceneGraph.rayIntersectsEnclosures(rayOrigin,rayDir);}
else{result=false;}
return result;}
c3dl.Collada.prototype.getObjectType=function(){return c3dl.COLLADA;}
c3dl.Collada.prototype.rayIntersectsTriangles=function(rayOrigin,rayDir){c3dl.pushMatrix();c3dl.loadIdentity();var result=this.sceneGraph.rayIntersectsTriangles(rayOrigin,rayDir);c3dl.popMatrix();return result;}
c3dl.Collada.prototype.getBoundingVolumes=function(){return this.sceneGraph.getBoundingVolumes();}
c3dl.Collada.prototype.getHeight=function(){if(this.isReady()){return this.boundingVolume.getHeight();}}
c3dl.Collada.prototype.getWidth=function(){if(this.isReady()){return this.boundingVolume.getWidth();}}
c3dl.Collada.prototype.getLength=function(){if(this.isReady()){return this.boundingVolume.getLength();}}
c3dl.Collada.prototype.getSize=function(){if(this.isReady()){return[this.boundingVolume.getLength(),this.boundingVolume.getWidth(),this.boundingVolume.getHeight()];}}
c3dl.Collada.prototype.setHeight=function(height){height=parseFloat(height);var curheight=this.boundingVolume.getHeight();var scaleVec=[];if(curheight>height){scaleVec=[1,(1/(curheight/height)),1];}
else if(curheight<height){scaleVec=[1,(height/curheight),1];}
else{scaleVec=[1,1,1];}
this.sceneGraph.scale(scaleVec);this.boundingVolume.scale(scaleVec);this.setDirty(true);}
c3dl.Collada.prototype.setLength=function(length){length=parseFloat(length);var curlength=this.boundingVolume.getLength();var scaleVec=[];if(curlength>length){scaleVec=[(1/(curlength/length)),1,1];}
else if(curlength<length){scaleVec=[(length/curlength),1,1];}
else{scaleVec=[1,1,1];}
this.sceneGraph.scale(scaleVec);this.boundingVolume.scale(scaleVec);this.setDirty(true);}
c3dl.Collada.prototype.setWidth=function(width){width=parseFloat(width);var curwidth=this.boundingVolume.getWidth();var scaleVec=[];if(curwidth>width){scaleVec=[1,1,(1/(curwidth/width))];}
else if(curwidth<width){scaleVec=[1,1,(width/curwidth)];}
else{scaleVec=[1,1,1];}
this.sceneGraph.scale(scaleVec);this.boundingVolume.scale(scaleVec);this.setDirty(true);}
c3dl.Collada.prototype.setSize=function(length,width,height){length=parseFloat(length);width=parseFloat(width);height=parseFloat(height);var curlength=this.boundingVolume.getLength();var curwidth=this.boundingVolume.getWidth();var curheight=this.boundingVolume.getHeight();var scaleVec=[];var vecL,vecW,vecH;if(curlength>length){vecL=(1/(curlength/length));}
else if(curlength<length){vecL=length/curlength;}
else{vecL=1;}
if(curheight>height){vecH=(1/(curheight/height));}
else if(curheight<height){vecH=(height/curheight);}
else{vecH=1;}
if(curwidth>width){vecW=(1/(curwidth/width));}
else if(curwidth<width){vecW=(width/curwidth);}
else{vecW=1;}
scaleVec=[vecL,vecH,vecW];this.sceneGraph.scale(scaleVec);this.boundingVolume.scale(scaleVec);this.setDirty(true);}
c3dl.Collada.prototype.setRenderObb=function(renderObb){this.renderObb=renderObb;}
c3dl.Collada.prototype.setRenderAabb=function(renderAabb){this.renderAabb=renderAabb;}
c3dl.Collada.prototype.setRenderBoundingSphere=function(renderBoundingSphere){this.renderBoundingSphere=renderBoundingSphere;}
c3dl.Collada.prototype.getBoundingVolume=function(){return this.boundingVolume;}
c3dl.Collada.prototype.centerObject=function(){c3dl.pushMatrix();c3dl.loadIdentity();this.sceneGraph.center(this.boundingVolume.centerPosition);this.boundingVolume.center();c3dl.popMatrix();this.setDirty(true);}