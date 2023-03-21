const form = document.querySelector('form')
const content = document.getElementById('content')

let turmas = []
let clicked = false

function loadContent() {
    let titles = document.getElementsByClassName("title")

    let turmas = []
    for (let i = 0; i < titles.length; i++) {
        let current = titles[i].firstElementChild.text
        turma = current.split(' ')[0]
        turmas.push(turma)
    }

    return turmas
}

function showClass(lista = []) {
    lista.forEach(element => {
        let element_id = "i" + element

        let label = document.createElement('label')
        label.setAttribute('for', element_id)
        label.setHTML(`Nome da turma (${element}):`)

        let input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.setAttribute('class', 'input')
        input.setAttribute('name', element_id)
        input.setAttribute('id', element_id)


        content.appendChild(label)
        content.appendChild(input)
        content.appendChild(document.createElement('br'))

    })
}

const find = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        injectImmediately: true,
        func: loadContent,
    }, (result) => {
        turmas = result[0].result
        showClass(turmas)
    })
}

function changeContent(class_name) {
    let titles = document.getElementsByClassName("title")
    for(let i = 0; i < titles.length; i++){
        titles[i].firstElementChild.text = class_name[i][0] + " - " + titles[i].firstElementChild.text
    }
}


// NOTE: class_name: nome da turma atualizado    

const change = async (class_name) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: changeContent,
        args: [class_name]
    })
}

/**
 * Método que pega dados do formulário. 
 * @returns list ["new class name", "old class name"]
 */
const getFormData = () => {
    let formulario = new FormData(form)
    let names = []
    turmas.forEach(x => {
        names.push([formulario.get('i' + x), x])
    })

    return names
}

form.addEventListener('submit', (event) => {
    event.preventDefault()

    if (clicked) {
        let lista = getFormData()
        change(lista)
        document.getElementsByClassName('gg-check-o')[0].style.display = "block"
    } else {
        find()
        document.getElementById('btn').innerText = 'Renomear'
        clicked = true
    }
})
