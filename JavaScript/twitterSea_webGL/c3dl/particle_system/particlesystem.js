
c3dl.ParticleSystem=function()
{this.particleUVs=new C3DL_FLOAT_ARRAY([1,1,1,0,0,0,0,1]);this.billboardVerts=new C3DL_FLOAT_ARRAY([1,-1,0,1,1,0,-1,1,0,-1,-1,0]);this.mat=new C3DL_FLOAT_ARRAY([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);this.particles;this.numDeadParticles;this.texture;this.minVelocity=c3dl.makeVector(0,0,0);this.maxVelocity=c3dl.makeVector(0,0,0);this.maxAngVel=0;this.minAngVel=0;this.minLifetime=0;this.maxLifetime=0;this.minColor=new C3DL_FLOAT_ARRAY([0,0,0,0]);this.maxColor=new C3DL_FLOAT_ARRAY([0,0,0,0]);this.minSize=1;this.maxSize=1;this.acceleration=new C3DL_FLOAT_ARRAY([0,0,0,0]);this.dstBlend=c3dl.ZERO;this.srcBlend=c3dl.ZERO;this.blendEq=c3dl.FUNC_ADD;this.camUp=c3dl.makeVector(0,0,0);this.camLeft=c3dl.makeVector(0,0,0);this.camDir=c3dl.makeVector(0,0,0);this.isPlaying=false;this.emitRate=0;this.timeCounter=0;this.isTimeCounterSetup=false;this.particleVerts=null;this.particleColors=null;this.particleTexCoords=null;this.VBOVertices=null;this.VBOColors=null;this.VBOTexCoords=null;this.firstTimeRender=true;this.emit=function(numToEmit)
{if(numToEmit<=0||this.numDeadParticles==0)
{return;}
numToEmit=(numToEmit>this.numDeadParticles)?this.numDeadParticles:numToEmit;for(var i=0,len=this.particles.length;i<len&&numToEmit>0;i++)
{if(this.particles[i].isAlive()==false)
{this.emitParticle(i);numToEmit--;}}}
this.emitParticle=function(index)
{if(index>=0&&index<this.particles.length)
{this.particles[index].setVelocity([c3dl.getRandom(this.minVelocity[0],this.maxVelocity[0]),c3dl.getRandom(this.minVelocity[1],this.maxVelocity[1]),c3dl.getRandom(this.minVelocity[2],this.maxVelocity[2])]);this.particles[index].setAge(0);this.particles[index].setLifetime(c3dl.getRandom(this.minLifetime,this.maxLifetime));this.particles[index].setAlive(true);this.particles[index].setPosition([this.mat[12],this.mat[13],this.mat[14]]);this.particles[index].setColor([c3dl.getRandom(this.minColor[0],this.maxColor[0]),c3dl.getRandom(this.minColor[1],this.maxColor[1]),c3dl.getRandom(this.minColor[2],this.maxColor[2]),c3dl.getRandom(this.minColor[3],this.maxColor[3]),]);this.particles[index].setSize(c3dl.getRandom(this.minSize,this.maxSize));this.numDeadParticles--;}}
this.init=function(numParticles)
{this.particles=new Array(numParticles);for(var i=0;i<numParticles;i++)
{this.particles[i]=new c3dl.Particle();}
this.particleVerts=new C3DL_FLOAT_ARRAY(this.particles.length*3*4);this.particleColors=new C3DL_FLOAT_ARRAY(this.particles.length*4*4);this.particleTexCoords=new C3DL_FLOAT_ARRAY(this.particles.length*2*4);for(var i=0,len=this.particleColors.length;i<len;i++)
{this.particleColors[i]=0.0;}
for(var i=0,len=this.particleVerts.length;i<len;i++)
{this.particleVerts[i]=0.0;}
for(var i=0,len=this.particleTexCoords.length;i<len;i++)
{this.particleTexCoords[i]=0;}
this.isPlaying=true;this.numDeadParticles=this.particles.length;}
this.isReady=function()
{return(this.particles instanceof Array);}
this.getNumParticles=function()
{return this.particles.length;}
this.getParticle=function(i)
{if(i>=0&&i<this.particles.length)
{return this.particles[i];}}
this.getVertices=function()
{return this.billboardVerts;}
this.getTexCoords=function()
{return this.particleUVs;}
this.killParticle=function(index)
{if(index>0&&index<this.particles.length)
{this.particles[index].setAlive(false);this.numDeadParticles++;}}
this.setEmitRate=function(particlesPerSecond)
{if(particlesPerSecond==0)
{this.emitRate=0;this.isTimeCounterSetup=false;}
else if(particlesPerSecond>0)
{this.emitRate=particlesPerSecond;}}
this.translate=function(vec)
{this.mat[12]+=vec[0];this.mat[13]+=vec[1];this.mat[14]+=vec[2];}
this.setPosition=function(vec)
{this.mat[12]=vec[0];this.mat[13]=vec[1];this.mat[14]=vec[2];}
this.getAcceleration=function()
{return new C3DL_FLOAT_ARRAY(this.acceleration);}
this.getBlendEquation=function()
{return this.blendEq;}
this.getDstBlend=function()
{return this.dstBlend;}
this.getMaxColor=function()
{return new C3DL_FLOAT_ARRAY(this.maxColor);}
this.getMinColor=function()
{return new C3DL_FLOAT_ARRAY(this.minColor);}
this.getMaxLifetime=function()
{return this.maxLifetime;}
this.getMinLifetime=function()
{return this.minLifetime;}
this.getMinVelocity=function()
{return new C3DL_FLOAT_ARRAY(this.minVelocity);}
this.getMaxVelocity=function()
{return new C3DL_FLOAT_ARRAY(this.maxVelocity);}
this.getTexture=function()
{return this.texture;}
this.getSrcBlend=function()
{return this.srcBlend;}
this.setAcceleration=function(acceleration)
{this.acceleration[0]=acceleration[0];this.acceleration[1]=acceleration[1];this.acceleration[2]=acceleration[2];this.acceleration[3]=acceleration[3];}
this.setDstBlend=function(dstBlend)
{switch(dstBlend)
{case c3dl.ZERO:case c3dl.ONE:case c3dl.SRC_COLOR:case c3dl.ONE_MINUS_SRC_COLOR:case c3dl.SRC_ALPHA:case c3dl.ONE_MINUS_SRC_ALPHA:case c3dl.DST_ALPHA:case c3dl.ONE_MINUS_DST_ALPHA:case c3dl.DST_COLOR:case c3dl.ONE_MINUS_DST_COLOR:case c3dl.SRC_ALPHA_SATURATE:this.dstBlend=dstBlend;break;}}
this.setMaxColor=function(maxColor)
{if(c3dl.isValidColor(maxColor))
{this.maxColor[0]=maxColor[0];this.maxColor[1]=maxColor[1];this.maxColor[2]=maxColor[2];this.maxColor[3]=maxColor[3];}}
this.setMinColor=function(minColor)
{if(c3dl.isValidColor(minColor))
{this.minColor[0]=minColor[0];this.minColor[1]=minColor[1];this.minColor[2]=minColor[2];this.minColor[3]=minColor[3];}}
this.setMaxLifetime=function(maxLifetime)
{if(maxLifetime>0)
{this.maxLifetime=maxLifetime;}}
this.setMinLifetime=function(minLifetime)
{if(minLifetime>0)
{this.minLifetime=minLifetime;}}
this.setMaxSize=function(maxSize)
{if(maxSize>0)
{this.maxSize=maxSize;}}
this.setMinSize=function(minSize)
{if(minSize>0)
{this.minSize=minSize;}}
this.setMinVelocity=function(minVelocity)
{this.minVelocity[0]=minVelocity[0];this.minVelocity[1]=minVelocity[1];this.minVelocity[2]=minVelocity[2];}
this.setMaxVelocity=function(maxVelocity)
{this.maxVelocity[0]=maxVelocity[0];this.maxVelocity[1]=maxVelocity[1];this.maxVelocity[2]=maxVelocity[2];}
this.setMaxAngularVelocity=function(maxAngVel)
{this.maxAngVel=maxAngVel;}
this.setMinAngularVelocity=function(minAngVel)
{this.minAngVel=minAngVel;}
this.setBlendEquation=function(blendEq)
{switch(blendEq)
{case c3dl.FUNC_ADD:case c3dl.FUNC_SUBTRACT:case c3dl.FUNC_REVERSE_SUBTRACT:this.blendEq=blendEq;break;}}
this.setSrcBlend=function(srcBlend)
{switch(srcBlend)
{case c3dl.ZERO:case c3dl.ONE:case c3dl.SRC_COLOR:case c3dl.ONE_MINUS_SRC_COLOR:case c3dl.SRC_ALPHA:case c3dl.ONE_MINUS_SRC_ALPHA:case c3dl.DST_ALPHA:case c3dl.ONE_MINUS_DST_ALPHA:case c3dl.DST_COLOR:case c3dl.ONE_MINUS_DST_COLOR:case c3dl.SRC_ALPHA_SATURATE:this.srcBlend=srcBlend;break;}}
this.setTexture=function(textureName)
{this.texture=textureName;}
this.update=function(timeStep)
{if(this.emitRate>0)
{if(this.isTimeCounterSetup==false)
{this.timeCounter=timeStep;this.isTimeCounterSetup=true;}
else
{this.timeCounter+=timeStep;}
var numToEmit=this.timeCounter*this.emitRate/1000.0;if(numToEmit>=1)
{this.emit(numToEmit);this.timeCounter-=numToEmit/this.emitRate*1000.0;}}
var p=0,j=0;for(var i=0,len=this.particleColors.length;i<len;i++,j++)
{if(i!=0&&i%16==0)
{p++}
if(j>3)
{j=0;}
this.particleColors[i]=this.particles[p].getColor()[j];}
for(var i=0,len=this.particles.length;i<len;i++)
{if(this.particles[i].isAlive())
{var timeInSeconds=timeStep/1000;var pos=this.particles[i].getPosition();var vel=this.particles[i].getVelocity();this.particles[i].translate([(vel[0]*timeInSeconds)+this.acceleration[0]*timeInSeconds*timeInSeconds*0.5,(vel[1]*timeInSeconds)+this.acceleration[1]*timeInSeconds*timeInSeconds*0.5,(vel[2]*timeInSeconds)+this.acceleration[2]*timeInSeconds*timeInSeconds*0.5]);for(var p=0,j=0;p<12;p++,j++)
{if(j>2)
{j=0;}
this.particleVerts[i*12+p]=this.particles[i].getPosition()[j]+this.getVertices()[p];}
this.particles[i].setVelocity([vel[0]+(this.acceleration[0]*timeInSeconds),vel[1]+(this.acceleration[1]*timeInSeconds),vel[2]+(this.acceleration[2]*timeInSeconds)]);this.particles[i].setAge(this.particles[i].getAge()+timeInSeconds);if(this.particles[i].getAge()>this.particles[i].getLifetime())
{this.killParticle(i);}}}}
this.getVBOTexCoords=function()
{return this.VBOTexCoords;}
this.getVBOVertices=function()
{return this.VBOVertices;}
this.getVBOColors=function()
{return this.VBOColors;}
this.preRender=function(glCanvas3D,scene)
{if(this.firstTimeRender===true)
{for(var i=0,j=0,len=this.particleTexCoords.length;i<len;i++,j++)
{if(j>7)
{j=0;}
this.particleTexCoords[i]=this.particleUVs[j];}
this.VBOColors=glCanvas3D.createBuffer();glCanvas3D.bindBuffer(glCanvas3D.ARRAY_BUFFER,this.VBOColors);glCanvas3D.bufferData(glCanvas3D.ARRAY_BUFFER,this.particleColors,glCanvas3D.STREAM_DRAW);this.VBOVertices=glCanvas3D.createBuffer();glCanvas3D.bindBuffer(glCanvas3D.ARRAY_BUFFER,this.VBOVertices);glCanvas3D.bufferData(glCanvas3D.ARRAY_BUFFER,this.particleVerts,glCanvas3D.STREAM_DRAW);this.VBOTexCoords=glCanvas3D.createBuffer();glCanvas3D.bindBuffer(glCanvas3D.ARRAY_BUFFER,this.VBOTexCoords);glCanvas3D.bufferData(glCanvas3D.ARRAY_BUFFER,this.particleTexCoords,glCanvas3D.STREAM_DRAW);this.firstTimeRender=0;}
else
{glCanvas3D.bindBuffer(glCanvas3D.ARRAY_BUFFER,this.VBOColors);glCanvas3D.bufferData(glCanvas3D.ARRAY_BUFFER,this.particleColors,glCanvas3D.STREAM_DRAW);glCanvas3D.bindBuffer(glCanvas3D.ARRAY_BUFFER,this.VBOVertices);glCanvas3D.bufferData(glCanvas3D.ARRAY_BUFFER,this.particleVerts,glCanvas3D.STREAM_DRAW);glCanvas3D.bindBuffer(glCanvas3D.ARRAY_BUFFER,this.VBOTexCoords);glCanvas3D.bufferData(glCanvas3D.ARRAY_BUFFER,this.particleTexCoords,glCanvas3D.STREAM_DRAW);}
glCanvas3D.depthMask(false);glCanvas3D.enable(glCanvas3D.BLEND);glCanvas3D.blendEquation(this.blendEq);glCanvas3D.blendFunc(this.getSrcBlend(),this.getDstBlend());}
this.postRender=function(glCanvas3D,scene)
{glCanvas3D.disable(glCanvas3D.BLEND);glCanvas3D.depthMask(true);}
this.render=function(glCanvas3D,scene)
{this.recalculateBillboard(glCanvas3D,scene);this.preRender(glCanvas3D,scene);scene.getRenderer().renderParticleSystem(this,scene);this.postRender(glCanvas3D,scene);}
this.getObjectType=function()
{return c3dl.PARTICLE_SYSTEM;}
this.recalculateBillboard=function(glCanvas3D,scene)
{if(!(c3dl.isVectorEqual(this.camUp,scene.getCamera().getUp())&&c3dl.isVectorEqual(this.camLeft,scene.getCamera().getLeft())&&c3dl.isVectorEqual(this.camDir,scene.getCamera().getDir())))
{this.camUp=scene.getCamera().getUp();this.camLeft=scene.getCamera().getLeft();this.camDir=scene.getCamera().getDir();var camRight=[-this.camLeft[0],-this.camLeft[1],-this.camLeft[2]];var bottomRight=c3dl.subtractVectors(camRight,this.camUp);var bottomLeft=c3dl.subtractVectors(this.camLeft,this.camUp);var topLeft=c3dl.addVectors(this.camLeft,this.camUp);var topRight=c3dl.addVectors(camRight,this.camUp);this.billboardVerts=[bottomRight[0],bottomRight[1],bottomRight[2],topRight[0],topRight[1],topRight[2],topLeft[0],topLeft[1],topLeft[2],bottomLeft[0],bottomLeft[1],bottomLeft[2]];}}}