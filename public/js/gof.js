let map = new Array()
let size = 40;
let columns;
let rows;
let started = true

document.querySelector(".reset").addEventListener("click", (e) => {
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
		console.log(map, "bonjour monsieur vous êtes constipé")
		eraseMap()
	}
})

document.querySelector(".fill").addEventListener("click", (e) => {
	if (started === false) {
		console.log(map, "bonjour monsieur vous êtes constipé")
		fillMap()
	}
})

function setup() {
	frameRate(40)
	noLoop()
	started = false
	columns = floor((window.innerWidth - 50) / size)
	rows = floor((window.innerHeight - 130) / size)
	createCanvas(size * columns, size * rows);	
	for (let i = 0; i < rows; i ++) {
		map[i] = new Array(columns)
	}
	initMap();
}

function draw() {
	background(0);
	document.querySelector(".status").innerHTML = started === true ? "started" : "stopped"
	drawMap()
	updateMap()
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
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			if (i === 0 || j === 0 || i === rows -1 || j === columns -1) {
				map[i][j] = false;
			} else {
				map[i][j] = floor(random(0, 2)) === 1 ? true : false
			}
		}
	}

}

function updateMap() {
	for (let i = 1; i < rows - 1; i++) {
		for (let j = 1; j < columns - 1; j++) {
			map[i][j] = checkCell(i, j)
		}
	}
}

function checkCell(i, j) {
	let neighbours = 0;

	if (map[i-1][j-1] === true)
		neighbours++;
	
	if (map[i-1][j] === true)
		neighbours++;
	
	if (map[i-1][j+1] === true)
		neighbours++;
	

	if (map[i][j-1] === true)
		neighbours++;
	
	if (map[i][j+1] === true)
		neighbours++;
	

	if (map[i+1][j-1] === true)
		neighbours++;
	
	if (map[i+1][j] === true)
		neighbours++;
	
	if (map[i+1][j+1] === true)
		neighbours++;
	


	if (neighbours === 3 || neighbours === 2 && map[i][j] === true) 
		return true

	return false

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
	console.log(map, "bonjour monsieur")

}

