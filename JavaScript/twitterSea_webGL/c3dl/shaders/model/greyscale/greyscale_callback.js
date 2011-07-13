
c3dl.greyscale_callback=function(renderingObj,scene)
{var progObjID=renderingObj.getProgramObjectID();var renderer=renderingObj.getRenderer();var geometry=renderingObj.getGeometry();var gl=renderingObj.getContext();var effect=geometry.getEffect();gl.useProgram(progObjID);renderer.setUniformf(progObjID,"color",effect.getParameter("color"),scene,"greyscale");var modelViewMatrix=c3dl.peekMatrix();c3dl.matrixMode(c3dl.PROJECTION);var projectionMatrix=c3dl.peekMatrix();c3dl.matrixMode(c3dl.MODELVIEW);var modelViewProjMatrix=c3dl.multiplyMatrixByMatrix(projectionMatrix,modelViewMatrix);renderer.setUniformMatrix(progObjID,"modelViewMatrix",modelViewMatrix,scene,"greyscale");renderer.setUniformMatrix(progObjID,"modelViewProjMatrix",modelViewProjMatrix,scene,"greyscale");for(var coll=0;coll<geometry.getPrimitiveSets().length;coll++)
{var currColl=geometry.getPrimitiveSets()[coll];var mat=currColl.getMaterial();if(mat)
{renderer.setUniformf(progObjID,"material.emission",mat.getEmission(),scene,"greyscale"+coll);renderer.setUniformf(progObjID,"material.ambient",mat.getAmbient(),scene,"greyscale"+coll);renderer.setUniformf(progObjID,"material.diffuse",mat.getDiffuse(),scene,"greyscale"+coll);renderer.setUniformf(progObjID,"material.specular",mat.getSpecular(),scene,"greyscale"+coll);renderer.setUniformf(progObjID,"material.shininess",mat.getShininess(),scene,"greyscale"+coll);renderer.setUniformi(progObjID,"usingMaterial",true,scene,"greyscale"+coll);}
else
{renderer.setUniformi(progObjID,"usingMaterial",false,scene,"greyscale"+coll);}
var normalAttribLoc=scene.curContextCache.attributes["greyscale"+coll+"Normal"];if(normalAttribLoc==undefined){normalAttribLoc=gl.getAttribLocation(progObjID,"Normal");scene.curContextCache.attributes["greyscale"+coll+"Normal"]=normalAttribLoc;}
if(currColl.getNormals())
{var NormalMatrix=c3dl.inverseMatrix(modelViewMatrix);NormalMatrix=c3dl.transposeMatrix(NormalMatrix);renderer.setUniformMatrix(progObjID,"normalMatrix",NormalMatrix,scene,"greyscale"+coll);renderer.setVertexAttribArray(progObjID,"Normal",3,currColl.getVBONormals(),scene,"greyscale"+coll);}
else
{gl.disableVertexAttribArray(normalAttribLoc);}
var usingTexture=false;var texAttribLoc=scene.curContextCache.attributes["greyscale"+coll+"Texture"];if(texAttribLoc==undefined){texAttribLoc=gl.getAttribLocation(progObjID,"Texture");scene.curContextCache.attributes["greyscale"+coll+"Texture"]=texAttribLoc;}
var texID=renderer.getTextureID(currColl.getTexture());if(texID==-1&&currColl.getTexture())
{renderer.addTexture(currColl.getTexture());}
if(texID!=-1&&currColl.getTexture()&&currColl.getTexCoords()&&texAttribLoc!=-1)
{gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texID);renderer.setVertexAttribArray(progObjID,"Texture",2,currColl.getVBOTexCoords(),scene,"greyscale"+coll);usingTexture=true;}
else
{gl.disableVertexAttribArray(texAttribLoc);}
renderer.setUniformi(progObjID,"usingTexture",usingTexture,scene,"greyscale"+coll);renderer.setVertexAttribArray(progObjID,"Vertex",3,currColl.getVBOVertices(),scene,"greyscale"+coll);gl.drawArrays(renderer.getFillMode(),0,currColl.getVertices().length/3);}}