package
{
	//Away3D lib
	import away3d.containers.View3D;
	import away3d.cameras.lenses.PerspectiveLens;
	import away3d.cameras.Camera3D;
	import away3d.debug.AwayStats;
	import away3d.entities.Mesh;
	import away3d.events.LoaderEvent;
	import away3d.lights.PointLight;
	import away3d.loaders.Loader3D;
	import away3d.loaders.misc.AssetLoaderContext;
	import away3d.loaders.parsers.JSONOBJParser;
	import away3d.primitives.SkyBox;
	import away3d.materials.utils.CubeMap;
	import away3d.materials.methods.FogMethod;
	import away3d.materials.BitmapMaterial;
	
	//Flash lib
	import flash.display.BitmapData;
	import flash.net.URLRequest;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	
	

	[SWF(width="1280", height="720", frameRate="60", backgroundColor="0x000000")]
	public class LoaderOBJTest extends Sprite
	{
		private var _view : View3D;
		private var _loader : Loader3D;
		private var _light : PointLight;
		public var camera:Camera3D;
		//private var _camController : HoverDragController;
		private var _count : Number = 0;
		protected static const MOVESPEED:Number = 100;
		protected static const TURNSPEED:Number = 90;
		protected var forward:Boolean = false;
		protected var backward:Boolean = false;
		protected var turnLeft:Boolean = false;
		protected var turnRight:Boolean = false;
		private var _cubeMap : CubeMap;
		[Embed(source="assets/skybox/px.jpg")]
		private var EnvPosX:Class;
		[Embed(source="assets/skybox/py.jpg")]
		private var EnvPosY:Class;
		[Embed(source="assets/skybox/pz.jpg")]
		private var EnvPosZ:Class;
		[Embed(source="assets/skybox/nx.jpg")]
		private var EnvNegX:Class;
		[Embed(source="assets/skybox/ny.jpg")]
		private var EnvNegY:Class;
		[Embed(source="assets/skybox/nz.jpg")]
		private var EnvNegZ:Class;
		
		
		public function LoaderOBJTest()
		{
			_view = new View3D();
			_view.antiAlias = 4;
			this.addChild(_view);


			_light = new PointLight();
			_light.x = 15000;
			_light.z = 15000;
			_light.color = 0xffddbb;
			_view.scene.addChild(_light);
			_view.camera.x = -322.296630859375;
			_view.camera.y = -130;
			_view.camera.z = 737.6616821289063;
			camera = _view.camera;
			camera.lens = new PerspectiveLens();
			camera.lens.far = 6000;
			
			//You can uncomment this to use the Hover Cam if you prefer
			//_camController = new HoverDragController(_view.camera, stage);
			addChild(new AwayStats(_view));
			initMesh();

			addEventListener(Event.ENTER_FRAME, onEnterFrame);
			_view.mouseEnabled = true;
			this.addEventListener(Event.ENTER_FRAME, handleEnterFrame);
			this.stage.addEventListener(KeyboardEvent.KEY_UP, keyUpHandler);
			this.stage.addEventListener(KeyboardEvent.KEY_DOWN, keyDownHandler);
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			stage.addEventListener(Event.RESIZE, onStageResize);
			
			_cubeMap = new CubeMap( new EnvPosX().bitmapData, new EnvNegX().bitmapData,
				new EnvPosY().bitmapData, new EnvNegY().bitmapData,
				new EnvPosZ().bitmapData, new EnvNegZ().bitmapData);
			
			_view.scene.addChild(new SkyBox(_cubeMap));
			
			var tex : BitmapData = new BitmapData(512, 512, false, 0);
			tex.perlinNoise(25, 25, 8, 1, false, true, 7, true);
			var fog : FogMethod = new FogMethod(2500, 0x000000);
			var poolMat : BitmapMaterial = new BitmapMaterial(tex);
			poolMat.addMethod(fog);
			poolMat.transparent = true;
			poolMat.addMethod(new FogMethod(_view.camera.lens.far * .5, 0x000000));
		}

		private function onStageResize(event : Event) : void
		{
			_view.width = stage.stageWidth;
			_view.height = stage.stageHeight;
		}

		private function initMesh() : void
		{
			Loader3D.enableParser(JSONOBJParser);
			_loader = new Loader3D();
			_loader.load(new URLRequest('assets/substation.js'), new JSONOBJParser());
			_loader.y = -50;
			_view.scene.addChild(_loader);
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
				_view.camera.moveForward(MOVESPEED * .10);
			else if (this.backward)
				_view.camera.moveBackward(MOVESPEED * .10);
			
			if (this.turnLeft)
				_view.camera.rotationY -= TURNSPEED * .10;
			else if (this.turnRight)
				_view.camera.rotationY += TURNSPEED * .10;
			_view.render();
			trace(_view.camera.position);
		}		

		private function onEnterFrame(ev : Event) : void
		{
			_count += .003;

			_light.x = Math.sin(_count) * 150000;
			_light.y = 1000;
			_light.z = Math.cos(_count) * 150000;

			_view.render();
		}
	}
}