let iterations = 0
let map = new Array()
let sf = 1
let size = 40
let columns;
let rows;
let started = true
let next = new Array()
let buffer = new Array();
let gridColor = "black"
let emptyColor = "black"
let fullColor = "white"
let history = []
let fr = 30
let grid = true
var zoom = 1.00;
var zMin = 0.05;
var zMax = 9.00;
var sensativity = 0.4;
const actions = document.querySelectorAll('[data-action]')
const changes = document.querySelectorAll('[data-change]')

//================Listeners==============================================================//

actions.forEach(a => {																	 
	a.addEventListener("click", e => {
		bindClickButtons(e)
	})
})

changes.forEach(c => {
	c.addEventListener("change", e => {
		bindChangeButtons(e)
	})
})

function bindClickButtons(e) {
	const action = e.currentTarget.getAttribute("data-action")
	if (typeof window[action] === "function") {
		window[action](e.currentTarget)
	}
}

function bindChangeButtons(e) {
	const change = e.currentTarget.getAttribute("data-change")
	if (typeof window[change] === "function") {
		window[change](e.currentTarget)
	}
}

function mouseDragged() {
	handleDraw()
}

function mouseReleased() {
	singlePass()
	buffer = []
}

function mousePressed() {
	let x = floor(mouseY / size)
	let y = floor(mouseX / size)
	if ((x >= 0 && mouseX <= columns * size) && (y >= 0 && mouseY <= rows * size)){
		map[x][y] = !map[x][y]
	}
	singlePass()
}

//================Game===================================================================//

function setup() {
	frameRate(fr)
	noLoop()
	started = false
	let canvas = gen()	
	initMap();
}


function draw() {
	scale(zoom)
	updateHud()
	updateMap()
	drawMap()
}

function gen(gridSize = null) {
	if (started === false) {
		if (gridSize !== null) {
			columns = floor(parseInt(gridSize))
			rows = floor((parseInt(gridSize) / 16) * 9)
		} else {
			columns = floor((window.innerWidth - 50) / size)
			rows = floor((window.innerHeight - 110) / size)
		}
		let mycanvas = createCanvas(size * columns, size * rows);
		mycanvas.parent("mycanvas");
		initMap()
	} else {
		notify("warning", "Stop game before changing size", 4000)
	}
}

function updateHud() {
	let status = document.querySelector(".status")
	if (started === true) {
		status.classList.remove("stopped")
		status.classList.add("started")
	}
	else {
		status.classList.remove("started")
		status.classList.add("stopped")
	} 
	document.querySelector(".iterations").innerHTML = iterations
}

function drawMap() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			if (map[i][j] === false)
				fill(emptyColor)
			else
				fill(fullColor)	
			stroke(gridColor)
			rect(j * size, i * size, size-1, size-1);		
		}
	}
} 

function initMap() {
	for (let i = 0; i < rows; i ++) {
		map[i] = new Array(columns)
		next[i] = new Array(columns)
	}
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			map[i][j] = floor(random(0, 2)) === 0 ? true : false
			next[i][j] = false;
		}
	}

}

function updateMap() {
	iterations++; 
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			next[i][j] = buildNext(i, j)
		}
	}
	let tmp = map
	map = next
	next = tmp
}

function buildNext(i, j) { //enfer
	let neighbours = 0;

	if (i !== 0 && j !== 0) {
		if (map[i-1][j-1] === true)
			neighbours++;
	}
	
	if (i !== 0) {
		if (map[i-1][j] === true)
			neighbours++;
	}

	if (i !== 0 && j !== columns - 1) {
		if (map[i-1][j+1] === true)
			neighbours++;
	}

	if (j !== 0) {
		if (map[i][j-1] === true)
			neighbours++;
	}

	if (j !== columns - 1) {
		if (map[i][j+1] === true)
			neighbours++;
	}

	if (i !== rows - 1 && j !== 0) {
		if (map[i+1][j-1] === true)
			neighbours++;
	}
	if (i !== rows -1) {
		if (map[i+1][j] === true)
			neighbours++;
	}

	if (i !== rows - 1 && j !== columns - 1) {
		if (map[i+1][j+1] === true)
			neighbours++;
	}

	if (((map[i][j] == true) && (neighbours <  2)) || ((map[i][j] == true) && (neighbours >  3))){
		return false;
	}
	else if ((map[i][j] == false) && (neighbours == 3)){
		return true;
	}
	
	return map[i][j]; 
	

}

function singlePass() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			if (map[i][j] === false)
				fill(emptyColor)
			else
				fill(fullColor)
			stroke(gridColor)
			rect(j * size, i * size, size-1, size-1);		
		}
	}
}

//===================Interactions==============================================================//

function handleDraw() {
	let pair = {}
	pair.x = floor(mouseY / size)
	pair.y = floor(mouseX / size)
	if ((pair.x >= 0 && mouseX <= columns * size) && (pair.y >= 0 && mouseY <= rows * size)){

		buffer.length === 0 ? buffer.push(pair) : ""

		if (buffer[buffer.length - 1].x != pair.x || buffer[buffer.length - 1].y != pair.y) {
			buffer.push(pair)
			map[pair.x][pair.y] = !map[pair.x][pair.y]
			singlePass()
		} 
	}
}


function eraseMap() {
	if (started === false){
		iterations = 0;
		updateHud()
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < columns; j++) {
				map[i][j] = false;
			}
		}
		singlePass()
	} else {
		notify("warning", "Game still running", 4000)
	}
}

function fillMap() {
	if (started === false) {
		iterations = 0
		updateHud()
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < columns; j++) {
				map[i][j] = true;
			}
		}
		singlePass()
	} else {
		notify("warning", "Game still running", 4000)
	}

}

function resetMap(e) {
	iterations = 0;
	initMap()
	started = false
	singlePass()
	updateHud()
	noLoop()
}

function stopGame(e) {
	if (started === true) {
		started = false
		noLoop()
	}
}

function startGame(e) {
	if (started === false) {
		started = true
		loop()
	}
}

function saveState(e) {
	storeItem("lifemap", map)
	notify("success", "Board saved", 4000)
}

function loadState(e) {
	let tmp = getItem("lifemap")
	notify("warning", "come back later", 4000)
}

function squareSize(e) {
	if (started === false) {
		size = e.value
		gen()
		initMap();
		singlePass();
	} else {
		notify("warning", "stop to apply", 4000)
	}
}

function changeFramerate(e) {
	frameRate(parseInt(e.value))
}

function changeWidth(e) {
	gen(e.value)
}


function swapColors() {
	emptyColor = emptyColor === "white" ? "black" : "white";
	fullColor = fullColor === "white" ? "black" : "white";
	singlePass()
}

function zoomin(e) {

}

function zoomout(e) {

}



function notify(type, message, duration) {
	let options = {}
	options.labels = {
		success: "Amazing",
		warning: "Beware"
	}
	options.durations = {
		global: duration,
	}
	type === "success" ? window.notifier.success(message, options) : window.notifier.warning(message, options)
}

