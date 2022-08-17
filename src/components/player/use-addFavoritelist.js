import { useStore } from "vuex";
import { computed } from "vue";
import { save, remove } from "@/assets/js/array-store"
import { FAVORITE_KEY } from "@/assets/js/constant"
export default function useAddFavorite() {
    const store = useStore()
    const favoritelist = computed(() => store.state.favoritelist)
    const maxLen = 100

    function favoriteIcon(song) {
        return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
    }

    function toggleFavorite(song) {
        let list
        if (isFavorite(song)) {
            list = remove(FAVORITE_KEY, compare)
        } else {
            list = save(song, FAVORITE_KEY, compare, maxLen)
        }
        store.commit('setFavoritelist', list)
        function compare(item) {
            return song.id === item.id
        }
    }

    function isFavorite(song) {
        return favoritelist.value.findIndex((item) => {
            return item.id === song.id
        }) > -1
    }
    
    return {
        favoriteIcon,
        toggleFavorite
    }
}