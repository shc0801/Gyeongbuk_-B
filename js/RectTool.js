class RectTool{
  constructor(app, tool){
    this.app = app;
    this.tool = tool;

    this.active = false;
  }

  mousedown(e){
    this.active = true;
    const {x, y} = this.tool.mousePoint(e);
    this.startX = x; this.startY = y; //시작좌표

    this.rect = document.createElement('div'); //div생성
    this.rect.id = `tool_${this.app.toolNum += 1}`; // id
    this.rect.classList.add('tool_rect');  
    this.rect.classList.add(`rect_${this.app.rectNum}`);  

    let style = this.rect.style; //style설정
    style.borderColor = this.tool.color; //border style
    style.left = this.startX + 'px';
    style.top = this.startY + 'px';
    style.zIndex = this.app.toolNum;

    this.nowMovie = document.querySelector(`#tool_${this.app.movieId}`);
    this.nowMovie.appendChild(this.rect);   // create
    this.app.toolList.push(`tool_${this.app.toolNum}`);
    this.app.rectNum++; 
    this.track = new Track(this.app, this.tool, this);
  }
  
  mousemove(e){
    if(this.active){
      let style = this.rect.style;
    
      //음...^^ 그냥 크기조절 ㅎㅎ (마우스 드래그하는 방향별 크기)
      const {x, y} = this.tool.mousePoint(e);
      if(x < this.startX && y < this.startY) {
        style.left = x + "px"
        style.top = y + "px";
        style.width = this.startX - x + "px";
        style.height = this.startY - y + "px";
      }
      else if(x > this.startX && y > this.startY){
        style.left = this.startX + "px";
        style.top = this.startY + "px";
        style.width = x - this.startX + "px";
        style.height = y - this.startY + "px";
      }
      else if(x < this.startX && y > this.startY){
        style.left = x + "px";
        style.top = this.startY + "px";
        style.width = this.startX - x + "px";
        style.height = y - this.startY + "px";
      }
      else if(x > this.startX && y < this.startY){
        style.left = this.startX + "px";
        style.top = y + "px";
        style.width = x - this.startX + "px";
        style.height = this.startY - y + "px";
      }
    }
  }

  mouseup(){
    if(this.active){
      //색칠 ^&^
      let style = this.rect.style;
      style.backgroundColor = this.tool.color;
    }
    this.active = false;
  }
}


