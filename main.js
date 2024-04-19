/**
 * 1.   render songs
 * 2.   scroll top
 * 3.   lay / pause / seek
 * 4.   cd rotate
 * 5.   next / prev
 * 6.   random
 * 7.   next / repeat when emded
 * 8.   active song
 * 9.   scroll active song into view
 * 10.  play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'NTS';

const heading = $('header h2');

const player = $('.player');
const cd = $(".cd");
const cdThumb = $('.cd-thumb');

const audio = $('#audio');

const playBtn = $('.btn-toggle-play');


const playlist = $(".playlist");
const progress = $('#progress');

const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
  cureentIndex: 0,
  isPlaying : false,
  isRandom : false,
  isRepeat : false,
  config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key,value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
  },
  
  songs: [
    {
      name: "Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      path: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },
    {
      name: "Tu Phir Se Aana",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg",
    },
    {
      name: "Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path: "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/lose.ogg",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg",
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "https://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/ateapill.ogg",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "https://commondatastorage.googleapis.com/codeskulptor-assets/Evillaugh.ogg",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song,index) => {
      return `
            <div class="song ${index === this.cureentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function(){
    Object.defineProperty(this,'curreentSong',{
        get : function(){
            return this.songs[this.cureentIndex];
        }
    })
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // xử lý cd quay / dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000, //10s
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    // xử lý phóng to / thu nhỏ cd
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
      // console.log(newCdWidth);
    };

    // xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // khi song play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // khi song pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // xử lý khi tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    // khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();

    };

    // xử lý bật / tắt random
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom',_this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // xử lý lập lại song
    repeatBtn.onclick = function () {
        _this.isRepeat = !_this.isRepeat;
        _this.setConfig('isRepeat',_this.isRepeat);
        repeatBtn.classList.toggle('active',_this.isRepeat);
    };

    // xử lý next song khi audio ended
    audio.onended = function () {
        if (_this.isRepeat) {
            audio.play();
        }
        else
        {
            nextBtn.click();
        }
    };



    // lắng nghe hành vi click vào playlisst
    playlist.onclick = function (e) {
        const songNode = e.target.closest('.song:not(.active)');
        if (
            songNode
             ||
            e.target.closest('.option')                
        ) {
            // xử lý click vào song
            if (songNode) {
                // console.log(songNode.getAttribute('data-index'))
                console.log(songNode.dataset.index);
                _this.cureentIndex = Number(songNode.dataset.index);
                _this.loadCureentSong();
                _this.render();
                audio.play();

            }

            // xử lý click vào option
            if (e.target.closest('.option')  ) {
                
            }
        }
    };

  },
  scrollToActiveSong: function () {
    setTimeout(() => {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block : 'end'
        });
    }, 200);
  },
  loadCureentSong:function(){
    heading.textContent = this.curreentSong.name;
    cdThumb.style.backgroundImage = `url('${this.curreentSong.image}')`;
    audio.src = this.curreentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong:function () {
        this.cureentIndex++;
    if (this.cureentIndex >= this.songs.length) {
        this.cureentIndex = 0;
    }
    this.loadCureentSong();

  },
  prevSong:function () {
    this.cureentIndex--;
    if (this.cureentIndex < 0) {
        this.cureentIndex = this.songs.length - 1;
    }
    this.loadCureentSong();
  },
  playRandomSong : function () {
    let newIndex;
    do{
        newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.cureentIndex)

    this.cureentIndex = newIndex;

    this.loadCureentSong();

  },
  start: function () {
    // gắn cấu hình từ config vào object app
    this.loadConfig();

    // định nghĩa các thuộc tính của object
    this.defineProperties();

    // lắng nghe / xử lý sự kiến dom events
    this.handleEvents();

    //tải thông tin bài hát đầu tiens vào UI khi chạy ứng dụng
    this.loadCureentSong();

    // render playlist
    this.render();


    // hiển thị trạng thái ban đầu của button repeat và random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle('active',this.isRepeat);

  },
};

app.start();
