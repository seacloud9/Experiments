
c3dl.ProgramObject=function()
{this.programID=-1;this.rendererID=-1;this.getProgramID=function()
{return this.programID;}
this.getRendererID=function()
{return this.rendererID;}
this.toString=function(delimiter)
{if(!delimiter||typeof(delimiter)!="string")
{delimiter=",";}
return"Program ID = "+this.getProgramID()+delimiter+"Renderer ID = "+this.getRendererID();}}