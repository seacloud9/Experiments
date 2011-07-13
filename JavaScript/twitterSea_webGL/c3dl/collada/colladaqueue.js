
c3dl.ColladaQueue={queue:[],firstTime:true,isEmpty:function()
{return(c3dl.ColladaQueue.queue.length==0?true:false);},pushBack:function(colladaInstance)
{c3dl.ColladaQueue.queue.push(colladaInstance);if(c3dl.ColladaQueue.firstTime)
{c3dl.ColladaQueue.firstTime=false;c3dl.ColladaManager.loadFile(c3dl.ColladaQueue.queue[0].path);}},popFront:function()
{c3dl.ColladaQueue.queue.shift();if(c3dl.ColladaQueue.isEmpty()==false)
{c3dl.ColladaManager.loadFile(c3dl.ColladaQueue.queue[0].path);}
else if(c3dl.ColladaQueue.isEmpty()==true&&c3dl.mainCallBacks.length==0)
{c3dl.removeProgressBars();}
else if(c3dl.ColladaQueue.isEmpty()==true&&c3dl.mainCallBacks.length!=0)
{c3dl.removeProgressBars();for(var i=0,len=c3dl.mainCallBacks.length;i<len;i++)
{var func=c3dl.mainCallBacks[i].f;var tag=c3dl.mainCallBacks[i].t;func(tag);}}},getFront:function()
{return c3dl.ColladaQueue.queue[0];}};