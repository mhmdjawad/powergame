import {DIRECTION,getDirection} from './gf.js';
export default class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    is(another){
        let x1 = this.x;
        let y1 = this.y;
        let x2 = another.x;
        let y2 = another.y;
        return (x1 == x2 && y1 == y2);
    }
    distanceTo(another){
        if(!another) return Infinity;
        let x1 = this.x;
        let y1 = this.y;
        let x2 = another.x;
        let y2 = another.y;
        if(x1 == x2 && y1 == y2) return 0;
        else if(x1 == x2) return Math.abs(y1-y2);
        else if(y1 == y2) return Math.abs(x1-x2);
        else{
            let distance = 0;
            distance += Math.pow((x1 - x2), 2);
            distance += Math.pow((y1 - y2), 2);
            distance = Math.sqrt(distance);
            return distance;
        }
    }
    getAngleTo(another){
        let x1 = this.x;
        let y1 = this.y;
        let x2 = another.x;
        let y2 = another.y;
        if(x1 == x2 && y1 == y2) return 0;
        else if(x1 == x2 && y1 > y2) return Math.PI * 0 / 4;  //moving up
        else if(y1 == y2 && x1 < x2) return Math.PI * 0 / 4;  //moving right
        else if(x1 == x2 && y1 < y2) return Math.PI * 0 / 4;  //moving down
        else if(y1 == y2 && x1 > x2) return Math.PI * 0 / 4;  //moving left             
        else if(x1 < x2  && y1 > y2) return Math.PI * 0 / 4;  //moving up right
        else if(x1 < x2  && y1 < y2) return Math.PI * 0 / 4;  //moving down right
        else if(x1 > x2  && y1 < y2) return Math.PI * 0 / 4;  //moving down left
        else if(x1 > x2  && y1 > y2) return Math.PI * 0 / 4;  //moving up left
        return 0;
    }
    getDirectionTo(another){
        let x1 = this.x;
        let y1 = this.y;
        let x2 = another.x;
        let y2 = another.y;
        if(x1 == x2 && y1 == y2) return DIRECTION.DOWN;
        if(x1 > x2) return DIRECTION.LEFT;
        else if(x1 < x2) return DIRECTION.RIGHT;
        else if(y1 < y2) return DIRECTION.DOWN;
        else if(y1 > y2) return DIRECTION.UP;
        else return DIRECTION.DOWN;
        // return getDirection(this.getAngleTo(another));
    }
    moveClone(direction,distance){
        let c = this.clone();
        c.move(direction,distance);
        return c;
    }
    move(direction,distance){
        if(direction == DIRECTION.UP){
            this.y -= distance;
        }
        else if(direction == DIRECTION.DOWN){
            this.y += distance;
        }
        else if(direction == DIRECTION.LEFT){
            this.x -= distance;
        }
        else if(direction == DIRECTION.RIGHT){
            this.x += distance;
        }
        else if(direction == DIRECTION.UPLEFT){
            this.y -= distance;
            this.x -= distance;
        }
        else if(direction == DIRECTION.UPRIGHT){
            this.y -= distance;
            this.x += distance;
        }
        else if(direction == DIRECTION.DOWNRIGHT){
            this.y += distance;
            this.x += distance;
        }
        else if(direction == DIRECTION.DOWNLEFT){
            this.y += distance;
            this.x -= distance;
        }
    }
    moveAngleClone(angle,distance){
        angle = angle - Math.PI/2;
        const deltaX = distance * Math.cos(angle);
        const deltaY = distance * Math.sin(angle);
        return new Point(this.x + deltaX,this.y + deltaY)
    }
    moveClone( direction,distance){
        let pt = this.clone();
        pt.move(direction,distance);
        return pt;
    }
    movetoward(obj,speed){
        let dx = obj.x - this.x;
        let dy = obj.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let vx = dx / distance || 0;
        let vy = dy / distance || 0;
        if (distance < speed) {
            this.x = obj.x;
            this.y = obj.y;
        } else {
            this.x += vx * speed;
            this.y += vy * speed;
        }
    }
    movetowardGrid(obj,speed){
        if(obj.x > this.x) {
            this.x += speed;
        }
        else if(obj.x < this.x) {
            this.x -= speed;
        }
        else if(obj.y < this.y) {
            this.y -= speed;
        }
        else if(obj.y > this.y) {
            this.y += speed;
        }
    }
    clone(){
        return new Point(this.x,this.y);
    }
    draw(ctx,color = "red"){
        ctx.fillStyle = color;
        this.drawCircle(ctx,3,color);
    }
    drawCircle(ctx,radius = 4,color = "green"){
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(
            this.x, 		//center x
            this.y, 		//center y
            radius,							//radius
            0,							//begin angle
            Math.PI * 2);				//end angle
        ctx.fill();
			//ctx.stroke();
    }
    static drawCircle(ctx,x,y,radius=1,color='green'){
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(
            x, 		//center x
            y, 		//center y
            radius,							//radius
            0,							//begin angle
            Math.PI * 2);				//end angle
        ctx.fill();
    }
}