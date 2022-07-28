const mutations = {
    //修改播放状态
    setPlayingState(state, playing) {
        state.playing = playing
    },
    //顺序播放
    setSequenceList(state, list) {
        state.sequenceList = list
    },
    //播放列表
    setPlaylist(state, list) {
        state.playlist = list
    },
    //播放模式
    setPlayMode(state, mode) {
        state.playMode = mode
    },
    setCurrentIndex(state, index) {
        state.currentIndex = index
    },
    setFullScreen(state, fullScreen) {
        state.fullScreen = fullScreen
    },
    setFavoritelist(state, list) {
        state.favoritelist=list
    }

}

export default mutations