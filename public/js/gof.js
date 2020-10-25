let iterations = 0
let map = new Array()
let size = 40
let columns;
let rows;
let started = true
let next = new Array()
let buffer = new Array();
let gridColor = "#F11085"
let history = []
let framerate = 40

document.querySelector(".reset").addEventListener("click", (e) => {
	iterations = 0;
	initMap()
	started = false
	singlePass()
	updateHud()
	noLoop()
})

document.querySelector(".stop").addEventListener("click", (e) => {
	if (started === true) {
		started = false
		noLoop()
	}
})

document.querySelector(".start").addEventListener("click", (e) => {
	if (started === false) {
		started = true
		loop()
	}
})

document.querySelector(".erase").addEventListener("click", (e) => {
	if (started === false){
		iterations = 0;
		updateHud()
		eraseMap()
	}
})

document.querySelector(".fill").addEventListener("click", (e) => {
	if (started === false) {
		iterations = 0
		updateHud()
		fillMap()
	}
})

document.querySelector(".save").addEventListener("click", (e) => {
	storeItem("lifemap", map)
})

document.querySelector(".load").addEventListener("click", (e) => {
	if (started === false) {
		let tmp = getItem("lifemap")
		map = getItem("lifemap")
		next = getItem("lifemap")
	}
	singlePass()
})

document.querySelector(".gridcolor").addEventListener("change", e => {
	gridColor = e.target.value
	singlePass();
})


document.querySelector(".size").addEventListener("change", e => {
	if (started === false) {
		size = e.target.value
		columns = floor((window.innerWidth - 50) / size)
		rows = floor((window.innerHeight - 130) / size)
		let mycanvas = createCanvas(size * columns, size * rows);	
		initMap();
	 	singlePass();
	}
})

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


function setup() {
	noLoop()
	frameRate(framerate)
	started = false
	columns = floor((window.innerWidth - 50) / size)
	rows = floor((window.innerHeight - 130) / size)
	let mycanvas = createCanvas(size * columns, size * rows);	
	initMap();
	mycanvas.parent("mycanvas");
}


function draw() {
	background(0);
	updateHud()
	updateMap()
	drawMap()
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
				fill("white")
			else
				fill(gridColor)	
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

function handleDraw() {
	let pair = {}
	pair.x = floor(mouseY / size)
	pair.y = floor(mouseX / size)
	buffer.length === 0 ? buffer.push(pair) : ""

	if (buffer[buffer.length - 1].x != pair.x || buffer[buffer.length - 1].y != pair.y) {
		buffer.push(pair)
		map[pair.x][pair.y] = !map[pair.x][pair.y]
		singlePass()
	} 
}



function singlePass() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			if (map[i][j] === false)
				fill("white")
			else
				fill(gridColor)
			stroke(gridColor)
			rect(j * size, i * size, size-1, size-1);		
		}
	}
}

function eraseMap() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			map[i][j] = false;
		}
	}
	singlePass()
}

function fillMap() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			map[i][j] = true;
		}
	}
	singlePass()

}

