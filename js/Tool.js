const screen = document.querySelector('.screen');
class Tool{
  constructor(app){
    this.app = app;
    this.path = new Array;   //line 경로
    this.selectPath = new Array;  //line경로 받아서 선택부분에서 사용
    this.selectNum = 0;
    
    this.move = {  //select부분에서 움직이는 조건
      line: false,
      rect: false,
      text: false
    }

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
      tool.addEventListener("click", ()=>{
        if(!this.app.movie){ alert("먼저 영화를 선택해주세요!"); return; }
        // 현재툴 = 버튼의 data-tool
        this.nowTool = tool.dataset.tool;
        // 누른 툴 세팅(누른 버튼의 데이터에 따라 마우스 이벤트를 실행하는곳이 바뀌도록 52, 61, 69번쨰줄)
        this.setTool = this[this.nowTool];
      })
    })

    window.addEventListener("mousedown", e=> {
      if(!this.nowTool || e.which !== 1) return;  //현재 툴이 없거나 좌클릭 아닌경우 리턴
      e.path.forEach(el=>{
        // 누른 곳이 스크린 내부인 경우에만 실행
        if(el.id === 'screen') 
          this.setTool.mousedown(e);
      })
    }); 

    window.addEventListener("mousemove", e=> {
      if(!this.nowTool || e.which !== 1) return;  //현재 툴이 없거나 좌클릭 아닌경우 리턴
      if(this.nowTool === 'text') return;
      e.path.forEach(el=>{
        if(el.id === 'screen') 
          this.setTool.mousemove(e);
      })
    }); 

    window.addEventListener("mouseup", e=> {
      if(!this.nowTool || e.which !== 1) return;  //현재 툴이 없거나 좌클릭 아닌경우 리턴
      e.path.forEach(el=>{
        if(el.id === 'screen') 
          this.setTool.mouseup(e);
      });
    }); 
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
}