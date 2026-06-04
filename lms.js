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

let currentReviewIndex = 0;

let isMasteredRevision = false;

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

    // SAVE HISTORY

if (
    pageHistory[
        pageHistory.length - 1
    ] !== pageId
) {

    pageHistory.push(
        pageId
    );

}

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

    if (
        pageHistory.length <= 1
    ) {

        goHome();

        return;

    }

    pageHistory.pop();

    const previousPage =
        pageHistory[
            pageHistory.length - 1
        ];

    showPage(
        previousPage
    );

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

function openAdminPage() {

    showPage(
        "admin-page"
    );

    const container =
        document.getElementById(
            "admin-container"
        );

    const selectedCourse =
        courses.find(function(course) {

            return (
                course.title
                === currentCourse
            );

        });

    let themeCount = 0;

    let listCount = 0;

    let itemCount = 0;

    let setCount = 0;

    let questionCount = 0;

    selectedCourse.learningAreas
        .forEach(function(area) {

             const areaThemes =
    getThemesByLearningArea(
        area
    );

            themeCount +=
                areaThemes.length;

            areaThemes.forEach(function(theme) {

                const themeLists =
    getListsByThemeId(
        theme.themeId
    );

                listCount +=
                    themeLists.length;

                areaThemes.forEach(function(theme) {

    const themeLists =
        getListsByThemeId(
            theme.themeId
        );

    listCount +=
        themeLists.length;

    themeLists.forEach(function(list) {

        itemCount +=
            getItemsByListId(
                list.listId
            ).length;

        const assessmentSets =
            getAssessmentSetsByListId(
                list.listId
            );

        setCount +=
            assessmentSets.length;

        questionCount +=
            getQuestionsByListId(
                list.listId
            ).filter(function(question) {

                return question.setName.startsWith(
                    "Set"
                );

            }).length;

    });

});

            });

        });

    container.innerHTML = `
    
        <div class="item-card">

            <h3>

                ${selectedCourse.title}

            </h3>

            <p>

                Learning Areas:
                ${selectedCourse.learningAreas.length}

            </p>

            <p>

                Themes:
                ${themeCount}

            </p>

            <p>

                Lists:
                ${listCount}

            </p>

            <p>

                Items:
                ${itemCount}

            </p>

            <p>

                Assessment Sets:
                ${setCount}

            </p>

            <p>

                Assessment Questions:
                ${questionCount}

            </p>

        </div>

    `;

}

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
                course.title
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

function openCourse(courseName) {

    currentCourse = courseName;

    const selectedCourse =
        courses.find(function(course) {

            return (
                course.title
                === courseName
            );

        });

    document.querySelector(
        ".course-title"
    ).textContent =
        selectedCourse.title;

    document.getElementById(
        "welcome-title"
    ).textContent =
        selectedCourse.welcomeTitle;

    document.getElementById(
        "welcome-message"
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

    courses.forEach(function(course) {

        courseContainer.innerHTML += `
        
            <button
                class="course-card"
                onclick="
                    openCourse(
                        '${course.title}'
                    )
                ">

                ${course.title}

            </button>

        `;

    });

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

            const progress =
    learnerProgress.lists[
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
    learnerProgress.lists[
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

const progress =
    learnerProgress.lists[
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
    learnerProgress.lists[
        list.listId
    ];

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
                course.title
                === currentCourse
            );

        });

    const learningAreas =
        selectedCourse.learningAreas;

    learningAreas.forEach(function(area) {

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
    learnerProgress.lists[
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

//Open Learn

function openLearn() {

    currentMode = "learn";

    masteredMode = false;

    showPage("learn-page");

    const learningAreasContainer =
        document.getElementById(
            "learning-areas-container"
        );

    learningAreasContainer.innerHTML = "";

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

        const progress =
    learnerProgress.lists[
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
    learnerProgress.lists[
        list.listId
    ];

if (
    progress
    &&
    progress.learned
) {

    displayTitle =
        "✅ " + list.listTitle;

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


function openAssessment(listId) {

    currentList = listId;

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

    const setNames =
    getAssessmentSetsByListId(
        currentList
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

    document.querySelector(
    "#revision-page h2"
).textContent =
    "Revision";

    const currentListProgress =
        learnerProgress.lists[currentList];

        console.log(
    "Current List:",
    currentList
);

console.log(
    "Revision Questions:",
    currentListProgress.revisionQuestions
);

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
            === contentId
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

   currentReviewIndex = 0;

showAssessmentReviewCard();

}

function showAssessmentReviewCard() {

    const questionContainer =
        document.getElementById(
            "question-container"
        );

    const currentListProgress =
        learnerProgress.lists[currentList];

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

    const currentListProgress =
        learnerProgress.lists[currentList];

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

    const currentListProgress =
        learnerProgress.lists[currentList];

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

function openAssessmentReviewSets(
    listId
) {

    currentList = listId;

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
    listId
) {

    currentList = listId;

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
    learnerProgress.lists[
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
                course.title
                === currentCourse
            );

        });

    const learningAreas =
        selectedCourse.learningAreas;

    learningAreas.forEach(function(area) {

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
    learnerProgress.lists[
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


function openMasteredRevision() {

    initializeListProgress(
        currentList
    );

    document.querySelector(
    "#revision-page h2"
).textContent =
    "Mastered Revision";

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

            const matchedItem =
    getItemsByListId(
        currentList
    ).find(function(item) {

        return (
            item.contentId
            === contentId
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



function loadMasteredRevisionCard(
    contentId
) {

     const currentItems =
    getItemsByListId(
        currentList
    );

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

    const totalLists =
    getLists().length;

    let learnedLists = 0;

    let masteredLists = 0;

    Object.keys(
        learnerProgress.lists
    ).forEach(function(listName) {



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




function getThemes() {

    const themes = [];

    learningItems.forEach(function(item) {

        const exists = themes.find(
            function(theme) {

                return (
                    theme.themeId
                    === item.themeId
                );

            }
        );

        if (!exists) {

            themes.push({

                themeId:
                    item.themeId,

                themeTitle:
                    item.themeTitle,

                learningArea:
                    item.learningArea

            });

        }

    });

    return themes;

}


function getLists() {

    const lists = [];

    learningItems.forEach(function(item) {

        const exists = lists.find(
            function(list) {

                return (
                    list.listId
                    === item.listId
                );

            }
        );

        if (!exists) {

            lists.push({

                listId:
                    item.listId,

                listTitle:
                    item.listTitle,

                themeId:
                    item.themeId,

                themeTitle:
                    item.themeTitle

            });

        }

    });

    return lists;

}

function getItemsByListId(
    listId
) {

    return learningItems.filter(
        function(item) {

            return (
                item.listId
                === listId
            );

        }
    );

}

function getThemesByLearningArea(
    learningArea
) {

    return getThemes().filter(
        function(theme) {

            return (
                theme.learningArea
                === learningArea
            );

        }
    );

}


function getListsByThemeId(
    themeId
) {

    return getLists().filter(
        function(list) {

            return (
                list.themeId
                === themeId
            );

        }
    );

}

// GET ALL  QUESTIONS  FOR  A LIST


function getQuestionsByListId(
    listId
) {

    return assessmentQuestions.filter(
        function(question) {

            return (
                question.listId
                === listId
            );

        }
    );

}


function getQuestionsBySet(
    listId,
    setName
) {

    return assessmentQuestions.filter(
        function(question) {

            return (

                question.listId
                === listId

                &&

                question.setName
                === setName

            );

        }
    );

}



// GET ALL SETS FOR A LIST 

function getSetsByListId(
    listId
) {

    return [
        ...new Set(

            getQuestionsByListId(
                listId
            ).map(function(question) {

                return question.setName;

            })

        )
    ];

}


function getAssessmentSetsByListId(
    listId
) {

    return getSetsByListId(
        listId
    ).filter(function(setName) {

        return setName.startsWith(
            "Set"
        );

    });

}



// GET ONE SET

function getQuestionsBySet(
    listId,
    setName
) {

    return assessmentQuestions.filter(
        function(question) {

            return (

                question.listId
                === listId

                &&

                question.setName
                === setName

            );

        }
    );

}


// GET ONLY DAY SETS

function getMasteredSetsByListId(
    listId
) {

    return [
        ...new Set(

            getQuestionsByListId(
                listId
            )

            .filter(function(question) {

                return question.setName.startsWith(
                    "Day"
                );

            })

            .map(function(question) {

                return question.setName;

            })

        )
    ];

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

function goToCourses() {

    pageHistory = [];

    showPage(
        "cover-page"
    );

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


loadProgress();

showPage("cover-page"); 

renderCourses();
