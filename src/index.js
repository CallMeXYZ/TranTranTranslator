import {removeLastElementByClass} from './utils'
import {baidu as translateByBaidu} from './translate'


const DEFAULT_DATA = {showing: false}
const ARROW_SIZE = 10
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

    const offsetWidth = document.body.offsetWidth
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
        const rect = selection.getRangeAt(0).getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        // absolute position in the screen of top right corner
        const pointY = rect.y + window.scrollY
        const pointX = rect.x + window.scrollX
        let arrowClass = ''
        // vertical
        if (rect.y > window.innerHeight / 2) {
            // top
            arrowClass += 'down '
            element.style.bottom = (document.body.offsetHeight - pointY + ARROW_SIZE) + 'px'
        } else {
            // bottom
            arrowClass += 'up '
            element.style.top = (pointY + height + ARROW_SIZE) + 'px'
        }
        // horizontal
        if (rect.x < 100) {
            // right
            element.style.left = pointX + 'px'
            arrowClass += 'left '
        } else if (window.innerWidth - rect.x - width < 100) {
            // left
            element.style.right = (document.body.offsetWidth - pointX - width / 2) + 'px'
            arrowClass += 'right '
        } else {
            // center
            element.style.left = pointX + width / 2 - 100 + 'px'
            arrowClass += 'center '
        }
        element.innerHTML = `
            <div class="close"></div>
            <div class="arrow-l ${arrowClass}"></div>
            <div class="arrow-s ${arrowClass}"></div>
            <div class="main">${selectText}</div>
            <div class="main">${result}</div>
            ${means.length > 0 ?
            `<table>
                <tbody>
                ${means.map(({type, means}) => `<tr><td>${type}</td><td>${means.slice(0, 3).join(', ')}</td></tr>`).join('')}
                    </tbody>
            </table>` : ''
            }

        `
        data.showing = true
    })


}

const hide = () => {
    clearData()
    removeLastElementByClass(CLASS_NAME)
}
init()

