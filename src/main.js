import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//懒加载
import lazyPlugin from 'vue3-lazy'

//引入全局样式文件
import "@/assets/scss/index.scss"
//注册全局组件loadingDirective
import loadingDirective from "@/components/base/loading/directive"
import noResultDirective from "@/components/base/no-result/directive"
createApp(App).use(store).use(router).use(lazyPlugin, {
    loading: require('@/assets/images/default.png')
}).directive('loading', loadingDirective)
    .directive('noResult', noResultDirective)
    .mount('#app')
