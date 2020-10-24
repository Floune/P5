let map = new Array()
let size = 40;
let columns;
let rows;
let snakeX = new Array()
let snakeY = new Array()

function setup() {
	columns = floor(window.innerWidth / size)
	rows = floor(window.innerHeight / size)
	createCanvas(window.innerWidth, window.innerHeight);	
	createMap()
	for (let i = 0; i < columns; i ++) {
		map[i] = new Array(rows)
	}
	initMap();
}

function draw() {
	background(0);
	drawMap()
	fill("yellow")
}

function drawMap() {
	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			if (map[i][j] === 0)
				fill("white")
			else
				fill("black")
			rect(i * size, j * size, size-1, size-1);		
		}
	}
} 

function initMap() {
	for (let i = 0; i < columns; i++) {
		for (let j = 0; j < rows; j++) {
			if (i === 0 || j === 0 || i === columns -1 || j === rows -1) {
				map[i][j] = 0;
			} else {
				map[i][j] = floor(random(0, 2))
			}
		}
	}

}

function createMap() {

}