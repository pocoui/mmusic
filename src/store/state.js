import { PLAY_MODE } from "@/assets/js/constant.js"
import { load } from "@/assets/js/array-store"
import {FAVORITE_KEY} from "@/assets/js/constant"
const state = {
    sequenceList: [],
    playlist: [],
    playing: false,
    playMode: PLAY_MODE.sequence,
    currentIndex: 0,
    fullScreen: false,
    favoritelist:load(FAVORITE_KEY)
}
export default state