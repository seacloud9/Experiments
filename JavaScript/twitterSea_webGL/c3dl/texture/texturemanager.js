
c3dl.TextureManager=function(gl)
{this.currentID=1;this.keys=[];this.values=[];this.glCanvas3D=gl;this.addTexture=function(relativePath)
{if(this.getID(relativePath)==-1)
{var texture=new c3dl.Texture();if(texture.setup(this.glCanvas3D,relativePath))
{this.keys.push(texture.getTextureID());this.values.push(texture);this.currentID++;}}}
this.addTextureFromCanvas2D=function(sourceCanvas)
{if(this.getID(sourceCanvas)==-1){var texture=new c3dl.Texture();if(texture.setup(this.glCanvas3D,'deleteme',sourceCanvas)){this.keys.push(texture.getTextureID());this.values.push(texture);this.currentID++;}}}
this.hasTexture=function(relativePath)
{return this.getID(relativePath)==-1?false:true;}
this.removeTexture=function(relativePath)
{if(this.getID(relativePath)!=-1)
{}}
this.getID=function(relativePath)
{var id=-1;for(var i=0,len=this.values.length;i<len;i++)
{if(this.values[i].getRelativePath()==relativePath)
{id=this.keys[i];break;}}
return id;}
this.getIDNumber=function(relativePath){var id=-1;for(var i=0,len=this.values.length;i<len;i++){if(this.values[i].getRelativePath()===relativePath){id=i;break;}}
return id;}
this.toString=function(delimiter)
{if(!delimiter||typeof(delimiter)!="string")
{delimiter=",";}
var str="";for(var i=0,len=this.values.length;i<len;i++)
{str+="ID = "+this.keys[i]+delimiter+"Path = "+this.values[i].getRelativePath();if(i+1<this.values.length)
{str+=delimiter;}}
return str;}
this.updateTexture=function(path){if(typeof(path)!="string"){var id=this.getIDNumber(path);if(id>=0){this.values[id].update();}}}}