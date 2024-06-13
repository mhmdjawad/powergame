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
const color1 = `#0db2b224`;
const color2 = `#000`; // main text color #092046
const color3 = `#fff`;    // secondary text color
const color4 = `#0db2b245`; //circle color
const color5 = `#000`; //canvas border
class AnimatedTile{
    constructor(w,h,c,value){
        this.value = value;
        this.particles = [];
        this.canvas = G.makeCanvas(w,h);
        var cx = 0;
        var cy = 0;
        var vx = 0.2;
        for(let i = 0 ; i < c ; i++){
            cy += i * h/c;
            for(let j = 0 ; j < c/2 ; j++){
                cx = i * w/c + j * 2 * w/c;
                vx *= -1;
                var p = this.particle(cx, cy,vx,-0.2);
                this.particles.push(p);
            }
        }
        // this.bgimage = G.gridBG(color1,null,4,1);
        this.bgimage = G.brickPattern(color1,'#0000015');
        this.bgimage = G.gridToFull(this.bgimage,w,h,color1);
        var s1 = G.getFontSprite(value,"50",color2,null,"Comic Sans MS",0,h);
        var s2 = G.getFontSprite(value,"50",color3,null,"Comic Sans MS",0,h);
        var c2 = G.makeCanvas(w,h);
        c2.ctx.drawImage(s2, 3 + c2.width/2 - s2.width/2,       3 + c2.height/2 - s2.height/2);
        c2.ctx.drawImage(s1, 3 + c2.width/2 - s1.width/2 - 2,   3 + c2.height/2 - s1.height/2 - 2);
        this.ValueSprite = c2;
        this.update(0);
    }
    circle(r,stroke = null,fill = null){
        var s = G.makeCanvas(r*2+2,r*2+2);
        var ctx = s.ctx;
        ctx.beginPath();
        ctx.arc(s.width/2,s.height/2,r,0,Math.PI * 2,false);
        if(stroke){ctx.strokeStyle = stroke;ctx.stroke();}
        if(fill != null){ctx.fillStyle = fill;ctx.fill();}
        return s;
    }
    particle(x,y,vx,vy){
        var p = {
            sprite : this.circle(G.randInt(3,6),color4),
            ix : x,
            iy : y,
            cx : x,
            cy : y,
            vx : vx,
            vy : vy,
        };
        return p;
    }
    update(t){
        this.canvas.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.particles.forEach(x=>{
            x.cx += x.vx;
            x.cy += x.vy;
            if(x.cx < 0 || x.cx > this.canvas.width) x.vx *= -1;
            if(x.cy < 0 || x.cy > this.canvas.height) x.vy *= -1;
            this.canvas.ctx.drawImage(x.sprite,x.cx,x.cy);
        });
        this.canvas.ctx.drawImage(this.bgimage,0,0);
        this.canvas.ctx.drawImage(this.ValueSprite,0,0);
        requestAnimationFrame((t)=>this.update(t));
    }
    draw(ctx,x,y){
        ctx.drawImage(this.canvas,x,y);
    }
}
class P15Solver{
    constructor(grid){
        this.grid = grid;
        this.goal = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 0]
        ];
        this.moves = [];
        // this.goal = [...Array.from({length: 4 * 4 - 1}, (_, index) => index + 1),0];
        console.log(JSON.stringify(this.grid));
        this.solve();
        console.log(this.moves);
    }
    checkSolvingStage(){
        var flatgoal = this.goal.flat();
        var flatgrid = this.grid.flat();
        var score = 0;
        for(let i = 0 ; i < flatgoal.length;i++){
            if(flatgoal[i] == flatgrid[i]) score++;
            else break;
        }
    }
    









    // Calculate the Manhattan distance between two points
    manhattanDistance(a, b) {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    }
    // Calculate the linear conflict heuristic for a row or column
    linearConflict(rowOrCol) {
        let conflictCount = 0;
        let maxValue = -1;
        for (let i = 0; i < rowOrCol.length; i++) {
            if (rowOrCol[i] !== 0 && rowOrCol[i] > maxValue) {
                maxValue = rowOrCol[i];
                for (let j = i + 1; j < rowOrCol.length; j++) {
                    if (rowOrCol[j] !== 0 && rowOrCol[j] < maxValue) {
                        conflictCount++;
                    }
                }
            }
        }
        return conflictCount;
    }
    // Calculate the linear conflict heuristic for the entire grid
    calculateLinearConflict() {
        let conflictCount = 0;
        for (let i = 0; i < 4; i++) {
            conflictCount += this.linearConflict(this.grid[i]);
            let column = [this.grid[0][i], this.grid[1][i], this.grid[2][i], this.grid[3][i]];
            conflictCount += this.linearConflict(column);
        }
        return conflictCount;
    }
    // Find the position of a number in the grid
    findPosition(number) {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j] === number) {
                    return [i, j];
                }
            }
        }
    }
    // Find the list of possible moves
    possibleMoves() {
        let position = this.findPosition(0);
        let moves = [];
        if (position[0] > 0) moves.push([position[0] - 1, position[1]]);
        if (position[0] < 3) moves.push([position[0] + 1, position[1]]);
        if (position[1] > 0) moves.push([position[0], position[1] - 1]);
        if (position[1] < 3) moves.push([position[0], position[1] + 1]);
        return moves;
    }
    // Solve the puzzle using A* algorithm with linear conflict heuristic
    solve() {
        let openSet = [{ grid: this.grid, moves: [], f: 0 }];
        let closedSet = new Set();
        while (openSet.length > 0) {
            let current = openSet.shift();
            let currentGrid = current.grid;
            if (JSON.stringify(currentGrid) === JSON.stringify(this.goal)) {
                this.moves = current.moves;
                return;
            }
            closedSet.add(JSON.stringify(currentGrid));
            let zeroPosition = this.findPosition(0);
            for (let move of this.possibleMoves()) {
                let newGrid = currentGrid.map(row => row.slice());
                [newGrid[zeroPosition[0]][zeroPosition[1]], newGrid[move[0]][move[1]]] =
                    [newGrid[move[0]][move[1]], newGrid[zeroPosition[0]][zeroPosition[1]]];
                let newMoves = [...current.moves, move];
                let h = this.manhattanDistance(zeroPosition, move) + this.calculateLinearConflict();
                let f = newMoves.length + h;
                let newNode = { grid: newGrid, moves: newMoves, f: f };
                if (!closedSet.has(JSON.stringify(newGrid))) {
                    let index = openSet.findIndex(node => node.f > f);
                    if (index === -1) openSet.push(newNode);
                    else openSet.splice(index, 0, newNode);
                }
            }
        }
    }
    // Print the solution steps
    printSolution() {
        console.log("Solution Steps:");
        for (let i = 0; i < this.moves.length; i++) {
            console.log(`Step ${i + 1}: Move 0 to position ${this.moves[i][0]}, ${this.moves[i][1]}`);
        }
    }
}
class Game1{
    constructor(container){
        // window.onresize = ()=>{this.windowresize();};
        this.windowresize();
        this.prepGame();
    }
    getColorPalette(){
    }
    getScoreBoard(){
        var html = `<table class=sboard ><tr><td>Time</td><td>Moves</td></tr></tr><td id=stime>0</td><td id=smoves >0</td></tr></table>`;
        var table = DOM.makeDom(html);
        table.style.width = 64*4+5*2 + "px";
        return table;
    }
    windowresize(){
        var canvasW = 64*4+5*2;
        var canvasH = 64*4+5*2;
        this.canvas = G.makeCanvas(canvasW,canvasH);
        this.canvas.style.border = "1px solid " + color5;
        this.ctx = this.canvas.getContext('2d');
        document.body.innerHTML = ``;
        this.layout = DOM.makeDom(`<div id=game><div id=sboard></div><div id=cbody ></div></div>`);
        this.scoreboard = this.getScoreBoard();
        this.layout.querySelector('#sboard').append(this.scoreboard);
        this.layout.querySelector('#cbody').append(this.canvas);
        document.body.append(this.layout);
        this.mousepos = {x:0,y:0};
        this.handleClickOnCanvas();
    }
    handleClickOnCanvas(){
        this.canvas.addEventListener('click',(e)=>{
            var rect = this.canvas.getBoundingClientRect();
            var x = e.clientX - rect.left + window.scrollX;
            var y = e.clientY - rect.top + window.scrollY;
            var j = Math.floor(x / 66);
            var i = Math.floor(y / 66);
            this.applyClick(i,j);
        });
    }
    applyClick(i,j){
        var tile = this.tilesMap[i][j];
        if(tile != null){
            if(i > 0 && this.tilesMap[i-1][j] == null){ 
                this.tilesMap[i-1][j] = tile;
                this.tilesMap[i][j] = null;
                this.moves++;
                this.checkGameOver();
            }
            else if(j > 0 && this.tilesMap[i][j-1] == null){ 
                this.tilesMap[i][j-1] = tile;
                this.tilesMap[i][j] = null;
                this.moves++;
                this.checkGameOver();
            }
            else if(i < 3 && this.tilesMap[i+1][j] == null){ 
                this.tilesMap[i+1][j] = tile;
                this.tilesMap[i][j] = null;
                this.moves++;
                this.checkGameOver();
            }
            else if(j < 3 && this.tilesMap[i][j+1] == null){ 
                this.tilesMap[i][j+1] = tile;
                this.tilesMap[i][j] = null;
                this.moves++;
                this.checkGameOver();
            }
        }
    }
    update(time){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        // this.ctx.font = "15px"
        // this.ctx.fillText(`time : ${this.timeToHMS(time/100)}`, 10,10);
        var cx = 2;
        var cy = 2;
        for(let i = 0 ; i < this.tilesMap.length;i++){
            cx = 2
            for(let j = 0 ; j < this.tilesMap[i].length;j++){
                var t = this.tilesMap[i][j];
                if(t != null){
                    t.draw(this.ctx, cx, cy);
                }
                cx += 64+2;
            }
            cy += 64+2;
        }
        this.time=time;
        this.scoreboard.querySelector('#stime').innerText = this.timeToHMS(time/1000);
        this.scoreboard.querySelector('#smoves').innerText = this.moves;
        if(this.gameover) return;
        requestAnimationFrame((t)=>this.update(t));
    }
    timeToHMS(s){
        let m = Math.floor(s / 60);
        let h = Math.floor(m / 60);
        m = Math.floor(m % 60);
        s = Math.floor(s % 60);
        return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    prepGame(){
        this.initGame();
        this.update(0);
    }
    initGame(){
        var n = 4;
        this.size = 4;
        this.tilesMap = [[]];
        var values = this.getShuffledGame();
        var cr = 0;
        var cc = 0;
        for(let i = 0 ; i < values.length;i++){
            if( cc!=0 && (cc) % 4 == 0){
                cc=0;
                cr++;
                this.tilesMap[cr] = [];
            }
            var val = values[i];
            var tile = new AnimatedTile(64,64,8,val);
            if(val == 0) tile = null;
            this.tilesMap[cr][cc] = tile;
            cc++;
            
        }
        this.moves = 0;
        this.time = 0;
        this.gameover = false;
        this.AISolve();
    }
    checkGameOver(){
        var curval = 1;
        for(let i = 0 ; i < this.tilesMap.length;i++){
            for(let j = 0 ; j < this.tilesMap[i].length;j++){
                var t = this.tilesMap[i][j];
                if(t != null){
                    if(t.value != curval) return false;
                    curval++;
                }
                if(t == null && curval <= 15) return false;
            }
        }
        if(curval < 15) return false;
        this.gameover = true;
        var gameoverlayout = `<div id=gameover>
        <h1>Puzzle Completed</h1>
        <table>
            <tr><td>Time</td><td>${this.timeToHMS(this.time/1000)}</td></tr>
            <tr><td>Moves</td><td>${this.moves}</td></tr>
            <tr><td>Rank</td><td>${this.getLocalRank()}</td></tr>
        </table>
        <button id=newgame>New Game</button>
        </div>
        `;
        gameoverlayout = DOM.makeDom(gameoverlayout);
        gameoverlayout.querySelector('#newgame').onclick = ()=>{
            this.windowresize();
            this.prepGame();
        }
        this.layout.innerHTML = ``;
        this.layout.append(gameoverlayout);
        return true;
    }
    getLocalRank(){
        var highscores = localStorage.getItem("gameHighScores");
        return 1;
    }
    AISolve(){
        var moves = [];
        var curgrid = this.getCurrentMatrixValues();
        var solver = new P15Solver(curgrid);
        solver.printSolution();
    }
    getCurrentMatrixValues(){
        var matrix = [];
        for(let i = 0 ; i < this.tilesMap.length;i++){
            matrix[i]=[];
            for(let j = 0 ; j < this.tilesMap[i].length;j++){
                matrix[i][j] = this.tilesMap[i][j]?.value || 0;
            }
        }
        return matrix;
    }
    getShuffledGame(){
        let puzzle = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 0]
        ];
        var moves = [];
        // Perform random legal moves to shuffle the puzzle
        for (let i = 0; i < 100; i++) {
            var empty = this.getEmptyLocation(puzzle);
            let emptyTileRow = empty.emptyTileRow, emptyTileCol = empty.emptyTileCol;
            let possibleMoves = this.getPossibleMove(empty.emptyTileRow,empty.emptyTileCol,puzzle);
            // Choose a random move and perform it
            let randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            // moves.push(randomMove);
            [puzzle[emptyTileRow][emptyTileCol], puzzle[randomMove[0]][randomMove[1]]] =
                [puzzle[randomMove[0]][randomMove[1]], puzzle[emptyTileRow][emptyTileCol]];
        }
        var flat = puzzle.flat();
        console.log(moves);
        return flat;
    }
    getEmptyLocation(puzzle){
        let emptyTileRow = 0, emptyTileCol = 0;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (puzzle[row][col] === 0) {
                    emptyTileRow = row;
                    emptyTileCol = col;
                    break;
                }
            }
        }
        return {emptyTileRow:emptyTileRow,emptyTileCol:emptyTileCol}
    }
    getPossibleMove(emptyTileRow,emptyTileCol,puzzle){
        let possibleMoves = [];
        if (emptyTileRow > 0) {
            possibleMoves.push([emptyTileRow - 1, emptyTileCol]); // Move Up
        }
        if (emptyTileRow < 3) {
            possibleMoves.push([emptyTileRow + 1, emptyTileCol]); // Move Down
        }
        if (emptyTileCol > 0) {
            possibleMoves.push([emptyTileRow, emptyTileCol - 1]); // Move Left
        }
        if (emptyTileCol < 3) {
            possibleMoves.push([emptyTileRow, emptyTileCol + 1]); // Move Right
        }
        return possibleMoves;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    window.game = new Game1(".logo");
//    var b = G.brickPattern(color1,'#000');
//    document.body.append(b);
}, false);
