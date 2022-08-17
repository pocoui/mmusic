import { useStore } from "vuex";
import { computed, watch, ref } from 'vue'
import { getLyric } from "@/service/song.js"
import Lyric from 'lyric-parser';

export default function uselyric({ songReady, currentTime }) {
    const currentLyric = ref(null) //存储被解析后的数组
    const currentLineNum = ref(0)
    const lyricScrollRef = ref(null)
    const lyricListRef = ref(null)
    const store = useStore()
    const pureMusicLyric = ref('')
    const playingLyric = ref('')

    const currentSong = computed(() => store.getters.currentSong)

    watch(currentSong, async (newSong) => {
        if (!newSong.id || !newSong.url) {
            return
        }
        
        stopLyric()
        currentLyric.value = null
        currentLineNum.value = 0
        pureMusicLyric.value = ''
        playingLyric.value = ''

        const lyric = await getLyric(newSong)
        // newSong.lyric=lyric 无法在mutation之外修改state 所以创建一个mutation方法
        store.commit('addSongLyric', {
            song: newSong,
            lyric
        })

        // 获取歌曲途中，切歌了
        if (currentSong.value.lyric !== lyric) {
            return
        }

        currentLyric.value = new Lyric(lyric, handleLyric)
        const hasLyric = currentLyric.value.lines.length

        //同步歌词
        if (hasLyric) {
            if (songReady.value) {
                playLyric()
            }
        } else {
            playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
        }
    })

    function playLyric() {
        const currentLyricVal = currentLyric.value
        if (currentLyricVal) {
            currentLyricVal.seek(currentTime.value * 1000)
        }
    }

    function stopLyric() {
        const currentLyricVal = currentLyric.value
        if (currentLyricVal) {
            currentLyricVal.stop()
        }
    }

    function handleLyric({ lineNum, txt }) {
        currentLineNum.value = lineNum
        playingLyric.value = txt
        const scrollComp = lyricScrollRef.value
        const listEl = lyricListRef.value
        if (!listEl) {
            return
        }
        if (lineNum > 5) {
            const lineEl = listEl.children[lineNum - 5]
            scrollComp.scroll.scrollToElement(lineEl, 1000)
        } else {
            scrollComp.scroll.scrollTo(0, 0, 1000)
        }
    }

    return {
        currentLyric,
        currentLineNum,
        playLyric,
        lyricListRef,
        lyricScrollRef,
        playingLyric,
        pureMusicLyric,
        stopLyric

    }




}