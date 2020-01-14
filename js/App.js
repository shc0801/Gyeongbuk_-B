Number.prototype.time = function(){
    let int = parseInt(this);
    let msec = (this - int).toFixed(2).substr(2);

    let hour = parseInt(int / 3600);
    let min = parseInt((int % 3600) / 60);
    let sec = int % 60;

    if(hour < 10) hour = "0" + hour;
    if(min < 10) min = "0" + min;
    if(sec < 10) sec = "0" + sec;

    return `${hour}:${min}:${sec}:${msec}`;
}

// 상위 캔버스, 트랙 가져오기 (뒤에 캔버스나 트랙 삽입하는용)
const parCanvas = document.querySelector('#canvas')
const parTrack = document.querySelector('#track')

//선택부분 선의 색, 너비
const borderWidth = 10;
const borderColor = '#77cdff';
class App {
    constructor(){
        this.toolNum = 0; 
        this.canvasNum = 0; 
        this.rectNum = 0; 
        this.spanNum = 0; 
        this.inputNum = 0; 
        this.trackNum = 0;
        //도구별 그린 순서를 정하는 용도

        // 선택한툴
        this.selectTool = null;  
        // tool 생성시 그 툴의 아이디 저장
        this.toolList = new Array;

        // 영화 선택여부
        this.movie = false;  
        this.movieId = null;  
        this.nowVideo = null;  

        this.nowTool;
        this.tool = new Tool(this);
        this.MoviePlayer = new MoviePlayer(this);

        this.track = null;  
        this.cursor = false;

        this.parTrack = document.querySelector("#track");
        this.Before = document.querySelector(".timeEl");
        this.move = false;

        this.startTimeDom = document.querySelector("#start_time");
        this.mainTainDom = document.querySelector("#mainTain_time");
        
        this.trackAble = false;
        this.time = new Array;
        this.addEvent();
    }

    addEvent(){
        this.Before.addEventListener("dragstart", e=>{
            e.preventDefault();
            this.cursor = true;
        })

        this.Before.addEventListener("mousedown", e=>{
            this.cursor = true;
        })

        window.addEventListener("mousemove", e=>{
            if(!this.cursor) return;
            let width = this.parTrack.offsetWidth;
            let left = 0;
            let x = e.clientX - this.parTrack.offsetLeft;
            x = x < left ? left : x > width ? width : x;
            this.moveCursor(x);
            this.MoviePlayer.setVideoTime(x);
        })

        window.addEventListener("mouseup", e => {
            this.cursor = false;
        });
    }

    //캔버스 생성
    addCanvas(){
        this.canvas = document.createElement("canvas");
        this.canvas.width = 850;
        this.canvas.height = 480;
        this.canvas.id = `tool_${this.toolNum+=1}`;  //id
        this.canvas.classList.add(`canvas_${this.canvasNum}`);  // class
        this.canvas.classList.add('canvas');  // class
        this.canvas.classList.add(`${this.canvasNum}`);  // class
        this.canvas.style.zIndex = this.toolNum;

        this.nowMovie = document.querySelector(`#tool_${this.movieId}`); //현재 영화의 클립
        this.nowMovie.appendChild(this.canvas);   // create (현재 영화의 클립안에 생성)
        this.toolList.push(`tool_${this.toolNum}`);
        this.canvasNum++;
    }

    mousePoint(e){  //^&^
        const {clientX, clientY} = e;
        let x = clientX - screen.offsetLeft;
        x = x < 0 ? 0 : parCanvas.width < x ? parCanvas.width : x;
        let y = clientY - screen.offsetTop;
        y = y < 0 ? 0 : parCanvas.left < y ? parCanvas.left : y;
        return {x: x, y: y};
    }
    
    moveCursor(x){
        this.Before.style.left = x + 'px';
    }
}


window.addEventListener("load", ()=> {
    let app = new App();
});