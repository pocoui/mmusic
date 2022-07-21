import { nextTick, ref, watch, computed } from "vue"
export default function useFixed(props) {
    const groupRef = ref(null)
    //记录每个组的高度区间
    const listHeights = ref([])
    //记录滚动的位置       
    const scrollY = ref(0)
    const currentIndex = ref(0)


    //scroll组件滚动，就开始监测.虽然数据发生变化，但是此时dom还没更新，所以使用nextTick
    watch(() => props.data, async () => {
        await nextTick()
        calculate()
    })


    const fixedTitle = computed(() => {
        if (scrollY.value < 0) {
            return ''
        }
        const currentGroup = props.data[currentIndex.value]
        return currentGroup ? currentGroup.title : ''
    })

    watch(scrollY, (newY) => {
        const listHeightsVal = listHeights.value
        for (let i = 0; i < listHeightsVal.length - 1; i++) { //数组已经存了0
            const heightTop = listHeightsVal[i]
            const heightBottom = listHeightsVal[i + 1]
            if (newY <= heightBottom && newY >= heightTop) {
                currentIndex.value = i
            }
        }
    })

    //计算区间高度
    function calculate() {
        const list = groupRef.value.children
        const listHeightsVal = listHeights.value
        let height = 0

        listHeightsVal.length = 0
        //起始高度为0
        listHeightsVal.push(height)
        for (let i = 0; i < list.length; i++) {
            //高度累加
            height += list[i].clientHeight
            listHeightsVal.push(height)
        }
        return listHeightsVal
    }

    function onScroll(pos) {
        scrollY.value = -pos.y
    }

    return {
        groupRef,
        onScroll,
        fixedTitle,
        currentIndex
    }
}