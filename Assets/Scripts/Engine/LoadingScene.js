import { Scene } from './Scene.js';
import * as gf from './gf.js';
import DomElementMaker from './DomElementMaker.js';

const Url_Battery = 'Assets/Images/battery.gif';
const Url_Lamp = 'Assets/Images/lamp.gif';
const Url_Risistor = 'Assets/Images/risistor.gif';

export default class LoadingScene extends Scene{
    constructor(main){
        super(main);
        this.initialized = false;
        gf.loadImage(Url_Battery,"",(batterydata)=>{
            this.battery = batterydata;
            gf.loadImage(Url_Lamp,"",(lampdata)=>{
                this.lamp = lampdata;
                gf.loadImage(Url_Risistor,"",(risistordata)=>{
                    this.risistor = risistordata;
                    this.imagesLoaded();
                })
            })
        })
        this.loading = 0;
    }
    
    imagesLoaded(){
        var scene = this;
        this.map = this.getMapCells(50,50,(td,e)=>{
            console.log(this,td,e);
            if(this.selectedItem){
                window.td = td;
                td.innerHTML = ``;
                var clone = gf.cloneCanvas(this.selectedItem);
                td.appendChild(clone);
            }
        });
        var trs = [];
        for(let i in this.map){
            var row = this.map[i];
            var tr = DomElementMaker.MakeTr(row, '');
            trs.push(tr);
        }
        
        this.nav = DomElementMaker.MakeDiv('Electricity Connect Game','nav');
        
        this.makeContainer();
        this.dash = DomElementMaker.MakeDiv('','dash');
        this.table = DomElementMaker.MakeTable(trs, "table_map");

        [this.battery,this.lamp,this.risistor].forEach(r=>{
            r.addEventListener('click',function(e){
                document.querySelectorAll('.dash canvas').forEach(e=>{
                    console.log("dash image",e);
                    if(e.classList.contains("selected")){
                        e.classList.remove("selected");
                    }
                })
                this.classList.add("selected");
                scene.selectedItem = this;
            })
        })
        this.dash.appendChild(this.battery);
        this.dash.appendChild(this.lamp);
        this.dash.appendChild(this.risistor);
        
        this.container.appendChild(this.table);
        document.body.appendChild(this.nav);
        document.body.appendChild(this.container);
        document.body.appendChild(this.dash);
    }
    makeContainer(){
        this.container = DomElementMaker.MakeDiv("","Container");
        this.container.addEventListener("mousedown",(e)=>{
            this.container.ismousedown = true;
            this.container.mouselocation = {
                x:e.clientX,
                y:e.clientY
            };
        })
        this.container.addEventListener("mouseup",(e)=>{
            this.container.ismousedown = false;
        })
        this.container.addEventListener("mousemove",(e)=>{
            if(this.container.ismousedown){
                var dx = this.container.mouselocation.x - e.clientX;
                var dy = this.container.mouselocation.y - e.clientY;
                this.container.scrollTop += dy;
                this.container.scrollLeft += dx;
                this.container.mouselocation = {
                    x:e.clientX,
                    y:e.clientY
                };
            }
        });
    }
    getMapCells(rows,cols,callback){
        var map = [];
        for(let row = 0 ; row < rows;row++){
            map[row] = [];
            for(let col = 0 ; col < cols;col++){
                map[row][col] = DomElementMaker.MakeTd(`<div></div>`,'td',function(e){
                    callback(this,e);
                });
            }
        }
        return map;
    }
    handleTdClick(e){
        console.log(e);
    }
    init(){
        // this.main.scene = new MainGameClass(this.main);
        this.main.eventManager.clear();
        this.main.eventManager.sub(this.main.scene);
    }
    update(time){
        this.time = time;
        // this.loading += 0.5;
        // this.init();
    }
    draw(ctx){
    }
}