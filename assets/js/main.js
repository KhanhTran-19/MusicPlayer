const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'PLAYER'

const cd = $('.cd')
const heading = $('header h3')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const player = $('.player')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    
    songs: [
        {
            name: 'Name1',
            singer: 'Singer1',
            path: './assets/music/song.mp3',
            img: './assets/image/img.jpg',
        },
        {
            name: 'Name2',
            singer: 'Singer2',
            path: './assets/music/song.mp3',
            img: './assets/image/img.jpg',
        },
        {
            name: 'Name3',
            singer: 'Singer3',
            path: './assets/music/song.mp3',
            img: './assets/image/img.jpg',
        },
        {
            name: 'Name4',
            singer: 'Singer4',
            path: './assets/music/song.mp3',
            img: './assets/image/img.jpg',
        },
        {
            name: 'Name5',
            singer: 'Singer5',
            path: './assets/music/song.mp3',
            img: './assets/image/img.jpg',
        },
        {
            name: 'Name6',
            singer: 'Singer6',
            path: './assets/music/song.mp3',
            img: './assets/image/img.jpg',
        },
        {
            name: 'Name7',
            singer: 'Singer7',
            path: './assets/music/song.mp3',
            img: './assets/image/img.jpg',
        }
    ],

    setConfig:function(key, value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'song--active' : ''}" data-index = "${index}">
                    <div class="thumb" style="background-image: url('${song.img}')">
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
        playlist.innerHTML = htmls.join("")
    },

    defineProperties:function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const cdWidth = cd.offsetWidth

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
        }

        playBtn.onclick = function() {
            if (app.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }
        
        audio.onplay = function() {
            app.isPlaying = true
            player.classList.add('playing')
        }

        audio.onpause = function() {
            app.isPlaying = false
            player.classList.remove('playing')
        }

        audio.ontimeupdate = function() {
            if(audio.duration){
                const currentProgress = Math.floor(audio.currentTime/audio.duration * 100)
                progress.value = currentProgress
            }
        }

        progress.oninput = function(e) {
            const seekTime = audio.duration * e.target.value / 100
            audio.currentTime = seekTime
        }

        nextBtn.onclick = function() {
            if(app.isRandom){
                app.playRandSong()
            }else {
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        prevBtn.onclick = function() {
            if(app.isRandom){
                app.playRandSong()
            }else {
                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        randBtn.onclick = function() {
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom)
            randBtn.classList.toggle('active', app.isRandom)
            app.playRandSong()
        }

        repeatBtn.onclick = function(){            
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat', app.isRepeat)
            repeatBtn.classList.toggle('active', app.isRepeat)
        }

        audio.onended = function() {
            if(app.isRepeat){
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')){
                if(songNode){
                    app.currentIndex = Number(songNode.getAttribute('data-index'))
                    app.loadCurrentSong()
                    app.render()
                    app.scrollToActiveSong()
                    audio.play()
                }
                // if(e.target.closest('.option')){
                //     //Handle song option
                // }
            }
        }
    },

    scrollToActiveSong: function() {
        $('.song--active').scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        })
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path

    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length-1
        }
        this.loadCurrentSong()
    },

    playRandSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function() {
        this.loadConfig()
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()

        randBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()