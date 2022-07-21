import { ref, onMounted, onUnmounted } from 'vue'
//核心滚动
import BScroll from '@better-scroll/core'
//监测content的dom的变化
import ObserveDOM from '@better-scroll/observe-dom'
BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef, options, emit) {
    const scroll = ref(null)

    onMounted(() => {
        //此时计算容器高度和内容高度
        // debugger
        const scrollVal = scroll.value = new BScroll(wrapperRef.value, {
            observeDOM: true,
            ...options
        })

        //实时派发滚动位置
        if (options.probeType > 0) {
            scrollVal.on('scroll', pos => {
                // console.log(pos.y);
                emit('scroll', pos)
            })
        }
    })

    onUnmounted(() => {
        scroll.value.destroy()
    })

    return scroll
}
