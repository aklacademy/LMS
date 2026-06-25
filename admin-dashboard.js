/*================================
    Admin data Page
===================================*/

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


    const totalCourses =
    courses.length;

const totalAreas =
    learningAreas.length;

const totalThemes =
    themes.length;

const totalLists =
    lists.length;

const totalItems =
    learningItems.length;

const totalQuestions =
    assessmentQuestions.length;

const totalLearners =
    learners.length;

let totalAssignedLists = 0;

learners.forEach(function(
    learner
) {

    learner.assignedCourses.forEach(
        function(courseId) {

            const course =
                courses.find(
                    function(course) {

                        return (
                            course.courseId
                            === courseId
                        );

                    }
                );

            if (!course) {

                return;

            }

            totalAssignedLists +=
                course.assignedLists.length;

        }

        
    );
});


const allLearnerProgress =
    loadLearnerProgress();

let startedLearners = 0;

let learnedLists = 0;

let masteredLists = 0;

let learningCompletion = 0;

let masteryCompletion = 0;

let notStartedLearners = 0;

learners.forEach(function(
    learner
) {

    let assignedLists = 0;

    learner.assignedCourses.forEach(
        function(courseId) {

            const course =
                courses.find(
                    function(course) {

                        return (
                            course.courseId
                            === courseId
                        );

                    }
                );

            if (!course) {

                return;

            }

            assignedLists +=
                course.assignedLists.length;

        }
    );

    const learnerData =
        allLearnerProgress[
            learner.learnerId
        ];

    if (
        assignedLists > 0
        &&
        !learnerData
    ) {

        notStartedLearners++;

    }

});

Object.keys(
    allLearnerProgress
).forEach(function(learnerId) {

    const learnerData =
    allLearnerProgress[
        learnerId
    ];

 
    if (
    learnerData &&
    learnerData.lists &&
    Object.keys(
        learnerData.lists
    ).length > 0
) {

    startedLearners++;

    Object.values(
    learnerData.lists
).forEach(function(listProgress) {

    if (
        listProgress.learned === true
    ) {

        learnedLists++;

    }

    if (
    listProgress.mastered === true
) {

    masteredLists++;

}

});
}

});

if (
    totalAssignedLists > 0
) {

    learningCompletion =

        Math.round(

            (
                learnedLists
                /
                totalAssignedLists
            ) * 100

        );

}

if (
    totalAssignedLists > 0
) {

    masteryCompletion =

        Math.round(

            (
                masteredLists
                /
                totalAssignedLists
            ) * 100

        );

}

statsContainer.innerHTML = `

<div class="dashboard-card">

    <h3>

        LMS Overview

    </h3>

    <p>

        Courses:
        ${totalCourses}

    </p>

    <p>

        Learning Areas:
        ${totalAreas}

    </p>

    <p>

        Themes:
        ${totalThemes}

    </p>

    <p>

        Lists:
        ${totalLists}

    </p>

    <p>

        Content Items:
        ${totalItems}

    </p>

    <p>

        Assessment Questions:
        ${totalQuestions}

    </p>

    </div>

    <div class="dashboard-card">


<h3>

    Learners Overview

</h3>

<table class="admin-table">

    <tr>

        <th>

            Metric

        </th>

        <th>

            Count

        </th>

        <th>

            Percentage

        </th>

    </tr>

    <tr>

        <td>

            Total Learners

        </td>

        <td>

            ${totalLearners}

        </td>

        <td>

            -

        </td>

    </tr>

    <tr>

        <td>

            Started Learners

        </td>

        <td>

            ${startedLearners}

        </td>

        <td>

            ${Math.round(
                (startedLearners /
                totalLearners) * 100
            )}%

        </td>

    </tr>

    <tr>

        <td>

            Lists Learned

        </td>

        <td>

            ${learnedLists}

        </td>

        <td>

            ${learningCompletion}%

        </td>

    </tr>

    <tr>

        <td>

            Lists Mastered

        </td>

        <td>

            ${masteredLists}

        </td>

        <td>

            ${masteryCompletion}%

        </td>

    </tr>

    <tr>

        <td>

            Not Started Learners

        </td>

        <td>

            ${notStartedLearners}

        </td>

        <td>

            ${Math.round(
                (notStartedLearners /
                totalLearners) * 100
            )}%

        </td>

    </tr>

</table>

</div>

`;

courseContainer.innerHTML = `

<div class="dashboard-card">

    <h3>

        Course Overview

    </h3>

    <table
        id="course-summary-table"
        class="admin-table">

        <thead>

            <tr>

                <th>Course</th>

                <th>ID</th>

                <th>Areas</th>

                <th>Themes</th>

                <th>Lists</th>

                <th>Items</th>

                <th>Questions</th>

            </tr>

        </thead>

        <tbody>

        </tbody>

    </table>

</div>

`;

const tableBody =

    document.querySelector(
        "#course-summary-table tbody"

    );

courses.forEach(function(course) {

    const stats =
        getCourseStatistics(
            course
        );

    const themeCount =
        stats.themeCount;

    const listCount =
        stats.listCount;

    const itemCount =
        stats.itemCount;

    const questionCount =
        stats.questionCount;

    const areaCount =

        course.learningAreas
            ? course.learningAreas.length
            : 0;

    tableBody.innerHTML += `

        <tr>

            <td>${course.title}</td>

            <td>${course.courseId}</td>

            <td>${areaCount}</td>

            <td>${themeCount}</td>

            <td>${listCount}</td>

            <td>${itemCount}</td>

            <td>${questionCount}</td>

        </tr>

    `;

});
        
}