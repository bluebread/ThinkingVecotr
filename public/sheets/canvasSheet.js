paper.install(window);
console.log(32);
//The items which have been controled now
var nowVector,
	nowArrPath,
	nowSinPath,
	nowEIDashLine,
	nowNotPath,
	nowAuxDashLine,
	nowCircle,
	nowRemoveCircle,
	nowCrossField,
	nowCrossVector,
	firstCrossVector,
	secondCrossVector;
//The lists
var datavecList = [],
	datacirList = [];
//The switch of Vectors
var whichVector = "BV";
//colors
var circleColor = '#0000FF',
	becColor    = '#1E90FF',
	sinColor    = '#1E90FF',
	notColor    = '#FF4500',//Orangered
	eiColor     = '#00BFFF';
//magic numbers
var myRadius = 25;
var arrayDash = [];
//Booleans
var circleBusy       = false,
	formBusy         = false,
	vectorBusy       = false,
	circleActionBusy = true,
	vectorActionBusy = false,
	auxlineDisplay   = false,
	crossReady       = false;
//Groups
var circleGroup     = new Group(),
	ArrPathGroup    = new Group(),
	notPathGroup    = new Group(),
	sinPathGroup    = new Group(),
	elsIfDashGroup  = new Group(),
	crossFieldGroup = new Group(),
	auxDashGroup    = new Group();

main();

function onMouseDown(event) {
	setCircle(event);
}

function main(argument) {
	GroupsInsertBelow();
	navbarListener();
	circleFormListenr();
}
//The part of 'Circle'
function setCircle(event) {
	var busyLicense = (!circleBusy && !formBusy && !vectorBusy);
	if(busyLicense){
		createCircle(event.point, myRadius, circleColor);
		var datacir = new Datacir(nowCircle, event.point, myRadius);
		datacirList.push(datacir);
	}
}
function createCircle(center, radius, color){
	nowCircle = new Path.Circle(center, radius);
	nowCircle.fillColor = color;
	nowCircle.data.center = center;
	nowCircle.circleListener();

	circleGroup.addChild(nowCircle);
}
function GroupsInsertBelow(){
	ArrPathGroup.insertBelow(circleGroup);
	notPathGroup.insertBelow(ArrPathGroup);
	sinPathGroup.insertBelow(notPathGroup);
	elsIfDashGroup.insertBelow(sinPathGroup);
	crossFieldGroup.insertBelow(elsIfDashGroup);	
	auxDashGroup.insertBelow(crossFieldGroup);
}
function chooseVector(startPoint, mousePoint, type){
	if (type === 'BV') {
		setBecVector(startPoint, mousePoint, becColor);
		nowArrPath.removeOnDrag();
		console.log(nowArrPath)
	}else if(type === 'LTV'){
		setLeadToVector(startPoint, mousePoint, sinColor);
		nowSinPath.removeOnDrag();
	}else if(type === 'NV'){
		setNotVector(startPoint, mousePoint, notColor);
		nowNotPath.removeOnDrag();
	}else if(type === 'EIV'){			
		setElseIfVector(startPoint, mousePoint, eiColor);
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
		}else if (key === "BV") {
			this.links.arrPath = item;
		}else if (key === "LTV") {
			this.links.sinPath = item;
		}else if (key === "NV") {
			this.links.notPath = item;
		}else if (key === "EIV") {
			this.links.eiDashLine = item;
		}else if (key === "aux") {
			this.links.auxLine = item;
		}else{
			console.log("ADDLINK ERROR!!")
			return null;
		}
	};
	this.findLink = function(type) {
		if (key === "circle" && this.links.circle) {
			return this.links.circle;
		}else if (key === "BV" && this.links.arrPath) {
			return this.links.arrPath;
		}else if (key === "LTV" && this.links.sinPath) {
			return this.links.sinPath;
		}else if (key === "NV" && this.links.notPath) {
			return this.links.notPath;
		}else if (key === "EIV" && this.links.eiDashLine) {
			return this.links.eiDashLine;
		}else if (key === "aux" && this.links.auxLine) {
			return this.links.auxLine;
		}else{
			console.log("NOT FOUND")
			return undefined;
		}
	}
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
		nowRemoveCircle.remove();
		datacirList.forEach(function(datacir, index, array) {
			(datacir.self == nowRemoveCircle) && (array.splice(index,1));
		})
	});
	$('#SB').click(function(event) {
		formBusy = false;
	});
}
Path.prototype.circleListener = function(){
	this.onMouseEnter = function(event) {
		circleBusy = true;
		nowCircle = this;
		this.fillColor = '#00BFFF';
	}
	this.onMouseLeave = function(event) {
	    circleBusy = false;
	    this.fillColor = circleColor;
	}
	this.onMouseDrag = function(event){
		createVector(this, event);
	}
	this.onMouseDown = function(event) {
		circleBusy = true;
		circleActionBusy = true;
		console.log(circleActionBusy);
	}
	this.onMouseUp = function(event){
		Boolean(nowAuxDashLine) && (auxlineDisplay ? nowAuxDashLine.opacity = 0.4 : nowAuxDashLine.opacity = 0);
		MouseUpSavingData(this, event);
		// if(!crossReady){
		// 	if (circleActionBusy) {
		// 		return null;
		// 	}else if(whichVector === 'BV') {
		// 		nowCrossField.remove();
		// 		nowArrPath.remove();
		// 	}else if(whichVector === 'LTV'){
		// 		nowCrossField.remove();
		// 		nowSinPath.remove();
		// 	}else if(whichVector === 'NV'){
		// 		nowCrossField.remove();
		// 		nowNotPath.remove();
		// 	}else if(whichVector === 'EIV'){
		// 		nowCrossField.remove();
		// 		nowEIDashLine.remove();
		// 	}else{
		// 		return undefined;
		// 	}
		// }
		circleActionBusy = false;
	}
	this.onDoubleClick = function(event) {
		circleBusy = true;
		callForm(this);
	}
	function createVector(thisCicle, thisEvent) {
		var busyLicense = (!circleBusy && !formBusy)
		if (busyLicense) {
			chooseVector(thisCicle.data.center, thisEvent.point, whichVector);
			creatAuxDash(thisCicle.data.center, thisEvent.point, 'gray');
			nowAuxDashLine.removeOnDrag();
		}
	}
	function MouseUpSavingData(thisCicle, thisEvent) {
		var datavec = new Datavec(thisCicle.data.center, thisEvent.point, whichVector)
		var thisDatacir;	

		commandSave(thisCicle);

		console.log("======================")
		console.log(datavec.links);
		console.log(thisDatacir.vectors);
		console.log(datavecList);
		console.log(datacirList);
		console.log("======================")

		function commandSave(thisCicle) {
			datacirList.forEach(function(datacir) {
				(datacir.self == thisCicle) && (thisDatacir = datacir);
			})
			var busyLicense = (!circleBusy && !formBusy)
			if (whichVector === 'BV' && busyLicense) {
				saveDatavec(thisCicle, "BV", nowArrPath);
			}else if(whichVector === 'LTV' && busyLicense){
				saveDatavec(thisCicle, "LTV", nowSinPath);
			}else if(whichVector === 'NV' && busyLicense){
				saveDatavec(thisCicle, "NV", nowNotPath);
			}else if(whichVector === 'EIV' && busyLicense){
				saveDatavec(thisCicle, "EIV", nowEIDashLine);
			}else{
				return undefined;
			}
		}
		function saveDatavec(thisCicle, command, nowtypeVector) {
			datavec.addLink("circle", thisCicle);
			datavec.addLink(command, nowtypeVector);
			thisDatacir.vectors.push(datavec);
			datavecList.push(datavec);
		}
	}
	function callForm(thisCicle) {
		var busyLicense = (!formBusy)
		busyLicense && (nowRemoveCircle = thisCicle);
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
Path.prototype.vectorListener = function(type) {
	var thisVector = this;
	this.onMouseEnter = function(event) {
		vectorBusy = true;
		// var crossLicense = (vectorActionBusy && firstCrossVector !== this && nowCrossVector !== this);
		// if (crossLicense) {
		// 	crossReady = true;
		// 	secondCrossVector = this;
		// }
		setTypeColor('#00BFFF', '#00BFFF', "#FF7F50", '#1E90FF')
	}
	this.onMouseLeave = function(event) {
		vectorBusy = false;
		// var crossLicense = (vectorActionBusy && firstCrossVector !== this && nowCrossVector !== this);
		// (crossLicense) && (crossReady = false);
		setTypeColor(becColor, sinColor, notColor, eiColor);
	}
	this.onMouseDrag = function(event) {
		// console.log(circleActionBusy);
		// var startPoint = this.data.startPoint,
		// 	endPoint   = this.data.endPoint,
		// 	mousePoint = event.point,
		// 	crossFieldPoint = endPoint + mousePoint - startPoint;
		// var busyLicense = (!formBusy && !circleBusy && !circleActionBusy);
		// if (busyLicense) {
		// 	firstCrossVector = this;
		// 	console.log(crossReady);
		// 	if (!crossReady) {
		// 		chooseVector(startPoint, mousePoint, type);
		// 		setCrossColor('#00BFFF', '#00BFFF', "#FF7F50", '#1E90FF', 0.5);
		// 	}
		// 	nowCrossField = new Path(startPoint, endPoint, crossFieldPoint, mousePoint);
		// 	nowCrossField.fillColor = '#e9e9ff';
		// 	nowCrossField.opacity = 0.3;
		// 	nowCrossField.removeOnDrag();
		// 	crossFieldGroup.addChild(nowCrossField);
		// }
	}
	this.onMouseDown = function(event) {
		vectorActionBusy = true;
		vectorBusy = true;
	}
	this.onMouseUp = function(event) {
		vectorActionBusy = false;

	}
	this.onDoubleClick = function(event) {
		vectorBusy = true;
	}
	function setTypeColor(bcolor, scolor, ncolor, ecolor) {
		if (circleActionBusy || vectorActionBusy) {
			return null;
		}else if(type === 'BV') {
			thisVector.strokeColor = bcolor;
		}else if(type === 'LTV'){
			thisVector.strokeColor = scolor;
		}else if(type === 'NV'){
			thisVector.strokeColor = ncolor;
		}else if(type === 'EIV'){
			thisVector.strokeColor = ecolor;
		}else{
			return undefined;
		}
	}
	function setCrossColor(bcolor, scolor, ncolor, ecolor, opacity) {
		if (circleActionBusy) {
			return null;
		}else if(type === 'BV') {
			nowArrPath.strokeColor = bcolor;
			nowArrPath.opacity = opacity;
			nowCrossVector = nowArrPath;
		}else if(type === 'LTV'){
			nowSinPath.strokeColor = scolor;
			nowSinPath.opacity = opacity;
			nowCrossVector = nowSinPath;
		}else if(type === 'NV'){
			nowNotPath.strokeColor = ncolor;
			nowNotPath.opacity = opacity;
			nowCrossVector = nowNotPath;
		}else if(type === 'EIV'){
			nowEIDashLine.strokeColor = ecolor;
			nowEIDashLine.opacity = opacity;
			nowCrossVector = nowEIDashLine;
		}else{
			return undefined;
		}
	}
};

//The part of 'Not Vector'
function setNotVector(startPoint, endPoint, color) {
	var middlePoint = (startPoint + endPoint) / 2,
		notVector   = endPoint - startPoint,
		notShortVec    = notVector * 0.1;
	var toRightAngleVector = notShortVec.clone(),
		toLeftAngleVector  = notShortVec.clone();
	toRightAngleVector.angle += 45;
	toLeftAngleVector.angle -= 45;

	var rightTopPoint    = middlePoint + toRightAngleVector,
		leftBottomPoint  = middlePoint - toRightAngleVector,
		leftTopPoint     = middlePoint + toLeftAngleVector,
		rightBottomPoint = middlePoint - toLeftAngleVector;
	var segmentArray = [startPoint,
						middlePoint,
						rightTopPoint, 
						leftBottomPoint,
						middlePoint,
						leftTopPoint,
						rightBottomPoint,
						middlePoint,
						startPoint,
						endPoint,
						middlePoint]
	nowNotPath = new Path(segmentArray);
	initPath(nowNotPath, color,	notVector.length, notPathGroup, 'NV', startPoint);
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
function initDashLine(dashLine, color, group, startPoint, endPoint) {
	dashLine.data.startPoint = startPoint;
	dashLine.data.endPoint = endPoint;
	dashLine.strokeWidth = 4;
	dashLine.strokeColor = color;
	dashLine.dashArray = [10, 12];
	group.addChild(dashLine);
}
function setElseIfVector(startPoint, endPoint, color) {
	nowEIDashLine = new Path(startPoint, endPoint);
	initDashLine(nowEIDashLine, color, elsIfDashGroup, startPoint, endPoint);
	nowEIDashLine.vectorListener('EIV');
}
//The part of 'Because Vector'
function initPath(path, color, length, group, type, startPoint, endPoint) {
	path.strokeColor = color;
	path.strokeJoin = 'round';
	path.data.startPoint = startPoint;
	path.data.endPoint = endPoint;
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
	path.vectorListener(type);
}
function setBecVector(startPoint, endPoint, color){
	var revVec,
		revShortVec,
		rightVec,
		leftVec;

	initRevShortVec();
	//create arrow
	nowArrPath = new Path(arrSegments());
	initPath(nowArrPath, color, revVec.length, ArrPathGroup, 'BV', startPoint, endPoint);

	function initRevShortVec() {
		//create arrow line
		revVec = -(endPoint - startPoint);//reverse vector
		revShortVec = revVec * 0.1;
		//restrict the length of arrow path
		var maxArrPath = 30;
		if (revShortVec > maxArrPath) {
			revShortVec /= revShortVec.length;
			revShortVec *= maxArrPath;
		}
	}
	function arrSegments() {
		//create right arrow line
		rightVec = revShortVec.clone();
		leftVec = revShortVec.clone();
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
		return segments;
	}
}

//The Part of 'LeadTo Vector'
function setLeadToVector(startPoint, endPoint, color){
	var sinPathVector = endPoint - startPoint;
	initSinPath();
	drawSinPath();
	function initSinPath() {
		nowSinPath = new Path();
		nowSinPath.data.startPoint = startPoint;
		nowSinPath.data.endPoint = endPoint;
		nowSinPath.smooth();
		nowSinPath.strokeColor = color;
		nowSinPath.strokeWidth = 5;
		sinPathGroup.addChild(nowSinPath);
		nowSinPath.vectorListener('LTV');
	}
	function drawSinPath() {
		//magic numbers
		var height = 10,
			wavelength = 18,
			timeOfWave = sinPathVector.length / wavelength,
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
	}
}