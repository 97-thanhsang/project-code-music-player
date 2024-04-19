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

const heading = $('header h2');

const player = $('.player');
const cd = $(".cd");
const cdThumb = $('.cd-thumb');

const audio = $('#audio');

const playBtn = $('.btn-toggle-play');


const playlist = $(".playlist");
const progress = $('#progress');

const nextBtn = $('.btn-next');
const nextPre = $('.btn-prev');

const app = {
  cureentIndex: 0,
  isPlaying : false,
  songs: [
    {
      name: "Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
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
      path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
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
      path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song) => {
      return `
            <div class="song">
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
    const cdThumbAnimate = cdThumb.animate([
        {
            transform: 'rotate(360deg)'
        }
    ], {
        duration : 10000, //10s
        iterations : Infinity
    })
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
    playBtn.onclick = function() {
        if (_this.isPlaying) {
            audio.pause();
        }
        else
        {
            audio.play();    
        }

        // khi song play 
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // khi song pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();

        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // xử lý khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }


        // khi next song
        nextBtn.onclick = function () {
            _this.nextSong();
            audio.play();
        }
        // khi prev song
        nextPre.onclick = function () {
            _this.prevSong();
            audio.play();
        }

    }

  },
  loadCureentSong:function(){
    heading.textContent = this.curreentSong.name;
    cdThumb.style.backgroundImage = `url('${this.curreentSong.image}')`;
    audio.src = this.curreentSong.path;
  },
  nextSong : function () {
        this.cureentIndex++;
    if (this.cureentIndex >= this.songs.length) {
        this.cureentIndex = 0;
    }
    this.loadCureentSong();

  },
  prevSong : function () {
    this.cureentIndex--;
    if (this.cureentIndex < 0) {
        this.cureentIndex = this.songs.length - 1;
    }
    this.loadCureentSong();
  },
  
  start: function () {
    // định nghĩa các thuộc tính của object
    this.defineProperties();

    // lắng nghe / xử lý sự kiến dom events
    this.handleEvents();

    //tải thông tin bài hát đầu tiens vào UI khi chạy ứng dụng
    this.loadCureentSong();

    // render playlist
    this.render();
  },
};

app.start();
