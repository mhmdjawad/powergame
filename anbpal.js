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
const rand = (a=1, b=0)=> b + (a-b)*Math.random();
const randInt = (a=1, b=0)=> rand(a,b)|0;
class FlotingImage{
    constructor(img,canvas,pos,velocity,speed){
        this.img = img;
        this.canvas = canvas;
        this.pos = pos;
        this.velocity = velocity;0
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
            this.hits++;
        }
        if(this.pos.x < 0 || this.pos.x >= this.canvas.width-this.img.width){
            this.velocity.x *= -1;
            this.hits++;
        }
    }
    draw(ctx){
        ctx.drawImage(this.img,this.pos.x,this.pos.y);
        this.particles.forEach(x=>x.draw(ctx));
    }
}
class FlyingAnimation{
    constructor(container){
        var c = document.querySelector(container);
        var src = c.querySelector(`img`).src;
        this.maxcount = 10;
        this.newLogoTime = 44;
        loadImage(src,"",(img)=>{
            var ww = window.innerWidth;
            var wh = window.innerHeight;
            this.resizedLogo = [
                resize(img,c.clientWidth/2,0),
                resize(img,c.clientWidth,0),
                resize(img,c.clientWidth/3,0),
                resize(img,c.clientWidth/4,0),
            ]
            var resizedImage2 = resize(img,c.clientWidth/2,0);
            this.logo = resizedImage2;
            this.canvas = makeCanvas(ww,wh);
            this.ctx = getCtx(this.canvas);
            this.ctx.drawImage(resizedImage2,0,0);
            this.objects = [];
            this.update(0);
        });
    }
    update(time){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.objects.forEach(x=>x.update(time));
        this.ctx.globalAlpha = 0.01;
        this.objects.forEach(x=>x.draw(this.ctx));
        if(this.objects.length < this.maxcount && this.newLogoTime <= 0){
            var startingx = this.canvas.width/2 - this.logo.width/2;
            var startingy = this.canvas.height/2 - this.logo.height/2;
            var startingvx = 1 * (Math.random() > 0.5 ? 1:-1) ;
            var startingvy = 1 * (Math.random() > 0.5 ? 1:-1) ;
            var logo = this.resizedLogo[randInt(0,this.resizedLogo.length)];
            this.objects.push(new FlotingImage(logo,this.canvas,{x:startingx,y:startingy},{x:startingvx,y:startingvy},0.41));
            this.currentcount++;
            this.newLogoTime = this.maxcount*10;
        }
        this.newLogoTime--;
        try{
            var base64Image = this.canvas.toDataURL();
            document.body.style.backgroundImage = `url(${base64Image})`;
        }
        catch(e){}
        requestAnimationFrame((t)=>{this.update(t);});
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // window.animate = new FlyingAnimation(".logoContainer");
}, false);
