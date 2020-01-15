class LineTool{
    constructor(app, tool){
        this.name = 'lineTool';
        this.app = app;
        this.tool = tool;
    }

    mousedown(e){
        //다운 할 때마다 새 경로 생성
        this.tool.path = new Array;
        this.app.addCanvas(); //캔버스 생성
        this.app.canvas = document.querySelector(`#tool_${this.app.toolNum}`); //생성한 캔버스 선택
        this.app.ctx = this.app.canvas.getContext("2d");

        this.savePoint(e); //그릴 때 마다 경로의 좌표, 캔버스의 번호, 색, 너비 저장
        this.draw(); //그리기
        
        //다운 할 때마다 새 트랙 생성
        this.track = new Track(this.app, this.tool, this);
    }
    
    mousemove(e){
        this.savePoint(e); //그릴 때 마다 경로의 좌표, 캔버스의 번호, 색, 너비 저장
        this.draw(); //그리기
        this.app.ctx.closePath();
    }

    mouseup(){
        this.tool.selectPath.push(this.tool.path);  //그린 경로를 넘겨받음
    }

    savePoint(e){
        console.log(parCanvas.offsetWidth);
        let { x, y } = this.tool.mousePoint(e);
        x = x < 0 ? 0 : x > parCanvas.offsetWidth ? parCanvas.offsetWidth : x;
        y = y < 0 ? 0 : y > parCanvas.offsetHeight ? parCanvas.offsetHeight : y;
        this.tool.path.push({x: x, y: y, c: this.app.canvasNum, w: this.tool.strokeSize, color: this.tool.color});
    }

    draw(){
        this.app.ctx.beginPath();
        this.app.ctx.lineCap = "round";

        //배열[i-1]과 [i]를 연결하면서 그림 (단 i가 0일떄는 제외 49번째줄)
        if(this.tool.path.length > 0){
            for(let i = 0; i < this.tool.path.length; i++){
                this.app.ctx.strokeStyle = this.tool.path[i].color;
                this.app.ctx.lineWidth = this.tool.path[i].w;
                if(i != 0)
                    this.app.ctx.moveTo(this.tool.path[i-1].x, this.tool.path[i-1].y);
                else    
                    this.app.ctx.moveTo(this.tool.path[i].x, this.tool.path[i].y);
                this.app.ctx.lineTo(this.tool.path[i].x, this.tool.path[i].y);
            }
        } 
        this.app.ctx.stroke();
    }
}



