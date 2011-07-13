
c3dl.OrbitCamera=c3dl.inherit(c3dl.Camera,function()
{c3dl._superc(this);this.closestDistance=0;this.farthestDistance=0;this.orbitPoint=c3dl.makeVector(0,0,0);});c3dl.OrbitCamera.prototype.getClosestDistance=function()
{return this.closestDistance;}
c3dl.OrbitCamera.prototype.getDistance=function()
{return c3dl.vectorLength(c3dl.subtractVectors(this.pos,this.orbitPoint));}
c3dl.OrbitCamera.prototype.getFarthestDistance=function()
{return this.farthestDistance;}
c3dl.OrbitCamera.prototype.getOrbitPoint=function()
{return c3dl.copyVector(this.orbitPoint);}
c3dl.OrbitCamera.prototype.goCloser=function(distance)
{if(distance>0)
{var shiftAmt=c3dl.multiplyVector(this.dir,distance);var renameMe=c3dl.subtractVectors(this.pos,this.orbitPoint);var maxMoveCloser=c3dl.vectorLength(renameMe)-this.getClosestDistance();if(c3dl.vectorLength(shiftAmt)<=maxMoveCloser)
{this.pos=c3dl.addVectors(this.pos,shiftAmt);return true;}}
return false;}
c3dl.OrbitCamera.prototype.goFarther=function(distance)
{if(distance>0)
{var shiftAmt=c3dl.multiplyVector(c3dl.multiplyVector(this.dir,-1),distance);var newpos=c3dl.addVectors(this.pos,shiftAmt);var distanceBetweenCamAndOP=c3dl.vectorLength(c3dl.subtractVectors(newpos,this.orbitPoint));if(distanceBetweenCamAndOP<=this.getFarthestDistance())
{this.pos=newpos;return true;}}
return false;}
c3dl.OrbitCamera.prototype.pitch=function(angle)
{if(c3dl.isVectorEqual(this.pos,this.orbitPoint))
{var rotMat=c3dl.quatToMatrix(c3dl.axisAngleToQuat(this.left,angle));this.dir=c3dl.multiplyMatrixByVector(rotMat,this.dir);this.dir=c3dl.normalizeVector(this.dir);this.up=c3dl.vectorCrossProduct(this.dir,this.left);this.up=c3dl.normalizeVector(this.up);}
else
{this.pos=c3dl.subtractVectors(this.pos,this.orbitPoint);var quat=c3dl.axisAngleToQuat(this.left,angle);var rotMat=c3dl.quatToMatrix(quat);var newpos=c3dl.multiplyMatrixByVector(rotMat,this.pos);this.pos=c3dl.addVectors(newpos,this.orbitPoint);this.dir=c3dl.subtractVectors(this.orbitPoint,this.pos);this.dir=c3dl.normalizeVector(this.dir);this.up=c3dl.vectorCrossProduct(this.dir,this.left);this.up=c3dl.normalizeVector(this.up);this.left=c3dl.vectorCrossProduct(this.up,this.dir);this.left=c3dl.normalizeVector(this.left);}}
c3dl.OrbitCamera.prototype.setClosestDistance=function(distance)
{if(distance>=0&&distance<=this.getFarthestDistance())
{this.closestDistance=distance;var distanceBetweenCamAndOP=this.getDistance();if(distanceBetweenCamAndOP<this.getClosestDistance())
{var amt=this.getClosestDistance()-distanceBetweenCamAndOP;this.goFarther(amt);}}}
c3dl.OrbitCamera.prototype.setDistance=function(distance)
{if(distance>=this.getClosestDistance()&&distance<=this.getFarthestDistance())
{this.pos=c3dl.copyVector(this.orbitPoint);this.goFarther(distance);}}
c3dl.OrbitCamera.prototype.setFarthestDistance=function(distance)
{if(distance>=this.getClosestDistance())
{this.farthestDistance=distance;var distanceBetweenCamAndOP=this.getDistance();if(distanceBetweenCamAndOP>this.getFarthestDistance())
{var amt=distanceBetweenCamAndOP-this.getFarthestDistance();this.goCloser(amt);}}}
c3dl.OrbitCamera.prototype.setOrbitPoint=function(orbitPoint)
{var orbitPointToCam=c3dl.multiplyVector(this.dir,-this.getDistance());this.orbitPoint[0]=orbitPoint[0];this.orbitPoint[1]=orbitPoint[1];this.orbitPoint[2]=orbitPoint[2];this.pos=c3dl.addVectors(this.orbitPoint,orbitPointToCam);}
c3dl.OrbitCamera.prototype.yaw=function(angle)
{if(c3dl.isVectorEqual(this.pos,this.orbitPoint))
{var rotMat=c3dl.quatToMatrix(c3dl.axisAngleToQuat([0,1,0],angle));this.left=c3dl.multiplyMatrixByVector(rotMat,this.left);this.left=c3dl.normalizeVector(this.left);this.up=c3dl.multiplyMatrixByVector(rotMat,this.up);this.up=c3dl.normalizeVector(this.up);this.dir=c3dl.vectorCrossProduct(this.left,this.up);this.dir=c3dl.normalizeVector(this.dir);}
else
{var camPosOrbit=c3dl.subtractVectors(this.pos,this.orbitPoint);var rotMat=c3dl.quatToMatrix(c3dl.axisAngleToQuat([0,1,0],angle));var newpos=c3dl.multiplyMatrixByVector(rotMat,camPosOrbit);this.pos=c3dl.addVectors(newpos,this.orbitPoint);this.dir=c3dl.subtractVectors(this.orbitPoint,this.pos);this.dir=c3dl.normalizeVector(this.dir);this.up=c3dl.multiplyMatrixByVector(rotMat,this.up);this.up=c3dl.normalizeVector(this.up);this.left=c3dl.vectorCrossProduct(this.up,this.dir);this.left=c3dl.normalizeVector(this.left);}}
c3dl.OrbitCamera.prototype.setPosition=function(position)
{var distFromNewPosToOP=c3dl.vectorLength(c3dl.subtractVectors(this.orbitPoint,position));if(distFromNewPosToOP>=this.getClosestDistance()&&distFromNewPosToOP<=this.getFarthestDistance())
{this.pos[0]=position[0];this.pos[1]=position[1];this.pos[2]=position[2];var camPosToOrbitPoint=c3dl.subtractVectors(this.orbitPoint,this.pos);if(c3dl.isVectorEqual([0,0,0],c3dl.vectorCrossProduct(camPosToOrbitPoint,[0,1,0])))
{this.dir=c3dl.normalizeVector(camPosToOrbitPoint);this.up=c3dl.vectorCrossProduct(this.dir,this.left);}
else
{this.dir=c3dl.normalizeVector(c3dl.subtractVectors(this.orbitPoint,this.pos));this.left=c3dl.vectorCrossProduct([0,1,0],this.dir);this.up=c3dl.vectorCrossProduct(this.dir,this.left);}}}
c3dl.OrbitCamera.prototype.toString=function(delimiter)
{if(!delimiter||typeof(delimiter)!="string")
{delimiter=",";}
var cameraToStr=c3dl._super(this,arguments,"toString");var OrbitCameraToStr="c3dl.OrbitCamera: "+delimiter+"orbit point = "+this.getOrbitPoint()+delimiter+"closest distance = "+this.getClosestDistance()+delimiter+"farthest distance = "+this.getFarthestDistance();return cameraToStr+OrbitCameraToStr;}
c3dl.OrbitCamera.prototype.update=function(timeStep)
{}