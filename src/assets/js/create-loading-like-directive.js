import { createApp } from "vue"
import { addClass, removeClass } from "@/assets/js/dom.js"

const relativeCls = "g-relative"

export default function createLoadingLikeDirective(Comp) {
    return {
        //当被绑定的元素挂载在dom上
        mounted(el, binding) {
            // debugger
            const app = createApp(Comp)
            const instance = app.mount(document.createElement('div'))
            //处理bug
            // const name = Comp.name
            // if (!el[name]) {
            //     el[name] = {}
            // }
            el.instance = instance
            //动态参数
            const title = binding.arg
            if (typeof title !== "undefined") {
                el.instance.setTitle(title)//
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
        if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
            addClass(el, relativeCls)
        }
        el.appendChild(el.instance.$el)
    }
    //销毁新增的样式
    //只有el.instace.$el是el的子节点，才能被移除
    function remove(el) {
        removeClass(el, relativeCls)

        if (el.contains(el.instance.$el)) {
            el.removeChild(el.instance.$el)
        }
    }
}
