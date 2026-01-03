

const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const searchInput = document.getElementById('word-input');
const form = document.getElementById('form');
const conteinerWord = document.querySelector('.results-word');
const sounButton = document.querySelector('.results-sound');
const resultsList = document.querySelector('.results-list');
const synonymsList = document.querySelector('.result-synonyms');

let state = {
    word: searchInput.value ? searchInput.value : '',
    phonetics: [],
    meanings: []
}

const renderDefinition = (itemDefinition) => {
    const example = itemDefinition.example ? `<div class="results-item-example">${itemDefinition.example}</div>` : '';

    return `       
    <div class="results-item__defs">
        <p>${itemDefinition.definition}</p>
        ${example}
    </div>`

}

const getDefinitions = (definitions) => {
    return definitions.map(renderDefinition).join('');
}

const renderItem = (item) => {
    const itemDefinition = item.definitions[0];

    return `
         <div class="results-item">
            <div class="results-item__part">partOfSpeech - ${item.partOfSpeech}</div>
                ${getDefinitions(item.definitions)}
        </div>
    `
}

const renderSynonyms = (synonyms) => {
    return `
    <li class="list-group-item">${synonyms}</li>
  `
}
const showSynonyms = () => {
    console.log(state.synonyms);
    synonymsList.innerHTML = '';
    if (state.synonyms && state.synonyms.length > 0) {
        const synonymsHTML = state.synonyms.map(renderSynonyms).join('');
        synonymsList.innerHTML = synonymsHTML;
    }
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

const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await fetch(`${url}${state.word}`);
        
        if (!response.ok) {
            throw new Error('Word not found');
        }
        
        const data = await response.json();

        console.log(data);
        if (state.word && data.length > 0) {
            const item = data[0];
            state = {
                ...state,
                meanings: item.meanings,
                phonetics: item.phonetics,
                synonyms: item.meanings[0].synonyms || []
            };
            insertMainWord();
            showResults();
            showSynonyms();
        }
    }
    catch (error) {
        alert('Please enter a valid word');
        console.error(error);
    }

}


const handleSoundPlay = () => {
    if (state.phonetics.length) {
        const sounds = state.phonetics[0]
        new Audio(sounds.audio).play();

    }
}


searchInput.addEventListener('keyup', handleKeyUp);
form.addEventListener('submit', handleSubmit);
sounButton.addEventListener('click', handleSoundPlay);






