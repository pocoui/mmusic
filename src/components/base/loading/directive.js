import { createApp } from "vue"
import Loading from "./loading"
import {addClass,removeClass} from "@/assets/js/dom.js"

const relativeCls="g-relative"

const loadingDirective = {
    //当被绑定的元素挂载在dom上
    mounted(el, binding) {
        // debugger
        const app = createApp(Loading)
        const instance = app.mount(document.createElement('div'))
        el.instance = instance
        //动态参数
        const title = binding.arg
        if (typeof title !== "undefined") {
            el.instance.setTitle(title)
        }
            
        if (binding.value) {
            append(el)
        }
    },
    updated(el, binding) {
        //动态参数
        const title = binding.arg
        if (typeof title !== "undefined") {
            el.instance.setTitle(title)
        }
        if (binding.value !== binding.oldvalue) {
            binding.value ? append(el) : remove(el)
        }
    },
}

function append(el) {
    const style = getComputedStyle(el)
    //给el指向的dom添加样式 
    // debugger //检查样式是否被添加上
    if (['absolute', 'fixed', 'relative'].indexOf(style.position)===-1) {
        addClass(el,relativeCls)
    }
    el.appendChild(el.instance.$el)
}
function remove(el) {
    //销毁新增的样式
    removeClass(el,relativeCls)
    el.removeChild(el.instance.$el)
}
export default loadingDirective