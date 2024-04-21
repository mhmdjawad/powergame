export default class DomElementMaker{
    static MakeNotification(message,buttons = null){
        if(this.dialog) this.dialog.remove();
        this.dialog = document.createElement('div');
        this.dialog.classList = ['dialog'];
        this.dialog.appendChild(DomElementMaker.MakeButton('x',()=>{
            this.dialog.remove();
        }));
        this.dialog.appendChild(DomElementMaker.MakeH1(message));
        this.dialog.appendChild(DomElementMaker.MakeButton('ok',()=>{
            this.dialog.remove();
        }));
        if(buttons){
            for(let i in buttons){
                this.dialog.appendChild(buttons[i]);
            }
        }
        document.body.append(this.dialog);
    }
    static MakeDialog(){
        return Object.assign(document.createElement('div'), {className: 'dialog'});
    }
    static MakeDiv(content,className = ''){
        var element = document.createElement('div');
        element.innerHTML = content;
        if(className){
            element.className = className;
        }
        return element;
    }
    static MakeH1(content){
        var element = document.createElement('h1');
        element.innerHTML = content;
        return element;
    }
    static MakeH2(content){
        var element = document.createElement('h2');
        element.innerHTML = content;
        return element;
    }
    static MakeTd(text,className,callback){
        var element = document.createElement('td');
        element.innerHTML = text;
        element.className = className;
        element.onclick = callback;
        return element;
    }
    static MakeTr(tds,className,callback){
        var element = document.createElement('tr');
        tds.forEach(x=>{
            element.appendChild(x);
        })
        element.className = className;
        element.onclick = callback;
        return element;
    }
    static MakeTable(trs,className,callback){
        var element = document.createElement('table');
        trs.forEach(x=>{
            element.appendChild(x);
        })
        element.className = className;
        element.onclick = callback;
        return element;
    }
    static MakeButton(text,callback,className=`dialogbtn`){
        var element = document.createElement('button');
        element.innerHTML = text;
        element.onclick = callback;
        element.className = className;
        return element;
    }
    static MakeInput(){
        var element = document.createElement('input');
        return element;
    }
    static MakeAudio(src,className){
        var audio = new Audio(src);
        audio.controls=true;
        audio.playbackRate = 1;
        audio.play();
        return audio;
    }
}