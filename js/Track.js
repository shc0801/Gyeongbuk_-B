class Track{
    constructor(app, tool, nowTool){
        this.app = app;
        this.tool = tool;
        this.nowTool = nowTool;

        this.app.trackAble = true;
        this.swap = false;
        this.downTrack = null;       //바꾸는 원소
        this.upTrack = null;       //바뀌는 원소

        this.track = document.createElement('div');
        this.track.id = `track_${this.app.trackNum++}`
        this.track.classList.add('tool_track');
        this.track.classList.add(`tool_${this.app.toolNum}`);
        this.track.draggable = 'true';

        this.trackIn = `<div id="tool_track" class="left"></div>
                        <div id="tool_track" class="center"></div>
                        <div id="tool_track" class="right"></div>
                        <div id="bg"></div>`;

        this.track.innerHTML = this.trackIn;
        this.app.track.prepend(this.track);
        this.moveTrack = document.querySelectorAll('.tool_track');
        this.toolTrack = document.querySelector('.tool_track');
        this.posTrack = document.querySelectorAll('.tool_track > div');
        this.moveToolTrack = document.querySelectorAll('#tool_track');

        this.trackList = document.querySelector(".track");
        this.trackMove = false;
        this.addEvent();
    }

    addEvent(){
        this.posTrack.forEach(track=>{
            track.addEventListener("mousedown", e=>{
                if(this.tool.nowTool != 'select') return;
                this.bg = track.parentElement.lastChild;
                this.nowTrack = e.target.parentElement;
                const {x} = this.tool.mousePoint(e);
                this.trackMove = true;
                this.trackWidth = this.nowTrack.offsetWidth; 
                this.trackLeft = this.nowTrack.offsetLeft; 
                this.startX = x;
                this.pos = track;
            })
        })

        window.addEventListener("mousemove", e=>{
            if(!this.trackMove) return;
            const {x} = this.tool.mousePoint(e);
            let max;
            let left = x;
            let width = this.app.parTrack.offsetWidth;
            let style = this.nowTrack.style;
            if(this.pos.classList[0] === 'left'){
                left = x; 
                max = this.nowTrack.offsetWidth + this.nowTrack.offsetLeft;
                left = left < 0 ? 0 : left > max ? max : left;
                style.left = left + 'px';
                this.bg.style.left = -(left) + 'px';
                style.width = this.trackLeft + this.trackWidth - left + 'px';
            }
            if(this.pos.classList[0] === 'center'){
                left = this.trackLeft + x - this.startX; 
                max = this.bg.offsetWidth - this.nowTrack.offsetWidth;
                left = left < 0 ? 0 : left > max ? max : left;
                style.left = left + 'px';
                this.bg.style.left = -left + 'px';
            }
            if(this.pos.classList[0] === 'right'){
                width = this.trackWidth + x - this.startX;
                max = this.bg.offsetWidth - this.nowTrack.offsetLeft;
                width = width < 0 ? 0 : width > max ? max : width;
                style.width = width + 'px';
            }
            let toolId = e.target.parentElement.classList[1];
            let startTime = this.nowTrack.offsetLeft * this.app.nowVideo.duration / this.app.parTrack.offsetWidth;
            let mainTainTime = this.nowTrack.offsetWidth * this.app.nowVideo.duration / this.app.parTrack.offsetWidth;
            this.app.time[this.trackNum] = {start: startTime, main: mainTainTime ,id: toolId}

            this.app.startTimeDom.innerHTML = this.app.time[this.trackNum].start.time();
            this.app.mainTainDom.innerHTML = this.app.time[this.trackNum].main.time();
        })

        window.addEventListener("mouseup", e=>{
            if(!this.trackMove) return;
            this.trackMove = false;
        })

        this.moveTrack.forEach((track)=>{
            track.addEventListener("dragstart", e=>{
                e.stopPropagation();
                if(e.target.parentElement.classList[0] !== 'track') return;
                this.trackMove = false;
                this.downTrack = track;
                this.swap = true;
            })
            track.addEventListener("mousedown", e=>{
                if(this.tool.nowTool != 'select') return;
                const {x, y} = this.tool.mousePoint(e);
                this.startX = x;
                this.startY = y;

                this.trackNum = e.target.parentElement.id.slice(6, 7)
                if(this.app.time[this.trackNum] === undefined){
                    this.app.time[this.trackNum] = {start: 0, main: this.app.nowVideo.duration};
                }
                
                this.app.startTimeDom.innerHTML = this.app.time[this.trackNum].start.time();
                this.app.mainTainDom.innerHTML = this.app.time[this.trackNum].main.time();

                this.trackLeft = track.offsetLeft;
                this.trackTop = track.offsetTop;
                
                this.tool.clearCanvas();
                this.tool.clearRect();
                this.tool.clearText();
                this.tool.clearTrack();
                
                track.style.backgroundColor = borderColor;

                let selectTool = document.querySelector(`#${track.classList[1]}`);
                if(selectTool.tagName === 'CANVAS'){
                    this.canvas = selectTool;
                    this.ctx = this.canvas.getContext('2d');
                    this.lineSelect();
                    this.tool.move.line = true;
                    return;
                }else if(selectTool.tagName === 'DIV'){
                    let rect = selectTool;
                    rect.style.borderColor = borderColor;
                    this.tool.move.rect = true;
                    return;
                }else if(selectTool.tagName === 'SPAN'){
                    let span = selectTool;
                    span.style.borderColor = borderColor;
                    this.tool.move.text = true;
                    return;
                }
            })
            track.addEventListener("dragover", e=>{
                e.preventDefault();
            });
            window.addEventListener("drop", e=>{
                e.preventDefault();
                if(!this.swap) return;
                if(e.target.parentElement.classList[0] !== 'tool_track') return;
                if(this.tool.nowTool != 'select') return;

                this.upTrack = e.target.parentElement;

                let upTool = document.querySelector(`#${this.upTrack.classList[1]}`);
                let downTool = document.querySelector(`#${this.downTrack.classList[1]}`);

                let temp = this.upTrack.classList[1];
                this.upTrack.className = 'tool_track';
                this.upTrack.classList.add(this.downTrack.classList[1]);

                this.downTrack.className = 'tool_track';
                this.downTrack.classList.add(temp);

                upTool.style.zIndex = this.upTrack.classList[1].slice(5, 6);
                upTool.id = this.upTrack.classList[1];

                downTool.style.zIndex = this.downTrack.classList[1].slice(5, 6);
                downTool.id = this.downTrack.classList[1];

                
                let saveTrack = this.upTrack.nextElementSibling;
                if(saveTrack === this.downTrack) saveTrack = this.upTrack 
                this.trackList.insertBefore(this.upTrack, this.downTrack);
                this.trackList.insertBefore(this.downTrack, saveTrack);

                this.app.toolList[this.upTrack.classList[1].slice(5, 6) - 1] = this.upTrack.classList[1];
                this.app.toolList[this.downTrack.classList[1].slice(5, 6) - 1] = this.downTrack.classList[1];
                event.stopImmediatePropagation();
                this.swap = false;
                return;
            })
        })
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
}

