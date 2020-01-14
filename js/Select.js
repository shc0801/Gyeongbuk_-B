class Select{
    constructor(app, tool){
        this.app = app;
        this.tool = tool;
    }

    mousedown(e){
        const {x, y} = this.tool.mousePoint(e);
        this.tool.clearCanvas();
        this.tool.clearRect();
        this.tool.clearText();
        this.tool.clearTrack();
        this.cheak(e);
        this.startX = x;
        this.startY = y;

        if(this.tool.move.line){
            this.canvasLeft = this.canvas.offsetLeft;
            this.canvasTop = this.canvas.offsetTop;
            return;
        }

        if(this.tool.move.rect){
            this.rect.style.position = 'absolute';
            this.rectLeft = this.rect.offsetLeft;
            this.rectTop = this.rect.offsetTop;
            return;
        }
        
        if(this.tool.move.text){
            this.spanLeft = this.span.offsetLeft;
            this.spanTop = this.span.offsetTop;
            return;
        }
    }
    
    mousemove(e){
        const {x, y} = this.tool.mousePoint(e);
        if(this.tool.move.line){
            this.canvas.style.left = this.canvasLeft + x - this.startX + 'px';
            this.canvas.style.top = this.canvasTop + y - this.startY + 'px';
            return;
        }

        if(this.tool.move.rect){
            this.rect.style.left = this.rectLeft + x - this.startX + 'px'; 
            this.rect.style.top = this.rectTop + y - this.startY + 'px';
            return;
        }
        
        if(this.tool.move.text){
            this.span.style.left = this.spanLeft + x - this.startX + 'px'; 
            this.span.style.top = this.spanTop + y - this.startY + 'px';
            return;
        }
    }

    mouseup(e){
        this.tool.move.line = false;
        this.tool.move.rect = false;
        this.tool.move.text = false;
        this.canvas = null;
    }

    cheak(e){
        const {x, y} = this.tool.mousePoint(e);

        for(let i = this.app.toolList.length - 1; i >= 0; i--){
            this.app.selectTool = document.querySelector(`#${this.app.toolList[i]}`)
            if(this.app.selectTool.tagName === 'CANVAS'){
                this.canvas = this.app.selectTool;
                this.ctx = this.canvas.getContext("2d");
                this.color = this.ctx.getImageData(x - this.canvas.offsetLeft, y - this.canvas.offsetTop, 100, 100).data[3];
                if(this.color != 0){
                    this.lineSelect();
                    this.tool.move.line = true;
                    this.canvas = this.app.selectTool;
                    this.trackSelect();
                    return;
                }
            }else if(this.app.selectTool.tagName === 'DIV'){
                let rect = this.app.selectTool;
                if((rect.offsetLeft <= x) &&  
                   (x <= rect.offsetLeft + rect.offsetWidth)){ 
                    if((rect.offsetTop <= y) &&
                        (y <= rect.offsetTop + rect.offsetHeight)){
                        this.rect = this.app.selectTool;
                        this.rect.style.borderColor = borderColor;
                        this.tool.move.rect = true;
                        this.trackSelect();
                        return;
                    }
                }
                this.tool.move.rect = false;
            }else if(this.app.selectTool.tagName === 'SPAN'){
                let span = this.app.selectTool;
                if((span.offsetLeft <= x) &&  
                   (x <= span.offsetLeft + span.offsetWidth)){ 
                    if((span.offsetTop <= y) &&
                        (y <= span.offsetTop + span.offsetHeight)){
                        this.span = this.app.selectTool;
                        this.span.style.borderColor = borderColor;
                        this.tool.move.text = true;
                        this.trackSelect();
                        return;

                    }
                }
                this.tool.move.text = false;
            }
        }
    }

    

    lineSelect(){
        this.pathNum = this.canvas.classList[2];
        let line = this.tool.selectPath[this.pathNum];
        this.ctx.beginPath();
        for(let i = 0; i < line.length; i++){
            //선택 테두리 그리기
            this.ctx.lineCap = "round";
            this.ctx.strokeStyle = borderColor;
            this.ctx.lineWidth = borderWidth + Number(line[i].w) ;
            if(i != 0)
                this.ctx.moveTo(line[i-1].x, line[i-1].y);
            else    
                this.ctx.moveTo(line[i].x, line[i].y);
            this.ctx.lineTo(line[i].x, line[i].y);
        }
        this.ctx.stroke();

        this.ctx.beginPath();
        for(let i = 0; i < line.length; i++){
            //본래 선 그리기
            this.ctx.lineCap = "round";
            this.ctx.strokeStyle = line[i].color;
            this.ctx.lineWidth = line[i].w;
            if(i != 0)
                this.ctx.moveTo(line[i-1].x, line[i-1].y);
            else    
                this.ctx.moveTo(line[i].x, line[i].y);
            this.ctx.lineTo(line[i].x, line[i].y);
        }
        this.ctx.stroke();
    }

    trackSelect(){
        let trackSelect = document.querySelectorAll(`.${this.app.selectTool.id}`);
        trackSelect.forEach(track=>{
            track.style.backgroundColor = borderColor;
        })
    }
}