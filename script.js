"use strict";
const elements = {
    toggleThemeBtn: document.querySelector(".toggle-theme"),
    modeIcon: document.querySelector(".mode-icon"),
    definitionsList: document.querySelector(".definitions"),
    fonts: document.querySelector(".fonts"),
    body: document.body,
    dropdown: document.querySelector(".custom-dropdown"),
    button: document.querySelector(".custom-dropdown .dropdown-button"),
    options: document.querySelector(".custom-dropdown .dropdown-options"),
    searchBtn: document.querySelector(".searchBtn"),
    wordInput: document.querySelector(".wordInput"),
    phonetic: document.querySelector(".phonetic"),
    searchedWord: document.querySelector(".searchedWord"),
    partOfSpeech: document.querySelector(".partOfSpeech"),
    verbs: document.querySelector(".verbs"),
    synonyms: document.querySelector(".synonym-word"),
    noInput: document.querySelector(".no-input"),
    errorTitle: document.querySelector(".errorTitle"),
    errorMessage: document.querySelector(".errorMessage"),
    dictionaryContainer: document.querySelector(".dictionary"),
    errorContainer: document.querySelector(".errorContainer"),
    source: document.querySelector(".link"),
    option: document.querySelector(".option"),
    playButton: document.getElementById("play-audio"),
    audio: new Audio()
};

// Toggle between light and dark mode
elements.toggleThemeBtn.addEventListener("change", (event) => {
    if (event.target.checked) {
        elements.body.style.setProperty("--bg-color", "var(--bg-color-dark)");
        elements.body.style.setProperty("--text-color", "var(--text-color-dark)");
        elements.body.style.setProperty("--search-bg", "var(--search-bg-dark)");
        elements.body.style.setProperty(" --box-shadow", "var(--shadow-dark)");
    } else {
        elements.body.style.setProperty("--bg-color", "var(--bg-color-light)");
        elements.body.style.setProperty("--text-color", "var(--text-color-light)");
        elements.body.style.setProperty("--search-bg", "var(--search-bg-light)");
        elements.body.style.setProperty(" --box-shadow", "var(--shadow-light)");
    }
});

// Function to fetch dictionary data
async function fetchDefinition(word) {
    try {
        // Fetch the response
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!response.ok) {
            const error = await response.json();
            handleError(error);
        }

        // Parse the response JSON
        const data = await response.json();
        console.log(data);
        
        return displayDefinition(data);

    } catch (error) {
        // console.log("Error:", error.message);
        displayFallbackMessage("Unable to fetch definition. Please try again later.");
    }
}

function handleError(error) {
    if (error.title && error.message) {
        elements.errorTitle.textContent = error.title;
        elements.errorMessage.textContent = `${error.message} ${error.resolution || ""}`;
        elements.dictionaryContainer.style.display = "none";
        elements.errorContainer.style.display = "block";
    } else {
        // Log or handle unexpected error formats
        alert("Unexpected error structure:", error);
    }
}

function displayFallbackMessage(message) {
    // Display a generic fallback error message to the user
    elements.errorContainer.style.display = "block";
    elements.errorMessage.textContent = message;
    elements.dictionaryContainer.style.display = "none";
}

// Display the definition
const displayDefinition = (data) => {
    elements.definitionsList.innerHTML = "";
    const meanings = data[0]?.meanings.map((meaning) => {
        const definitions = meaning.definitions
            .map((def) => `<li>${def.definition}</li>`)
            .join("");
        return definitions;
    });

    if (data[0]) {
        elements.audio.src = data[0]["phonetics"][0]["audio"];
        elements.phonetic.textContent = data[0].phonetic;
        elements.searchedWord.textContent = data[0].word;
        elements.definitionsList.innerHTML = meanings[0];
        elements.synonyms.textContent = data[0]["meanings"][0]["synonyms"].join(" ");
        elements.verbs.innerHTML = meanings[1];
        elements.dictionaryContainer.style.display = "block";
        elements.errorContainer.style.display = "none";
        elements.source.textContent = data[0]["sourceUrls"].join(" ");
        elements.source.href = data[0]["sourceUrls"][0]
    }  
};

// E-V-E-N-T  L-S-T-E-N-E-R-S
elements.searchBtn.addEventListener("click", async () => {
    const word = elements.wordInput.value.trim();
    if (word) {
        await fetchDefinition(word);
    } else {
        elements.noInput.style.opacity = 1;
        elements.wordInput.style.border = "1px solid #FF5252"
        setTimeout(() => { 
            elements.noInput.style.opacity = 0;
            elements.wordInput.style.border = "none"
        }, 2000);
    }
});

// Toggle dropdown visibility
elements.button.addEventListener('click', () => {
    elements.dropdown.classList.toggle('active');
});

// Handle option click
elements.options.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        elements.option.textContent = event.target.textContent;
        document.body.style.fontFamily = event.target.textContent;
        elements.dropdown.classList.remove('active');
    }
});

elements.playButton.addEventListener("click", () => {
    elements.audio.play().catch((error) => {
        console.error("Error playing the audio:", error);
    });
});
