
c3dl.BoundingSphere=function(){this.longestVector=c3dl.makeVector(0,0,0);this.originalLV=c3dl.makeVector(0,0,0);this.radius=0;this.init=function(vertices,centerPosition){var longestLengthFound=0;var vector=c3dl.makeVector(0,0,0);var currVector;for(var i=0;i<vertices.length;i+=3)
{vector[0]=vertices[i+0];vector[1]=vertices[i+1];vector[2]=vertices[i+2];c3dl.subtractVectors(vector,centerPosition,vector);currVector=c3dl.vectorLength(vector);if(currVector>longestLengthFound)
{longestLengthFound=currVector;this.longestVector[0]=vector[0];this.longestVector[1]=vector[1];this.longestVector[2]=vector[2];}}
this.originalLV[0]=this.longestVector[0];this.originalLV[1]=this.longestVector[1];this.originalLV[2]=this.longestVector[2];this.radius=c3dl.vectorLength(this.longestVector);}
this.set=function(scaleVec){c3dl.multiplyVectorByVector(scaleVec,this.originalLV,this.longestVector)
this.radius=c3dl.vectorLength(this.longestVector);}
this.getRadius=function(){return this.radius;}
this.getCopy=function(){var copy=new c3dl.BoundingSphere();copy.longestVector=c3dl.copyVector(this.longestVector);copy.originalLV=c3dl.copyVector(this.originalLV);copy.radius=this.radius;return copy;}}