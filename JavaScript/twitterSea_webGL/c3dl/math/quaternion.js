
c3dl.isValidQuat=function(quat)
{if(quat instanceof Array||quat instanceof C3DL_FLOAT_ARRAY)
{if(quat.length==4)
{for(var i=0;i<4;i++)
{if(isNaN(quat[i]))return false;}
return true;}}
return false;}
c3dl.makeQuat=function(newW,newX,newY,newZ)
{var quat=new C3DL_FLOAT_ARRAY(4);quat[0]=!isNaN(newW)?parseFloat(newW):0.0;quat[1]=!isNaN(newX)?parseFloat(newX):0.0;quat[2]=!isNaN(newY)?parseFloat(newY):0.0;quat[3]=!isNaN(newZ)?parseFloat(newZ):0.0;return quat;}
c3dl.quatToMatrix=function(quat,dest)
{var quatToMatrixTx=2.0*quat[1];var quatToMatrixTy=2.0*quat[2];var quatToMatrixTz=2.0*quat[3];var quatToMatrixTwx=quatToMatrixTx*quat[0];var quatToMatrixTwy=quatToMatrixTy*quat[0];var quatToMatrixTwz=quatToMatrixTz*quat[0];var quatToMatrixTxx=quatToMatrixTx*quat[1];var quatToMatrixTxy=quatToMatrixTy*quat[1];var quatToMatrixTxz=quatToMatrixTz*quat[1];var quatToMatrixTyy=quatToMatrixTy*quat[2];var quatToMatrixTyz=quatToMatrixTz*quat[2];var quatToMatrixTzz=quatToMatrixTz*quat[3];if(dest)
{dest[0]=1.0-(quatToMatrixTyy+quatToMatrixTzz);dest[1]=quatToMatrixTxy-quatToMatrixTwz;dest[2]=quatToMatrixTxz+quatToMatrixTwy;dest[3]=0.0;dest[4]=quatToMatrixTxy+quatToMatrixTwz;dest[5]=1.0-(quatToMatrixTxx+quatToMatrixTzz);dest[6]=quatToMatrixTyz-quatToMatrixTwx;dest[7]=0.0;dest[8]=quatToMatrixTxz-quatToMatrixTwy;dest[9]=quatToMatrixTyz+quatToMatrixTwx;dest[10]=1.0-(quatToMatrixTxx+quatToMatrixTyy);dest[11]=0.0;dest[12]=0.0;dest[13]=0.0;dest[14]=0.0;dest[15]=1.0;return dest;}
else
{var newMat=new C3DL_FLOAT_ARRAY(16);newMat[0]=1.0-(quatToMatrixTyy+quatToMatrixTzz);newMat[1]=quatToMatrixTxy+quatToMatrixTwz;newMat[2]=quatToMatrixTxz-quatToMatrixTwy;newMat[3]=0.0;newMat[4]=quatToMatrixTxy-quatToMatrixTwz;newMat[5]=1.0-(quatToMatrixTxx+quatToMatrixTzz);newMat[6]=quatToMatrixTyz+quatToMatrixTwx;newMat[7]=0.0;newMat[8]=quatToMatrixTxz+quatToMatrixTwy;newMat[9]=quatToMatrixTyz-quatToMatrixTwx;newMat[10]=1.0-(quatToMatrixTxx+quatToMatrixTyy);newMat[11]=0.0;newMat[12]=0.0;newMat[13]=0.0;newMat[14]=0.0;newMat[15]=1.0;return newMat;}}
c3dl.quatToAxisAngle=function(axisVec,angleScalar)
{axisVec=makeVector();var sqLength=c3dl.quatLengthSq();if(sqLength>c3dl.TOLERANCE)
{var invLength=c3dl.invSqrt(sqLength);angleScalar=2.0*Math.acos(quat[0]);axisVec[0]=quat[1]*invLength;axisVec[1]=quat[2]*invLength;axisVec[3]=quat[3]*invLength;}
else
{angleScalar=0.0;axisVec=c3dl.makeVector(1.0,0.0,0.0);}}
c3dl.axisAngleToQuathalfAngle;c3dl.axisAngleToQuats;c3dl.axisAngleToQuat=function(axisVec,angleScalar,dest)
{c3dl.axisAngleToQuathalfAngle=0.5*angleScalar;c3dl.axisAngleToQuats=Math.sin(c3dl.axisAngleToQuathalfAngle);if(dest)
{dest[0]=Math.cos(c3dl.axisAngleToQuathalfAngle);dest[1]=c3dl.axisAngleToQuats*axisVec[0];dest[2]=c3dl.axisAngleToQuats*axisVec[1];dest[3]=c3dl.axisAngleToQuats*axisVec[2];return dest;}
else
{var quat=c3dl.makeQuat(Math.cos(c3dl.axisAngleToQuathalfAngle),c3dl.axisAngleToQuats*axisVec[0],c3dl.axisAngleToQuats*axisVec[1],c3dl.axisAngleToQuats*axisVec[2]);return quat;}}
c3dl.matrixToQuat=function(newMat)
{var quat=c3dl.makeQuat();var trace=newMat[0]+newMat[5]+newMat[10]+1;var sqTrace;var s;if(trace>0.0)
{sqTrace=Math.sqrt(trace);s=0.5/sqTrace;quat[0]=0.25/s;quat[1]=(newMat[6]-newMat[9])*s;quat[2]=(newMat[8]-newMat[2])*s;quat[3]=(newMat[1]-newMat[4])*s;}
else
{if(newMat[0]>newMat[5]&&newMat[0]>newMat[10])
{s=2.0*Math.sqrt(1.0+newMat[0]-newMat[5]-newMat[10]);quat[1]=0.25*s;quat[2]=(newMat[1]-newMat[4])/s;quat[3]=(newMat[2]-newMat[8])/s;quat[0]=(newMat[9]-newMat[6])/s;}
else if(newMat[5]>newMat[10])
{s=2.0*Math.sqrt(1.0+newMat[5]-newMat[0]-newMat[10]);quat[1]=(newMat[1]-newMat[4])/s;quat[2]=0.25*s;quat[3]=(newMat[9]-newMat[6])/s;quat[0]=(newMat[2]-newMat[8])/s;}
else
{s=2.0*Math.sqrt(1.0+newMat[10]-newMat[0]-newMat[5]);quat[1]=(newMat[2]-newMat[8])/s;quat[2]=(newMat[9]-newMat[6])/s;quat[3]=0.25*s;quat[0]=(newMat[1]-newMat[4])/s;}}
return quat;}
c3dl.quatLengthSq=function(quat)
{return quat[1]*quat[1]+quat[2]*quat[2]+quat[3]*quat[3];}
c3dl.quatLength=function(quat)
{return Math.sqrt(c3dl.quatLengthSq(quat));}
c3dl.addQuats=function(quatOne,quatTwo)
{var quat=c3dl.makeQuat();for(var i=0;i<4;i++){quat[i]=quatOne[i]+quatTwo[i];}
return quat;}
c3dl.subtractQuats=function(quatOne,quatTwo)
{var quat=c3dl.makeQuat();for(var i=0;i<4;i++){quat[i]=quatOne[i]-quatTwo[i];}
return quat;}
c3dl.multiplyQuatByScalar=function(quatOne,scalar)
{var quat=c3dl.makeQuat();for(var i=0;i<4;i++){quat[i]=quatOne[i]*scalar;}
return quat;}
c3dl.getQuatConjugate=function(quat)
{var nQt=c3dl.makeQuat();nQt[0]=quat[0];nQt[1]=-quat[1];nQt[2]=-quat[2];nQt[3]=-quat[3];return nQt;}
c3dl.quatDotProduct=function(quatOne,quatTwo)
{return quatOne[0]*quatTwo[0]+quatOne[1]*quatTwo[1]+quatOne[2]*quatTwo[2]+quatOne[3]*quatTwo[3];}
c3dl.normalizeQuat=function(quat)
{var newQuat=c3dl.makeQuat();var len=c3dl.quatLength(quat);var invLen=1.0/len;if(len>0.001)
{newQuat[0]=quat[0]*invLen;newQuat[1]=quat[1]*invLen;newQuat[2]=quat[2]*invLen;newQuat[3]=quat[3]*invLen;}
else
{newQuat[0]=0.0;newQuat[1]=0.0;newQuat[2]=0.0;newQuat[3]=0.0;}
return newQuat;}
c3dl.inverseQuat=function(quat)
{var invQuat=c3dl.makeQuat();var norm=0.0;for(var i=0;i<4;i++){norm+=quat[i]*quat[i];}
if(norm>0.0)
{var invNorm=1.0/norm;invQuat[0]=quat[0]*invNorm;invQuat[1]=-quat[1]*invNorm;invQuat[2]=-quat[2]*invNorm;invQuat[3]=-quat[3]*invNorm;}
return invQuat;}