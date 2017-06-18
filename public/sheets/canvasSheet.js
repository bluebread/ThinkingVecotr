paper.install(window);

//The items which have been controled now
var nowArrStroke,
	nowArrPath;
var nowSinPath;
var nowEIDashLine;
var nowNotPath,
	nowNotStroke;
var nowAuxDashLine;
var nowCircle;
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
var auxlineDisplay = false;
var arrayDash = [];
//Groups
var circleGroup    = new Group(),
	ArrPathGroup   = new Group(),
	ArrStrokeGroup = new Group(),
	notPathGroup   = new Group(),
	notStrokeGroup = new Group(),
	sinPathGroup   = new Group(),
	elsIfDashGroup = new Group(),
	auxDashGroup   = new Group();

main();

function main(argument) {
	GroupsInsertBelow();
	navbarListener();
	circleFormListenr();
}
function onMouseDown(event) {
	if (!circleBusy) {
		creatCircle(event.point, myRadius, circleColor);
	}
}
function GroupsInsertBelow(){
	ArrPathGroup.insertBelow(circleGroup);
	ArrStrokeGroup.insertBelow(ArrPathGroup);
	notPathGroup.insertBelow(ArrStrokeGroup);
	notStrokeGroup.insertBelow(notPathGroup);
	sinPathGroup.insertBelow(notStrokeGroup);
	elsIfDashGroup.insertBelow(sinPathGroup);
	auxDashGroup.insertBelow(elsIfDashGroup);	
}
function navbarListener(){
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
	$('#ALB').click(function(event){
		console.log("ALB CONNECTED!")
		auxlineDisplay = !auxlineDisplay;
		auxDashGroup.children.forEach(function(auxDash) {
			auxlineDisplay ? auxDash.opacity = 0.5 : auxDash.opacity = 0;				
		})
		// auxlineDisplay ? auxDashGroup.opacity = 0.5 : auxDashGroup.opacity = 0;
	})
}
function circleFormListenr() {
	$('#DB').click(function(event){
		console.log("Circle REMOVE!")
		nowCircle.remove();
	});
}
function chooseVector(circleCenter, mousePoint){
	if (whichVector === 'BecauseVector') {
		setBecVector(circleCenter, mousePoint, vectorColor);
		nowArrStroke.removeOnDrag();
		nowArrPath.removeOnDrag();	
	}else if(whichVector === 'LeadToVector'){
		creatSinGraph(circleCenter, mousePoint, vectorColor);
		nowSinPath.removeOnDrag();
	}else if(whichVector === 'NotVector'){
		setNotVector(circleCenter, mousePoint, notColor);
		nowNotStroke.removeOnDrag();
		nowNotPath.removeOnDrag();
	}else if(whichVector === 'ElseIfVector'){			
		setElseIfVector(circleCenter, mousePoint, vectorColor);
		nowEIDashLine.removeOnDrag();
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
			nowAuxDashLine.removeOnDrag();	
		}
	}
	this.onMouseUp = function(event){
		if(nowAuxDashLine){
			if (auxlineDisplay) {
				nowAuxDashLine.opacity = 0.4;
			} else {
				nowAuxDashLine.opacity = 0;
			}
		}
	}
	this.onDoubleClick = function(event) {
		nowCircle = this;
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
	    this.opacity = 1;
	}
	this.onMouseLeave = function(event) {
		if(auxlineDisplay){
			this.opacity = 0.4;
		}else{
			this.opacity = 0;
		}
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
	nowNotPath = new Path(segmentArray);
	initStroke(nowNotPath, color, myVector.length, notPathGroup);
}
function setNotVector(startPoint, endPoint, color) {
	var myNotVector = endPoint - startPoint;
	nowNotStroke = new Path(startPoint, endPoint);
	initStroke(nowNotStroke, color, myNotVector.length, notStrokeGroup);

	createNotPath(startPoint, endPoint, color);
}
//The part of auxiliary line
function creatAuxDash(center, endPoint, color) {
	var horizonVector = endPoint - center;
	nowAuxDashLine = new Path();
	initDashLine(nowAuxDashLine, 'gray', auxDashGroup);
	drawStraightLine(horizonVector, center, nowAuxDashLine);
	nowAuxDashLine.auxDashLineListener();
}
function drawStraightLine(vector, point, line) {
	var unitVector = vector / vector.length;
	console.log(unitVector);
	for(var i = 0 ; i < 1500 ; i++){
		var dashX = point.x + unitVector.x * i;
		var dashY = point.y + unitVector.y * i;
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
	nowEIDashLine = new Path(startPoint, endPoint);
	initDashLine(nowEIDashLine, '#00BFFF', elsIfDashGroup);
}

//The part of 'Because Vector'
function creatCircle(center, radius, color){
	var myCircle;
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
function createArrStroke(startPoint, endPoint, color){
	var myVector = endPoint - startPoint;
	nowArrStroke = new Path(startPoint, endPoint);
	initStroke(nowArrStroke, color, myVector.length, ArrStrokeGroup)
}
function createArrPath(startPoint, endPoint, color){
	//magic number
	var shortenParam = 0.1;
	//create arrow line
	var myRevVec = -(endPoint - startPoint);//reverse vector
	var myRevShortVec = myRevVec * shortenParam;
	//restrict the length of arrow path
	var maxArrPath = 30;
	if (myRevShortVec > maxArrPath) {
		myRevShortVec /= myRevShortVec.length;
		myRevShortVec *= maxArrPath;
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
	nowArrPath = new Path(segments);
	//set the width of arrow
	var ArrWidth = myRevVec.length / 40;
	var maxArrWidth = 12;
	var minArrWidth = 3;
	nowArrPath.strokeWidth = ArrWidth;
	
	if (ArrWidth > maxArrWidth) {
		nowArrPath.strokeWidth = maxArrWidth;
	}else if(ArrWidth < minArrWidth){
		nowArrPath.strokeWidth = minArrWidth;
	}

	nowArrPath.strokeColor = color;

	ArrPathGroup.addChild(nowArrPath);
}
function setBecVector(circleCenter, ArrEnd, color) {
	createArrStroke(circleCenter, ArrEnd, color);
	createArrPath(circleCenter, ArrEnd, color);
}

//The Part of 'LeadTo Vector'
function creatSinGraph(startPoint, endPoint, color){
	var sinPathVector = endPoint - startPoint;
	nowSinPath = new Path();
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
		nowSinPath.add(sinPoint);
	}
	nowSinPath.smooth();
	nowSinPath.strokeColor = color;
	nowSinPath.strokeWidth = 3;

	sinPathGroup.addChild(nowSinPath);
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