class G{
    static makeCanvas(w=0,h=0){
        let c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        c.ctx = c.getContext('2d');
        return c;
    }
    static fuseImage(canvas,canvas2,composite = 'source-atop'){
        let buffer = G.makeCanvas(canvas.width,canvas.height);
        let ctx = buffer.ctx;
        ctx.drawImage(canvas,0,0);
        ctx.globalCompositeOperation = composite;
        for(let i = 0 ; i < canvas.width/canvas2.width;i++){
            for(let j = 0 ; j < canvas.height/canvas2.height;j++){
                ctx.drawImage(canvas2,i * canvas2.width,j * canvas2.height);
            }
        }
        return buffer;
    }
    static getFontSprite(word,size,color,fuseImage,family = 'Arial',w=0,h=0){
        let ctx = G.makeCanvas(1, 1).ctx; // Create a temporary canvas context
        ctx.font = size + "px "+family;
        const textWidth = w || ctx.measureText(word).width || 1;
        const textHeight = h ||size+2; 
        let canvas = G.makeCanvas(parseInt(textWidth), textHeight);
        ctx = canvas.ctx;
        ctx.font = size + "px "+family;
        ctx.fillStyle = color;
        ctx.fillText(word,0, size-2);
        if (fuseImage) {
            canvas = G.fuseImage(canvas, fuseImage);
        }
        var c2 = G.makeCanvas(canvas.width,canvas.height);
        var cx2 = c2.ctx;
        cx2.fillStyle = '#ffffff';
        // cx2.fillRect(0,0,c2.width,c2.height);
        cx2.drawImage(canvas,0,0);
        return c2;
    }
    static centerTo(canvas,w,h){
        var c2 = G.makeCanvas(w,h);
        c2.ctx.drawImage(canvas,
            w/2 - canvas.width/2,
            h/2 - canvas.height/2,
            );
        return c2;
    }
    static gridBG(color1 = "lightgrey",color2 = null, scale = 8, width=1){
        var canvas = G.makeCanvas(scale,scale);
        var ctx = canvas.ctx;
        ctx.fillStyle = color1;
        ctx.fillRect(0,0,scale,scale);
        if(color2 == null){
            ctx.clearRect(0,0,scale-width,scale-width);
        }
        else{
            ctx.fillStyle = color2;
            ctx.fillRect(0,0,scale-width,scale-width);
        }
        return canvas;
        // const base64Image = canvas.toDataURL();
        // document.body.style.backgroundImage = `url(${base64Image})`;
    }
    static brickPattern(color1 = "#fff",color2 = "#000"){
        var canvas = G.makeCanvas(8,8);
        var ctx = canvas.ctx;

        ctx.fillStyle = color1;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.fillStyle = color2;

        ctx.fillRect(7,0,1,4);
        ctx.fillRect(0,3,8,1);
        ctx.fillRect(4,4,1,4);
        ctx.fillRect(0,7,8,1);

        return canvas;
    }
    static gridToFull(c,w,h,border = null, bg=null){
        var b = G.makeCanvas(w,h);
        var cw = c.width;
        var ch = c.height;
        if(bg!= null){
            b.ctx.fillStyle = bg;
            b.ctx.fillRect(0,0,b.width,b.height);
        }
        if(border!= null){
            b.ctx.fillStyle = border;
            b.ctx.fillRect(0,0,b.width,b.height);
            b.ctx.clearRect(1,1,b.width-2,b.height-2);
        }
        for(let i = 0 ; i < w/cw;i++){
            for(let j = 0 ; j < h/ch;j++){
                b.ctx.drawImage(c,i*cw,j*ch);
            }
        }
        return b;
    }
    static merge(list,w,h){
        var c = G.makeCanvas(w,h);
        for(let i in list){
            c.ctx.drawImage(list[i],0,0);
        }
        return c;
    }
    static rand (a=1, b=0){ return b + (a-b)*Math.random();}
    static randInt (a=1, b=0){ return G.rand(a,b)|0;}
    static randomColor() {return '#' + Math.floor(Math.random()*16777215).toString(16);}
    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Generate random index
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }
}
class DOM{
    static div(){
        return document.createElement('div');
    }
    static td(){
        return document.createElement('td');
    }
    static tr(tds){
        return document.createElement('tr');
    }
    static makeDom(html){
        var h = DOM.div();
        h.innerHTML = html;
        return h.firstChild;
    }
}
class Geometry{

    static GetLineEquation(p1,p2){
        let slope = (p2.y - p1.y) / (p2.x - p1.x);
        let yIntercept = p1.y - slope * p1.x;
        return { a: slope, b: yIntercept };
    }
    static MakeCircle(r,stroke = null,fill = null){
        var s = G.makeCanvas(r*2+2,r*2+2);
        var ctx = s.ctx;
        ctx.beginPath();
        ctx.arc(s.width/2,s.height/2,r,0,Math.PI * 2,false);
        if(stroke != null){ctx.strokeStyle = stroke;ctx.stroke();}
        if(fill != null){ctx.fillStyle = fill;ctx.fill();}
        return s;
    }
    static findSegmentCircleIntersections(p1, p2, o, r) {
        let intersections = [];
        // Extract coordinates of points and circle center
        let x1 = p1.x, y1 = p1.y;
        let x2 = p2.x, y2 = p2.y;
        let h = o.x, k = o.y;
        // Parametric equations of the line segment
        let dx = x2 - x1;
        let dy = y2 - y1;
        // Quadratic coefficients
        let A = dx * dx + dy * dy;
        let B = 2 * (dx * (x1 - h) + dy * (y1 - k));
        let C = (x1 - h) * (x1 - h) + (y1 - k) * (y1 - k) - r * r;
        // Calculate discriminant
        let discriminant = B * B - 4 * A * C;
        if (discriminant >= 0) {
            // Calculate values of t
            let t1 = (-B + Math.sqrt(discriminant)) / (2 * A);
            let t2 = (-B - Math.sqrt(discriminant)) / (2 * A);
            // Check if t1 and t2 are within [0, 1] and find intersection points
            if (t1 >= 0 && t1 <= 1) {
                intersections.push({ x: x1 + t1 * dx, y: y1 + t1 * dy });
            }
            if (t2 >= 0 && t2 <= 1) {
                intersections.push({ x: x1 + t2 * dx, y: y1 + t2 * dy });
            }
        }
        return intersections;
    }
    static Triangle(p1,p2,p3){
        console.log(p1,p2,p3);


        var x1 = p1.x; var y1 = p1.y;
        var x2 = p2.x; var y2 = p2.y;
        var x3 = p3.x; var y3 = p3.y;

        var minx = Math.min(x1,x2,x3);
        var maxx = Math.max(x1,x2,x3);

        var miny = Math.min(y1,y2,y3);
        var maxy = Math.max(y1,y2,y3);

        var s = G.makeCanvas(maxx - minx + 4 , maxy - miny + 4);
        var ctx = s.ctx;

        ctx.beginPath();
        ctx.moveTo(x1 - minx + 2 , y1 - miny + 2);
        ctx.lineTo(x2 - minx + 2 , y2 - miny + 2);
        ctx.lineTo(x3 - minx + 2 , y3 - miny + 2);
        ctx.lineTo(x1 - minx + 2 , y1 - miny + 2);
        ctx.stroke();


        return s;

    }
}


const color1 = '#fff';
const color2 = '#fff';
const color3 = '#fff';
const color4 = '#fff';
const color5 = '#000';
class Game{
    constructor(c){
        this.init(c);
    }
    init(c){
        var canvasW = 64*12;
        var canvasH = 64*12;
        this.canvas = G.makeCanvas(canvasW,canvasH);

        this.canvasCenter = {
            x: this.canvas.width/2,
            y: this.canvas.height/2,
        };
        this.circle = Geometry.MakeCircle(this.canvas.width/3,color5,null);
        this.cursor = Geometry.MakeCircle(3,null,`red`);
        document.body.append(this.cursor);

        this.canvas.style.border = "1px solid " + color5;
        this.ctx = this.canvas.getContext('2d');
        document.body.innerHTML = ``;
        this.layout = DOM.makeDom(`<div id=game><div id=gheader></div><div id=gbody ></div><div id=gfooter ></div></div>`);
        this.layout.querySelector('#gbody').append(this.canvas);
        this.layout.querySelector('#gheader').append(this.getHeader());
        document.body.append(this.layout);
        this.mousepos = {x:0,y:0};
        this.MakeEventListeners(0);
        this.update(0);
    }
    getHeader(){
        var html = `<table class=headerboard >
            <tr>
                <td id=header1></td>
                <td id=header2></td>
            </tr>
            </table>`;
        var table = DOM.makeDom(html);
        return table;
    }
    MakeEventListeners(){
        this.canvas.addEventListener('click',(e)=>{
            var rect = this.canvas.getBoundingClientRect();
            var x = e.clientX - rect.left + window.scrollX;
            var y = e.clientY - rect.top + window.scrollY;
            x = Math.floor(x);
            y = Math.floor(y);
            // var j = Math.floor(x / 66);
            // var i = Math.floor(y / 66);
            this.applyClick(x,y);
        });
    }
    applyClick(x,y){
        this.mousepos = {x:x,y:y};
        
        var line = Geometry.GetLineEquation(this.canvasCenter,this.mousepos);
        document.getElementById('header1').innerHTML = `y = ${line.a}x + ${line.b}`;


        this.intersections = Geometry.findSegmentCircleIntersections(this.canvasCenter,this.mousepos, this.canvasCenter, this.circle.width/2);
        console.log(this.intersections);

        // line y = ax +b
        // segment pt1, pt2
        // circle (center,radius)

        this.intersections.forEach(pt=>{
            this.triangle = Geometry.Triangle(this.canvasCenter, pt, {
                x: pt.x,
                y: this.canvasCenter.y
            });
            document.getElementById('gfooter').innerHTML = ``;
            document.getElementById('gfooter').append(this.triangle);
        })


    }
    update(time){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.drawImage(
            this.circle,
            this.canvasCenter.x - this.circle.width/2,
            this.canvasCenter.y - this.circle.height/2,
        );
        
        this.ctx.strokeStyle = "black";
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvasCenter.x,0);
        this.ctx.lineTo(this.canvasCenter.x,this.canvas.height);
        
        this.ctx.moveTo(0,this.canvasCenter.y);
        this.ctx.lineTo(this.canvas.width,this.canvasCenter.y);
        this.ctx.stroke();

        this.ctx.strokeStyle = "blue";
        
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvasCenter.x,this.canvasCenter.y);
        this.ctx.lineTo(this.mousepos.x,this.mousepos.y);
        this.ctx.stroke();

        this.ctx.drawImage(
            this.cursor,
            this.mousepos.x - this.cursor.width/2,
            this.mousepos.y - this.cursor.height/2,
        );


        if(this.intersections){
            this.intersections.forEach(pt=>{
                this.ctx.drawImage(
                    this.cursor,
                    pt.x - this.cursor.width/2,
                    pt.y - this.cursor.height/2,
                );
                this.ctx.beginPath();
                this.ctx.moveTo(pt.x,pt.y);
                this.ctx.lineTo(pt.x,this.canvasCenter.y);
                this.ctx.stroke();
                this.ctx.drawImage(
                    this.cursor,
                    pt.x - this.cursor.width/2,
                    this.canvasCenter.y - this.cursor.height/2,
                );
            });
        }


        requestAnimationFrame((t)=> this.update(t));
    }
}
document.addEventListener('DOMContentLoaded', function () {
    window.game = new Game("body");
}, false);