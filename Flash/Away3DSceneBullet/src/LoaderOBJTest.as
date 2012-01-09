package
{
	//Away3D lib
	import away3d.animators.VertexAnimator;
	import away3d.cameras.Camera3D;
	import away3d.cameras.lenses.PerspectiveLens;
	import away3d.containers.ObjectContainer3D;
	import away3d.containers.View3D;
	import away3d.core.base.Object3D;
	import away3d.core.base.SubGeometry;
	import away3d.debug.AwayStats;
	import away3d.entities.Mesh;
	import away3d.events.AssetEvent;
	import away3d.events.LoaderEvent;
	import away3d.extrusions.Elevation;
	import away3d.extrusions.SkinExtrude;
	import away3d.library.AssetLibrary;
	import away3d.library.assets.AssetType;
	import away3d.lights.PointLight;
	import away3d.loaders.Loader3D;
	import away3d.loaders.misc.AssetLoaderContext;
	import away3d.loaders.parsers.MD2Parser;
	import away3d.loaders.parsers.OBJParser;
	import away3d.materials.BitmapFileMaterial;
	import away3d.materials.BitmapMaterial;
	import away3d.materials.ColorMaterial;
	import away3d.materials.DefaultMaterialBase;
	import away3d.materials.methods.EnvMapDiffuseMethod;
	import away3d.materials.methods.FogMethod;
	import away3d.materials.utils.CubeMap;
	import away3d.primitives.Cube;
	import away3d.primitives.Plane;
	import away3d.primitives.SkyBox;
	import away3d.primitives.Sphere;
	
	import awayphysics.collision.dispatch.AWPCollisionObject;
	import awayphysics.collision.shapes.*;
	import awayphysics.collision.shapes.AWPSphereShape;
	import awayphysics.data.AWPCollisionFlags;
	import awayphysics.debug.AWPDebugDraw;
	import awayphysics.dynamics.*;
	import awayphysics.dynamics.vehicle.*;
	import awayphysics.events.AWPEvent;
	
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.geom.Matrix3D;
	import flash.geom.Vector3D;
	import flash.net.URLRequest;
	import flash.ui.Keyboard;
	

	
	

	[SWF(width="1280", height="720", frameRate="60", backgroundColor="0x000000")]
	public class LoaderOBJTest extends Sprite
	{
		private var _view : View3D;
		private var _loader : Loader3D;
		private var _light : PointLight;
		private var _mesh : Mesh;
		public var camera:Camera3D;
		public var plane:Plane;
		public var waveCycle:Number =5;
		public var threeSixtyRads:Number = 360 * (Math.PI / 180);
		private var _speed:Number = 1;
		public var extrude:SkinExtrude;
		private var isRenderable:Boolean = false;
		[Embed(source="assets/shipwreck/water.jpg")] private var WaterImage:Class;
		[Embed(source="assets/shipwreck/waterM.jpg")] private var WaterImageM:Class;
		[Embed(source="assets/test/Ratamahatta.jpg")] private var Oger:Class;
		private var oger:Bitmap = new Oger();
		private var waterBitmap:Bitmap = new WaterImage();
		private var waterBitmapM:Bitmap = new WaterImageM();
		private var wave:Number = 0;
		//private var _camController : HoverDragController;
		private var _count : Number = 0;
		protected static const MOVESPEED:Number = 100;
		protected static const TURNSPEED:Number = 90;
		protected var forward:Boolean = false;
		protected var backward:Boolean = false;
		protected var turnLeft:Boolean = false;
		protected var turnRight:Boolean = false;
		public var elevate:Elevation;
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
		
		private var island:ObjectContainer3D;
		private var mylight:PointLight;
		private var _timeScale : Number = 3;
		private var sphereContainer:ObjectContainer3D;
		private var sphereCollider:Mesh;
		private var physicsWorld : AWPDynamicsWorld;
		private var debugDraw:AWPDebugDraw;
		private var _sphereShape : AWPSphereShape;
		public var sphereArr:Array = new Array();
		private var timeStep : Number = 0.2 / 60;
		//private var timeStep : Number = 1 / 60;
		
		
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
			/*_view.camera.x = -110;
			_view.camera.y = 167;
			_view.camera.rotationY = 90;*/
			_view.camera.x = 800;
			_view.camera.y = 220;
			_view.camera.rotationY = -90;
			_view.camera.z = 8;
			camera = _view.camera;
			camera.lens = new PerspectiveLens();
			camera.lens.far = 5000;
			
			
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
			var fog : FogMethod = new FogMethod(1500, 0x808080);
			
			
			
			
			
			
		}

		private function onStageResize(event : Event) : void
		{
			_view.width = stage.stageWidth;
			_view.height = stage.stageHeight;
		}

		private function initMesh() : void
		{
			Loader3D.enableParser(OBJParser);
			_loader = new Loader3D();
			_loader.load(new URLRequest('assets/shipwreck/shipwreck.obj'), new OBJParser());
			_loader.addEventListener(LoaderEvent.RESOURCE_COMPLETE, onSceneResourceComplete);
			
			var waterMaterial:BitmapMaterial = new BitmapMaterial(waterBitmap.bitmapData);
			waterMaterial.bothSides = true;
			plane = new Plane(waterMaterial, 7000, 7000, 100, 100);
			plane.y = 135;
			plane.rotationX = 90;
			plane.segmentsW = 100;
			plane.segmentsH = 100;
			
			// init the physics world
			physicsWorld = AWPDynamicsWorld.getInstance();
			physicsWorld.initWithDbvtBroadphase();
			physicsWorld.collisionCallbackOn = true;
			
			
			_view.scene.addChild(plane);
	
			
		}
		
		private function onAssetRetrieved(event : AssetEvent) : void
		{
			if (event.asset.assetType == AssetType.MESH) {
				var pmaterial : DefaultMaterialBase;
			
				
				_mesh = Mesh(event.asset);
				_mesh.scaleX = 0.4;
				_mesh.scaleY = 0.4;
				_mesh.scaleZ = 0.4;
				_mesh.y = 185;
				_mesh.x = 65;
				_mesh.z = 8;
				_view.scene.addChild(_mesh);
			
				pmaterial = DefaultMaterialBase(_mesh.material);
				var ogerMaterial:BitmapMaterial = new BitmapMaterial(new Oger().bitmapData);
				_mesh.material = ogerMaterial;
				//pmaterial.specularMap = new Oger().bitmapData;
				
			}
			else if (event.asset.assetType == AssetType.ANIMATOR) {
				var controller : VertexAnimator = VertexAnimator(event.asset);
				controller.play("stand");
				controller.timeScale = _timeScale;
			}
			//debugDraw = new AWPDebugDraw(_view, physicsWorld); 
			//debugDraw.debugMode = AWPDebugDraw.DBG_DrawCollisionShapes;

		}
		
		private function onSceneResourceComplete(event : LoaderEvent) : void
		{
			island=ObjectContainer3D(event.target);
			
			island.y = -180;
			island.scaleX = 2;
			island.scaleY = 2;
			island.scaleZ = 2;
			var mesh:Mesh=Mesh(island.getChildAt(0));
			_view.scene.addChild(island);
			
			mylight = new PointLight();
			_view.scene.addChild(mylight);
			mylight.color = 0xffffff;
			mylight.y = 2000;
			mylight.z = -1000;
			
			var materia:ColorMaterial = new ColorMaterial(0xeeee00);
			materia.lights=[mylight];
			materia.bothSides = true;
			var sceneShape : AWPBvhTriangleMeshShape = new AWPBvhTriangleMeshShape(mesh.geometry);
			var sceneBody : AWPRigidBody = new AWPRigidBody(sceneShape, mesh, 0);
			
			//sceneBody.collisionFlags = AWPCollisionFlags.CF_STATIC_OBJECT;
			sceneBody.addEventListener(AWPEvent.COLLISION_ADDED, worldCollisionAdded);
			physicsWorld.addRigidBody(sceneBody);
			
			//create rigid bogies
			for(var i:int = 0; i < 1; i++){
				
				/*_sphereShape = new AWPSphereShape(40);
				var sphere : Sphere = new Sphere(materia, 40);
				sphere.position = camera.position;
				
				var body : AWPRigidBody = new AWPRigidBody(_sphereShape, sphere, 2);
				//body.position = camera.position;		
				body.ccdSweptSphereRadius = 0.5;
				body.ccdMotionThreshold = 0.5;
				body.gravity = new Vector3D(0.005, 0.005, 0.005, 0.005);
				sphereArr[i] = body;
				body.position = camera.position;
				body.x = -140; //- 10  + (i*5);
				body.y = 400;
				body.z =  (i * 10 + 80) + 100;
				

				_view.scene.addChild(sphere);
				//body.addEventListener(AWPEvent.COLLISION_ADDED, worldCollisionAdded);
				physicsWorld.addRigidBody(sphereArr[i]);*/
				
				var boxShape : AWPBoxShape = new AWPBoxShape(600, 600, 600);
				var cube:Cube = new Cube(materia, 200, 200, 200);
				
				var body:AWPRigidBody = new AWPRigidBody(boxShape, cube, 1);
				body.friction = .9;
				//body.position = new Vector3D(-140, 500, (i * 10 + 80) + 100);
				body.x = -140; //- 10  + (i*5);
				body.y = 800;
				body.z =  (i * 10 + 80) + 100;
				_view.scene.addChild(cube);
				physicsWorld.addRigidBody(body);
				
				
				
				//trace(body.position.x);
				//trace(camera.position.x);
			}
			
			
			
			AssetLibrary.enableParser(MD2Parser);
			AssetLibrary.addEventListener(AssetEvent.ASSET_COMPLETE, onAssetRetrieved);
			AssetLibrary.load(new URLRequest('assets/test/tris.md2'));
			
		}
		
		private function worldCollisionAdded(event : AWPEvent) : void {
			trace(event);
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
		
		private function incrementWave():void {
			waveCycle += _speed; // angle in radians
			var v:Vector.<Number> = SubGeometry(plane.geometry.subGeometries[0]).vertexData;
			var i:int;
			// manipulate the Z component of each vertex
			for (i = 2; i < v.length; i += 3) {
				// multiply by the sine of the x coordinate, plus offset for animation (normalized to be 0-360 degrees)
				v[i] = Math.sin(((v[i - 2] + waveCycle) / 100) * (threeSixtyRads * 1) )  * 2;
				// add harmonic from Y frequency
				v[i] += Math.sin(((v[i - 1] + waveCycle) / 100) * (threeSixtyRads * 1) )  * 1;
			}
			
			SubGeometry(plane.geometry.subGeometries[0].updateVertexData(v));
			
		}
		
		private function handleEnterFrame(e : Event) : void
		{	
			
			
			incrementWave();

			if (this.forward)
				_view.camera.moveForward(MOVESPEED * .05);
			else if (this.backward)
				_view.camera.moveBackward(MOVESPEED * .05);
			
			if (this.turnLeft)
				_view.camera.rotationY -= TURNSPEED * .05;
			else if (this.turnRight)
				_view.camera.rotationY += TURNSPEED * .05;
			
			
				isRenderable = true;
			
			
			
		}		

		private function onEnterFrame(ev : Event) : void
		{
			_count += .003;
			_light.x = Math.sin(_count) * 150000;
			_light.y = 1000;
			_light.z = Math.cos(_count) * 150000;
			physicsWorld.step(timeStep);
			try{
			//debugDraw.debugDrawWorld();
			}catch(e:Error){
				
				trace(e);
			}
			_view.render();
		}
	}
}