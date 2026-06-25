function getCourseStatistics(
    course
) {

    let themeCount = 0;

    let listCount = 0;

    let itemCount = 0;

    let questionCount = 0;

    course.learningAreas.forEach(
        function(areaId) {

            const areaThemes =
                getThemesByLearningArea(
                    areaId
                );

            themeCount +=
                areaThemes.length;

            areaThemes.forEach(
                function(theme) {

                    const themeLists =
                        getListsByThemeId(
                            theme.themeId
                        );

                    listCount +=
                        themeLists.length;

                    themeLists.forEach(
                        function(list) {

                            itemCount +=
                                getItemsByListId(
                                    list.listId
                                ).length;

                            questionCount +=
                                getQuestionsByListId(
                                    list.listId
                                ).length;

                        }
                    );

                }
            );

        }
    );

    return {

        themeCount,

        listCount,

        itemCount,

        questionCount

    };

}