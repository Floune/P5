let iterations = 0
let map = new Array()
let size = 20
let columns;
let rows;
let started = true
let next = new Array()
let buffer = new Array();

document.querySelector(".reset").addEventListener("click", (e) => {
	iterations = 0;
	initMap()
	started = false
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
		eraseMap()
	}
})

document.querySelector(".fill").addEventListener("click", (e) => {
	if (started === false) {
		fillMap()
	}
})


function setup() {
	frameRate(40)
	noLoop()
	started = false
	columns = floor((window.innerWidth - 50) / size)
	rows = floor((window.innerHeight - 130) / size)
	let mycanvas = createCanvas(size * columns, size * rows);	
	mycanvas.parent("mycanvas");
	initMap();
}

function saveMap() {
	let allStorage = {...localStorage}
	for (const [key, value] of Object.entries(allStorage)) {
		if (key.startsWith("map")) {
			savings.push(value)
		}
	}
	storeItem("map-" + savings.length + 1, map)
}

function loadMap() {
	let allStorage = {...localStorage}
	for (const [key, value] of Object.entries(allStorage)) {
		if (key.startsWith("map")) {
			var btn = document.createElement("BUTTON");
			btn.innerHTML = key;
			document.querySelector(".toolbar").appendChild(btn); 
		}
	}
}

function draw() {
	background(0);
	document.querySelector(".status").innerHTML = started === true ? "started" : "stopped"
	document.querySelector(".iterations").innerHTML = iterations
	updateMap()
	drawMap()
}

function drawMap() {

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			if (map[i][j] === false)
				fill("white")
			else
				fill("black")
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
			if (i === 0 || j === 0 || i === rows -1 || j === columns -1) {
				map[i][j] = false;
			} else {
				map[i][j] = floor(random(0, 2)) === 1 ? true : false
			}
			next[i][j] = false;
		}
	}

}


function updateMap() {
	iterations++;
	for (let i = 0; i < rows - 1; i++) {
		for (let j = 0; j < columns - 1; j++) {
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

	if (i !== 0 && j !== columns) {
		if (map[i-1][j+1] === true)
			neighbours++;
	}

	if (j !== 0) {
		if (map[i][j-1] === true)
			neighbours++;
	}

	if (j !== columns) {
		if (map[i][j+1] === true)
			neighbours++;
	}

	if (i !== rows && j !== 0) {
		if (map[i+1][j-1] === true)
			neighbours++;
	}


	if (i !== rows) {
		if (map[i+1][j] === true)
			neighbours++;
	}

	if (i !== rows && j !== columns) {
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

function mouseDragged() {
	handleDraw()
}

function mouseReleased() {
	buffer = []
}


function mouseClicked() {
	let x = floor(mouseY / size)
	let y = floor(mouseX / size)
	if ((x > 0 && x < columns * size) && (y > 0 && y < rows * size))
		map[x][y] = !map[x][y]
	singlePass()
}

function singlePass() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			if (map[i][j] === false)
				fill("white")
			else
				fill("black")
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

