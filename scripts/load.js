console.log('oaooad')

let local = (key) => {
    let valor = chrome.storage.local.get(key, (data) => {
       console.log(data) 
    })
}

chrome.storage.local.set({'valor': 'outro'})