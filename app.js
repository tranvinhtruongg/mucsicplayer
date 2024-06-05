const $ =document.querySelector.bind(document);
const $$ =document.querySelectorAll.bind(document);


const PLAYER_STORAGE_KEY = 'trường Player'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const ranDomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist =$('.playlist')
const volumne= $('.volumne__amount')
const volumeFull = $('.bxs-volume-full')
const volumeMute = $('.bxs-volume-mute')


const app ={
    currentIndex: 0,
    isPlaying: false,
    isRanDom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs:[
        {
            name : 'Chúng ta của hiện tại',
            singer:'Sơn Tùng MTP',
            path:'assets/music/y2mate.com - chúng ta của hiện tại  SƠN TÙNG MTP.mp3',
            image:'https://thanhnien.mediacdn.vn/uploaded/trucdl/2021_02_23/sontungdaonhac2_WSAU.jpg?width=500'
        },
        {
            name : 'Nevada',
            singer:'Sơn Tùng MTP',
            path:'assets/music/utomp3.com - Vicetone  Nevada ft Cozi Zuehlsdorff.mp3',
            image:'assets/images/nevada.png'
        },
        {
            name : 'Skyfall',
            singer:'Adele',
            path:'assets/music/utomp3.com - Adele  Skyfall Official Lyric Video.mp3',
            image:'assets/images/skyfall.png'
        },
        {
            name : 'Dynasty',
            singer:'MIIA',
            path:'assets/music/utomp3.com - Dynasty Official Music Video  MIIA.mp3',
            image:'assets/images/Dynasty.png'
        },
        {
            name : 'Gym Class Heroes',
            singer:'Stereo Hearts ft. Adam Levine',
            path:'assets/music/y2mate.com - Gym Class Heroes Stereo Hearts ft Adam Levine OFFICIAL VIDEO.mp3',
            image:'assets/images/Gym Class Heroes.png'
        },
        {
            name : 'Animals',
            singer:'Maroon 5',
            path:'assets/music/y2mate.com - Maroon 5  Animals Lyric Video.mp3',
            image:'assets/images/Animals.png'
        },

    ],
    setConfig: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
    },
    progressInput: function(item) {
        let sliderValue = item.value;
        item.style.background = `linear-gradient(to right, var(--color-theme) ${sliderValue}%, #4d4d4d ${sliderValue}%)`;
    },
    render: function(){
        const htmls = this.songs.map((song,index) => {
            return `
                <div class="song  ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties:function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function(){
        const _this = this
        const cdWidth = cd.offsetWidth
        
        //xử lý CD quay và dừng
        const cdThumbanimate=cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration:10000,//10 seconds 
            iterations: Infinity
        })
        cdThumbanimate.pause()

        //xử lý phóng to thu nhỏ CD
        document.onscroll = function (){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ?newCdWidth + 'px':0;
            cd.style.opacity = newCdWidth / cdWidth
        }

        //xử lý khi người dùng click play/pause
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
                cdThumbanimate.pause()
            }else{
                audio.play()
                cdThumbanimate.play()
            }
        }

        //khi song được play 
        audio.onplay =function(){
            _this.isPlaying=true;
            player.classList.add('playing')
            cdThumbanimate.play()
        }

        //khi song bị pause 
        audio.onpause =function(){
            _this.isPlaying=false;
            player.classList.remove('playing')
            cdThumbanimate.pause()
        }

        //khi tiến độ bài hát thay đổi 


        audio.ontimeupdate =function(){
            if(audio.duration){
                const progressPersent = Math.floor(audio.currentTime/audio.duration*100)
                progress.value = progressPersent
            }
        }


        //Xử lý khi tua song
        progress.onchange = function(e){
            const seekTime= audio.duration / 100*e.target.value
            audio.currentTime = seekTime
        }

        //Xử lý khi next song

        nextBtn.onclick=function(){
            if(_this.isRanDom){
                _this.playRanDomSong()
            }
            else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //Xử lý khi prev song

        prevBtn.onclick=function(){
            if(_this.isRanDom){
                _this.playRanDomSong()
            }
            else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //xử lý bật tắt random song

        ranDomBtn.onclick=function(e){
            _this.isRanDom =!_this.isRanDom
            _this.setConfig('isRanDom',_this.isRanDom)
            ranDomBtn.classList.toggle("active",_this.isRanDom)
        }

        //xử lý phát lại 1 song
        repeatBtn.onclick=function(){
            _this.isRepeat =!_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle("active",_this.isRepeat)

        }
        
        // Xử lý next song khi audio ended
        audio.onended=function(){
            if(_this.isRepeat){
                audio.play()
            }
            else{
                nextBtn.click()
            }
        }

        // lắng nghe hành vi click playlist
        playlist.onclick=function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                //xử lý khi click vào song 
                if(songNode){
                    _this.currentIndex=Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }
                //xử lý vào option
                if(e.target.closest('.option')){

                }
            }
        }

        //xử lý khi tăng giảm âm lượng
        volumne.onchange = function(){
            audio.volume = volumne.value / 100
            if(audio.volume===0|| audio.muted)
            {
                volumeFull.classList.add("hidden")
                volumeMute.classList.remove("hidden")
            }
            else
            {
                volumeFull.classList.remove("hidden")
                volumeMute.classList.add("hidden")
            }
        }

        //xử lý tắt bật volume 

    },

    scrollToActiveSong: function(){
        setTimeout(() => {
        $('.song.active').scrollIntoView({
            behavior:'smooth',
            block:'end'
        })
        },300)
        console.log(123)
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src=this.currentSong.path
    },
    loadConfig: function(){
        this.isRanDom= this.config.isRanDom
        this.isRepeat= this.config.isRepeat

    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex <0){
            this.currentIndex = this.songs.length-1
        }
        this.loadCurrentSong()
    },
    playRanDomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        }
        while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
        audio.play()
    },
    loadVolume: function()  {
        if(audio.volume === 0 || audio.muted) {
            volumeFull.classList.add("hidden");
            volumeMute.classList.remove("hidden");
        } else {
            volumeFull.classList.remove("hidden");
            volumeMute.classList.add("hidden");
        }
    },
    start:function(){
        //gắn cấu hình từ config 
        this.loadConfig()
        //định nghĩa các thuộc tính cho object
        this.defineProperties()
        //lắng nghe /xử lý các sự kiện(Dom Events)
        this.handleEvent()

        //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng 
        this.loadCurrentSong()

        //hiển thị trạng thái volume
        this.loadVolume()

        //render playlists
        this.render()

        //hiển thị trạng thái ban đầu của button repeat và random
        ranDomBtn.classList.toggle("active",this.isRanDom)
        repeatBtn.classList.toggle("active",this.isRepeat)
    }
}
app.start();
