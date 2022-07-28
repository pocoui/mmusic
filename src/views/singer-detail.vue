<template>
  <div class="singer-detail">
    <music-list :songs="songs" :pic="pic" :title="title" :loading="loading"></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from "@/service/singer.js";
import { processSongs } from "@/service/song.js";
import MusicList from "@/components/base/music-list/music-list";
import storage from "good-storage";
import { SINGER_KEY } from "@/assets/js/constant";
export default {
  name: "singer-detail",
  data() {
    return {
      songs: [],
      loading:true
    };
  },
  components: { MusicList },
  props: {
    singer: Object,
  },
  computed: {
    computedSinger() {
      let ret = null;
      const singer = this.singer;
      if (singer) {
        ret = singer;
      } else {
        const cached = storage.session.get(SINGER_KEY);
        //存储的sessionStorage和页面的url的id一致
        if (cached && cached.mid === this.$route.params.id) {
          ret = cached;
        }
      }
      return ret;
    },
    pic() {
      const singer = this.computedSinger;
      return singer && singer.pic;
    },
    title() {
      const singer = this.computedSinger;
      return singer && singer.name;
    },
  },
  async created() {
    const result = await getSingerDetail(this.computedSinger);
    this.songs = await processSongs(result.songs);

    this.loading=false
  },
};
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>