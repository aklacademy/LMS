let currentSection = "";

let currentList = "";

let pageHistory = [];

function showPage(pageId) {

    const pages =
        document.querySelectorAll(".app-page");

    pages.forEach(function(page) {

        page.classList.add("hidden");

    });

    document.getElementById(pageId)
        .classList.remove("hidden");

    // Save history

    if (
        pageHistory[pageHistory.length - 1]
        !== pageId
    ) {

        pageHistory.push(pageId);

    }

    // Navbar visibility

    if (pageId === "cover-page") {

        document.getElementById("top-navbar")
            .classList.add("hidden");

    }

    else {

        document.getElementById("top-navbar")
            .classList.remove("hidden");

    }

}

function goBack() {

    pageHistory.pop();

    const previousPage =
        pageHistory[pageHistory.length - 1];

    if (previousPage) {

        showPage(previousPage);

    }

}

function goHome() {

    pageHistory = [];

    showPage("cover-page");

}

let currentQuestions = [];

let currentQuestionIndex = 0;

let masteredQuestions = [];

let revisionQuestions = [];

let completedLearningLists = [];

let currentItems = [];

let currentItemIndex = 0;


// open sections

function openSection(sectionName) {

    currentSection = sectionName;

    showPage("section-page");

    document.getElementById("section-title")
        .innerText = sectionName;

}

// open learn

function openLearn() {

    showPage("learn-page");

    const themesContainer =
        document.getElementById("themes-container");

    themesContainer.innerHTML = "";

    let themes = [];

    if (currentSection === "Vocabulary") {

        themes = vocabularyThemes;
    }

    else if (currentSection === "English") {

        themes = englishThemes;
    }

Object.keys(themes).forEach(function(theme) {

    themesContainer.innerHTML += `
    
        <button class="theme-card"
            onclick="openLists('${theme}')">

            ${theme}

        </button>

    `;

});

}

function openLists(themeName) {

    showPage("lists-page");

    document.getElementById("lists-title")
        .innerText = themeName;

    const listsContainer =
        document.getElementById("lists-container");

    listsContainer.innerHTML = "";

    let lists = [];

    if (currentSection === "Vocabulary") {

        lists = vocabularyThemes[themeName];
    }

    else if (currentSection === "English") {

        lists = englishThemes[themeName];
    }

    lists.forEach(function(list) {

        listsContainer.innerHTML += `
        
            <button class="theme-card"
                onclick="openItems('${list}')">

                ${list}

            </button>

        `;

    });

}


// open item


function openItems(listName) {

    currentList = listName;

    showPage("items-page");

    document.getElementById("items-title")
        .innerText = listName;

    currentItems = learningItems[listName];

    currentItemIndex = 0;

    showItemCard();

}

// Show items card

function showItemCard() {

    const itemsContainer =
        document.getElementById("items-container");

    itemsContainer.innerHTML = "";

    const item =
        currentItems[currentItemIndex];

    itemsContainer.innerHTML = `
    
        <div class="item-card">

            <p>
                Card ${currentItemIndex + 1}
                of
                ${currentItems.length}
            </p>

            <h2>${item.word}</h2>

            <p>
                <strong>Part of Speech:</strong>
                ${item.partOfSpeech}
            </p>

            <p>
                <strong>Pronunciation:</strong>
                ${item.pronunciation}
            </p>

            <p>
                <strong>Definition:</strong>
                ${item.definition}
            </p>

            <p>
                <strong>Synonyms:</strong>
                ${item.synonyms}
            </p>

            <p>
                <strong>Antonyms:</strong>
                ${item.antonyms}
            </p>

            <div class="examples">

                <strong>Examples:</strong>

                <ul>

                    ${item.examples.map(function(example) {

                        return `<li>${example}</li>`;

                    }).join("")}

                </ul>

            </div>

        </div>

    `;

    const previousButton =
    document.querySelector(".card-navigation button:first-child");

const nextButton =
    document.querySelector(".card-navigation button:last-child");


// Hide previous button on first card

if (currentItemIndex === 0) {

    previousButton.style.visibility = "hidden";

}

else {

    previousButton.style.visibility = "visible";

}


// Hide next button on last card

if (
    currentItemIndex
    === currentItems.length - 1
) {

    nextButton.style.visibility = "hidden";

}

else {

    nextButton.style.visibility = "visible";

}   

}

function nextItem() {

    if (
        currentItemIndex
        < currentItems.length - 1
    ) {

        currentItemIndex++;

        showItemCard();

    }

}

function previousItem() {

    if (currentItemIndex > 0) {

        currentItemIndex--;

        showItemCard();

    }

}


function completeLearning() {

    if (!completedLearningLists.includes(currentList)) {

        completedLearningLists.push(currentList);

    }

    alert("Learning Completed. Assessment Unlocked.");

    console.log(completedLearningLists);

}

function openAssessment() {

    if (!completedLearningLists.includes(currentList)) {

        alert("Complete learning first to unlock assessment.");

        return;
    }

    showPage("assessment-page");

    currentQuestions =
        assessmentQuestions[currentList];

    currentQuestionIndex = 0;

    showQuestion();

}


function showQuestion() {

    const questionContainer =
        document.getElementById("question-container");

    questionContainer.innerHTML = "";

    const question =
        currentQuestions[currentQuestionIndex];

    questionContainer.innerHTML += `
    
        <div class="item-card">

            <h3>
                ${question.question}
            </h3>

            <div class="options-container">

                ${question.options.map(function(option) {

                    return `
                    
                        <button class="option-btn"
                            onclick="checkAnswer('${option}')">

                            ${option}

                        </button>

                    `;

                }).join("")}

            </div>

        </div>

    `;

}


function checkAnswer(selectedOption) {

    const currentQuestion =
        currentQuestions[currentQuestionIndex];

    if (selectedOption === currentQuestion.correctAnswer) {

        masteredQuestions.push(currentQuestion);

        alert("Correct! Moved to Mastered.");

    }

    else {

        revisionQuestions.push(currentQuestion);

        alert("Wrong! Moved to Revision.");

    }

    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuestions.length) {

        showQuestion();

    }

    else {

        alert("Assessment Completed");

        console.log("Mastered:", masteredQuestions);

        console.log("Revision:", revisionQuestions);

    }

}

function openMastered() {

    showPage("mastered-page");

    const masteredContainer =
        document.getElementById("mastered-container");

    masteredContainer.innerHTML = "";

    if (masteredQuestions.length === 0) {

        masteredContainer.innerHTML = `
        
            <p>No mastered questions yet.</p>
        
        `;

        return;
    }

    masteredQuestions.forEach(function(question) {

        masteredContainer.innerHTML += `
        
            <div class="item-card">

                <h3>${question.question}</h3>

                <p>
                    ✓ Correct Answer:
                    ${question.correctAnswer}
                </p>

            </div>

        `;

    });

}

function openRevision() {

    showPage("revision-page");

    const revisionContainer =
        document.getElementById("revision-container");

    revisionContainer.innerHTML = "";

    if (revisionQuestions.length === 0) {

        revisionContainer.innerHTML = `
        
            <p>No revision questions.</p>
        
        `;

        return;
    }

    revisionQuestions.forEach(function(question) {

        revisionContainer.innerHTML += `
        
            <div class="item-card">

                <h3>${question.question}</h3>

                <p>
                    Correct Answer:
                    ${question.correctAnswer}
                </p>

            </div>

        `;

    });

}

function startRevisionAssessment() {

    currentQuestions = revisionQuestions;

    revisionQuestions = [];

    currentQuestionIndex = 0;

    showPage("assessment-page");

    showQuestion();

}

showPage("cover-page");




