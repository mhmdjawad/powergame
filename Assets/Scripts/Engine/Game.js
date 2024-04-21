import * as gf from './gf.js';
import LoadingScene from './LoadingScene.js';
export default class Game{
    constructor(config){
        this.config = config;
        this.container = document.querySelector(config.container);
        this.eventManager = new EventManager(document);
        // this.aspect = gf.getAspectRatio(this.canvas.width,this.canvas.height);
        window.onresize = ()=>{
            this.windowresize();
        };
        this.windowresize();
        // ['keydown','keyup'].forEach(eventName => {
        //     document.addEventListener(eventName,event => {
        //         this.eventManager.fireEvent({ name: eventName,event: event});
        //     });
        // });
        // ['click','mousemove','mousedown','mouseup','contextmenu','touchstart','touchend','touchmove'].forEach(eventName => {
        //     document.body.addEventListener(eventName,event => {
        //         this.eventManager.fireEvent({ 
        //             name    : eventName,
        //             event   : event
        //         });
        //     });
        // });
        
        this.toLoadingScene();
        if(this.config.width < 400) {
            config.framerate = config.framerate/2;
        }
        this.Timer = new Timer(config.framerate, this, true);
    }
    windowresize(){
        // this.canvas.width = parseInt(window.innerWidth)*.98;
        // this.canvas.height = parseInt(window.innerHeight)*.98;
        // this.canvas.width = this.canvas.height = 600;
        // this.aspect = gf.getAspectRatio(this.canvas.width,this.canvas.height);
    }
    update(time) {
        if(this.Timer.p == false){
            this.time = time;
            this.framesPassedTillNow++;
            this.timeHMS = this.timeInHourFormat(time);
            if(this.scene){
                try{
                    this.scene.update(time);
                }
                catch(e){
                    document.body.innerHTML = e;
                    console.log(e);
                    this.Timer.stop();
                }
            }
            else{
                this.Timer.stop();
            }
        }
    }
    timeInHourFormat(seconds){
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        minutes = Math.floor(minutes % 60);
        seconds = Math.floor(seconds % 60);
        return `${hours < 10 ? '0' : ''}${hours}:`+
        `${minutes < 10 ? '0' : ''}${minutes}:`+
        `${seconds < 10 ? '0' : ''}${seconds}`;
    }
    toLoadingScene() {
        this.scene = new LoadingScene(this);
        this.eventManager.clear();
        this.eventManager.sub(this.scene);
	}
}
class Timer {
    constructor(deltatime = 1/30, t, autostart=false) {
        this.at = 0;
        this.lt = null;
        this.dt = deltatime;
        this.t = t;
        if(autostart) this.start();
        this.p = this.s = false;
    }
    fireOnce(){this.queue();this.s = true;}
    up(t){
        this.t.update(Math.floor(t/1000));
        this.lt = t;
        if(!this.s){this.queue();}
    }
    up2(t){
        if (this.lt) {this.at += (t - this.lt) / 1000 ;
            if (this.at > 1) {this.at = 1;}
            while (this.at > this.dt) {this.t.update(Math.floor(t/1000));this.at -= this.dt;break;}
        }
        this.lt = t;
        if(!this.s){this.queue();}
    }
    togglePause(){this.p = !this.p;}
    queue() {requestAnimationFrame((t) => {this.up2(t);})}
    start() {this.s = false;this.queue();}
    stop(){this.s = true;}
}
class EventManager{
    constructor(target){
		this.target = target;
        this.subscribers = [];
        if(!target.addEventListener) return false;
        return true;
    }
    sub(e){
        this.subscribers.push(e);
    }
    clear() {this.subscribers = [];}
	fireEvent(event) {
		var subscribers = this.subscribers;
		for (var i in subscribers) {
			if(subscribers[i].notify) subscribers[i].notify(event);
		}
	}
}