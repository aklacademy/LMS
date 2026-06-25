/*======================================
        DATA REPOSITORY
========================================*/

/*
Purpose
-------
This file acts as the central data access
layer for the LMS.

Its responsibility is to load and save data
used by the application.

Currently, the data is stored in the browser's
Local Storage.

In the future, this file can be modified to
communicate with a live server and database
without changing the learner or admin
business logic.

Responsibilities
----------------
✓ Load data
✓ Save data

This file must never contain:

✗ User Interface (UI)
✗ Learning Logic
✗ Assessment Logic
✗ Business Rules

Version History
---------------
V5
- Repository layer introduced.
- Prepared for future server migration.
*/

/*======================================
    Load Learner Progress
========================================*/

/*
Purpose
-------
Loads all learner progress records from
Local Storage into the application's memory.

Why
---
When the LMS starts, learner progress must
be restored before the learner can continue
learning.

Migration Note
--------------
Currently this function reads from Local
Storage.

When the LMS moves to a live server, only
this function will change. The learner and
admin modules will continue to call this
function without knowing where the data
comes from.
*/

/*======================================
     LEARNER PROGRESS
======================================*/

function loadLearnerProgress() {

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

    /*
    Remove the obsolete V3 global progress
    object.

    Progress is now stored separately for
    each learner using:

    learnerProgress[learnerId].lists
    */

    delete learnerProgress.lists;

}


/*======================================
        LEARNER DATA
======================================*/

/*
Purpose
-------
Saves the current learner progress from the
application's memory into Local Storage.

Why
---
Every time the learner completes an activity,
their progress must be saved so it can be
restored the next time they use the LMS.

Migration Note
--------------
Currently this function saves the learner
progress to Local Storage.

When the LMS is deployed to a live server,
this function will save the learner progress
to the database through the Repository
without changing the learner business logic.

Version History
---------------
V5
- Moved from learner-core.js.
- Centralised learner progress storage.
*/

function saveLearnerProgress() {

    localStorage.setItem(
        "learnerProgress",
        JSON.stringify(
            learnerProgress
        )
    );

}


/*======================================
    Load All Learners
========================================*/

/*
Purpose
-------
Loads all learner records from the browser's
Local Storage into the LMS memory.

Why
---
Whenever the LMS starts, the application must
retrieve all learner records before the admin
or learner modules can access them.

This function restores the learners array so
that the application can search, display,
create, edit and manage learner information.

Migration Note
--------------
Currently, learner records are stored in the
browser's Local Storage.

When the LMS is deployed to a live server,
this function will retrieve learner records
from the database through the Repository
without changing the business logic.

Version History
---------------
V5
- Moved from learners.js to repository.js.
- Centralised learner data access.
*/



function loadAllLearners() {

    /*
    Retrieve previously saved learner records
    from the browser's Local Storage.
    */
    const savedLearners =
        localStorage.getItem(
            "learners"
        );

    /*
    Restore the learner collection only if
    learner records already exist.
    */
    if (savedLearners) {

        /*
        Convert the stored JSON text back into
        a JavaScript array and load it into
        the application's memory.
        */
        learners =
            JSON.parse(
                savedLearners
            );

    }

}

/*======================================
    Save All Learners
========================================*/

/*
Purpose
-------
Saves all learner records from the application's
memory into the browser's Local Storage.

Why
---
Whenever learner information is created,
updated, or deleted, the changes must be
saved permanently so they are available the
next time the LMS is opened.

This function stores the complete learners
collection in Local Storage.

Migration Note
--------------
Currently, learner records are saved in the
browser's Local Storage.

When the LMS is deployed to a live server,
this function will save learner records to
the database through the Repository without
changing the business logic.

Version History
---------------
V5
- Moved from learners.js to repository.js.
- Centralised learner data access.
*/

function saveAllLearners() {

    /*
    Convert the learners collection into
    JSON text and save it permanently in
    the browser's Local Storage.
    */
    localStorage.setItem(
        "learners",
        JSON.stringify(
            learners
        )
    );

}

/*======================================
    COURSES REPOSITORY
========================================*/

/*
    Load all courses from Local Storage.

    Repository Responsibility:
    - Read the Courses collection.
    - Restore it into memory.

    Business logic and UI are handled elsewhere.
*/

function loadAllCourses() {

    const savedCourses =
        localStorage.getItem(
            "courses"
        );

    if (savedCourses) {

        courses =
            JSON.parse(
                savedCourses
            );

    }

}

/*
    Save all courses to Local Storage.

    Repository Responsibility:
    - Persist the complete Courses collection.

    Business logic must prepare the data
    before calling this function.
*/

function saveAllCourses() {

    localStorage.setItem(
        "courses",
        JSON.stringify(
            courses
        )
    );

}

/*======================================
    LEARNING AREAS REPOSITORY
========================================*/

/*
Purpose
-------
Loads all Learning Areas from the browser's
Local Storage into the application's memory.

Migration Note
--------------
When the LMS moves to a live server,
this function will retrieve Learning Areas
from the database instead of Local Storage.
*/

function loadAllLearningAreas() {

    const savedLearningAreas =
        localStorage.getItem(
            "learningAreas"
        );

    if (savedLearningAreas) {

        learningAreas =
            JSON.parse(
                savedLearningAreas
            );

    }

}

/*
Purpose
-------
Saves all Learning Areas from memory into
the browser's Local Storage.

Migration Note
--------------
When the LMS moves to a live server,
this function will save Learning Areas
to the database instead of Local Storage.
*/

function saveAllLearningAreas() {

    localStorage.setItem(
        "learningAreas",
        JSON.stringify(
            learningAreas
        )
    );

}


/*======================================
    THEMES REPOSITORY
========================================*/

/*
Purpose
-------
Loads all Themes from the browser's
Local Storage into the application's
memory.

Migration Note
--------------
When the LMS moves to a live server,
this function will retrieve Themes
from the database instead of Local
Storage.
*/

function loadAllThemes() {

    const savedThemes =
        localStorage.getItem(
            "themes"
        );

    if (savedThemes) {

        themes =
            JSON.parse(
                savedThemes
            );

    }

}

/*
Purpose
-------
Saves all Themes from the application's
memory into the browser's Local Storage.

Migration Note
--------------
When the LMS moves to a live server,
this function will save Themes to the
database instead of Local Storage.
*/

function saveAllThemes() {

    localStorage.setItem(
        "themes",
        JSON.stringify(
            themes
        )
    );

}

/*======================================
    LISTS REPOSITORY
========================================*/

/*
Purpose
-------
Loads all Lists from the browser's
Local Storage into the application's
memory.

Migration Note
--------------
When the LMS is deployed to a live
server, this function will retrieve
Lists from the database instead of
Local Storage.
*/

function loadAllLists() {

    const savedLists =
        localStorage.getItem(
            "lists"
        );

    if (savedLists) {

        lists =
            JSON.parse(
                savedLists
            );

    }

}

/*
Purpose
-------
Saves all Lists from the application's
memory into the browser's Local Storage.

Migration Note
--------------
When the LMS is deployed to a live
server, this function will save Lists
to the database instead of Local Storage.
*/

function saveAllLists() {

    localStorage.setItem(
        "lists",
        JSON.stringify(
            lists
        )
    );

}


/*=================================
    Learner Progress Repository
===================================*/

function getAllLearnerProgress() {

    return (
        JSON.parse(
            localStorage.getItem(
                "learnerProgress"
            )
        ) || {}
    );

}