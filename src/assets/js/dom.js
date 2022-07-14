//给el指向的dom添加样式
export function addClass(el, className) {
    if (!el.classList.contains(className)) {
        el.classList.add(className)
    }
}
//给el指向的dom删除样式
export function removeClass(el, className) {
    el.classList.remove(className)
}