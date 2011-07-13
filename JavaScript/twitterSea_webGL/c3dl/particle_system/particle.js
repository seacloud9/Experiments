
c3dl.Particle=function()
{this.age=0;this.lifetime=0;this.alive=false;this.color=new C3DL_FLOAT_ARRAY([0,0,0,0]);this.size=0;this.position=c3dl.makeVector(0,0,0);this.velocity=c3dl.makeVector(0,0,0);this.rotation=0;this.vertices=new C3DL_FLOAT_ARRAY([1,-1,0,-1,-1,0,-1,1,0,1,1,0]);this.transform=new C3DL_FLOAT_ARRAY([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);this.getAge=function()
{return this.age;}
this.getPosition=function()
{return c3dl.copyVector(this.position);}
this.getVelocity=function()
{return c3dl.copyVector(this.velocity);}
this.getLifetime=function()
{return this.lifetime;}
this.getColor=function()
{return new C3DL_FLOAT_ARRAY(this.color);}
this.getSize=function()
{return this.size;}
this.setSize=function(s)
{this.size=s;}
this.isAlive=function()
{return this.alive;}
this.getTransform=function()
{return new C3DL_FLOAT_ARRAY(this.transform);}
this.getVertices=function()
{return new C3DL_FLOAT_ARRAY(verts);}
this.setAge=function(age)
{if(age>=0)
{this.age=age;}}
this.setColor=function(c)
{this.color[0]=c[0];this.color[1]=c[1];this.color[2]=c[2];this.color[3]=c[3];}
this.setVelocity=function(velocity)
{this.velocity[0]=velocity[0];this.velocity[1]=velocity[1];this.velocity[2]=velocity[2];}
this.setPosition=function(position)
{this.transform[12]=position[0];this.transform[13]=position[1];this.transform[14]=position[2];}
this.setLifetime=function(lifetime)
{if(this.lifetime>=0)
{this.lifetime=lifetime;}}
this.setAlive=function(alive)
{this.alive=alive;}
this.translate=function(trans)
{this.transform[12]+=trans[0];this.transform[13]+=trans[1];this.transform[14]+=trans[2];}
this.update=function(timeStep)
{}
this.render=function(glCanvas3D)
{}}