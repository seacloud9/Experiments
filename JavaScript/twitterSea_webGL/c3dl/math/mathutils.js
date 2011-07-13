
c3dl.roundUpToNextPowerOfTwo=function(number)
{var i=1;while(i<number)
{i*=2;}
return i;}
c3dl.invSqrt=function(num)
{if(!isNaN(num))
{return 1/Math.sqrt(num);}
c3dl.debug.logWarning('invSqrt() caled with a parameter that\'s not a number');return 0;}
c3dl.lookAt=function(eye,center,up)
{var z=c3dl.subtractVectors(eye,center,null);var x=c3dl.vectorCrossProduct(up,z,null);var y=c3dl.vectorCrossProduct(z,x,null);c3dl.normalizeVector(z);c3dl.normalizeVector(y);c3dl.normalizeVector(x);return c3dl.makeMatrix(x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,0,0,0,1);}
c3dl.makeOrtho=function(left,right,bottom,top,znear,zfar)
{return M4x4.makeOrtho(left,right,bottom,top,znear,zfar);}
c3dl.makePerspective=function(fovy,aspect,znear,zfar)
{return M4x4.makePerspective(fovy,aspect,znear,zfar);}
c3dl.makeFrustum=function(left,right,bottom,top,znear,zfar)
{return M4x4.makeFrustum(left,right,bottom,top,znear,zfar);}
c3dl.radiansToDegrees=function(rad)
{return rad/(Math.PI*2)*360.0;}
c3dl.degreesToRadians=function(deg)
{return deg/360.0*(Math.PI*2);}
c3dl.getRandom=function(min,max)
{var norm=Math.random();return((max-min)*norm)+min;}
c3dl.findMax=function(arrayIn)
{var max=arrayIn[0];for(i=0;i<arrayIn.length;i++){if(arrayIn[i]>max){max=arrayIn[i];}}
return max;};c3dl.findMin=function(arrayIn)
{var min=arrayIn[0];for(i=0;i<arrayIn.length;i++){if(arrayIn[i]<min){min=arrayIn[i];}}
return min;};