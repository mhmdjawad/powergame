class E{
    constructor(){
        this.Objects = [];
    }
    notify(e){
        this.Objects.forEach(x=> { if(x.notify) x.notify(e); });
        switch(e.name){
            case 'click' :          return !this.click ? null : this.click(e.event);
            case 'touchstart' :     return !this.touchstart ? null : this.touchstart(e.event);
            case 'touchend' :       return !this.touchend ? null : this.touchend(e.event);
            case 'touchmove' :      return !this.touchmove ? null : this.touchmove(e.event);
            case 'mousedown' :      return !this.mousedown ? null : this.mousedown(e.event);
            case 'mouseup' :        return !this.mouseup ? null : this.mouseup(e.event);
            case 'mousemove' :      return !this.mousemove ? null : this.mousemove(e.event);
            case 'contextmenu' :    return !this.contextmenu ? null : this.contextmenu(e.event);
            case 'keydown' :        return !this.keydown ? null : this.keydown(e.event);
            case 'keyup' :          return !this.keyup ? null : this.keyup(e.event);
        }
    }
    getTouchXY(e){
        return {
            x: e.changedTouches[0].pageX ,//- this.main.canvas.getBoundingClientRect().left,
            y: e.changedTouches[0].pageY ,//- this.main.canvas.getBoundingClientRect().top
        }
    }
    // Handletouchmousedown(){}
    // Handletouchmouseup(){}
    // Handletouchmousemove(){}
    touchstart(e){var pt = this.getTouchXY(e);if(this.Handletouchmousedown) this.Handletouchmousedown(pt.x, pt.y,e);}
    touchend(e){var pt = this.getTouchXY(e);if(this.Handletouchmouseup) this.Handletouchmouseup(pt.x, pt.y,e);}
    touchmove(e){var pt = this.getTouchXY(e);if(this.Handletouchmousemove) this.Handletouchmousemove(pt.x, pt.y,e);}
    
    mousedown(e){if(this.Handletouchmousedown) this.Handletouchmousedown(e.offsetX,e.offsetY,e);}
    mouseup(e){if(this.Handletouchmouseup) this.Handletouchmouseup(e.offsetX,e.offsetY,e);}
    mousemove(e){ if(this.Handletouchmousemove)this.Handletouchmousemove(e.offsetX,e.offsetY,e);}
    
    contextmenu(e){e.preventDefault();}
}
class Scene extends E{
    constructor(main){
        super();
        this.main = main;
        this.Objects = [];
    }
    update(time){
        this.time = time;
        [...this.Objects].forEach(obj=>{
            if(obj.update) obj.update(time);
        });
        this.Objects = this.Objects.filter(x=> !x.delete);
    }
    draw(ctx,clearcolor = 'black'){
        // ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        // ctx.fillStyle = clearcolor;
        // ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
        // [...this.Objects].forEach(obj=>{
            // if(obj.draw) obj.draw(ctx);
        // });
    }   
}
export {Scene}