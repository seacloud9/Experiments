
c3dl.WebGL=c3dl.inherit(c3dl.Renderer,function(){c3dl._superc(this);var glCanvas3D=null;this.texManager=null;this.version=2.0;this.versionString="WebGL";this.geometryShader;this.particleSystemShader;this.pointShader;this.pointSphereShader;this.lineShader;this.boundingSphereShader;this.programsWithLights=[];this.pointVertBuffer=null;this.pointColBuffer=null;this.lineVertBuffer=null;this.lineColBuffer=null;this.ID=c3dl.getNextRendererID();this.STANDARD_PROGRAM_ID=null;this.textureQueue=[];this.pointSphereRenderReady=false;this.pointsphereVBOVert;this.addTexture=function(path)
{if(this.texManager==null)
{this.textureQueue.push(path);}
else
{this.texManager.addTexture(path);}}
this.getID=function()
{return this.ID;}
this.getTextureID=function(texturePath)
{if(this.texManager)
{return this.texManager.getID(texturePath);}
else
{return-1;}}
this.isReady=function()
{return glCanvas3D==null?false:true;}
this.getGLContext=function()
{return glCanvas3D;}
this.createProgram=function(vertexShader,fragmentShader)
{var gl=glCanvas3D;var program=gl.createProgram();if(program==null)
{c3dl.debug.logError("failed to create shader program");return null;}
var vertShader=gl.createShader(gl.VERTEX_SHADER);gl.shaderSource(vertShader,vertexShader);gl.compileShader(vertShader);if(!gl.getShaderParameter(vertShader,gl.COMPILE_STATUS))
{c3dl.debug.logError("vert shader: "+gl.getShaderInfoLog(vertShader));gl.deleteShader(vertShader);return null;}
gl.attachShader(program,vertShader);var vertShader=gl.createShader(gl.FRAGMENT_SHADER);gl.shaderSource(vertShader,fragmentShader);gl.compileShader(vertShader);if(!gl.getShaderParameter(vertShader,gl.COMPILE_STATUS))
{c3dl.debug.logError("frag shader "+gl.getShaderInfoLog(vertShader));gl.deleteShader(vertShader);return null;}
gl.attachShader(program,vertShader);gl.linkProgram(program);if(gl.getProgramParameter(program,gl.LINK_STATUS)!=1)
{c3dl.debug.logError(gl.getProgramInfoLog(program));gl.deleteProgram(program);return null;}
var programObject=new c3dl.ProgramObject();programObject.rendererID=this.ID;programObject.programID=program;return programObject;}
this.clearBuffers=function()
{glCanvas3D.clear(glCanvas3D.COLOR_BUFFER_BIT|glCanvas3D.DEPTH_BUFFER_BIT);}
this.swapBuffers=function()
{glCanvas3D.clear(glCanvas3D.COLOR_BUFFER_BIT|glCanvas3D.DEPTH_BUFFER_BIT);}
this.setClearColor=function(bgColor)
{if(bgColor.length>=3)
{glCanvas3D.clearColor(bgColor[0],bgColor[1],bgColor[2],1.0);}}
this.getMaxLineWidth=function()
{var maxLineWidth=glCanvas3D.getParameter(glCanvas3D.ALIASED_LINE_WIDTH_RANGE);return maxLineWidth[1];}
this.clearLight=function(lightID,scene)
{if(lightID>=0&&lightID<c3dl.MAX_LIGHTS)
{for(var i=0,len=this.programsWithLights.length;i<len;i++)
{var PID=this.programsWithLights[i];var base="lights["+lightID+"].";glCanvas3D.useProgram(PID);this.setUniformf(PID,base+"position",[0,0,0],scene,"light"+i+lightID);this.setUniformf(PID,base+"ambient",[0,0,0],scene,"light"+i+lightID);this.setUniformf(PID,base+"diffuse",[0,0,0],scene,"light"+i+lightID);this.setUniformf(PID,base+"specular",[0,0,0],scene,"light"+i);this.setUniformf(PID,base+"spotDirection",[0,0,-1],scene,"light"+i+lightID);this.setUniformf(PID,base+"spotCutoff",180,scene,"light"+i+lightID);this.setUniformf(PID,base+"spotExponent",0,scene,"light"+i+lightID);this.setUniformf(PID,base+"attenuation1",1,scene,"light"+i+lightID);this.setUniformf(PID,base+"attenuation2",0,scene,"light"+i+lightID);this.setUniformf(PID,base+"attenuation3",0,scene,"light"+i+lightID);this.setUniformi(PID,base+"type",0,scene,"light"+i+lightID);this.setUniformi(PID,base+"isOn",0,scene,"light"+i+lightID);}}}
this.updateAmbientLight=function(ambientLight,scene)
{var prevVal=c3dl.debug.getVisible();c3dl.debug.setVisible(false);for(var i=0,len=this.programsWithLights.length;i<len;i++)
{glCanvas3D.useProgram(this.programsWithLights[i]);this.setUniformf(this.programsWithLights[i],"ambientLightColor",ambientLight,scene,"ambientLight");this.setUniformi(this.programsWithLights[i],"lightingOn",this.getLighting(),scene,"ambientLight"+i);}
if(prevVal==true)
{c3dl.debug.setVisible(true);}}
this.updateLights=function(lightList,scene)
{for(var progObjIter=0,len=this.programsWithLights.length;progObjIter<len;progObjIter++)
{var shader=this.programsWithLights[progObjIter];glCanvas3D.useProgram(shader);for(var i=0,len2=lightList.length;i<len2;i++)
{var base="lights["+i+"].";if(lightList[i]!=null)
{if(lightList[i].isOn()==false)
{this.setUniformi(shader,base+"isOn",lightList[i].isOn(),scene,"light"+progObjIter+i);}
else
{if(lightList[i]instanceof c3dl.DirectionalLight)
{var dir=c3dl.multiplyMatrixByDirection(c3dl.peekMatrix(),lightList[i].getDirection());dir=c3dl.addVectorComponent(dir,0);this.setUniformf(shader,base+"position",dir,scene,"light"+progObjIter+i);this.setUniformf(shader,base+"spotCutoff",180,scene,"light"+progObjIter+i);}
else if(lightList[i]instanceof c3dl.SpotLight)
{var pos=lightList[i].getPosition();pos=c3dl.multiplyMatrixByVector(c3dl.peekMatrix(),pos);pos=c3dl.addVectorComponent(pos,1);var dir=lightList[i].getDirection();dir=c3dl.multiplyMatrixByDirection(c3dl.peekMatrix(),dir);this.setUniformf(shader,base+"position",pos,scene,"light"+i);this.setUniformf(shader,base+"spotDirection",dir,scene,"light"+i);this.setUniformf(shader,base+"spotCutoff",lightList[i].getCutoff(),scene,"light"+progObjIter+i);this.setUniformf(shader,base+"spotExponent",lightList[i].getExponent(),scene,"light"+progObjIter+i);}
else if(lightList[i]instanceof c3dl.PositionalLight)
{var pos=lightList[i].getPosition();pos=c3dl.multiplyMatrixByVector(c3dl.peekMatrix(),pos);pos=c3dl.addVectorComponent(pos,1);this.setUniformf(shader,base+"position",pos,scene,"light"+progObjIter+i);this.setUniformf(shader,base+"spotCutoff",180.0,scene,"light"+progObjIter+i);}
this.setUniformi(shader,base+"type",lightList[i].getType(),scene,"light"+progObjIter+i);this.setUniformi(shader,base+"isOn",lightList[i].isOn(),scene,"light"+progObjIter+i);this.setUniformf(shader,base+"ambient",lightList[i].getAmbient(),scene,"light"+progObjIter+i);this.setUniformf(shader,base+"diffuse",lightList[i].getDiffuse(),scene,"light"+progObjIter+i);this.setUniformf(shader,base+"specular",lightList[i].getSpecular(),scene,"light"+progObjIter+i);if(!(lightList[i]instanceof c3dl.DirectionalLight))
{var attn=lightList[i].getAttenuation();this.setUniformf(shader,base+"attenuation1",attn[0],scene,"light"+progObjIter+i);this.setUniformf(shader,base+"attenuation2",attn[1],scene,"light"+progObjIter+i);this.setUniformf(shader,base+"attenuation3",attn[2],scene,"light"+progObjIter+i);}}}}}}
this.pointSphereRenderSetup=function()
{this.pointSphereVBOVert=glCanvas3D.createBuffer();glCanvas3D.bindBuffer(glCanvas3D.ARRAY_BUFFER,this.pointSphereVBOVert);glCanvas3D.bufferData(glCanvas3D.ARRAY_BUFFER,new WebGLFloatArray(c3dl.BOUNDING_SPHERE_VERTICES),glCanvas3D.STATIC_DRAW);this.pointSphereRenderReady=true;}
this.createRenderer=function(cvs)
{if(c3dl.debug.DUMMY)
{glCanvas3D={};glCanvas3D.__noSuchMethod__=function()
{return true;}}
else
{try
{glCanvas3D=cvs.getContext('experimental-webgl');glCanvas3D.viewport(0,0,cvs.width,cvs.height);}
catch(err)
{}}
return glCanvas3D?true:false;}
this.init=function(width,height,scene)
{if(glCanvas3D==null)
{return false;}
this.contextWidth=width;this.contextHeight=height;this.scene=scene;glCanvas3D.enable(glCanvas3D.DEPTH_TEST);this.particleSystemShader=this.createProgram(c3dl.psys_vs,c3dl.psys_fs).getProgramID();this.pointShader=this.createProgram(c3dl.point_vs,c3dl.point_fs).getProgramID();this.lineShader=this.createProgram(c3dl.line_vs,c3dl.line_fs).getProgramID();this.pointSphereShader=this.createProgram(c3dl.point_sphere_vs,c3dl.point_sphere_fs).getProgramID();this.boundingSphereShader=this.createProgram(c3dl.bounding_sphere_vs,c3dl.bounding_sphere_fs).getProgramID();c3dl.effects.STD_EFFECT=new c3dl.EffectTemplate();c3dl.effects.STD_EFFECT.addVertexShader(c3dl.material_vs+c3dl.light_vs+c3dl.model_vs);c3dl.effects.STD_EFFECT.addFragmentShader(c3dl.model_fs);c3dl.effects.STD_EFFECT.setRenderingCallback(c3dl.std_callback);c3dl.effects.STD_EFFECT.init();c3dl.effects.STANDARD=new c3dl.Effect();c3dl.effects.STANDARD.init(c3dl.effects.STD_EFFECT);var prog=this.createProgram(c3dl.material_vs+c3dl.light_vs+c3dl.model_vs,c3dl.model_fs);c3dl.effects.STANDARD.getEffectTemplate().addProgramObject(prog);this.programsWithLights.push(c3dl.effects.STANDARD.getEffectTemplate().getProgramID(this.ID));this.STANDARD_PROGRAM_ID=prog.getProgramID();c3dl.effects.SOLID_COLOR_EFFECT_TEMP=new c3dl.EffectTemplate();c3dl.effects.SOLID_COLOR_EFFECT_TEMP.addVertexShader(c3dl.solid_color_vs);c3dl.effects.SOLID_COLOR_EFFECT_TEMP.addFragmentShader(c3dl.solid_color_fs);c3dl.effects.SOLID_COLOR_EFFECT_TEMP.setRenderingCallback(c3dl.solid_color_callback);c3dl.effects.SOLID_COLOR_EFFECT_TEMP.init();c3dl.effects.SOLID_COLOR_EFFECT=new c3dl.Effect();c3dl.effects.SOLID_COLOR_EFFECT.init(c3dl.effects.SOLID_COLOR_EFFECT_TEMP);var prog=this.createProgram(c3dl.solid_color_vs,c3dl.solid_color_fs);c3dl.effects.SOLID_COLOR_EFFECT.getEffectTemplate().addProgramObject(prog);this.SOLID_COLOR_EFFECT_ID=prog.getProgramID();c3dl.effects.GREYSCALE=new c3dl.EffectTemplate();c3dl.effects.GREYSCALE.addVertexShader(c3dl.material_vs);c3dl.effects.GREYSCALE.addVertexShader(c3dl.light_vs);c3dl.effects.GREYSCALE.addVertexShader(c3dl.greyscale_vs);c3dl.effects.GREYSCALE.addFragmentShader(c3dl.greyscale_fs);c3dl.effects.GREYSCALE.setRenderingCallback(c3dl.greyscale_callback);c3dl.effects.GREYSCALE.addParameter("color",Array,[0.3,0.6,0.1]);c3dl.effects.GREYSCALE.init();c3dl.effects.SOLID_COLOR=new c3dl.EffectTemplate();c3dl.effects.SOLID_COLOR.addVertexShader(c3dl.solid_color_vs);c3dl.effects.SOLID_COLOR.addFragmentShader(c3dl.solid_color_fs);c3dl.effects.SOLID_COLOR.setRenderingCallback(c3dl.solid_color_callback);c3dl.effects.SOLID_COLOR.addParameter("color",Array,[0.0,0.0,0.0]);c3dl.effects.SOLID_COLOR.init();c3dl.effects.SEPIA=new c3dl.EffectTemplate();c3dl.effects.SEPIA.addVertexShader(c3dl.material_vs);c3dl.effects.SEPIA.addVertexShader(c3dl.light_vs);c3dl.effects.SEPIA.addVertexShader(c3dl.sepia_vs);c3dl.effects.SEPIA.addFragmentShader(c3dl.sepia_fs);c3dl.effects.SEPIA.setRenderingCallback(c3dl.sepia_callback);c3dl.effects.SEPIA.addParameter("color",Array,[1.2,1.0,0.8]);c3dl.effects.SEPIA.init();c3dl.effects.CARTOON=new c3dl.EffectTemplate();c3dl.effects.CARTOON.addVertexShader(c3dl.cartoon_vs);c3dl.effects.CARTOON.addFragmentShader("#ifdef GL_ES \n precision highp float; \n #endif \n ");c3dl.effects.CARTOON.addFragmentShader(c3dl.light_vs);c3dl.effects.CARTOON.addFragmentShader(c3dl.cartoon_fs);c3dl.effects.CARTOON.setRenderingCallback(c3dl.cartoon_callback);c3dl.effects.CARTOON.addParameter("qMap",String);c3dl.effects.CARTOON.addParameter("outline",Boolean,true);c3dl.effects.CARTOON.init();c3dl.effects.GOOCH=new c3dl.EffectTemplate();c3dl.effects.GOOCH.addVertexShader(c3dl.gooch_vs);c3dl.effects.GOOCH.addFragmentShader("#ifdef GL_ES \n precision highp float; \n #endif \n ");c3dl.effects.GOOCH.addFragmentShader(c3dl.light_vs);c3dl.effects.GOOCH.addFragmentShader(c3dl.gooch_fs);c3dl.effects.GOOCH.setRenderingCallback(c3dl.gooch_callback);c3dl.effects.GOOCH.addParameter("coolColor",Array,[0,0,1]);c3dl.effects.GOOCH.addParameter("warmColor",Array,[0.5,0.5,0.0]);c3dl.effects.GOOCH.addParameter("surfaceColor",Array,[0.1,0.1,0.1]);c3dl.effects.GOOCH.addParameter("outline",Boolean,true);c3dl.effects.GOOCH.init();this.texManager=new c3dl.TextureManager(glCanvas3D);for(var i in this.textureQueue)
{if(this.textureQueue[i])
{this.texManager.addTexture(this.textureQueue[i]);}}
return true;}
this.renderBoundingSphere=function(boundingSphere,viewMatrix,scene)
{var shader=this.boundingSphereShader;glCanvas3D.useProgram(shader);if(this.pointSphereRenderReady==false)
{this.pointSphereRenderSetup();}
else{var sphereMatrix=c3dl.makeIdentityMatrix();c3dl.matrixMode(c3dl.PROJECTION);var projMatrix=c3dl.peekMatrix();c3dl.matrixMode(c3dl.MODELVIEW);var pos=boundingSphere.getPosition();sphereMatrix[12]=pos[0];sphereMatrix[13]=pos[1];sphereMatrix[14]=pos[2];sphereMatrix[0]=sphereMatrix[5]=sphereMatrix[10]=boundingSphere.getRadius();var sphereViewMatrix=c3dl.multiplyMatrixByMatrix(viewMatrix,sphereMatrix);var MVPMatrix=c3dl.multiplyMatrixByMatrix(projMatrix,sphereViewMatrix);this.setUniformMatrix(shader,"modelViewProjMatrix",MVPMatrix,scene,"boundingSphereShader");this.setVertexAttribArray(shader,"Vertex",3,this.pointSphereVBOVert,scene,"boundingSphereShader");glCanvas3D.drawArrays(glCanvas3D.POINTS,0,c3dl.BOUNDING_SPHERE_VERTICES.length/3);}}
this.renderGeometry=function(obj,scene)
{if(obj.getEffect())
{var effect=obj.getEffect().getEffectTemplate();var progObjID=effect.getProgramID(this.ID);if(progObjID==-1)
{var vertexShaders=effect.getVertexShaders();var fragmentShaders=effect.getFragmentShaders();var joinedVertexShaders=vertexShaders.join('');var joinedFragmentShaders=fragmentShaders.join('');var programObject=this.createProgram(joinedVertexShaders,joinedFragmentShaders);if(programObject)
{effect.addProgramObject(programObject);for(var i=0,len=vertexShaders.length;i<len;i++)
{if(vertexShaders[i]==c3dl.light_vs)
{this.programsWithLights.push(programObject.getProgramID());glCanvas3D.useProgram(programObject.getProgramID());this.setUniformi(programObject.getProgramID(),"lightingOn",true,scene,"vertexfragmentShaders");}}
for(var i=0,len=fragmentShaders.length;i<len;i++)
{if(fragmentShaders[i]==c3dl.light_vs)
{this.programsWithLights.push(programObject.getProgramID());glCanvas3D.useProgram(programObject.getProgramID());this.setUniformi(programObject.getProgramID(),"lightingOn",true,scene,"vertexfragmentShaders");}}}
else
{c3dl.debug.logWarning("could not compile effect shader(s).");c3dl.debug.logInfo(joinedVertexShaders);c3dl.debug.logInfo(joinedFragmentShaders);}}
else
{var renderingObj={};renderingObj["context"]=glCanvas3D;renderingObj["getContext"]=function()
{return this.context;};renderingObj["renderer"]=this;renderingObj["getRenderer"]=function()
{return this.renderer;};renderingObj['programObjectID']=progObjID;renderingObj['getProgramObjectID']=function()
{return this.programObjectID;};renderingObj['geometry']=obj;renderingObj['getGeometry']=function()
{return this.geometry;};var cb=effect.getRenderingCallback();cb(renderingObj,scene);}}
else
{var renderingObj={};renderingObj["context"]=glCanvas3D;renderingObj["getContext"]=function()
{return this.context;};renderingObj["renderer"]=this;renderingObj["getRenderer"]=function()
{return this.renderer;};renderingObj['programObjectID']=this.STANDARD_PROGRAM_ID;renderingObj['getProgramObjectID']=function()
{return this.programObjectID;};renderingObj['geometry']=obj;renderingObj['getGeometry']=function()
{return this.geometry;};c3dl.std_callback(renderingObj,scene);}}
this.renderShape=function(obj,scene)
{var renderingObj={};renderingObj["context"]=glCanvas3D;renderingObj["getContext"]=function()
{return this.context;};renderingObj["renderer"]=this;renderingObj["getRenderer"]=function()
{return this.renderer;};renderingObj['programObjectID']=this.STANDARD_PROGRAM_ID;renderingObj['getProgramObjectID']=function()
{return this.programObjectID;};renderingObj['geometry']=obj;renderingObj['getGeometry']=function()
{return this.geometry;};c3dl.std_callback(renderingObj,scene);}
this.renderParticleSystem=function(psys,scene)
{var shader=this.particleSystemShader;glCanvas3D.useProgram(shader);var usingTexture=false;var texturePath=psys.getTexture();var texID=this.texManager.getID(texturePath);var texAttribLoc=glCanvas3D.getAttribLocation(shader,"Texture");if(texID==-1&&texturePath)
{this.texManager.addTexture(texturePath);}
if(texID!=-1&&texturePath&&psys.getTexCoords())
{glCanvas3D.activeTexture(glCanvas3D.TEXTURE0);glCanvas3D.bindTexture(glCanvas3D.TEXTURE_2D,texID);this.setVertexAttribArray(shader,"Texture",2,psys.getVBOTexCoords(),scene,"particleSystemShader");usingTexture=true;glCanvas3D.texParameteri(glCanvas3D.TEXTURE_2D,glCanvas3D.TEXTURE_WRAP_S,glCanvas3D.CLAMP_TO_EDGE);glCanvas3D.texParameteri(glCanvas3D.TEXTURE_2D,glCanvas3D.TEXTURE_WRAP_T,glCanvas3D.CLAMP_TO_EDGE);}
else
{glCanvas3D.activeTexture(glCanvas3D.TEXTURE0);glCanvas3D.disableVertexAttribArray(texAttribLoc);}
this.setUniformi(shader,"usingTexture",usingTexture,scene,"particleSystemShader");this.setUniformMatrix(shader,"rot",[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],scene,"particleSystemShader");this.setVertexAttribArray(shader,"Vertex",3,psys.getVBOVertices(),scene,"particleSystemShader");for(var i=0,numParticles=psys.getNumParticles();i<numParticles;i++)
{if(psys.getParticle(i).isAlive())
{var pSize=psys.getParticle(i).getSize();this.setUniformf(shader,"Color",psys.getParticle(i).getColor(),scene,"particleSystemShader");c3dl.matrixMode(c3dl.PROJECTION);var projectionMatrix=c3dl.peekMatrix();c3dl.matrixMode(c3dl.MODELVIEW);var viewMatrix=c3dl.peekMatrix();var modelMatrix=psys.getParticle(i).getTransform();modelMatrix=c3dl.multiplyMatrixByMatrix(modelMatrix,[pSize,0,0,0,0,pSize,0,0,0,0,pSize,0,0,0,0,1]);var modelViewProjMatrix=c3dl.multiplyMatrixByMatrix(viewMatrix,modelMatrix);modelViewProjMatrix=c3dl.multiplyMatrixByMatrix(projectionMatrix,modelViewProjMatrix);this.setUniformMatrix(shader,"modelViewProjMatrix",modelViewProjMatrix,scene,"particleSystemShader");glCanvas3D.drawArrays(glCanvas3D.TRIANGLE_FAN,i,4);}}}
this.renderLines=function(lines,scene)
{if(lines.length>0)
{var shader=this.lineShader;glCanvas3D.useProgram(shader);var modelViewMatrix=c3dl.peekMatrix();c3dl.matrixMode(c3dl.PROJECTION);var projectionMatrix=c3dl.peekMatrix();c3dl.matrixMode(c3dl.MODELVIEW);var modelViewProjMatrix=c3dl.multiplyMatrixByMatrix(projectionMatrix,modelViewMatrix);this.setUniformMatrix(shader,"modelViewProjMatrix",modelViewProjMatrix,scene,"lineShader");for(var l=0,len=lines.length;l<len;l++)
{glCanvas3D.lineWidth(lines[l].getWidth());var coords=[];var cols=[];for(var i=0;i<6;i++)
{coords.push(lines[l].getCoordinates()[i]);cols.push(lines[l].getColors()[i]);}
if(this.lineVertBuffer==null)
{this.lineVertBuffer={};this.lineVertBuffer.position=glCanvas3D.createBuffer();}
glCanvas3D.bindBuffer(glCanvas3D.ARRAY_BUFFER,this.lineVertBuffer.position);glCanvas3D.bufferData(glCanvas3D.ARRAY_BUFFER,new WebGLFloatArray(coords),glCanvas3D.STREAM_DRAW);this.setVertexAttribArray(shader,"Vertex",3,this.lineVertBuffer.position,scene,"lineShader");if(this.lineColBuffer==null)
{this.lineColBuffer={};this.lineColBuffer.position=glCanvas3D.createBuffer();}
glCanvas3D.bindBuffer(glCanvas3D.ARRAY_BUFFER,this.lineColBuffer.position);glCanvas3D.bufferData(glCanvas3D.ARRAY_BUFFER,new WebGLFloatArray(cols),glCanvas3D.STREAM_DRAW);this.setVertexAttribArray(shader,"Color",3,this.lineColBuffer.position,scene,"lineShader");glCanvas3D.drawArrays(glCanvas3D.LINES,0,coords.length/3);}}}
this.renderPoints=function(pointPositions,pointColors,attenuation,mode,size,scene)
{if(pointPositions.length>0&&pointColors.length>0)
{if(mode==c3dl.POINT_MODE_POINT)
{var shader=this.pointShader;glCanvas3D.useProgram(shader);var viewMatrix=c3dl.peekMatrix();c3dl.matrixMode(c3dl.PROJECTION);var projectionMatrix=c3dl.peekMatrix();c3dl.matrixMode(c3dl.MODELVIEW);var modelViewProjMatrix=c3dl.multiplyMatrixByMatrix(projectionMatrix,viewMatrix,scene,"pointShader");this.setUniformMatrix(shader,"viewMatrix",viewMatrix,scene,"pointShader");this.setUniformMatrix(shader,"modelViewProjMatrix",modelViewProjMatrix,scene,"pointShader");this.setUniformf(shader,"attenuation",attenuation,scene,"pointShader");if(this.pointVertBuffer==null)
{this.pointVertBuffer={};this.pointVertBuffer.position=glCanvas3D.createBuffer();}
glCanvas3D.bindBuffer(glCanvas3D.ARRAY_BUFFER,this.pointVertBuffer.position);glCanvas3D.bufferData(glCanvas3D.ARRAY_BUFFER,new WebGLFloatArray(pointPositions),glCanvas3D.STREAM_DRAW);this.setVertexAttribArray(shader,"Vertex",3,this.pointVertBuffer.position,scene,"pointShader");if(this.pointColBuffer==null)
{this.pointColBuffer={};this.pointColBuffer.position=glCanvas3D.createBuffer();}
glCanvas3D.bindBuffer(glCanvas3D.ARRAY_BUFFER,this.pointColBuffer.position);glCanvas3D.bufferData(glCanvas3D.ARRAY_BUFFER,new WebGLFloatArray(pointColors),glCanvas3D.STREAM_DRAW);this.setVertexAttribArray(shader,"Color",3,this.pointColBuffer.position,scene,"pointShader");glCanvas3D.drawArrays(glCanvas3D.POINTS,0,pointPositions.length/3);}
else if(mode==c3dl.POINT_MODE_SPHERE)
{var shader=this.pointSphereShader;glCanvas3D.useProgram(shader);if(this.pointSphereRenderReady==false)
{this.pointSphereRenderSetup();}
else
{c3dl.pushMatrix();for(var i=0,len=pointPositions.length;i<len;i+=3)
{var mat=c3dl.makeIdentityMatrix();mat[12]=pointPositions[i];mat[13]=pointPositions[i+1];mat[14]=pointPositions[i+2];mat[0]=mat[5]=mat[10]=size;mat=c3dl.multiplyMatrixByMatrix(c3dl.peekMatrix(),mat);c3dl.matrixMode(c3dl.PROJECTION);var proj=c3dl.peekMatrix();c3dl.matrixMode(c3dl.MODELVIEW);var MVPMatrix=c3dl.multiplyMatrixByMatrix(proj,mat);this.setUniformMatrix(shader,"modelViewProjMatrix",MVPMatrix,scene,"pointShader");this.setUniformf(shader,"Color",[pointColors[i],pointColors[i+1],pointColors[i+2]],scene,"pointShader");this.setVertexAttribArray(shader,"Vertex",3,this.pointSphereVBOVert,scene,"pointShader");glCanvas3D.drawArrays(glCanvas3D.TRIANGLES,0,c3dl.BOUNDING_SPHERE_VERTICES.length/3);c3dl.popMatrix();}}}}}
this.setVertexAttribArray=function(shader,varName,size,vbo,scene,shaderName)
{var attribLoc=scene.curContextCache.attributes[shaderName+varName];if(attribLoc==undefined){attribLoc=glCanvas3D.getAttribLocation(shader,varName);scene.curContextCache.attributes[shaderName+varName]=attribLoc;}
if(attribLoc!=c3dl.SHADER_VAR_NOT_FOUND)
{glCanvas3D.bindBuffer(glCanvas3D.ARRAY_BUFFER,vbo);glCanvas3D.vertexAttribPointer(attribLoc,size,glCanvas3D.FLOAT,false,0,0);glCanvas3D.enableVertexAttribArray(attribLoc);}
else
{c3dl.debug.logError("Attribute variable '"+varName+"' not found in shader with ID = "+shader);}}
this.setUniformMatrix=function(programObjectID,varName,matrix,scene,programObjectName)
{var varLocation=scene.curContextCache.locations[programObjectName+varName];if(!varLocation){varLocation=glCanvas3D.getUniformLocation(programObjectID,varName);scene.curContextCache.locations[programObjectName+varName]=varLocation;}
if(varLocation!=c3dl.SHADER_VAR_NOT_FOUND)
{glCanvas3D.uniformMatrix4fv(varLocation,false,matrix);}
else
{c3dl.debug.logError("Uniform matrix variable '"+varName+"' not found in program object.");}}
this.setUniformf=function(shader,varName,value,scene,shaderName)
{var varLocation=scene.curContextCache.locations[shaderName+varName];if(!varLocation){varLocation=glCanvas3D.getUniformLocation(shader,varName);scene.curContextCache.flag=0;scene.curContextCache.locations[shaderName+varName]=varLocation;}
if(varLocation!=c3dl.SHADER_VAR_NOT_FOUND)
{if(value.length==4)
{glCanvas3D.uniform4fv(varLocation,value);}
else if(value.length==3)
{glCanvas3D.uniform3fv(varLocation,value);}
else if(value.length==2)
{glCanvas3D.uniform2fv(varLocation,value);}
else
{glCanvas3D.uniform1f(varLocation,value);}}
else
{c3dl.debug.logError('Uniform variable "'+varName+'" not found in program object.');}}
this.setUniformi=function(programObjectID,varName,value,scene,programObjectName)
{var varLocation=scene.curContextCache.locations[programObjectName+varName];if(!varLocation){varLocation=glCanvas3D.getUniformLocation(programObjectID,varName);scene.curContextCache.locations[programObjectName+varName]=varLocation;}
if(varLocation!=c3dl.SHADER_VAR_NOT_FOUND)
{if(value.length==4)
{glCanvas3D.uniform4iv(varLocation,value);}
else if(value.length==3)
{glCanvas3D.uniform3iv(varLocation,value);}
else if(value.length==2)
{glCanvas3D.uniform2iv(varLocation,value);}
else
{glCanvas3D.uniform1i(varLocation,value);}}
else
{c3dl.debug.logError('Uniform variable "'+varName+'" not found in program object.');}}
this.enable=function(capability)
{try
{if(capability)
{glCanvas3D.enable(capability);}
else
{c3dl.debug.logWarning("Enable command passed undefined value.");}}
catch(e)
{c3dl.debug.logException("Exception name:"+e.name+"<br />"+"Exception msg: "+e.message+"<br />"+"Capability: "+capability);}}
this.disable=function(capability)
{if(capability)
{glCanvas3D.disable(capability);}
else
{c3dl.debug.logWarning("disable command passed undefined value.");}}});