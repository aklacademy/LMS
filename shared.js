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


/*======================================
    Get Themes by Learning Area
========================================*/

/*function getThemesByLearningArea(
    learningAreaId
) {

    return getThemes().filter(
        function(theme) {

            return (
                theme.learningAreaId ===
                learningAreaId
            );

        }
    );

}*/

function getThemesByLearningArea(
    learningAreaId
) {

    const filtered = getThemes().filter(
        function(theme) {

            return (
                theme.learningAreaId ===
                learningAreaId
            );

        }
    );

    console.log("Found:", filtered);

    return filtered;

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

function getNextQuestionId() {

    if (
        assessmentQuestions.length === 0
    ) {

        return 1;

    }

    const numericIds =
        assessmentQuestions
        .map(
            function(question) {

                const id =
                    parseInt(
                        question.questionId
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


//Storage

/*======================================
    Load Courses
========================================*/

/*
Purpose
-------
Loads all Courses into the application's
memory.

Why
---
This function acts as the application's
initialisation layer.

The Repository is responsible for reading
the data, while this function prepares
the Courses for use by the LMS.

Migration Note
--------------
If future versions require data upgrades
or compatibility fixes, they should be
added here rather than in the Repository.
*/

function loadCoursesFromStorage() {

    /*
    Load all Courses from the Repository.
    */
    loadAllCourses();

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

/*======================================
    Ensure Active Property
========================================*/

/*
Purpose
-------
Ensures that every object in a collection
contains the 'isActive' property.

Used By
-------
- Learning Areas
- Themes
- Lists
- Learning Items
- Assessment Questions
*/

function ensureIsActiveProperty(
    collection
) {

    collection.forEach(
        function(item) {

            if (
                item.isActive ===
                undefined
            ) {

                item.isActive = true;

            }

        }
    );

}


/*======================================
    Load Lists
========================================*/

/*
Purpose
-------
Loads all Lists into the application's
memory and upgrades older List records
to the current LMS version.

Why
---
Earlier versions of the LMS did not
contain the 'isActive' property.

This function ensures every List has
an 'isActive' value before the rest
of the application uses it.
*/

function loadListsFromStorage() {

    /*
    Load all Lists from the Repository.
    */
    loadAllLists();

    /*
    Upgrade older List records.

    Older versions of the LMS may not
    contain the 'isActive' property.
    */
    lists.forEach(
        function(list) {

            if (
                list.isActive ===
                undefined
            ) {

                list.isActive = true;

            }

        }
    );

}

function getLists() {

    return lists;

}

function getThemes() {

    return themes;

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

/*======================================
    Load Themes
========================================*/

/*
Purpose
-------
Loads all Themes into the application's
memory and upgrades older Theme records
to the current LMS version.

Why
---
Earlier versions of the LMS did not
contain the 'isActive' property.

This function ensures every Theme has
an 'isActive' value before the rest of
the application uses it.
*/

function loadThemesFromStorage() {

    /*
    Load all Themes from the Repository.
    */
    loadAllThemes();

    /*
    Upgrade older Theme records.

    Older versions of the LMS may not
    contain the 'isActive' property.
    */
    themes.forEach(
        function(theme) {

            if (
                theme.isActive ===
                undefined
            ) {

                theme.isActive = true;

            }

        }
    );

}


/*======================================
    Load Learning Areas
========================================*/

/*
Purpose
-------
Loads all Learning Areas into memory and
ensures that older data remains compatible
with the current LMS version.

Why
---
Earlier versions of the LMS did not contain
the 'isActive' property.

This function upgrades older Learning Area
records after they are loaded so that the
rest of the application can safely assume
every Learning Area has an 'isActive' value.
*/

function loadLearningAreasFromStorage() {

    /*
    Load all Learning Areas from the
    Repository.
    */
    loadAllLearningAreas();

    /*
    Upgrade older Learning Area records.

    Older versions of the LMS may not have
    stored the 'isActive' property.

    Assign a default value so that the
    application can work with both old
    and new data.
    */
   
   ensureIsActiveProperty(
        learningAreas
    );

}

loadCoursesFromStorage();
if (
    courses.length > 0
) {

    currentCourse =
        courses[0].courseId;

}

function loadAssessmentQuestions() {

    const savedQuestions =
        localStorage.getItem(
            "assessmentQuestions"
        );

    if (savedQuestions) {

        window.assessmentQuestions =
            JSON.parse(
                savedQuestions
            );

    }

}

function getCurrentLearnerProgress() {

    const learnerId =
        currentLearner.learnerId;

    if (
        !learnerProgress[
            learnerId
        ]
    ) {

        learnerProgress[
            learnerId
        ] = {

            lists: {}

        };

    }

    return learnerProgress[
        learnerId
    ];

}

loadCoursesFromStorage();
loadLearningAreasFromStorage();
loadThemesFromStorage();
loadListsFromStorage();
loadLearningItemsFromStorage();
loadAssessmentQuestions();
loadAllLearners();