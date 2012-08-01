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
	import away3d.primitives.Plane;
	import away3d.primitives.SkyBox;
	
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
	
	import jiglib.cof.JConfig;
	import jiglib.debug.Stats;
	import jiglib.geometry.JTriangleMesh;
	import jiglib.math.*;
	import jiglib.physics.*;
	import jiglib.physics.constraint.*;
	import jiglib.plugin.away3d4.*;
	
	

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
		private var physics:Away3D4Physics;
		private var ballBodies:Vector.<RigidBody>;
		private var boxBodies:Vector.<RigidBody>;
		private var island:ObjectContainer3D;
		private var mylight:PointLight;
		private var _timeScale : Number = 3;
		private var sphereContainer:ObjectContainer3D;
		private var sphereCollider:Mesh;
		
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
			_view.camera.x = -100;
			_view.camera.y = 90;
			_view.camera.rotationY = 90;
			_view.camera.z = 8;
			camera = _view.camera;
			camera.lens = new PerspectiveLens();
			camera.lens.far = 2000;
			
			
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
			var fog : FogMethod = new FogMethod(1500, 0x000000);
			
			//var poolMat : BitmapMaterial = new BitmapMaterial(tex);
			
			//poolMat.addMethod(fog);
			//poolMat.addMethod(new FogMethod(500, 0x000000));
			
			
			
			JConfig.solverType="FAST";
			physics = new Away3D4Physics(_view, 8);
			this.addChild(new Stats(_view, physics));
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
			_loader.y = 40;
			_loader.scaleX = 0.6;
			_loader.scaleY = 0.6;
			_loader.scaleZ = 0.6;
			var waterMaterial:BitmapMaterial = new BitmapMaterial(waterBitmap.bitmapData);
			waterMaterial.bothSides = true;
			plane = new Plane(waterMaterial, 7000, 7000, 100, 100);
			plane.y = 135;
			plane.rotationX = 90;
			plane.segmentsW = 100;
			plane.segmentsH = 100;
			_view.scene.addChild(plane);
			_view.scene.addChild(_loader);	
			
		}
		
		private function onAssetRetrieved(event : AssetEvent) : void
		{
			if (event.asset.assetType == AssetType.MESH) {
				var pmaterial : DefaultMaterialBase;
			
				
				_mesh = Mesh(event.asset);
				_mesh.scaleX = 0.4;
				_mesh.scaleY = 0.4;
				_mesh.scaleZ = 0.4;
				_mesh.y = 155;
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
				controller.timeScale = _timeScale;}

		}
		
		private function onSceneResourceComplete(event : LoaderEvent) : void
		{
			island=ObjectContainer3D(event.target);
			
			var mesh:Mesh=Mesh(island.getChildAt(0));
			mylight = new PointLight();
			_view.scene.addChild(mylight);
			mylight.color = 0xffffff;
			mylight.y = 2000;
			mylight.z = -1000;
			
			var materia:ColorMaterial = new ColorMaterial(0xeeee00);
			materia.lights=[mylight];
			materia.bothSides = true;
			
			//create the triangle mesh
			var triangleMesh:JTriangleMesh=physics.createMesh(mesh,new Vector3D(),new Matrix3D(),10,10);
			
			//create rigid bogies
			
			ballBodies = new Vector.<RigidBody>();
			for (var i:int = 0; i < 15; i++)
			{
				ballBodies[i] = physics.createSphere(materia, 30);
				ballBodies[i].moveTo(new Vector3D( -1000+2500*Math.random(),1000+1000*Math.random(), -1000+2500*Math.random()));
			}
			
			var materia2:ColorMaterial = new ColorMaterial(0x4AD700);
			materia2.lights=[mylight];
			materia2.bothSides = true;
			
			
			ballBodies[15] = physics.createSphere(materia2, 10);
			ballBodies[15].mass = 0.0000000005;
			ballBodies[15].movable = true;
			ballBodies[15].moveTo(new Vector3D(_view.camera.x, _view.camera.y - 400, _view.camera.z));
			sphereContainer = new ObjectContainer3D();
			//sphereContainer.position.x = _view.camera.x;
			//sphereContainer.position.y = _view.camera.y;
			//sphereContainer.position.z = _view.camera.z;
			_view.scene.addChild(sphereContainer);
			//camera.addChild(ballBodies[15].skin.mesh);
			sphereContainer.addChild(_view.camera);
			AssetLibrary.enableParser(MD2Parser);
			AssetLibrary.addEventListener(AssetEvent.ASSET_COMPLETE, onAssetRetrieved);
			AssetLibrary.load(new URLRequest('assets/test/tris.md2'));
			
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
			
			try{
				sphereContainer.position = _view.camera.position;
				//ballBodies[15].currentState.position = _view.camera.position;
				//_view.camera.position = sphereContainer.position;
				//ballBodies[15].moveTo( new Vector3D(sphereContainer.position.x, sphereContainer.position.y + 100, sphereContainer.position.z));
				ballBodies[15].currentState.position.x = sphereContainer.position.x;
				ballBodies[15].currentState.position.y = sphereContainer.position.y +100;
				ballBodies[15].currentState.position.z = sphereContainer.position.z;
				trace(camera.position );
				trace(ballBodies[15].currentState.position );
				isRenderable = true;
			}catch(e:Error){
				trace(e);
			}
			
			
		}		

		private function onEnterFrame(ev : Event) : void
		{
			
			_count += .003;
			_light.x = Math.sin(_count) * 150000;
			_light.y = 1000;
			_light.z = Math.cos(_count) * 150000;
			physics.step(0.1);
			if(isRenderable == true){
				_view.render();
			}
		}
	}
}