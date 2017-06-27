paper.install(window);
console.log("Start!!");
var mouse_where = "canvas";
var mouse_action = "";
var navbar_whichVector = "BV";
var auxline_whetherDisplay = false;

var circle_group  = new Group();
var vector_group  = new Group();
var auxline_gruop = new Group();
//styles
var circle_style = {
	radius: 25,
	fillColor: '#0000FF',
	hover_fillColor: '#00BFFF'
};
var becVector_style = {
	type: "BV",
	strokeColor: '#1E90FF',
	hover_strokeColor: '#00BFFF',
	proto_strokeColor: '#1E90FF',
	strokeJoin: 'round'
};
var sinVector_style = {
	type: "LTV",
	strokeWidth: 5,
	strokeColor: '#1E90FF',
	hover_strokeColor: '#00BFFF',
	proto_strokeColor: '#1E90FF'
};
var notVector_style = {
	type: "NV",
	strokeColor: '#FF4500',
	hover_strokeColor: "#FF7F50",
	proto_strokeColor: '#FF4500',
	strokeJoin: "round"
}
var eiVector_style = {
	type: "EIV",
	strokeColor:'#00BFFF',
	hover_strokeColor: '#1E90FF',
	proto_strokeColor: '#00BFFF',
	strokeWidth: 4,
	dashArray: [10, 12]
};
var auxDashLine_style = {
	type: "ADL",
	strokeColor:'gray',
	strokeWidth: 4,
	dashArray: [10, 12]
}

main();

function main() {
	layerSetting();
	navbar_listener();
}
function onMouseDown(event) {
	judgement("circle_create") && createCircle(event.point);
}
function createCircle(eventPoint) {
	var circle_createData = {};

	circleDataSetting();
	drawCircle(circle_createData);
	
	function circleDataSetting() {
		circle_createData = circle_style;
		circle_createData.center = eventPoint;
	}
	function drawCircle(circle_createData) {
		var nowCircle = new Path.Circle(circle_createData);
		nowCircle.setCircleListener();

		circle_group.addChild(nowCircle);
	}
}
function layerSetting() {
	vector_group.insertBelow(circle_group);
	auxline_gruop.insertBelow(vector_group);
}
function judgement(behavior, defendant) {
	var conclusion = new Boolean();

	if (behavior === "circle_create"){
		conclusion = (mouse_where !== 'circle') ? true : false;
	}else if(behavior === "form_call"){
		conclusion = (mouse_where === 'circle') ? true : false;
	}else if(behavior === "vector_create"){
		conclusion = (mouse_where !== 'circle') ? true : false;
	}else if(behavior === "vector_create_afterComplete"){
		conclusion = (mouse_action === 'vector_create') ? true : false;
	}else if(behavior === "vector_create_afterComplete_hover"){
		conclusion = (mouse_action !== 'vector_create') ? true : false;
	}else if(behavior === "vector_cross_down"){
		return undefined;
	}else if(behavior === "vector_cross_drag"){
		return undefined;
	}else if(behavior === "vector_cross_up"){
		return undefined;
	}else{
		return undefined;
	}
	return conclusion;
}
function navbar_listener(){
	$("#BV").click(function(event) {
		navbar_whichVector = 'BV';
	});
	$("#LTV").click(function(event) {
		navbar_whichVector = 'LTV';
	});
	$("#NV").click(function(event) {
		navbar_whichVector = 'NV';
	});
	$("#EIV").click(function(event) {
		navbar_whichVector = 'EIV';
	});
	$('#ALB').click(function(event){
		auxline_toggle();
	})
	function auxline_toggle() {
		auxline_whetherDisplay = !auxline_whetherDisplay;
		auxline_gruop.children.forEach(function(auxDash) {
			auxline_whetherDisplay ? auxDash.opacity = 0.5 : auxDash.opacity = 0;				
		})
	}
}
Path.prototype.setVectorListener = function() {
	this.onMouseEnter = function(){
		mouseInVector();
		judgement("vector_create_afterComplete_hover") && (this.strokeColor = this.hover_strokeColor);
	}
	this.onMouseLeave = function(){
		mouseOutVector();
		judgement("vector_create_afterComplete_hover") && (this.strokeColor = this.proto_strokeColor);
	}
	this.onMouseDown = function(){
		mouseInVector();
	}
	this.onMouseUp = function(){

	}
	this.onMouseDrag = function(){

	}
	this.onMouseMove = function(){
		mouseInVector();
	}
	this.onClick = function(){
		mouseInVector();
	}
	function mouseInVector() {
		mouse_where = 'vector';
	}
	function mouseOutVector() {
		mouse_where = 'canvas';
	}
};
Path.prototype.setCircleListener = function() {
	this.onMouseEnter = function(event) {
		this.fillColor = circle_style.hover_fillColor;
		mouseInCircle();
	}
	this.onMouseLeave = function(event) {
		this.fillColor = circle_style.fillColor;
		mouseOutCircle();
	}
	this.onMouseDown = function(event) {
		mouseInCircle();
	}
	this.onMouseUp = function(event) {
		judgement('vector_create_afterComplete') && afterVectorCompleted();
	}
	this.onMouseDrag = function(event) {
		var startPoint = new Point(this.position.x, this.position.y),
			endPoint   = event.point;
		judgement("vector_create") && createVector(startPoint, endPoint);
		judgement("vector_create") && createAuxDashLine(startPoint, endPoint);
	}
	this.onMouseMove = function(event) {
		mouseInCircle();
	}
	this.onClick = function(event) {
		mouseInCircle();
	}
	this.onDoubleClick = function(event) {
		mouseInCircle();
		judgement('form_call') && callForm(this);
	}
	function mouseInCircle(){
		mouse_where = "circle";
	}
	function mouseOutCircle() {
		mouse_where = "canvas";
	}
	function afterVectorCompleted() {
		auxline_disppear();
		vectorCreatingClosing();

		function auxline_disppear() {
			var lastAuxLineIndex = auxline_gruop.children.length - 1;
			var lastAuxLine = auxline_gruop.children[lastAuxLineIndex];

			Boolean(lastAuxLine) && (auxline_whetherDisplay ? lastAuxLine.opacity = 0.5 : lastAuxLine.opacity = 0);
		}
		function vectorCreatingClosing() {
			 mouse_action = "";
		}
	}
	function callForm(thisCircle) {
		$.fancybox.open({
		    src  : '#circleForm',
		    type : 'inline',
		    opts : {
      			afterShow : function( instance, current ) {},
      			smallBtn: false
    		}
  		});

  		circleFormListenr();

		function circleFormListenr() {
			formOpen();
			argumentDisplay();

			function formOpen() {		
				$('#circleForm').mousemove(function(event){
					mouse_where = 'form';	
				});
				$('#DB').click(function(event){
					thisCircle.remove();
					formClose();
				});
				$('#SB').click(function(event) {
					savingData();
					formClose();
				});

				function formClose() {
					mouse_where = 'canvas';
					$('#DB').off('click');
					$('#SB').off('click');
				}
				function savingData(){
					thisCircle.data 			= new Object();
					thisCircle.data.isDenying   = $('label#denyBox.active')[0] ? true : false;
					thisCircle.data.title       = $('input.cir_title').val();
					thisCircle.data.description = $('textarea.cir_desc').val();
				}
			}
			function argumentDisplay() {
				thisCircle.data.isDenying ? $('label#denyBox').addClass("active")
										  : $('label#denyBox').removeClass("active");
				$('input.cir_title').val(thisCircle.data.title || "");
				$('textarea.cir_desc').val(thisCircle.data.description || "");
			}
		}
	}
};
Path.prototype.auxDashLineListener = function() {
	this.onMouseEnter = function(event) {
	    this.opacity = 1;
	}
	this.onMouseLeave = function(event) {
		auxline_whetherDisplay ? this.opacity = 0.4 : this.opacity = 0;
	}
};


function createVector(startPoint, endPoint){
	vectorCreatingInstruction();

	if (navbar_whichVector === 'BV') {
		createBecauseVector();
	}else if(navbar_whichVector === 'LTV'){
		createLeadToVector();
	}else if(navbar_whichVector === 'NV'){
		createNotVector();
	}else if(navbar_whichVector === 'EIV'){
		createElseIfVector();
	}else{
		return undefined;
	}

	function vectorCreatingInstruction() {
		mouse_action = "vector_create";
	}
	function restrictStrokeWidth() {
		var selfVector = endPoint - startPoint;
		var selfPathWidth = selfVector.length / 40,
			maxPathWidth = 10,
			minPathWidth = 4;
		if(selfPathWidth > maxPathWidth) {
			return maxPathWidth;
		}else if(selfPathWidth < minPathWidth){
			return minPathWidth;
		}else{
			return selfPathWidth;
		}
	}
	function drawVector(vector_createData) {
		var nowVector = new Path(vector_createData);
		nowVector.removeOnDrag();
		nowVector.setVectorListener();

		vector_group.addChild(nowVector);
	}
	function createBecauseVector() {
		var bv_createData = {};

		bvDataSetting();
		drawVector(bv_createData);

		function bvDataSetting() {
			bv_createData = becVector_style;
			bv_createData.strokeWidth = restrictStrokeWidth();
			bv_createData.segments    = giveBecSegments();

			function giveBecSegments() {
				var becVector = endPoint - startPoint;
				var toRightArrVector = ((-becVector) * 0.1).clone(),
					toLeftArrVector  = ((-becVector) * 0.1).clone();
				toRightArrVector.angle += 30;		
				toLeftArrVector.angle -= 30;

				var arrRightPoint = endPoint + toRightArrVector,
					arrLeftPoint  = endPoint + toLeftArrVector;
				var segments = [startPoint,
								endPoint,
								arrRightPoint,
								endPoint,
								arrLeftPoint,
								endPoint,
								startPoint];
				return segments;
			}
		}
	}
	function createLeadToVector() {
		var ltv_createData = {};

		ltvDataSetting();
		drawVector(ltv_createData);

		function ltvDataSetting() {
			ltv_createData = sinVector_style;
			ltv_createData.segments = giveSinPathSegments();

			function giveSinPathSegments() {
				var sinPathVector = endPoint - startPoint;
					height = 10,
					wavelength = 18,
					timeOfWave = sinPathVector.length / wavelength,
					radian_degree_rate = Math.PI / 360,
					unitOfSinX = 50,
					telescopeSinX = 20;

				return sinPathSegments();

				function sinPathSegments() {
					var segmentsArray = new Array();
					for (var sinX = 0; sinX < 360 * timeOfWave; sinX += unitOfSinX) {
						var radian = sinX * radian_degree_rate;//trun degree to radian
						var sinY = Math.sin(radian) * height;
						var sinPoint = new Point(sinX / telescopeSinX, sinY);
						sinPoint.angle += sinPathVector.angle;
						sinPoint += startPoint;
						segmentsArray.push(sinPoint);
					}
					return segmentsArray;
				}
			}
		}
	}
	function createNotVector() {
		var nv_createData = {};

		nvDataSetting();
		drawVector(nv_createData);

		function nvDataSetting() {
			nv_createData = notVector_style;
			nv_createData.strokeWidth = restrictStrokeWidth(startPoint, endPoint);
			nv_createData.segments    = giveNotSegments();

			function giveNotSegments() {
				var notVector = endPoint - startPoint,
					toRightAngleVector = notVector * 0.1,
					toLeftAngleVector  = notVector * 0.1;
				toRightAngleVector.angle += 45;
				toLeftAngleVector.angle  -= 45;

				var middlePoint 	 = (startPoint + endPoint) / 2,
					rightTopPoint    = middlePoint + toRightAngleVector,
					leftBottomPoint  = middlePoint - toRightAngleVector,
					leftTopPoint     = middlePoint + toLeftAngleVector,
					rightBottomPoint = middlePoint - toLeftAngleVector;
				var segments = [startPoint,
								middlePoint,
								rightTopPoint, 
								leftBottomPoint,
								middlePoint,
								leftTopPoint,
								rightBottomPoint,
								middlePoint,
								endPoint,
								startPoint];
				return segments;
			}
		}
	}
	function createElseIfVector() {
		var eiv_createData = {};

		eiDataSetting();
		drawVector(eiv_createData);

		function eiDataSetting() {
			eiv_createData = eiVector_style;
			eiv_createData.segments = giveEISegments();

			function giveEISegments() {
				var segments = [startPoint, endPoint];
				return segments;
			}
		}
	}
}
function createAuxDashLine(startPoint, endPoint) {
	var auxDash_createData = {};

	adlDataSetting();
	drawAuxDashLine(auxDash_createData);

	function adlDataSetting() {
		auxDash_createData = auxDashLine_style;
		auxDash_createData.segments = giveAdlSegments();

		function giveAdlSegments() {
			var segments = new Array();
			var auxVector = endPoint - startPoint,
				unitVector = auxVector / auxVector.length;
			for(var i = 0 ; i < 1500 ; i++){
				var dashX = startPoint.x + unitVector.x * i;
				var dashY = startPoint.y + unitVector.y * i;
				var dashPoint = new Point(dashX, dashY);
				segments.push(dashPoint);		
			}
			return segments;
		}
	}
	function drawAuxDashLine(auxDash_createData) {
		var nowAuxDashLine = new Path(auxDash_createData);
		nowAuxDashLine.removeOnDrag();
		nowAuxDashLine.auxDashLineListener();

		auxline_gruop.addChild(nowAuxDashLine);
	}
}
