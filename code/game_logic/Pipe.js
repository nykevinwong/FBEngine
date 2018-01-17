let GameObject = require('../game_engine/GameObject.js');
let PIXI = require("pixi.js");

class Pipe extends PIXI.Container {
	constructor(props){
		"use strict";
		super();

		this.checkCollisions = false;

		this.pipe1 = new GameObject(pipe_green_flipped, {tag:"Pipe"});
		this.pipe2 = new GameObject(pipe_green, {tag:"Pipe"});

		this.randomisePos();

		this.addChild(this.pipe1);
		this.addChild(this.pipe2);

		//this.orientation = Math.random() < 0.5 ? 0 : 1; // 0 == down to up, 1 == up to down
		this.tag = "Pipe";

		Object.assign(this,props);
	}

	onAdd(){
		"use strict";
	}

	physicsStep(){
		"use strict";
		return;
	}

	set x(val) {
		this.position.x = val;
	}

	set y(val) {
		this.position.y = val;
	}

	get x() {
		return this.position.x;
	}

	get y() {
		return this.position.y;
	}

	endStep(dt){
		"use strict";
		this.x -= Settings.GameSettings.moveSpeed;

		if(this.x < 0-pipe_green.width){
			this.x += (Settings.PIXI.applicationSettings.width * 2) + pipe_green.width + 20;
			this.randomisePos();
		}
	}

	randomisePos(){
		"use strict";
		let randomY = (Math.random() * Settings.GameSettings.pipes.chanceOffset) + Settings.GameSettings.pipes.offset;
		this.pipe1.y = 0;
		this.pipe2.y = Settings.PIXI.applicationSettings.height / 2;
		this.pipe1.y -= randomY;
		this.pipe2.y += randomY;
	}
}

module.exports = Pipe;