const URL  = 'https://api.giphy.com/v1/gifs/search'
const API_KEY = 'MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym';
let searchHistory = {}

function validateSubmit(userInput) {
    return userInput.length !== 0;
}

function checkSearchHistory(searchString) {
    if(searchHistory[searchString] === undefined) {
        searchHistory = {...searchHistory, [searchString]: 0}
        return 0;
    } else {
        searchHistory = {...searchHistory, [searchString]: searchHistory[searchString] + 1}
        return searchHistory[searchString];
    }
}

function buildParams(searchString) {
    return {
        params: {
            q: searchString,
            limit: 1,
            offset: checkSearchHistory(searchString),
            api_key: API_KEY,
        }
    }
}

function fetchData(searchString) {
    const params = buildParams(searchString);
    console.log(searchHistory);
    axios.get(URL, params)
        .then( res => {
            renderGiphy(res.data.data[0].images.original.url);
        })
        .catch( err => {
            renderGiphy('https://media.tenor.com/eDchk3srtycAAAAi/piffle-error.gif');
        })  
}

function renderGiphy(url) {
    $(`<div class="grid-item"><img src="${url}"></div>`).appendTo($('#giphy-container')); 
    setTimeout(() => {
        window.scrollTo({left: 0, top: document.body.scrollHeight, behavior: "smooth"})
    }, 300);
}

$('#search-form').on('submit', function(event) {
    event.preventDefault();
    const userInput = $('#search-box').val().trim()
    if(validateSubmit(userInput)) {
        fetchData(userInput);
    }
})

$('#delete-btn').on('click', function(event) {
    event.preventDefault();
    $('#giphy-container').empty();
    $('#search-box').val('');
    searchHistory = {};
})