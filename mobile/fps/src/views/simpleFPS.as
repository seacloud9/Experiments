package views
{
	import away3d.cameras.Camera3D;
	import away3d.cameras.lenses.PerspectiveLens;
	import away3d.containers.*;
	import away3d.controllers.FirstPersonController;
	import away3d.controllers.HoverController;
	import away3d.core.base.Geometry;
	import away3d.core.base.Object3D;
	import away3d.debug.AwayStats;
	import away3d.entities.*;
	import away3d.events.AssetEvent;
	import away3d.events.LoaderEvent;
	import away3d.events.MouseEvent3D;
	import away3d.events.Scene3DEvent;
	import away3d.filters.BloomFilter3D;
	import away3d.filters.MotionBlurFilter3D;
	import away3d.library.AssetLibrary;
	import away3d.library.assets.*;
	import away3d.lights.DirectionalLight;
	import away3d.lights.PointLight;
	import away3d.loaders.AssetLoader;
	import away3d.loaders.Loader3D;
	import away3d.loaders.parsers.AWD2Parser;
	import away3d.loaders.parsers.AWDParser;
	import away3d.loaders.parsers.DAEParser;
	import away3d.loaders.parsers.OBJParser;
	import away3d.materials.*;
	import away3d.materials.lightpickers.StaticLightPicker;
	import away3d.primitives.CubeGeometry;
	import away3d.primitives.SphereGeometry;
	import away3d.textures.BitmapTexture;
	import away3d.utils.*;
	
	import com.dasflash.soundcloud.as3api.SoundcloudClient;
	import com.dasflash.soundcloud.as3api.SoundcloudDelegate;
	import com.dasflash.soundcloud.as3api.SoundcloudResponseFormat;
	import com.dasflash.soundcloud.as3api.events.SoundcloudAuthEvent;
	import com.dasflash.soundcloud.as3api.events.SoundcloudFaultEvent;
	import com.theflashblog.utils.Math2;
	
	import flash.display.Screen;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.KeyboardEvent;
	import flash.events.TransformGestureEvent
	import flash.events.MouseEvent;
	import flash.events.TouchEvent;
	import flash.geom.Vector3D;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.URLRequestMethod;
	import flash.net.navigateToURL;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	import flash.ui.Multitouch;
	import flash.ui.MultitouchInputMode;
	
	import flashx.textLayout.formats.Float;
	
	import gs.TweenLite;
	
	import hype.extended.behavior.FunctionTracker;
	import hype.extended.layout.GridLayout;
	import hype.framework.sound.SoundAnalyzer;
	
	import org.iotashan.oauth.OAuthConsumer;
	
	import utils.HoverDragController;
	
	import views.component.WireframeSingleAxisGrid;
	
	/**
	 * Canvas3D is a component to create and display a 3D scene.
	 * By default it contains:
	 * - a grid in the XZ plane
	 * - a cube
	 * - a pointlight
	 * - a directional light
	 * - a camera with a hover controller
	 * @author jonrowe
	 * 
	 */	
	
	public class simpleFPS extends Sprite
	{
		/*		PUBLIC PROPERTIES		*/
		
		public static const SCENE_READY :String = 'scene_ready';
		
		/*		PRIVATE PROPERTIES		*/
		
		private var _view3D:View3D;									//the View3D instance
		private var camController:FirstPersonController;			//the camera controller
		//private var camController:HoverDragController;
		private var _camera:Camera3D;
		private var sunLight :DirectionalLight;						//A light
		private var skyLight :PointLight;							//Another light
		private var lightPicker:StaticLightPicker;					//A light picker
		private var _loader : Loader3D;
		private var urlRequestContainer:Array = new Array();
		private var _width:uint;
		private var _height:uint;
		private var _aspect:uint;
		private var _unitsize:uint;
		private var _wallSize:uint;
		private var _bulletMoveSpeed:uint;
		private var _numai:uint;
		private var _projectDamage:uint;
		private var _map:Array;
		private var _mapW:uint;
		private var _mapH:uint;
		
		public var forward:Boolean = false;
		public var backward:Boolean = false;
		public var turnLeft:Boolean = false;
		public var turnRight:Boolean = false;
		protected static const MOVESPEED:Number = 120;
		protected static const TURNSPEED:Number = 90;
		
		[Embed(source="assets/images/wall-1.jpg")]
		public static var _wall1Img : Class;
		
		[Embed(source="assets/images/wall-2.jpg")]
		public static var _wall2Img : Class;
		
		/*mapW = map.length, mapH = map[0].length; */
		/*		CONSTRUCT		*/
		
		/**
		 * wait for addedToStage event before doing anything 
		 * 
		 */		
		public function simpleFPS(unitSize:uint = 250, numai:uint = 5, projectDamage:uint = 20,map:Array = null)
		{
			super();
			Multitouch.inputMode = MultitouchInputMode.TOUCH_POINT; 
			this.addEventListener( Event.ADDED_TO_STAGE, onAddedToStage );
		/*	_width = this.stage.width;
			_height = this.stage.height;*/
			_aspect = _width / _height;
			_unitsize = unitSize;
			_wallSize = _unitsize / 3;
			//trace(_wallSize);
			//_bulletMoveSpeed = _moveSpeed * 5;
			_numai = numai;
			_projectDamage = projectDamage;
			if(map == null){
			_map  = [ 
				[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 0
				[1, 1, 0, 0, 0, 0, 0, 1, 1, 1], // 1
				[1, 1, 0, 0, 2, 0, 0, 0, 0, 1], // 2
				[1, 0, 0, 0, 0, 2, 0, 0, 0, 1], // 3
				[1, 0, 0, 2, 0, 0, 2, 0, 0, 1], // 4
				[1, 0, 0, 0, 2, 0, 0, 0, 1, 1], // 5
				[1, 1, 1, 0, 0, 0, 0, 1, 1, 1], // 6
				[1, 1, 1, 0, 0, 1, 0, 0, 1, 1], // 7
				[1, 1, 1, 1, 1, 1, 0, 0, 1, 1], // 8
				[1, 1, 1, 1, 1, 1, 1, 1, 1, 1] // 9
			];
			_mapW = _map.length;
			_mapH = _map[0].length;
			}else{
				_map = map;
				_mapW = _map.length;
				_mapH = _map[0].length;
			}
			
			this.addEventListener( Event.ADDED_TO_STAGE, onAddedToStage );
		}
		
		
		/*		GETTER/SETTERS		*/
		
		/**
		 * returns the View3D instance 
		 * @return 
		 * 
		 */		
		public function get view3D():View3D{
			return _view3D;
		}
		
		
		
		
		/*		PUBLIC		*/
		
		
		/**
		 * resize the view3D
		 * @param w
		 * @param h
		 * 
		 */		
		public function setSize(w:int, h:int):void{
			
			if (!_view3D) return;
			
			_view3D.width = w;
			_view3D.height = h;
			
		}
		
		/**
		 *start listening for enterframe events 
		 * 
		 */		
		public function start():void{
			addEventListener(Event.ENTER_FRAME, onEnterFrame);
			//need to call render here otherwise enterFrame events don't happen?!
			_view3D.render();
			
		}
		
		/**
		 * stop listening for enterframe events 
		 * 
		 */		
		public function stop():void{
			if ( hasEventListener( Event.ENTER_FRAME ))
				removeEventListener( Event.ENTER_FRAME, onEnterFrame );
		}
		
		
		/*		PRIVATE		*/
		
		/**
		 * initialise the view
		 * 
		 */		
		private function initView():void
		{
			
			if(!this._view3D)
			{
				_view3D = new View3D(); 
				_view3D.mouseEnabled = true;
				_view3D.backgroundColor = 0xD6F1FF; 
				_view3D.antiAlias = 2; 
			}
			this.addChild(_view3D); 
			
		}
		
		
		/**
		 * initialise the scene with a grid, cube
		 * draw stats
		 * 
		 */		
		private function initScene():void{
						
			
			var grid :WireframeSingleAxisGrid = new WireframeSingleAxisGrid(10,1000,1.5,WireframeSingleAxisGrid.PLANE_XZ,0x4a4a4a);
			_view3D.scene.addChild(grid);
			
			//a cube
			var cubeGeometry:CubeGeometry = new CubeGeometry(100,100,100);
			var cubeMaterial:ColorMaterial = new ColorMaterial( 0xE65814, 0.8 );
			cubeMaterial.lightPicker = lightPicker;
			var mesh:Mesh = new Mesh(cubeGeometry, cubeMaterial);
			_view3D.scene.addChild( mesh );
			
			//the stats
			var stats :AwayStats = new AwayStats(_view3D);
			//addChild(stats);
			
			var floor:Mesh = new Mesh(
			new CubeGeometry(_mapW * _unitsize,10, _mapW * _unitsize), new ColorMaterial(0xEDCBA0, 1) );
			_view3D.scene.addChild(floor);
			
			var cube:CubeGeometry = new CubeGeometry(_unitsize, _wallSize, _unitsize);
			var materialWalls:Array = [
				new TextureMaterial(Cast.bitmapTexture(_wall1Img)),
				new TextureMaterial(Cast.bitmapTexture(_wall2Img))
			];
			
			for (var i:uint = 0; i < _mapW; i++) {
				for (var j:uint = 0, m:uint = _map[i].length; j < m; j++) {
					if (_map[i][j]) {
						var wallM:Mesh = new Mesh(cube, materialWalls[_map[i][j]-1]);
						wallM.x = (i - _mapW/2) * _unitsize;
						wallM.y = _wallSize/2;
						wallM.z = (j - _mapW/2) * _unitsize;
						_view3D.scene.addChild(wallM);
					}
				}
				
			}
			//trace(_view3D.scene);
			this.stage.addEventListener(KeyboardEvent.KEY_UP, keyUpHandler);
			this.stage.addEventListener(KeyboardEvent.KEY_DOWN, keyDownHandler);
			this.addEventListener(Event.ENTER_FRAME, handleEnterFrame);
			/*
			
			
			
			// Geometry: walls
			var cube = new t.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
			var materials = [
			new t.MeshLambertMaterial({map: t.ImageUtils.loadTexture('images/wall-1.jpg')}),
			new t.MeshLambertMaterial({map: t.ImageUtils.loadTexture('images/wall-2.jpg')}),
			];
			for (var i = 0; i < mapW; i++) {
			for (var j = 0, m = map[i].length; j < m; j++) {
			if (map[i][j]) {
			var wall = new t.Mesh(cube, materials[map[i][j]-1]);
			wall.position.x = (i - units/2) * UNITSIZE;
			wall.position.y = WALLHEIGHT/2;
			wall.position.z = (j - units/2) * UNITSIZE;
			scene.add(wall);
			}
			}
			}
			
			*/

		}
		
		
		
		/**
		 * initialise the hover drag controller for camera 
		 * 
		 */		
		private function initCamController():void{
			//camController = new FirstPersonController(_view3D.camera);
			_camera = _view3D.camera;
			_view3D.camera.x = 1;
			_view3D.camera.y = 15;
			_view3D.camera.z = 1;
			//camController = new HoverDragController(_view3D.camera, this);
			_view3D.camera.lens = new PerspectiveLens();
			_view3D.camera.lens.far = 8000;
			
			/*
			camController = new HoverDragController(_view3D.camera, this);
			camController.radius = 800;*/
		}
		
		private function keyDownHandler(event:KeyboardEvent):void {
			if (event.keyCode == 38)
			{
				this.forward = true;
			}
			else if (event.keyCode == 40)
			{
				this.backward = true;
			}
			else if (event.keyCode == 39)
			{
				this.turnRight = true;
			}
			else if (event.keyCode == 37)
			{
				this.turnLeft = true;
			}
			
		}
		
		private function keyUpHandler(event:KeyboardEvent):void {
			if (event.keyCode == 38)
			{
				this.forward = false;
			}
			else if (event.keyCode == 40)
			{
				this.backward = false;
			}
			else if (event.keyCode == 39)
			{
				this.turnRight = false;
			}
			else if (event.keyCode == 37)
			{
				this.turnLeft = false;
			}
			
		}
		
		private function handleEnterFrame(e : Event) : void
		{	
			if (this.forward)
				_view3D.camera.moveForward(MOVESPEED * .10);
			else if (this.backward)
				_view3D.camera.moveBackward(MOVESPEED * .10);
			
			if (this.turnLeft)
				_view3D.camera.rotationY -= TURNSPEED * .10;
			else if (this.turnRight)
				_view3D.camera.rotationY += TURNSPEED * .10;
			_view3D.render();
			//trace(_view3D.camera.position);
			var vc:Vector3D = new Vector3D(_view3D.camera.position.x + 30, _view3D.camera.position.y + 30, _view3D.camera.position.z + 30 );
			//trace(vc);
			var isColliding:Boolean = checkWallCollision(vc);
			//trace(isColliding);
			if(isColliding){
				checkDirection();
			}
			//Multitouch.inputMode = MultitouchInputMode.GESTURE;
			//this.addEventListener(TransformGestureEvent.GESTURE_SWIPE , onSwipe); 
		}
		
		function onSwipe (e:TransformGestureEvent):void{
			if (e.offsetX == 1) { 
				//User swiped towards right
				_view3D.camera.rotationY += TURNSPEED * .10;
			}
			if (e.offsetX == -1) { 
				//User swiped towards right
				_view3D.camera.rotationY -= TURNSPEED * .10;
			}
		}
		
		/**
		 * set up listeners
		 * 
		 */		
		private function initListeners():void{
			_view3D.scene.addEventListener( Scene3DEvent.ADDED_TO_SCENE, onAddedToScene );
			_view3D.scene.addEventListener( Scene3DEvent.REMOVED_FROM_SCENE, onRemovedFromScene );
			
			
		}
		
		private function checkDirection():void{
			
			if(this.forward == true){
				
				this.forward = false;
				_view3D.camera.moveBackward(MOVESPEED * .10);
			}
			if(this.backward == true){
				this.backward = false;
				_view3D.camera.moveForward(MOVESPEED * .10);
			}
			if(this.turnLeft == true){
				this.turnLeft = false;
				_view3D.camera.moveRight(MOVESPEED * .10);
			}
			if(this.turnRight == true){
				this.turnRight = false;
				_view3D.camera.moveLeft(MOVESPEED * .10);
			}
		}
		
		/**
		 * Initialise the lights
		 */
		private function initLights():void
		{
			//create a light for shadows that mimics the sun's position in the skybox
			sunLight = new DirectionalLight(-1, -0.4, 1);
			sunLight.color = 0xFFFFFF;
			sunLight.castsShadows = true;
			sunLight.ambient = 1;
			sunLight.diffuse = 1;
			sunLight.specular = 1;
			_view3D.scene.addChild(sunLight);
			
			//create a light for ambient effect that mimics the sky
			skyLight = new PointLight();
			skyLight.y = 500;
			skyLight.color = 0xFFFFFF;
			skyLight.diffuse = 1;
			skyLight.specular = 0.5;
			skyLight.radius = 2000;
			skyLight.fallOff = 2500;
			_view3D.scene.addChild(skyLight);
			
			lightPicker = new StaticLightPicker([sunLight, skyLight]);
		}
		
		private function checkWallCollision(position:Vector3D):Boolean{
			var c:Object = getMapSector(position);
			return _map[c.x][c.z] > 0;
		}
		
		private function getMapSector(v:Vector3D):Object {
			var x:uint = Math.floor((v.x + _unitsize / 2) / _unitsize + _mapW/2);
			var z:uint = Math.floor((v.z + _unitsize / 2) / _unitsize + _mapW/2);
			return {x: x, z: z};
		}
		/*		EVENT		*/
		
		
		/**
		 * called when this canvas3D instance has been added to stage 
		 * @param e
		 * 
		 */		
		private function onAddedToStage( e:Event ):void{
			
			initView();
			initLights();
			initCamController();
			initListeners();
			initScene();
			
			start();
			
			dispatchEvent( new Event(SCENE_READY));
			this.removeEventListener(Event.ADDED_TO_STAGE, onAddedToStage );
		}
		
		
		/**
		 * render loop called every frame 
		 * @param ev
		 * 
		 */		
		private function onEnterFrame(e : Event) : void {
			_view3D.render();
		} 
		
		
		/**
		 * called when an Object3D is added to the scene
		 */		
		private function onAddedToScene( e:Scene3DEvent ):void{
			
		}
		
		/**
		 * called when an Object3D is removed to the scene
		 * @param e
		 * 
		 */		
		private function onRemovedFromScene( e:Scene3DEvent ):void{
			
		}
		
		protected function onLoaded(event:Event):void
		{
		

		}
		
		private function onComplete(e:LoaderEvent):void{
			
		}
		
		
		

	}
	
}