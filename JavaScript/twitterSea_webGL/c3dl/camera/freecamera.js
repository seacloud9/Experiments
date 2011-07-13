
c3dl.FreeCamera=c3dl.inherit(c3dl.Camera,function()
{c3dl._superc(this);this.linVel=c3dl.makeVector(0.0,0.0,0.0);this.angVel=c3dl.makeVector(0.0,0.0,0.0);});c3dl.FreeCamera.prototype.getAngularVel=function()
{return c3dl.copyVector(this.angVel);}
c3dl.FreeCamera.prototype.getLinearVel=function()
{return c3dl.copyVector(this.linVel);}
c3dl.FreeCamera.prototype.pitch=function(angle)
{this.rotateOnAxis(this.left,angle);}
c3dl.FreeCamera.prototype.roll=function(angle)
{this.rotateOnAxis(this.dir,angle);}
c3dl.FreeCamera.prototype.rotateOnAxis=function(axisVec,angle)
{var quat=c3dl.axisAngleToQuat(axisVec,angle);var mat=c3dl.quatToMatrix(quat);c3dl.multiplyMatrixByVector(mat,this.dir,this.dir);c3dl.normalizeVector(this.dir);c3dl.multiplyMatrixByVector(mat,this.left,this.left);c3dl.normalizeVector(this.left);c3dl.multiplyMatrixByVector(mat,this.up,this.up);c3dl.normalizeVector(this.up);}
c3dl.FreeCamera.prototype.setAngularVel=function(newVec)
{this.angVel[0]=newVec[0];this.angVel[1]=newVec[1];this.angVel[2]=newVec[2];}
c3dl.FreeCamera.prototype.setLinearVel=function(newVec)
{this.linVel[0]=newVec[0];this.linVel[1]=newVec[1];this.linVel[2]=newVec[2];}
c3dl.FreeCamera.prototype.setLookAtPoint=function(newVec)
{if(c3dl.isVectorEqual(this.pos,[0,0,0])&&c3dl.isVectorEqual(newVec,[0,0,0]))
{c3dl.debug.logWarning("Cannot lookAt [0,0,0] since camera is at [0,0,0]."+" Move camera before calling setLookAt()");}
else
{this.dir=c3dl.subtractVectors(newVec,this.pos);c3dl.normalizeVector(this.dir);c3dl.vectorCrossProduct([0,1,0],this.dir,this.left);c3dl.normalizeVector(this.left);c3dl.vectorCrossProduct(this.dir,this.left,this.up);c3dl.normalizeVector(this.up);}}
c3dl.FreeCamera.prototype.setPosition=function(newVec)
{this.pos[0]=newVec[0];this.pos[1]=newVec[1];this.pos[2]=newVec[2];}
c3dl.FreeCamera.prototype.setUpVector=function(newVec)
{this.up[0]=newVec[0];this.up[1]=newVec[1];this.up[2]=newVec[2];}
c3dl.FreeCamera.prototype.toString=function(delimiter)
{if(!delimiter||typeof(delimiter)!="string")
{delimiter=",";}
var cameraToStr=c3dl._super(this,arguments,"toString");var FreeCameraToStr="c3dl.FreeCamera: "+delimiter+"angular velocity = "+
this.getAngularVel()+delimiter+"linear velocity = "+this.getLinearVel()+delimiter;return cameraToStr+FreeCameraToStr;}
c3dl.FreeCamera.prototype.update=function(timeStep)
{if(c3dl.isVectorZero(this.linVel)&&c3dl.isVectorZero(this.angVel))
{return false;}
if(c3dl.vectorLengthSq(this.linVel)>0.0)
{var velVec=c3dl.makeVector(this.linVel[0],this.linVel[1],this.linVel[2]);c3dl.multiplyVector(velVec,timeStep,velVec);c3dl.addVectors(this.pos,velVec,this.pos);}
if(c3dl.vectorLengthSq(this.angVel)>0.0)
{this.pitch(this.angVel[0]*timeStep);this.yaw(this.angVel[1]*timeStep);this.roll(this.angVel[2]*timeStep);}}
c3dl.FreeCamera.prototype.yaw=function(angle)
{this.rotateOnAxis(this.up,angle);}