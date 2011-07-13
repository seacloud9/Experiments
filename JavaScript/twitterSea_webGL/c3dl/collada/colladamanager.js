
c3dl.ColladaManager={};c3dl.ColladaManager.keys=[];c3dl.ColladaManager.values=[];c3dl.ColladaManager.loadFile=function(filePath)
{if(c3dl.ColladaManager.isFileLoaded(filePath)==false)
{var rootNode=new c3dl.SceneNode();var colladaLoader=new c3dl.ColladaLoader();colladaLoader.load(filePath,rootNode);c3dl.ColladaManager.keys.push(filePath);c3dl.ColladaManager.values.push(rootNode);}}
c3dl.ColladaManager.getSceneGraphCopy=function(filePath)
{if(c3dl.ColladaManager.isFileLoaded(filePath))
{var i=c3dl.ColladaManager.getIndex(filePath);var sg=c3dl.ColladaManager.values[i].getCopy();return sg;}}
c3dl.ColladaManager.isFileLoaded=function(filePath)
{return c3dl.ColladaManager.getIndex(filePath)!=-1?true:false;}
c3dl.ColladaManager.getIndex=function(filePath)
{var index=-1;for(var i=0,len=c3dl.ColladaManager.values.length;i<len;i++)
{if(filePath==c3dl.ColladaManager.keys[i])
{index=i;break;}}
return index;}