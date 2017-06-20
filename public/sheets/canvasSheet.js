paper.install(window);
console.log(24);
//The items which have been controled now
var nowArrStroke,
	nowArrPath;
var nowSinPath;
var nowEIDashLine;
var nowNotPath,
	nowNotStroke;
var nowAuxDashLine;
var nowCircle;
//The lists
var datavecList = [],
	datacirList = [];
//The switch of Vectors
var whichVector = "BV";
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

function onMouseDown(event) {
	if (!circleBusy) {
		creatCircle(event.point, myRadius, circleColor);
	}
}

function main(argument) {
	GroupsInsertBelow();
	navbarListener();
	circleFormListenr();
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
function chooseVector(circleCenter, mousePoint){
	if (whichVector === 'BV') {
		setBecVector(circleCenter, mousePoint, vectorColor);
		nowArrStroke.removeOnDrag();
		nowArrPath.removeOnDrag();	
	}else if(whichVector === 'LTV'){
		setLeadToVector(circleCenter, mousePoint, vectorColor);
		nowSinPath.removeOnDrag();
	}else if(whichVector === 'NV'){
		setNotVector(circleCenter, mousePoint, notColor);
		nowNotStroke.removeOnDrag();
		nowNotPath.removeOnDrag();
	}else if(whichVector === 'EIV'){			
		setElseIfVector(circleCenter, mousePoint, vectorColor);
		nowEIDashLine.removeOnDrag();
	}else{
		return undefined;
	}
}
//set self object
function Datavec(startPoint, endPoint, type) { // the data about this vector
	this.startPoint = startPoint;
	this.endPoint   = endPoint;
	this.vector     = endPoint - startPoint;
	this.type       = type;
	this.links      = {};
	this.addLink = function(key, item) {
		if (key === "circle") {
			this.links.circle = item;
		}else if (key === "stroke") {
			this.links.arrStroke = item;
		}else if (key === "path") {
			this.links.arrPath = item;
		}else if (key === "sin") {
			this.links.sinPath = item;
		}else if (key === "!stroke") {
			this.links.notStroke = item;
		}else if (key === "!path") {
			this.links.notPath = item;
		}else if (key === "dash") {
			this.links.eiDashLine = item;
		}else if (key === "aux") {
			this.links.auxLine = item;
		}else{
			console.log("ADDLINK ERROR!!")
			return null;
		}
	};
}
function Datacir(argument) { //the data about this circle
	this.center  = center;
	this.radius  = radius;
	this.vectors = [];
	//the form content
	this.title   = "";
	this.content = "";
	this.brand   = "";
}

//set listeners
function navbarListener(){
	$("#BV").click(function(event) {
		console.log("BV CONNECTED!")
		whichVector = 'BV';
	});
	$("#LTV").click(function(event) {
		console.log("LTV CONNECTED!")
		whichVector = 'LTV';
	});
	$("#NV").click(function(event) {
		console.log("NV CONNECTED!")
		whichVector = 'NV';
	});
	$("#EIV").click(function(event) {
		console.log("EIV CONNECTED!")
		whichVector = 'EIV';
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
Path.prototype.circleListener = function(){
	this.onMouseEnter = function(event) {
		this.fillColor = '#00BFFF';
		circleBusy = true;
		nowCircle = this;
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
	this.onMouseDown = function(event) {
		circleBusy = true;
	}
	this.onMouseUp = function(event){
		if(nowAuxDashLine){
			auxlineDisplay ? nowAuxDashLine.opacity = 0.4 : nowAuxDashLine.opacity = 0;
		}

		var datavec = new Datavec(this.data.center, event.point, whichVector)
		datavec.addLink("circle", this);
		console.log("circleBusy is " + circleBusy);
		console.log(whichVector);
		if (whichVector === 'BV' && !circleBusy) {
			datavec.addLink("stroke", nowArrStroke);
			datavec.addLink("path", nowArrPath);
			datavecList.push(datavec);
		}else if(whichVector === 'LTV' && !circleBusy){
			datavec.addLink("sin", nowSinPath);
			datavecList.push(datavec);
		}else if(whichVector === 'NV' && !circleBusy){
			datavec.addLink("!stroke", nowNotStroke);
			datavec.addLink("!path", nowNotPath);
			datavecList.push(datavec);
		}else if(whichVector === 'EIV' && !circleBusy){
			datavec.addLink("dash", nowEIDashLine);
			datavecList.push(datavec);
		}else{
			return undefined;
		}
		console.log(datavec.links);
		console.log(datavecList);
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
function setLeadToVector(startPoint, endPoint, color) {
	creatSinGraph(startPoint, endPoint, color);

	// var datavec = new Datavec(startPoint, endPoint, "LTV");
	// datavec.addLink("sin", nowSinPath);
	// // datavec.addLink("circle", nowCircle);
	// datavecList.push(datavec);
}