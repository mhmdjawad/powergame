const makeCanvas = (w=0,h=0) => {
    let c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    c.ctx = c.getContext('2d');
    return c;
}
const getCtx = (canvas) => {
    return canvas.getContext('2d');
}
const drawOnCanvas = (canvas,img,x=0,y=0)=>{
    getCtx(canvas).drawImage(img,x,y);
}
const loadImage = (url,attr,callback)=>{
    var img = new Image();
    img.src = url;
    if(attr) {
        for(let i in attr){
            img[i] = attr[i];
        }
    }
    img.addEventListener('load',()=>{
        callback(img);
    });
}
const crop = (canvas,x,y,width,height)=>{
    let buffer = makeCanvas(width,height);
    let context = getCtx(buffer);
    context.drawImage(
        canvas,
        x,
        y,
        width,
        height,
        0,
        0,
        width,
        height);
    return buffer;
}
const resize = (img,w,h)=>{
    var nw = w;
    var nh = h;
    if(h == 0 || h == null){
        var ar = img.height/img.width;
        nw = w;
        nh = nw * ar;
    }
    else if (w == 0 || w == null){
        var ar = img.width/img.height;
        nh = h;
        nw = ar * nh;
    }
    var canvas = makeCanvas(nw,nh);
    getCtx(canvas).drawImage(img,0,0,nw,nh);
    return canvas;
}
const gridBG = (scale = 8)=>{
    var canvas = makeCanvas(scale,scale);
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0,0,scale,scale);
    ctx.clearRect(0,0,scale-1,scale-1);
    const base64Image = canvas.toDataURL();
    document.body.style.backgroundImage = `url(${base64Image})`;
}
const getColor = (r, g, b, a)=> {
    if(r+g+b+a == 0){
        return null;
    }
    else if(r+g+b == 0){
        return '#000000';
    }
    else if (r > 255 || g > 255 || b > 255){
        return '#000000';
    }
    return '#' + ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
}
const getColorMatrix = (canvas,changefct)=>{
    var context = getCtx(canvas);
    var width = canvas.width;
    var height = canvas.height;
    var imageData = context.getImageData(0, 0, width, height);
    var data = imageData.data;
    var colorMatrix = [];
    for (var i = 0; i < data.length; i += 4) {
        colorMatrix.push(
            getColor(
                data[i],
                data[i + 1],
                data[i + 2],
                data[i + 3]
                )
            );
    }
    var matrix = [];
    for(let i = 0 ; i < canvas.height;i++){matrix[i] = [];}
    let c = 0, r = 0;
    for(let i = 0 ; i < colorMatrix.length;i++){
        if(c >= canvas.width){r++;c=0}
        matrix[r][c] = colorMatrix[i];

        // if(r >= canvas.height) {c++;r = 0;}
        // matrix[r][c] = colorMatrix[i];
        
        
        if(changefct) matrix[r][c] = changefct(matrix[r][c]);
        // r++;
        c++;
    }
    return matrix;
}
const printRotated =(canvas,ctx,image,degree,x,y)=>{
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(degree); // degree degrees in radians Math.PI / 4 = 45
    // ctx.rotate(Math.PI / 4); // 45 degrees in radians
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.drawImage(image,x,y);
    ctx.restore();
}
const rotateCW = (image,times,passed = 0)=>{
    if(times >= 8) times -= 8;
    if(times <= 0 || times >= 8) {
        return image;
    }
    if(times < 0) times += 8;
    if(passed==0 && times%2 != 0){
        image = prepForRotate(image);
    }
    let buffer = makeCanvas(image.width,image.height);
    let context = getCtx(buffer);
    if(times % 2 == 0){
        context.setTransform(0,1,-1,0,image.width,0);
        context.drawImage(image,0,0);
        context.setTransform(1,0,0,1,0,0);
        return rotateCW(buffer,times-2,passed+2);
    }
    else{
        context.rotate(Math.PI/4);
        context.drawImage(image,image.width/4,-image.height/2);
        return rotateCW(buffer,times-1,passed++);
    }
}
const prepForRotate  = (image)=>{
    let d = Math.sqrt(image.width*image.width+image.height*image.height);
    let buffer = makeCanvas(d,d);
    let context = getCtx(buffer);
    context.drawImage(image,(d - image.width) /2,(d - image.height) /2);
    return buffer;
}
class FlotingImage{
    constructor(img,canvas,pos,velocity,speed){
        this.img = img;
        this.canvas = canvas;
        this.pos = pos;
        this.velocity = velocity;
        this.speed = speed;
        this.particles = [];
        this.hits=0;
    }
    update(){
        this.particles = this.particles.filter(x=> x.r < 30);
        this.particles.forEach(x=>x.update());
        this.pos.x += this.velocity.x*this.speed;
        this.pos.y += this.velocity.y*this.speed;
        if(this.pos.y < 0 || this.pos.y >= this.canvas.height-this.img.height){
            this.velocity.y *= -1;
            this.particles.push(new HitEffect(this.pos.x + this.img.width/2,this.pos.y + this.img.height/2));
            this.hits++;
        }
        if(this.pos.x < 0 || this.pos.x >= this.canvas.width-this.img.width){
            this.velocity.x *= -1;
            this.particles.push(new HitEffect(this.pos.x + this.img.width/2,this.pos.y + this.img.height/2));
            this.hits++;
        }
    }
    draw(ctx){
        ctx.drawImage(this.img,this.pos.x,this.pos.y);
        this.particles.forEach(x=>x.draw(ctx));
    }
}
class FlyingAnimation{
    constructor(container,img){
        var c = document.querySelector(container);
        var src = c.querySelector(`img`).src;
        loadImage(src,"",(img)=>{
            var resizedImage = resize(img,c.clientWidth,0);
            var resizedImage2 = resize(img,c.clientWidth/4,0);

            this.logo = resizedImage2;
            var nw = resizedImage.width;
            var nh = resizedImage.height;
            this.buffer = makeCanvas(nw,nh);
            this.canvas = makeCanvas(nw,nh);
            this.ctx = getCtx(this.canvas);
            this.ctx.drawImage(resizedImage2,0,0);
            c.innerHTML=``;
            // c.appendChild(this.canvas);
            this.objects = [];
            this.objects.push(new FlotingImage(this.logo,this.canvas,{x:0,y:0},{x:1,y:1},0.5));
            // this.objects.push(new FlotingImage(this.logo,this.canvas,{x:this.canvas.width-this.logo.width,y:0},{x:-1,y:-1},0.5));
            // this.objects.push(new FlotingImage(this.logo,this.canvas,{x:0,y:this.canvas.height-this.logo.height},{x:-1,y:-1},0.5));
            this.objects.push(new FlotingImage(this.logo,this.canvas,{x:this.canvas.width-this.logo.width,y:this.canvas.height-this.logo.height},{x:-1,y:-1},0.5));
            this.update(0);
        });
    }
    update(time){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.objects.forEach(x=>x.update(time));
        this.objects.forEach(x=>x.draw(this.ctx));
        try{
            var base64Image = this.canvas.toDataURL();
            document.body.style.backgroundImage = `url(${base64Image})`;
        }
        catch(e){}
        requestAnimationFrame((t)=>{this.update(t);});
    }
}
class HitEffect{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.r = 1;
        // this.r = 20;

    }
    randomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }
    update(t){
        this.r += 0.5;
    }
    draw(ctx){
        ctx.beginPath();
        for(let i = 0 ; i < this.r ; i+= 10){
            ctx.setLineDash([this.r,this.r]);
            ctx.fillStyle = this.randomColor() + '01';//'#ffffff22';
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.1;
            ctx.arc(this.x, this.y, i, 0, Math.PI * 2, false);
            ctx.stroke(); // Stroke the circle
            ctx.globalAlpha = 1;
        }
    }
}
class Animation{
    constructor(container){
        var c = document.querySelector(container);
        var img = c.querySelector("img");
        this.container = c;
        var src = img.src;
        this.colors = ["#000","","#fff"];
        loadImage(src,"",(img)=>{
            var w = c.clientWidth, h = c.clientHeight;
            var ar = img.height/img.width;
            var nw = w;
            var nh = nw * ar;
            this.logocanvas = makeCanvas(nw,nh);
            getCtx(this.logocanvas).drawImage(img,0,0,nw,nh);
            this.img = img;
            this.stepSize = parseInt(h/6);
            this.drawSize = this.stepSize;
            this.canvas = makeCanvas(w,h);
            this.buffercanvas = makeCanvas(w,h);
            this.ctx = getCtx(this.buffercanvas);
            this.mainCtx = getCtx(this.canvas);
            c.innerHTML = ``;
            c.appendChild(this.canvas);
            this.cx = 0;
            this.cy = 0;
            this.currentLayer=0;
            this.currentColor = 0;
            this.dir = "right";
            this.update(0);
        });
    }
    switchDir(){
        // console.log(this.dir,this.cx,this.cy);
        if(this.dir == "right"){
            this.cx += this.drawSize;
        }
        else if(this.dir == "down"){
            this.cy += this.drawSize;
        }
        else if(this.dir == "left"){
            this.cx -= this.drawSize;
        }
        else if(this.dir == "up"){
            this.cy -= this.drawSize;
        }
        if(this.dir == "right" && this.cx > this.canvas.width-this.drawSize *(this.currentLayer+1) ){
            this.cx = this.canvas.width-this.drawSize*(this.currentLayer+1);
            this.dir = "down";
        }
        else if(this.dir == "down" && this.cy > this.canvas.height-this.drawSize*(this.currentLayer+1)){
            this.cy = this.canvas.height-this.drawSize*(this.currentLayer+1);
            this.dir = "left";
        }
        else if(this.dir == "left" && this.cx < this.currentLayer * this.drawSize){
            this.cx = this.currentLayer * this.drawSize;
            this.dir = "up";
        }
        else if(this.dir == "up" && this.cy < this.currentLayer * this.drawSize){
            // this.currentLayer++;
            this.cy = this.currentLayer * this.drawSize;
            this.dir = "right";
        }
        if(this.currentLayer >= 3){
            this.currentLayer = 0;
            this.cy = 0 ;
            this.cx = 0;
            this.currentColor++;
            if(this.currentColor >= this.colors.length){
                this.currentColor = 0;
            }
        }
    }
    update(time){
        // time = parseInt(time/300);
        // console.log(time);
        if(this.time == time) return requestAnimationFrame((t)=>{this.update(t);});
        this.time = time;
        if(this.currentColor %2 == 0){
            this.ctx.fillStyle = this.colors[this.currentColor];
            this.ctx.fillRect(this.cx,this.cy,this.drawSize,this.drawSize);
        }
        else{
            this.ctx.clearRect(this.cx,this.cy,this.drawSize,this.drawSize);
        }
        this.mainCtx.clearRect(0,0,this.mainCtx.canvas.width,this.mainCtx.canvas.height);
        this.mainCtx.drawImage(this.logocanvas,0,0);
        this.mainCtx.drawImage(this.buffercanvas,0,0);
        this.mainCtx.fillStyle = "red";
        this.mainCtx.fillText(this.time,20,20);

        this.switchDir();
        requestAnimationFrame((t)=>{this.update(t);})
    }
}
class ParticleEffect{
    constructor(pos){
        this.r = 3;
        this.pos=pos;
    }
    randomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }
    update(t){
        this.r++;
    }
    draw(ctx){
        ctx.setLineDash([25,25]);
        ctx.fillStyle = this.randomColor() + '44';
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, false);
        ctx.stroke();
    }
}
class LineFlow{
    constructor(object,path){
        this.object = object;
        this.path = path;
        this.nextPt = 0;
        this.dest ={x:this.path[this.nextPt].x,y:this.path[this.nextPt].y};
        // this.pos ={x:this.dest.x,y:this.dest.y};
        this.pos ={x:0,y:0};
        this.speed = {x:1,y:1};
        this.track = [];
        this.particles = [];
        this.currentRotation = 0;
        this.sprites = [
            this.object,
            rotateCW(this.object,1),
            rotateCW(this.object,2),
            rotateCW(this.object,3),
            rotateCW(this.object,4),
            rotateCW(this.object,5),
            rotateCW(this.object,6),
            rotateCW(this.object,7),
        ]
        this.rotationtimeout = 100;
        this.fps = 3;
    }
    update(t){
        for(let f = 0 ; f < this.fps;f++){
            this.particles.forEach(x=>x.update(t));
            this.particles = this.particles.filter(x=>x.r < 5);
            if(parseInt(this.pos.x - this.dest.x) > 0) this.pos.x -= this.speed.x;
            if(parseInt(this.pos.x - this.dest.x) < 0) this.pos.x += this.speed.x;
            if(parseInt(this.pos.y - this.dest.y) > 0) this.pos.y -= this.speed.y;
            if(parseInt(this.pos.y - this.dest.y) < 0) this.pos.y += this.speed.y;
            if(parseInt(this.pos.x - this.dest.x) == 0 && parseInt(this.pos.y - this.dest.y) == 0){
                this.nextPt++;
                if(!this.path[this.nextPt]) this.nextPt = 0;
                this.dest = {x:this.path[this.nextPt].x,y:this.path[this.nextPt].y};
                // this.particles.push(new ParticleEffect({x:this.pos.x,y:this.pos.y}));
                // this.track.push({x:this.pos.x,y:this.pos.y});
            }
            this.rotationtimeout--;
            if(this.rotationtimeout <= 0){
                this.rotationtimeout = 100;
                this.currentRotation++;
                if(this.currentRotation >= this.sprites.length){
                    this.currentRotation = 0;
                }
            }
        }
    }
    draw(ctx){
        this.track.forEach(pos=>{
            ctx.fillRect(pos.x,pos.y,3,3);
        })
        this.particles.forEach(p=>{
            p.draw(ctx);
        })
        ctx.drawImage(this.sprites[this.currentRotation],this.pos.x,this.pos.y);
    }
}
class LetterByLetter{
    constructor(container){
        var c = document.querySelector(container);
        var src = c.querySelector(`img`).src;
        loadImage(src,"",(img)=>{
            this.init(c,img);
        });
    }
    handleMouseMove(){
        this.currentMousePos = {x:0,y:0}
        document.addEventListener("mousemove",(e)=>{
            this.currentMousePos = {
                x:e.clientX-this.canvas.offsetLeft + window.scrollX  - 56/2,
                y:e.clientY-this.canvas.offsetTop + window.scrollY - 52/2
            }
            this.objects.forEach(x=>x.updateDestination(this.currentMousePos));
        });
    }
    init(c,img){
        var resizedImage = resize(img,c.clientWidth,0);
        var Letter_B = crop(resizedImage,23,12,56,52);
        var Letter_P = crop(resizedImage,107,12,56,52);
        var Letter_A = crop(resizedImage,167,12,56,52);
        var Letter_L = crop(resizedImage,225,12,56,52);
        c.innerHTML = ``;
        this.objects = [];
        var wait = 0;
        var waitincrement = 900;
        this.objects.push(new MouseFollowingObject(Letter_B,wait,{x:0,y:0})); wait+= waitincrement;
        this.objects.push(new MouseFollowingObject(Letter_P,wait,{x:0,y:0})); wait+= waitincrement;
        this.objects.push(new MouseFollowingObject(Letter_A,wait,{x:0,y:0})); wait+= waitincrement;
        this.objects.push(new MouseFollowingObject(Letter_L,wait,{x:0,y:0})); wait+= waitincrement;
        this.objects.push(new MouseFollowingObject(Letter_B,wait,{x:0,y:0})); wait+= waitincrement;
        this.objects.push(new MouseFollowingObject(Letter_P,wait,{x:0,y:0})); wait+= waitincrement;
        this.objects.push(new MouseFollowingObject(Letter_A,wait,{x:0,y:0})); wait+= waitincrement;
        this.objects.push(new MouseFollowingObject(Letter_L,wait,{x:0,y:0})); wait+= waitincrement;
        this.objects.push(new MouseFollowingObject(Letter_B,wait,{x:0,y:0})); wait+= waitincrement;
        this.objects.push(new MouseFollowingObject(Letter_P,wait,{x:0,y:0})); wait+= waitincrement;
        this.objects.push(new MouseFollowingObject(Letter_A,wait,{x:0,y:0})); wait+= waitincrement;
        this.objects.push(new MouseFollowingObject(Letter_L,wait,{x:0,y:0})); wait+= waitincrement;
        this.canvas = makeCanvas(window.innerWidth-20,window.innerHeight-20);
        this.ctx = getCtx(this.canvas);
        document.body.append(this.canvas);
        this.handleMouseMove();
        this.update(0);
    }
    update(time){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.fillStyle = "red";
        // this.ctx.fillRect(this.currentMousePos.x-1,this.currentMousePos.y-1,3,3);
        this.objects.forEach(x=>x.update(time));
        this.objects.forEach(x=>x.draw(this.ctx));
        requestAnimationFrame((t)=>this.update(t));
    }
    init1(c,img){
        var resizedImage = resize(img,c.clientWidth,0);
        c.innerHTML = ``;
        var Letter_B = crop(resizedImage,23,12,56,52);
        var Letter_P = crop(resizedImage,107,12,56,52);
        var Letter_A = crop(resizedImage,167,12,56,52);
        var Letter_L = crop(resizedImage,225,12,56,52);
        this.canvas = makeCanvas(window.innerWidth*0.95,window.innerHeight*0.975);
        this.ctx = getCtx(this.canvas);
        document.body.append(this.canvas);
        this.pathpoints = [
            {x:20,y:20},
            {x:320,y:20},
            {x:320,y:320},
            {x:20,y:320},
        ];
        var rad = Math.min(this.canvas.width/2,this.canvas.height/2)/2 + 20;
        this.pathpoints = this.getPointsOnCircle(this.canvas.width/2,this.canvas.height/2,parseInt(rad),200);
        this.letters = [
            Letter_B,
            Letter_P,
            Letter_A,
            Letter_L,
            Letter_A,
            Letter_P,
            Letter_B,
            Letter_P,
            Letter_A,
            Letter_L,
            Letter_A,
            Letter_P,
            Letter_B,
            Letter_P,
            Letter_A,
            Letter_L,
            Letter_A,
            Letter_P,
            Letter_B,
            Letter_P,
            Letter_A,
            Letter_L,
        ];
        this.objects = [];
        this.timeout = 60;
        // this.curvepts = this.makeCurve();
        // console.log(this.curvepts);
        this.update(0);
    }
    update1(time){
        this.timeout--;
        if(this.timeout <= 0 && this.objects.length < this.letters.length){
            this.timeout = 60;
            this.objects.push(
                new LineFlow(this.letters[this.objects.length],this.pathpoints)
            )
        }
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.objects.forEach(x=>x.update(time));
        this.objects.forEach(x=>x.draw(this.ctx));
        requestAnimationFrame((t)=>this.update(t));
    }
    getCurvePoints(startX, startY, controlX, controlY, endX, endY, segments) {
        var points = [];
        for (var i = 0; i <= segments; i++) {
            var t = i / segments;
            var x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
            var y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;
            points.push({x: x, y: y});
        }
        return points;
    }
    makeCurve(){
        var startX = 0;
        var startY = 0;
        var controlX = 20;
        var controlY = 30;
        var endX = 40;
        var endY = 60;
        var segments = 20; // Number of segments to divide the curve
        var curvePoints = this.getCurvePoints(startX, startY, controlX, controlY, endX, endY, segments);
        return curvePoints;
    }
    getPointsOnCircle(cx, cy, radius, numPoints) {
        var points = [];
        var angleIncrement = (2 * Math.PI) / numPoints;
        for (var i = 0; i < numPoints; i++) {
            var angle = i * angleIncrement;
            var x = cx + radius * Math.cos(angle);
            var y = cy + radius * Math.sin(angle);
            points.push({x: x, y: y});
        }
        return points;
    }
}
class MouseFollowingObject{
    constructor(image, delay, pos){
        this.image = image;
        this.delay = delay;
        this.pos = {x:pos.x,y:pos.y};
        this.dest = {x:pos.x,y:pos.y};
        this.speed = 1;
        this.currentRotation=0;
        this.sprites = [
            image
        ];
    }
    updateDestination(pos){
        setTimeout(() => {
            this.dest = {x:pos.x,y:pos.y}
        }, this.delay);
    }
    update(time){
        if(parseInt(this.pos.x - this.dest.x) > 0) this.pos.x -= this.speed;
        if(parseInt(this.pos.x - this.dest.x) < 0) this.pos.x += this.speed;
        if(parseInt(this.pos.y - this.dest.y) > 0) this.pos.y -= this.speed;
        if(parseInt(this.pos.y - this.dest.y) < 0) this.pos.y += this.speed;
    }
    draw(ctx){
        ctx.drawImage(this.sprites[this.currentRotation],this.pos.x,this.pos.y);
    }
}
gridBG(8);
window.animate = new LetterByLetter(".logo");
// window.animate = new FlyingAnimation(".logo");