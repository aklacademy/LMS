let learners = [];



function getNextLearnerId() {

    if (
        learners.length === 0
    ) {

        return "AKL0001";

    }

    const lastLearner =

        learners[
            learners.length - 1
        ];

    const lastNumber =

        Number(
            lastLearner.learnerId
                .replace(
                    "AKL",
                    ""
                )
        );

    return (

        "AKL"

        +

        String(
            lastNumber + 1
        ).padStart(
            4,
            "0"
        )

    );

}