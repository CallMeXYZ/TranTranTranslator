/**
 * translate should return promise which returns as {result:String,means:[{type:String,means:[String]}]}
 * @param text
 */
import {isString} from './utils'

export const baidu = (text) => fetch(`https://fanyi.baidu.com/v2transapi?from=en&to=zh&query=${text}`).then(data => data.json()).then((data) => {
    let result = data.trans_result.data[0].dst
    if (result) {
        result = result.split('.')[0]
    }
    const means = []
    try {
        data.dict_result.simple_means.symbols[0].parts.map(({part, part_name, means: sourceMeans}) => {
            const itemMeans = []
            // means item may have comma
            sourceMeans.forEach(item => {
                if (isString(item)) {
                    itemMeans.push(...item.split(/,|，/))
                }
            })
            if (itemMeans.length > 0) {
                means.push({type: (part || part_name || '').split('.')[0], means: itemMeans})
            }
        })
    } catch (e) {

    }
    return {result, means}
});
