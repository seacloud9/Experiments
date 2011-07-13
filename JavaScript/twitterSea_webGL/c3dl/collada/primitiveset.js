
c3dl.PrimitiveSet=function()
{this.material=null;this.texture=null;this.vertices=null;this.normals=null;this.texCoords=null;this.type=null;this.lineList=null;this.boundingVolume=null;this.fillType=null;this.buffers={};this.init=function(vertices,normals,texCoords,type)
{this.vertices=vertices;this.normals=normals;this.texCoords=texCoords;this.boundingVolume=new c3dl.BoundingVolume();this.type=type;this.boundingVolume.init(this.vertices);}
this.initLine=function(vertices,faces,type)
{this.vertices=[];this.lineList=[];for(var i=0;i<vertices.length;i++){var xyz=[];xyz[0]=parseFloat(vertices[i][0]);xyz[1]=parseFloat(vertices[i][1]);xyz[2]=parseFloat(vertices[i][2]);this.vertices.push(xyz[0]);this.vertices.push(xyz[1]);this.vertices.push(xyz[2]);}
this.type=type;for(var i=0;i<faces.length;i+=2){var line=new c3dl.Line();var start=faces[i][0];var end=faces[i+1][0];line.setCoordinates([this.vertices[start*3],this.vertices[start*3+1],this.vertices[start*3+2]],[this.vertices[end*3],this.vertices[end*3+1],this.vertices[end*3+2]]);this.lineList.push(line);}}
this.setupVBO=function(glCanvas3D)
{this.buffers.vertices=glCanvas3D.createBuffer();this.buffers.normals=glCanvas3D.createBuffer();this.buffers.texCoords=glCanvas3D.createBuffer();glCanvas3D.bindBuffer(glCanvas3D.ARRAY_BUFFER,this.buffers.vertices);glCanvas3D.bufferData(glCanvas3D.ARRAY_BUFFER,this.vertices,glCanvas3D.STATIC_DRAW);glCanvas3D.bindBuffer(glCanvas3D.ARRAY_BUFFER,this.buffers.normals);glCanvas3D.bufferData(glCanvas3D.ARRAY_BUFFER,this.normals,glCanvas3D.STATIC_DRAW);glCanvas3D.bindBuffer(glCanvas3D.ARRAY_BUFFER,this.buffers.texCoords);glCanvas3D.bufferData(glCanvas3D.ARRAY_BUFFER,this.texCoords,glCanvas3D.STATIC_DRAW);}
this.getVBOVertices=function()
{return this.buffers.vertices;}
this.getVBONormals=function()
{return this.buffers.normals;}
this.getVBOTexCoords=function()
{return this.buffers.texCoords;}
this.getCopy=function()
{var copy=new c3dl.PrimitiveSet();copy.vertices=this.vertices;copy.normals=this.normals;copy.texCoords=this.texCoords;copy.texture=this.texture;copy.lineList=this.lineList;copy.type=this.type;copy.material=this.material?this.material.getCopy():null;if(this.boundingVolume){copy.boundingVolume=this.boundingVolume.getCopy();}
return copy;}
this.getTexture=function()
{return this.texture;}
this.getVertices=function()
{return this.vertices;}
this.getNormals=function()
{return this.normals;}
this.getTexCoords=function()
{return this.texCoords;}
this.getMaterial=function()
{return this.material;}
this.getBoundingVolume=function()
{return this.boundingVolume;}
this.setMaterial=function(material)
{this.material=material;}
this.setTexture=function(texture)
{this.texture=texture;}
this.updateTextureByName=function(oldTexturePath,newTexturePath)
{if(this.texture){if(this.texture===oldTexturePath){this.texture=newTexturePath;}}}
this.getLines=function()
{return this.lineList;}
this.getType=function()
{return this.type;}}