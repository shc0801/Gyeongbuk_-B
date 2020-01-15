const screen = document.querySelector('.screen');
class Tool{
  constructor(app){
    this.app = app;
    this.path = new Array;   //line 경로
    this.selectPath = new Array;  //line경로 받아서 선택부분에서 사용
    this.selectNum = 0;
    this.mouse = false;
    
    this.move = {  //select부분에서 움직이는 조건
      line: false,
      rect: false,
      text: false
    }
    this.active = false;

    //class
		this.line = new LineTool(this.app, this);
		this.rect = new RectTool(this.app, this);
    this.text = new TextTool(this.app, this);
    this.select = new Select(this.app, this);
    
    // tool 버튼
    this.toolDom = document.querySelectorAll("button");
    this.mouseEvent();
  }

  //html에서 value값 가져옴  this.color, this.fontSize, 다른 클래스면 this.tool.??(color, fontSize)
	get color() { return document.querySelector("#color").value; }
	get fontSize() { return document.querySelector("#fontSize").value; }
	get strokeSize() { return document.querySelector("#strokeWidth").value; }

  mouseEvent(){
    //버튼 누를때
    this.toolDom.forEach(tool=>{
      tool.addEventListener("click", e=>{
        if(!this.app.movie){ alert("먼저 영화를 선택해주세요!"); return; }
        // 현재툴 = 버튼의 data-tool
        this.nowTool = tool.dataset.tool;
        // 누른 툴 세팅(누른 버튼의 데이터에 따라 마우스 이벤트를 실행하는곳이 바뀌도록 52, 61, 69번쨰줄)
        this.setTool = this[this.nowTool];
        
        if(e.target.id === 'delete_all')
          this.delete_all(e)
        else if(e.target.id === 'deletion')
          this.deletion(e);
        else if(e.target.id === 'download')
          this.download();
      })
    })

    window.addEventListener("mousedown", e=> {
      if(!this.nowTool || e.which !== 1) return;  //현재 툴이 없거나 좌클릭 아닌경우 리턴
        // 누른 곳이 스크린 내부인 경우에만 실행
        this.mouse = true;
        e.path.forEach(el=>{
          if(el.id === 'screen') 
            this.setTool.mousedown(e);
        })
    }); 

    window.addEventListener("mousemove", e=> {
      if(!this.nowTool || e.which !== 1) return;  //현재 툴이 없거나 좌클릭 아닌경우 리턴
      if(this.nowTool === 'text' || !this.mouse) return;
      e.path.forEach(el=>{
        if(el.id === 'screen') 
          this.setTool.mousemove(e);
      })
    }); 

    window.addEventListener("mouseup", e=> {
      if(!this.nowTool || e.which !== 1) return;  //현재 툴이 없거나 좌클릭 아닌경우 리턴
      if(!this.mouse) return;
      e.path.forEach(el=>{
        if(el.id === 'screen'){
          this.mouse = false;
          this.setTool.mouseup(e);
        }
      });
    }); 

    parCanvas.addEventListener("mouseout", e=>{
      if(!this.active) return;
      if(this.nowTool === 'rect')
        this.setTool.mouseup(e);
      else if(this.nowTool === 'text'){
        this.setTool.mousedown(e);
        this.mouse = false;
      }
    })
  }

  mousePoint(e){  //^&^
    const {clientX, clientY} = e;
    let x = clientX - screen.offsetLeft;
    x = x < 0 ? 0 : parCanvas.width < x ? parCanvas.width : x;
    let y = clientY - screen.offsetTop;
    y = y < 0 ? 0 : parCanvas.left < y ? parCanvas.left : y;
    return {x: x, y: y};
  }

  clearCanvas(){
    if(this.app.canvasNum < 0) return;
    for(let i = this.app.canvasNum - 1; i >= 0; i--){
        let line = this.selectPath[i];
        this.canvasClear = document.querySelector(`.canvas_${i}`);
        this.ctx = this.canvasClear.getContext("2d");

        //지우고 다시 그리기 (초기화)
        this.ctx.clearRect(0, 0, this.canvasClear.width, this.canvasClear.height)

        this.ctx.beginPath();
        for(let j = 0; j < line.length; j++){
            this.ctx.lineCap = "round";
            this.ctx.strokeStyle = line[j].color;
            this.ctx.lineWidth = line[j].w;
            if(j != 0)
                this.ctx.moveTo(line[j-1].x, line[j-1].y);
            else    
                this.ctx.moveTo(line[j].x, line[j].y);
            this.ctx.lineTo(line[j].x, line[j].y);
        }
        this.ctx.stroke();
        this.move.line = false;
    }
  }

  clearRect(){
    let allRect = document.querySelectorAll(".tool_rect");
    allRect.forEach(rect=>{
        rect.style.borderColor = rect.style.backgroundColor;
        this.move.rect = false;
    })
  }

  clearText(){
      let allText = document.querySelectorAll(".tool_span");
      allText.forEach(text=>{
          text.style.borderColor = text.style.backgroundColor;
          this.move.rect = false;
      })
  }

  clearTrack(){
      let allTrack = document.querySelectorAll(".tool_track");
      allTrack.forEach(text=>{
          text.style.backgroundColor = 'darkgray';
          this.move.rect = false;
      })
  }

  delete_all(){
    this.nowMovie = document.querySelectorAll(`#tool_${this.app.movieId} > *`);
    this.nowMovie.forEach(nowMovie=>{
      nowMovie.remove();
    })
    
    this.nowTrack = document.querySelectorAll(`#track_${this.app.movieId} > *`);
    this.nowTrack.forEach(nowTrack=>{
      nowTrack.remove();
    })
    this.app.toolNum = 0; 
    this.app.canvasNum = 0; 
    this.app.rectNum = 0; 
    this.app.spanNum = 0; 
    this.app.inputNum = 0; 
    this.app.trackNum = 0;

    this.app.toolList = new Array;
    this.selectPath = new Array;
  }

  deletion(){
    let deleteNum = this.app.selectTool.id.slice(5, 6) - 1;
    
    let deleteTool = document.querySelector(`.${this.app.selectTool.id}`).remove()
    this.app.selectTool.remove();

    this.nowMovie = document.querySelectorAll(`#tool_${this.app.movieId} > *`);
    this.nowMovie.forEach(nowMovie=>{
      if(nowMovie.classList[0].slice(0, 1) === 'c'){

      }else if(nowMovie.classList[1].slice(0, 1) === 'r'){
        
      }else if(nowMovie.classList[1].slice(0, 1) === 's'){
        
      }
    })
    
    this.nowTrack = document.querySelectorAll(`#track_${this.app.movieId} > *`);
    this.nowTrack.forEach(nowTrack=>{
    })
    for(let i = deleteNum + 1; i <= this.app.toolList.length - deleteNum; i++){
      this.app.toolList[i - 1] = this.app.toolList[i];
    }
    this.app.toolList.pop();
  }
  download(){
    console.log(this.app.nowVideo, document.querySelectorAll(`#tool_${this.app.movieId}`))
    let style = this.app.nowVideo.style;
    style.width = 850 + 'px';
    style.height = 480 + 'px';
    style.outline = 0;
    let html = `<div>
                  <div class="screen" id="screen" style="position: relative; width: 850px; height: 480px; margin: 0 auto; display: flex; justify-content: center; align-items: center; z-index: 0;">
                  <video src="${this.app.nowVideo.src}" controls width="850px; height: 480px; outline: 0;" style="position: absolute; left:0%; top:0%;"></video>
                    let tool = ${document.querySelector(`#tool_${this.app.movieId}`).innerHTML}
                  </div>
                  <script>
                    window.onload = function(){
                      function frame(){
                        requestAnimationFrame(() => {
                            this.frame();
                        });
                        tool.style.position = 'absolute';
                        if(this.app.movie){
                            const {currentTime, duration} = this.app.nowVideo;
                            let x = currentTime * this.track.width / duration;
                            this.nowTime = document.querySelector('#nowTime');
                            this.nowTime.innerHTML = this.app.nowVideo.currentTime.time();
                                            
                            this.app.time.forEach(time=>{
                              if(time.start <= this.app.nowVideo.currentTime && this.app.nowVideo.currentTime <= time.start + time.main){
                                  let viewDom = document.querySelector('#'+time.id);
                                  if(viewDom !== null)
                                      viewDom.style.display = 'block';
                              }
                              else{
                                  let hideDom = document.querySelector('#'+time.id);
                                  if(hideDom !== null)
                                      hideDom.style.display = 'none';
                              }
                          })
                        }
                      }                                
                    }
                  </script>
                </div>`;
    let contents = $(html)[0];
    let blob = new Blob([contents.outerHTML], {type: "text/html"});
    let url = URL.createObjectURL(blob);
    
    let a = document.createElement("a");
    a.download = "asdasd.html";
    a.href = url;
    document.body.append(a);
    a.click();
    a.remove();
  }
}