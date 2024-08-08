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
    static fullGridBg(color1 = "lightgrey",color2 = null, scale = 8,w = 1,h = 1,border = null, bg=null){
        var c = G.gridBG(color1,color2,scale,1);
        return G.gridToFull(c,w,h,border,bg);
    }
    static repeatCanvas(canvas,r,c=0){
        if(c == 0 ) c = r;
        var buffer = G.makeCanvas(canvas.width * c, canvas.height*r);
            for(let i = 0 ; i < r;i++){
                for(let j = 0 ; j < c;j++){
                    buffer.ctx.drawImage(canvas, j*canvas.width, i*canvas.height);
                }
            }
            return buffer;
    }
    static brickPattern(color1 = "#fff",color2 = "#000", r = 1){
        var canvas = G.makeCanvas(8,8);
        var ctx = canvas.ctx;
        ctx.fillStyle = color1;
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = color2;
        ctx.fillRect(7,0,1,4);
        ctx.fillRect(0,3,8,1);
        ctx.fillRect(4,4,1,4);
        ctx.fillRect(0,7,8,1);
        if(r > 1){
            return G.repeatCanvas(canvas,r,r);
        }
        return canvas;
    }
    static randomPattern(color1,color2,bias = 0.3,w=8,h=8){
        var canvas = G.makeCanvas(w,h);
        var ctx = canvas.ctx;
        ctx.fillStyle = color1;
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = color2;
        for(let i = 0 ; i < h ; i ++){
            for(let j = 0 ; j < w ; j++){
                if(Math.random() < bias) ctx.fillRect(i,j,1,1);
            }
        }
        return canvas;
    }
    static getDistance(p1,p2){
        let distance = 0;
        distance += Math.pow((p1.x - p2.x), 2);
        distance += Math.pow((p1.y - p2.y), 2);
        distance = Math.sqrt(distance);
        return distance;
    }
    static merge(list,w,h){
        var c = G.makeCanvas(w,h);
        for(let i in list){
            c.ctx.drawImage(list[i],
                0,
                0
            );
        }
        return c;
    }
    static mergeCentered(list,w,h){
        var c = G.makeCanvas(w,h);
        list.forEach(img => {
            // Calculate the position to center the image on the canvas
            const x = (w - img.width) / 2;
            const y = (h - img.height) / 2;
            c.ctx.drawImage(img, x, y);
        });
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
    static loadImage(url,attr,callback){
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
    static imgToCanvas(img){
        var c = G.makeCanvas(img.width,img.height);
        c.ctx.drawImage(img,0,0);
        return c;
    }
    static prepForRotate(image){
        let d = Math.sqrt( Math.pow(image.width,2)+Math.pow(image.height,2));
        let buffer = G.makeCanvas(d,d);
        buffer.ctx.drawImage(image,(d - image.width) /2,(d - image.height) /2);
        
        buffer.ctx.lineWidth = 4;
        buffer.ctx.moveTo(0,0);
        buffer.ctx.lineTo(d,0);
        buffer.ctx.lineTo(d,d);
        buffer.ctx.lineTo(0,d);
        buffer.ctx.lineTo(0,0);
        // buffer.ctx.stroke();
        return buffer;
    }
    static rotateCanvas(image,deg){
        if(deg % 90 != 0) image = G.prepForRotate(image);
        this.canvas = G.makeCanvas(image.width,image.height);
        this.ctx = this.canvas.ctx;
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate(deg * Math.PI / 180);
        this.ctx.drawImage(image, -image.width / 2, -image.height / 2);
        this.ctx.restore();
        return this.canvas;
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
    static getVertex(center,radius,sides,index) {
        var angle = 2 * Math.PI / sides * index;
        var x = center.x + radius * Math.cos(angle);
        var y = center.y + radius * Math.sin(angle);
        return {x,y};
    }
    static rotatePoint(center, point, angle) {
        if(angle == 0) return point;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        return {
            x: center.x + (point.x - center.x) * cosA - (point.y - center.x) * sinA,
            y: center.y + (point.x - center.y) * sinA + (point.y - center.y) * cosA
        };
    }
    static getColor(r, g, b, a){
        if(r+g+b+a == 0){return null;}
        else if(r+g+b == 0){return '#000000';}
        else if (r > 255 || g > 255 || b > 255){return '#000000';}
        return '#' + ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
    }
    static getColorMatrix (canvas,changefct){
        var context = canvas.getContext('2d');
        var width = canvas.width;
        var height = canvas.height;
        var imageData = context.getImageData(0, 0, width, height);
        var data = imageData.data;
        var colorMatrix = [];
        for (var i = 0; i < data.length; i += 4) {
            colorMatrix.push(
                G.getColor(
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
            if(changefct) matrix[r][c] = changefct(matrix[r][c]);
            c++;
        }
        return matrix;
    }
    static colorsMatrixToSprite(matrix,scale = 1,deform = null){
        let height = matrix.length;
        let width = Math.max(...matrix.map((row)=> row.length));
        var buffer = G.makeCanvas(width * scale,height* scale);
        var ctx = buffer.ctx;
        for(let i = 0 ; i < height;i++){
            for(let j = 0 ; j < width;j++){
                var color = matrix[i][j];
                if(deform) color = deform(color);
                if(!color || color == '') continue;
                ctx.fillStyle = color;
                ctx.fillRect(j*scale,i*scale,scale,scale);
            }
        }
        return buffer;
    }
    static crop(canvas,x,y,width,height){
        let buffer = G.makeCanvas(width,height);
        buffer.ctx.drawImage(canvas,x,y,width,height,0,0,width,height);
        return buffer;
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
class SpriteSheet{
    constructor(img){
        var imgCanvas = G.imgToCanvas(img);
        var mat = G.getColorMatrix(imgCanvas,(r)=>{
            if(r == '') return null;
            if(r == '#fff') return null;
            if(r == '#ffffff') return null;
            return r;
        });
        var cvs = G.colorsMatrixToSprite(mat,1);
        var gridBg = G.gridBG('#fff',null,32,1);
        var fullBg = G.gridToFull(gridBg,cvs.width,cvs.height);
        var combined = G.merge([fullBg,cvs],cvs.width,cvs.height);

        this.greyTanks = [];
        for(let i = 0 ; i < 6 ; i++){
            this.greyTanks.push(G.crop(cvs,i*32,64,32,32));
        }
        this.yellowTanks = [];
        for(let i = 0 ; i < 6 ; i++){
            this.yellowTanks.push(G.crop(cvs,i*32,96,32,32));
        }
        // this.greyTanks.forEach(x=>{document.body.append(x);})
        // this.yellowTanks.forEach(x=>{document.body.append(x);})
        // document.body.append(combined);
    }
    getTank(level){
       return this.greyTanks[level]; 
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
        var padding = 30;

        var x1 = p1.x; var y1 = p1.y;
        var x2 = p2.x; var y2 = p2.y;
        var x3 = p3.x; var y3 = p3.y;

        var minx = Math.min(x1,x2,x3);
        var maxx = Math.max(x1,x2,x3);

        var miny = Math.min(y1,y2,y3);
        var maxy = Math.max(y1,y2,y3);

        var s = G.makeCanvas(maxx - minx + padding , maxy - miny + padding);
        var ctx = s.ctx;

        ctx.beginPath();
        ctx.moveTo(x1 - minx + padding/2 , y1 - miny + padding/2);
        ctx.lineTo(x2 - minx + padding/2 , y2 - miny + padding/2);
        ctx.lineTo(x3 - minx + padding/2 , y3 - miny + padding/2);
        ctx.lineTo(x1 - minx + padding/2 , y1 - miny + padding/2);
        ctx.stroke();
        

        // label points

        ctx.fillText('A', x1 - minx + padding/4,y1 - miny + padding/4 );
        ctx.fillText('B', x2 - minx + padding/4,y2 - miny + padding/4 );
        ctx.fillText('C', x3 - minx + padding/4,y3 - miny + padding/4 );

        //draw Lengths 
        var l12 = Geometry.getLength(p1,p2);
        var l13 = Geometry.getLength(p1,p3);
        var l23 = Geometry.getLength(p2,p3);

        var mp12 = Geometry.getMidpoint(p1,p2);
        var mp13 = Geometry.getMidpoint(p1,p3);
        var mp23 = Geometry.getMidpoint(p2,p3);

        ctx.fillText(l12, mp12.x - minx + padding/4,mp12.y - miny + padding/4);
        ctx.fillText(l13, mp13.x - minx + padding/4,mp13.y - miny + padding/4);
        ctx.fillText(l23, mp23.x - minx + padding/4,mp23.y - miny + padding/4);


        



        return s;

    }
    static getMidpoint(p1,p2){
        var x = (p1.x + p2.x)/2;
        var y = (p1.y + p2.y)/2;
        return {x:x,y:y};
    }
    static getLength(p1,p2){
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        var l = Math.sqrt(dx*dx + dy*dy);
        return parseInt(l);
    }
    static movePointToward(pos,rotation,distance){
        const rRad = rotation * (Math.PI / 180);
        const vx = distance * Math.cos(rRad);
        const vy = distance * Math.sin(rRad);
        return {
            x : pos.x + vx,
            y : pos.y + vy
        }
    }
    static MakePolygon(radius,numPoints=8, rotated = false, stroke = '#000', fill = '#fff') {
        var size = radius * 4;
        var canvas = G.makeCanvas(size,size);
        var ctx = canvas.getContext('2d');
        var center = {
            x : canvas.width / 2,
            y : canvas.height / 2
        }
        var distToSide = radius / Math.cos(Math.PI / numPoints);
        var rotation = rotated ? Math.PI/numPoints : rotated;
        radius = rotated ? distToSide : radius;
        var points = [];
        for(let i = 0 ; i < numPoints; i++){
            var vertex = G.getVertex(center,radius,numPoints,i);
            vertex = G.rotatePoint(center,vertex, rotation);
            points.push(vertex);
        }
        ctx.beginPath();
        ctx.moveTo(points[0].x,points[0].y);
        for(let i = 0 ;i < numPoints;i++){
            var pt = points[i];
            ctx.lineTo(pt.x,pt.y);
        }
        ctx.lineTo(points[0].x,points[0].y);
        ctx.closePath();
        if(stroke != null){
            ctx.lineWidth = 1;
            ctx.strokeStyle = stroke;
            ctx.stroke();
        }
        if(fill != null){
            ctx.fillStyle = fill;
            ctx.fill();
        }
        return canvas;
    }
    static PolyGrid(cellSize, rows, cols){
        // document.body.innerHTML = ``;
        var dsesert = G.randomPattern('#d09700','#509e26',0.01,cellSize,cellSize);
        var grass = G.randomPattern('#2d7d00','#509e26',0.1,cellSize,cellSize);
        var dirt = G.randomPattern('#924200','#3d1c00',0.01,cellSize,cellSize);
        var water = G.randomPattern('#21bffff0','#2867ff',0.01,cellSize,cellSize);
        var poly2 = Geometry.MakePolygon(cellSize,6,true, null,'#fff');
        var poly_dsesert = G.fuseImage(poly2,dsesert);
        var poly_grass = G.fuseImage(poly2,grass);
        var poly_dirt = G.fuseImage(poly2,dirt);
        var poly_water = G.fuseImage(poly2,water);
        var sprites = [poly_dsesert,poly_grass,poly_dirt,poly_water];
        sprites.forEach(x=>{
            // document.body.append(x);
        })
        var canvas = G.makeCanvas(cellSize * rows, cellSize * cols);
        var ctx = canvas.getContext('2d');
        var x = 0, y = 0;
        for(let i = 0 ; i < rows; i++){
            x = i % 2 == 0 ? 0 : cellSize;
            x-=1;
            for(let j = 0 ; j < cols  ; j++){
                // var s = Math.random() > 0.5 ? pd : pg;
                var s = sprites[G.randInt(0,sprites.length)];
                ctx.drawImage(
                    s,
                    x - s.width/2,
                    y - s.height/2
                );
                x += cellSize*2;
            }
            y+= cellSize*2*Math.cos(Math.PI / 6);
            y-=1;
        }
        // document.body.append(canvas);
        return canvas;
    }
}
class TankBase{
    constructor(){
        this.pos = {x:-Infinity, y:-Infinity};
        this.sprite = Geometry.MakeCircle(32,null,'black');
        this.rotation = 0;
        this.power = 1;
        this.speed = 1;
        this.velocity = 0;
        this.rotationvelocity = 0;
        this.bullets = [];
    }
    updateBeam(){
        this.beamDist = Geometry.movePointToward(this.pos,this.rotation,100);
    }
}
class BulletExplosion{
    constructor(game,pos){
        this.game = game;
        this.pos = {x:pos.x,y:pos.y};
        this.life = 1;
        this.currentR = 0;
        this.maxR = 5;
        game.objects.push(this);
    }
    update(){
        this.currentR++;
        if(this.currentR > this.maxR){
            this.life=0;
        }
    }
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y,this.currentR,0,Math.PI * 2,false);
        ctx.fillStyle = `red`;
        ctx.fill();
    }
}
class Bullet{
    constructor(source){
        this.source = source;
        this.pos = {
            x:source.pos.x,
            y:source.pos.y
        };
        this.rotation = source.rotation;
        this.speed = source.speed+1;
        this.distance = 0;
        this.life = 1;
        this.sprite = Geometry.MakeCircle(3,null,`red`);
    }
    update(){
        this.pos = Geometry.movePointToward(this.pos,this.rotation,this.speed);
        var nearby = this.source.game.objects.filter(x=> G.getDistance(x.pos,this.pos) <= x.sprite.width * 1.4 / 2);
        nearby.forEach(x=>{
            if(x != this.source){
                x.life -= this.life;
                this.life = 0;
                delete(this);
                new BulletExplosion(this.source.game,this.pos);
            }
        })
        this.distance++;
        if(this.distance > 25) this.life = 0;
    }
    draw(ctx){
        ctx.drawImage(this.sprite,
            this.pos.x - this.sprite.width/2, 
            this.pos.y - this.sprite.height/2
        );
    }
}
class Wall{
    constructor(game,pos){
        this.pos = {x:pos.x,y:pos.y};
        this.game = game;
        this.life = 1;
        this.sprite = G.brickPattern("#fff","#000",2);
        //check if it intersect other objects
        var nearby = this.game.objects.filter(x=> G.getDistance(x.pos,this.pos) <= x.sprite.width * 1.4 / 2);
        console.log(nearby);
        if(nearby.length == 0){
            this.game.objects.push(this);
        }
    }
    draw(ctx){
        ctx.drawImage(this.sprite,this.pos.x - this.sprite.width/2, this.pos.y - this.sprite.height/2);
    }
    overlap(p2){
        //distance to center less than hitbox
        var distance = G.getDistance(this.pos,p2);
        return distance <= this.sprite.width/2;
    }
}
class Player{
    constructor(game,sprite,pos){
        this.game = game;
        this.rotation = 0;
        this.life = 5;
        this.sprite = sprite;
        this.spriteWithRotation = sprite;
        this.pos = {
            x:pos.x,
            y:pos.y
        };
        this.power = 4;
        this.speed = 4;
        this.velocity = 0;
        this.rotationvelocity = 0;
        this.bullets=[];
        this.buildMode = false;
        this.gridBuildMode = G.fullGridBg('#fff',null,16,16*9,16*9,'#fff');
        this.updateBeam();
        this.game.objects.push(this);

        this.debuff = {
            current : {
                move : 10,
                rotate : 10,
                fire : 10,
            },
            max:{
                move : 10,
                rotate : 10,
                fire:10
            }
        }

    }
    updateBeam(){
        this.beamDist = Geometry.movePointToward(this.pos,this.rotation,100);
    }
    rotateToward(pos){
        let dx = pos.x - this.pos.x;
        let dy = pos.y - this.pos.y;
        // Calculate angle in radians
        let angleRadians = Math.atan2(dy, dx);
        this.rotation = angleRadians * 180/Math.PI;
        this.spriteWithRotation = G.rotateCanvas(this.sprite,this.rotation);
        this.updateBeam();
    }
    keyup(e){
        if(e.key.toLowerCase() == 'w'){
            this.velocity = 0;
        }
        if(e.key.toLowerCase() == 's'){
            this.velocity = 0;
        }
        if(e.key.toLowerCase() == 'd'){
            this.rotationvelocity = 0;
        }
        if(e.key.toLowerCase() == 'a'){
            this.rotationvelocity = -0;
        }
    }
    keydown(e){
        if(e.key.toLowerCase() == 'b'){
            this.buildMode = !this.buildMode;
        }
        if(e.key.toLowerCase() == 'w'){
            this.velocity = 4;
        }
        else if(e.key.toLowerCase() == 's'){
            this.velocity = -4;
        }
        else if(e.key.toLowerCase() == 'd'){
            this.rotationvelocity = 15;
        }
        else if(e.key.toLowerCase() == 'a'){
            this.rotationvelocity = -15;
        }
        else if(e.key == ' '){
            if(this.bullets.length < 2 && this.debuff.current.fire >= this.debuff.max.fire)
                this.bullets.push(new Bullet(this));
                this.debuff.current.fire=0;
        }
        else{
            console.log(e);
        }
    }
    update(){
        Object.keys(this.debuff.current).forEach(key => {this.debuff.current[key] += 1;});
        this.bullets.forEach(x=>x.update());
        this.bullets = this.bullets.filter(x=>x.life > 0);
        if(this.velocity != 0){
            var newpos = Geometry.movePointToward(this.pos,this.rotation,this.velocity);
            var nearby = this.game.objects.filter(x=> x.sprite && G.getDistance(x.pos,newpos) <= x.sprite.width * 1.4 / 2);
            if(nearby.length == 1){
                this.pos = newpos;
                this.updateBeam();
            }
        }
        if(this.debuff.current.rotate >= this.debuff.max.rotate && this.rotationvelocity != 0){
            this.rotation += this.rotationvelocity;
            this.spriteWithRotation = G.rotateCanvas(this.sprite,this.rotation);
            this.updateBeam();
            this.debuff.current.rotate=0;
        }
    }
    applyClick(x,y){
        if(this.buildMode){
            console.log(x,y);
            //normalize x,y
            var pos = this.normalizeMousePos(this.pos,x,y)
            if(pos != null){
                var wall = new Wall(this.game,pos);
            }
        }
    }
    draw(ctx){
        ctx.drawImage(this.spriteWithRotation,this.pos.x - this.spriteWithRotation.width/2, this.pos.y - this.spriteWithRotation.height/2);
        ctx.strokeStyle = "blue";
        ctx.beginPath();
        ctx.moveTo(this.pos.x,this.pos.y);
        ctx.lineTo(this.beamDist.x,this.beamDist.y);
        ctx.stroke();
        this.bullets.forEach(x=>x.draw(ctx));
        if(this.buildMode){
            ctx.drawImage(this.gridBuildMode,this.pos.x - this.gridBuildMode.width/2, this.pos.y - this.gridBuildMode.height/2);
        }
    }
    normalizeMousePos(pos, mouseX, mouseY) {
        var playerCenterX = pos.x;
        var playerCenterY = pos.y;
        const gridSize = 16; // Size of each grid cell in pixels
        const gridRadius = 4; // Radius of the grid (4 cells in each direction from center)
        // Calculate the top-left corner of the build area
        const buildAreaLeft = playerCenterX - gridSize * gridRadius - gridSize/2;
        const buildAreaTop = playerCenterY - gridSize * gridRadius - gridSize/2;
        // Check if the mouse click is inside the build area
        if (mouseX < buildAreaLeft || mouseX >= buildAreaLeft + gridSize * 9 ||
            mouseY < buildAreaTop || mouseY >= buildAreaTop + gridSize * 9) {
            return null; // Mouse click is outside the build area
        }
        // Calculate the mouse position relative to the build area
        const relativeMouseX = mouseX - buildAreaLeft;
        const relativeMouseY = mouseY - buildAreaTop;
        // Determine the grid cell index
        const cellX = Math.floor(relativeMouseX / gridSize);
        const cellY = Math.floor(relativeMouseY / gridSize);
        // Ensure the cell indexes are within the 9x9 grid
        if (cellX < 0 || cellX >= 9 || cellY < 0 || cellY >= 9) {
            return null; // Mouse click is outside the valid grid cells
        }
        // Calculate the center of the grid cell
        const centerX = buildAreaLeft + (cellX * gridSize) + (gridSize / 2);
        const centerY = buildAreaTop + (cellY * gridSize) + (gridSize / 2);
        return { x: centerX, y: centerY };
    }
    overlap(p2){
        //distance to center less than hitbox
        var distance = G.getDistance(this.pos,p2);
        return distance <= this.sprite.width/2;
    }
}

class TankAI{
    constructor(pos){
        this.pos = {x:pos.x,y:pos.y};

    }
    update(){

    }
    draw(ctx){

    }
}
const color1 = '#fff';
const color2 = '#fff';
const color3 = '#fff';
const color4 = '#fff';
const color5 = '#000';
const ImageUrl1 = 'Assets/Images/boss08.gif';
const SpriteSheet1 = 'Assets/Images/s1.gif';
const SpriteSheet2 = 'Assets/Images/s2.gif';

class Game{
    constructor(c){
        G.loadImage(SpriteSheet2,[],(img)=>{
            this.SpriteSheet = new SpriteSheet(img);
            var tank = this.SpriteSheet.getTank(3);
            this.init(c,tank);
        });
    }
    init(c,img){
        this.objects = [];
        // this.sprite1 = G.imgToCanvas(img);
        this.sprite1 = G.rotateCanvas(img,90);
        this.rotation = 0;
        this.spriter = G.rotateCanvas(this.sprite1,this.rotation);
        this.polygrid = Geometry.PolyGrid(32,100,100);
        var canvasW = window.innerWidth*.97;
        var canvasH = window.innerHeight*.97;
        this.canvas = G.makeCanvas(canvasW,canvasH);
        this.rotation = 0;
        this.canvasCenter = {
            x: this.canvas.width/2,
            y: this.canvas.height/2,
        };
        this.camera = {
            x: this.canvas.width/2,
            y: this.canvas.height/2
        };
        this.circle = Geometry.MakeCircle(this.canvas.width/3,color5,null);
        this.cursor = Geometry.MakeCircle(3,null,`red`);
        this.player = new Player(this,this.sprite1,this.canvasCenter);
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

        this.canvas.addEventListener('mousemove',(e)=>{
            /*var rect = this.canvas.getBoundingClientRect();
            var x = e.clientX - rect.left + window.scrollX;
            var y = e.clientY - rect.top + window.scrollY;
            x = Math.floor(x);
            y = Math.floor(y);
            this.applyClick(x,y);*/
        });
        this.canvas.addEventListener('click',(e)=>{

            var rect = this.canvas.getBoundingClientRect();
            var x = e.clientX - rect.left + window.scrollX;
            var y = e.clientY - rect.top + window.scrollY;
            this.player.applyClick(x,y);
            // x = Math.floor(x);
            // y = Math.floor(y);
            // this.applyClick(x,y);
        });
        document.body.addEventListener('keydown',e=>{
            this.player.keydown(e);
        })
        document.body.addEventListener('keyup',e=>{
            this.player.keyup(e);
        })

    }
    applyClick(x,y){
        this.mousepos = {x:x,y:y};
        let dx = x - this.canvasCenter.x;
        let dy = y - this.canvasCenter.y;

        // Calculate angle in radians
        let angleRadians = Math.atan2(dy, dx);
        this.rotation = angleRadians * 180/Math.PI;

        document.getElementById('header1').innerHTML = `
        <br> angleRadians = ${angleRadians}
        <br> θ = ${this.rotation}∘
        `;
        this.player.rotateToward({x:x,y:y});
        // this.spriter = G.rotateCanvas(this.sprite1,this.rotation);
        return;

        var line = Geometry.GetLineEquation(this.canvasCenter,this.mousepos);
        var angle = Math.atan(line.a);

        this.rotation = angle;
        document.getElementById('header1').innerHTML = `
        <br> y = ${line.a}x + ${line.b}
        <br> θ = ${angle} = ${angle * 180/Math.PI}∘
        `;

        this.intersections = Geometry.findSegmentCircleIntersections(this.canvasCenter,this.mousepos, this.canvasCenter, this.circle.width/2);
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
    update(t){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

        this.ctx.drawImage(
            this.polygrid,
            0,
            0
        );
        this.ctx.drawImage(
            this.circle,
            this.canvasCenter.x - this.circle.width/2,
            this.canvasCenter.y - this.circle.height/2,
        );
        
        /*this.ctx.strokeStyle = "black";
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvasCenter.x,0);
        this.ctx.lineTo(this.canvasCenter.x,this.canvas.height);
        
        this.ctx.moveTo(0,this.canvasCenter.y);
        this.ctx.lineTo(this.canvas.width,this.canvasCenter.y);
        this.ctx.stroke();
        */
        
        

        /*this.ctx.drawImage(
            this.cursor,
            this.mousepos.x - this.cursor.width/2,
            this.mousepos.y - this.cursor.height/2,
        );*/


        /*if(this.intersections){
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
        }*/
        // this.ctx.save();
        // this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        // this.ctx.rotate(this.rotation * Math.PI / 180);
        // this.ctx.rotate(this.rotation);
        // ctx.drawImage(img, -img.width / 2, -img.height / 2);
        /*this.ctx.drawImage(
            this.spriter,
            this.canvasCenter.x - this.spriter.width/2 ,
            this.canvasCenter.y - this.spriter.height/2 ,
        );*/
        this.objects = this.objects.filter(x=>x.life != 0);
        this.objects.forEach(x=>{if(x.update) x.update(t);});
        this.objects.forEach(x=>{if(x.draw) x.draw(this.ctx);});
        // this.player.update(t);
        // this.player.draw(this.ctx);
        // this.ctx.restore();

        requestAnimationFrame((t)=> this.update(t));
    }
}
document.addEventListener('DOMContentLoaded', function () {
    window.game = new Game("body");
}, false);