
c3dl.sepia_callback=function(renderingObj,scene)
{var progObjID=renderingObj.getProgramObjectID();var renderer=renderingObj.getRenderer();var geometry=renderingObj.getGeometry();var gl=renderingObj.getContext();var effect=geometry.getEffect();gl.useProgram(progObjID);renderer.setUniformf(progObjID,"color",effect.getParameter("color"),scene,"sepia");var modelViewMatrix=c3dl.peekMatrix();c3dl.matrixMode(c3dl.PROJECTION);var projectionMatrix=c3dl.peekMatrix();c3dl.matrixMode(c3dl.MODELVIEW);var modelViewProjMatrix=c3dl.multiplyMatrixByMatrix(projectionMatrix,modelViewMatrix);renderer.setUniformMatrix(progObjID,"modelViewMatrix",modelViewMatrix,scene,"sepia");renderer.setUniformMatrix(progObjID,"modelViewProjMatrix",modelViewProjMatrix,scene,"sepia");for(var coll=0;coll<geometry.getPrimitiveSets().length;coll++)
{var currColl=geometry.getPrimitiveSets()[coll];var mat=currColl.getMaterial();if(mat)
{renderer.setUniformi(progObjID,"usingMaterial",false,scene,"sepia"+coll);}
else
{renderer.setUniformi(progObjID,"usingMaterial",false,scene,"sepia"+coll);}
var normalAttribLoc=scene.curContextCache.attributes["sepia"+coll+"Normal"];if(normalAttribLoc==undefined){normalAttribLoc=gl.getAttribLocation(progObjID,"Normal");scene.curContextCache.attributes["sepia"+coll+"Normal"]=normalAttribLoc;}
if(currColl.getNormals())
{var NormalMatrix=c3dl.inverseMatrix(modelViewMatrix);NormalMatrix=c3dl.transposeMatrix(NormalMatrix);renderer.setUniformMatrix(progObjID,"normalMatrix",NormalMatrix,scene,"sepia"+coll);renderer.setVertexAttribArray(progObjID,"Normal",3,currColl.getVBONormals(),scene,"sepia"+coll);}
else
{gl.disableVertexAttribArray(normalAttribLoc);}
var usingTexture=false;var texAttribLoc=scene.curContextCache.attributes["sepia"+coll+"Texture"];if(texAttribLoc==undefined){texAttribLoc=gl.getAttribLocation(progObjID,"Texture");scene.curContextCache.attributes["sepia"+coll+"Texture"]=texAttribLoc;}
var texID=renderer.getTextureID(currColl.getTexture(),scene,"sepia"+coll);if(texID==-1&&currColl.getTexture())
{renderer.addTexture(currColl.getTexture());}
if(texID!=-1&&currColl.getTexture()&&currColl.getTexCoords()&&texAttribLoc!=-1)
{gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texID);renderer.setVertexAttribArray(progObjID,"Texture",2,currColl.getVBOTexCoords(),scene,"sepia"+coll);usingTexture=true;}
else
{gl.disableVertexAttribArray(texAttribLoc);}
renderer.setUniformi(progObjID,"usingTexture",usingTexture,scene,"sepia");renderer.setVertexAttribArray(progObjID,"Vertex",3,currColl.getVBOVertices(),scene,"sepia"+coll);gl.drawArrays(renderer.getFillMode(),0,currColl.getVertices().length/3);}}