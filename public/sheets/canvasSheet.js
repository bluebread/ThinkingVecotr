paper.install(window);
console.log(28);
//The items which have been controled now
var nowArrPath;
var nowSinPath;
var nowEIDashLine;
var nowNotPath;
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
var arrayDash = [];
//Booleans
var circleBusy = false;
var formBusy = false;
var busyLicense = (!circleBusy && !formBusy);
var auxlineDisplay = false;
//Groups
var circleGroup    = new Group(),
	ArrPathGroup   = new Group(),
	notPathGroup   = new Group(),
	sinPathGroup   = new Group(),
	elsIfDashGroup = new Group(),
	auxDashGroup   = new Group();

main();

function onMouseDown(event) {
	busyLicense = (!circleBusy && !formBusy);
	if(busyLicense){
		creatCircle(event.point, myRadius, circleColor);
		var datacir = new Datacir(nowCircle, event.point, myRadius);
		datacirList.push(datacir);
	}
}

function main(argument) {
	GroupsInsertBelow();
	navbarListener();
	circleFormListenr();
}
function GroupsInsertBelow(){
	ArrPathGroup.insertBelow(circleGroup);
	notPathGroup.insertBelow(ArrPathGroup);
	sinPathGroup.insertBelow(notPathGroup);
	elsIfDashGroup.insertBelow(sinPathGroup);
	auxDashGroup.insertBelow(elsIfDashGroup);	
}
function chooseVector(circleCenter, mousePoint){
	if (whichVector === 'BV') {
		setBecVector(circleCenter, mousePoint, vectorColor);
		nowArrPath.removeOnDrag();	
	}else if(whichVector === 'LTV'){
		setLeadToVector(circleCenter, mousePoint, vectorColor);
		nowSinPath.removeOnDrag();
	}else if(whichVector === 'NV'){
		setNotVector(circleCenter, mousePoint, notColor);
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
		}else if (key === "path") {
			this.links.arrPath = item;
		}else if (key === "sin") {
			this.links.sinPath = item;
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
function Datacir(itself, center, radius) { //the data about this circle
	this.self    = itself;
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
	$('#circleForm').mouseenter(function() {
		formBusy = true;
	});
	$('#DB').click(function(event){
		console.log("DB CLICKED!");
		formBusy = false;
		busyLicense = (!circleBusy && !formBusy)
		busyLicense && (nowCircle.remove());
	});
	$('#SB').click(function(event) {
		formBusy = false;
	});
}
Path.prototype.circleListener = function(){
	this.onMouseEnter = function(event) {
		this.fillColor = '#00BFFF';
		busyLicense = (!circleBusy && !formBusy)
		busyLicense && (nowCircle = this);
		circleBusy = true;
	}
	this.onMouseLeave = function(event) {
	    this.fillColor = circleColor;
	    circleBusy = false;
	}
	this.onMouseDrag = function(event){
		busyLicense = (!circleBusy && !formBusy)
		if (busyLicense) {
			chooseVector(this.data.center, event.point);
			//set auxiliary line
			creatAuxDash(this.data.center, event.point, 'gray');
			nowAuxDashLine.removeOnDrag();
		}
	}
	this.onMouseDown = function(event) {
		circleBusy = true;
		busyLicense = (!circleBusy && !formBusy)
		busyLicense && (nowCircle = this);
	}
	this.onMouseUp = function(event){
		Boolean(nowAuxDashLine) && (auxlineDisplay ? nowAuxDashLine.opacity = 0.4 : nowAuxDashLine.opacity = 0);
		
		busyLicense = (!circleBusy && !formBusy)
		var datavec = new Datavec(this.data.center, event.point, whichVector)

		var listenerCir = this;
		var thisDatacir;
		datacirList.forEach(function(datacir) {
			(datacir.self == listenerCir) && (thisDatacir = datacir);
		})

		if (whichVector === 'BV' && busyLicense) {
			datavec.addLink("circle", this);
			datavec.addLink("path", nowArrPath);
			thisDatacir.vectors.push(datavec);
			datavecList.push(datavec);
		}else if(whichVector === 'LTV' && busyLicense){
			datavec.addLink("circle", this);
			datavec.addLink("sin", nowSinPath);
			thisDatacir.vectors.push(datavec);
			datavecList.push(datavec);
		}else if(whichVector === 'NV' && busyLicense){
			datavec.addLink("circle", this);
			datavec.addLink("!path", nowNotPath);
			thisDatacir.vectors.push(datavec);
			datavecList.push(datavec);
		}else if(whichVector === 'EIV' && busyLicense){
			datavec.addLink("circle", this);
			datavec.addLink("dash", nowEIDashLine);
			thisDatacir.vectors.push(datavec);
			datavecList.push(datavec);
		}else{
			return undefined;
		}
		console.log(datavec.links);
		console.log(thisDatacir.vectors);
		console.log(datavecList);
		console.log(datacirList);
	}
	this.onDoubleClick = function(event) {
		circleBusy = true;
		formBusy = true;
		busyLicense = (!circleBusy && !formBusy)
		busyLicense && (nowCircle = this);
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
		auxlineDisplay ? this.opacity = 0.4 : this.opacity = 0;
	}
};

//The part of 'Not Vector'
function setNotVector(startPoint, endPoint, color) {
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
						rightBottomPoint,
						middlePoint,
						startPoint,
						endPoint]
	nowNotPath = new Path(segmentArray);
	initPath(nowNotPath, color, myVector.length, notPathGroup);
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
//The part of 'Circle'
function creatCircle(center, radius, color){
	nowCircle = new Path.Circle(center, radius);
	nowCircle.fillColor = color;
	nowCircle.data.center = center;
	nowCircle.circleListener();

	circleGroup.addChild(nowCircle);
}
//The part of 'Because Vector'
function initPath(path, color, length, group) {
	path.strokeColor = color;
	path.strokeJoin = 'round';
	//set the width of arrow path
	var myPathWidth = length / 40;
	var maxPathWidth = 10;
	var minPathWidth = 4;
	path.strokeWidth = myPathWidth;
	if(myPathWidth > maxPathWidth) {
		path.strokeWidth = maxPathWidth;
	}else if(myPathWidth < minPathWidth){
		path.strokeWidth = minPathWidth;
	}	
	group.addChild(path);
}
function setBecVector(startPoint, endPoint, color){
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
	var segments = [startPoint,
					endPoint,
					rightEnd,
					endPoint,
					leftEnd,
					endPoint,
					startPoint];
	//create arrow
	nowArrPath = new Path(segments);
	initPath(nowArrPath, color, myRevVec.length, ArrPathGroup);
}

//The Part of 'LeadTo Vector'
function setLeadToVector(startPoint, endPoint, color){
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