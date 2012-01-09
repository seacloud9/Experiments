/**
 * @author oosmoxiecode
 * based on http://www.terrybutler.co.uk/web-development/html5-canvas-md2-renderer/
 * and
 * http://tfc.duke.free.fr/coding/md2-specs-en.html
 *
 * dependant on binaryReader.js
 *
 * Usage:
 * md2 = new MD2("path_to/file.md2");
 * md2_mesh = new THREE.Mesh( md2, material );
 * scene.addObject( md2_mesh );
 *
 * Animation like:
 * md2.gotoAndPlay("stand", true); // first arg = framelabel or frame number, second arg = loop true or false
 * md2.stop(); // to stop it
 *
 * You also need to call:
 * md2.update(your_main_fps) in your main-loop for the softwareInterpolation to work
 *
 * It would probably be better to feed all vertices for all frames to the buffer. And then
 * 'point' the buffer to the current and next frame and have the vertex shader to interpolation.
 **/

var MD2 = function (url, framerate) {

	var scope = this;

	THREE.Geometry.call(this);

    // Load the file
    var file = load_binary_resource(url);

    // Create the Binary Reader
    var reader = new BinaryReader(file);
     
    // setup
	var header = new MD2Header();
	var texCoords = new Array();
	var frames = new Array();
	var framelabels = new Array();
    scope.uvs = new Array();
	scope.totalFrames = 0;
	scope.currentFrame = 0;
	scope.nextFrame = 0;
	scope.endFrame = 0;
	scope.loop = false;
	scope.fps = framerate || 10;
	scope.ticker = 0;
	scope.runningLoop = null;
	scope.softwareInterpolation = true;

    header.ident = reader.readString(4);     
    header.version = reader.readInt32();

    // Valid MD2 file?
    if (header.ident != "IDP2" || header.version != 8) {
        console.log("Not a valid MD2 file");
        return false;
    }

	// header
    header.skinwidth        = reader.readInt32(); // texture width
    header.skinheight       = reader.readInt32(); // texture height

    header.framesize        = reader.readInt32(); // size in bytes of a frame 

    header.num_skins        = reader.readInt32(); // number of skins 
    header.num_vertices     = reader.readInt32(); // number of vertices per frame 
    header.num_st           = reader.readInt32(); // number of texture coordinates 
    header.num_tris         = reader.readInt32(); // number of triangles 
    header.num_glcmds       = reader.readInt32(); // number of opengl commands 
    header.num_frames       = reader.readInt32(); // number of frames 

    header.offset_skins     = reader.readInt32(); // offset skin data 
    header.offset_st        = reader.readInt32(); // offset texture coordinate data 
    header.offset_tris      = reader.readInt32(); // offset triangle data 
    header.offset_frames    = reader.readInt32(); // offset frame data 
    header.offset_glcmds    = reader.readInt32(); // offset OpenGL command data 
    header.offset_end       = reader.readInt32(); // offset end of file     
       
    // faulty size  
    if (reader.getSize() != header.offset_end) {
        console.log("Corrupted MD2 file");
		return false;
    }

	// texture coordinates
    reader.seek(header.offset_st);
	for (var i = 0; i < header.num_st; i++) {
		var texCoord = new MD2TexCoord();

		texCoord.s = reader.readInt16() / header.skinwidth;
		texCoord.t = reader.readInt16() / header.skinheight;

		texCoords.push(texCoord);
	}

	// triangles
    reader.seek(header.offset_tris);
	for (var i = 0; i < header.num_tris; i++) {
		var a = reader.readInt16();
		var b = reader.readInt16();
		var c = reader.readInt16();

		var uva_i = reader.readUInt16();
		var uvb_i = reader.readUInt16();
		var uvc_i = reader.readUInt16();
		
		var uva = new THREE.UV( texCoords[uva_i].s , texCoords[uva_i].t );
		var uvb = new THREE.UV( texCoords[uvb_i].s , texCoords[uvb_i].t );
		var uvc = new THREE.UV( texCoords[uvc_i].s , texCoords[uvc_i].t );
	
		f3( a, b, c, uva, uvb, uvc );
	}

	// frames
    reader.seek(header.offset_frames);
	for (var f = 0; f < header.num_frames; f++) {
		var frame = new MD2Frame();        
		
		frame.scale.position.x = reader.readFloat();
		frame.scale.position.y = reader.readFloat();
		frame.scale.position.z = reader.readFloat();
		
		frame.translate.position.x = reader.readFloat();
		frame.translate.position.y = reader.readFloat();
		frame.translate.position.z = reader.readFloat(); 
		
		frame.name = reader.readString(16); // 4+4+4 4+4+4 (12 + 12) = 24 + 16 = 40                     

		for (var v = 0; v < header.num_vertices; v++) {
			var tempX = reader.readUInt8();
			var tempY = reader.readUInt8();
			var tempZ = reader.readUInt8();
			var normal = reader.readUInt8();
			
			var xx = frame.scale.position.x * tempX + frame.translate.position.x; 
			var yy = frame.scale.position.z * tempZ + frame.translate.position.z; 
			var zz = frame.scale.position.y * tempY + frame.translate.position.y;

			var vertex = new THREE.Vertex( new THREE.Vector3( xx, yy, zz ) );
			frame.vertices.push(vertex);
		}                                     
		frames.push(frame);
	}

	// setup
	scope.totalFrames = frames.length-1;
	setupFrameLabels();

	// vertices for the first frame
	var frame = frames[scope.currentFrame];
	for (var i=0; i<frame.vertices.length; ++i ) {
		var vertex = frame.vertices[i];
		scope.vertices.push(vertex);
	}

	scope.computeCentroids();
	scope.computeFaceNormals();
	scope.computeVertexNormals();
	//scope.sortFacesByMaterial();
	
	// gotoAndStop ... yes, I come from flash...
	scope.gotoAndStop = function ( frame_num ) {
		if (scope.totalFrames == 0) {
			return;
		}
		scope.currentFrame = frame_num;
		var frame = frames[frame_num];
		for (var i=0; i<frame.vertices.length; ++i ) {
			var newvertex = frame.vertices[i];

			var tx = newvertex.position.x;
			var ty = newvertex.position.y;
			var tz = newvertex.position.z;

			scope.vertices[i].position.x = tx;
			scope.vertices[i].position.y = ty;
			scope.vertices[i].position.z = tz;
		}
	}

	scope.gotoAndPlay = function ( frame_num_or_name, loop ) {
		if (scope.totalFrames == 0) {
			return;
		}
		var nFrame, eFrame;
		if (isNaN(frame_num_or_name)) {
			var index = framelabels.indexOf(frame_num_or_name);
			if (index > -1) {
				nFrame = framelabels[index+1];
				eFrame = framelabels[index+2];
			} else {
				//console.log("Frame label: "+frame_num_or_name+" not found.");
				// default to first
				nFrame = framelabels[1];
				eFrame = framelabels[2];
			}
		} else {
			nFrame = Math.round(frame_num_or_name);
			// find animations end frame
			for (var i=0; i<framelabels.length; ++i ) {
				var item = framelabels[i];
				if (isNaN(item)) {
					continue;
				}
				if (item > nFrame) {
					eFrame = item;
					break;
				}
			}

		}

		// all - a special case for playing all animations
		if (frame_num_or_name == "all") {
			nFrame = 0;
			eFrame = scope.totalFrames;
		}

		scope.nextFrame = nFrame;
		scope.endFrame = eFrame;
		scope.loop = loop || false;

		clearInterval(scope.runningLoop);
		scope.runningLoop = setInterval(md2interval, 1000/scope.fps);
	}

	scope.stop = function () {
		scope.endFrame = scope.nextFrame;
		scope.loop = false;
	}

	function md2interval () {
		scope.ticker = 0;
		scope.gotoAndStop(scope.nextFrame);
		++scope.nextFrame;
		// loop
		if (scope.loop && scope.nextFrame > scope.endFrame) {
			// find end frame
			var index = framelabels.indexOf(scope.endFrame);
			scope.nextFrame = framelabels[index-1];
		}
		// no loop
		if ((!scope.loop && scope.nextFrame > scope.endFrame) || scope.totalFrames == 0) {
			// stop
			clearInterval(scope.runningLoop);
			scope.runningLoop = null;
		}		
	}

	// needed to handle interpolation - don´t know of a better way to do it right now
	scope.update = function (parent_fps) {
		if (scope.runningLoop == null || !scope.softwareInterpolation || scope.totalFrames == 0) {
			return;
		}
		var p_fps = parent_fps || 60;
		// for software interpolation
		if (scope.ticker != 0) {
			var percent = (scope.ticker)/(p_fps/scope.fps);
			
			if (percent != 1) {
				//console.log(scope.currentFrame);
				scope.interpolate(scope.currentFrame, scope.nextFrame, percent);
			}
		}
		++scope.ticker;
	}

	scope.interpolate = function ( nowFrame, nextFrame, percent ) {
		var framea = frames[nowFrame];
		var frameb = frames[nextFrame];

		for (var i=0; i<framea.vertices.length; ++i ) {
			var vertexa = framea.vertices[i];
			var vertexb = frameb.vertices[i];
			
			var intx = interpolateValue(vertexa.position.x, vertexb.position.x, percent);
			var inty = interpolateValue(vertexa.position.y, vertexb.position.y, percent);
			var intz = interpolateValue(vertexa.position.z, vertexb.position.z, percent);
			
			scope.vertices[i].position.x = intx;
			scope.vertices[i].position.y = inty;
			scope.vertices[i].position.z = intz;
		}
	}


	function f3( a, b, c, uva, uvb, uvc ) {
		//console.log(scope.faces);
		scope.faces.push( new THREE.Face3( a, b, c ) );
		
		scope.uvs.push( [uva,uvb,uvc] );
	}

	// setup an array of the different animation states for easy access
	// like for example: gotoAndPlay("stand");
	function setupFrameLabels() {
		var lastName = "";
		for (var i=0; i<frames.length; ++i ) {
			var frame = frames[i];
			var name = frame.name;
			var trimmed = name.replace(/[^A-Za-z]/g, "");
			// new frame
			if (trimmed != lastName) {
				// end frame for old frame
				if (framelabels.length > 0) {
					framelabels[framelabels.length-1] = i-1;	
				}
				// new
				framelabels.push(trimmed);
				framelabels.push(i);
				framelabels.push(i);
			}
			lastName = trimmed;
		}
		// last fix
		framelabels[framelabels.length-1] = frames.length-1;
		//console.log(framelabels);
	}

    // Code from https://developer.mozilla.org/En/Using_XMLHttpRequest#Receiving_binary_data
    function load_binary_resource(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        
        // The following line says we want to receive data as Binary and not as Unicode
        request.overrideMimeType('text/plain; charset=x-user-defined');
        request.send();
        
        if (request.readyState != 4) {
            return '';
		}
            
        return request.responseText;
    }

    function MD2Header() {
        var ident;                  /* magic number: "IDP2" */
        var version;                /* version: must be 8 */

        var skinwidth;              /* texture width */
        var skinheight;             /* texture height */

        var framesize;              /* size in bytes of a frame */

        var num_skins;              /* number of skins */
        var num_vertices;           /* number of vertices per frame */
        var num_st;                 /* number of texture coordinates */
        var num_tris;               /* number of triangles */
        var num_glcmds;             /* number of opengl commands */
        var num_frames;             /* number of frames */

        var offset_skins;           /* offset skin data */
        var offset_st;              /* offset texture coordinate data */
        var offset_tris;            /* offset triangle data */
        var offset_frames;          /* offset frame data */
        var offset_glcmds;          /* offset OpenGL command data */
        var offset_end;             /* offset end of file */
    }

    function MD2Frame() {
        this.scale       = new THREE.Vertex( new THREE.Vector3() ); // scale factor
        this.translate   = new THREE.Vertex( new THREE.Vector3() ); // translation vector
        this.name        = "";										// frame name
        this.vertices    = new Array();								// list of frame's vertices    
    }

	function MD2TexCoord(newS, newT) {
		this.s = newS;
		this.t = newT;
	}

	function interpolateValue( from, to, percent ) {
		var dif = to - from;
		var add = dif*percent;
		return (from+add);
	}
	
}

MD2.prototype = new THREE.Geometry();
MD2.prototype.constructor = MD2;