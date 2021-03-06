let jsAnim = require('js-easing-functions');

const _ANIMUPDATERATE = 16;
const _COUNTERSTEP = 0.06;

let _activeAnimations = [];

class Easing {

	static get activeAnimations(){
		return _activeAnimations;
	}

	static set activeAnimations(_arr){
		_activeAnimations = _arr;
	}

	static _pushAnim(anim){
		Easing.activeAnimations.push(anim);
	}

	static _removeAnim(uid){
		for(let i in Easing.activeAnimations){
			if(Easing.activeAnimations[i].uid === uid){
				let arr = Easing.activeAnimations;
				arr.splice(i);
				Easing.activeAnimations = arr;
				return;
			}
		}
		console.warn("Anim %s not found!", uid);
	}

	/**
	 * Returns true if there's an issue with the parameters that would disrupt an animation
	 * @param obj
	 * @param targetPos
	 * @returns {boolean}
	 * @private
	 */
	static _checkParams(obj, targetPos){
		return (
			typeof obj.x === 'undefined' ||
			typeof obj.y === 'undefined' ||
			typeof targetPos !== 'object' ||
			typeof targetPos.x === 'undefined' ||
			typeof targetPos.y === 'undefined'
		);
	}

	/**
	 *
	 * @param obj
	 * @param targetPos
	 * @param [speed]
	 * @param [duration]
	 * @param [onComplete]
	 * @returns {Object}
	 * @private
	 */
	static _generateGenericAnim(obj, targetPos, speed, duration, onComplete){
		return {
			origX: obj ? obj.x : 0,
			origY: obj ? obj.y : 0,
			targetPos: targetPos ? targetPos : {x: 0, y: 0},
			obj: obj ? obj : null,
			speed: speed ? speed : 1.0,
			counter: 0,
			duration: duration ? duration : null,
			uid: Math.random().toString().substring(2),
			interval: null,
			onComplete: onComplete ? onComplete : ()=>{}
		};
	}

	static _cleanupAnim(anim){
		clearInterval(anim.interval);
		Easing._removeAnim(anim.uid);
		anim.onComplete();
	}

    /**
     * Behaves differently to other animations in that it does not possess a duration
     * @param {Object} obj
     * @param {Object} targetPos
     * @param {Number} [speed]
     * @param {Function} [onComplete]
     * @returns {Function}
     */
    static async lerpAsync( obj, targetPos, speed, onComplete ){
        if(Easing._checkParams(obj, targetPos)){
            throw new Error("Invalid object passed!");
        }

		    let anim = Easing._generateGenericAnim(obj, targetPos, speed, null, onComplete);
        anim.type = "lerp";

        anim.interval = setInterval(()=>{
            anim.obj.x = Easing.lerp(anim.origX, anim.targetPos.x, anim.counter);
			      anim.obj.y = Easing.lerp(anim.origY, anim.targetPos.y, anim.counter);

            anim.counter += _COUNTERSTEP * anim.speed;
            anim.counter += 0.06 * anim.speed;
            if(anim.counter >= 1.0) anim.counter = 1.0;
            obj.x = lerp(anim.origX, anim.targetPos.x, anim.counter);
            obj.y = lerp(anim.origY, anim.targetPos.y, anim.counter);

            if(anim.counter >= 1.0){
                anim.obj.x = anim.targetPos.x;
                anim.obj.y = anim.targetPos.y;
                clearInterval(anim.interval);
                if(anim.onComplete)
                    anim.onComplete();
            }
        }, 16);

        return anim;
    }

	/**
	 *
	 * @param {Object} obj
	 * @param {Object} targetPos
	 * @param {Number} [speed]
	 * @param {Number} [duration]
	 * @param {Function} [onComplete]
	 * @returns {void}
	 */
	static async easeInBounceAsync( obj, targetPos, speed, duration, onComplete ){
		if(Easing._checkParams(obj, targetPos)){
			throw new Error("Invalid object passed!");
		}

		let anim = Easing._generateGenericAnim(obj, targetPos, speed, duration, onComplete);
		anim.type = "easeInBounce";
		anim.startTime = Date.now();

		anim.interval = setInterval(()=>{
			anim.obj.x = jsAnim.easeInBounce( Date.now() - anim.startTime, anim.origX, anim.targetPos.x - anim.origX, anim.duration);
			anim.obj.y = jsAnim.easeInBounce( Date.now() - anim.startTime, anim.origY, anim.targetPos.y - anim.origY, anim.duration);

			if(Date.now() - anim.startTime >= anim.duration){
				anim.obj.x = anim.targetPos.x;
				anim.obj.y = anim.targetPos.y;
				Easing._cleanupAnim(anim);
			}
		}, _ANIMUPDATERATE);

		Easing._pushAnim(anim);

		return anim;
	}

	/**
	 *
	 * @param {Object} obj
	 * @param {Object} targetPos
	 * @param {Number} [speed]
	 * @param {Number} [duration]
	 * @param {Function} [onComplete]
	 * @returns {void}
	 */
	static async easeOutBounceAsync( obj, targetPos, speed, duration, onComplete ){
		if(Easing._checkParams(obj, targetPos)){
			throw new Error("Invalid object passed!");
		}

		let anim = Easing._generateGenericAnim(obj, targetPos, speed, duration, onComplete);
		anim.type = "easeOutBounce";
		anim.startTime = Date.now();

		anim.interval = setInterval(()=>{
			anim.obj.x = jsAnim.easeOutBounce( Date.now() - anim.startTime, anim.origX, anim.targetPos.x - anim.origX, anim.duration);
			anim.obj.y = jsAnim.easeOutBounce( Date.now() - anim.startTime, anim.origY, anim.targetPos.y - anim.origY, anim.duration);

			if(Date.now() - anim.startTime >= anim.duration){
				anim.obj.x = anim.targetPos.x;
				anim.obj.y = anim.targetPos.y;
				Easing._cleanupAnim(anim);
			}
		}, _ANIMUPDATERATE);

		Easing._pushAnim(anim);

		return anim;
	}

	/**
	 *
	 * @param {Object} obj
	 * @param {Object} targetPos
	 * @param {Number} [speed]
	 * @param {Number} [duration]
	 * @param {Function} [onComplete]
	 * @returns {void}
	 */
	static async easeInQuadAsync( obj, targetPos, speed, duration, onComplete ){
		if(Easing._checkParams(obj, targetPos)){
			throw new Error("Invalid object passed!");
		}

		let anim = Easing._generateGenericAnim(obj, targetPos, speed, duration, onComplete);
		anim.type = "easeInQuad";
		anim.startTime = Date.now();

		anim.interval = setInterval(()=>{
			anim.obj.x = jsAnim.easeInQuad( Date.now() - anim.startTime, anim.origX, anim.targetPos.x - anim.origX, anim.duration);
			anim.obj.y = jsAnim.easeInQuad( Date.now() - anim.startTime, anim.origY, anim.targetPos.y - anim.origY, anim.duration);

			if(Date.now() - anim.startTime >= anim.duration){
				anim.obj.x = anim.targetPos.x;
				anim.obj.y = anim.targetPos.y;
				Easing._cleanupAnim(anim);
			}
		}, _ANIMUPDATERATE);

		Easing._pushAnim(anim);

		return anim;
	}

	/**
	 *
	 * @param {Object} obj
	 * @param {Object} targetPos
	 * @param {Number} [speed]
	 * @param {Number} [duration]
	 * @param {Function} [onComplete]
	 * @returns {void}
	 */
	static async easeOutQuadAsync( obj, targetPos, speed, duration, onComplete ){
		if(Easing._checkParams(obj, targetPos)){
			throw new Error("Invalid object passed!");
		}

		let anim = Easing._generateGenericAnim(obj, targetPos, speed, duration, onComplete);
		anim.type = "easeOutQuad";
		anim.startTime = Date.now();

		anim.interval = setInterval(()=>{
			anim.obj.x = jsAnim.easeOutQuad( Date.now() - anim.startTime, anim.origX, anim.targetPos.x - anim.origX, anim.duration);
			anim.obj.y = jsAnim.easeOutQuad( Date.now() - anim.startTime, anim.origY, anim.targetPos.y - anim.origY, anim.duration);

			if(Date.now() - anim.startTime >= anim.duration){
				anim.obj.x = anim.targetPos.x;
				anim.obj.y = anim.targetPos.y;
				Easing._cleanupAnim(anim);
			}
		}, _ANIMUPDATERATE);

		Easing._pushAnim(anim);
	}

	static lerp( start, end, progress){
		return start*(1-progress)+end*progress;
	}

}

module.exports = Easing;