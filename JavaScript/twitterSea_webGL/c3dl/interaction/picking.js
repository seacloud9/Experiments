
c3dl.Picking=function(scene)
{var scn=scene;var cam=scn.getCamera();this.onMouseDown=function(event)
{cam=scn.getCamera();var canvasTag=scn.getCanvas();var clickedCanvasCoords=getClickedCoords(event);var normalizedDeviceCoords=[(2*clickedCanvasCoords[0]/canvasTag.width)-1,-((2*clickedCanvasCoords[1]/canvasTag.height)-1),1,1];var iproj=c3dl.inverseMatrix(scene.getProjectionMatrix());var clipCoords=c3dl.multiplyMatrixByVector(iproj,normalizedDeviceCoords);clipCoords[0]/=clipCoords[3];clipCoords[1]/=clipCoords[3];clipCoords[2]/=clipCoords[3];clipCoords[2]=-clipCoords[2];var rayInitialPoint=cam.getPosition();var x=clipCoords[0];var y=clipCoords[1];var z=clipCoords[2];var kludge=c3dl.multiplyVector(cam.getLeft(),-1);var viewMatrix=c3dl.makePoseMatrix(kludge,cam.getUp(),cam.getDir(),cam.getPosition());var rayTerminalPoint=c3dl.multiplyMatrixByVector(viewMatrix,new C3DL_FLOAT_ARRAY([x,y,z,0]));var rayDir=c3dl.normalizeVector(rayTerminalPoint);var passedBoundsTest=new Array();for(var i=0,len=scn.getObjListSize();i<len;i++)
{var currObj=scn.getObj(i);if((currObj instanceof c3dl.Collada||currObj.getObjectType()===c3dl.SHAPE)&&currObj.getPickable()&&currObj.isVisible()&&currObj.isInsideFrustum())
{if(currObj.rayIntersectsEnclosures(rayInitialPoint,rayDir))
{passedBoundsTest.push(currObj);}}}
var objectsPicked=new Array();if(scn.getPickingPrecision()==c3dl.PICK_PRECISION_BOUNDING_VOLUME)
{objectsPicked=passedBoundsTest;}
else
{for(var i=0,len=passedBoundsTest.length;i<len;i++)
{var currObject=passedBoundsTest[i];if(currObject.getObjectType()===c3dl.SHAPE){objectsPicked.push(passedBoundsTest[i]);}
else{if(currObject.rayIntersectsTriangles(rayInitialPoint,rayDir))
{objectsPicked.push(passedBoundsTest[i]);}}}}
var projMatrix=cam.getProjectionMatrix();var viewMatrix=cam.getViewMatrix();var viewProjMatrix=c3dl.multiplyMatrixByMatrix(projMatrix,viewMatrix);if(scn.getPointRenderingMode()==c3dl.POINT_MODE_POINT)
{for(var i=0,len=scn.getObjListSize();i<len;i++)
{if(scn.getObj(i)instanceof c3dl.Point)
{var attenuation=scene.getPointAttenuation();var point=scn.getObj(i);var pointCoords=point.getPosition();var d=c3dl.vectorLength(c3dl.subtractVectors(pointCoords,cam.getPosition()));var pointPixelSize=1.0/(attenuation[0]+(attenuation[1]*d)+(attenuation[2]*d*d));var worldSpaceCoords=[pointCoords[0],pointCoords[1],pointCoords[2],1];var clipCoords=c3dl.multiplyMatrixByVector(viewProjMatrix,worldSpaceCoords);var normalizedDeviceCoords=[clipCoords[0]/clipCoords[3],clipCoords[1]/clipCoords[3],clipCoords[2]/clipCoords[3]];var viewportCoords=[(normalizedDeviceCoords[0]+1)/2*canvasTag.width,(1-normalizedDeviceCoords[1])/2*canvasTag.height];if(isPointInSquare(clickedCanvasCoords,viewportCoords,pointPixelSize))
{objectsPicked.push(point);}}}}
else if(scn.getPointRenderingMode()==c3dl.POINT_MODE_SPHERE)
{for(var i=0,len=scn.getObjListSize();i<len;i++)
{if(scn.getObj(i)instanceof c3dl.Point)
{if(c3dl.rayIntersectsSphere(rayInitialPoint,rayDir,scn.getObj(i).getPosition(),scn.getPointSize()))
{objectsPicked.push(scn.getObj(i));}}}}
c3dl.sortObjectsFromCam(scn,cam,objectsPicked);var pickingCB=scn.getPickingCallback();var pickingResult=createPickingResult(canvasTag,event.which,objectsPicked);pickingCB(pickingResult);}
function createPickingResult(cvs,btnUsed,objList)
{var pickingObj=new c3dl.PickingResult();pickingObj["canvas"]=cvs;pickingObj["getCanvas"]=function()
{return this.canvas;};pickingObj["buttonUsed"]=btnUsed;pickingObj["getButtonUsed"]=function()
{return this.buttonUsed;};pickingObj['objects']=objList;pickingObj['getObjects']=function()
{return this.objects;};return pickingObj;}
function isPointInSquare(pointCoords,squareCoords,squareSize)
{if(pointCoords[0]>=squareCoords[0]-squareSize/2&&pointCoords[0]<=squareCoords[0]+squareSize/2&&pointCoords[1]>=squareCoords[1]-squareSize/2&&pointCoords[1]<=squareCoords[1]+squareSize/2)
{return true;}
return false;}
function isPointInCircle(pointCoords,circleCoords,circleDiameter)
{var vec=[pointCoords[0]-circleCoords[0],pointCoords[1]-circleCoords[1]];var d=Math.sqrt((vec[0]*vec[0])+(vec[1]*vec[1]));return(d<circleDiameter/2?true:false);}
function getClickedCoords(event)
{var canvas=scn.getCanvas();var canvasPosition=c3dl.getObjectPosition(scn.getCanvas());var X=event.clientX-canvasPosition[0]+window.pageXOffset-1;var Y=event.clientY-canvasPosition[1]+window.pageYOffset-1;return[X,Y];}}
c3dl.sortObjectsFromCam=function(scene,camera,pickedObjects)
{var cameraPos=camera.getPosition();var objAPos,objBPos;var distA,distB;var camToObjADist,camToObjBDist;var temp;for(var i=0,len=pickedObjects.length;i<len;i++)
{for(var j=0,len2=pickedObjects.length;j<len2;j++)
{objAPos=pickedObjects[i].getPosition();objBPos=pickedObjects[j].getPosition();camToObjADist=c3dl.subtractVectors(cameraPos,objAPos);camToObjBDist=c3dl.subtractVectors(cameraPos,objBPos);distA=c3dl.vectorLength(camToObjADist);distB=c3dl.vectorLength(camToObjBDist);if(distA<distB)
{temp=pickedObjects[i];pickedObjects[i]=pickedObjects[j];pickedObjects[j]=temp;}}}
return pickedObjects;}
c3dl.rayIntersectsSphere=function(rayInitialPoint,rayD,spherePos,sphereRadius)
{var hasIntersected=false;var rayDir=c3dl.normalizeVector(rayD);var v=c3dl.subtractVectors(rayInitialPoint,spherePos);var a=c3dl.vectorDotProduct(rayDir,rayDir)
var b=2.0*c3dl.vectorDotProduct(v,rayDir);var c=c3dl.vectorDotProduct(v,v)-(sphereRadius*sphereRadius);var discriminant=(b*b)-(4.0*a*c);var q;if(discriminant>=0)
{var discriminantsqrt=Math.sqrt(discriminant);if(b<0){q=(-b-discriminantsqrt)/2;}
else{q=(-b+discriminantsqrt)/2;}
var t0=q/a;var t1=c/q;if(t0>t1)
{var temp=t0;t0=t1;t1=temp;}
if(t1<0){return false;}
if(t1>0||t0>0){hasIntersected=true;}}
return hasIntersected;}
c3dl.rayIntersectsTriangle=function(orig,dir,vert0,vert1,vert2)
{var edge1=c3dl.subtractVectors(vert1,vert0);var edge2=c3dl.subtractVectors(vert2,vert0);var area=0.5*c3dl.vectorLength(c3dl.vectorCrossProduct(edge1,edge2));var norm=c3dl.vectorCrossProduct(edge1,edge2);var normDotDir=c3dl.vectorDotProduct(norm,dir);if(normDotDir==0)
{return false;}
var d=c3dl.vectorDotProduct(norm,vert1);var normDotRayorig=c3dl.vectorDotProduct(norm,orig);var t=(d-normDotRayorig)/normDotDir;var scaledDir=c3dl.multiplyVector(dir,t);var POI=c3dl.addVectors(orig,scaledDir);c3dl.subtractVectors(vert0,POI,edge1);c3dl.subtractVectors(vert1,POI,edge2);edge3=c3dl.subtractVectors(vert2,POI);var area1=0.5*c3dl.vectorLength(c3dl.vectorCrossProduct(edge1,edge2,c3dl.vec1));var area2=0.5*c3dl.vectorLength(c3dl.vectorCrossProduct(edge2,edge3,c3dl.vec1));var area3=0.5*c3dl.vectorLength(c3dl.vectorCrossProduct(edge3,edge1,c3dl.vec1));var diff=area-(area1+area2+area3);if(Math.abs(diff)<=c3dl.TOLERANCE){var otherdir=c3dl.subtractVectors(POI,orig);var normOtherDir=c3dl.normalizeVector(otherdir);var normDir=c3dl.normalizeVector(dir);var angle=c3dl.getAngleBetweenVectors(normOtherDir,normDir);if(angle<90){return true;}
else{return false;}}
else{return false;}}
c3dl.rayAABBIntersect=function(orig,dir,maxMins){var tmin,tmax,tymin,tymax,tzmin,tzmax;var divx=1/dir[0];var divy=1/dir[1];var divz=1/dir[2];if(divx>=0){tmin=(maxMins[1]-orig[0])*divx;tmax=(maxMins[0]-orig[0])*divx;}
else{tmin=(maxMins[0]-orig[0])*divx;tmax=(maxMins[1]-orig[0])*divx;}
if(divy>=0){tymin=(maxMins[3]-orig[1])*divy;tymax=(maxMins[2]-orig[1])*divy;}
else{tymin=(maxMins[2]-orig[1])*divy;tymax=(maxMins[3]-orig[1])*divy;}
if((tmin>tymax)||(tymin>tmax)){return false;}
if(tymin>tmin){tmin=tymin;}
if(tymax<tmax){tmax=tymax;}
if(divz>=0){tzmin=(maxMins[5]-orig[2])*divz;tzmax=(maxMins[4]-orig[2])*divz;}
else{tzmin=(maxMins[4]-orig[2])*divz;tzmax=(maxMins[5]-orig[2])*divz;}
if((tmin>tzmax)||(tzmin>tmax)){return false;}
if(tzmin>tmin){tmin=tzmin;}
if(tzmax<tmax){tmax=tzmax;}
return true;}
c3dl.rayOBBIntersect=function(orig,dir,pos,axis,sizes){var tmin,tmax,tymin,tymax,tzmin,tzmax;var divx=1/dir[0]*axis[0];var divy=1/dir[1]*axis[1];var divz=1/dir[2]*axis[2];if(divx>=0){tmin=(pos[0]*axis[0]-sizes[0]-orig[0]*axis[0])*divx;tmax=(pos[0]*axis[0]+sizes[0]-orig[0]*axis[0])*divx;}
else{tmin=(pos[0]*axis[0]+sizes[0]-orig[0]*axis[0])*divx;tmax=(pos[0]*axis[0]-sizes[0]-orig[0]*axis[0])*divx;}
if(divy>=0){tymin=(pos[1]*axis[1]-sizes[1]-orig[1]*axis[1])*divy;tymax=(pos[1]*axis[1]+sizes[1]-orig[1]*axis[1])*divy;}
else{tymin=(pos[1]*axis[1]+sizes[1]-orig[1]*axis[1])*divy;tymax=(pos[1]*axis[1]-sizes[1]-orig[1]*axis[1])*divy;}
if((tmin>tymax)||(tymin>tmax)){return false;}
if(tymin>tmin){tmin=tymin;}
if(tymax<tmax){tmax=tymax;}
if(divz>=0){tzmin=(pos[2]*axis[2]-sizes[2]-orig[2]*axis[2])*divz;tzmax=(pos[2]*axis[2]+sizes[2]-orig[2]*axis[2])*divz;}
else{tzmin=(pos[2]*axis[2]+sizes[2]-orig[2]*axis[2])*divz;tzmax=(pos[2]*axis[2]-sizes[2]-orig[2]*axis[2])*divz;}
if((tmin>tzmax)||(tzmin>tmax)){return false;}
if(tzmin>tmin){tmin=tzmin;}
if(tzmax<tmax){tmax=tzmax;}
return true;}