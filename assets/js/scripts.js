const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const searchInput = document.getElementById('word-input');
const form = document.getElementById('form');
const conteinerWord = document.querySelector('.results-word');
const sounButton = document.querySelector('.results-sound');
const resultsList = document.querySelector('.results-list');


let state = {
    word: '',
    phonetics: [],
    meanings: []
}

const renderDefinition = (itemDefinition) => {
    const example = itemDefinition.example ? `<div class="results-item-example">${itemDefinition.example}</div>` : '';

    return `       
    <div class="results-item__defs">
        <div class="results-item__defs">
            <p>${itemDefinition.definition}</p>
            ${example}
        </div>
    </div>`

}

const getDefinitions = (definitions) => {

    return definitions.map(renderDefinition).join('');
}

const renderItem = (item) => {
    const itemDefinition = item.definitions[0];

    return `
         <div class="results-item">
            <div class="results-item__part">${item.partOfSpeech}</div>
                ${getDefinitions(item.definitions)}
        </div>
    `
}

const showResults = () => {
    resultsList.innerHTML = '';
    state.meanings.forEach(element => {

        resultsList.innerHTML += renderItem(element);
    });

}

function handleKeyUp(event) {
    const value = event.target.value.trim();
    state.word = value;
}

const insertMainWord = () => {
    conteinerWord.innerHTML = state.word;
}

const hanleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`${url}${state.word}`)
    const data = await response.json();

    if (state.word && response.ok) {
        insertMainWord();
        showResults();
        const item = data[0];
        state = {
            ...state,
            meanings: item.meanings,
            phonetics: item.phonetics
        };

    }
    else {
        alert('Please enter a valid word');
    }


}


const handleSoundPlay = () => {
    if (state.phonetics.length) {
        const sounds = state.phonetics[0]
        new Audio(sounds.audio).play();

    }
}


searchInput.addEventListener('keyup', handleKeyUp);
form.addEventListener('submit', hanleSubmit);
sounButton.addEventListener('click', handleSoundPlay);