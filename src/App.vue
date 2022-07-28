<template>
  <m-header></m-header>
  <tab></tab>
  <router-view></router-view>

</template>

<script>
import MHeader from "@/components/header/header";
import Tab from "@/components/tab/tab";

export default {
  name: "app",
  components: {
    MHeader,
    Tab,
  },
};
</script>
<style lang="scss" scoped>
</style>
