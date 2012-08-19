package views.component
{
	import away3d.entities.SegmentSet;
	import away3d.primitives.LineSegment;
	import away3d.primitives.WireframeAxesGrid;
	import away3d.primitives.WireframePrimitiveBase;
	import flash.geom.Vector3D;
	
	
	/**
	 * a simple single axis grid 
	 * @author jonrowe
	 * 
	 */	
	public class WireframeSingleAxisGrid extends SegmentSet
	{
		
		public static const PLANE_ZY:String = "zy";
		public static const PLANE_XY:String = "xy";
		public static const PLANE_XZ:String = "xz";

		
		public function WireframeSingleAxisGrid(subDivision:uint=10, gridSize:uint=100, thickness:Number=1, axis :String = "xy", color:uint=0x4a4a4a)
		{
			super();
			
			if(subDivision == 0) subDivision = 1;
			if(thickness <= 0) thickness = 1;
			if(gridSize ==  0) gridSize = 1;
			
			build(subDivision, gridSize, color, thickness, axis);
		}
		
		private function build(subDivision:uint, gridSize:uint, color:uint, thickness:Number, plane:String):void
		{
			var bound:Number = gridSize *.5;
			var step:Number = gridSize/subDivision;
			var v0 : Vector3D = new Vector3D(0, 0, 0) ;
			var v1 : Vector3D = new Vector3D(0, 0, 0) ;
			var inc:Number = -bound;
			var segmentColor :int;
			
			while(inc<=bound){
				
				switch(plane){
					case PLANE_ZY:
						v0.x = 0;
						v0.y = inc;
						v0.z = bound;
						v1.x = 0;
						v1.y = inc;
						v1.z = -bound;
						segmentColor = inc == 0 ? 0x00ff00 : color; 
						addSegment( new LineSegment(v0, v1, segmentColor, segmentColor, thickness));
						
						v0.z = inc;
						v0.x = 0;
						v0.y = bound;
						v1.x = 0;
						v1.y = -bound;
						v1.z = inc;
						segmentColor = inc == 0 ? 0x00ff00 : color; 
						addSegment(new LineSegment(v0, v1, segmentColor, segmentColor, thickness ));
						break;
					
					case PLANE_XY:
						v0.x = bound;
						v0.y = inc;
						v0.z = 0;
						v1.x = -bound;
						v1.y = inc;
						v1.z = 0;
						segmentColor = inc == 0 ? 0x00ff00 : color; 
						addSegment( new LineSegment(v0, v1, segmentColor, segmentColor, thickness));
						v0.x = inc;
						v0.y = bound;
						v0.z = 0;
						v1.x = inc;
						v1.y = -bound;
						v1.z = 0;
						segmentColor = inc == 0 ? 0xff0000 : color; 
						addSegment(new LineSegment(v0, v1, segmentColor, segmentColor, thickness ));
						break;
					
					default:
						v0.x = bound;
						v0.y = 0;
						v0.z = inc;
						v1.x = -bound;
						v1.y = 0;
						v1.z = inc;
						segmentColor = inc == 0 ? 0xff0000 : color; 
						addSegment( new LineSegment(v0, v1, segmentColor, segmentColor, thickness));
						
						v0.x = inc;
						v0.y = 0;
						v0.z = bound;
						v1.x = inc;
						v1.y = 0;
						v1.z = -bound;
						segmentColor = inc == 0 ? 0x0000ff : color; 
						addSegment(new LineSegment(v0, v1, segmentColor, segmentColor, thickness ));
				}
				
				inc += step;
			}
		}
	}
}