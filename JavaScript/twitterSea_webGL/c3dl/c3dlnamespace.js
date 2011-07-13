
var c3dl={rendererID:0,getNextRendererID:function()
{return++c3dl.rendererID;},bind:function(func,bindObj)
{return function()
{func.call(bindObj,arguments);};},extend:function(baseObj,extObj)
{for(var i in extObj){if(extObj[i]!=null&&extObj[i]!=undefined){baseObj[i]=extObj[i];}}
return baseObj;},guid:function()
{return new Date().getTime();},inherit:function(parentObject,child)
{child.prototype.__proto__=parentObject.prototype;child.prototype.__parent=parentObject;return child;},_super:function(o,args,funcname)
{if(funcname.length==0)funcname=args.callee.name;var tmpparent=o.__parent;if(o.__parent.prototype.__parent)o.__parent=o.__parent.prototype.__parent;var ret=tmpparent.prototype[funcname].apply(o,args);delete o.__parent;return ret;},_superc:function(o)
{var tmpparent=o.__parent;if(o.__parent.prototype.__parent){o.__parent=o.__parent.prototype.__parent;}
tmpparent.prototype.constructor.apply(o);delete o.__parent;},};