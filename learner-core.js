// LIST INITIALIZER

function initializeListProgress(
    listName
) {

    if (!listName) {

        console.error(
            "Invalid listName:",
            listName
        );

        return;

    }

    const learnerData =
        getCurrentLearnerProgress();

    if (
        !learnerData.lists[listName]
    ) {

        learnerData.lists[listName] = {

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
        learnerData.lists[listName];

    progress.completedMasteredSets =
        progress.completedMasteredSets || [];

    progress.masteredRevisionQuestions =
        progress.masteredRevisionQuestions || [];

}

function loginLearner() {

    const mobile =

        document.getElementById(
            "login-mobile"
        ).value.trim();

    const learner =

        learners.find(
            l =>
            l.mobile === mobile
        );

    if (!learner) {

        alert(
            "User not found."
        );

        return;

    }

    currentLearner =
        learner;

        if (
    !learnerProgress[
        currentLearner.learnerId
    ]
) {

    learnerProgress[
        currentLearner.learnerId
    ] = {

        lists: {}

    };

}

    renderCourses();

    document.querySelector(
        ".login-container"
    ).classList.add(
        "hidden"
    );

    document.getElementById(
        "course-container"
    ).classList.remove(
        "hidden"
    );

}

function openCourse(courseId) {

    currentCourse = courseId;

    const selectedCourse =
    courses.find(function(course) {

        return (
            course.courseId
            === courseId
        );

    });

    document.querySelector(
        ".course-title"
    ).textContent =
        selectedCourse.title;

    document.getElementById(
    "course-welcome-title"
).textContent =
    selectedCourse.welcomeTitle;

document.getElementById(
    "course-welcome-message"
).textContent =
    selectedCourse.welcomeMessage;

    showPage("course-page");

    showPage("course-home-page");

}


function renderCourses() {

    const courseContainer =
        document.getElementById(
            "course-container"
        );

    courseContainer.innerHTML = "";

    if (
        !currentLearner
    ) {

        return;

    }

    const learnerCourses =
        courses.filter(
            course =>
                currentLearner
                .assignedCourses
                .includes(
                    course.courseId
                )
        );

    if (
        learnerCourses.length === 0
    ) {

        courseContainer.innerHTML = `

<h2>

    No Courses Assigned

</h2>

<p>

    Please contact your teacher
    for assistance.

</p>

`;

        return;

    }

    learnerCourses.forEach(
        function(course) {

            courseContainer.innerHTML += `

<button
    class="course-card"
    onclick="
        openCourse(
            '${course.courseId}'
        )
    ">

    ${course.title}

</button>

`;

        }
    );

}


//Open Learn

function openLearn() {

    currentMode = "learn";

    masteredMode = false;

    showPage("learn-page");

    document.querySelector(
    "#learn-page h2"
).innerText =
    "Learning Areas";

    const learningAreasContainer =
        document.getElementById(
            "learning-areas-container"
        );

    learningAreasContainer.innerHTML = "";

    const selectedCourse =
        courses.find(function(course) {

            return (
                course.courseId
                === currentCourse
            );

        });

    const courseLearningAreas = [];

selectedCourse.assignedLists.forEach(
    function(listId) {

        const list =
            lists.find(
                l =>
                l.listId === listId
            );

        if (!list) {

            return;

        }

        const theme =
            themes.find(
                t =>
                t.themeId ===
                list.themeId
            );

        if (!theme) {

            return;

        }

        const area =
            learningAreas.find(
                a =>
                a.areaId ===
                theme.learningAreaId
            );

        if (
            area &&
            !courseLearningAreas.includes(
                area.title
            )
        ) {

            courseLearningAreas.push(
                area.title
            );

        }

    });

    courseLearningAreas.forEach(function(area) {

        let hasEligibleContent = false;

       const areaThemes =
    getThemesByLearningArea(
        area
    );

        areaThemes.forEach(function(theme) {

           const themeLists =
    getListsByThemeId(
        theme.themeId
    );

            themeLists.forEach(function(list) {

                if (
    getItemsByListId(
        list.listId
    ).length > 0
) {

    hasEligibleContent = true;

}
            });

        });

        if (!hasEligibleContent) {

            return;

        }

        learningAreasContainer.innerHTML += `
        
            <button class="learning-area-card"
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

// open Themes

function openThemes(areaName) {

    currentSection = areaName;

    showPage("themes-page");

    const themesContainer =
        document.getElementById(
            "themes-container"
        );

    themesContainer.innerHTML = "";

   const filteredThemes =
    getThemesByLearningArea(
        areaName
    );

    filteredThemes.forEach(function(theme) {

        let hasEligibleContent = false;

        const themeLists =
    getListsByThemeId(
        theme.themeId
    );

        themeLists.forEach(function(list) {

           if (
    getItemsByListId(
        list.listId
    ).length > 0
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
                        '${theme.themeId}'
                    )
                ">

                ${theme.themeTitle}

            </button>

        `;

        if (window.innerWidth <= 1024) {

    closeSidebar();

}

    });


}

function openLists(themeId) {

    currentTheme = themeId;

    showPage("lists-page");

    const theme =
    getThemes().find(
        function(theme) {

            return (
                theme.themeId
                === themeId
            );

        }
    );

    document.getElementById(
    "lists-title"
).innerText =
    theme.themeTitle;

    const listsContainer =
        document.getElementById(
            "lists-container"
        );

    listsContainer.innerHTML = "";

   const filteredLists =
    getListsByThemeId(
        themeId
    );

    const learnerData =
    getCurrentLearnerProgress();

    filteredLists.forEach(function(list) {

    // SHOW ONLY IF CONTENT EXISTS

    if (
    getItemsByListId(
        list.listId
    ).length > 0
) { 

         // MASTERED REVIEW FILTER

    if (
        currentMode
        === "mastered-review"
    ) 

    {

        const learnerData =
    getCurrentLearnerProgress();

const progress =
    learnerData.lists[
        list.listId
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
    list.listTitle;

 const progress =
    learnerData.lists[
        list.listId
    ];

if (
    currentMode === "learn"
) {

    if (
        progress
        &&
        progress.mastered
    ) {

        displayTitle =
            "🏆 " + list.listTitle;

    }

    else if (
        progress
        &&
        progress.learned
    ) {

        displayTitle =
            "📖 " + list.listTitle;

    }

}

else if (
    progress
    &&
    progress.learned
) {

    displayTitle =
        "📖 " + list.listTitle;

}

        listsContainer.innerHTML += `
        
            <button class="list-card"
                onclick="

                ${
    currentMode === "learn"

    ? `openItems('${list.listId}')`

    : currentMode === "assessment"

    ? `openAssessment('${list.listId}')`

    : currentMode === "revision"

    ? `openRevision('${list.listId}')`

    : currentMode === "assessment-review"

    ? `openAssessmentReviewSets('${list.listId}')`

    : currentMode === "mastered-review"

    ? `openItems('${list.listId}')`

    : currentMode === "mastered-assessment"

    ? `openMasteredAssessment('${list.listId}')`

    : currentMode === "mastered-revision"

    ? `openMasteredRevision('${list.listId}')`

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


function openItems(listId) {

    currentList = listId;

    currentMode = "learn";

    showPage("items-page");

    restoreLearningNavigation();

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

    const list =
    getLists().find(
        function(list) {

            return (
                list.listId
                === listId
            );

        }
    );

    document.getElementById(
    "items-title"
).innerText =
    list.listTitle;

    currentItems =
    getItemsByListId(
        listId
    );

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

            <div class="item-header">

                <div class="item-info">

                    <p class="card-counter">

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

                </div>

                 <div class="item-image">

    ${
        item.content.image
        ? `<img src="${item.content.image}">`
        : "Image Coming Soon"
    }

</div>

            </div>

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

    const learnerData =
        getCurrentLearnerProgress();

    if (masteredMode) {

        return;

    }

    learnerData.lists[currentList]
        .learned = true;

    saveProgress();

    alert(
        "Learning Completed. Assessment Unlocked."
    );

    openLists(
        currentTheme
    );
}

/*========================
openSearch
===========================*/

function openSearch() {


    showPage(
        "search-page"
    );

    const filter =
        document.getElementById(
            "search-filter"
        );

    filter.innerHTML = "";

    filter.innerHTML += `
    
        <option value="all">

            All Learning Areas

        </option>

    `;

    const selectedCourse =
        courses.find(function(course) {

            return (
                course.courseId
                === currentCourse
            );

        });

    selectedCourse.learningAreas
        .forEach(function(area) {

            filter.innerHTML += `
            
                <option value="${area}">

                    ${area}

                </option>

            `;

        });

    document.getElementById(
        "search-input"
    ).value = "";

    document.getElementById(
        "search-results"
    ).innerHTML = "";

}

function searchContent() {

    let resultsFound = false;

    const selectedArea =
        document.getElementById(
            "search-filter"
        ).value;

    const searchTerm =
        document.getElementById(
            "search-input"
        ).value
        .toLowerCase();

    const resultsContainer =
        document.getElementById(
            "search-results"
        );

    resultsContainer.innerHTML = "";

    if (
        searchTerm.trim() === ""
    ) {

        return;

    }

    learningItems.forEach(
    function(item) {

            const matchesArea =

                selectedArea === "all"

                ||

                item.learningArea
                === selectedArea;

             let matchesSearch = false;

if (
    selectedArea === "Vocabulary"
) {

    matchesSearch =

        item.title
            .toLowerCase()
            .startsWith(
                searchTerm
            );

}

else {

    matchesSearch =

        item.title
            .toLowerCase()
            .includes(
                searchTerm
            );

}

            if (
                matchesArea
                &&
                matchesSearch
            ) {

                resultsFound = true;

                resultsContainer.innerHTML += `
                
                    <div class="search-result-card"

    onclick="
    openSearchResult(
    '${item.listId}',
    '${item.contentId}'
)
    ">

                        <h3>

                            ${item.title}

                        </h3>

                        <p>

                            ${item.learningArea}

                        </p>

                    </div>

                `;
            }

});




if (!resultsFound) {

    resultsContainer.innerHTML = `
    
        <div class="item-card">

            <h3>

                No results found

            </h3>

            <p>

                Check your spelling or try another keyword.

            </p>

        </div>

    `;

}
}

function openSearchResult(

    listId,
    contentId
) {

    currentList =
        listId;

    currentItems =
        getItemsByListId(
            listId
        );

    currentItemIndex =
        currentItems.findIndex(
            function(item) {

                return (
                    item.contentId
                    === contentId
                );

            }
        );

    showPage(
        "items-page"
    );

    /* document.querySelector(
        ".card-navigation"
    ).innerHTML = `

        <button
            class="nav-btn"
            onclick="openSearch()">

            ← Back to Search

        </button>

    `;
*/
    currentMode = "search";

    showItemCard();

}

function openProgressDashboard() {

    showPage(
        "progress-dashboard-page"
    );

    const container =
        document.getElementById(
            "progress-dashboard-container"
        );

        const course =
    courses.find(
        c =>
        c.courseId === currentCourse
    );

const assignedLists =
    course.assignedLists || [];

    const learnerData =
    getCurrentLearnerProgress();

   const totalLists =
    assignedLists.length;

    let learnedLists = 0;

    let masteredLists = 0;

    assignedLists.forEach(
    function(listId) {

         const progress =
    learnerData.lists[
        listId
    ];

        if (!progress) {

            return;

        }

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

    }
);

const progressPercent =

    totalLists > 0

    ?

    Math.round(
        (
            masteredLists
            /
            totalLists
        ) * 100
    )

    :

    0;

    const status =

    progressPercent === 100

    ?

    "Mastered"

    :

    learnedLists > 0

    ?

    "In Progress"

    :

    "Not Started";

    container.innerHTML = `
    
        <div class="item-card">
            <h2>

    Progress Card 

</h2>

<p>
    <strong>Learner ID:</strong>
    ${currentLearner.learnerId}
</p>

<p>

    <strong>Learner:</strong>
    ${currentLearner.fullName}

</p>

<p>

    <strong>Course ID:</strong>
    ${course.courseId}

</p>

<p>

    <strong>Course:</strong>
    ${course.title}

</p>

<hr>

            <p>
                <strong>Total Lists:</strong>
                ${totalLists}
            </p>

            <p>
                <strong>Learned Lists:</strong>
                ${learnedLists}
            </p>

            <p>
                <strong>Mastered Lists:</strong>
                ${masteredLists}
            </p>

            <p>

    <strong>Progress:</strong>
    ${progressPercent}%

</p>

<p>

    <strong>Status:</strong>
    ${status}

</p>

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

    // CLEAN OLD ARCHITECTURE

    delete learnerProgress.lists;

}

/*======================================
    LEARNER PROGRESS MODEL

    learnerProgress = {

        AKL0001: {

            lists: {

                LI001: {

                    learned: true,

                    completedSets: [],

                    revisionQuestions: [],

                    masteredQuestions: [],

                    attemptHistory: [],

                    mastered: false

                }

            }

        }

    }
        
    Progress is stored per learner.
    Never use learnerProgress.lists.

======================================*/

function saveProgress() {

    localStorage.setItem(
        "learnerProgress",
        JSON.stringify(
            learnerProgress
        )
    );

}


/*========================
    Assessment
===========================*/


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
                course.courseId
                === currentCourse
            );

        });

    const courseLearningAreas = [];

selectedCourse.assignedLists.forEach(
    function(listId) {

        const list =
            lists.find(
                l =>
                l.listId === listId
            );

        if (!list) {

            return;

        }

        const theme =
            themes.find(
                t =>
                t.themeId ===
                list.themeId
            );

        if (!theme) {

            return;

        }

        const area =
            learningAreas.find(
                a =>
                a.areaId ===
                theme.learningAreaId
            );

        if (
            area &&
            !courseLearningAreas.includes(
                area.title
            )
        ) {

            courseLearningAreas.push(
                area.title
            );

        }


    });

    courseLearningAreas.forEach(function(area) {

    // CHECK IF AREA HAS
    // ELIGIBLE LEARNED LISTS

   const areaThemes =
    getThemesByLearningArea(
        area
    );

    let hasEligibleLists = false;

    areaThemes.forEach(function(theme) {

    const themeLists =
    getListsByThemeId(
        theme.themeId
    );

        themeLists.forEach(function(list) {

            const learnerData =
    getCurrentLearnerProgress();

const progress =
    learnerData.lists[
        list.listId
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
        
            <button class="learning-area-card"
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

//OPEN ASSESSMENT


function openAssessment(listId) {

    currentList = listId;

    const learnerData =
    getCurrentLearnerProgress();

    if (
    !learnerData.lists[currentList]
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

    const setNames =
    getAssessmentSetsByListId(
        currentList
    );

   

const completedSets =
    learnerData.lists[currentList]
        .completedSets;

let activeSetIndex =
    setNames.findIndex(function(setName) {

        const unresolvedQuestions =
            learnerData.lists[currentList]
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
    learnerData.lists[currentList]
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

    showPage(
        "assessment-page"
    );

    const list =
        getLists().find(
            function(list) {

                return (
                    list.listId
                    === currentList
                );

            }
        );

    currentQuestions =
        getQuestionsBySet(
            currentList,
            currentSet
        );

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

        <p class="card-counter">

    Question ${currentQuestionIndex + 1}
    of
    ${currentQuestions.length}

</p>

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

        const learnerData =
    getCurrentLearnerProgress();

const currentListProgress =
    learnerData.lists[currentList];

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
    getAssessmentSetsByListId(
        currentList
    ).length;

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
                course.courseId
                === currentCourse
            );

        });

    const courseLearningAreas = [];

    selectedCourse.assignedLists.forEach(
    function(listId) {

        const list =
            lists.find(
                l =>
                l.listId === listId
            );

        if (!list) {

            return;

        }

        const theme =
            themes.find(
                t =>
                t.themeId ===
                list.themeId
            );

        if (!theme) {

            return;

        }

        const area =
            learningAreas.find(
                a =>
                a.areaId ===
                theme.learningAreaId
            );

        if (
            area &&
            !courseLearningAreas.includes(
                area.title
            )
        ) {

            courseLearningAreas.push(
                area.title
            );

        }

    });

    courseLearningAreas.forEach(function(area) {

        const areaThemes =
    getThemesByLearningArea(
        area
    );

        let hasReviewLists = false;

        areaThemes.forEach(function(theme) {

            const themeLists =
    getListsByThemeId(
        theme.themeId
    );

            themeLists.forEach(function(list) {

const learnerData =
    getCurrentLearnerProgress();

const progress =
    learnerData.lists[
        list.listId
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

/*=================================
        Revision
===================================*/
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
                course.courseId
                === currentCourse
            );

        });

    const courseLearningAreas = [];

    selectedCourse.assignedLists.forEach(
    function(listId) {

        const list =
            lists.find(
                l =>
                l.listId === listId
            );

        if (!list) {

            return;

        }

        const theme =
            themes.find(
                t =>
                t.themeId ===
                list.themeId
            );

        if (!theme) {

            return;

        }

        const area =
            learningAreas.find(
                a =>
                a.areaId ===
                theme.learningAreaId
            );

        if (
            area &&
            !courseLearningAreas.includes(
                area.title
            )
        ) {

            courseLearningAreas.push(
                area.title
            );

        }

    });

    courseLearningAreas.forEach(function(area) {

        const areaThemes =
    getThemesByLearningArea(
        area
    );

        let hasRevisionLists = false;

        areaThemes.forEach(function(theme) {

            const themeLists =
    getListsByThemeId(
        theme.themeId
    );

            themeLists.forEach(function(list) {

                const learnerData =
    getCurrentLearnerProgress();

                const progress =
                    learnerData.lists[
                        list.listId
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


function loadRevisionCard(contentId) {

    const currentItems =
    getItemsByListId(
        currentList
    );

    const matchedItem =
        currentItems.find(function(item) {

            return (
                item.contentId
                === contentId
            );

        });

     const learnerData =
    getCurrentLearnerProgress();

const currentListProgress =
    learnerData.lists[currentList];

const revisionQuestion =
    currentListProgress.revisionQuestions
        .find(function(question) {

            return (
                Number(question.contentId)
                ===
                Number(contentId)
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
            === Number(
                contentId
            )
        );

    });

    currentRevisionQuestion =
        revisionQuestion;

        isMasteredRevision = false;

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

    <p class="card-counter">

        Revision
        ${revisionItemIndex + 1}
        of
        ${revisionItems.length}

    </p>

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

    <hr class="revision-divider">

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

     updateRevisionButtons();   

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

         const learnerData =
    getCurrentLearnerProgress();

const currentListProgress =
    learnerData.lists[currentList];

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

        const learnerData =
    getCurrentLearnerProgress();

const currentListProgress =
    learnerData.lists[currentList];

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

    const learnerData =
    getCurrentLearnerProgress();

const currentListProgress =
    learnerData.lists[currentList];

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


/*======================================
        Mastered
==========================================*/

function openMasteredReviewDashboard() {

    masteredMode = true;

    currentMode = "mastered-review";

    showPage("learn-page");

    document.querySelector(
    "#learn-page h2"
).innerText =
    "Mastered Review";

    const learningAreasContainer =
        document.getElementById(
            "learning-areas-container"
        );

learningAreasContainer.innerHTML = "";

    const selectedCourse =
        courses.find(function(course) {

            return (
                course.courseId
                === currentCourse
            );

        });

    const courseLearningAreas = [];

    selectedCourse.assignedLists.forEach(
    function(listId) {

        const list =
            lists.find(
                l =>
                l.listId === listId
            );

        if (!list) {

            return;

        }

        const theme =
            themes.find(
                t =>
                t.themeId ===
                list.themeId
            );

        if (!theme) {

            return;

        }

        const area =
            learningAreas.find(
                a =>
                a.areaId ===
                theme.learningAreaId
            );

        if (
            area &&
            !courseLearningAreas.includes(
                area.title
            )
        ) {

            courseLearningAreas.push(
                area.title
            );

        }

    });

    console.log(
    courseLearningAreas
);

    courseLearningAreas.forEach(function(area) {

    const areaThemes =
    getThemesByLearningArea(
        area
    );

    let hasMasteredLists = false;

    areaThemes.forEach(function(theme) {

        const themeLists =
    getListsByThemeId(
        theme.themeId
    );

        themeLists.forEach(function(list) {

    const learnerData =
        getCurrentLearnerProgress();

    const progress =
        learnerData.lists[
            list.listId
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

    learningAreasContainer.innerHTML += `
    
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

// REVIEW Board


function openMastered() {

    initializeListProgress(currentList);

    const learnerData =
    getCurrentLearnerProgress();

const currentListProgress =
    learnerData.lists[currentList];

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

    document.querySelector(
    "#revision-page h2"
).textContent =
    "Revision";

    const learnerData =
    getCurrentLearnerProgress();

const currentListProgress =
    learnerData.lists[currentList];

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
        
            <div class="item-card revision-dashboard-card">

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

        const matchedItem =
    getItemsByListId(
        currentList
    ).find(function(item) {

        return (
    item.contentId
    === Number(
        contentId
    )
);

    });

        revisionContainer.innerHTML += `
    
    <button
        class="assessment-set-card"
        onclick="
            loadRevisionCard(
                '${contentId}'
            )
        ">

        ${matchedItem.title}

    </button>

    

`;

    });

    if (window.innerWidth <= 1024) {

    closeSidebar();

}

}


function startRevisionAssessment() {

    currentQuestions = revisionQuestions;

    revisionQuestions = [];

    currentQuestionIndex = 0;

    showPage("assessment-page");

    showQuestion();

}


function openRevisionSet(setName) {

    initializeListProgress(currentList);

    const learnerData =
    getCurrentLearnerProgress();

     const currentListProgress =
        learnerData.lists[currentList];

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
    getItemsByListId(
        currentList
    ).filter(function(item) {

        return unresolvedContent
            .includes(item.contentId);

    });

    revisionItemIndex = 0;

    showPage("items-page");

    showRevisionCard();

}



function updateRevisionButtons() {

    const previousButton =
        document.querySelector(
            ".card-navigation button:first-child"
        );

    const nextButton =
        document.querySelector(
            ".card-navigation button:last-child"
        );

    // PREVIOUS

    if (revisionItemIndex === 0) {

        previousButton.style.visibility =
            "hidden";

    }

    else {

        previousButton.style.visibility =
            "visible";

    }

    // NEXT

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

    const learnerData =
    getCurrentLearnerProgress();

    const currentListProgress =
    learnerData.lists[currentList];

    const attemptHistory =
        currentListProgress.attemptHistory
            .filter(function(attempt) {

                return (
                    attempt.setName
                    === setName
                );

            });

            console.log(
    "Review Set:",
    setName
);

console.log(
    "Attempt History:",
    attemptHistory
);

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

   currentReviewIndex = 0;

showAssessmentReviewCard();

}

function showAssessmentReviewCard() {


    const questionContainer =
        document.getElementById(
            "question-container"
        );

        const learnerData =
    getCurrentLearnerProgress();

    const currentListProgress =
        learnerData.lists[currentList];

    const attemptHistory =
        currentListProgress.attemptHistory
            .filter(function(attempt) {

                return (
                    attempt.setName
                    === currentSet
                );

            });

    const attempt =
        attemptHistory[
            currentReviewIndex
        ];

    questionContainer.innerHTML = `

    <div class="item-card">

        <p class="card-counter">

            Question
            ${currentReviewIndex + 1}
            of
            ${attemptHistory.length}

        </p>

        <h3>

            ${attempt.question}

        </h3>

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

    <div class="card-navigation">

        <button
    id="review-previous-btn"
    class="nav-btn"
    onclick="previousAssessmentReview()">

            ← Previous

        </button>

        <button
            class="nav-btn"
            onclick="
                openAssessmentReviewSets(
                    currentList
                )
            ">

            Back

        </button>

        <button
    id="review-next-btn"
    class="nav-btn"
    onclick="nextAssessmentReview()">

            Next →

        </button>

    </div>

`;

updateAssessmentReviewButtons();

}

function nextAssessmentReview() {

     const learnerData =
    getCurrentLearnerProgress();

const currentListProgress =
    learnerData.lists[currentList];

    const attemptHistory =
        currentListProgress.attemptHistory
            .filter(function(attempt) {

                return (
                    attempt.setName
                    === currentSet
                );

            });

    if (
        currentReviewIndex
        < attemptHistory.length - 1
    ) {

        currentReviewIndex++;

        showAssessmentReviewCard();

    }

}

function previousAssessmentReview() {

    if (
        currentReviewIndex > 0
    ) {

        currentReviewIndex--;

        showAssessmentReviewCard();

    }

}


function updateAssessmentReviewButtons() {

    const previousButton =
        document.getElementById(
            "review-previous-btn"
        );

    const nextButton =
        document.getElementById(
            "review-next-btn"
        );

     const learnerData =
    getCurrentLearnerProgress();

const currentListProgress =
    learnerData.lists[currentList];

    const attemptHistory =
        currentListProgress.attemptHistory
            .filter(function(attempt) {

                return (
                    attempt.setName
                    === currentSet
                );

            });

    if (currentReviewIndex === 0) {

        previousButton.style.visibility =
            "hidden";

    }

    else {

        previousButton.style.visibility =
            "visible";

    }

    if (
        currentReviewIndex
        === attemptHistory.length - 1
    ) {

        nextButton.style.visibility =
            "hidden";

    }

    else {

        nextButton.style.visibility =
            "visible";

    }

}

function openAssessmentReviewSets(
    listId
) {

    currentList = listId;

    const learnerData =
    getCurrentLearnerProgress();

    showPage(
        "assessment-sets-page"
    );

    const setsContainer =
        document.getElementById(
            "assessment-sets-container"
        );

    setsContainer.innerHTML = "";

    const completedSets =
    learnerData.lists[
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
    listId
) {

    currentList = listId;

    initializeListProgress(
        currentList
    );

    const learnerData =
    getCurrentLearnerProgress();

    showPage(
        "assessment-sets-page"
    );

    const setsContainer =
        document.getElementById(
            "assessment-sets-container"
        );

    setsContainer.innerHTML = "";

    const list =
        getLists().find(
            function(list) {

                return (
                    list.listId
                    === currentList
                );

            }
        );

    const masteredSets =
    getMasteredSetsByListId(
        currentList
    );

if (
    masteredSets.length === 0
) {

    return;

}

 const progress =
    learnerData.lists[
        currentList
    ];

const completedMasteredSets =
    progress.completedMasteredSets
    || [];

const activeDayIndex =
    masteredSets.findIndex(function(setName) {

        const unresolvedQuestions =
            progress.masteredRevisionQuestions
                .filter(function(question) {

                    return (
                        question.setName
                        === setName
                    );

                });

        const isFullyCompleted =

            completedMasteredSets
                .includes(setName)

            &&

            unresolvedQuestions
                .length === 0;

        return !isFullyCompleted;

    });

masteredSets.forEach(function(
    setName,
    index
) {

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

        completedMasteredSets
            .includes(setName)

        &&

        unresolvedQuestions
            .length === 0;

    let buttonLabel =
        setName;

    let disabled =
        "";

    if (
        isFullyCompleted
    ) {

        buttonLabel =
            "✅ " + setName;

    }

    else if (
        index === activeDayIndex
    ) {

        buttonLabel =
            "▶ " + setName;

    }

    else {

        buttonLabel =
            "🔒 " + setName;

        disabled =
            "disabled";

    }

    setsContainer.innerHTML += `
    
        <button
            class="theme-card"
            ${disabled}
            onclick="
                openMasteredQuestionSet(
                    '${setName}'
                )
            ">

            ${buttonLabel}

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

    const list =
    getLists().find(
        function(list) {

            return (
                list.listId
                === currentList
            );

        }
    );

    currentQuestions =
        getQuestionsBySet(
            currentList,
            currentSet
        );

    currentQuestionIndex = 0;

    masteredAssessmentMode = true;

    showQuestion();

}

function openMasteredRevision() {

    initializeListProgress(
        currentList
    );

    document.querySelector(
    "#revision-page h2"
).textContent =
    "Mastered Revision";

    const learnerData =
    getCurrentLearnerProgress();

const currentListProgress =
    learnerData.lists[
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

            const matchedItem =
    getItemsByListId(
        currentList
    ).find(function(item) {

        return (
    item.contentId
    === Number(
        contentId
    )
);

    });


            revisionContainer.innerHTML += `
    
    <div class="item-card revision-dashboard-card">

        <h2>

            ${matchedItem.title}

        </h2>
        

        <button class="nav-btn"
            onclick="
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

        const learnerData =
    getCurrentLearnerProgress();

const currentListProgress =
    learnerData.lists[
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

        const learnerData =
    getCurrentLearnerProgress();

const currentListProgress =
    learnerData.lists[
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

function restoreLearningNavigation() {

    document.querySelector(
        ".card-navigation"
    ).innerHTML = `
    
        <button class="nav-btn"
            onclick="previousItem()">

            ← Previous

        </button>

        <button
            id="complete-learning-btn"
            onclick="completeLearning()">

            Complete Learning

        </button>

        <button class="nav-btn"
            onclick="nextItem()">

            Next →

        </button>

    `;

}

// open sections

function openSection(sectionName) {

    currentSection = sectionName;

    showPage("section-page");

    document.getElementById("section-title")
        .innerText = sectionName;

}

function toggleSection(
    sectionOrder
) {

    const content =
        document.getElementById(
            `section-${sectionOrder}`
        );

    const arrow =
        document.getElementById(
            `arrow-${sectionOrder}`
        );

    if (
        content.style.display
        === "none"
    ) {

        content.style.display =
            "block";

        arrow.innerText =
            "-";

    }

    else {

        content.style.display =
            "none";

        arrow.innerText =
            "+";

    }

}


function goHome() {

    pageHistory = [
        "course-page"
    ];

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

    const pages =
        document.querySelectorAll(
            "#course-page .app-page"
        );

    pages.forEach(function(page) {

        page.classList.add(
            "hidden"
        );

    });

    document.getElementById(
        "course-home-page"
    ).classList.remove(
        "hidden"
    );

}

function goToCourses() {

    pageHistory = [];

    showPage(
        "cover-page"
    );

}

function showMasteredReviewCard() {


    const itemsContainer =
        document.getElementById(
            "items-container"
        );

    itemsContainer.innerHTML = "";

    const item =
        currentItems[currentItemIndex];

    // VOCABULARY REVIEW

    if (
        item.contentType === "word"
    ) {

        itemsContainer.innerHTML = `
        
            <div class="item-card">

            <p class="card-counter">

    Mastered Review
    ${currentItemIndex + 1}
    of
    ${currentItems.length}

</p>

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

    document.querySelector(
    ".card-navigation"
).innerHTML = `

    <button
        class="nav-btn"
        onclick="previousItem()">

        ← Previous

    </button>

    <button
        class="nav-btn"
        onclick="nextItem()">

        Next →

    </button>

`;

    updateNavigationButtons();

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
                course.courseId
                === currentCourse
            );

        });

        const learnerData =
    getCurrentLearnerProgress();

        const courseLearningAreas = [];

selectedCourse.assignedLists.forEach(
    function(listId) {

        const list =
            lists.find(
                l =>
                l.listId === listId
            );

        if (!list) {

            return;

        }

        const theme =
            themes.find(
                t =>
                t.themeId ===
                list.themeId
            );

        if (!theme) {

            return;

        }

        const area =
            learningAreas.find(
                a =>
                a.areaId ===
                theme.learningAreaId
            );

        if (
            area &&
            !courseLearningAreas.includes(
                area.title
            )
        ) {

            courseLearningAreas.push(
                area.title
            );

        }

    });


    courseLearningAreas.forEach(function(area) {

    const areaThemes =
    getThemesByLearningArea(
        area
    );

    let hasMasteredLists = false;

    areaThemes.forEach(function(theme) {

       const themeLists =
    getListsByThemeId(
        theme.themeId
    );

        themeLists.forEach(function(list) {


const progress =
    learnerData.lists[
        list.listId
    ];

    if (!progress) {

    return;

}

            const daySets =
    getMasteredSetsByListId(
        list.listId
    );

    

if (!daySets) {

    return;

}

const hasPendingMasteredSet =

   daySets.some(function(setName) {

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

function checkMasteredAnswer(
    selectedOption
) {

    const currentQuestion =
        currentQuestions[currentQuestionIndex];

    initializeListProgress(
        currentList
    );

    const learnerData =
    getCurrentLearnerProgress();

     const currentListProgress =
    learnerData.lists[
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

        const list =
    getLists().find(
        function(list) {

            return (
                list.listId
                === currentList
            );

        }
    );

        const allDaySets =
    getMasteredSetsByListId(
        currentList
    );

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
                course.courseId
                === currentCourse
            );

        });

        const learnerData =
    getCurrentLearnerProgress();

  const courseLearningAreas = [];

        selectedCourse.assignedLists.forEach(
    function(listId) {

        const list =
            lists.find(
                l =>
                l.listId === listId
            );

        if (!list) {

            return;

        }

        const theme =
            themes.find(
                t =>
                t.themeId ===
                list.themeId
            );

        if (!theme) {

            return;

        }

        const area =
            learningAreas.find(
                a =>
                a.areaId ===
                theme.learningAreaId
            );

        if (
            area &&
            !courseLearningAreas.includes(
                area.title
            )
        ) {

            courseLearningAreas.push(
                area.title
            );

        }

    });

    courseLearningAreas.forEach(function(area)  {

        const areaThemes =
    getThemesByLearningArea(
        area
    );

        let hasRevisionLists = false;

        areaThemes.forEach(function(theme) {

            const themeLists =
    getListsByThemeId(
        theme.themeId
    );

            themeLists.forEach(function(list) {

                const progress =
    learnerData.lists[
        list.listId
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

function loadMasteredRevisionCard(
    contentId
) {

     const currentItems =
    getItemsByListId(
        currentList
    );

    const learnerData =
    getCurrentLearnerProgress();

const currentListProgress =
    learnerData.lists[
        currentList
    ];

    const revisionQuestion =
    currentListProgress
        .masteredRevisionQuestions
        .find(function(question) {

            return (
                String(
                    question.contentId
                )
                ===
                String(
                    contentId
                )
            );

        });

            console.log(
    "contentId:",
    contentId,
    typeof contentId
);

console.log(
    currentListProgress
        .masteredRevisionQuestions[0]
        .contentId,
    typeof currentListProgress
        .masteredRevisionQuestions[0]
        .contentId
);

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
            String(
                item.contentId
            )
            ===
            String(
                contentId
            )
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
    
        <button 
        class="nav-btn"
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

    const learnerData =
    getCurrentLearnerProgress();

currentQuestions =
    learnerData.lists[currentList]
        .masteredRevisionQuestions;

    currentQuestionIndex = 0;

    currentMode =
        "mastered-assessment";

    showPage(
        "assessment-page"
    );

    showQuestion();

}


//Navigation

function updateNavigationButtons() {

    if (
    currentMode === "search"
) {

    document.querySelector(
        ".card-navigation"
    ).innerHTML = `

        <button
            class="nav-btn"
            onclick="openSearch()">

            ← Back to Search

        </button>

    `;

    return;

}

    const previousButton =
        document.querySelector(
            ".card-navigation button:first-child"
        );

    const completeButton =
    document.getElementById(
        "complete-learning-btn"
    );

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

    if (completeButton) {

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

}

loadProgress();
renderCourses();
loadLearners();
