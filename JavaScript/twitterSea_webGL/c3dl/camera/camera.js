
c3dl.Camera=function()
{this.left=c3dl.makeVector(1.0,0.0,0.0);this.up=c3dl.makeVector(0.0,1.0,0.0);this.dir=c3dl.makeVector(0.0,0.0,1.0);this.pos=c3dl.makeVector(0.0,0.0,0.0);this.projectionTransform=null;this.projMatrix;this.viewMatrix;this.fieldOfView=c3dl.DEFAULT_FIELD_OF_VIEW;this.nearClippingPlane=c3dl.DEFAULT_NEAR_CLIPPING_PLANE;this.farClippingPlane=c3dl.DEFAULT_FAR_CLIPPING_PLANE;}
c3dl.Camera.prototype.applyToWorld=function(aspectRatio)
{c3dl.loadMatrix(c3dl.lookAt(this.pos,c3dl.addVectors(this.pos,this.dir),this.up));c3dl.translate(-this.pos[0],-this.pos[1],-this.pos[2]);this.viewMatrix=c3dl.peekMatrix();this.projMatrix=c3dl.makePerspective(this.fieldOfView,aspectRatio,this.nearClippingPlane,this.farClippingPlane);c3dl.matrixMode(c3dl.PROJECTION);c3dl.loadMatrix(this.projMatrix);c3dl.matrixMode(c3dl.MODELVIEW);}
c3dl.Camera.prototype.getDir=function()
{return c3dl.copyVector(this.dir);}
c3dl.Camera.prototype.getFarClippingPlane=function()
{return this.farClippingPlane;}
c3dl.Camera.prototype.getFieldOfView=function()
{return this.fieldOfView;}
c3dl.Camera.prototype.getLeft=function()
{return c3dl.copyVector(this.left);}
c3dl.Camera.prototype.getNearClippingPlane=function()
{return this.nearClippingPlane;}
c3dl.Camera.prototype.getPosition=function()
{return c3dl.copyVector(this.pos);}
c3dl.Camera.prototype.getProjectionMatrix=function()
{return c3dl.copyMatrix(this.projMatrix);}
c3dl.Camera.prototype.getViewMatrix=function()
{return c3dl.copyMatrix(this.viewMatrix);}
c3dl.Camera.prototype.getUp=function()
{return c3dl.copyVector(this.up);}
c3dl.Camera.prototype.setFarClippingPlane=function(fcp)
{if(fcp>0)
{this.farClippingPlane=fcp;}}
c3dl.Camera.prototype.setFieldOfView=function(fov)
{if(fov>0&&fov<180)
{this.fieldOfView=fov;}}
c3dl.Camera.prototype.setNearClippingPlane=function(ncp)
{if(ncp>0)
{this.nearClippingPlane=ncp;}}
c3dl.Camera.prototype.toString=function(delimiter)
{if(!delimiter||typeof(delimiter)!="string")
{delimiter=",";}
return"c3dl.Camera: "+delimiter+"left: "+this.getLeft()+delimiter+"up: "+this.getUp()+
delimiter+"direction: "+this.getDir()+delimiter+"position: "+this.getPosition()+
delimiter+"fied of view: "+this.getFieldOfView()+delimiter+"near clipping plane: "+
this.getNearClippingPlane()+delimiter+"far clipping plane: "+this.getFarClippingPlane()+
delimiter;}
c3dl.Camera.prototype.update=function(timeStep)
{if(c3dl.isVectorZero(linVel)&&c3dl.isVectorZero(angVel))return false;if(c3dl.vectorLengthSq(linVel)>0.0)
{velVec=c3dl.makeVector(linVel[0],linVel[1],linVel[2]);c3dl.multiplyVector(velVec,timeStep,velVec);c3dl.addVectors(pos,velVec,pos);}
if(c3dl.vectorLengthSq(angVel)>0.0)
{this.pitch(angVel[0]*timeStep);this.yaw(angVel[1]*timeStep);this.roll(angVel[2]*timeStep);}
return true;}