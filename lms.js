let currentSection = "";

let currentSections = [];

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

let currentEditingSection =
    null;

window.uploadRows = [];



function loadCoursesFromStorage() {

    const savedCourses =
        localStorage.getItem(
            "courses"
        );

    if (savedCourses) {

        window.courses =
            JSON.parse(
                savedCourses
            );

    }

}


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
        ".app-page"
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

    const statsContainer =
    document.getElementById(
        "admin-stats-container"
    );

const courseContainer =
    document.getElementById(
        "course-management-container"
    );

    const selectedCourse =
        courses.find(function(course) {

            return (
                course.courseId
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

    statsContainer.innerHTML = `

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

function renderExistingCourses() {

    const container =
        document.getElementById(
            "existing-courses-container"
        );

    let html = "";

    courses.forEach(function(course) {

        html += `

            <div class="item-card">

                <strong>

                    ${course.courseId}

                </strong>

                -

                ${course.title}

            </div>

        `;

    });

    container.innerHTML =
        html;

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

    courses.forEach(function(course) {

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
                course.courseId
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
                course.courseId
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
                course.courseId
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
                course.courseId
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


function showLessonCard(item) {

    const itemsContainer =
        document.getElementById(
            "items-container"
        );

    let sectionsHtml = "";

    item.content.sections.forEach(
        function(section) {

            let sectionClass =
    "lesson-section";

    if (
    section.sectionType
    === "objectives"
) {

    sectionClass =
        "lesson-objectives";

}

else if (
    section.sectionType
    === "outcome"
)
{

    sectionClass =
        "lesson-outcome";

}

else if (
    section.sectionType
    === "example"
) {

    sectionClass =
        "lesson-example";

}
        let isOpen =

    section.sectionOrder <= 2;

let symbol =

    isOpen
    ? "-"
    : "+";

let displayStyle =

    isOpen
    ? "block"
    : "none";

    let formattedContent =

    section.sectionContent;

formattedContent =

    formattedContent.replaceAll(

        "[EXAMPLE]",

        `<div class="inline-example">`

    );

formattedContent =

    formattedContent.replaceAll(

        "[/EXAMPLE]",

        `</div>`

    );

formattedContent =

    formattedContent.replaceAll(

        "[PARAGRAPH]",

        `<p class="lesson-paragraph">`

    );

formattedContent =

    formattedContent.replaceAll(

        "[/PARAGRAPH]",

        `</p>`

    );

formattedContent =

    formattedContent.replaceAll(

        "[BOLD]",

        `<strong>`

    );

formattedContent =

    formattedContent.replaceAll(

        "[/BOLD]",

        `</strong>`

    );


    formattedContent =

    formattedContent.replaceAll(

        "[ITALIC]",

        "<em>"

    );

formattedContent =

    formattedContent.replaceAll(

        "[/ITALIC]",

        "</em>"

    );

formattedContent =

    formattedContent.replaceAll(

        "[UNDERLINE]",

        "<u>"

    );

formattedContent =

    formattedContent.replaceAll(

        "[/UNDERLINE]",

        "</u>"

    );

    if (

    formattedContent.includes(
        "[LIST]"
    )

) {

    const listContent =

        formattedContent
            .split("[LIST]")[1]
            .split("[/LIST]")[0];

    const items =

        listContent
            .split("[*]")
            .filter(
                item =>
                    item.trim()
            );

    let listHtml =
    "<ul>";

items.forEach(
    function(item) {

        listHtml +=

`<li>${item.trim()}</li>`;

    }
);

listHtml +=
    "</ul>";

    formattedContent =

        formattedContent.replace(

            `[LIST]${listContent}[/LIST]`,

            listHtml

        );

}

if (

    formattedContent.includes(
        "[NUMBERED]"
    )

) {

    const listContent =

        formattedContent
            .split("[NUMBERED]")[1]
            .split("[/NUMBERED]")[0];

    const items =

        listContent
            .split("[*]")
            .filter(
                item =>
                    item.trim()
            );

   let listHtml =
    "<ol>";

items.forEach(
    function(item) {

        listHtml +=

`<li>${item.trim()}</li>`;

    }
);

listHtml +=
    "</ol>";

    formattedContent =

        formattedContent.replace(

            `[NUMBERED]${listContent}[/NUMBERED]`,

            listHtml

        );

}

  /*  if (

    section.sectionType ===
        "objectives"

    ||

    section.sectionType ===
        "outcome"

)  {

   formattedContent =

        formattedContent.replaceAll(
            "\n",
            "<br>"
        );

}*/

           sectionsHtml += `

    <div class="${sectionClass}">

        <div
    class="section-header"
    onclick="
        toggleSection(
            ${section.sectionOrder}
        )
    ">

           <span
    id="arrow-${section.sectionOrder}">

    ${symbol}

</span>

${section.sectionTitle}

        </div>

<div
    class="lesson-content"
    id="section-${section.sectionOrder}"
    style="
        display:
        ${displayStyle};
    ">
    ${formattedContent}

        </div>

    </div>

`;

        }
    );

    itemsContainer.innerHTML = `

        <div class="item-card">

           <p class="lesson-counter">

    Lesson ${currentItemIndex + 1}
    of
    ${currentItems.length}

</p>

            <h2>

                ${item.title}

            </h2>

            ${sectionsHtml}

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
                course.courseId
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

function previewContent() {

    const fileInput =
        document.getElementById(
            "excel-file"
        );

    const file =
        fileInput.files[0];

    if (!file) {

        alert(
            "Please select an Excel file."
        );

        return;

    }

    const reader =
        new FileReader();

    reader.onload =
        function(event) {

            const data =
                new Uint8Array(
                    event.target.result
                );

            const workbook =
                XLSX.read(
                    data,
                    { type: "array" }
                );

            const sheetName =
                workbook.SheetNames[0];

            const worksheet =
                workbook.Sheets[sheetName];

            const rows =
                XLSX.utils.sheet_to_json(
                    worksheet
                );

            console.log(rows);

        };

    reader.readAsArrayBuffer(
        file
    );

}

function showCreateCourseForm() {

    const container =
        document.getElementById(
            "course-form-container"
        );

    container.innerHTML = `

        <div class="item-card">

            <h3>

                Create Course

            </h3>

<input
    type="text"
    id="course-id"
    placeholder="Course ID">

            <br><br>

<input
    type="text"
    id="course-title"
    placeholder="Course Title">

            <br><br>

            <input
    type="text"
    id="welcome-title"
    placeholder="Welcome Title">

<br><br>

<textarea
    id="welcome-message"
    class="admin-input"
    rows="5"
    placeholder="Welcome Message">

</textarea>

<br><br>

<button
    class="theme-card"
    onclick="saveCourse()">

    Save Course

</button>

<br><br>

<div id="course-preview">

</div>

</div>

`;

}


function saveCourse() {

    const course = {

        courseId:
            document.getElementById(
                "course-id"
            ).value,

        title:
            document.getElementById(
                "course-title"
            ).value,

        welcomeTitle:
            document.getElementById(
                "welcome-title"
            ).value,

        welcomeMessage:
            document.getElementById(
                "welcome-message"
            ).value,

        learningAreas: []

    };

    const existingCourse =
    courses.find(
        c =>
        c.courseId === course.courseId
    );

    if (existingCourse) {

    existingCourse.title =
        course.title;

    existingCourse.welcomeTitle =
        course.welcomeTitle;

    existingCourse.welcomeMessage =
        course.welcomeMessage;

}

else {

    courses.push(course);

}
    localStorage.setItem(
    "courses",
    JSON.stringify(courses)
);





    document.getElementById(
        "course-preview"
    ).innerHTML = `

<pre>



${JSON.stringify(
    course,
    null,
    4
)}

</pre>

`;

}

function toggleAdminMenu() {

    document
        .getElementById(
            "admin-submenu"
        )
        .classList
        .toggle(
            "hidden"
        );

}

function openCourseManagementPage() {

    showPage(
        "course-management-page"
    );

    loadCourseManagement();

}

function loadCourseManagement() {

    

    const container =
        document.getElementById(
            "course-management-content"
        );

    let html = `

        <div class="item-card">

            <h3>

                Course Management

            </h3>

            <button
    class="theme-card"
    onclick="showCreateCourseForm()">

    Create Course

</button>

        <div
    id="course-form-container">

</div>

<hr>

<h4>

    Existing Courses

</h4>
    `;

    container.innerHTML = html;

renderExistingCourses();
}

function toggleCoursesMenu() {

    document
        .getElementById(
            "courses-submenu"
        )
        .classList
        .toggle(
            "hidden"
        );

}

function toggleLearningAreasMenu() {

    document
        .getElementById(
            "learning-areas-submenu"
        )
        .classList
        .toggle(
            "hidden"
        );

}

function toggleThemesMenu() {

    document
        .getElementById(
            "themes-submenu"
        )
        .classList
        .toggle(
            "hidden"
        );

}


function toggleListsMenu() {

    document
        .getElementById(
            "lists-submenu"
        )
        .classList
        .toggle(
            "hidden"
        );

}


function toggleContentMenu() {

    document
        .getElementById(
            "content-submenu"
        )
        .classList
        .toggle(
            "hidden"
        );

}

function toggleAdminAssessmentMenu() {

    document
        .getElementById(
            "admin-assessment-submenu"
        )
        .classList
        .toggle(
            "hidden"
        );

}

function openCreateCoursePage() {

    showPage(
        "create-course-page"
    );

    showCreateCourseForm();

}

function openManageCoursesPage() {

    showPage(
        "manage-courses-page"
    );

    loadManageCourses();

}

function openLearningAreasPage() {

    showPage(
        "learning-areas-page"
    );

}

function openCreateAreaPage() {

    showPage(
        "create-area-page"
    );

    showCreateAreaForm();

}

function openManageAreasPage() {

    showPage(
        "manage-areas-page"
    );

    showManageAreas();

}

function openCreateThemePage() {

    showPage(
        "create-theme-page"
    );

    showCreateThemeForm();

}

function openManageThemesPage() {

    showPage(
        "manage-themes-page"
    );

    showManageThemes();

}

function openCreateListPage() {

    showPage(
        "create-list-page"
    );

    showCreateListForm();

}

function openManageListsPage() {

    showPage(
        "manage-lists-page"
    );

    showManageLists();

}


function openUploadWordsPage() {

    showPage(
        "upload-words-page"
    );

}

function openUploadLessonsPage() {

    showPage(
        "upload-lessons-page"
    );

}

function openAppendContentPage() {

    showPage(
        "append-content-page"
    );

    document.getElementById(
        "append-content-content"
    ).innerHTML = `

<h3>

    Content Type

</h3>

<select
    id="content-type"
    class="admin-input"
    onchange="showContentUploadForm()">

    <option value="">

        Select Content Type

    </option>

    <option value="word">

        Vocabulary

    </option>

    <option value="lesson">

        Lesson

    </option>

</select>

<div id="append-content-container">

</div>

`;

}

function showContentUploadForm() {

    const contentType =
        document.getElementById(
            "content-type"
        ).value;

    const container =
        document.getElementById(
            "append-content-container"
        );

    if (
        contentType === "word"
    ) {

        container.innerHTML = `

<h3>

    Vocabulary Upload

</h3>

<select
    id="upload-learning-area"
    class="admin-input"
    onchange="
        loadUploadThemes()
    ">

    <option value="">

        Select Learning Area

    </option>

    ${
        learningAreas
        .filter(
            area =>
            area.isActive !== false
        )
        .map(
            area => `
                <option
                    value="${area.areaId}">
                    ${area.title}
                </option>
            `
        )
        .join("")
    }

</select>

<select
    id="upload-theme"
    class="admin-input"
     onchange="
        loadUploadLists()
    ">

    <option value="">

        Select Theme

    </option>

</select>

<select
    id="upload-list"
    class="admin-input">

    <option value="">

        Select List

    </option>

</select>

<input
    type="file"
    id="vocabulary-file"
    class="admin-input"
    accept=".xlsx,.xls"
    onchange="
        previewVocabularyFile(
            event
        )
    ">

<div
    id="vocabulary-preview">

</div>

`;

    }

    else if (
        contentType === "lesson"
    ) {

        container.innerHTML = `

<h3>

    Lesson Upload

</h3>

<p>

    Lesson template
    will appear here.

</p>

`;

    }

    else {

        container.innerHTML = "";

    }

}

function loadUploadThemes() {

    const areaId =
        document.getElementById(
            "upload-learning-area"
        ).value;

    const themeDropdown =
        document.getElementById(
            "upload-theme"
        );

    themeDropdown.innerHTML = `

<option value="">

    Select Theme

</option>

`;

    themes
        .filter(
            theme =>
                theme.learningAreaId
                === areaId
                &&
                theme.isActive !== false
        )
        .forEach(
            function(theme) {

                themeDropdown.innerHTML += `

<option
    value="${theme.themeId}">

    ${theme.title}

</option>

`;

            }
        );

}

function previewVocabularyFile(
    event
) {

    const file =
        event.target.files[0];

    const reader =
        new FileReader();

    reader.onload =
        function(e) {

            const data =
                new Uint8Array(
                    e.target.result
                );

            const workbook =
                XLSX.read(
                    data,
                    {
                        type: "array"
                    }
                );

            const sheetName =
                workbook
                .SheetNames[0];

            const worksheet =
                workbook.Sheets[
                    sheetName
                ];

            const rows =
                XLSX.utils
                .sheet_to_json(
                    worksheet,
                    {
                        defval: ""
                    }
                );

                window.uploadRows =
    rows;

                const invalidRows = [];

rows.forEach(
    function(
        row,
        index
    ) {

        if (

            !row.Word ||
            !row.Definition

        ) {

            invalidRows.push(
                index + 2
            );

        }

    }
);



            let html = `

<h3>

    Preview

</h3>

<div
    style="
        overflow-x:auto;
    ">

<table
    class="admin-table">

`;


html += "<tr>";

Object.keys(
    rows[0]
).forEach(
    function(key) {

        html += `
            <th>
                ${key}
            </th>
        `;

    }
);


html += "</tr>";

rows.forEach(
    function(row) {

        html += "<tr>";

        Object.values(
            row
        ).forEach(
            function(value) {

                html += `
                    <td>
                        ${value}
                    </td>
                `;

            }
        );

        html += "</tr>";

    }
);

html += `
</table>
</div>
`;

html += `

<div
    class="validation-summary">

    <strong>

        Rows Found:

    </strong>

    ${rows.length}

    &nbsp; | &nbsp;

    <strong>

        Invalid Rows:

    </strong>

    ${invalidRows.length}

</div>

`;

html += `

<button
    class="admin-btn"
    onclick="
        appendVocabularyContent()
    ">

    Append Content

</button>

`;

document.getElementById(
    "vocabulary-preview"
).innerHTML = html;

        };

    reader.readAsArrayBuffer(
        file
    );

}

function loadUploadLists() {

    const themeId =
        document.getElementById(
            "upload-theme"
        ).value;

    const listDropdown =
        document.getElementById(
            "upload-list"
        );

    listDropdown.innerHTML = `

<option value="">

    Select List

</option>

`;

    lists
        .filter(
            list =>
                list.themeId
                === themeId
                &&
                list.isActive !== false
        )
        .forEach(
            function(list) {

                listDropdown.innerHTML += `

<option
    value="${list.listId}">

    ${list.title}

</option>

`;

            }
        );

}

function appendVocabularyContent() {

    const areaId =
        document.getElementById(
            "upload-learning-area"
        ).value;

    const themeId =
        document.getElementById(
            "upload-theme"
        ).value;

    const listId =
        document.getElementById(
            "upload-list"
        ).value;

    const area =
        learningAreas.find(
            a =>
            a.areaId === areaId
        );

    const theme =
        themes.find(
            t =>
            t.themeId === themeId
        );

    const list =
        lists.find(
            l =>
            l.listId === listId
        );

    uploadRows.forEach(
    function(row) {

    const item = {

        courseId: "",

        courseTitle: "",

        learningArea:
            area.title,

        themeId:
            theme.themeId,

        themeTitle:
            theme.title,

        listId:
            list.listId,

        listTitle:
            list.title,

        contentType:
            "word",

        contentId:
            getNextContentId(),

        title:
            row.Word,

        image:
            row.Image || "",


        content: {

            partOfSpeech:
                row.PartOfSpeech,

            pronunciation:
                row.Pronunciation,

            definition:
                row.Definition,

            synonyms:
                row.Synonyms,

            antonyms:
                row.Antonyms,

            examples: [

                row.Example1,

                row.Example2,

                row.Example3

            ]

        }

    };

learningItems.push(
    item
);

    }

);

localStorage.setItem(
    "learningItems",
    JSON.stringify(
        learningItems
    )
);

document.getElementById(
    "vocabulary-preview"
).insertAdjacentHTML(
    "beforeend",
    `

<p
    style="
        color:green;
        font-weight:bold;
    ">

    Vocabulary item appended.

</p>

`
);

console.log(
    learningItems
);

}

function openUploadQuestionsPage() {

    showPage(
        "upload-questions-page"
    );

}

function openManageSetsPage() {

    showPage(
        "manage-sets-page"
    );

}

function openReviewQuestionsPage() {

    showPage(
        "review-questions-page"
    );

}


function loadManageCourses() {

    const container =
        document.getElementById(
            "courses-list-container"
        );

    container.innerHTML = "";

    courses.forEach(function(course) {

        container.innerHTML += `

    <div class="item-card">

        <h3>

            ${course.title}

        </h3>

        <button
    class="theme-card"
    onclick="editCourse(
        '${course.courseId}'
    )">

    Edit

</button>

    </div>

`;

    });

}



function editCourse(courseId) {

    const course =
        courses.find(
            c =>
            c.courseId === courseId
        );

    showPage(
        "create-course-page"
    );

    showCreateCourseForm();

    document.getElementById(
        "course-id"
    ).value = course.courseId;

    document.getElementById(
        "course-title"
    ).value = course.title;

    document.getElementById(
        "welcome-title"
    ).value = course.welcomeTitle;

const messageBox =
    document.getElementById(
        "welcome-message"
    );

console.log(
    messageBox
);

messageBox.value =
    course.welcomeMessage;

}

function showCreateAreaForm() {

    document.getElementById(
        "create-area-content"
    ).innerHTML = `

<input
    id="area-id"
    class="admin-input"
    placeholder="Learning Area ID">

<input
    id="area-title"
    class="admin-input"
    placeholder="Learning Area Title">

<textarea
    id="area-description"
    class="admin-input"
    rows="4"
    placeholder="Description">

</textarea>

<button
    class="admin-btn"
    onclick="saveLearningArea()">

    Save Learning Area

</button>

<div id="area-preview">

</div>

`;

}


function saveLearningArea() {

    const learningArea = {

        areaId:
            document.getElementById(
                "area-id"
            ).value,

        title:
            document.getElementById(
                "area-title"
            ).value,

        description:
            document.getElementById(
                "area-description"
            ).value.trim(),
        
         isActive: true

    };

    const existingArea =
    learningAreas.find(
        a =>
        a.areaId === learningArea.areaId
    );

if (existingArea) {

    existingArea.title =
        learningArea.title;

    existingArea.description =
        learningArea.description;

} else {

    learningAreas.push(
        learningArea
    );

}

localStorage.setItem(
    "learningAreas",
    JSON.stringify(
        learningAreas
    )
);

    console.log(
        learningArea
    );

    document.getElementById(
        "area-preview"
    ).innerHTML = `

<pre>

${JSON.stringify(
    learningArea,
    null,
    4
)}

</pre>

`;

}


function loadLearningAreasFromStorage() {

    const savedLearningAreas =
        localStorage.getItem(
            "learningAreas"
        );

    if (savedLearningAreas) {

        window.learningAreas =
            JSON.parse(
                savedLearningAreas
            );

        learningAreas.forEach(
            function(area) {

                if (
                    area.isActive ===
                    undefined
                ) {

                    area.isActive =
                        true;

                }

            }
        );

    }

}

function showManageAreas() {

    const container =
        document.getElementById(
            "manage-areas-content"
        );

    container.innerHTML = "";

    learningAreas.forEach(
        function(area) {

            container.innerHTML += `

<div class="admin-card">

    <h3>
        ${area.title}
    </h3>

    <p>
        ${area.areaId}
    </p>

    <p>

    Status:
    ${
        area.isActive
        ? "Active"
        : "Inactive"
    }

</p>

    <button
        onclick="
            editLearningArea(
                '${area.areaId}'
            )
        ">

        Edit

    </button>

    <button
    onclick="
        toggleAreaStatus(
            '${area.areaId}'
        )
    ">

    ${
        area.isActive
        ? "Deactivate"
        : "Activate"
    }

</button>

</div>

`;

        }
    );

}

function editLearningArea(areaId) {

    const area =
        learningAreas.find(
            a =>
            a.areaId === areaId
        );

    showPage(
        "create-area-page"
    );

    showCreateAreaForm();

    document.getElementById(
        "area-id"
    ).value =
        area.areaId;

    document.getElementById(
        "area-title"
    ).value =
        area.title;

    document.getElementById(
        "area-description"
    ).value =
        area.description;

}


function toggleAreaStatus(areaId) {

    const area =
        learningAreas.find(
            a =>
            a.areaId === areaId
        );

    area.isActive =
        !area.isActive;

    localStorage.setItem(
        "learningAreas",
        JSON.stringify(
            learningAreas
        )
    );

    showManageAreas();

}

function showCreateThemeForm() {

    loadLearningAreasFromStorage();

console.log(
    "Learning Areas:",
    learningAreas
);

    document.getElementById(
        "create-theme-content"
    ).innerHTML = `

<input
    id="theme-id"
    class="admin-input"
    placeholder="Theme ID">

<input
    id="theme-title"
    class="admin-input"
    placeholder="Theme Title">

    <select
    id="theme-learning-area"
    class="admin-input">

    <option value="">
        Select Learning Area
    </option>

    ${
        learningAreas
        .filter(
            area =>
            area.isActive !== false
        )
        .map(
            area => `
                <option
                    value="${area.areaId}">
                    ${area.title}
                </option>
            `
        )
        .join("")
    }

</select>

<textarea
    id="theme-description"
    class="admin-input"
    rows="4"
    placeholder="Description">

</textarea>

<button
    class="admin-btn"
    onclick="saveTheme()">

    Save Theme

</button>

<div id="theme-preview">

</div>

`;

}

function saveTheme() {

    const theme = {

        themeId:
            document.getElementById(
                "theme-id"
            ).value.trim(),

        title:
            document.getElementById(
                "theme-title"
            ).value.trim(),

            learningAreaId:
    document.getElementById(
        "theme-learning-area"
    ).value,

        description:
            document.getElementById(
                "theme-description"
            ).value.trim(),

        isActive: true

    };

    const existingTheme =
    themes.find(
        t =>
        t.themeId === theme.themeId
    );

    console.log(
    "Searching:",
    theme.themeId
);

console.log(
    "Found:",
    existingTheme
);

if (existingTheme) {

    existingTheme.title =
        theme.title;

    existingTheme.learningAreaId =
        theme.learningAreaId;

    existingTheme.description =
        theme.description;

} else {

    themes.push(
        theme
    );

}

localStorage.setItem(
    "themes",
    JSON.stringify(
        themes
    )
);

    console.log(
        theme
    );

    document.getElementById(
        "theme-preview"
    ).innerHTML = `

<pre>

${JSON.stringify(
    theme,
    null,
    4
)}

</pre>

`;

}

function loadThemesFromStorage() {

    const savedThemes =
        localStorage.getItem(
            "themes"
        );

    if (savedThemes) {

        window.themes =
            JSON.parse(
                savedThemes
            );

        themes.forEach(
            function(theme) {

                if (
                    theme.isActive ===
                    undefined
                ) {

                    theme.isActive =
                        true;

                }

            }
        );

    }

}

function showManageThemes() {

    const container =
        document.getElementById(
            "manage-themes-content"
        );

    container.innerHTML = "";

    themes.forEach(
        function(theme) {

            container.innerHTML += `

<div class="admin-card">

    <h3>

        ${theme.title}

    </h3>

    <p>

        ${theme.themeId}

    </p>

    <p>

        Status:
        ${
            theme.isActive
            ? "Active"
            : "Inactive"
        }

    </p>

    <button
    onclick="
        editTheme(
            '${theme.themeId}'
        )
    ">

    Edit

</button>

<button
    onclick="
        toggleThemeStatus(
            '${theme.themeId}'
        )
    ">

    ${
        theme.isActive
        ? "Deactivate"
        : "Activate"
    }

</button>

</div>

`;

        }
    );

}


function toggleThemeStatus(themeId) {

    const theme =
        themes.find(
            t =>
            t.themeId === themeId
        );

    theme.isActive =
        !theme.isActive;

    localStorage.setItem(
        "themes",
        JSON.stringify(
            themes
        )
    );

    showManageThemes();

}

function editTheme(themeId) {

    const theme =
        themes.find(
            t =>
            t.themeId === themeId
        );

    showPage(
        "create-theme-page"
    );

    showCreateThemeForm();

    document.getElementById(
        "theme-id"
    ).value =
        theme.themeId;

    document.getElementById(
        "theme-title"
    ).value =
        theme.title;

    document.getElementById(
    "theme-learning-area"
).value =
    theme.learningAreaId;

    document.getElementById(
        "theme-description"
    ).value =
        theme.description;

}



function showCreateListForm() {

    loadThemesFromStorage();

    document.getElementById(
        "create-list-content"
    ).innerHTML = `

<input
    id="list-id"
    class="admin-input"
    placeholder="List ID">

<input
    id="list-title"
    class="admin-input"
    placeholder="List Title">

<select
    id="list-theme"
    class="admin-input">

    <option value="">
        Select Theme
    </option>

    ${
        themes
        .filter(
            theme =>
            theme.isActive !== false
        )
        .map(
            theme => `
                <option
                    value="${theme.themeId}">
                    ${theme.title}
                </option>
            `
        )
        .join("")
    }

</select>

<textarea
    id="list-description"
    class="admin-input"
    rows="4"
    placeholder="Description">

</textarea>

<button
    class="admin-btn"
    onclick="saveList()">

    Save List

</button>

<div id="list-preview">

</div>

`;

}

function saveList() {

    const list = {

        listId:
            document.getElementById(
                "list-id"
            ).value.trim(),

        title:
            document.getElementById(
                "list-title"
            ).value.trim(),

        themeId:
    document.getElementById(
        "list-theme"
    ).value,

        description:
            document.getElementById(
                "list-description"
            ).value.trim(),

        isActive: true

    };

    

    const existingList =
    lists.find(
        l =>
        l.listId === list.listId
    );

if (existingList) {

    existingList.title =
        list.title;

    existingList.themeId =
        list.themeId;

    existingList.description =
        list.description;

} else {

    lists.push(
        list
    );

}

localStorage.setItem(
    "lists",
    JSON.stringify(
        lists
    )
);

    console.log(
        list
    );

    document.getElementById(
        "list-preview"
    ).innerHTML = `

<pre>

${JSON.stringify(
    list,
    null,
    4
)}

</pre>

`;

}


function loadListsFromStorage() {

    const savedLists =
        localStorage.getItem(
            "lists"
        );

    if (savedLists) {

        window.lists =
            JSON.parse(
                savedLists
            );

        lists.forEach(
            function(list) {

                if (
                    list.isActive ===
                    undefined
                ) {

                    list.isActive =
                        true;

                }

            }
        );

    }

}

function showManageLists() {

    const container =
        document.getElementById(
            "manage-lists-content"
        );

    container.innerHTML = "";

    lists.forEach(
        function(list) {

            container.innerHTML += `

<div class="admin-card">

    <h3>

        ${list.title}

    </h3>

    <p>

        ${list.listId}

    </p>

    <p>

        Status:
        ${
            list.isActive
            ? "Active"
            : "Inactive"
        }

    </p>

    <button
    onclick="
        editList(
            '${list.listId}'
        )
    ">

    Edit

</button>

<button
    onclick="
        toggleListStatus(
            '${list.listId}'
        )
    ">

    ${
        list.isActive
        ? "Deactivate"
        : "Activate"
    }

</button>

</div>

`;

        }
    );

}

function editList(listId) {

    const list =
        lists.find(
            l =>
            l.listId === listId
        );

    showPage(
        "create-list-page"
    );

    showCreateListForm();

    document.getElementById(
        "list-id"
    ).value =
        list.listId;

    document.getElementById(
        "list-title"
    ).value =
        list.title;

    document.getElementById(
    "list-theme"
).value =
    list.themeId;

    document.getElementById(
        "list-description"
    ).value =
        list.description;

}

function toggleListStatus(listId) {

    const list =
        lists.find(
            l =>
            l.listId === listId
        );

    list.isActive =
        !list.isActive;

    localStorage.setItem(
        "lists",
        JSON.stringify(
            lists
        )
    );

    showManageLists();

}

function loadLearningItemsFromStorage() {

    const savedItems =
        localStorage.getItem(
            "learningItems"
        );

    if (
        savedItems
    ) {

        window.learningItems =
            JSON.parse(
                savedItems
            );

    }

    if (
    !localStorage.getItem(
        "learningItems"
    )
) {

    localStorage.setItem(
        "learningItems",
        JSON.stringify(
            learningItems
        )
    );

}

}

function getNextContentId() {

    if (
        learningItems.length === 0
    ) {

        return 1;

    }

    const numericIds =
        learningItems
        .map(
            function(item) {

                const id =
                    parseInt(
                        item.contentId
                    );

                return isNaN(id)
                    ? 0
                    : id;

            }
        );

    return (
        Math.max(
            ...numericIds
        ) + 1
    );

}

function openLessonManagementPage() {

    showPage(
        "lesson-management-page"
    );

    showLessonManagementForm();

}

function showLessonManagementForm() {

    document.getElementById(
        "lesson-management-content"
    ).innerHTML = `

    <div class="lesson-actions">

    <button
        class="nav-btn"
        onclick="showCreateContent()">

        Create Content

    </button>

    <button
        class="nav-btn"
        onclick="showEditContent()">

        Edit Content

    </button>

</div>



<div
    id="lesson-results">

</div>

`;

}


function showEditContent() {

    document.getElementById(
        "lesson-results"
    ).innerHTML = `

<h3>

    Edit Content

</h3>

<input
    type="text"
    id="content-id-search"
    class="admin-input"
    placeholder="Enter Content ID">

<button
    class="nav-btn"
    onclick="loadContentById()">

    Load Lesson

</button>

<div
    id="edit-content-results">

</div>

`;

}

function loadContentById() {

    const contentId =

        document.getElementById(
            "content-id-search"
        ).value;

    const lesson =

        learningItems.find(
            item =>
                item.contentId ==
                contentId
        );

    editLesson(
        lesson.contentId
    );

}

function loadLessonThemes() {

    const areaId =
        document.getElementById(
            "lesson-learning-area"
        ).value;

    const themeDropdown =
        document.getElementById(
            "lesson-theme"
        );

    themeDropdown.innerHTML = `

<option value="">

    Select Theme

</option>

`;

    themes
        .filter(
            theme =>
                theme.learningAreaId
                === areaId
                &&
                theme.isActive !== false
        )
        .forEach(
            function(theme) {

                themeDropdown.innerHTML += `

<option
    value="${theme.themeId}">

    ${theme.title}

</option>

`;

            }
        );

}

function loadLessonLists() {

    const themeId =
        document.getElementById(
            "lesson-theme"
        ).value;

    const listDropdown =
        document.getElementById(
            "lesson-list"
        );

    listDropdown.innerHTML = `

<option value="">

    Select List

</option>

`;

    lists
        .filter(
            list =>
                list.themeId
                === themeId
                &&
                list.isActive !== false
        )
        .forEach(
            function(list) {

                listDropdown.innerHTML += `

<option
    value="${list.listId}">

    ${list.title}

</option>

`;

            }
        );

}

function showCreateContent() {

    document.getElementById(
        "lesson-results"
    ).innerHTML = `

<h3>

    Create Content

</h3>

<select
    id="lesson-learning-area"
    class="admin-input"
    onchange="loadLessonThemes()">

    <option value="">

        Select Learning Area

    </option>

    ${
        learningAreas
        .filter(
            area =>
                area.isActive !== false
        )
        .map(
            area => `

<option
    value="${area.areaId}">

    ${area.title}

</option>

`
        )
        .join("")
    }

</select>

<select
    id="lesson-theme"
    class="admin-input"
    onchange="loadLessonLists()">

    <option value="">

        Select Theme

    </option>

</select>

<select
    id="lesson-list"
    class="admin-input">

    <option value="">

        Select List

    </option>

</select>

<label>

    Content ID

</label>

<input
    type="text"
    id="lesson-content-id"
    class="admin-input"
    readonly>

<label>

    Lesson Title

</label>

<input
    type="text"
    id="lesson-title"
    class="admin-input"
    placeholder="Lesson Title">

    <button
    class="nav-btn"
    onclick="createLesson()">

    Create Lesson

</button>

<div
    id="lesson-editor">

</div>

`;

}

function createLesson() {

   

    const areaId =
        document.getElementById(
            "lesson-learning-area"
        ).value;

    const themeId =
        document.getElementById(
            "lesson-theme"
        ).value;

    const listId =
        document.getElementById(
            "lesson-list"
        ).value;

        

    const lessonTitle =
        document.getElementById(
            "lesson-title"
        ).value;

        const area =
    learningAreas.find(
        area =>
            area.areaId === areaId
    );

const theme =
    themes.find(
        theme =>
            theme.themeId === themeId
    );

const list =
    lists.find(
        list =>
            list.listId === listId
    );

const lesson = {

    courseId: "",

    courseTitle: "",

    learningArea:
        area.title,

    themeId:
        theme.themeId,

    themeTitle:
        theme.title,

    listId:
        list.listId,

    listTitle:
        list.title,

    contentType:
        "lesson",

    contentId:
        getNextContentId(),

    title:
        lessonTitle,

    content: {

        sections: []

    }

};

 currentLessonId =
    lesson.contentId;

console.log(
    currentLessonId
);

learningItems.push(
    lesson
);

window.currentLessonId =
    lesson.contentId;

    console.log(
    window.currentLessonId
);

localStorage.setItem(
    "learningItems",
    JSON.stringify(
        learningItems
    )
);

console.log(
    learningItems
);

renderLessonEditor();

}

function renderLessonEditor() {

    document.getElementById(
        "lesson-editor"
    ).innerHTML = `

<h3>

    Lesson Editor

</h3>

<select
    id="section-type"
    class="admin-input">

    <option value="">

        Select Section Type

    </option>

    <option value="objectives">

        Objectives

    </option>

    <option value="normal">

        Normal

    </option>

    <option value="image">

        Image

    </option>

    <option value="outcome">

        Outcome

    </option>

</select>



<input
    type="text"
    id="section-title"
    class="admin-input"
    placeholder="Section Title">

    <div class="editor-toolbar">

    <div class="toolbar-group">

<select
    id="block-selector"
    class="admin-input"
    onchange="insertBlock(this.value)">

    <option value="">

        Insert Block

    </option>

    <option value="PARAGRAPH">

        Paragraph

    </option>

    <option value="EXAMPLE">

        Example

    </option>

    <option value="LIST">

        List

    </option>

    <option value="NUMBERED">

        Numbered List

    </option>

</select>

</div>


    <div class="toolbar-group">

        <button
            type="button"
            class="nav-btn"
            onclick="makeBold()">

            Bold

        </button>

        <button
            type="button"
            class="nav-btn"
            onclick="makeItalic()">

            Italic

        </button>

        <button
            type="button"
            class="nav-btn"
            onclick="makeUnderline()">

            Underline

        </button>

    </div>

</div>


    <textarea
    id="section-content"
    class="admin-input"
    rows="12"
    placeholder="Section Content">
</textarea>

<div
    id="sections-list">

</div>

<div class="editor-actions">
<button
    class="nav-btn"
    onclick="saveSection()">

    Save Section

</button>

<button
    class="nav-btn"
    onclick="saveLessonContent()">

    Save Lesson

</button>

</div>

`;


}


function editLesson(contentId) {

    const lesson =

        learningItems.find(
            item =>
                item.contentId ==
                contentId
        );

        console.log(
    lesson
);

console.log(
    lesson.content
);

console.log(
    lesson.content.sections
);

        currentLessonId =
    lesson.contentId;

console.log(
    "Current Lesson:",
    currentLessonId
);

    showCreateContent();

    console.log(
    "Title:",
    lesson.title
);

console.log(
    "Content ID:",
    lesson.contentId
);

    const area =

    learningAreas.find(
        area =>
            area.title ===
            lesson.learningArea
    );

document.getElementById(
    "lesson-learning-area"
).value =
    area.areaId;

    loadLessonThemes();

    renderLessonEditor();

    document.getElementById(
    "lesson-theme"
).value =
    lesson.themeId;

    loadLessonLists();

    document.getElementById(
    "lesson-list"
).value =
    lesson.listId;

    currentSections =
    lesson.content.sections;

   renderSectionsList();

    document.getElementById(
        "lesson-content-id"
    ).value =
        lesson.contentId;

    document.getElementById(
        "lesson-title"
    ).value =
        lesson.title;

        document.getElementById(
    "lesson-title"
).readOnly =
    true;

        console.log(
    document.getElementById(
        "lesson-content-id"
    ).value
);

console.log(
    document.getElementById(
        "lesson-title"
    ).value
);

}

function editSection(
    sectionOrder
) {

    document
    .querySelectorAll(
        ".section-row"
    )
    .forEach(
        row =>
            row.classList.remove(
                "active"
            )
    );

document.getElementById(
    `section-${sectionOrder}`
).classList.add(
    "active"
);

    currentEditingSection =
        sectionOrder;

    const section =

        currentSections.find(
            s =>
                s.sectionOrder ===
                sectionOrder
        );

    document.getElementById(
        "section-type"
    ).value =
        section.sectionType;

    document.getElementById(
        "section-title"
    ).value =
        section.sectionTitle;

    document.getElementById(
        "section-content"
    ).value =
        section.sectionContent;

}


function renderSectionsList() {

    console.log(
    "renderSectionsList called"
);

console.log(
    currentSections
);

    document.getElementById(
        "sections-list"
    ).innerHTML = "";

    currentSections.forEach(
        function(section) {

           document.getElementById(
    "sections-list"
).innerHTML += `

<div class="section-row"
id="section-${section.sectionOrder}">

    <span>

        ${section.sectionTitle}

    </span>

    <button
        class="nav-btn"
        onclick="editSection(${section.sectionOrder})">

        Edit

    </button>

</div>

`;

        }
    );

}



function insertBlock(
    blockType
) {

    if (!blockType) {

        return;

    }

    insertTag(
        blockType
    );

    document.getElementById(
        "block-selector"
    ).value = "";

}


function makeItalic() {

    const textarea =
        document.getElementById(
            "section-content"
        );

    const start =
        textarea.selectionStart;

    const end =
        textarea.selectionEnd;

    const selectedText =
        textarea.value.substring(
            start,
            end
        );

    if (!selectedText) {

        alert(
            "Please select text first."
        );

        return;

        

    }

    const replacement =

`[ITALIC]${selectedText}[/ITALIC]`;

    textarea.value =

        textarea.value.substring(
            0,
            start
        ) +

        replacement +

        textarea.value.substring(
            end
        );

        textarea.focus();

}

function makeUnderline() {

    const textarea =
        document.getElementById(
            "section-content"
        );

    const start =
        textarea.selectionStart;

    const end =
        textarea.selectionEnd;

    const selectedText =
        textarea.value.substring(
            start,
            end
        );

    if (!selectedText) {

        alert(
            "Please select text first."
        );

        return;

    }

    const replacement =

`[UNDERLINE]${selectedText}[/UNDERLINE]`;

    textarea.value =

        textarea.value.substring(
            0,
            start
        ) +

        replacement +

        textarea.value.substring(
            end
        );

        textarea.focus();

}

function saveSection() {


    const sectionType =
        document.getElementById(
            "section-type"
        ).value;

    const sectionTitle =
        document.getElementById(
            "section-title"
        ).value;

    const sectionContent =
        document.getElementById(
            "section-content"
        ).value;

    

if (!sectionType) {

    alert(
        "Please select a section type."
    );

    return;

}

    if (!sectionTitle.trim()) {

    alert(
        "Please enter a section title."
    );

    return;

}

if (!sectionContent.trim()) {

    alert(
        "Please enter section content."
    );

    return;

}

console.log(
    currentEditingSection
);

        const section = {

    sectionOrder:
    currentSections.length + 1,

    sectionType:
        sectionType,

    sectionTitle:
        sectionTitle,

    sectionContent:
        sectionContent

};

if (
    currentEditingSection ===
    null
) {

    currentSections.push(
        section
    );

} else {

    const existingSection =

        currentSections.find(
            s =>
                s.sectionOrder ===
                currentEditingSection
        );

    existingSection.sectionType =
        sectionType;

    existingSection.sectionTitle =
        sectionTitle;

    existingSection.sectionContent =
        sectionContent;

}

console.log(
    currentSections
);


    document.getElementById(
    "sections-list"
).innerHTML += `

<p>

    ${section.sectionTitle}

</p>

`;

document.getElementById(
    "section-type"
).value = "";

document.getElementById(
    "section-title"
).value = "";

document.getElementById(
    "section-content"
).value = "";

currentEditingSection =
    null;

}

function insertTag(tag) {

    const textarea =
        document.getElementById(
            "section-content"
        );

    let template = "";

    if (
        tag === "LIST"
    ) {

        template =

`[LIST]

[*]

[/LIST]`;

    }

    else if (
        tag === "NUMBERED"
    ) {

        template =

`[NUMBERED]

[*]

[/NUMBERED]`;

    }

    else {

        template =

`[${tag}]

[/${tag}]`;

    }

    textarea.value +=

`\n\n${template}\n`;

}

function makeBold() {

    const textarea =
        document.getElementById(
            "section-content"
        );

    const start =
        textarea.selectionStart;

    const end =
        textarea.selectionEnd;

    const selectedText =
        textarea.value.substring(
            start,
            end
        );

    if (!selectedText) {

        alert(
            "Please select text first."
        );

        return;

    }

    const replacement =

`[BOLD]${selectedText}[/BOLD]`;

    textarea.value =

        textarea.value.substring(
            0,
            start
        ) +

        replacement +

        textarea.value.substring(
            end
        );

        textarea.focus();

}

function saveLessonContent() {

    if (
    currentSections.length === 0
) {

    alert(
        "Please add at least one section."
    );

    return;

}

const lesson =
    learningItems.find(
        item =>
            item.contentId ===
            currentLessonId
    );

lesson.content.sections =
    currentSections;

    console.log(
    "LESSON READY TO SAVE:",
    lesson
);

console.log(
    "Saving Lesson:",
    currentLessonId
);

    localStorage.setItem(
    "learningItems",
    JSON.stringify(
        learningItems
    )
);

alert(
    "Lesson saved successfully."
);

}


function testFunction() {

    alert("Test");

}


loadProgress();

loadCoursesFromStorage();

loadLearningAreasFromStorage();

loadThemesFromStorage();

loadListsFromStorage();

loadLearningItemsFromStorage();

showPage("cover-page");

renderCourses();

