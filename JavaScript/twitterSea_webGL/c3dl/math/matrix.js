
c3dl.isValidMatrix=function(mat)
{if(mat instanceof Array||mat instanceof MJS_FLOAT_ARRAY_TYPE)
{if(mat.length==16)
{for(var i=0;i<16;i++)
{if(isNaN(mat[i]))return false;}
return true;}}
return false;}
c3dl.makeIdentityMatrix=function()
{return new C3DL_FLOAT_ARRAY([1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0]);}
c3dl.makeZeroMatrix=function()
{return new C3DL_FLOAT_ARRAY([0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]);}
c3dl.setMatrix=function(mat,e00,e01,e02,e03,e10,e11,e12,e13,e20,e21,e22,e23,e30,e31,e32,e33)
{mat[0]=e00;mat[1]=e01;mat[2]=e02;mat[3]=e03;mat[4]=e10;mat[5]=e11;mat[6]=e12;mat[7]=e13;mat[8]=e20;mat[9]=e21;mat[10]=e22;mat[11]=e23;mat[12]=e30;mat[13]=e31;mat[14]=e32;mat[15]=e33;}
c3dl.makeMatrix=function(e00,e01,e02,e03,e10,e11,e12,e13,e20,e21,e22,e23,e30,e31,e32,e33)
{return[!isNaN(e00)?parseFloat(e00):0.0,!isNaN(e01)?parseFloat(e01):0.0,!isNaN(e02)?parseFloat(e02):0.0,!isNaN(e03)?parseFloat(e03):0.0,!isNaN(e10)?parseFloat(e10):0.0,!isNaN(e11)?parseFloat(e11):0.0,!isNaN(e12)?parseFloat(e12):0.0,!isNaN(e13)?parseFloat(e13):0.0,!isNaN(e20)?parseFloat(e20):0.0,!isNaN(e21)?parseFloat(e21):0.0,!isNaN(e22)?parseFloat(e22):0.0,!isNaN(e23)?parseFloat(e23):0.0,!isNaN(e30)?parseFloat(e30):0.0,!isNaN(e31)?parseFloat(e31):0.0,!isNaN(e32)?parseFloat(e32):0.0,!isNaN(e33)?parseFloat(e33):0.0];}
c3dl.matricesEqual=function(matrix1,matrix2)
{var areEqual=true;for(var i=0;areEqual&&i<16;i++)
{if(Math.abs(matrix1[i]-matrix2[i])>c3dl.TOLERANCE)
{areEqual=false;}}
return areEqual;}
c3dl.makePoseMatrix=function(vecLeft,vecUp,vecFrwd,vecPos)
{var mat=new C3DL_FLOAT_ARRAY(16);mat[0]=vecLeft[0];mat[1]=vecLeft[1];mat[2]=vecLeft[2];mat[3]=0.0;mat[4]=vecUp[0];mat[5]=vecUp[1];mat[6]=vecUp[2];mat[7]=0.0;mat[8]=vecFrwd[0];mat[9]=vecFrwd[1];mat[10]=vecFrwd[2];mat[11]=0.0;mat[12]=vecPos[0];mat[13]=vecPos[1];mat[14]=vecPos[2];mat[15]=1.0;return mat;}
c3dl.transposeMatrix=function(mat,dest)
{return M4x4.transpose(mat,dest);}
c3dl.inverseMatrix=function(mat){if(!mat){return}
var kInv=c3dl.mat1;var fA0=mat[0]*mat[5]-mat[1]*mat[4];var fA1=mat[0]*mat[6]-mat[2]*mat[4];var fA2=mat[0]*mat[7]-mat[3]*mat[4];var fA3=mat[1]*mat[6]-mat[2]*mat[5];var fA4=mat[1]*mat[7]-mat[3]*mat[5];var fA5=mat[2]*mat[7]-mat[3]*mat[6];var fB0=mat[8]*mat[13]-mat[9]*mat[12];var fB1=mat[8]*mat[14]-mat[10]*mat[12];var fB2=mat[8]*mat[15]-mat[11]*mat[12];var fB3=mat[9]*mat[14]-mat[10]*mat[13];var fB4=mat[9]*mat[15]-mat[11]*mat[13];var fB5=mat[10]*mat[15]-mat[11]*mat[14];var fDet=fA0*fB5-fA1*fB4+fA2*fB3+fA3*fB2-fA4*fB1+fA5*fB0;if(Math.abs(fDet)<=1e-9){c3dl.debug.logWarning('inverseMatrix() failed due to bad values');return null;}
kInv[0]=+mat[5]*fB5-mat[6]*fB4+mat[7]*fB3;kInv[4]=-mat[4]*fB5+mat[6]*fB2-mat[7]*fB1;kInv[8]=+mat[4]*fB4-mat[5]*fB2+mat[7]*fB0;kInv[12]=-mat[4]*fB3+mat[5]*fB1-mat[6]*fB0;kInv[1]=-mat[1]*fB5+mat[2]*fB4-mat[3]*fB3;kInv[5]=+mat[0]*fB5-mat[2]*fB2+mat[3]*fB1;kInv[9]=-mat[0]*fB4+mat[1]*fB2-mat[3]*fB0;kInv[13]=+mat[0]*fB3-mat[1]*fB1+mat[2]*fB0;kInv[2]=+mat[13]*fA5-mat[14]*fA4+mat[15]*fA3;kInv[6]=-mat[12]*fA5+mat[14]*fA2-mat[15]*fA1;kInv[10]=+mat[12]*fA4-mat[13]*fA2+mat[15]*fA0;kInv[14]=-mat[12]*fA3+mat[13]*fA1-mat[14]*fA0;kInv[3]=-mat[9]*fA5+mat[10]*fA4-mat[11]*fA3;kInv[7]=+mat[8]*fA5-mat[10]*fA2+mat[11]*fA1;kInv[11]=-mat[8]*fA4+mat[9]*fA2-mat[11]*fA0;kInv[15]=+mat[8]*fA3-mat[9]*fA1+mat[10]*fA0;var fInvDet=1.0/fDet;kInv[0]*=fInvDet;kInv[1]*=fInvDet;kInv[2]*=fInvDet;kInv[3]*=fInvDet;kInv[4]*=fInvDet;kInv[5]*=fInvDet;kInv[6]*=fInvDet;kInv[7]*=fInvDet;kInv[8]*=fInvDet;kInv[9]*=fInvDet;kInv[10]*=fInvDet;kInv[11]*=fInvDet;kInv[12]*=fInvDet;kInv[13]*=fInvDet;kInv[14]*=fInvDet;kInv[15]*=fInvDet;return kInv;}
c3dl.matrixDeterminant=function(mat){var fA0=mat[0]*mat[5]-mat[1]*mat[4];var fA1=mat[0]*mat[6]-mat[2]*mat[4];var fA2=mat[0]*mat[7]-mat[3]*mat[4];var fA3=mat[1]*mat[6]-mat[2]*mat[5];var fA4=mat[1]*mat[7]-mat[3]*mat[5];var fA5=mat[2]*mat[7]-mat[3]*mat[6];var fB0=mat[8]*mat[13]-mat[9]*mat[12];var fB1=mat[8]*mat[14]-mat[10]*mat[12];var fB2=mat[8]*mat[15]-mat[11]*mat[12];var fB3=mat[9]*mat[14]-mat[10]*mat[13];var fB4=mat[9]*mat[15]-mat[11]*mat[13];var fB5=mat[10]*mat[15]-mat[11]*mat[14];var fDet=fA0*fB5-fA1*fB4+fA2*fB3+fA3*fB2-fA4*fB1+fA5*fB0;return fDet;}
c3dl.matrixAdjoint=function(mat){var fA0=mat[0]*mat[5]-mat[1]*mat[4];var fA1=mat[0]*mat[6]-mat[2]*mat[4];var fA2=mat[0]*mat[7]-mat[3]*mat[4];var fA3=mat[1]*mat[6]-mat[2]*mat[5];var fA4=mat[1]*mat[7]-mat[3]*mat[5];var fA5=mat[2]*mat[7]-mat[3]*mat[6];var fB0=mat[8]*mat[13]-mat[9]*mat[12];var fB1=mat[8]*mat[14]-mat[10]*mat[12];var fB2=mat[8]*mat[15]-mat[11]*mat[12];var fB3=mat[9]*mat[14]-mat[10]*mat[13];var fB4=mat[9]*mat[15]-mat[11]*mat[13];var fB5=mat[10]*mat[15]-mat[11]*mat[14];var k=new C3DL_FLOAT_ARRAY([mat[5]*fB5-mat[6]*fB4+mat[7]*fB3,-mat[1]*fB5+mat[2]*fB4-mat[3]*fB3,mat[13]*fA5-mat[14]*fA4+mat[15]*fA3,-mat[9]*fA5+mat[10]*fA4-mat[11]*fA3,-mat[4]*fB5+mat[6]*fB2-mat[7]*fB1,mat[0]*fB5-mat[2]*fB2+mat[3]*fB1,-mat[12]*fA5+mat[14]*fA2-mat[15]*fA1,mat[8]*fA5-mat[10]*fA2+mat[11]*fA1,mat[4]*fB4-mat[5]*fB2+mat[7]*fB0,-mat[0]*fB4+mat[1]*fB2-mat[3]*fB0,mat[12]*fA4-mat[13]*fA2+mat[15]*fA0,-mat[8]*fA4+mat[9]*fA2-mat[11]*fA0,-mat[4]*fB3+mat[5]*fB1-mat[6]*fB0,mat[0]*fB3-mat[1]*fB1+mat[2]*fB0,-mat[12]*fA3+mat[13]*fA1-mat[14]*fA0,mat[8]*fA3-mat[9]*fA1+mat[10]*fA0]);return k;}
c3dl.multiplyMatrixByScalar=function(mat,scalar,dest){if(dest==undefined){dest=new C3DL_FLOAT_ARRAY(16);}
for(var i=0;i<16;i++){dest[i]=mat[i]*scalar;}
return dest;}
c3dl.divideMatrixByScalar=function(mat,scalar,dest){if(dest==undefined){dest=new C3DL_FLOAT_ARRAY(16);}
for(var i=0;i<16;i++){dest[i]=mat[i]/scalar;}
return dest;}
c3dl.multiplyMatrixByMatrix=function(matOne,matTwo,dest){return M4x4.mul(matOne,matTwo,dest);}
c3dl.multiplyMatrixByDirection=function(mat,vec,dest)
{if(dest==undefined){dest=new C3DL_FLOAT_ARRAY(3);}
var a=mat[0]*vec[0]+mat[4]*vec[1]+mat[8]*vec[2];var b=mat[1]*vec[0]+mat[5]*vec[1]+mat[9]*vec[2];var c=mat[2]*vec[0]+mat[6]*vec[1]+mat[10]*vec[2];dest[0]=a;dest[1]=b;dest[2]=c;return dest;}
c3dl.multiplyMatrixByVector=function(mat,vec,dest){var len=vec.length;var w=(len==3?1:vec[3]);if(dest==undefined){dest=new C3DL_FLOAT_ARRAY(len);}
var a=mat[0]*vec[0]+mat[4]*vec[1]+mat[8]*vec[2]+mat[12]*w;var b=mat[1]*vec[0]+mat[5]*vec[1]+mat[9]*vec[2]+mat[13]*w;var c=mat[2]*vec[0]+mat[6]*vec[1]+mat[10]*vec[2]+mat[14]*w;var d=mat[3]*vec[0]+mat[7]*vec[1]+mat[11]*vec[2]+mat[15]*w;dest[0]=a;dest[1]=b;dest[2]=c;if(len===4){dest[3]=d;}
return dest;}
c3dl.addMatrices=function(matOne,matTwo){if(dest==undefined){dest=new C3DL_FLOAT_ARRAY(16);}
for(var i=0;i<16;i++){dest[i]=matOne[i]+matTwo[i];}
return dest;}
c3dl.subtractMatrices=function(matOne,matTwo){if(dest==undefined){dest=new C3DL_FLOAT_ARRAY(16);}
for(var i=0;i<16;i++){dest[i]=matOne[i]-matTwo[i];}
return dest;}
c3dl.copyMatrix=function(srcMat,dest){if(dest==undefined){return M4x4.clone(srcMat);}
else{dest[0]=srcMat[0];dest[1]=srcMat[1];dest[2]=srcMat[2];dest[3]=srcMat[3];dest[4]=srcMat[4];dest[5]=srcMat[5];dest[6]=srcMat[6];dest[7]=srcMat[7];dest[8]=srcMat[8];dest[9]=srcMat[9];dest[10]=srcMat[10];dest[11]=srcMat[11];dest[12]=srcMat[12];dest[13]=srcMat[13];dest[14]=srcMat[14];dest[15]=srcMat[15];}}
c3dl.emptyMatrix=function(srcMat){srcMat[0]=0;srcMat[1]=0;srcMat[2]=0;srcMat[3]=0;srcMat[4]=0;srcMat[5]=0;srcMat[6]=0;srcMat[7]=0;srcMat[8]=0;srcMat[9]=0;srcMat[10]=0;srcMat[11]=0;srcMat[12]=0;srcMat[13]=0;srcMat[14]=0;srcMat[15]=0;}