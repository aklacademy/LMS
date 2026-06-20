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

loadCoursesFromStorage();
loadLearningAreasFromStorage();
loadThemesFromStorage();
loadListsFromStorage();
loadLearningItemsFromStorage();
loadAssessmentQuestions();
loadLearners();