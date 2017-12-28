import {removeLastElementByClass} from './utils'
import {baidu as translateByBaidu} from './translate'


const DEFAULT_DATA = {showing: false}
const CLASS_NAME = 'TranTranTranslator'

let data = {}
let lastRequestId = 0;
const clearData = () => {
    data = {...DEFAULT_DATA}
}
const init = () => {
    clearData()
    addEventListener('mouseup', () => {
        if (!data.showing) {
            show()
        }
    })
    addEventListener('mousedown', () => {
        if (data.showing) {
            hide()
        }
    })
}

const show = () => {
    const selection = window.getSelection()
    const selectText = selection.toString().trim()
    if (!selectText) {
        return
    }
    const rect = selection.getRangeAt(0).getBoundingClientRect()
    const top = rect.top + window.scrollY
    const left = rect.left + window.scrollX
    const height = rect.height
    const width = rect.width
    lastRequestId += 1
    let thisId = lastRequestId
    translateByBaidu(selectText).then(({result, means = []} = {}) => {
        // 显示最后一次搜索
        if (!result && thisId !== lastRequestId) {
            return
        }
        let element = document.createElement('div')
        element.className = CLASS_NAME
        element = document.body.appendChild(element)
        element.style.top = (top + height) + 'px'
        element.style.left = left + 'px'
        element.innerHTML = `
            <div class="main">${selectText}</div>
            <div class="main">${result}</div>
            <table>
                <tbody>
                     ${means.map(({type, means}) => `<tr><td>${type}</td><td>${means.slice(0, 3).join(', ')}</td></tr>`).join('')}
                </tbody>
            </table>

        `
        data.showing = true
    })


}
const hide = () => {
    clearData()
    removeLastElementByClass(CLASS_NAME)
}
init()

