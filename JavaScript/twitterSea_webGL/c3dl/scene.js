
c3dl.Scene=function()
{var glCanvas3D=null;var renderer=null;var camera=null;var projMat=null;this.pick;this.pickingPrecision=c3dl.PICK_PRECISION_TRIANGLES;this.pickingHandler;this.boundingVolumesVisible=false;var skyModel=null;var objList=[];var lightList=[c3dl.MAX_LIGHTS];var pointAttenuation=c3dl.makeVector(1,0,0);var pointSize=5;var pointRenderingMode=c3dl.POINT_MODE_SPHERE;var pauseRender=false;var exitRender=false;var pauseUpdate=false;var canvasTag=null;var canvas2Dlist=[];var kybdHandler=null;var mouseHandler=null;var updateHandler=null;var lastTimeTaken=Date.now();var numFramesSinceSceneStart=0;var FPS=0;var FPS_Counter=0;var FPS_LastTimeTaken=Date.now();var backgroundColor=c3dl.makeVector(c3dl.DEFAULT_BG_RED,c3dl.DEFAULT_BG_GREEN,c3dl.DEFAULT_BG_BLUE);var ambientLight=c3dl.makeVector(1,1,1);var thisScn=null;var textureQueue=[];var pointPositions=null;var frustumCulling=new c3dl.Frustum();var culling="BoundingSphere"
var collision=false;var collisionList=[];var collisionDetection=new c3dl.CollisionDetection();var collisionType="Collada";this.curContextCache={attributes:{},locations:{}};this.getPointAttenuation=function()
{return[pointAttenuation[0],pointAttenuation[1],pointAttenuation[2]];}
this.getProjectionMatrix=function()
{return projMat;}
this.getBoundingVolumeVisibility=function()
{return this.boundingVolumesVisible;}
this.getCamera=function()
{return camera;}
this.getObjListSize=function()
{return objList.length;}
this.getGL=function()
{return glCanvas3D;}
this.getTotalFrameCount=function()
{return numFramesSinceSceneStart;}
this.getFPS=function()
{return FPS;}
this.getRenderer=function()
{return renderer;}
this.getScene=function()
{return thisScn;}
this.getSkyModel=function()
{return skyModel;}
this.getAmbientLight=function()
{return[ambientLight[0],ambientLight[1],ambientLight[2]];}
this.getObj=function(indxNum)
{if(isNaN(indxNum))
{c3dl.debug.logWarning("Scene::getObj() called with a parameter that's not a number");return null;}
if(indxNum<0||indxNum>=objList.length)
{c3dl.debug.logWarning("Scene::getObj() called with "+indxNum+", which is not betwen 0 and "+objList.length);return null;}
return objList[indxNum];}
this.getPickingPrecision=function()
{return this.pickingPrecision;}
this.setBoundingVolumeVisibility=function(visible)
{this.boundingVolumesVisible=visible;}
this.setKeyboardCallback=function(keyUpCB,keyDownCB)
{if(canvasTag)
{if(keyUpCB!=null)document.addEventListener("keyup",keyUpCB,false);if(keyDownCB!=null)document.addEventListener("keydown",keyDownCB,false);}}
this.setMouseCallback=function(mouseUpCB,mouseDownCB,mouseMoveCB,mouseScrollCB)
{if(canvasTag)
{if(mouseMoveCB!=null)canvasTag.addEventListener("mousemove",mouseMoveCB,false);if(mouseUpCB!=null)canvasTag.addEventListener("mouseup",mouseUpCB,false);if(mouseDownCB!=null)canvasTag.addEventListener("mousedown",mouseDownCB,false);if(mouseScrollCB!=null)
{canvasTag.addEventListener("DOMMouseScroll",mouseScrollCB,false);canvasTag.addEventListener("mousewheel",mouseScrollCB,false);}}}
this.setPickingCallback=function(pickingHandler)
{if(pickingHandler&&pickingHandler instanceof Function)
{this.pick=new c3dl.Picking(this);this.pickingHandler=pickingHandler;canvasTag.addEventListener("mousedown",this.pick.onMouseDown,false);}
else
{c3dl.debug.logWarning("scene's setPickingCallback() was passed an invalid callback function");}}
this.getPickingCallback=function()
{return this.pickingHandler;}
this.setPointAttenuation=function(attn)
{if(attn.length==3&&(attn[0]>0||attn[1]>0||attn[2]>0))
{pointAttenuation[0]=attn[0];pointAttenuation[1]=attn[1];pointAttenuation[2]=attn[2];}}
this.getPointSize=function()
{return pointSize;}
this.setPointSize=function(size)
{if(size>0)
{pointSize=size;}}
this.setSkyModel=function(sky)
{if(sky instanceof c3dl.Collada)
{skyModel=sky;}
else
{c3dl.debug.Warning("Scene::setSkyModel() Inavlid argument passed, was not c3dl.Collada.");}}
this.setUpdateCallback=function(updateCB)
{if(canvasTag)
{if(updateCB!=null)
{updateHandler=updateCB;}}}
this.setRenderer=function(renderType)
{if(renderType instanceof c3dl.WebGL)
{renderer=renderType;}}
this.setCanvasTag=function(canvasTagID)
{canvasTag=document.getElementById(canvasTagID);if(canvasTag==null)
{c3dl.debug.logWarning('Scene::setCanvasTag() No canvas tag with name '+canvasTagID+' was found.');}}
this.getCanvas=function()
{return canvasTag;}
this.setCamera=function(cam)
{if(cam instanceof c3dl.FreeCamera||cam instanceof c3dl.OrbitCamera)
{camera=cam;return true;}
c3dl.debug.logWarning('Scene::setCamera() invalid type of camera.');return false;}
this.setPickingPrecision=function(precision)
{if(precision==c3dl.PICK_PRECISION_BOUNDING_VOLUME||precision==c3dl.PICK_PRECISION_TRIANGLE)
{this.pickingPrecision=precision;}}
this.addFloatingText=function(text,fontStyle,fontColour,backgroundColour)
{var box=this.addTextToModel(null,text,fontStyle,fontColour,backgroundColour);box.stayInFrontOfCamera=true;this.addObjectToScene(box);}
this.addTextToModel=function(model,text,fontStyle,fontColour,backgroundColour)
{var tempSpan=document.createElement('span');var tempSpanStyle=document.createElement('style');var tempSpanStyleContent=document.createTextNode('span{'+'font: '+fontStyle+';'+'color: '+fontColour+'; '+'background: '+backgroundColour+';}');var tempText=document.createTextNode(text);tempSpanStyle.appendChild(tempSpanStyleContent);tempSpan.appendChild(tempSpanStyle);tempSpan.appendChild(tempText);document.body.appendChild(tempSpan);var actualStringWidth=tempSpan.offsetWidth;var actualStringHeight=tempSpan.offsetHeight;var stringWidth=c3dl.roundUpToNextPowerOfTwo(tempSpan.offsetWidth);var stringHeight=c3dl.roundUpToNextPowerOfTwo(tempSpan.offsetHeight);tempSpan.removeChild(tempSpanStyle);document.body.removeChild(tempSpan);var box;if(model==null)
{var whRatio=stringWidth/stringHeight;var smallCanvasVertices=[[-1.0*(whRatio/2),-1.0,0.0],[-1.0*(whRatio/2),1.0,0.0],[1.0*(whRatio/2),1.0,0.0],[1.0*(whRatio/2),-1.0,0.0],];var smallCanvasNormals=[[0,0,-1]];var smallCanvasUVs=[[0.0,1.0],[0.0,0.0],[1.0,0.0],[1.0,1.0]];var smallCanvasFaces=[[0,0,0],[3,3,0],[2,2,0],[0,0,0],[2,2,0],[1,1,0]];box=new Model();box.init(smallCanvasVertices,smallCanvasNormals,smallCanvasUVs,smallCanvasFaces);box.setPosition([5,0,5]);}
else box=model;var textureCanvas=this.create2Dcanvas(stringWidth,stringHeight);if(textureCanvas.getContext)
{var ctx=textureCanvas.getContext('2d');if(fontStyle)ctx.mozTextStyle=fontStyle;if(backgroundColour)
{ctx.fillStyle=backgroundColour;ctx.fillRect(0,0,stringWidth,stringHeight);}
ctx.translate((stringWidth-actualStringWidth)/2,stringHeight-(stringHeight-actualStringHeight));if(fontColour)ctx.fillStyle=fontColour;else ctx.fillStyle='black';ctx.mozDrawText(text);box.setTextureFromCanvas2D(textureCanvas.id);}
else c3dl.debug.logWarning("addFloatingText(): call to create2Dcanvas() failed");return box;}
this.create2Dcanvas=function(width,height)
{var newCanvas=document.createElement('canvas');newCanvas.id='changemetorandomstring';newCanvas.width=width;newCanvas.height=height;canvasTag.appendChild(newCanvas);canvas2Dlist.push(newCanvas);return newCanvas;}
this.setBackgroundColor=function(bgColor)
{if(bgColor.length>=3)
{backgroundColor=[bgColor[0],bgColor[1],bgColor[2]];if(renderer)
{renderer.setClearColor(backgroundColor);}}}
this.setPointRenderingMode=function(mode)
{if(mode==c3dl.POINT_MODE_POINT||mode==c3dl.POINT_MODE_SPHERE)
{pointRenderingMode=mode;}
else
{c3dl.debug.logWarning("Invalid mode passed to setPointRenderingMode");}}
this.getPointRenderingMode=function()
{return pointRenderingMode;}
this.getBackgroundColor=function()
{return c3dl.copyVector(backgroundColor);}
this.setAmbientLight=function(light)
{if(light.length>=3)
{ambientLight=[light[0],light[1],light[2],1];}}
this.init=function()
{if(renderer!=null&&canvasTag!=null)
{if(!renderer.createRenderer(canvasTag))
{c3dl.debug.logError("Your browser does not support WebGL.<br />"+"Visit the <a href='http://en.wikipedia.org/wiki/WebGL'>WebGL wiki page</a> for information on downloading a WebGL enabled browser");return false;}
glCanvas3D=renderer.getGLContext();this.setBackgroundColor(backgroundColor);thisScn=this;for(var i=0,len=lightList.length;i<len;i++)
{lightList[i]=null;}
return renderer.init(canvasTag.width,canvasTag.height);}
c3dl.debug.logError('Scene::createScene() No renderer was specified.');return false;}
this.getLight=function(name)
{for(var i=0,len=lightList.length;i<len;i++)
{if(lightList[i]&&lightList[i].getName()==name)
{return lightList[i];}}
return null;}
this.addLight=function(light)
{for(var i=0;i<c3dl.MAX_LIGHTS;i++)
{if(lightList[i]==null)
{lightList[i]=light;return true;}}
return false;}
this.removeLight=function(light)
{var lightID=-1;for(var i=0;i<lightList.length&&lightID==-1;i++)
{if(lightList[i]&&(lightList[i].getName()==light||lightList[i]===light))
{lightID=i;}}
if(lightID!=-1)
{lightList[lightID]=null;renderer.clearLight(lightID,this);}
return(lightID==-1?false:true);}
this.updateLights=function()
{renderer.updateAmbientLight(this.getAmbientLight(),this);renderer.updateLights(lightList,this);}
this.addObjectToScene=function(obj)
{var type=obj.getObjectType();switch(type)
{case c3dl.LINE:case c3dl.POINT:case c3dl.PARTICLE_SYSTEM:case c3dl.COLLADA:case c3dl.SHAPE:objList.push(obj);return true;}
c3dl.debug.logWarning("Scene::addObjectToScene() called with an invalid argument.");return false;}
this.removeObjectFromScene=function(obj)
{var isFound=false;if(obj instanceof c3dl.Primitive||obj instanceof c3dl.Point||obj instanceof c3dl.Line||obj instanceof c3dl.ParticleSystem)
{for(var i=0,len=objList.length;i<len;i++)
{if(objList[i]==obj)
{objList.splice(i,1);isFound=true;}}}
else
{c3dl.debug.logWarning('Scene::removeObjectFromScene() called with an invalid argument.');}
return isFound;}
this.render=function()
{var sec=(new Date().getTime()-FPS_LastTimeTaken)/1000;FPS_Counter++;var fps=FPS_Counter/sec;if(sec>0.5)
{FPS=fps;FPS_Counter=0;FPS_LastTimeTaken=new Date().getTime();}
if(exitRender)
{if(c3dl.debug.SHARK===true)
{stopShark();disconnectShark();}
return;}
if(pauseUpdate){lastTimeTaken=Date.now();}
if(!pauseUpdate){camera.update(Date.now()-lastTimeTaken);thisScn.updateObjects(Date.now()-lastTimeTaken);lastTimeTaken=Date.now();}
if(!pauseRender){if(textureQueue.length>0)
{for(var i=0,len=textureQueue.length;i<len;i++)
{renderer.addTexture(textureQueue[i]);}
textureQueue=[];}
renderer.clearBuffers();camera.applyToWorld(canvasTag.width/canvasTag.height);projMat=camera.getProjectionMatrix();thisScn.updateLights();thisScn.renderObjects(glCanvas3D);}
numFramesSinceSceneStart++;}
this.refresh=function(){thisScn.render();requestAnimFrame(thisScn.refresh);}
this.startScene=function()
{if(c3dl.debug.SHARK===true)
{connectShark();startShark();}
numFramesSinceSceneStart=0;frameCounter=0;if(glCanvas3D==null)return false;if(renderer==null)return false;if(camera==null)return false;lastTimeTaken=Date.now();if(typeof(benchmarkSetupDone)=="function")benchmarkSetupDone();this.refresh();this.setAmbientLight([ambientLight[0],ambientLight[1],ambientLight[2]]);}
this.updateObjects=function(timeElapsed)
{if(updateHandler!=null)
{updateHandler(timeElapsed);}
collisionList=[];for(var i=0,len=objList.length;i<len;i++)
{switch(objList[i].getObjectType()){case c3dl.PARTICLE_SYSTEM:objList[i].update(timeElapsed);break;case c3dl.COLLADA:case c3dl.SHAPE:objList[i].update(timeElapsed);if(collision){for(var j=i,len2=objList.length;j<len2;j++){if(objList[j].getObjectType()==c3dl.COLLADA&&i!==j){if(collisionDetection.checkObjectCollision(objList[i],objList[j],timeElapsed,collisionType)){collisionList.push(objList[i]);collisionList.push(objList[j]);}}}}
break;}}
if(skyModel){skyModel.update(timeElapsed);skyModel.setPosition(camera.getPosition());}}
this.renderObjects=function()
{if(skyModel)
{glCanvas3D.frontFace(glCanvas3D.CW);glCanvas3D.cullFace(glCanvas3D.BACK);glCanvas3D.disable(glCanvas3D.DEPTH_TEST);var prevAmbient=this.getAmbientLight();var lightState=renderer.getLighting();renderer.setLighting(false);renderer.updateAmbientLight([1,1,1],this);skyModel.render(glCanvas3D,this);renderer.setLighting(lightState);renderer.updateAmbientLight(prevAmbient,this);glCanvas3D.enable(glCanvas3D.DEPTH_TEST);}
glCanvas3D.enable(glCanvas3D.CULL_FACE);glCanvas3D.frontFace(glCanvas3D.CCW);glCanvas3D.cullFace(glCanvas3D.BACK);var particleSystems=[];for(var i=0,len=objList.length;i<len;i++)
{if(objList[i].getObjectType()==c3dl.PARTICLE_SYSTEM)
{particleSystems.push(objList[i]);}
if(objList[i].getObjectType()==c3dl.COLLADA||objList[i].getObjectType()==c3dl.SHAPE)
{var checker;var cam=this.getCamera();var projMatrix=cam.projMatrix;var viewMatrix=cam.viewMatrix;c3dl.multiplyMatrixByMatrix(projMatrix,viewMatrix,c3dl.mat1);frustumCulling.init(c3dl.mat1);var boundingVolume=objList[i].getBoundingVolume();if(culling==="BoundingSphere"){if(frustumCulling.sphereInFrustum(boundingVolume)){objList[i].setInsideFrustum(true);objList[i].render(glCanvas3D,this);}
else{objList[i].setInsideFrustum(false);}}
if(culling==="AABB"){if(frustumCulling.aabbInfrustum(boundingVolume.aabb.maxMins)){objList[i].setInsideFrustum(true);objList[i].render(glCanvas3D,this);}
else{objList[i].setInsideFrustum(false);}}
if(culling==="OBB"){if(frustumCulling.obbInfrustum(boundingVolume.obb.boxVerts)){objList[i].setInsideFrustum(true);objList[i].render(glCanvas3D,this);}
else{objList[i].setInsideFrustum(false);}}
if(culling==="All"){if(frustumCulling.sphereInFrustum(boundingVolume)&&frustumCulling.aabbInfrustum(boundingVolume.aabb.maxMins)&&frustumCulling.obbInfrustum(boundingVolume.obb.boxVerts)){objList[i].setInsideFrustum(true);objList[i].render(glCanvas3D,this);}
else{objList[i].setInsideFrustum(false);}}
else{objList[i].render(glCanvas3D,this);}}}
pointPositions=new Array();pointColors=new Array();var currPoint=0;for(var i=0,len=objList.length;i<len;i++)
{if(objList[i].getObjectType()==c3dl.POINT&&objList[i].isVisible())
{pointPositions.push(objList[i].getPosition()[0]);pointPositions.push(objList[i].getPosition()[1]);pointPositions.push(objList[i].getPosition()[2]);pointColors.push(objList[i].getColor()[0]);pointColors.push(objList[i].getColor()[1]);pointColors.push(objList[i].getColor()[2]);}}
renderer.renderPoints(pointPositions,pointColors,pointAttenuation,this.getPointRenderingMode(),pointSize,this);var lines=[];for(var j=0,len=objList.length;j<len;j++)
{if(objList[j].getObjectType()==c3dl.LINE&&objList[j].isVisible())
{lines.push(objList[j]);}}
renderer.renderLines(lines,this);for(var i=0,len=particleSystems.length;i<len;i++)
{particleSystems[i].render(glCanvas3D,this);}}
this.stopScene=function(){exitRender=true;}
this.unpauseSceneRender=function(){pauseRender=false;}
this.pauseSceneRender=function(){pauseRender=true;}
this.unpauseSceneUpdate=function(){pauseUpdate=false;}
this.pauseSceneUpdate=function(){pauseUpdate=true;}
this.unpauseScene=function(){pauseRender=false;pauseUpdate=false;}
this.pauseScene=function(){pauseRender=true;pauseUpdate=true;}
this.getCollision=function(){return collisionList;}
this.setCollision=function(truefalse){collision=truefalse;}
this.setCollisionType=function(type){collisionType=type;}
this.setCulling=function(type){culling=type;}
this.preloadImages=function(imagePaths)
{if(textureManager)
{for(var i=0,len=imagePaths.length;i<len;i++)
{textureManager.addTexture(imagePaths[i]);}}
else
{c3dl.debug.logError("preloadImage() must be called after Scene's init()");}}}