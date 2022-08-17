<template>
  <div class="player" v-show="playlist.length">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.pic" />
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.siner }}</h2>
      </div>
      <div
        class="middle"
        @touchstart.prevent="onMiddleTouchStart"
        @touchmove.prevent="onMiddleTouchMove"
        @touchend.prevent="onMiddleTouchEnd"
      >
        <div class="middle-l" :style="middleLStyle">
          <div ref="cdWrapperRef" class="cd-wrapper">
            <div ref="cdRef" class="cd">
              <img
                ref="cdImageRef"
                class="image"
                :class="cdCls"
                :src="currentSong.pic"
              />
            </div>
          </div>
          <!-- cd lyirc -->
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{ playingLyric }}</div>
          </div>
        </div>
        <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
          <div class="lyric-wrapper">
            <div v-if="currentLyric" ref="lyricListRef">
              <p
                class="text"
                :class="{ current: currentLineNum === index }"
                v-for="(line, index) in currentLyric.lines"
                :key="line.num"
              >
                {{ line.txt }}
              </p>
            </div>
            <!-- !hasLyric -->
            <div class="pure-music" v-show="pureMusicLyric">
              <p>{{ pureMusicLyric }}</p>
            </div>
          </div>
        </scroll>
      </div>

      <div class="bottom">
        <!-- 切换 -->
        <div class="dot-wrapper">
          <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
          <span class="dot" :class="{ active: currentShow === 'lyric' }"></span>
        </div>
        <!-- 进度条 -->
        <div class="progress-wrapper">
          <span class="time time-l">{{ timeFormat(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar
              :progress="progress"
              @progress-changed="onProgressChanged"
              @progress-changing="onProgressChanging"
            ></progress-bar>
          </div>
          <span class="time time-r">{{
            timeFormat(currentSong.duration)
          }}</span>
        </div>
        <!-- 5个按钮 -->
        <div class="operators">
          <div class="icon i-left">
            <i :class="modeIcon" @click="changeMode"></i>
          </div>
          <div class="icon i-left">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center">
            <i :class="playIcon" @click="togglePlay"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-next" @click="next"></i>
          </div>
          <div class="icon i-right">
            <i
              @click="toggleFavorite(currentSong)"
              :class="favoriteIcon(currentSong)"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <mini-player :progress="progress" :togglePlay="togglePlay"></mini-player>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import useMode from "./use-mode";
import useAddFavorite from "./use-addFavoritelist";
import progressBar from "./progress-bar.vue";
import { timeFormat } from "@/assets/js/util";
import useCd from "./use-cd";
import uselyric from "./use-lyric";
import Scroll from "@/components/base/scroll/scroll";
import useMiddleInteractive from "./useMiddleReactive";
import miniPlayer from "./mini-player.vue"

export default {
  name: "player",
  components: {
    progressBar,
    Scroll,
    miniPlayer
  },
  setup() {
    //data
    const songReady = ref(false);
    const audioRef = ref(false);
    const currentTime = ref(0);

    let processChanging = false; //设置改变进度条的优先级

    const store = useStore();
    const fullScreen = computed(() => store.state.fullScreen);
    const currentSong = computed(() => store.getters.currentSong);

    const playing = computed(() => store.state.playing);
    const currentIndex = computed(() => store.state.currentIndex);
    const playlist = computed(() => store.state.playlist);

    // hooks
    const { modeIcon, changeMode } = useMode();

    const { favoriteIcon, toggleFavorite } = useAddFavorite();

    const { cdCls, cdRef, cdImageRef } = useCd();

    //lyric
    const {
      currentLyric,
      currentLineNum,
      playLyric,
      lyricListRef,
      lyricScrollRef,
      playingLyric,
      pureMusicLyric,
      stopLyric,
    } = uselyric({ songReady, currentTime });

    const {
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchEnd,
      onMiddleTouchMove,
      onMiddleTouchStart,
    } = useMiddleInteractive();

    //播放按钮随播放状态切换
    const playIcon = computed(() => {
      return playing.value ? "icon-pause" : "icon-play";
    });

    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration;
    });

    //切换歌曲
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return;
      }
      currentTime.value = 0;
      songReady.value = false;

      const audioEl = audioRef.value;
      audioEl.src = newSong.url;
      audioEl.play();
      store.commit("setPlayingState", true);
    });

    //通过切换按钮，改变歌曲状态
    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return;
      }
      const audioEl = audioRef.value;
      if (newPlaying) {
        playLyric();
        audioEl.play();
      } else {
        stopLyric();
        audioEl.pause();
      }
    });

    function goBack() {
      store.commit("setFullScreen", false);
    }

    function togglePlay() {
      if (!songReady.value) {
        return;
      }
      store.commit("setPlayingState", !playing.value);
    }

    //非用户交互
    function pause() {
      store.commit("setPlayingState", false);
    }

    function prev() {
      const list = playlist.value;
      if (!list.length || !songReady.value) {
        return;
      }
      let index = currentIndex.value - 1;
      if (index === -1) {
        index = list.length - 1;
      }
      store.commit("setCurrentIndex", index);
    }

    function next() {
      const list = playlist.value;
      if (!list.length || !songReady.value) {
        return;
      }
      let index = currentIndex.value + 1;
      if (index === list.length) {
        index = 0;
      }
      store.commit("setCurrentIndex", index);
    }

    function ready() {
      if (songReady.value) {
        return;
      }
      songReady.value = true;
      playLyric();
    }

    function loop() {
      const audioEl = audioRef.value;
      audioEl.currentTime = 0;
      audioEl.play();
      store.commit("setPlayingState", true);
    }

    //及时歌曲出问题，也可以切换至上至下
    function error() {
      songReady.value = true;
    }

    function updateTime(e) {
      if (!processChanging) {
        currentTime.value = e.target.currentTime;
      }
    }

    function onProgressChanging(progress) {
      processChanging = true;
      currentTime.value = currentSong.value.duration * progress;
      playLyric();
      stopLyric();
    }

    function onProgressChanged(progress) {
      // if(isNaN(currentTime)) return
      processChanging = false;
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress;
      if (!playing.value) {
        store.commit("setPlayingState", true);
      }
      playLyric();
    }

    return {
      //data
      currentTime,
      audioRef,
      fullScreen,
      currentSong,
      goBack,
      playIcon,
      togglePlay,
      pause,
      prev,
      next,
      currentIndex,
      playlist,
      ready,
      error,
      modeIcon,
      changeMode,
      favoriteIcon,
      toggleFavorite,
      progress,
      updateTime,
      timeFormat,
      loop,
      onProgressChanging,
      onProgressChanged,
      //cd
      cdCls,
      cdRef,
      cdImageRef,
      //lyric
      currentLyric,
      currentLineNum,
      playLyric,
      lyricListRef,
      lyricScrollRef,
      playingLyric,
      pureMusicLyric,
      stopLyric,
      //middle-interactive
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchEnd,
      onMiddleTouchMove,
      onMiddleTouchStart,
    };
  },
};
</script>
<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        // display: none;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>