<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers" @select="selectSinger"></index-list>
    <router-view></router-view>

    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :singer="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from "@/service/singer";
import indexList from "@/components/base/index-list/index-list";
import storage from "good-storage";
import { SINGER_KEY } from "@/assets/js/constant";
export default {
  name: "singer",
  data() {
    return {
      singers: [],
      selectedSinger: null,
    };
  },
  components: {
    indexList,
  },
  async created() {
    const result = await getSingerList();
    this.singers = result.singers;
  },
  methods: {
    selectSinger(singer) {
      this.selectedSinger = singer;
      //将singer存储到sessionStorage
      this.cacheSinger(singer);
      this.$router.push({
        path: `/singer/${singer.mid}`,
      });
    },
    cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer);
    },
  },
};
</script>
<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>