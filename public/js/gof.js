let map = new Set();
let next;
let started = false;
let size = 10
let columns;
let rows;
let fr = 40

const actions = document.querySelectorAll('[data-action]')
const changes = document.querySelectorAll('[data-change]')

let gridColor = "black"
let emptyColor = "#2CFE02"
let fullColor = "black"

let buffer = new Array()
let justBeenSet = ["prout", "fesse"];
let isCool;
let whichCool;


let status = document.querySelector(".status")
let iterationDiv = document.querySelector(".iterations")
let iterations = 0

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
	buffer = []
}

function mousePressed() {
	next = new Set()
	let x = floor(mouseY / size)
	let y = floor(mouseX / size)
	if (isCool) {
		if (typeof window[whichCool] === "function") {
			window[whichCool](x, y)
		}
		isCool = false;
	}
	else if ((x >= 0 && mouseX <= columns * size) && (y >= 0 && mouseY <= rows * size)){
		next.add([x, y])
		updateMap()
		drawMap()
	}
}

//================Game===================================================================//

function updateHud() {
	if (started === true) {
		status.classList.remove("stopped")
		status.classList.add("started")
	}
	else {
		status.classList.remove("started")
		status.classList.add("stopped")
	} 
	iterationDiv.innerHTML = iterations
}

function gen(width = null) {
	if (width) {
		columns = width
		rows = width
	} else {
		columns = floor((window.innerWidth - 50) / size)
		rows = floor((window.innerHeight - 110) / size)
	}

	let mycanvas = createCanvas(size * columns, size * rows);
	mycanvas.parent("mycanvas");
	initMap()
	drawOnceHorriblePerf()
}

function initMap() {
	for (let i = 0; i < rows; i ++) {
		map[i] = new Uint8Array(columns)
	}
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			map[i][j] = floor(random(0, 2)) === 0 ? 1 : 0
			
		}
	}
}

function setup() {
	noLoop()
	frameRate(fr)
	stroke(gridColor)
	gen()
}


function draw() {
	updateNext()
	updateMap()
	drawMap()
	updateHud()
}

function drawMap() {
	next.forEach(n => {
		map[n[0]][n[1]] === 0 ? fill(emptyColor) : fill(fullColor)	
		rect(n[1] * size, n[0] * size, size-1, size-1);		
	})	
}



function drawOnceHorriblePerf() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			map[i][j] === 0 ? fill(emptyColor) : fill(fullColor)	
			stroke(gridColor)
			rect(j * size, i * size, size-1, size-1);		
		}
	}
}


function updateMap() {
	iterations++; 
	next.forEach(n => {
		map[n[0]][n[1]] = map[n[0]][n[1]] === 1 ? 0 : 1
	})
} 


//PROUT PROUT PROUTPROUT
function updateNext() {
	next = new Set();
	for (let i = 0; i< rows; i++) {
		for (let j = 0; j < columns; j++) {
			if (checkChange(i, j) === true) {
				next.add([i, j])
			} 
		}
	}

}


function checkChange(x, y) {
	let sum = 0;
	for (let i = -1; i < 2; i++) {
		for (let j = -1; j < 2; j++) {
			sum += map[(x + i + rows) % rows][(y + j + columns) % columns]
		}
	}
	sum -= map[x][y]
	newState = (((map[x][y] == 1) && (sum <  2)) || ((map[x][y] == 1) && (sum >  3))) ? 0 : ((map[x][y] == false) && (sum == 3)) ? 1 : map[x][y]
	return map[x][y] !== newState; 
}


function handleDraw() {
	next  = new Set()
	let pair = []
	pair[0] = floor(mouseY / size)
	pair[1] = floor(mouseX / size)

	if ((pair[0] >= 0 && mouseX <= columns * size) && (pair[1] >= 0 && mouseY <= rows * size)){
		if (justBeenSet[0] != pair[0] || justBeenSet[1] !== pair[1]) {
			next.add(pair)
			updateMap()
			drawMap()
			justBeenSet[0] = pair[0]
			justBeenSet[1] = pair[1]
		} 
	}
}


function eraseMap() {
	iterations = 0;
	next = new Set();
	if (started === false){
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < columns; j++) {
				if(map[i][j] === 1) {
					next.add([i, j])
				}
			}
		}
		updateMap();
		drawMap();
	} else {
		notify("warning", "Game still running", 4000)
	}
}

function fillMap() {
	iterations = 0;
	next = new Set();

	if (started === false) {
		iterations = 0
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < columns; j++) {
				if(map[i][j] === 0) {
					next.add([i, j])
				}
			}
		}
		updateMap();
		drawMap();
	} else {
		notify("warning", "Game still running", 4000)
	}

}

function resetMap(e) {
	iterations = 0;
	noLoop()
	started = false
	gen()
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
		iterations = 0;
		size = e.value
		gen()
		initMap();
	} else {
		notify("warning", "stop to apply", 4000)
	}
}

function boardSize(e) {
	if (started === false) {
		iterations = 0;
		gen(e.value)
		initMap();
	} else {
		notify("warning", "stop to apply", 4000)
	}
}

function changeFramerate(e) {
	frameRate(parseInt(e.value))
}

function canon() {
	isCool = true;
	whichCool = "drawCanon"
}

function canon1() {
	isCool = true;
	whichCool = "drawCanon1"
}

function revcanon() {
	isCool = true;
	whichCool = "drawReverseCanon"
}

function revcanon1() {
	isCool = true;
	whichCool = "drawReverseCanon1"
}

function ship() {
	isCool = true;
	whichCool = "drawShip"
}

function ship1() {
	isCool = true;
	whichCool = "drawShip1"
}


function revship() {
	isCool= true;
	whichCool = "drawRevShip"
}


function revship1() {
	isCool= true;
	whichCool = "drawRevShip1"
}


function swapColors() {
	emptyColor = emptyColor === "#2CFE02" ? "black" : "#2CFE02";
	fullColor = fullColor === "#2CFE02" ? "black" : "#2CFE02";
	drawOnceHorriblePerf()
}



function stepGame() {
	updateNext()
	updateMap()
	drawMap()
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

function drawCanon(x, y) {
	next = new Set()
	if(map[x + 8] !== undefined && map[x + 8][y + 35] !== undefined) {
		next.add([x, y + 24])
		next.add([x + 1, y + 22])
		next.add([x + 1, y + 24])
		next.add([x + 2, y + 20])
		next.add([x + 2, y + 21])
		next.add([x + 2, y + 34])
		next.add([x + 2, y + 35])
		next.add([x + 2, y + 13])
		next.add([x + 2, y + 12])
		next.add([x + 3, y + 20])
		next.add([x + 3, y + 21])
		next.add([x + 3, y + 34])
		next.add([x + 3, y + 35])
		next.add([x + 3, y + 15])
		next.add([x + 3, y + 11])
		next.add([x + 4, y + 0])
		next.add([x + 4, y + 1])
		next.add([x + 4, y + 10])
		next.add([x + 4, y + 16])
		next.add([x + 4, y + 20])
		next.add([x + 4, y + 21])
		next.add([x + 5, y + 0])
		next.add([x + 5, y + 1])
		next.add([x + 5, y + 10])
		next.add([x + 5, y + 14])
		next.add([x + 5, y + 16])
		next.add([x + 5, y + 17])
		next.add([x + 5, y + 22])
		next.add([x + 5, y + 24])
		next.add([x + 6, y + 10])
		next.add([x + 6, y + 16])
		next.add([x + 6, y + 24])
		next.add([x + 7, y + 11])
		next.add([x + 7, y + 15])
		next.add([x + 8, y + 12])
		next.add([x + 8, y + 13])
		updateMap()
		drawMap()		
	} else {
		notify("warning", "pas assez de place", 4000)
	}
	
}

function drawReverseCanon(x, y) {
	next = new Set()
	if(map[x - 8] !== undefined && map[x - 8][y - 35] !== undefined) {

		next.add([x, y - 24])
		next.add([x - 1, y - 22])
		next.add([x - 1, y - 24])
		next.add([x - 2, y - 20])
		next.add([x - 2, y - 21])
		next.add([x - 2, y - 34])
		next.add([x - 2, y - 35])
		next.add([x - 2, y - 13])
		next.add([x - 2, y - 12])
		next.add([x - 3, y - 20])
		next.add([x - 3, y - 21])
		next.add([x - 3, y - 34])
		next.add([x - 3, y - 35])
		next.add([x - 3, y - 15])
		next.add([x - 3, y - 11])
		next.add([x - 4, y - 0])
		next.add([x - 4, y - 1])
		next.add([x - 4, y - 10])
		next.add([x - 4, y - 16])
		next.add([x - 4, y - 20])
		next.add([x - 4, y - 21])
		next.add([x - 5, y - 0])
		next.add([x - 5, y - 1])
		next.add([x - 5, y - 10])
		next.add([x - 5, y - 14])
		next.add([x - 5, y - 16])
		next.add([x - 5, y - 17])
		next.add([x - 5, y - 22])
		next.add([x - 5, y - 24])
		next.add([x - 6, y - 10])
		next.add([x - 6, y - 16])
		next.add([x - 6, y - 24])
		next.add([x - 7, y - 11])
		next.add([x - 7, y - 15])
		next.add([x - 8, y - 12])
		next.add([x - 8, y - 13])
		updateMap()
		drawMap()	
	} else {
		notify("warning", "pas assez de place", 4000)
	}
	
}

function drawCanon1(x, y) {
	next = new Set()
	if(map[x + 8] !== undefined && map[x + 8][y - 35] !== undefined) {
		next.add([x, y - 24])
		next.add([x + 1, y - 22])
		next.add([x + 1, y - 24])
		next.add([x + 2, y - 20])
		next.add([x + 2, y - 21])
		next.add([x + 2, y - 34])
		next.add([x + 2, y - 35])
		next.add([x + 2, y - 13])
		next.add([x + 2, y - 12])
		next.add([x + 3, y - 20])
		next.add([x + 3, y - 21])
		next.add([x + 3, y - 34])
		next.add([x + 3, y - 35])
		next.add([x + 3, y - 15])
		next.add([x + 3, y - 11])
		next.add([x + 4, y - 0])
		next.add([x + 4, y - 1])
		next.add([x + 4, y - 10])
		next.add([x + 4, y - 16])
		next.add([x + 4, y - 20])
		next.add([x + 4, y - 21])
		next.add([x + 5, y - 0])
		next.add([x + 5, y - 1])
		next.add([x + 5, y - 10])
		next.add([x + 5, y - 14])
		next.add([x + 5, y - 16])
		next.add([x + 5, y - 17])
		next.add([x + 5, y - 22])
		next.add([x + 5, y - 24])
		next.add([x + 6, y - 10])
		next.add([x + 6, y - 16])
		next.add([x + 6, y - 24])
		next.add([x + 7, y - 11])
		next.add([x + 7, y - 15])
		next.add([x + 8, y - 12])
		next.add([x + 8, y - 13])
		updateMap()
		drawMap()	
	} else {
		notify("warning", "pas assez de place", 4000)
	}
}

function drawReverseCanon1(x, y) {
	next = new Set()
	if(map[x - 8] !== undefined && map[x - 8][y + 35] !== undefined) {

		next.add([x, y + 24])
		next.add([x - 1, y + 22])
		next.add([x - 1, y + 24])
		next.add([x - 2, y + 20])
		next.add([x - 2, y + 21])
		next.add([x - 2, y + 34])
		next.add([x - 2, y + 35])
		next.add([x - 2, y + 13])
		next.add([x - 2, y + 12])
		next.add([x - 3, y + 20])
		next.add([x - 3, y + 21])
		next.add([x - 3, y + 34])
		next.add([x - 3, y + 35])
		next.add([x - 3, y + 15])
		next.add([x - 3, y + 11])
		next.add([x - 4, y + 0])
		next.add([x - 4, y + 1])
		next.add([x - 4, y + 10])
		next.add([x - 4, y + 16])
		next.add([x - 4, y + 20])
		next.add([x - 4, y + 21])
		next.add([x - 5, y + 0])
		next.add([x - 5, y + 1])
		next.add([x - 5, y + 10])
		next.add([x - 5, y + 14])
		next.add([x - 5, y + 16])
		next.add([x - 5, y + 17])
		next.add([x - 5, y + 22])
		next.add([x - 5, y + 24])
		next.add([x - 6, y + 10])
		next.add([x - 6, y + 16])
		next.add([x - 6, y + 24])
		next.add([x - 7, y + 11])
		next.add([x - 7, y + 15])
		next.add([x - 8, y + 12])
		next.add([x - 8, y + 13])
		updateMap()
		drawMap()	
	} else {
		notify("warning", "pas assez de place", 4000)
	}
}

function drawShip(x, y) {
	next = new Set()
	next.add([x, y + 1])
	next.add([x + 1, y + 2])
	next.add([x + 2, y])
	next.add([x + 2, y + 1])
	next.add([x + 2, y + 2])
	updateMap()
	drawMap()	
}

function drawShip1(x, y) {
	next.add([x, y + 1])
	next.add([x - 1, y + 2])
	next.add([x - 2, y])
	next.add([x - 2, y + 1])
	next.add([x - 2, y + 2])
	updateMap()
	drawMap()	
}

function drawRevShip(x, y) {
	next.add([x, y - 1])
	next.add([x + 1, y - 2])
	next.add([x + 2, y])
	next.add([x + 2, y - 1])
	next.add([x + 2, y - 2])
	updateMap()
	drawMap()	
}

function drawRevShip1(x, y) {
	next.add([x, y - 1])
	next.add([x - 1, y - 2])
	next.add([x - 2, y])
	next.add([x - 2, y - 1])
	next.add([x - 2, y - 2])
	updateMap()
	drawMap()	
}

function debugmap(map) {
	for (let i = 0; i< rows; i++) {
		console.log(map[i])
		
	}	
}