// Нахождение элементов страницы
const container = document.querySelector('.container')
const input = document.querySelector('.search-input')
const resultSearch = document.querySelector('.search-result')
const buttonContainer = document.querySelector('.button-container')
const searchInfo = document.querySelector('.search-info')
const searchPagination = document.querySelector('.search-pagination')
const buttonNext = document.querySelector('.next')
const buttonBack = document.querySelector('.back')
const loader = document.querySelector('.search-loader')

// Переменные для хранения текущей страницы, всех страниц, последнего запроса
let currentPage = 1
let totalPage = 1
let lastSearch = ''

// Переменная для хранения массива всех загруженных персонажей
const arrCharacter = []


// Функция для получения персонажей
function getFetch(nameCharacter, currentPage = 1) {

    // Очищаем старые запросы поиска
    resultSearch.innerHTML = ''


    return fetch(`https://rickandmortyapi.com/api/character/?name=${nameCharacter}&page=${currentPage}`)
        .then(responce => {
            
            if (!responce.ok) {
                throw new Error('Персонаж не найден')
            }

            return responce.json()
        })
        .then(result => {

            // Определяем количество всех страниц
            totalPage = result.info.pages
            console.log(result.info.pages)

            // Переменная отвечающая за массив с результатами
            const arrResult = result.results


            // Пушим персонажей в наш массив
            arrResult.forEach(elem => {

                // Проверка: есть ли уже такой персонаж
                if (!arrCharacter.find(e => e.id === elem.id)) {
                    arrCharacter.push(elem)
                }

            })


            arrResult.forEach(elem => {

                // Создаем img
                const resultImg = document.createElement('img')
                // Добавляем путь к img
                resultImg.src = elem.image 
                resultImg.classList.add('result-img')


                // Создаем item для img
                const resultItem = document.createElement('div')
                // Добавляем id
                resultItem.dataset.id = elem.id
                resultItem.classList.add('result-item')

                
                // Добавляем имя к item
                const resultItemName = document.createElement('div')
                resultItemName.classList.add('result-title')
                resultItemName.textContent = elem.name



                resultItem.appendChild(resultImg)
                resultItem.appendChild(resultItemName)
                resultSearch.appendChild(resultItem)
            })

            console.log(arrCharacter)
            console.log(result)
            return result
        })
        .finally(() => {
            loader.classList.remove('active')
        })
}



// Добавление обработчика события на input
input.addEventListener('input', function(e) {
    let currentInput = e.target.value

    if (!currentInput) {
        resultSearch.innerHTML = ''
        searchPagination.innerHTML = ''
        toggleButton()
        return 
    }

    // Делаем задержку на каждый запрос
    debounceSendFetch(currentInput)

})



// debounce с задержкой 500мс
function debounce(func, wait) {

    let timeoutId = null

    return function(...args) {
        clearTimeout(timeoutId)

        timeoutId = setTimeout(() => {
            func(...args)
        }, wait)
    }
}


// Функция для отправления запроса
function sendFetch(input) {

    // Обновляем последний запрос
    lastSearch = input
    currentPage = 1

    getFetch(input)
        .then(() => {
            // Показ пагинации
            showPagination()
            
            // Управление кнопками
            toggleButton()

            // Убираем лоадер
            loader.classList.remove('active')
        })
        .catch(error => {
            console.error('Ошибка', error)
            resultSearch.textContent = 'Персонаж не найден'
            searchPagination.innerHTML = ``
            loader.classList.remove('active')
        })

}


// Добавление обертки debounce
const debounceSendFetch = debounce(sendFetch, 500)


// Добавление обработчика события на кнопки перемещения
buttonContainer.addEventListener('click', function(e) {
    const button = e.target.closest('.search-button')

    if (!button) return


    // Кнопка вперед
    if (e.target.closest('.next')) {

        if (currentPage < totalPage) {
            currentPage++
            getFetch(lastSearch, currentPage) 
            showPagination()
            toggleButton()
            loader.classList.add('active')
        }

    }


    // Кнопка назад
    if (e.target.closest('.back')) {

        if (currentPage > 1 ) {
            currentPage--
            getFetch(lastSearch, currentPage)
            showPagination()
            toggleButton()
        }

    }

})


// Функция для отображения пагинации на сайте 
function showPagination() {
    searchPagination.innerHTML = `
    Страница ${currentPage} из ${totalPage}
    `
}

// Функция для активации кнопок назад/вперед
function toggleButton() {

    // Условия для кнопок
    const conditionNext = currentPage < totalPage
    const conditionBack = currentPage > 1

    if (!conditionNext) {
        buttonNext.classList.add('disable')
    }
    else {
        buttonNext.classList.remove('disable')
    }


    if (!conditionBack) {
        buttonBack.classList.add('disable')
    }
    else {
        buttonBack.classList.remove('disable')
    }
}


// Добавление обработчика события на клик по персонажу (получение о нем информации)
container.addEventListener('click', function(e) {

    if (e.target.closest('.search-info')) return
    
    const item = e.target.closest('.result-item')

    if (!item) {
        searchInfo.innerHTML = ''
        searchInfo.classList.remove('active')
        return
    }


    searchInfo.innerHTML = ''
    const itemId = Number(item.dataset.id)

     
    // Находим персонажа по которому сделали клик
    const character = arrCharacter.find(elem => elem.id === itemId)
    if (!character) return 

    searchInfo.classList.add('active')

    // Добавление инфо персонажа
    const infoItem = document.createElement('div')
    infoItem.innerHTML = 
    `
    {
    <p>
    "name": ${character.name},
    <p>
    "id": ${character.id},
    <p>
    "status": ${character.status},
    <p>
    "gender": ${character.gender},
    <p>
    "type": ${character.type},
    <p>
    "species": ${character.species},
    <p>
    }
    `

    searchInfo.appendChild(infoItem)
})

