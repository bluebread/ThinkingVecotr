paper.install(window);

var clickStartPoint,
	clickEndPoint,
	myCircle,
	myDashLine,
	arrowStroke,
	arrowPath,
	sinPath,
	elsIfDashLine,
	notPath,
	notStroke,
	auxDashLine;
//The switch of Vectors
var whichVector = "BecauseVector";
//colors
var circleColor = '#0000FF',
	vectorColor = '#1E90FF',
	notColor    = '#FF4500';//Orangered
//magic numbers
var myRadius = 25;
var circleBusy = false;
var circleEnter = true;
var arrayDash = [];
//Groups
var circleGroup      = new Group(),
	arrowPathGroup   = new Group(),
	arrowStrokeGroup = new Group(),
	notPathGroup     = new Group(),
	notStrokeGroup   = new Group(),
	sinPathGroup     = new Group(),
	elsIfDashGroup   = new Group(),
	auxDashGroup     = new Group();

main();

function main(argument) {
	GroupsInsertBelow();
	vecBottomListener();
}
function onMouseDown(event) {
	if (!circleBusy) {
		clickStartPoint = event.point;
		creatCircle(event.point, myRadius, circleColor);
	}
}
function GroupsInsertBelow(){
	arrowPathGroup.insertBelow(circleGroup);
	arrowStrokeGroup.insertBelow(arrowPathGroup);
	notPathGroup.insertBelow(arrowStrokeGroup);
	notStrokeGroup.insertBelow(notPathGroup);
	sinPathGroup.insertBelow(notStrokeGroup);
	elsIfDashGroup.insertBelow(sinPathGroup);
	auxDashGroup.insertBelow(elsIfDashGroup);	
}
function vecBottomListener(){
	$("#BV").click(function(event) {
		console.log("BV CONNECTED!")
		whichVector = 'BecauseVector';
	});
	$("#LTV").click(function(event) {
		console.log("LTV CONNECTED!")
		whichVector = 'LeadToVector';
	});
	$("#NV").click(function(event) {
		console.log("NV CONNECTED!")
		whichVector = 'NotVector';
	});
	$("#EIV").click(function(event) {
		console.log("EIV CONNECTED!")
		whichVector = 'ElseIfVector';
	});
}
function chooseVector(circleCenter, mousePoint){
	if (whichVector === 'BecauseVector') {
		setBecVector(circleCenter, mousePoint, vectorColor);
		arrowStroke.removeOnDrag();
		arrowPath.removeOnDrag();	
	}else if(whichVector === 'LeadToVector'){
		creatSinGraph(circleCenter, mousePoint, vectorColor);
		sinPath.removeOnDrag();
	}else if(whichVector === 'NotVector'){
		setNotVector(circleCenter, mousePoint, notColor);
		notStroke.removeOnDrag();
		notPath.removeOnDrag();
	}else if(whichVector === 'ElseIfVector'){			
		setElseIfVector(circleCenter, mousePoint, vectorColor);
		elsIfDashLine.removeOnDrag();
	}else{
		return undefined;
	}
}

//set listeners
Path.prototype.circleListener = function(){
	this.onMouseEnter = function(event) {
		this.fillColor = '#00BFFF';
		circleBusy = true;
	}
	this.onMouseLeave = function(event) {
	    this.fillColor = circleColor;
	    circleBusy = false;
	}
	this.onMouseDrag = function(event){
		if (!circleBusy) {
			chooseVector(this.data.center, event.point);
			//set auxiliary line
			creatAuxDash(this.data.center, event.point, 'gray');
			auxDashLine.removeOnDrag();	
		}
	}
	this.onMouseUp = function(event){
		if(auxDashLine){
			auxDashLine.opacity = 0;
		}
	}
	this.onDoubleClick = function(event) {
		$.fancybox.open({
		    src  : '#circleForm',
		    type : 'inline',
		    opts : {
      			afterShow : function( instance, current ) {},
      			smallBtn: false
    		}
  		});
	}
}
Path.prototype.auxDashLineListener = function() {
	this.onMouseEnter = function(event) {
	    this.opacity = 0.7;
	}
	this.onMouseLeave = function(event) {
	    this.opacity = 0;
	}
};
//The part of 'Not Vector'
function createNotPath(startPoint, endPoint, color) {
	//magic numbers
	var shortenRate = 0.1;
	var middlePoint = (startPoint + endPoint) / 2;
	var myVector = endPoint - startPoint;
	var myShortVec = myVector * shortenRate;
	var toRightAngleVector = myShortVec.clone();
	var toLeftAngleVector = myShortVec.clone();
	toRightAngleVector.angle += 45;
	toLeftAngleVector.angle -= 45;

	var rightTopPoint    = middlePoint + toRightAngleVector,
		leftBottomPoint  = middlePoint - toRightAngleVector,
		leftTopPoint     = middlePoint + toLeftAngleVector,
		rightBottomPoint = middlePoint - toLeftAngleVector;
	var segmentArray = [rightTopPoint, 
						leftBottomPoint,
						middlePoint,
						leftTopPoint,
						rightBottomPoint]
	notPath = new Path(segmentArray);
	initStroke(notPath, color, myVector.length, notPathGroup);
}
function setNotVector(startPoint, endPoint, color) {
	var myNotVector = endPoint - startPoint;
	notStroke = new Path(startPoint, endPoint);
	initStroke(notStroke, color, myNotVector.length, notStrokeGroup);

	createNotPath(startPoint, endPoint, color);
}
//The part of auxiliary line
function creatAuxDash(center, endPoint, color) {
	var horizonVector = endPoint - center;
	var verticalVector = new Point(-horizonVector.y, horizonVector.x);
	auxDashLine = new Path();
	initDashLine(auxDashLine, 'gray', auxDashGroup);
	drawStraightLine(verticalVector, endPoint, auxDashLine);
	auxDashLine.auxDashLineListener();
}
function drawStraightLine(vector, point, line) {
	var A = vector.x,
		B = vector.y;
	for (var dashX = 0 ; dashX < 1300; dashX += 40) {
		var dashY = ((-A) / B) * (dashX - point.x) + point.y;
		var dashPoint = new Point(dashX, dashY);
		line.add(dashPoint);
	}
}
//The part of 'ElseIf Vector'
function initDashLine(dashLine, color, group) {
	dashLine.strokeWidth = 4;
	dashLine.strokeColor = color;
	dashLine.dashArray = [10, 12];
	group.addChild(dashLine);
}
function setElseIfVector(startPoint, endPoint, color) {
	elsIfDashLine = new Path(startPoint, endPoint);
	initDashLine(elsIfDashLine, '#00BFFF', elsIfDashGroup);
}

//The part of 'Because Vector'
function creatCircle(center, radius, color){
	myCircle = new Path.Circle(center, radius);
	myCircle.fillColor = color;
	myCircle.data.center = center;
	myCircle.circleListener();

	circleGroup.addChild(myCircle);
}
function initStroke(stroke, color, length, group) {
	stroke.strokeColor = color;
	//set the width of arrow stroke
	var myStrokeWidth = length / 40;
	var maxStrokeWidth = 10;
	var minStrokeWidth = 4;
	stroke.strokeWidth = myStrokeWidth;
	if(myStrokeWidth > maxStrokeWidth) {
		stroke.strokeWidth = maxStrokeWidth;
	}else if(myStrokeWidth < minStrokeWidth){
		stroke.strokeWidth = minStrokeWidth;
	}	
	group.addChild(stroke);
}
function createArrowStroke(startPoint, endPoint, color){
	var myVector = endPoint - startPoint;
	arrowStroke = new Path(startPoint, endPoint);
	initStroke(arrowStroke, color, myVector.length, arrowStrokeGroup)
}
function createArrowPath(startPoint, endPoint, color){
	//magic number
	var shortenParam = 0.1;
	//create arrow line
	var myRevVec = -(endPoint - startPoint);//reverse vector
	var myRevShortVec = myRevVec * shortenParam;
	//restrict the length of arrow path
	var maxArrowPath = 30;
	if (myRevShortVec > maxArrowPath) {
		myRevShortVec /= myRevShortVec.length;
		myRevShortVec *= maxArrowPath;
	}
	//create right arrow line
	var rightVec = myRevShortVec.clone();
	var leftVec = myRevShortVec.clone();
	//rotate the angle
	rightVec.angle += 30;
	leftVec.angle -= 30;

	var rightEnd = endPoint + rightVec,
		leftEnd  = endPoint + leftVec;
	var segments = [rightEnd, endPoint, leftEnd];
	//create arrow
	arrowPath = new Path(segments);
	//set the width of arrow
	var arrowWidth = myRevVec.length / 40;
	var maxArrowWidth = 12;
	var minArrowWidth = 3;
	arrowPath.strokeWidth = arrowWidth;
	
	if (arrowWidth > maxArrowWidth) {
		arrowPath.strokeWidth = maxArrowWidth;
	}else if(arrowWidth < minArrowWidth){
		arrowPath.strokeWidth = minArrowWidth;
	}

	arrowPath.strokeColor = color;

	arrowPathGroup.addChild(arrowPath);
}
function setBecVector(circleCenter, arrowEnd, color) {
	createArrowStroke(circleCenter, arrowEnd, color);
	createArrowPath(circleCenter, arrowEnd, color);
}

//The Part of 'LeadTo Vector'
function creatSinGraph(startPoint, endPoint, color){
	var sinPathVector = endPoint - startPoint;
	sinPath = new Path();
	//magic numbers
	var height = 10,
		wavelength = 18,
		timeOfWave = sinPathVector.length/18,
		radian_degree_rate = Math.PI / 360,
		unitOfSinX = 50,
		telescopeSinX = 20;
	for (var sinX = 0; sinX < 360 * timeOfWave; sinX += unitOfSinX) {
		var radian = sinX * radian_degree_rate;//trun degree to radian
		var sinY = Math.sin(radian) * height;
		var sinPoint = new Point(sinX / telescopeSinX, sinY);
		sinPoint.angle += sinPathVector.angle;
		sinPoint += startPoint;
		sinPath.add(sinPoint);
	}
	sinPath.smooth();
	// sinPath.fullySelected = true;
	sinPath.strokeColor = color;
	sinPath.strokeWidth = 3;

	sinPathGroup.addChild(sinPath);
}
function setLeadToVector(center1, center2) {
	// set a 'LeadTo Vector'
	//magic numbers
	var whiteSpace = 1/6,
		shortenRate = 4/6;
	//vector
	var vector1to2 = center2 - center1;
	var shortenVec = vector1to2;
	shortenVec.length *= shortenRate;
	//startPoint
	var lineStart = center1 + vector1to2 * whiteSpace;
	var lineEnd = lineStart + shortenVec;

	creatSinGraph(lineStart, lineEnd);
}