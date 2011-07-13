
var isDone=false;c3dl.std_callback=function(renderingObj,scene)
{var progObjID=renderingObj.getProgramObjectID();var geometry=renderingObj.getGeometry();var renderer=renderingObj.getRenderer();var glCanvas3D=renderingObj.getContext();glCanvas3D.useProgram(progObjID);var modelViewMatrix=c3dl.peekMatrix();c3dl.matrixMode(c3dl.PROJECTION);var projectionMatrix=c3dl.peekMatrix();c3dl.matrixMode(c3dl.MODELVIEW);var modelViewProjMatrix=c3dl.multiplyMatrixByMatrix(projectionMatrix,modelViewMatrix,c3dl.mat1);renderer.setUniformMatrix(progObjID,"modelViewMatrix",modelViewMatrix,scene,"std");renderer.setUniformMatrix(progObjID,"modelViewProjMatrix",modelViewProjMatrix,scene,"std");for(var coll=0;coll<geometry.getPrimitiveSets().length;coll++)
{var currColl=geometry.getPrimitiveSets()[coll];var mat=currColl.getMaterial();if(mat)
{renderer.setUniformf(progObjID,"material.emission",mat.emission,scene,"std");renderer.setUniformf(progObjID,"material.ambient",mat.ambient,scene,"std");renderer.setUniformf(progObjID,"material.diffuse",mat.diffuse,scene,"std");renderer.setUniformf(progObjID,"material.specular",mat.specular,scene,"std");renderer.setUniformf(progObjID,"material.shininess",mat.shininess,scene,"std");renderer.setUniformi(progObjID,"usingMaterial",true,scene,"std");}
else
{renderer.setUniformi(progObjID,"usingMaterial",false,scene,"std");}
var normalAttribLoc=scene.curContextCache.attributes["std"+"Normal"];if(normalAttribLoc==undefined){normalAttribLoc=glCanvas3D.getAttribLocation(progObjID,"Normal");scene.curContextCache.attributes["std"+"Normal"]=normalAttribLoc;}
if(normalAttribLoc!=-1&&currColl.getNormals())
{var NormalMatrix=c3dl.inverseMatrix(modelViewMatrix);c3dl.transposeMatrix(NormalMatrix,NormalMatrix);renderer.setUniformMatrix(progObjID,"normalMatrix",NormalMatrix,scene,"std");renderer.setVertexAttribArray(progObjID,"Normal",3,currColl.getVBONormals(),scene,"std");}
else
{glCanvas3D.disableVertexAttribArray(normalAttribLoc);}
var usingTexture=false;var texAttribLoc=scene.curContextCache.attributes["std"+"Texture"];if(texAttribLoc==undefined){texAttribLoc=glCanvas3D.getAttribLocation(progObjID,"Texture");scene.curContextCache.attributes["std"+"Texture"]=texAttribLoc;}
var texID=renderer.texManager.getID(currColl.getTexture());if(texID==-1&&currColl.getTexture())
{if(typeof currColl.getTexture()!=="string"){renderer.texManager.addTextureFromCanvas2D(currColl.getTexture())}
else{renderer.texManager.addTexture(currColl.getTexture());}}
if(texID!=-1&&currColl.getTexture()&&currColl.getTexCoords()&&texAttribLoc!=-1)
{glCanvas3D.activeTexture(glCanvas3D.TEXTURE0);glCanvas3D.bindTexture(glCanvas3D.TEXTURE_2D,texID);renderer.setVertexAttribArray(progObjID,"Texture",2,currColl.getVBOTexCoords(),scene,"std");usingTexture=true;}
else
{glCanvas3D.activeTexture(glCanvas3D.TEXTURE0);glCanvas3D.disableVertexAttribArray(texAttribLoc);}
renderer.setUniformi(progObjID,"usingTexture",usingTexture,scene,"std");renderer.setUniformi(progObjID,"lightingOn",true,scene,"std");renderer.setVertexAttribArray(progObjID,"Vertex",3,currColl.getVBOVertices(),scene,"std");if(renderer.getFillMode()===c3dl.FILL){if(currColl.fillType==="TRIANGLE_STRIP"){glCanvas3D.drawArrays(glCanvas3D.TRIANGLE_STRIP,0,currColl.getVertices().length/3);}
else if(currColl.fillType==="TRIANGLE_FAN"){glCanvas3D.drawArrays(glCanvas3D.TRIANGLE_FAN,0,currColl.getVertices().length/3);}
else{glCanvas3D.drawArrays(glCanvas3D.TRIANGLES,0,currColl.getVertices().length/3);}}
else{glCanvas3D.drawArrays(c3dl.WIRE_FRAME,0,currColl.getVertices().length/3);}
glCanvas3D.enable(glCanvas3D.POLYGON_OFFSET_FILL);}}