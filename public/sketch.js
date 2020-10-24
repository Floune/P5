let total = 200;
let velocity = 1;
let spring = 0.05;
let gravity = 0.03;
let friction = -0.9;
let ants = [];
let diam = 30;


document.querySelector("#reset").addEventListener("click", e => {
		let newTot = document.querySelector("#total").value * 10
		let newDiam = document.querySelector("#diam").value * 10
		let newSpeed = document.querySelector("#speed").value
		total = newTot
		diam = newDiam
		velocity = newSpeed
		updateAnts(newTot);
		init()
})


function setup() {
	createCanvas(window.innerWidth, window.innerHeight);	
	updateAnts(total)
}

function draw() {
	background(0);

	ants.forEach(ant => {
		ant.collide();
		ant.move();
		ant.display();
	});


}

function updateAnts(newTot) {
	console.log(ants)
	ants.length = 0;
	ants = []
	console.log(ants)
	
	for (let i = 0; i < newTot; i++) {
		ants[i] = new Ball(
			random(width),
			random(height),
			diam,
			i,
			ants,
			Math.random() < 0.5 ? "red" : "blue",
			);
	}
}

class Ball {
	constructor(xin, yin, din, idin, oin, team) {
		this.team = team;
		this.x = xin;
		this.y = yin;
		this.vx = Math.random() < 0.5 ? velocity * -1 : velocity;
		this.vy = Math.random() < 0.5 ? velocity * -1 : velocity;
		this.diameter = din;
		this.id = idin;
		this.others = oin;
	}

	fight(enemy) {
		this.team = Math.random() < 0.5 ? this.team : enemy.team;
	}

	collide() {
		for (let i = this.id + 1; i < total; i++) {
			let dx = this.others[i].x - this.x;
			let dy = this.others[i].y - this.y;
			let distance = sqrt(dx * dx + dy * dy);
			let minDist = this.others[i].diameter / 2 + this.diameter / 2;
			if (distance < minDist) {
				this.fight(this.others[i]);
				let angle = atan2(dy, dx);
				let targetX = this.x + cos(angle) * minDist;
				let targetY = this.y + sin(angle) * minDist;
				let ax = (targetX - this.others[i].x) * spring;
				let ay = (targetY - this.others[i].y) * spring;
				this.vx -= ax;
				this.vy -= ay;
				this.others[i].vx += ax;
				this.others[i].vy += ay;
			}
			if (this.x < this.diameter / 2) {
				this.vx = velocity;
			}
			if (this.x > window.innerWidth - this.diameter / 2) {
				this.vx = velocity * -1;
			}
			if (this.y < 15 ) {
				this.vy  = velocity;
			}
			if (this.y > window.innerHeight - this.diameter / 2) {
				this.vy = velocity * -1;
			}

		}
	}

	move() {
		this.x += this.vx;
		this.y += this.vy;
	}

	display() {
		fill(this.team);
		ellipse(this.x, this.y, this.diameter, this.diameter);
	}
}