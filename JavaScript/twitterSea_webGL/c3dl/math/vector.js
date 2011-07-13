
c3dl.isValidVector=function(vecArr)
{if(vecArr instanceof Array||vecArr instanceof C3DL_FLOAT_ARRAY)
{if(vecArr.length==3||vecArr.length==4)
{for(var i=0,len=vecArr.length;i<len;i++)
{if(isNaN(vecArr[i]))return false;}
return true;}}
return false;}
c3dl.copyVector=function(srcVec,dest)
{if(dest==undefined){return V3.clone(srcVec);}
else{dest[0]=srcVec[0];dest[1]=srcVec[1];dest[2]=srcVec[2];}}
c3dl.copyVectorContents=function(srcVec,destVec)
{destVec=V3.clone(srcVec);}
c3dl.addVectorComponent=function(srcVec,newComponent){var newVec=new C3DL_FLOAT_ARRAY(4);newVec[0]=srcVec[0]
newVec[1]=srcVec[1]
newVec[2]=srcVec[2]
newVec[3]=newComponent
return newVec;}
c3dl.makeVector=function(newX,newY,newZ)
{return new C3DL_FLOAT_ARRAY([!isNaN(newX)?parseFloat(newX):0.0,!isNaN(newY)?parseFloat(newY):0.0,!isNaN(newZ)?parseFloat(newZ):0.0]);}
c3dl.normalizeVector=function(vec)
{if(vec.length===4){var compr=vec[0]*vec[0]+vec[1]*vec[1]+vec[2]*vec[2];var ln=Math.sqrt(compr);vec[0]=vec[0]!=0.0?vec[0]/ln:0.0;vec[1]=vec[1]!=0.0?vec[1]/ln:0.0;vec[2]=vec[2]!=0.0?vec[2]/ln:0.0;vec[3]=vec[3]!=0.0?vec[2]/ln:0.0;return vec;}
else{var compr=vec[0]*vec[0]+vec[1]*vec[1]+vec[2]*vec[2];var ln=Math.sqrt(compr);vec[0]=vec[0]!=0.0?vec[0]/ln:0.0;vec[1]=vec[1]!=0.0?vec[1]/ln:0.0;vec[2]=vec[2]!=0.0?vec[2]/ln:0.0;return vec;}}
c3dl.vectorDotProduct=function(vecOne,vecTwo,dest){return V3.dot(vecOne,vecTwo,dest);}
c3dl.vectorProject=function(vecOne,vecTwo){var topDot=V3.dot(vecOne,vecTwo);var bottomDot=V3.dot(vecTwo,vecTwo);return c3dl.multiplyVector(vecTwo,topDot/bottomDot);}
c3dl.vectorCrossProduct=function(vecOne,vecTwo,dest){return V3.cross(vecOne,vecTwo,dest);}
c3dl.vectorLength=function(vec){return V3.length(vec);}
c3dl.vectorLengthSq=function(vec){return V3.lengthSquared(vec);}
c3dl.addVectors=function(vecOne,vecTwo,dest){return V3.add(vecOne,vecTwo,dest);}
c3dl.subtractVectors=function(vecOne,vecTwo,dest){return V3.sub(vecOne,vecTwo,dest);}
c3dl.multiplyVector=function(vec,scalar,dest){return V3.scale(vec,scalar,dest);}
c3dl.divideVector=function(vec,scalar,dest){if(dest==undefined){dest=new C3DL_FLOAT_ARRAY(3);}
dest[0]=vec[0]/scalar;dest[1]=vec[1]/scalar;dest[2]=vec[2]/scalar;return dest;}
c3dl.multiplyVectorByVector=function(vecOne,vecTwo,dest){if(dest==undefined){dest=new C3DL_FLOAT_ARRAY(3);}
dest[0]=vecOne[0]*vecTwo[0];dest[1]=vecOne[1]*vecTwo[1];dest[2]=vecOne[2]*vecTwo[2];return dest;}
c3dl.divideVectorByVector=function(vecOne,vecTwo,dest){if(dest==undefined){dest=new C3DL_FLOAT_ARRAY(3);}
dest[0]=vecOne[0]/vecTwo[0];dest[1]=vecOne[1]/vecTwo[1];dest[2]=vecOne[2]/vecTwo[2];return dest;}
c3dl.isVectorEqual=function(vecOne,vecTwo){return(vecOne[0]===vecTwo[0]&&vecOne[1]===vecTwo[1]&&vecOne[2]===vecTwo[2]);}
c3dl.isVectorZero=function(vec){return((-c3dl.TOLERANCE<vec[0]&&vec[0]<c3dl.TOLERANCE)&&(-c3dl.TOLERANCE<vec[1]&&vec[1]<c3dl.TOLERANCE)&&(-c3dl.TOLERANCE<vec[2]&&vec[2]<c3dl.TOLERANCE));}
c3dl.getAngleBetweenVectors=function(vecOne,vecTwo)
{var dot=c3dl.vectorDotProduct(vecOne,vecTwo);if(dot>1&&dot<1+c3dl.TOLERANCE){dot=1;}
else if(dot<-1&&dot>-1-c3dl.TOLERANCE){dot=-1;}
return c3dl.radiansToDegrees(Math.acos(dot));}