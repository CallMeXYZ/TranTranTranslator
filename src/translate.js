/**
 * translate should return promise which returns as {result:String,means:[{type:String,means:[String]}]}
 * @param text
 */

export const baidu = (text) => fetch(`https://fanyi.baidu.com/v2transapi?from=en&to=zh&query=${text}`).then(data => data.json()).then((data) => {
    let result = data.trans_result.data[0].dst
    if(result) {
        result = result.split('.')[0]
    }
    return {
        result,
        means: data.dict_result.simple_means.symbols[0].parts.map(({part, means}) => {
            const resultMeans = []
            // means item may have comma
            means.forEach(item => resultMeans.push(...item.split(/,|，/)))
            return {type: part, means: resultMeans}
        })
    }
});
