package views
{
	import flash.events.Event;
	
	import mx.core.UIComponent;
	
	
	/**
	 * This class is simply a UIComponent wrapper for the SimpleFPS class which 
	 * is a Sprite so can't be directly added to the flex component 
	 * @author jonrowe
	 * 
	 */	
	public class UIComponent3D extends UIComponent
	{
		
		
		private var SimpleFPS :simpleFPS;
		
		public function UIComponent3D()
		{
			super(); 
		}
		
		/**
		 * overide the createChildren method of UIComponent and add a SimpleFPS instance as a child 
		 * 
		 */		
		override protected function createChildren():void
		{
			super.createChildren();
			if (!SimpleFPS)
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
			//SimpleFPS is a sprite not a UIComponent so we must manually set it's size
			SimpleFPS.setSize(unscaledWidth,unscaledHeight);
		}
		
		
		/*			PRIVATE			*/
		
		/**
		 * create the SimpleFPS, listen for sceneReady event 
		 * 
		 */		
		private function create3DView():void{
			
			SimpleFPS = new simpleFPS();
			addChild (SimpleFPS);
			//SimpleFPS.addEventListener(SimpleFPS.SCENE_READY, onSceneReady);
			
		}
		
		
		
		/**
		 * called when the 3D scene has been initialized and added to the stage.
		 * @param e
		 * 
		 */		
		private function onSceneReady( e:Event ):void{
			//
		}
		
		public function moveForward(direction:Boolean):void{
			SimpleFPS.forward = direction;
		}
		
		public function moveBackwards(direction:Boolean):void{
			SimpleFPS.backward = direction;
		}
		
		public function moveRight(direction:Boolean):void{
			SimpleFPS.turnRight = direction;
		}
		
		public function moveLeft(direction:Boolean):void{
			SimpleFPS.turnLeft = direction;
		}
		
		
	}
}