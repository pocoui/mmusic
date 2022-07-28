import { PLAY_MODE } from "@/assets/js/constant.js"
import { shuffle } from "@/assets/js/util"

export function selectPlay({ commit }, { list, index }) {
    commit("setPlayMode", PLAY_MODE.sequence)
    commit("setSequenceList", list)
    commit("setPlayingState", true)
    commit("setFullScreen", true)
    commit("setPlaylist", list)
    commit("setCurrentIndex", index)
}

export function randomPlay({ commit }, list ) {
    commit("setPlayMode", PLAY_MODE.random)
    commit("setSequenceList", list)
    commit("setPlayingState", true)
    commit("setFullScreen", true)
    commit("setPlaylist", shuffle(list))//shuffle
    commit("setCurrentIndex", 0)
}

export function changeMode({ commit, state }, mode) {
    if (mode === PLAY_MODE.random) {
        commit('setPlaylist',shuffle(state.sequenceList))
    } else {
        commit('setPlaylist',state.sequenceList)
    }
    commit('setPlayMode',mode)
}