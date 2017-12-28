
export const removeLastElementByClass = (className) => {
    const elements = document.getElementsByClassName(className)
    if (elements.length > 0) {
        const item = elements[elements.length - 1]
        if (item && item.parentElement) {
            item.parentElement.removeChild(item);
        }
    }
}
