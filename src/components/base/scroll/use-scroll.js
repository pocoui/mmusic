import { ref, onMounted, onUnmounted } from 'vue'
//核心滚动
import BScroll from '@better-scroll/core'
//监测content的dom的变化
import ObserveDOM from '@better-scroll/observe-dom'
BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef, options) {
    const scroll = ref(null)

    onMounted(() => {
        //此时计算容器高度和内容高度
        // debugger
        scroll.value = new BScroll(wrapperRef.value, {
            observeDOM: true,
            ...options
        })
    })

    onUnmounted(() => {
        scroll.value.destroy()
    })

    return scroll
}
