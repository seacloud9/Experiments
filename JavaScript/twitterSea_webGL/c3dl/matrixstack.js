
c3dl.ModelView=[];c3dl.Projection=[];var matrixList=[];for(var i=0;i<1000;i++){matrixList[i]=c3dl.makeMatrix();}
matrixListPos=0;c3dl.CurrentStackPointer=c3dl.ModelView;c3dl.ModelView.push(c3dl.makeIdentityMatrix());c3dl.Projection.push(c3dl.makeIdentityMatrix());c3dl.matrixMode=function(mode)
{if(mode==c3dl.PROJECTION)
{c3dl.CurrentStackPointer=c3dl.Projection;}
else if(mode==c3dl.MODELVIEW)
{c3dl.CurrentStackPointer=c3dl.ModelView;}}
c3dl.pushMatrix=function()
{c3dl.copyMatrix(c3dl.peekMatrix(),matrixList[matrixListPos]);c3dl.CurrentStackPointer.push(matrixList[matrixListPos]);matrixListPos++;}
c3dl.loadMatrix=function(matrix)
{if(matrix)
{c3dl.CurrentStackPointer[c3dl.getMatrixStackHeight()-1]=matrix;}
else
{c3dl.loadMatrix(c3dl.makeIdentityMatrix());}}
c3dl.loadIdentity=function()
{c3dl.loadMatrix(c3dl.makeIdentityMatrix())}
c3dl.popMatrix=function()
{if(c3dl.getMatrixStackHeight()>1)
{c3dl.CurrentStackPointer.pop();matrixListPos--;}}
c3dl.multMatrix=function(matrix)
{c3dl.copyMatrix(c3dl.peekMatrix(),c3dl.mat1);c3dl.loadMatrix(c3dl.multiplyMatrixByMatrix(c3dl.mat1,matrix,c3dl.peekMatrix()));}
c3dl.peekMatrix=function()
{return c3dl.CurrentStackPointer[c3dl.getMatrixStackHeight()-1];}
c3dl.getMatrixStackHeight=function()
{return c3dl.CurrentStackPointer.length;}
c3dl.translate=function(translateX,translateY,translateZ)
{var translateMatrix=c3dl.makePoseMatrix([1,0,0],[0,1,0],[0,0,1],[translateX,translateY,translateZ]);c3dl.multMatrix(translateMatrix);}
c3dl.rotate=function(angle,rotationX,rotationY,rotationZ)
{}
c3dl.scale=function(scaleX,scaleY,scaleZ)
{var scaleMatrix=c3dl.makeIdentityMatrix();scaleMatrix[0]=scaleX;scaleMatrix[5]=scaleY;scaleMatrix[10]=scaleZ;c3dl.multMatrix(scaleMatrix);}