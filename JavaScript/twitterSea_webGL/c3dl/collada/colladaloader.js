
c3dl.ColladaLoader=function()
{var XHR_STATE_COMPLETED=4;var xmlhttp=null;this.done=false;this.name="";this.rootNode=new c3dl.SceneNode();this.load=function(relativePath,rootNode)
{this.rootNode=rootNode;xmlhttp=new XMLHttpRequest();xmlhttp.parent=this;xmlhttp.callbackFunc=this.parse;xmlhttp.open("GET",relativePath,true);xmlhttp.overrideMimeType('text/xml');try
{xmlhttp.send(null);}
catch(err)
{c3dl.debug.logWarning("Could not find file '"+relativePath+"'. Check the path.");}
xmlhttp.onreadystatechange=function()
{if(xmlhttp.readyState==XHR_STATE_COMPLETED)
{if(xmlhttp.responseXML)
{xmlhttp.responseXML.colladaPath=relativePath;this.callbackFunc(xmlhttp.responseXML);}}}}
this.parseNodeRecursive=function(xmlObject,node,sgNode)
{var translateTag=c3dl.ColladaLoader.getChildNodesByNodeName(node,"translate");if(translateTag)
{var floatValues=c3dl.ColladaLoader.stringsToFloats(translateTag[0].childNodes[0].nodeValue,' ');if(xmlObject.upAxis&&xmlObject.upAxis=="Z_UP")
{var temp=floatValues[1];floatValues[1]=floatValues[2];floatValues[2]=-temp;}
else if(xmlObject.upAxis&&xmlObject.upAxis=="X_UP")
{var temp=floatValues[0];floatValues[0]=-floatValues[1];floatValues[1]=temp;}
sgNode.translate(floatValues);}
var rotationTags=c3dl.ColladaLoader.getChildNodesByNodeName(node,"rotate");if(rotationTags)
{for(var i=0,len=rotationTags.length;i<len;i++)
{var floatValues=c3dl.ColladaLoader.stringsToFloats(rotationTags[i].childNodes[0].nodeValue,' ');var vec=[floatValues[0],floatValues[1],floatValues[2]];if(xmlObject.upAxis&&xmlObject.upAxis=="Z_UP")
{var temp=vec[1];vec[1]=vec[2];vec[2]=-temp;}
else if(xmlObject.upAxis&&xmlObject.upAxis=="X_UP")
{var temp=vec[0];vec[0]=-vec[1];vec[1]=temp;}
var angle=c3dl.degreesToRadians(floatValues[3]);sgNode.rotateOnAxis(vec,angle);}}
var scaleTag=c3dl.ColladaLoader.getChildNodesByNodeName(node,"scale");if(scaleTag)
{var floatValues=c3dl.ColladaLoader.stringsToFloats(scaleTag[0].childNodes[0].nodeValue,' ');if(xmlObject.upAxis&&xmlObject.upAxis=="Z_UP")
{var temp=floatValues[1];floatValues[1]=floatValues[2];floatValues[2]=temp;}
if(xmlObject.upAxis&&xmlObject.upAxis=="X_UP")
{var temp=floatValues[0];floatValues[0]=floatValues[1];floatValues[1]=temp;}
sgNode.scale(floatValues);}
var matrixTag=c3dl.ColladaLoader.getChildNodesByNodeName(node,"matrix");if(matrixTag)
{var mat=c3dl.ColladaLoader.stringsToFloats(matrixTag[0].childNodes[0].nodeValue,' ');if(xmlObject.upAxis&&xmlObject.upAxis=="Z_UP")
{var temp=mat[7];mat[7]=mat[11];mat[11]=-temp;temp=mat[1];mat[1]=mat[2];mat[2]=temp;temp=mat[4];mat[4]=mat[8];mat[8]=temp;temp=mat[5];mat[5]=mat[10];mat[10]=temp;}
if(xmlObject.upAxis&&xmlObject.upAxis=="X_UP")
{var temp=mat[3];mat[3]=-mat[7];mat[7]=temp;temp=mat[0];mat[0]=mat[5];mat[5]=temp;temp=mat[2];mat[2]=mat[6];mat[6]=temp;temp=mat[8];mat[8]=mat[9];mat[9]=temp;}
sgNode.setTransform(c3dl.transposeMatrix(mat));}
var geometries=c3dl.ColladaLoader.getChildNodesByNodeName(node,"instance_geometry");if(geometries)
{for(var currGeo=0,len=geometries.length;currGeo<len;currGeo++)
{var url=geometries[currGeo].getAttribute("url").split('#')[1];sgNode.addChild(this.instantiateGeometry(xmlObject,url,geometries[currGeo]));}}
var instance_nodes=c3dl.ColladaLoader.getChildNodesByNodeName(node,"instance_node");if(instance_nodes)
{for(var currNode=0,len=instance_nodes.length;currNode<len;currNode++)
{var url=instance_nodes[currNode].getAttribute("url").split('#')[1];sgNode.addChild(this.instantiateNode(xmlObject,url));}}
var nodes=c3dl.ColladaLoader.getChildNodesByNodeName(node,"node");if(nodes)
{for(var i=0,len=nodes.length;i<len;i++)
{var scenenode=new c3dl.SceneNode();scenenode.setName(nodes[i].getAttribute("name"));sgNode.addChild(scenenode);this.parseNodeRecursive(xmlObject,nodes[i],scenenode);}}}
this.getChoice=function(parentTag,choiceTagNames)
{var choice=null;var i=0;while(choice==null&&i<choiceTagNames.length)
{choice=parentTag.getElementsByTagName(choiceTagNames[i])[0];i++;}
return choice;}
this.parse=function(xmlObject)
{var loader=this.parent;var root=xmlObject.documentElement;var library_images=root.getElementsByTagName("library_images");for(var libraryImagesIter=0,len=library_images.length;libraryImagesIter<len;libraryImagesIter++)
{var imageElements=library_images[libraryImagesIter].getElementsByTagName("image");for(var imageElementIter=0,len2=imageElements.length;imageElementIter<len2;imageElementIter++)
{var init_from=imageElements[imageElementIter].getElementsByTagName("init_from")[0];}}
var upAxisTag=root.getElementsByTagName("up_axis")[0];if(upAxisTag)
{xmlObject.upAxis=upAxisTag.childNodes[0].nodeValue;}
var sceneElement=root.getElementsByTagName("scene")[0];var instanceVisualSceneElem=sceneElement.getElementsByTagName("instance_visual_scene")[0];var visualSceneToLoad=instanceVisualSceneElem.getAttribute("url").split('#')[1];var libraryVisualScenes=root.getElementsByTagName("library_visual_scenes")[0];var visualSceneList=libraryVisualScenes.getElementsByTagName("visual_scene");var visualScene=null;for(var i=0,len=visualSceneList.length;i<len;i++)
{if(visualSceneList[i].getAttribute("id")==visualSceneToLoad)
{visualScene=visualSceneList[i];}}
var nodes=c3dl.ColladaLoader.getChildNodesByNodeName(visualScene,"node");if(nodes)
{for(var currNode=0,len=nodes.length;currNode<len;currNode++)
{var scenenode=new c3dl.SceneNode();loader.rootNode.addChild(scenenode);scenenode.setName(nodes[currNode].getAttribute("name"));loader.parseNodeRecursive(xmlObject,nodes[currNode],scenenode);}}
c3dl.ColladaQueue.popFront();delete xmlObject;delete xmlhttp;}
this.instantiateMaterial=function(xmlObject,target)
{var tempTexture=null;var material=this.findElementInLibrary(xmlObject,"library_materials","material",target);var tempName=target;var instanceEffect=material.getElementsByTagName("instance_effect")[0];var instanceEffectURL=instanceEffect.getAttribute("url").split('#')[1];var effect=this.findElementInLibrary(xmlObject,"library_effects","effect",instanceEffectURL);var profile_COMMON=effect.getElementsByTagName("profile_COMMON")[0];var technique=profile_COMMON.getElementsByTagName("technique")[0];var newparam=profile_COMMON.getElementsByTagName("newparam")[0];if(newparam)
{var surface=newparam.getElementsByTagName("surface")[0];var init_from=surface.getElementsByTagName("init_from")[0];var fileID=init_from.childNodes[0].nodeValue;var texture=this.findElementInLibrary(xmlObject,"library_images","image",fileID);var textureName=texture.getElementsByTagName("init_from")[0].childNodes[0].nodeValue;var resolvedTexture;if(c3dl.isPathAbsolute(textureName))
{resolvedTexture=textureName;}
else
{resolvedTexture=c3dl.getPathWithoutFilename(xmlObject.colladaPath)+textureName;}
tempTexture=resolvedTexture;}
var shadingAlgorithm=this.getChoice(technique,["blinn","constant","phong","lambert"]);var mat=new c3dl.Material();mat.setName(tempName);mat.setAmbient(this.getColor(shadingAlgorithm,"ambient"));mat.setDiffuse(this.getColor(shadingAlgorithm,"diffuse"));mat.setEmission(this.getColor(shadingAlgorithm,"emission"));mat.setSpecular(this.getColor(shadingAlgorithm,"specular"));mat.setShininess(this.getColor(shadingAlgorithm,"shininess"));return[mat,tempTexture];}
this.instantiateGeometry=function(xmlObject,url,instanceGeometryElement)
{var root=xmlObject.documentElement;var libraryGeometries=root.getElementsByTagName("library_geometries");var geoToCreate=null;var geometry=new c3dl.Geometry();for(var currLib=0,len=libraryGeometries.length;currLib<len;currLib++)
{var geometries=libraryGeometries[currLib].getElementsByTagName("geometry");for(var currGeo=0,len2=geometries.length;currGeo<len2;currGeo++)
{if(geometries[currGeo].getAttribute("id")==url)
{geoToCreate=geometries[currGeo];}}}
var verticesArray=null;var vertexStride;var normalsArray=null;var normalsStride;var texCoordsArray=null;var texCoordsStride;var faces=null;var rawFaces;var mesh=geoToCreate.getElementsByTagName("mesh")[0];var collations=[];for(var i=0,len=mesh.childNodes.length;i<len;i++)
{if(mesh.childNodes[i].nodeName=="triangles"||mesh.childNodes[i].nodeName=="polygons"||mesh.childNodes[i].nodeName=="polylist"||mesh.childNodes[i].nodeName=="lines")
{collations.push(mesh.childNodes[i]);}}
for(var currColl=0,len=collations.length;currColl<len;currColl++)
{if(collations[currColl].nodeName=="triangles"||collations[currColl].nodeName=="polylist"||collations[currColl].nodeName=="lines")
{var p=this.getFirstChildByNodeName(collations[currColl],"p");new C3DL_FLOAT_ARRAY(rawFaces=this.mergeChildData(p.childNodes).split(" "));}
else if(collations[currColl].nodeName=="polygons")
{var p_tags=collations[currColl].getElementsByTagName("p");var faces=[];for(var i=0;i<p_tags.length;i++)
{var p_line=p_tags[i].childNodes[0].nodeValue.split(" ");for(var j=0;j<p_line.length;j++)
{faces.push(parseInt(p_line[j]));}}
rawFaces=new C3DL_FLOAT_ARRAY(faces.length);for(var i=0;i<faces.length;i++){rawFaces[i]=faces[i];}}
else
{c3dl.debug.logError(collations[currColl].nodeName+" collation element is not yet supported");}
var inputs=collations[currColl].getElementsByTagName("input");collationElement=new c3dl.PrimitiveSet();for(var i=0,len2=inputs.length;i<len2;i++)
{if(inputs[i].getAttribute("semantic")=="VERTEX")
{this.vertexOffset=inputs[i].getAttribute("offset");this.vertexSource=inputs[i].getAttribute("source").split('#')[1];var vertices=c3dl.ColladaLoader.getNodeWithAttribute(xmlObject,"vertices","id",this.vertexSource);var input=vertices.getElementsByTagName("input")[0];var posSource=input.getAttribute("source").split('#')[1];var data=this.getData(xmlObject,"source","id",posSource);vertexStride=parseInt(data.stride);if(xmlObject.upAxis&&xmlObject.upAxis=="Z_UP")
{for(var vertIter=0,len3=data.values.length;vertIter<len3;vertIter+=vertexStride)
{var temp=data.values[vertIter+1];data.values[vertIter+1]=data.values[vertIter+2];data.values[vertIter+2]=-temp;}}
else if(xmlObject.upAxis&&xmlObject.upAxis=="X_UP")
{for(var vertIter=0,len3=data.values.length;vertIter<len3;vertIter+=vertexStride)
{var temp=data.values[vertIter];data.values[vertIter]=-data.values[vertIter+1];data.values[vertIter+1]=temp;}}
verticesArray=this.groupScalarsIntoArray(data.values,3,vertexStride);}
else if(inputs[i].getAttribute("semantic")=="NORMAL")
{this.normalOffset=inputs[i].getAttribute("offset");this.normalSource=inputs[i].getAttribute("source").split('#')[1];var data=this.getData(xmlObject,"source","id",this.normalSource);normalsStride=parseInt(data.stride);if(xmlObject.upAxis&&xmlObject.upAxis=="Z_UP")
{for(var vertIter=0,len3=data.values.length;vertIter<len3;vertIter+=normalsStride)
{var temp=data.values[vertIter+1];data.values[vertIter+1]=data.values[vertIter+2];data.values[vertIter+2]=-temp;}}
else if(xmlObject.upAxis&&xmlObject.upAxis=="X_UP")
{for(var vertIter=0,len3=data.values.length;vertIter<len3;vertIter+=normalsStride)
{var temp=data.values[vertIter];data.values[vertIter]=-data.values[vertIter+1];data.values[vertIter+1]=temp;}}
normalsArray=this.groupScalarsIntoArray(data.values,3,normalsStride);}
else if(inputs[i].getAttribute("semantic")=="TEXCOORD")
{this.texCoordOffset=inputs[i].getAttribute("offset");var uvSource=inputs[i].getAttribute("source").split('#')[1];var data=this.getData(xmlObject,"source","id",uvSource);texCoordsStride=parseInt(data.stride);for(var currUV=1,len3=data.values.length;currUV<len3;currUV+=texCoordsStride)
{data.values[currUV]=1-data.values[currUV];}
texCoordsArray=this.groupScalarsIntoArray(data.values,2,texCoordsStride);}}
if(collations[currColl].nodeName=="polylist")
{rawFaces=this.splitPolylist(collations[currColl],inputs.length,rawFaces);}
else if(collations[currColl].nodeName=="polygons")
{var partSize=inputs.length;var trianglesList=[];for(var currPrim=0,count=collations[currColl].getAttribute("count");currPrim<count;currPrim++)
{var partsArray=[];for(var currPart=0;currPart<4;currPart++)
{var part=[];for(currScalar=0,len2=inputs.length;currScalar<len2;currScalar++)
{part.push(rawFaces[(currPrim*inputs.length*4)+(currPart*partSize)+currScalar]);}
partsArray.push(part);}
for(var s=0,len2=partsArray[0].length;s<len2;s++)
{trianglesList.push(partsArray[0][s]);}
for(var s=0,len2=partsArray[1].length;s<len2;s++)
{trianglesList.push(partsArray[1][s]);}
for(var s=0,len2=partsArray[3].length;s<len2;s++)
{trianglesList.push(partsArray[3][s]);}
for(var s=0,len2=partsArray[3].length;s<len2;s++)
{trianglesList.push(partsArray[3][s]);}
for(var s=0,len2=partsArray[1].length;s<len2;s++)
{trianglesList.push(partsArray[1][s]);}
for(var s=0,len2=partsArray[2].length;s<len2;s++)
{trianglesList.push(partsArray[2][s]);}}
rawFaces=new C3DL_FLOAT_ARRAY(trianglesList);}
faces=this.groupScalarsIntoArray(rawFaces,inputs.length,inputs.length,collations[currColl].nodeName);collationElement.tempMaterial=collations[currColl].getAttribute("material");if(collations[currColl].nodeName!=="lines"){collationElement.init(this.expandFaces(faces,verticesArray,this.vertexOffset,vertexStride),this.expandFaces(faces,normalsArray,this.normalOffset,normalsStride),this.expandFaces(faces,texCoordsArray,this.texCoordOffset,2));}
else{collationElement.initLine(verticesArray,faces,collations[currColl].nodeName);}
geometry.addPrimitiveSet(collationElement);}
var bind_material=instanceGeometryElement.getElementsByTagName("bind_material")[0];if(bind_material)
{var technique_common=bind_material.getElementsByTagName("technique_common")[0];var instance_materials=technique_common.getElementsByTagName("instance_material");for(var im=0,len2=instance_materials.length;im<len2;im++)
{var target=instance_materials[im].getAttribute("target").split('#')[1];var symbol=instance_materials[im].getAttribute("symbol");var material=this.findElementInLibrary(xmlObject,"library_materials","material",target);var matAndTex=this.instantiateMaterial(xmlObject,target);var instanceMaterial=matAndTex[0];var tex=matAndTex[1];var GeoCollations=geometry.getPrimitiveSets();for(var ic=0,len=GeoCollations.length;ic<len;ic++)
{if(GeoCollations[ic].tempMaterial==symbol)
{GeoCollations[ic].setMaterial(instanceMaterial);GeoCollations[ic].setTexture(tex);}}}}
return geometry;}
this.instantiateNode=function(xmlObject,url)
{var root=xmlObject.documentElement;var libraryNodes=root.getElementsByTagName("library_nodes");var nodeToCreate=null;for(var currLib=0,len=libraryNodes.length;currLib<len;currLib++)
{var nodes=libraryNodes[currLib].getElementsByTagName("node");for(var currNode=0,len2=nodes.length;currNode<len2;currNode++)
{if(nodes[currNode].getAttribute("id")==url)
{nodeToCreate=nodes[currNode];}}}
var inode=new c3dl.SceneNode();inode.setName(nodeToCreate.getAttribute("name"));this.parseNodeRecursive(xmlObject,nodeToCreate,inode);return inode;}
this.groupScalarsIntoArray=function(rawScalarValues,numComponentsPerElement,stride)
{var listOfArrays=[];for(var i=0,len=rawScalarValues.length;i<len;i+=stride)
{var element=new C3DL_FLOAT_ARRAY(numComponentsPerElement);var counter=0;for(var j=i;j<i+numComponentsPerElement;j++)
{element[counter++]=rawScalarValues[j];}
listOfArrays.push(element);}
return listOfArrays;}
this.splitPolylist=function(collation,numInputs,rawFaces)
{var vcountNode=this.getFirstChildByNodeName(collation,"vcount");var vcountList=this.mergeChildData(vcountNode.childNodes).split(" ");var vcountIndex=0;var primOffset=0;var trianglesList=[];var partSize=numInputs;for(var currPrim=0,count=collation.getAttribute("count");currPrim<count;currPrim++,vcountIndex++)
{var partsArray=[];for(var currPart=0;currPart<vcountList[vcountIndex];currPart++)
{var part=[];for(currScalar=0;currScalar<numInputs;currScalar++)
{part.push(rawFaces[(primOffset*numInputs)+(currPart*numInputs)+currScalar]);}
partsArray.push(part);}
primOffset+=parseInt(vcountList[vcountIndex]);var last=1;var firstTriangle=true;for(var fanIndex=0;fanIndex<vcountList[vcountIndex]-1;)
{for(var s=0,len=partsArray[0].length;s<len;s++)
{trianglesList.push(partsArray[0][s]);}
fanIndex++;for(var s=0,len=partsArray[0].length;s<len;s++)
{trianglesList.push(partsArray[last][s]);}
if(firstTriangle)
{fanIndex++;firstTriangle=false;}
for(var s=0,len=partsArray[0].length;s<len;s++)
{trianglesList.push(partsArray[fanIndex][s]);}
last=fanIndex;}}
return new C3DL_FLOAT_ARRAY(trianglesList);}
this.findElementInLibrary=function(xmlObject,libraryName,elementName,elementAttributeId)
{var libraries=xmlObject.getElementsByTagName(libraryName);for(libraryIter=0,len=libraries.length;libraryIter<len;libraryIter++)
{var elements=libraries[libraryIter].getElementsByTagName(elementName);for(elementIter=0,len2=elements.length;elementIter<len2;elementIter++)
{if(elementAttributeId==elements[elementIter].getAttribute("id"))
{return elements[elementIter];}}}
return null;}
this.getData=function(xmlObject,nodeName,attributeKey,attributeValue)
{var data=new Object();var nsrc=c3dl.ColladaLoader.getNodeWithAttribute(xmlObject,"source","id",attributeValue);var tech_common=nsrc.getElementsByTagName("technique_common")[0];var accessor=tech_common.getElementsByTagName("accessor")[0];data.stride=accessor.getAttribute("stride");var accessorSrc=accessor.getAttribute("source").split("#")[1];var float_array=c3dl.ColladaLoader.getNodeWithAttribute(xmlObject,"float_array","id",accessorSrc);data.values=new C3DL_FLOAT_ARRAY(this.mergeChildData(float_array.childNodes).split(" "));return data;}
this.expandFaces=function(faces,array,offset,numComponentsToExpand)
{var expandedArray=new C3DL_FLOAT_ARRAY(faces.length*3);var counter=0;var face;var coordIndex;var coord;var floatValue;for(var currFace=0,len=faces.length;currFace<len;currFace++)
{for(var currComp=0;currComp<numComponentsToExpand;currComp++)
{face=faces[currFace];coordIndex=face[offset];if(array){coord=array[coordIndex][currComp];}
expandedArray[counter++]=coord;}}
return expandedArray;}
this.doneLoading=function()
{return this.done;}
this.getColor=function(node,str)
{var component=node!=null?node.getElementsByTagName(str)[0]:null;var returnValue=[0,0,0];if(component)
{var value=this.getChoice(component,["color","float","texture"]);if(value.nodeName=="color")
{returnValue=[];for(var currNode=0,len=value.childNodes.length;currNode<len;currNode++)
{returnValue+=value.childNodes[currNode].nodeValue;}
returnValue=returnValue.split(" ");returnValue=[parseFloat(returnValue[0]),parseFloat(returnValue[1]),parseFloat(returnValue[2])];returnValue=returnValue.slice(0,3);}
else if(value.nodeName=="float")
{returnValue=parseFloat(value.childNodes[0].nodeValue);}
else if(value.nodeName=="texture")
{returnValue=[1,1,1];}}
return returnValue;}
this.mergeChildData=function(childNodes)
{var values=[];for(var currNode=0,len=childNodes.length;currNode<len;currNode++)
{values+=childNodes[currNode].nodeValue;}
return values.replace(/\s+$/,'');}
this.getFirstChildByNodeName=function(searchNode,nodeName)
{for(var i=0,len=searchNode.childNodes.length;i<len;i++)
{if(searchNode.childNodes[i].nodeName==nodeName)
{return searchNode.childNodes[i];}}
return null;}}
c3dl.ColladaLoader.getNodeWithAttribute=function(xmlObject,nodeName,attributeKey,attributeValue)
{var nodeFound;var root=xmlObject.documentElement;var elements=root.getElementsByTagName(nodeName);for(var i=0,len=elements.length;i<len;i++)
{if(elements[i].getAttribute(attributeKey)==attributeValue)
{nodeFound=elements[i];}}
return nodeFound;}
c3dl.ColladaLoader.getChildNodesByNodeName=function(searchNode,nodeName)
{var children=[];var foundOne=false;if(searchNode.childNodes.length>0)
{for(var i=0,len=searchNode.childNodes.length;i<len;i++)
{if(searchNode.childNodes[i].nodeName==nodeName)
{children.push(searchNode.childNodes[i]);foundOne=true;}}}
if(foundOne==false)
{children=null;}
return children;}
c3dl.ColladaLoader.stringsToFloats=function(numbers,delimeter)
{var floatValues=[];var trimmedNumbers=numbers.replace(/^\s+/,'');trimmedNumbers=trimmedNumbers.replace(/\s+$/,'');trimmedNumbers=trimmedNumbers.replace(/\s+/g,' ');var strValues=trimmedNumbers.split(delimeter);for(var i=0,len=strValues.length;i<len;i++)
{floatValues.push(parseFloat(strValues[i]));}
return floatValues;}