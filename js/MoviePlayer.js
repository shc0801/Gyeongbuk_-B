class MoviePlayer{
    constructor(app){
        this.app = app;
        this.playBtn = document.querySelector("#play");  //재생버튼
        this.pauseBtn = document.querySelector("#pause");  //정지 버튼
        this.movieList = new Array; 
        this.addEvent();

        this.overlap = false;
    }
    
    addEvent(){
        this.frame();
        document.querySelectorAll("img").forEach(movie=>{
            movie.addEventListener("click", (e)=>{
                //누른 이미지의 아이디(영화) 얻은뒤 업데이트
                this.app.movieId = e.toElement.id;
                this.videoUpdate();
            });
        });
    
        this.playBtn.addEventListener("click", ()=>{ //정지/재생
            if(this.app.movieId)
                this.moviePlay();
        });
        this.pauseBtn.addEventListener("click", ()=>{ //정지/재생
            if(this.app.movieId)
                this.moviePause();
        });
    }
    
    videoUpdate(){
        if(this.app.nowVideo){
            //비디오가 있었다면 일시중지, 숨김
            this.app.nowVideo.pause();
            this.app.nowVideo.style.visibility = "hidden";
        }

        //누른 비디오를 현재 비디오로 바꿈, 나타냄
        this.app.nowVideo = document.querySelector(`.${this.app.movieId}`);
        this.app.nowVideo.style.visibility = "visible";
        document.querySelector('#screen_text').style.visibility = "hidden";
        //동영상을 선택해주세요 택스트 설정
        document.querySelector(".cover_images").style.marginTop = '20px';
        this.app.movie = true; 

        this.videoTime(); //전체 비디오 시간
        
        // 클립생성
        this.movieList.forEach(movieList=>{
            if(movieList === this.app.movieId){ 
                this.overlap = true;
            }
        })

        if(!this.overlap){ //처음은 여기부터실행
            //무비 리스트에 현재 무비의 아이디 삽입
            this.movieList.push(this.app.movieId);
            this.addTool(); //각 무비별 클립(영화 바꿀 때 마다 각각 툴도 바뀌도록)
            this.addTrackClip(); //각 무비별 트랙
            
            this.timeTrack = document.querySelector("#time_view"); //이미지 누르면 나오는 회색 막대기
            this.timeTrack.style.visibility = "visible";
        }
        this.overlap = false;

        // 현재클립 선택
        this.movieList.forEach(movieList=>{
            document.querySelector(`#tool_${movieList}`).style.visibility = "hidden";
            document.querySelector(`#track_${movieList}`).style.display = "none";
        })
        // 트랙부분 제일 부모 불러오기, 표시하기
        this.app.track = document.querySelector(`#track_${this.app.movieId}`);
        document.querySelector(`#tool_${this.app.movieId}`).style.visibility = "visible";
        this.app.track.style.display = "block";
        parTrack.style.visibility = "visible";
    }

    addTool(){
        //무비별 툴 생성
        this.tool = document.createElement("div");
        this.tool.id = `tool_${this.app.movieId}`; //id
        this.tool.classList.add('tool');  //class
        parCanvas.appendChild(this.tool);  //삽입
    }

    addTrackClip(){
        this.track = document.createElement("div");
        this.track.id = `track_${this.app.movieId}` ;   //id
        this.track.classList.add('track')   ;   //class
        parTrack.prepend(this.track);   //삽입
    }
    
    moviePlay(){
        //재생, 재생시 프래임 반복
        this.app.nowVideo.play();
        console.log(document.querySelector(`#tool_${this.app.movieId}`))
    }

    moviePause(){
        //일시정지
        this.app.nowVideo.pause();
    }

    videoTime(){
        this.allTime = document.querySelector('#allTime');
        this.allTime.innerHTML = this.app.nowVideo.duration.time();
    }

    frame(){
        requestAnimationFrame(() => {
            this.frame();
        });

        if(this.app.movie){
            const {currentTime, duration} = this.app.nowVideo;
            let x = currentTime * this.track.width / duration;
            this.nowTime = document.querySelector('#nowTime');
            this.nowTime.innerHTML = this.app.nowVideo.currentTime.time();
            
            if(!this.app.cursor){
                let x = currentTime * this.app.parTrack.offsetWidth / duration;
                this.app.moveCursor(x);
            }
            else 
                this.app.nowVideo.pause();

            if(this.app.trackAble){
            this.app.time.forEach(time=>{
                    if(time.start <= this.app.nowVideo.currentTime && this.app.nowVideo.currentTime <= time.start + time.main){
                        let viewDom = document.querySelector(`#${time.id}`);
                        if(viewDom !== null)
                            viewDom.style.display = 'block';
                    }
                    else{
                        let hideDom = document.querySelector(`#${time.id}`);
                        if(hideDom !== null)
                            hideDom.style.display = 'none';
                    }
                })
            }
        }
    }

    setVideoTime(x){
        this.app.nowVideo.currentTime = this.app.nowVideo.duration * x / this.app.parTrack.offsetWidth;
    }
}

