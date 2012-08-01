package views
{
	import flash.events.Event;
	
	import mx.core.UIComponent;
	
	
	/**
	 * This class is simply a UIComponent wrapper for the Canvas3D class which 
	 * is a Sprite so can't be directly added to the flex component 
	 * @author jonrowe
	 * 
	 */	
	public class UIComponent3D extends UIComponent
	{
		
		
		private var canvas3D :Canvas3D;
		
		public function UIComponent3D()
		{
			super(); 
		}
		
		/**
		 * overide the createChildren method of UIComponent and add a Canvas3D instance as a child 
		 * 
		 */		
		override protected function createChildren():void
		{
			super.createChildren();
			if (!canvas3D)
				create3DView();
		}
		
		/**
		 * override the updateDisplayList method so we can set the size of the away3D view
		 * @param unscaledWidth
		 * @param unscaledHeight
		 * 
		 */		
		override protected function updateDisplayList(
			unscaledWidth:Number, unscaledHeight:Number):void
		{
			
			super.updateDisplayList(unscaledWidth, unscaledHeight);
			//canvas3D is a sprite not a UIComponent so we must manually set it's size
			canvas3D.setSize(unscaledWidth,unscaledHeight);
		}
		
		
		/*			PRIVATE			*/
		
		/**
		 * create the canvas3D, listen for sceneReady event 
		 * 
		 */		
		private function create3DView():void{
			
			canvas3D = new Canvas3D();
			addChild (canvas3D);
			canvas3D.addEventListener(Canvas3D.SCENE_READY, onSceneReady);
			
		}
		
		public function getTweetSearch(sTweet:String):void{
			canvas3D.getSearch(sTweet);
		}
		
		/**
		 * called when the 3D scene has been initialized and added to the stage.
		 * @param e
		 * 
		 */		
		private function onSceneReady( e:Event ):void{
			//
		}
		
		
		
		
	}
}