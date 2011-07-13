
c3dl.Actor=function()
{this.left=c3dl.makeVector(1.0,0.0,0.0);this.up=c3dl.makeVector(0.0,1.0,0.0);this.dir=c3dl.makeVector(0.0,0.0,1.0);this.pos=c3dl.makeVector(0.0,0.0,0.0);this.scaleVec=c3dl.makeVector(1.0,1.0,1.0);this.linVel=c3dl.makeVector(0.0,0.0,0.0);this.angVel=c3dl.makeVector(0.0,0.0,0.0);this.name="unnamed";this.rotMat=c3dl.makeMatrix();this.transMat=c3dl.makeMatrix();}
c3dl.Actor.prototype.getPosition=function(){return c3dl.copyVector(this.pos);}
c3dl.Actor.prototype.getUp=function(){return c3dl.copyVector(this.up);}
c3dl.Actor.prototype.getDirection=function(){return c3dl.copyVector(this.dir);}
c3dl.Actor.prototype.getLeft=function(){return c3dl.copyVector(this.left);}
c3dl.Actor.prototype.getLinearVel=function(){return c3dl.copyVector(this.linVel);}
c3dl.Actor.prototype.getAngularVel=function(){return c3dl.copyVector(this.angVel);}
c3dl.Actor.prototype.getScale=function(){return c3dl.copyVector(this.scaleVec);}
c3dl.Actor.prototype.getTransform=function(){c3dl.mat1[0]=this.left[0];c3dl.mat1[1]=this.left[1];c3dl.mat1[2]=this.left[2];c3dl.mat1[3]=0.0;c3dl.mat1[4]=this.up[0];c3dl.mat1[5]=this.up[1];c3dl.mat1[6]=this.up[2];c3dl.mat1[7]=0.0;c3dl.mat1[8]=this.dir[0];c3dl.mat1[9]=this.dir[1];c3dl.mat1[10]=this.dir[2];c3dl.mat1[11]=0.0;c3dl.mat1[12]=this.pos[0];c3dl.mat1[13]=this.pos[1];c3dl.mat1[14]=this.pos[2];c3dl.mat1[15]=1.0;c3dl.setMatrix(c3dl.mat2,this.scaleVec[0],0,0,0,0,this.scaleVec[1],0,0,0,0,this.scaleVec[2],0,0,0,0,1);return c3dl.multiplyMatrixByMatrix(c3dl.mat1,c3dl.mat2,this.transMat);}
c3dl.Actor.prototype.getRotateMat=function()
{this.rotMat[0]=this.left[0];this.rotMat[1]=this.left[1];this.rotMat[2]=this.left[2];this.rotMat[3]=0.0;this.rotMat[4]=this.up[0];this.rotMat[5]=this.up[1];this.rotMat[6]=this.up[2];this.rotMat[7]=0.0;this.rotMat[8]=this.dir[0];this.rotMat[9]=this.dir[1];this.rotMat[10]=this.dir[2];this.rotMat[11]=0.0;this.rotMat[12]=0;this.rotMat[13]=0;this.rotMat[14]=0;this.rotMat[15]=1.0;return this.rotMat;}
c3dl.Actor.prototype.getName=function(){return this.name;}
c3dl.Actor.prototype.setTransform=function(mat){this.left=c3dl.makeVector(mat[0],mat[1],mat[2]);this.up=c3dl.makeVector(mat[4],mat[5],mat[6]);this.dir=c3dl.makeVector(mat[8],mat[9],mat[10]);this.pos=c3dl.makeVector(mat[12],mat[13],mat[14]);}
c3dl.Actor.prototype.resetTransform=function(){this.angVel=c3dl.makeVector(0.0,0.0,0.0);this.linVel=c3dl.makeVector(0.0,0.0,0.0);this.left=c3dl.makeVector(1.0,0.0,0.0);this.up=c3dl.makeVector(0.0,1.0,0.0);this.dir=c3dl.makeVector(0.0,0.0,1.0);this.pos=c3dl.makeVector(0.0,0.0,0.0);}
c3dl.Actor.prototype.scale=function(scaleVec){if(scaleVec[0]>0.0&&scaleVec[1]>0.0&&scaleVec[2]>0.0)
{this.scaleVec[0]=this.scaleVec[0]*scaleVec[0];this.scaleVec[1]=this.scaleVec[1]*scaleVec[1];this.scaleVec[2]=this.scaleVec[2]*scaleVec[2];}}
c3dl.Actor.prototype.setPosition=function(vecPos)
{this.pos[0]=vecPos[0];this.pos[1]=vecPos[1];this.pos[2]=vecPos[2];}
c3dl.Actor.prototype.translate=function(translation)
{this.pos=c3dl.addVectors(this.pos,translation);}
c3dl.Actor.prototype.setForward=function(newVec)
{this.dir=this.pos;c3dl.subtractVectors(this.dir,newVec,this.dir);c3dl.normalizeVector(this.dir);c3dl.vectorCrossProduct(this.up,this.dir,this.left);c3dl.normalizeVector(this.left);c3dl.vectorCrossProduct(this.dir,this.up,this.up);c3dl.normalizeVector(this.up);}
c3dl.Actor.prototype.setUpVector=function(newVec)
{this.up[0]=newVec[0];this.up[1]=newVec[1];this.up[2]=newVec[2];}
c3dl.Actor.prototype.setLinearVel=function(newVec)
{this.linVel[0]=newVec[0];this.linVel[1]=newVec[1];this.linVel[2]=newVec[2];}
c3dl.Actor.prototype.setAngularVel=function(newVec)
{this.angVel[0]=newVec[0];this.angVel[1]=newVec[1];this.angVel[2]=newVec[2];}
c3dl.Actor.prototype.setName=function(name)
{this.name=name;}
c3dl.Actor.prototype.rotateOnAxis=function(axisVec,angle)
{var rotateOnAxisQuat=c3dl.makeQuat(0,0,0,0);var rotateOnAxisMat=c3dl.makeZeroMatrix();if(angle==0)
{return;}
c3dl.axisAngleToQuat(axisVec,angle,rotateOnAxisQuat);rotateOnAxisMat=c3dl.quatToMatrix(rotateOnAxisQuat);c3dl.multiplyMatrixByVector(rotateOnAxisMat,this.dir,this.dir);c3dl.normalizeVector(this.dir);c3dl.multiplyMatrixByVector(rotateOnAxisMat,this.left,this.left);c3dl.normalizeVector(this.left);c3dl.multiplyMatrixByVector(rotateOnAxisMat,this.up,this.up);c3dl.normalizeVector(this.up);}
c3dl.Actor.prototype.yaw=function(angle)
{if(angle!=0)
{this.rotateOnAxis(this.up,angle);}}
c3dl.Actor.prototype.roll=function(angle)
{if(angle!=0)
{this.rotateOnAxis(this.dir,angle);}}
c3dl.Actor.prototype.pitch=function(angle)
{if(angle!=0)
{this.rotateOnAxis(this.left,angle);}}
c3dl.Actor.prototype.update=function(timeStep)
{}
c3dl.Actor.prototype.getCopy=function()
{var actor=new c3dl.Actor();actor.clone(this);return actor;}
c3dl.Actor.getObjectType=function()
{return c3dl.COLLADA;}
c3dl.Actor.prototype.clone=function(other)
{this.left=c3dl.copyVector(other.left);this.up=c3dl.copyVector(other.up);this.dir=c3dl.copyVector(other.dir);this.pos=c3dl.copyVector(other.pos);this.scaleVec=c3dl.copyVector(other.scaleVec);this.linVel=c3dl.copyVector(other.linVel);this.angVel=c3dl.copyVector(other.angVel);this.name=other.name;}