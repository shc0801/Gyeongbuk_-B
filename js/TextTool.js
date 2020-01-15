class TextTool{
    constructor(app, tool){
        this.app = app;
        this.tool = tool;
    }

    mousedown(e){
        const {x, y} = this.tool.mousePoint(e);

        if(this.tool.active){
            if(this.input.value === '')
                this.input.remove();
            else{
                this.input.remove();
                this.addSpan();
            }
            this.tool.active = false;
        }
        else{
            this.addInput(x, y);
            this.track = new Track(this.app, this.tool, this);
        }
    } 

    mouseup(){
        this.input.focus();
    }

    addInput(x, y){
        this.input = document.createElement("input");
        this.input.classList.add('tool_input');  
        this.input.type = 'text';

        let style = this.input.style;
        style.top = y + 'px';
        style.left = x + 'px';
        style.color = this.tool.color;
        style.fontSize = this.tool.fontSize + 'px';
        style.zIndex = this.app.toolNum;

        this.nowMovie = document.querySelector(`#tool_${this.app.movieId}`);
        this.nowMovie.appendChild(this.input);   // create
        this.app.toolNum++;
        this.tool.active = true;
    }

    addSpan(){
        this.span = document.createElement("span");
        this.span.id = `tool_${this.app.toolNum}`;
        this.span.classList.add('tool_span');  
        this.span.classList.add(`span_${this.app.spanNum}`);  
        this.span.innerText = this.input.value
        
        this.span.style = this.input.style.cssText;

        this.nowMovie = document.querySelector(`#tool_${this.app.movieId}`);
        this.nowMovie.appendChild(this.span);   // create
        this.app.toolList.push(`tool_${this.app.toolNum}`);
        this.app.spanNum++;
    }
}

