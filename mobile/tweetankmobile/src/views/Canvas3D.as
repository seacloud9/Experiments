package views
{
	import away3d.cameras.Camera3D;
	import away3d.cameras.lenses.PerspectiveLens;
	import away3d.containers.ObjectContainer3D;
	import away3d.containers.View3D;
	import away3d.core.base.Geometry;
	import away3d.core.base.Object3D;
	import away3d.debug.AwayStats;
	import away3d.entities.Mesh;
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
	import away3d.materials.ColorMaterial;
	import away3d.materials.TextureMaterial;
	import away3d.materials.lightpickers.StaticLightPicker;
	import away3d.primitives.CubeGeometry;
	import away3d.primitives.SphereGeometry;
	import away3d.textures.BitmapTexture;
	
	import com.dasflash.soundcloud.as3api.SoundcloudClient;
	import com.dasflash.soundcloud.as3api.SoundcloudDelegate;
	import com.dasflash.soundcloud.as3api.SoundcloudResponseFormat;
	import com.dasflash.soundcloud.as3api.events.SoundcloudAuthEvent;
	import com.dasflash.soundcloud.as3api.events.SoundcloudFaultEvent;
	import com.theflashblog.utils.Math2;
	
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.EventDispatcher;
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
	
	public class Canvas3D extends Sprite
	{
		/*		PUBLIC PROPERTIES		*/
		
		public static const SCENE_READY :String = 'scene_ready';
		
		/*		PRIVATE PROPERTIES		*/
		
		private var _view3D:View3D;									//the View3D instance
		private var camController:HoverDragController;   			//the camera controller
		private var sunLight :DirectionalLight;						//A light
		private var skyLight :PointLight;							//Another light
		private var lightPicker:StaticLightPicker;					//A light picker
		private var _loader : Loader3D;
		private var urlRequestContainer:Array = new Array();
		[Embed(source="assets/models/Sphere01-node.png")]
		private var Ocean : Class;
		private var material:BitmapTexture = new BitmapTexture(new Ocean().bitmapData);
		private var fishy:Object = new Object();
		private  var fishArr:Array = new Array(); 
		private var origin:Vector3D=new Vector3D(0,0,0);
		private var OceanSphere:SphereGeometry;
		private var soundAnalyzer:SoundAnalyzer;
		private var sound:Sound;
		private var musicChannel;
		private var xMove:FunctionTracker;
		private var xScaleTracker:FunctionTracker;
		private var yScaleTracker:FunctionTracker;
		private var zScaleTracker:FunctionTracker;
		private var loaderJSON:URLLoader;
		private var _motionBlur : MotionBlurFilter3D;
		private var _isTweetSearch:Boolean;
		private var _xmoveArr:Array;
		private var oAuth:OAuthConsumer;
		private var soundCloud:SoundcloudClient;
		
		
		/*		CONSTRUCT		*/
		
		/**
		 * wait for addedToStage event before doing anything 
		 * 
		 */		
		public function Canvas3D()
		{
			super();
			_isTweetSearch = false;
			Multitouch.inputMode=MultitouchInputMode.TOUCH_POINT; 
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
				_view3D.backgroundColor = 0x393939; 
				_view3D.antiAlias = 2; 
			}
			this.addChild(_view3D); 
			//_view3D.filters3d = [ new BloomFilter3D(100, 100, .5, 2, 1) ];
			
		}
		
		
		/**
		 * initialise the scene with a grid, cube
		 * draw stats
		 * 
		 */		
		private function initScene():void{
						
			
			
			//the stats
			var stats :AwayStats = new AwayStats(_view3D);
			addChild(stats);
			soundAnalyzer = new SoundAnalyzer();
			soundAnalyzer.start();
			_xmoveArr = new Array();
			
			loaderJSON = new URLLoader(
			new URLRequest("http://search.twitter.com/search.json?q=stage3d"));
			loaderJSON.addEventListener(Event.COMPLETE, onLoaded);
			
			soundCloud = new SoundcloudClient('************', '************', null , false, "binary");
			soundCloud.getRequestToken();
			soundCloud.addEventListener(SoundcloudAuthEvent.REQUEST_TOKEN, onRequestTokenSuccess);
			
		}
		
		public function getSearch(sTweet:String):void{
			loaderJSON = new URLLoader(new URLRequest("http://search.twitter.com/search.json?q="+escape(sTweet)));
			var arr:int = fishArr.length;
			for(var i:int = 0; i < arr; i++){
			 	try{
					
					_view3D.scene.removeChild(fishArr[i]);
					delete _xmoveArr[i];
					delete urlRequestContainer[i];
					delete fishArr[i];
				}catch(e:Error){
					trace(e);
				}
			}
			_isTweetSearch = true;
			fishArr = new Array();
			_xmoveArr = new Array();
			urlRequestContainer = new Array();
			loaderJSON.addEventListener(Event.COMPLETE, onLoaded);
		}
		
		/**
		 * initialise the hover drag controller for camera 
		 * 
		 */		
		private function initCamController():void{
			camController = new HoverDragController(_view3D.camera, this);
			_view3D.camera.lens = new PerspectiveLens();
			_view3D.camera.lens.far = 8000;
			camController.radius = 2000;
		}
		
		/**
		 * set up listeners
		 * 
		 */		
		private function initListeners():void{
			_view3D.scene.addEventListener( Scene3DEvent.ADDED_TO_SCENE, onAddedToScene );
			_view3D.scene.addEventListener( Scene3DEvent.REMOVED_FROM_SCENE, onRemovedFromScene );
			
			
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
			try{
				fishy = '';
				fishy = JSON.parse(loaderJSON.data);
				trace(fishy);
			}catch(e:Error){
				trace(e);
			}
			
			AssetLibrary.enableParser(AWDParser);
			AssetLibrary.load(new URLRequest('assets/models/MdlFish.awd'));
			AssetLibrary.addEventListener(LoaderEvent.RESOURCE_COMPLETE, onComplete);
			loaderJSON.removeEventListener(Event.COMPLETE, onLoaded);
		}
		
		private function onComplete(e:LoaderEvent):void{
			var fishyLength:Number;
			
			try{
				fishyLength = fishy.results.length;
				if(fishyLength > 7){
					fishyLength = 7;
				}
			}catch(e:Error){
				fishyLength = 15;
				var twitterFail:TextField = new TextField();
				twitterFail = new TextField();
				var _label_format : TextFormat = new TextFormat();
				twitterFail.defaultTextFormat = _label_format;
				twitterFail.autoSize = TextFieldAutoSize.RIGHT; 
				twitterFail.text = 'Sorry Parsing of the Twitter feed Failed:(  It is an alpha flash player version.';
				twitterFail.x = 200;
				twitterFail.y = 2;
				twitterFail.selectable = false;
				addChild(twitterFail);
			}
			for(var i:uint = 0; i<fishyLength; i++){
				var ObjContainer:ObjectContainer3D = new ObjectContainer3D();
				ObjContainer  = ObjectContainer3D(AssetLibrary.getAsset('main'));
				fishArr[i] = new ObjectContainer3D();
				for(var j:uint = 0; j<ObjContainer.numChildren; j++) 
				{ 
					var obj3D:Mesh = new Mesh(new Geometry());
					try{
						obj3D = ObjContainer.getChildAt(j).getChildAt(0).clone() as Mesh;
						obj3D.mouseEnabled = true;
						obj3D.name = i.toString();
						obj3D..addEventListener(MouseEvent3D.CLICK, goFish,false, 0, true);
						var obj3DContainer:ObjectContainer3D = new ObjectContainer3D();
						obj3DContainer.addChild(obj3D);
						fishArr[i].addChild(obj3DContainer); 
					}catch(e:Error){
						trace(e);
					}
				}
				try{
					urlRequestContainer[i] = "http://twitter.com/#!/" + fishy.results[i].from_user;
				}catch(e:Error){
					trace(e);
				}
				fishArr[i].x = Math2.rand(-400,900);
				fishArr[i].y = Math2.rand(-400,900);
				fishArr[i].z = Math2.rand(-400,900);
				fishArr[i].name = _view3D.scene.numChildren + 1;
				_view3D.scene.addChild(fishArr[i]);
				var baseFrequency:uint = (90 % 64)*4;
				var xMove:FunctionTracker=new FunctionTracker(fishArr[i],"scale",dancingFish,[i,fishArr[i]]);
				_xmoveArr[i] = xMove;
				xMove.start();
				
			}
			if(_isTweetSearch == false){
			var radius:Number = new Number();
			var seg:Number = new uint();
			radius = 3000;
			seg = 100;
			
			
			AssetLibrary.enableParser(AWDParser);
			AssetLibrary.removeEventListener(LoaderEvent.RESOURCE_COMPLETE, onComplete);
			AssetLibrary.addEventListener(AssetEvent.ASSET_COMPLETE, onSphere);
			AssetLibrary.load(new URLRequest('assets/models/Sphere.awd'));
			}
		}
		
		
		protected function goFish(event:MouseEvent3D):void {	
			try{
				var lnk:int = int(event.currentTarget.name);
				var myURL:URLRequest = new URLRequest(urlRequestContainer[lnk]);
				navigateToURL(myURL);
			}catch(e:Error){
				trace(e);
			}
		}
		
		private function dancingFish(i:uint, twFishOne:ObjectContainer3D):void {
			var baseFrequency:uint = (i % 64)*4;
			var xScaleTracker:FunctionTracker=new FunctionTracker(twFishOne,"scaleX",soundAnalyzer.getFrequencyRange,[baseFrequency,baseFrequency+4,1,2]);
			var yScaleTracker:FunctionTracker=new FunctionTracker(twFishOne,"scaleY",soundAnalyzer.getFrequencyRange,[baseFrequency,baseFrequency+4,1,2]);
			var zScaleTracker:FunctionTracker=new FunctionTracker(twFishOne,"scaleZ",soundAnalyzer.getFrequencyRange,[baseFrequency,baseFrequency+4,1,2]);
			TweenLite.to(twFishOne, 5, {x:twFishOne.x + 10, y:twFishOne.y + 50, z:twFishOne.z + 50});
			xScaleTracker.start();
			yScaleTracker.start();
			zScaleTracker.start();
		}
		
		private function onSphere(e:AssetEvent):void{
		
			if(e.asset.assetType == AssetType.MESH) {
				var ObjContainer:ObjectContainer3D = new ObjectContainer3D();
				//create material object and assign it to our mesh
				var mesh:Mesh;
				//create mesh object and assign our animation object and material object
				mesh = e.asset as Mesh;
				ObjContainer.addChild(mesh);
				mesh.scale(2);
				mesh.x = -3000
				mesh.z = 3000
				mesh.rotationY = -45;
				_view3D.scene.addChild(ObjContainer);
				AssetLibrary.removeEventListener(AssetEvent.ASSET_COMPLETE, onSphere);
			}
		}

		private function onRequestTokenSuccess(event:SoundcloudAuthEvent):void
		{
			soundCloud.sendRequest("tracks/15996217/stream", URLRequestMethod.GET);
			var mySound:Sound = new Sound();
			mySound.load (new URLRequest("http://api.soundcloud.com/tracks/15996217/stream.xml?oauth_consumer_key=****"));
			mySound.play (0, 1);
		}

	}
	
}