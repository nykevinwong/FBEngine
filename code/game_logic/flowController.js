

let FlowController = function(){
	this.finishedLoading = false;
	this.game = null;

	this.currentAction = this.main;
};

FlowController.prototype.main = function(){
	"use strict";
	// ENTRY POINT
	console.log("main");
	this.currentAction = this.startLoading;
};

FlowController.prototype.startLoading = function(){
	"use strict";
	console.log("startLoading");

	let self = this;
	let length = Object.keys(Settings.resources).length;
	this.loadingProgress = 0;

	if(length === 0){
		this.finishedLoading = true;
		this.currentAction = this.showSplashScreen;
		return;
	}

	PIXI.loader.onLoad.add((file, res) => {
		console.log("Loaded resource: " + res.url);
	});
	PIXI.loader.onError.add((err) => {
		throw new Error("Failed to load file! " + err.stack);
	});

	let firstPromise;
	let currPromise;
	for(let k in Settings.resources){
		if(!Settings.resources.hasOwnProperty(k)) continue;

		if(!firstPromise){
			firstPromise = PIXI.loader.add(k, "assets/" + Settings.resources[k]);
			currPromise = firstPromise;
			continue;
		}

		currPromise = currPromise.add(k, Settings.resources[k]);
	}

	PIXI.loader.load(function(loader, resources){
		for(let k in resources){
			if(resources.hasOwnProperty(k)){
				global[k] = resources[k].texture;
			}
		}
		self.finishedLoading = true;
	});

	this.currentAction = this.waitForLoading;
};

FlowController.prototype.waitForLoading = function(){
	"use strict";
	console.log("waitForLoading");

	if(PIXI.loader.progress === 100 && this.finishedLoading === true) {
		this.currentAction = this.showSplashScreen;
	} else {
		return;
	}
};

FlowController.prototype.showSplashScreen = function(){
	"use strict";
	console.log("showSplashScreen");
	this.currentAction = this.showMainMenu;
};

FlowController.prototype.showMainMenu = function(){
	"use strict";
	console.log("showMainMenu");
	this.currentAction = this.enterGame;
};

FlowController.prototype.enterGame = function(){
	"use strict";
	console.log("enterGame");
	this.game = new Settings.flowSettings.inGame();
	AddToken(this.game);
	this.currentAction = this.inGame;
};

FlowController.prototype.inGame = function(){
	"use strict";
	// woop
};

module.exports = new FlowController();