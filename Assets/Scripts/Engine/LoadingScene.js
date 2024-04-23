import { Scene } from './Scene.js';
import * as gf from './gf.js';
import DomElementMaker from './DomElementMaker.js';

const Url_Battery = 'Assets/Images/battery.gif';
const Url_Lamp = 'Assets/Images/lamp.gif';
const Url_Risistor = 'Assets/Images/risistor.gif';

const LevelColors = ["crimson","green","#bbbbbb","aqua","#bbbbbb","violet","gold"];
const MAXBOXCount = 10000;
const STARTINGLEVEL = 32;
const MINLEVEL = STARTINGLEVEL/8;
const CELLSPERLEVEL = 2;
window.AttemptCount = 0;
window.CURBoxCount = 0;
class GridBox{
    constructor(w,h,x,y){
        CURBoxCount++;
        this.waiting = 0;
        this.w = w;
        this.level = 0;
        this.h = h;
        this.x=x;
        this.y=y;
        this.boxes = [];
        this.canvas = gf.makeCanvas(w,h);
        this.ctx = this.canvas.getContext("2d");
        var sprite = this.MakeTileSprite(w,h,LevelColors[this.level]);
        this.ctx.drawImage(sprite,0,0);
        this.loadingX = 0;
        this.loadingY = 0;
        this.loading = true;
        this.cellsper = CELLSPERLEVEL;
        this.nextSprite = this.MakeTileSprite(w/this.cellsper,h/this.cellsper,LevelColors[this.level+1]);
    }
    update(time){
        if(this.loading){
            for(let i = 0 ; i < Math.pow(this.level+1,2) ;i++){
                this.ctx.drawImage(this.nextSprite,this.loadingX,this.loadingY);
                this.loadingX += this.nextSprite.width;
                if(this.loadingX >= this.w){
                    this.loadingX = 0;
                    this.loadingY += this.nextSprite.height;
                }
                if(this.loadingY > this.h){
                    this.loadingX = 0;
                    this.loadingY = 0;
                    this.level++;
                    this.cellsper -= 2;
                    if(this.cellsper < 2) this.cellsper = 2;
                    var nextw = this.nextSprite.width/this.cellsper;
                    var nexth = this.nextSprite.height/this.cellsper;
                    this.nextSprite = this.MakeTileSprite(nextw,nexth,LevelColors[this.level+1]);
                    if(nextw == 4 || this.level >= MINLEVEL){
                        this.loading=false;
                        break;
                    }
                }
            }
        }
    }
    draw(ctx){
        ctx.drawImage(this.canvas,this.x,this.y);
    }
    MakeTileSprite(w,h,color){
        var c = gf.makeCanvas(w,h);
        var cx = c.getContext("2d");
        cx.fillStyle = "#d6d6d6";
        cx.fillRect(0,0,w,h);
        cx.fillStyle = color;
        cx.fillRect(0,0,w-1,h-1);
        return c;
    }
}
class AfterLoadingScene extends Scene{

}
export default class LoadingScene extends Scene{
    constructor(main){
        super(main);
        this.initialized = false;
        this.loading = true;
        this.preload();
    }
    preload(){
        document.body.style.overflow = "hidden";
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvascontext = this.canvas.getContext('2d');
        document.body.innerHTML = ``;
        document.body.appendChild(this.canvas);
        this.dim1 = STARTINGLEVEL;
        this.boxes = [];
        this.dict = [];
        this.loadingX = 0;
        this.loadingY = 0;
        this.factorX = Math.ceil(this.canvas.width / this.dim1);
        this.factorY = Math.ceil(this.canvas.height / this.dim1);
    }
    load(){
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
        this.main.eventManager.clear();
        this.main.eventManager.sub(this.main.scene);
    }
    update(time){
        this.time = time;

        this.boxes.forEach(x=>{
            x.update(time);
            x.draw(this.canvas.getContext('2d'));
        })
        if(this.loading == true){
            for(let i = 0 ; i < 10;i++){
                var box = new GridBox(this.dim1,this.dim1,this.loadingX,this.loadingY);
                this.boxes.push(box);
                this.loadingX += this.dim1;
                if(this.loadingX >= this.dim1 * this.factorX){
                    this.loadingX=0;
                    this.loadingY += this.dim1;
                }
                if(this.loadingY >= this.dim1 * this.factorY){
                    this.loading=false;
                }
            }
        }
        var loadingBoxes = this.boxes.filter(x=>x.loading == true);
        if(loadingBoxes.length==0) {
            const base64Image = this.canvas.toDataURL();
            document.body.style.backgroundImage = `url(${base64Image})`;
            // document.body.innerHTML = "done loading";
            console.log(`done loading`);
            this.main.scene = new AfterLoadingScene(this.main);
        }
    }
    draw(ctx){
    }
}