let currentSection = "";

let currentTheme = "";

let currentList = "";

let pageHistory = [];

let currentSet = "";

let revisionMode = false;

let revisionItems = [];

let revisionItemIndex = 0;

let currentLearningArea = "";

let currentCourse = "";

let currentMode = "learn";

let masteredMode = false;

let masteredAssessmentMode = false;

let currentRevisionQuestion = null;


function showPage(pageId) {

    // FULL PAGE SWITCHING

    if (
        pageId === "cover-page"
        ||
        pageId === "course-page"
    ) {

        document.getElementById(
            "cover-page"
        ).classList.add(
            "hidden"
        );

        document.getElementById(
            "course-page"
        ).classList.add(
            "hidden"
        );

        document.getElementById(pageId)
            .classList.remove(
                "hidden"
            );

    }

    // INNER COURSE WORKSPACE SWITCHING

    else {

        const pages =
            document.querySelectorAll(
                "#course-page .app-page"
            );

        pages.forEach(function(page) {

            page.classList.add(
                "hidden"
            );

        });

        document.getElementById(pageId)
            .classList.remove(
                "hidden"
            );

    }

    // SAVE HISTORY

    

    // NAVBAR VISIBILITY

    if (
        pageId === "cover-page"
    ) {

        document.getElementById(
            "top-navbar"
        ).classList.add(
            "hidden"
        );

    }

    else {

        document.getElementById(
            "top-navbar"
        ).classList.remove(
            "hidden"
        );

    }

}

function goBack() {

    goHome();

}

function goHome() {

    // RESET HISTORY

    pageHistory = [
        "course-page"
    ];

    // SHOW COURSE PAGE

    document.getElementById(
        "cover-page"
    ).classList.add(
        "hidden"
    );

    document.getElementById(
        "course-page"
    ).classList.remove(
        "hidden"
    );

    // HIDE ALL INNER PAGES

    const pages =
        document.querySelectorAll(
            "#course-page .app-page"
        );

    pages.forEach(function(page) {

        page.classList.add(
            "hidden"
        );

    });

}

let currentQuestions = [];

let currentQuestionIndex = 0;

let currentItems = [];

let currentItemIndex = 0;

let masteredAssessmentQuestions = {};

let learnerProgress = {

    lists: {}

};

// LIST INITIALIZER

function initializeListProgress(listName) {

    if (!learnerProgress.lists[listName]) {

        learnerProgress.lists[listName] = {

            learned: false,

            completedLevels: [],

            completedSets: [],

            completedMasteredSets: [],

            masteredRevisionQuestions: [],

            revisionQuestions: [],

            masteredQuestions: [],

            attemptHistory: [],

            mastered: false,

            masteredAssessmentCompleted: false

        };

    }

    const progress =
        learnerProgress.lists[listName];

    progress.completedMasteredSets =
        progress.completedMasteredSets || [];

    progress.masteredRevisionQuestions =
        progress.masteredRevisionQuestions || [];

}


function openCourse(courseName) {

    currentCourse = courseName;

    document.querySelector(
        ".course-title"
    ).textContent = courseName;

    showPage("course-page");

    showPage("course-home-page");

}

function openAssessmentDashboard() {

    currentMode = "assessment";

    masteredMode = false;

    showPage(
        "assessment-dashboard-page"
    );

    document.querySelector(
    "#assessment-dashboard-page h2"
).innerText = "Assessment";

    const container =
        document.getElementById(
            "assessment-dashboard-container"
        );

    container.innerHTML = "";

    const selectedCourse =
        courses.find(function(course) {

            return (
                course.title
                === currentCourse
            );

        });

    const learningAreas =
        selectedCourse.learningAreas;

    learningAreas.forEach(function(area) {

    // CHECK IF AREA HAS
    // ELIGIBLE LEARNED LISTS

    const areaThemes =
        themes.filter(function(theme) {

            return (
                theme.learningArea
                === area
            );

        });

    let hasEligibleLists = false;

    areaThemes.forEach(function(theme) {

        const themeLists =
            lists.filter(function(list) {

                return (
                    list.themeTitle
                    === theme.title
                );

            });

        themeLists.forEach(function(list) {

            const progress =
                learnerProgress.lists[
                    list.title
                ];

            if (
                progress
                &&
                progress.learned
                &&
                !progress.mastered
            ) {

                hasEligibleLists = true;

            }

        });

    });



    // SHOW ONLY ELIGIBLE AREA

    if (hasEligibleLists) {

        container.innerHTML += `
        
            <button class="theme-card"
                onclick="
                    openThemes(
                        '${area}'
                    )
                ">

                ${area}

            </button>

        `;

    }

});

}


function openRevisionDashboard() {

    currentMode = "revision";

    masteredMode = false;

    showPage(
        "assessment-dashboard-page"
    );

    document.querySelector(
        "#assessment-dashboard-page h2"
    ).innerText = "Revision";

    const container =
        document.getElementById(
            "assessment-dashboard-container"
        );

    container.innerHTML = "";

    const selectedCourse =
        courses.find(function(course) {

            return (
                course.title
                === currentCourse
            );

        });

    const learningAreas =
        selectedCourse.learningAreas;

    learningAreas.forEach(function(area) {

        const areaThemes =
            themes.filter(function(theme) {

                return (
                    theme.learningArea
                    === area
                );

            });

        let hasRevisionLists = false;

        areaThemes.forEach(function(theme) {

            const themeLists =
                lists.filter(function(list) {

                    return (
                        list.themeTitle
                        === theme.title
                    );

                });

            themeLists.forEach(function(list) {

                const progress =
                    learnerProgress.lists[
                        list.title
                    ];

                if (
                    progress
                    &&
                     progress.completedSets
                    .length > 0
                        &&
                        progress.revisionQuestions
                    .length > 0
){

                    hasRevisionLists = true;

                }

            });

        });

        if (hasRevisionLists) {

            container.innerHTML += `
            
                <button class="theme-card"
                    onclick="
                        openThemes(
                            '${area}'
                        )
                    ">

                    ${area}

                </button>

            `;

        }

    });

}

function openAssessmentReviewDashboard() {

    currentMode =
        "assessment-review";

    showPage(
        "assessment-dashboard-page"
    );

    document.querySelector(
        "#assessment-dashboard-page h2"
    ).innerText =
        "Review Assessment";

    const container =
        document.getElementById(
            "assessment-dashboard-container"
        );

    container.innerHTML = "";

    const selectedCourse =
        courses.find(function(course) {

            return (
                course.title
                === currentCourse
            );

        });

    const learningAreas =
        selectedCourse.learningAreas;

    learningAreas.forEach(function(area) {

        const areaThemes =
            themes.filter(function(theme) {

                return (
                    theme.learningArea
                    === area
                );

            });

        let hasReviewLists = false;

        areaThemes.forEach(function(theme) {

            const themeLists =
                lists.filter(function(list) {

                    return (
                        list.themeTitle
                        === theme.title
                    );

                });

            themeLists.forEach(function(list) {

                const progress =
                    learnerProgress.lists[
                        list.title
                    ];

                if (
                    progress
                    &&
                    progress.completedSets
                        .length > 0
                ) {

                    hasReviewLists = true;

                }

            });

        });

        if (hasReviewLists) {

            container.innerHTML += `
            
                <button class="theme-card"
                    onclick="
                        openThemes(
                            '${area}'
                        )
                    ">

                    ${area}

                </button>

            `;

        }

    });

}



// Mastered Assessment Board

function openMasteredAssessmentDashboard() {

    currentMode =
        "mastered-assessment";

    masteredMode = false;

    showPage(
        "assessment-dashboard-page"
    );

    document.querySelector(
        "#assessment-dashboard-page h2"
    ).innerText =
        "Mastered Assessment";

    const container =
        document.getElementById(
            "assessment-dashboard-container"
        );

    container.innerHTML = "";

    const selectedCourse =
        courses.find(function(course) {

            return (
                course.title
                === currentCourse
            );

        });

    const learningAreas =
        selectedCourse.learningAreas;

    learningAreas.forEach(function(area) {

    const areaThemes =
        themes.filter(function(theme) {

            return (
                theme.learningArea
                === area
            );

        });

    let hasMasteredLists = false;

    areaThemes.forEach(function(theme) {

        const themeLists =
            lists.filter(function(list) {

                return (
                    list.themeTitle
                    === theme.title
                );

            });

        themeLists.forEach(function(list) {

            const progress =
                learnerProgress.lists[
                    list.title
                ];

            const daySets =
    assessmentQuestions[
        list.title
    ];

if (!daySets) {

    return;

}

const hasPendingMasteredSet =

    Object.keys(daySets)
        .some(function(setName) {

            if (
                !setName.startsWith(
                    "Day"
                )
            ) {

                return false;

            }

            const unresolvedQuestions =
                progress
                    .masteredRevisionQuestions
                    .filter(function(question) {

                        return (
                            question.setName
                            === setName
                        );

                    });

            const isFullyCompleted =

                progress
                    .completedMasteredSets
                    .includes(setName)

                &&

                unresolvedQuestions
                    .length === 0;

            return !isFullyCompleted;

        });

if (
    hasPendingMasteredSet
) {

    hasMasteredLists = true;

}

        });

    });

    if (!hasMasteredLists) {

        return;

    }

    container.innerHTML += `
    
        <button class="theme-card"
            onclick="
                openThemes(
                    '${area}'
                )
            ">

            ${area}

        </button>

    `;

});

}

function openMasteredReviewDashboard() {

    masteredMode = true;

    currentMode = "mastered-review";

    showPage("learn-page");

    const themesContainer =
        document.getElementById(
            "themes-container"
        );

    themesContainer.innerHTML = "";

    const selectedCourse =
        courses.find(function(course) {

            return (
                course.title
                === currentCourse
            );

        });

    const learningAreas =
        selectedCourse.learningAreas;

    learningAreas.forEach(function(area) {

    const areaThemes =
        themes.filter(function(theme) {

            return (
                theme.learningArea
                === area
            );

        });

    let hasMasteredLists = false;

    areaThemes.forEach(function(theme) {

        const themeLists =
            lists.filter(function(list) {

                return (
                    list.themeTitle
                    === theme.title
                );

            });

        themeLists.forEach(function(list) {

            const progress =
                learnerProgress.lists[
                    list.title
                ];

            if (
                progress
                &&
                progress.mastered
            ) {

                hasMasteredLists = true;

            }

        });

    });

    if (!hasMasteredLists) {

        return;

    }

    themesContainer.innerHTML += `
    
        <button class="theme-card"
            onclick="
                openThemes(
                    '${area}'
                )
            ">

            ${area}

        </button>

    `;

});
}

//Open Learn

function openLearn() {

    currentMode = "learn";

    masteredMode = false;

    showPage("learn-page");

    const themesContainer =
        document.getElementById(
            "themes-container"
        );

    themesContainer.innerHTML = "";

    const selectedCourse =
        courses.find(function(course) {

            return (
                course.title
                === currentCourse
            );

        });

    const learningAreas =
        selectedCourse.learningAreas;

    learningAreas.forEach(function(area) {

        let hasEligibleContent = false;

        const areaThemes =
            themes.filter(function(theme) {

                return (
                    theme.learningArea
                    === area
                );

            });

        areaThemes.forEach(function(theme) {

            const themeLists =
                lists.filter(function(list) {

                    return (
                        list.themeTitle
                        === theme.title
                    );

                });

            themeLists.forEach(function(list) {

                if (
                    learningItems[list.title]
                ) {

                    hasEligibleContent = true;

                }

            });

        });

        if (!hasEligibleContent) {

            return;

        }

        themesContainer.innerHTML += `
        
            <button class="theme-card"
                onclick="
                    openThemes(
                        '${area}'
                    )
                ">

                ${area}

            </button>

        `;

    });

}

// open sections

function openSection(sectionName) {

    currentSection = sectionName;

    showPage("section-page");

    document.getElementById("section-title")
        .innerText = sectionName;

}

// open Themes

function openThemes(areaName) {

    currentSection = areaName;

    showPage("learn-page");

    const themesContainer =
        document.getElementById(
            "themes-container"
        );

    themesContainer.innerHTML = "";

    const filteredThemes =
        themes.filter(function(theme) {

            return (
                theme.learningArea
                === areaName
            );

        });

    filteredThemes.forEach(function(theme) {

        let hasEligibleContent = false;

        const themeLists =
            lists.filter(function(list) {

                return (
                    list.themeTitle
                    === theme.title
                );

            });

        themeLists.forEach(function(list) {

            if (
                learningItems[list.title]
            ) {

                hasEligibleContent = true;

            }

        });

        if (!hasEligibleContent) {

            return;

        }

        themesContainer.innerHTML += `
        
            <button class="theme-card"
                onclick="
                    openLists(
                        '${theme.title}'
                    )
                ">

                ${theme.title}

            </button>

        `;

        if (window.innerWidth <= 1024) {

    closeSidebar();

}

    });

    // CLOSE MOBILE MENU

    if (window.innerWidth <= 768) {

        document
            .querySelector(".sidebar")
            .classList
            .remove("mobile-open");

    }

}

function openLists(themeName) {

    currentTheme = themeName;

    showPage("lists-page");

    document.getElementById(
        "lists-title"
    ).innerText = themeName;

    const listsContainer =
        document.getElementById(
            "lists-container"
        );

    listsContainer.innerHTML = "";

    const filteredLists =
        lists.filter(function(list) {

            return (
                list.themeTitle
                === themeName
            );

        });

    filteredLists.forEach(function(list) {

    // SHOW ONLY IF CONTENT EXISTS

    if (
        learningItems[list.title]
    ) { 

         // MASTERED REVIEW FILTER

    if (
        currentMode
        === "mastered-review"
    ) 

    {

        const progress =
            learnerProgress.lists[
                list.title
            ];

        if (
    !progress
    ||
    !progress.mastered
) {

    return;

}
    

    }

    let displayTitle =
    list.title;

const progress =
    learnerProgress.lists[
        list.title
    ];

if (
    progress
    &&
    progress.learned
) {

    displayTitle =
        "✅ " + list.title;

}

        listsContainer.innerHTML += `
        
            <button class="theme-card"
                onclick="

                ${
    currentMode === "learn"

    ? `openItems('${list.title}')`

    : currentMode === "assessment"

    ? `openAssessment('${list.title}')`

    : currentMode === "revision"

    ? `openRevision('${list.title}')`

    : currentMode === "assessment-review"

    ? `openAssessmentReviewSets('${list.title}')`

    : currentMode === "mastered-review"

    ? `openItems('${list.title}')`

    : currentMode === "mastered-assessment"

    ? `openMasteredAssessment('${list.title}')`

    : currentMode === "mastered-revision"

    ? `openMasteredRevision('${list.title}')`

    : ""
}

">

                ${displayTitle}

            </button>

        `;

    }

});
}

// open item


function openItems(listName) {

    currentList = listName;

    showPage("items-page");

    const completeBtn =
        document.getElementById(
            "complete-learning-btn"
        );

    if (
        masteredMode
        &&
        completeBtn
    ) {

        completeBtn.style.display =
            "none";

    }

    document.getElementById(
        "items-title"
    ).innerText =
        listName;

    currentItems =
        learningItems[listName] || [];

    if (
        currentItems.length === 0
    ) {

        document.getElementById(
            "items-container"
        ).innerHTML =
            "<p>No learning items yet.</p>";

        return;

    }

    currentItemIndex = 0;

    showItemCard();

}

// Show items card

function showItemCard() {

    const item =
        currentItems[currentItemIndex];

    if (masteredMode) {

        showMasteredReviewCard();

    }

    else if (
        item.contentType === "word"
    ) {

        showVocabularyCard(item);

    }

    else if (
        item.contentType === "lesson"
    ) {

        showLessonCard(item);

    }

    updateNavigationButtons();

}


function showVocabularyCard(item) {

    const itemsContainer =
        document.getElementById(
            "items-container"
        );

    // NORMAL LEARNING MODE

    itemsContainer.innerHTML = `
    
        <div class="item-card">

            <p>
                Card ${currentItemIndex + 1}
                of
                ${currentItems.length}
            </p>

            <h2>
                ${item.title}
            </h2>

            <p>

                <strong>
                    Part of Speech:
                </strong>

                ${item.content.partOfSpeech}

            </p>

            <p>

                <strong>
                    Pronunciation:
                </strong>

                ${item.content.pronunciation}

            </p>

            <p>

                <strong>
                    Definition:
                </strong>

                ${item.content.definition}

            </p>

            <p>

                <strong>
                    Synonyms:
                </strong>

                ${item.content.synonyms}

            </p>

            <p>

                <strong>
                    Antonyms:
                </strong>

                ${item.content.antonyms}

            </p>

            <div class="examples">

                <strong>
                    Examples:
                </strong>

                <ul>

                    ${item.content.examples.map(
                        function(example) {

                            return `
                            
                                <li>
                                    ${example}
                                </li>

                            `;

                        }
                    ).join("")}

                </ul>

            </div>

        </div>

    `;

}


function showLessonCard(item) {

    const itemsContainer =
        document.getElementById(
            "items-container"
        );

    // NORMAL LEARNING MODE

    itemsContainer.innerHTML = `
    
        <div class="item-card">

            <p>
                Lesson ${currentItemIndex + 1}
                of
                ${currentItems.length}
            </p>

            <h2>
                ${item.title}
            </h2>

            <div>

                <strong>
                    Learning Objectives:
                </strong>

                <ul>

                    ${item.content.learningObjectives.map(
                        function(objective) {

                            return `
                            
                                <li>
                                    ${objective}
                                </li>

                            `;

                        }
                    ).join("")}

                </ul>

            </div>

            <p>

                <strong>
                    Introduction:
                </strong>

                ${item.content.introduction}

            </p>

            <p>

                <strong>
                    Explanation:
                </strong>

                ${item.content.explanation}

            </p>

            <div>

                <strong>
                    Examples:
                </strong>

                <ul>

                    ${item.content.examples.map(
                        function(example) {

                            return `
                            
                                <li>
                                    ${example}
                                </li>

                            `;

                        }
                    ).join("")}

                </ul>

            </div>

        </div>

    `;

}

function updateNavigationButtons() {

    const previousButton =
        document.querySelector(
            ".card-navigation button:first-child"
        );

    const completeButton =
        document.getElementById(
            "complete-learning-btn"
        );

        if (!completeButton) {

    return;

}

    const nextButton =
        document.querySelector(
            ".card-navigation button:last-child"
        );

    // PREVIOUS BUTTON

    if (currentItemIndex === 0) {

        previousButton.style.visibility =
            "hidden";

    }

    else {

        previousButton.style.visibility =
            "visible";

    }

    // NEXT BUTTON

    if (
        currentItemIndex
        === currentItems.length - 1
    ) {

        nextButton.style.visibility =
            "hidden";

    }

    else {

        nextButton.style.visibility =
            "visible";

    }

    // COMPLETE ALWAYS VISIBLE

     if (
    currentMode === "learn"
) {

    completeButton.style.visibility =
        "visible";

}

else {

    completeButton.style.visibility =
        "hidden";

}

}


function nextItem() {

    if (
        currentItemIndex
        < currentItems.length - 1
    ) {

        currentItemIndex++;

        if (masteredMode) {

            showMasteredReviewCard();

        }

        else {

            showItemCard();

        }

    }

}

function previousItem() {

    if (currentItemIndex > 0) {

        currentItemIndex--;

        if (masteredMode) {

    showMasteredReviewCard();

}

else {

    showItemCard();

}

    }

}


function completeLearning() {

    initializeListProgress(
        currentList
    );

    if (masteredMode) {

        return;

    }

    learnerProgress.lists[currentList]
        .learned = true;

    saveProgress();

    alert(
        "Learning Completed. Assessment Unlocked."
    );

    openLists(
        currentTheme
    );
}

//OPEN ASSESSMENT


function openAssessment(listName) {

    currentList = listName;

    initializeListProgress(currentList);

    if (
        !learnerProgress.lists[currentList]
            .learned
    ) {

        alert(
            "Complete learning first to unlock assessment."
        );

        return;

    }

    showPage("assessment-sets-page");

    const setsContainer =
        document.getElementById(
            "assessment-sets-container"
        );

    setsContainer.innerHTML = "";

    const sets =
        assessmentQuestions[currentList];

        console.log(currentList);

console.log(
    assessmentQuestions[currentList]
);

    const setNames =
    Object.keys(sets).filter(
        function(setName) {

            return setName.startsWith(
                "Set"
            );

        }
    );

const completedSets =
    learnerProgress.lists[currentList]
        .completedSets;

let activeSetIndex =
    setNames.findIndex(function(setName) {

        const unresolvedQuestions =
            learnerProgress.lists[currentList]
                .revisionQuestions
                .filter(function(question) {

                    return (
                        question.setName
                        === setName
                    );

                });

        const isFullyMastered =
    completedSets.includes(setName)
    &&
    unresolvedQuestions.length === 0;

        return !isFullyMastered;

    });

setNames.forEach(function(setName, index) {

    let buttonLabel = setName;

    let disabled = "";

    // COMPLETED

    const unresolvedQuestions =
    learnerProgress.lists[currentList]
        .revisionQuestions
        .filter(function(question) {

            return (
                question.setName
                === setName
            );

        });

            const isFullyMastered =
    completedSets.includes(setName)
    &&
    unresolvedQuestions.length === 0;

    
    // FULLY MASTERED

  if (isFullyMastered) {

    buttonLabel =
        "✅ " + setName;

}

    // ACTIVE

    else if (
        index === activeSetIndex
    ) {

        buttonLabel =
            "▶ " + setName;

    }

    // LOCKED

    else {

        buttonLabel =
            "🔒 " + setName;

        disabled = "disabled";

    }

    setsContainer.innerHTML += `
    
        <button class="theme-card"
            ${disabled}
            onclick="${
    isFullyMastered

    ? `openAssessmentReview('${setName}')`

    : `openQuestionSet('${setName}')`
}">

            ${buttonLabel}

        </button>

    `;

});

    if (window.innerWidth <= 1024) {

    closeSidebar();

}

}


//OPEN QUESTION SET


function openQuestionSet(setName) {

    currentSet = setName;

    showPage("assessment-page");

    currentQuestions =
        assessmentQuestions[currentList][currentSet];

    currentQuestionIndex = 0;

    showQuestion();

}

function showQuestion() {

    const questionContainer =
        document.getElementById(
            "question-container"
        );

    const question =
        currentQuestions[
            currentQuestionIndex
        ];

    if (!question) {

        return;

    }

    const answerFunction =

        currentMode ===
        "mastered-assessment"

            ? "checkMasteredAnswer"

            : "checkAnswer";

    questionContainer.innerHTML = `
    
        <div class="item-card">

            <h3>
                ${question.question}
            </h3>

            <div class="options-container">

                ${question.options.map(function(option) {

                    return `
                    
                        <button class="option-btn"
                            onclick="${answerFunction}('${option}')">

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


        initializeListProgress(currentList);

const currentListProgress =
    learnerProgress.lists[currentList];

const questionRecord = {

    questionId:
        currentQuestion.questionId,

    contentId:
        currentQuestion.contentId,

    question:
        currentQuestion.question,

    options:
        currentQuestion.options,

    list:
        currentList,

    setName:
        currentSet,

    selectedAnswer:
        selectedOption,

    correctAnswer:
        currentQuestion.correctAnswer

};

console.log(
    learnerProgress
);

const attemptRecord = {

    questionId:
        currentQuestion.questionId,

    contentId:
        currentQuestion.contentId,

    question:
        currentQuestion.question,

    selectedAnswer:
        selectedOption,

    correctAnswer:
        currentQuestion.correctAnswer,

    isCorrect:
        selectedOption
        === currentQuestion.correctAnswer,

    setName:
        currentSet,

    attemptType:
        revisionMode
            ? "revision"
            : "assessment"

};

const alreadyAttempted =
    currentListProgress.attemptHistory
        .some(function(item) {

            return (

                item.questionId
                === currentQuestion.questionId

                &&

                item.setName
                === currentSet

            );

        });

if (!alreadyAttempted) {

    currentListProgress.attemptHistory
        .push(attemptRecord);

}


    // CORRECT ANSWER

    if (
        selectedOption
        === currentQuestion.correctAnswer
    ) {

        currentListProgress.masteredQuestions
            .push(questionRecord);

        // Remove from revision if mastered later

        currentListProgress.revisionQuestions =
    currentListProgress.revisionQuestions.filter(
                function(item) {

                    return !(
    item.contentId
    === currentQuestion.contentId
    &&
    item.setName
    === currentSet
);

                }
            );

        alert(
            "Correct! Moved to Mastered."
        );

    }

    // WRONG ANSWER


else {

    const alreadyExists =
        currentListProgress.revisionQuestions
            .some(function(item) {

                return (
                    item.contentId
    === currentQuestion.contentId

    &&  

    item.setName
    === currentSet
                );

            });

    if (!alreadyExists) {

        currentListProgress.revisionQuestions
            .push(questionRecord);

    }

    console.log(
    currentListProgress.revisionQuestions
);

    alert(
        "Wrong! Moved to Revision."
    );

}

    // Remove duplicate mastered items

    currentListProgress.masteredQuestions =
        currentListProgress.masteredQuestions.filter(
            (item, index, self) =>
                index === self.findIndex(
                    t =>
                        t.contentId
                        === item.contentId
                )
        );

    // Remove duplicate revision items

  
currentListProgress.revisionQuestions =
    currentListProgress.revisionQuestions.filter(
        (item, index, self) =>
            index === self.findIndex(
                t =>

                    t.contentId
                    === item.contentId

                    &&

                    t.setName
                    === item.setName

            )
    );

    currentQuestionIndex++;

    console.log(currentQuestionIndex);

console.log(currentQuestions.length);

    // NEXT QUESTION

    if (
        currentQuestionIndex
        < currentQuestions.length
    ) {

        showQuestion();

    }

   else {

    console.log(
        "Completion block running"
    );

    if (
    !currentListProgress.completedSets
        .includes(currentSet)
) {

    currentListProgress.completedSets
        .push(currentSet);

} 

    const questionContainer =
        document.getElementById(
            "question-container"
        );

    questionContainer.innerHTML = `
    
        <div class="item-card">

            <h2>
                Assessment Completed
            </h2>

            <p>
                You have completed this set.
            </p>

        </div>

    `;

    revisionMode = false;

    const totalSets =
    Object.keys(
        assessmentQuestions[currentList]
    ).filter(function(setName) {

        return (
            setName === "Set 1"
            ||
            setName === "Set 2"
        );

    }).length;

const completedSetsCount =
    currentListProgress.completedSets
        .filter(function(setName) {

            return setName.startsWith(
                "Set"
            );

        }).length;

if (

    completedSetsCount === totalSets

    &&

    currentListProgress
        .revisionQuestions.length === 0

) {


    console.log(totalSets);

    console.log(completedSetsCount);

    console.log(
        currentListProgress.completedSets
    );

    console.log(
        currentListProgress.revisionQuestions
    );

    currentListProgress.mastered =
        true;

}
    saveProgress();
    console.log(learnerProgress);

}

}

function openMastered() {

    initializeListProgress(currentList);

    const currentListProgress =
        learnerProgress.lists[currentList];

    showPage("mastered-page");

    const masteredContainer =
        document.getElementById(
            "mastered-container"
        );

    masteredContainer.innerHTML = "";

    if (
        currentListProgress.masteredQuestions
            .length === 0
    ) {

        masteredContainer.innerHTML = `
        
            <div class="item-card">

                <h2>
                    No Mastered Questions
                </h2>

            </div>

        `;

        return;

    }

    currentListProgress.masteredQuestions
        .forEach(function(question) {

            masteredContainer.innerHTML += `
            
                <div class="item-card">

                    <h3>
                        ${question.word}
                    </h3>

                    <p>
                        ${question.questionId}
                    </p>

                </div>

            `;

        });

}

function openRevision() {

    initializeListProgress(currentList);

    const currentListProgress =
        learnerProgress.lists[currentList];

    showPage("revision-page");

    const revisionContainer =
        document.getElementById(
            "revision-container"
        );

    revisionContainer.innerHTML = "";

    // No revision questions

    if (
        currentListProgress.revisionQuestions
            .length === 0
    ) {

        revisionContainer.innerHTML = `
        
            <div class="item-card">

                <h2>
                    No Revision Questions
                </h2>

            </div>

        `;

        return;

    }

    // Show revision grouped by set

    const groupedRevision =
    groupRevisionByContent(
        currentListProgress
            .revisionQuestions
    );

Object.keys(groupedRevision)
    .forEach(function(contentId) {

        revisionContainer.innerHTML += `
        
            <div class="item-card">

                <h2>

                    ${contentId}

                </h2>

                <button class="nav-btn"
                    onclick="
                        loadRevisionCard(
                            '${contentId}'
                        )
                    ">

                    Review

                </button>

            </div>

        `;

    });

    if (window.innerWidth <= 1024) {

    closeSidebar();

}

}


function loadRevisionCard(contentId) {

    const currentItems =
        learningItems[currentList];

    const matchedItem =
        currentItems.find(function(item) {

            return (
                item.contentId
                === contentId
            );

        });

    console.log(currentItems);

    console.log(contentId);

    console.log(matchedItem);

    const currentListProgress =
        learnerProgress.lists[currentList];

    const revisionQuestion =
        currentListProgress.revisionQuestions
            .find(function(question) {

                return (
                    question.contentId
                    === contentId
                );

            });

    const revisionContentIds =
    currentListProgress.revisionQuestions
        .map(function(question) {

            return question.contentId;

        });

revisionItems =
    currentItems.filter(function(item) {

        return revisionContentIds.includes(
            item.contentId
        );

    });

revisionItemIndex =
    revisionItems.findIndex(function(item) {

        return (
            item.contentId
            === contentId
        );

    });

    currentRevisionQuestion =
        revisionQuestion;

    showPage("items-page");

     document.querySelector(
    ".card-navigation"
).innerHTML = `
    
    <button class="nav-btn"
        onclick="previousRevisionItem()">

        ← Previous

    </button>

    <button class="nav-btn"
        onclick="completeRevision()">

        Complete

    </button>

    <button class="nav-btn"
        onclick="nextRevisionItem()">

        Next →

    </button>

`;

    showRevisionCard();

}

function nextRevisionItem() {

    if (
        revisionItemIndex
        < revisionItems.length - 1
    ) {

        revisionItemIndex++;

        const nextItem =
            revisionItems[
                revisionItemIndex
            ];

        const currentListProgress =
            learnerProgress.lists[
                currentList
            ];

        currentRevisionQuestion =
            currentListProgress
                .revisionQuestions
                .find(function(question) {

                    return (
                        question.contentId
                        === nextItem.contentId
                    );

                });

        showRevisionCard();

    }

}

function previousRevisionItem() {

    if (
        revisionItemIndex > 0
    ) {

        revisionItemIndex--;

        const previousItem =
            revisionItems[
                revisionItemIndex
            ];

        const currentListProgress =
            learnerProgress.lists[
                currentList
            ];

        currentRevisionQuestion =
            currentListProgress
                .revisionQuestions
                .find(function(question) {

                    return (
                        question.contentId
                        === previousItem.contentId
                    );

                });

        showRevisionCard();

    }

}

function completeRevision() {

    const currentListProgress =
        learnerProgress.lists[currentList];

        console.log(
    "Revision Questions:",
    currentListProgress.revisionQuestions
);

console.log(
    "Current Set:",
    currentSet
);

    currentQuestions =
        currentListProgress.revisionQuestions
            .filter(function(question) {

                return (
                    question.setName
                    === currentSet
                );

            });

    currentQuestionIndex = 0;

    revisionMode = true;

    showPage("assessment-page");
    showQuestion();

}

// OLD REVISION RETEST ENGINE
// CURRENTLY UNUSED
// PRESERVED FOR FUTURE RETRY FEATURE

function startRevisionAssessment() {

    currentQuestions = revisionQuestions;

    revisionQuestions = [];

    currentQuestionIndex = 0;

    showPage("assessment-page");

    showQuestion();

}


function openRevisionSet(setName) {

    initializeListProgress(currentList);

    const currentListProgress =
        learnerProgress.lists[currentList];

    currentSet = setName;

    // Find unresolved content

    const unresolvedContent =
        currentListProgress.revisionQuestions
            .filter(function(question) {

                return (
                    question.setName
                    === setName
                );

            })
            .map(function(question) {

                return question.contentId;

            });

    // Pull matching learning cards

    revisionItems =
        learningItems[currentList]
            .filter(function(item) {

                return unresolvedContent
                    .includes(item.contentId);

            });

    revisionItemIndex = 0;

    showPage("items-page");

    showRevisionCard();

}

function showRevisionCard() {

    const itemsContainer =
        document.getElementById(
            "items-container"
        );

    itemsContainer.innerHTML = "";

    const item =
        revisionItems[revisionItemIndex];

    itemsContainer.innerHTML = `
    
        <div class="item-card revision-card">

    <div class="revision-feedback">

        <p>

            <strong>
                Question:
            </strong>

            ${currentRevisionQuestion.question}

        </p>

        <p>

            <strong>
                Your Answer:
            </strong>

            ❌ ${currentRevisionQuestion.selectedAnswer}

        </p>

        <p>

            <strong>
                Correct Answer:
            </strong>

            ✅ ${currentRevisionQuestion.correctAnswer}

        </p>

    </div>

    <div class="revision-learning-card">

        <h2>
            ${item.title}
        </h2>

        <p>

            <strong>
                Definition:
            </strong>

            ${item.content.definition}

        </p>

        <p>

            <strong>
                Synonyms:
            </strong>

            ${item.content.synonyms}

        </p>

        <p>

            <strong>
                Antonyms:
            </strong>

            ${item.content.antonyms}

        </p>

        <div class="examples">

            <strong>
                Examples:
            </strong>

            <ul>

                ${item.content.examples.map(
                    function(example) {

                        return `
                        
                            <li>
                                ${example}
                            </li>

                        `;

                    }
                ).join("")}

            </ul>

        </div>

    </div>

</div>

    `;

}


function groupRevisionByContent(
    revisionQuestions
) {

    const grouped = {};

    revisionQuestions.forEach(function(question) {

        const contentId =
            question.contentId;

        if (!grouped[contentId]) {

            grouped[contentId] = [];

        }

        grouped[contentId]
            .push(question);

    });

    return grouped;

}

function openAssessmentReview(setName) {

    currentSet = setName;

    initializeListProgress(currentList);

    const currentListProgress =
        learnerProgress.lists[currentList];

    const attemptHistory =
        currentListProgress.attemptHistory
            .filter(function(attempt) {

                return (
                    attempt.setName
                    === setName
                );

            });

    showPage("assessment-page");

    // RESET ACTIVE QUIZ STATE

    currentQuestions = [];

    currentQuestionIndex = 0;

    const questionContainer =
        document.getElementById(
            "question-container"
        );

    questionContainer.innerHTML = "";

    // EMPTY STATE

    if (attemptHistory.length === 0) {

        questionContainer.innerHTML = `
        
            <div class="item-card">

                <h2>
                    No Attempt History
                </h2>

                <p>
                    ${setName}
                </p>

            </div>

        `;

        return;

    }

    // RENDER REVIEW CARDS

    attemptHistory.forEach(function(attempt) {

        questionContainer.innerHTML += `
        
            <div class="item-card">

                <p>

                    <strong>
                        Question:
                    </strong>

                    ${attempt.question}

                </p>

                <p>

                    <strong>
                        Your First Answer:
                    </strong>

                    ${
                        attempt.isCorrect
                        ? "✅"
                        : "❌"
                    }

                    ${attempt.selectedAnswer}

                </p>

                <p>

                    <strong>
                        Correct Answer:
                    </strong>

                    ✅ ${attempt.correctAnswer}

                </p>

            </div>

        `;

    });

    // RETURN BUTTON

    questionContainer.innerHTML += `
    
        <div style="margin-top: 20px;">

            <button
                class="theme-card"
                style="
                    width: 100%;
                    text-align: center;
                "
                onclick="
                    openAssessment(
                        '${currentList}'
                    )
                ">

                ← Back to Assessment Sets

            </button>

        </div>

    `;

}


function toggleMasteredMenu() {

    document.getElementById(
        "mastered-submenu"
    ).classList.toggle(
        "hidden"
    );

}

function toggleAssessmentMenu() {

    document.getElementById(
        "assessment-submenu"
    ).classList.toggle(
        "hidden"
    );

}


// REVIEW Board

function showMasteredReviewCard() {

    console.log(
        "MASTERED REVIEW CARD"
    );

    const itemsContainer =
        document.getElementById(
            "items-container"
        );

    itemsContainer.innerHTML = "";

    const item =
        currentItems[currentItemIndex];

        console.log(item);

    // VOCABULARY REVIEW

    if (
        item.contentType === "word"
    ) {

        itemsContainer.innerHTML = `
        
            <div class="item-card">

                <h2>
                    ${item.title}
                </h2>

                <p>

                    <strong>
                        Definition:
                    </strong>

                    ${item.content.definition}

                </p>

                <div class="examples">

                    <strong>
                        Examples:
                    </strong>

                    <ul>

                        ${item.content.examples.map(
                            function(example) {

                                return `
                                
                                    <li>
                                        ${example}
                                    </li>

                                `;

                            }
                        ).join("")}

                    </ul>

                </div>

            </div>

        `;

    }

    // LESSON REVIEW

    else if (
        item.contentType === "lesson"
    ) {

        itemsContainer.innerHTML = `
        
            <div class="item-card">

                <h2>
                    ${item.title}
                </h2>

                <p>

                    <strong>
                        Explanation:
                    </strong>

                    ${item.content.explanation}

                </p>

                <div class="examples">

                    <strong>
                        Examples:
                    </strong>

                    <ul>

                        ${item.content.examples.map(
                            function(example) {

                                return `
                                
                                    <li>
                                        ${example}
                                    </li>

                                `;

                            }
                        ).join("")}

                    </ul>

                </div>

            </div>

        `;

    }

    updateNavigationButtons();

}

function openAssessmentReviewSets(
    listName
) {

    currentList = listName;

    showPage(
        "assessment-sets-page"
    );

    const setsContainer =
        document.getElementById(
            "assessment-sets-container"
        );

    setsContainer.innerHTML = "";

    const completedSets =
        learnerProgress.lists[
            currentList
        ].completedSets;

    completedSets.forEach(function(
        setName
    ) {

        setsContainer.innerHTML += `
        
            <button class="theme-card"
                onclick="
                    openAssessmentReview(
                        '${setName}'
                    )
                ">

                ✅ ${setName}

            </button>

        `;

    });

}

function openMasteredAssessment(
    listName
) {

    currentList = listName;

    initializeListProgress(
        currentList
    );

    showPage(
        "assessment-sets-page"
    );

    const setsContainer =
        document.getElementById(
            "assessment-sets-container"
        );

    setsContainer.innerHTML = "";

    const sets =
        assessmentQuestions[currentList];

    if (!sets) {

        return;

    }

    const progress =
        learnerProgress.lists[
            currentList
        ];

    const completedMasteredSets =
        progress
            .completedMasteredSets
        || [];

    const masteredSets =
        Object.keys(sets)
            .filter(function(setName) {

                return setName.startsWith(
                    "Day"
                );

            });

    masteredSets.forEach(function(setName) {

        const unresolvedQuestions =
            progress
                .masteredRevisionQuestions
                .filter(function(question) {

                    return (
                        question.setName
                        === setName
                    );

                });

                console.log(
    "Completed:",
    progress.completedMasteredSets
);

console.log(
    "Revision:",
    progress.masteredRevisionQuestions
);

        const isFullyCompleted =

            completedMasteredSets
                .includes(setName)

            &&

            unresolvedQuestions
                .length === 0;

                console.log(
    "SET:",
    setName
);

console.log(
    "COMPLETED SETS:",
    completedMasteredSets
);

console.log(
    "UNRESOLVED QUESTIONS:",
    unresolvedQuestions
);

console.log(
    "IS FULLY COMPLETED:",
    isFullyCompleted
);

        if (
            isFullyCompleted
        ) {

            return;

        }

        setsContainer.innerHTML += `
        
            <button class="theme-card"
                onclick="
                    openMasteredQuestionSet(
                        '${setName}'
                    )
                ">

                ${setName}

            </button>

        `;

    });

}

function openMasteredQuestionSet(
    setName
) {

    currentSet = setName;

    showPage(
        "assessment-page"
    );

    currentQuestions =
        assessmentQuestions[currentList]
            [currentSet];

    currentQuestionIndex = 0;

    masteredAssessmentMode = true;

    showQuestion();

}


function checkMasteredAnswer(
    selectedOption
) {

    const currentQuestion =
        currentQuestions[currentQuestionIndex];

    initializeListProgress(
        currentList
    );

    const currentListProgress =
        learnerProgress.lists[
            currentList
        ];

    const questionRecord = {

        questionId:
            currentQuestion.questionId,

        contentId:
            currentQuestion.contentId,

        question:
            currentQuestion.question,

        options:
            currentQuestion.options,

        list:
            currentList,

        setName:
            currentSet,

        selectedAnswer:
            selectedOption,

        correctAnswer:
            currentQuestion.correctAnswer

    };

    // CORRECT

    if (
        selectedOption
        === currentQuestion.correctAnswer
    ) {

        currentListProgress
            .masteredRevisionQuestions =

            currentListProgress
                .masteredRevisionQuestions
                .filter(function(item) {

                    return !(

                        item.contentId
                            === currentQuestion.contentId

                        &&

                        item.setName
                            === currentSet

                    );

                });

        alert(
            "Correct!"
        );

    }

    // WRONG

    else {

        const alreadyExists =

            currentListProgress
                .masteredRevisionQuestions
                .some(function(item) {

                    return (

                        item.contentId
                            === currentQuestion.contentId

                        &&

                        item.setName
                            === currentSet

                    );

                });

        if (!alreadyExists) {

            currentListProgress
                .masteredRevisionQuestions
                .push(questionRecord);

        }

        alert(
            "Wrong! Moved to Revision."
        );

    }

    // REMOVE DUPLICATES

    currentListProgress
        .masteredRevisionQuestions =

        currentListProgress
            .masteredRevisionQuestions
            .filter(
                (item, index, self) =>

                    index ===
                    self.findIndex(
                        t =>

                            t.contentId
                                === item.contentId

                            &&

                            t.setName
                                === item.setName
                    )
            );

    currentQuestionIndex++;

    // NEXT QUESTION

    if (
        currentQuestionIndex
        < currentQuestions.length
    ) {

        showQuestion();

    }

    // SET COMPLETED

    else {

        if (
            !currentListProgress
                .completedMasteredSets
                .includes(currentSet)
        ) {

            currentListProgress
                .completedMasteredSets
                .push(currentSet);

        }

        // FINAL MASTERED STATE

        const allDaySets =

            Object.keys(
                assessmentQuestions[
                    currentList
                ]
            ).filter(function(setName) {

                return setName.startsWith(
                    "Day"
                );

            });

        const completedDaySets =

            currentListProgress
                .completedMasteredSets
                .filter(function(setName) {

                    return setName.startsWith(
                        "Day"
                    );

                });

        const allMasteredFinished =

            completedDaySets.length
                === allDaySets.length

            &&

            currentListProgress
                .masteredRevisionQuestions
                .length === 0;

        if (
            allMasteredFinished
        ) {

            currentListProgress
                .masteredAssessmentCompleted = true;

        }

        alert(
            "Mastered Assessment Completed"
        );

        saveProgress();
        openMasteredAssessment(
            currentList
        );

    }

}
function openMasteredRevisionDashboard() {

    currentMode =
        "mastered-revision";

    masteredMode = false;

    showPage(
        "assessment-dashboard-page"
    );

    document.querySelector(
        "#assessment-dashboard-page h2"
    ).innerText =
        "Mastered Revision";

    const container =
        document.getElementById(
            "assessment-dashboard-container"
        );

    container.innerHTML = "";

    const selectedCourse =
        courses.find(function(course) {

            return (
                course.title
                === currentCourse
            );

        });

    const learningAreas =
        selectedCourse.learningAreas;

    learningAreas.forEach(function(area) {

        const areaThemes =
            themes.filter(function(theme) {

                return (
                    theme.learningArea
                    === area
                );

            });

        let hasRevisionLists = false;

        areaThemes.forEach(function(theme) {

            const themeLists =
                lists.filter(function(list) {

                    return (
                        list.themeTitle
                        === theme.title
                    );

                });

            themeLists.forEach(function(list) {

                const progress =
                    learnerProgress.lists[
                        list.title
                    ];

                if (

    progress

    &&

    progress
        .masteredRevisionQuestions
        .length > 0

) {

                    hasRevisionLists = true;

                }

            });

        });

        if (hasRevisionLists) {

            container.innerHTML += `
            
                <button class="theme-card"
                    onclick="
                        openThemes(
                            '${area}'
                        )
                    ">

                    ${area}

                </button>

            `;

        }

    });

}

function openMasteredRevision() {

    initializeListProgress(
        currentList
    );

    const currentListProgress =
        learnerProgress.lists[
            currentList
        ];

    showPage(
        "revision-page"
    );

    const revisionContainer =
        document.getElementById(
            "revision-container"
        );

    revisionContainer.innerHTML = "";

    if (
        currentListProgress
            .masteredRevisionQuestions
            .length === 0
    ) {

        revisionContainer.innerHTML = `
        
            <div class="item-card">

                <h2>
                    No Revision Questions
                </h2>

            </div>

        `;

        return;

    }

    const groupedRevision =
        groupRevisionByContent(

            currentListProgress
                .masteredRevisionQuestions

        );

    Object.keys(groupedRevision)
        .forEach(function(contentId) {

            revisionContainer.innerHTML += `
            
                <div class="item-card">

                    <h2>

                        ${contentId}

                    </h2>

                    <button class="nav-btn"
                        onclick="
                            console.log('BUTTON CLICKE');
                            loadMasteredRevisionCard(
                                '${contentId}'
                            )
                        ">

                        Review

                    </button>

                </div>

            `;

        });

}

function loadMasteredRevisionCard(
    contentId
) {

  console.log(
    "LOAD MASTERED REVISION CALLED"
);

console.log(
    "contentId:",
    contentId
);

console.log(
    "currentList:",
    currentList
);

console.log(
    "masteredRevisionQuestions:",
    learnerProgress.lists[currentList]
        .masteredRevisionQuestions
);

    const currentItems =
        learningItems[currentList];

    const currentListProgress =
        learnerProgress.lists[
            currentList
        ];

    const revisionQuestion =
        currentListProgress
            .masteredRevisionQuestions
            .find(function(question) {

                return (
                    question.contentId
                    === contentId
                );

            });

    const revisionContentIds =
        currentListProgress
            .masteredRevisionQuestions
            .map(function(question) {

                return question.contentId;

            });

    revisionItems =
        currentItems.filter(function(item) {

            return revisionContentIds
                .includes(
                    item.contentId
                );

        });

    revisionItemIndex =
        revisionItems.findIndex(function(item) {

            return (
                item.contentId
                === contentId
            );

        });

    currentRevisionQuestion =
        revisionQuestion;

    showPage(
        "items-page"
    );

    document.querySelector(
        ".card-navigation"
    ).innerHTML = `
    
        <button class="nav-btn"
            onclick="
                previousMasteredRevisionItem()
            ">

            ← Previous

        </button>

        <button class="nav-btn"
            onclick="
                completeMasteredRevision()
            ">

            Complete

        </button>

        <button class="nav-btn"
            onclick="
                nextMasteredRevisionItem()
            ">

            Next →

        </button>

    `;

   showRevisionCard();

}

function completeMasteredRevision() {

    currentQuestions =
    learnerProgress.lists[currentList]
        .masteredRevisionQuestions;

    currentQuestionIndex = 0;

    currentMode =
        "mastered-assessment";

    showPage(
        "assessment-page"
    );

    showQuestion();

}

function resetCardNavigation() {

    document.querySelector(
        ".card-navigation"
    ).innerHTML = `
    
        <button class="nav-btn"
            onclick="previousItem()">

            ← Previous

        </button>

        <button class="nav-btn"
            onclick="nextItem()">

            Next →

        </button>

    `;

}


function updateRevisionNavigationButtons() {

    const previousButton =
        document.querySelector(
            ".card-navigation button:first-child"
        );

    const nextButton =
        document.querySelector(
            ".card-navigation button:last-child"
        );

    if (
        revisionItemIndex === 0
    ) {

        previousButton.style.visibility =
            "hidden";

    }

    else {

        previousButton.style.visibility =
            "visible";

    }

    if (
        revisionItemIndex
        === revisionItems.length - 1
    ) {

        nextButton.style.visibility =
            "hidden";

    }

    else {

        nextButton.style.visibility =
            "visible";

    }

}

function nextMasteredRevisionItem() {

    if (
        revisionItemIndex
        < revisionItems.length - 1
    ) {

        revisionItemIndex++;

        const nextItem =
            revisionItems[
                revisionItemIndex
            ];

        const currentListProgress =
            learnerProgress.lists[
                currentList
            ];

        currentRevisionQuestion =
            currentListProgress
                .masteredRevisionQuestions
                .find(function(question) {

                    return (
                        question.contentId
                        === nextItem.contentId
                    );

                });

        showRevisionCard();

    }

}

function previousMasteredRevisionItem() {

    if (
        revisionItemIndex > 0
    ) {

        revisionItemIndex--;

        const previousItem =
            revisionItems[
                revisionItemIndex
            ];

        const currentListProgress =
            learnerProgress.lists[
                currentList
            ];

        currentRevisionQuestion =
            currentListProgress
                .masteredRevisionQuestions
                .find(function(question) {

                    return (
                        question.contentId
                        === previousItem.contentId
                    );

                });

        showRevisionCard();

    }

}


function saveProgress() {

    localStorage.setItem(
        "learnerProgress",
        JSON.stringify(
            learnerProgress
        )
    );

}


function loadProgress() {

    const savedProgress =
        localStorage.getItem(
            "learnerProgress"
        );

    if (savedProgress) {

        learnerProgress =
            JSON.parse(
                savedProgress
            );

    }

}


function openProgressDashboard() {

    showPage(
        "progress-dashboard-page"
    );

    const container =
        document.getElementById(
            "progress-dashboard-container"
        );

    let totalLists = 0;

    let learnedLists = 0;

    let masteredLists = 0;

    Object.keys(
        learnerProgress.lists
    ).forEach(function(listName) {

        totalLists++;

        const progress =
            learnerProgress.lists[
                listName
            ];

        if (
            progress.learned
        ) {

            learnedLists++;

        }

        if (
            progress.mastered
        ) {

            masteredLists++;

        }

    });

    container.innerHTML = `
    
        <div class="item-card">

            <h2>
                Overall Progress
            </h2>

            <p>
                Total Lists:
                ${totalLists}
            </p>

            <p>
                Learned Lists:
                ${learnedLists}
            </p>

            <p>
                Mastered Lists:
                ${masteredLists}
            </p>

        </div>

    `;

}

function toggleMenu() {

    const sidebar =
        document.querySelector(
            ".sidebar"
        );

    const overlay =
        document.getElementById(
            "sidebar-overlay"
        );

    sidebar.classList.toggle(
        "mobile-open"
    );

    overlay.classList.toggle(
        "active"
    );

}

function closeSidebar() {

    document
        .querySelector(".sidebar")
        .classList
        .remove("mobile-open");

    document
        .getElementById("sidebar-overlay")
        .classList
        .remove("active");

}

loadProgress();

showPage("cover-page"); 
