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
    this.viewPort = new Viewport(this.app, this); 
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
}