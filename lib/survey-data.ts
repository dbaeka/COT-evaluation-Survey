"use client"

export const developerProfileQuestions = [
    {
        id: "dev_experience",
        type: "select",
        text: "How many years of professional software development experience do you have?",
        options: ["0-1", "1-3", "3-5", "5-10", "10+"],
        required: true,
    },
    {
        id: "review_giving_experience",
        type: "select",
        text: "How many years of experience do you have giving code reviews (peer reviews)?",
        options: ["0-1", "1-3", "3-5", "5-10", "10+"],
        required: true,
    },
    {
        id: "review_receiving_experience",
        type: "select",
        text: "How many years of experience do you have receiving code reviews on your code?",
        options: ["0-1", "1-3", "3-5", "5-10", "10+"],
        required: true,
    },
    {
        id: "review_expertise",
        type: "select",
        text: "How would you rate your expertise in performing code reviews?",
        options: ["Novice", "Intermediate", "Advanced", "Expert"],
        required: true,
    },
]

export const surveyResponseQuestions = [
    {
        id: "actionable",
        type: "likert",
        text: "Actionable",
        description: "Does the explanation in the reasoning trace suggest actionable changes (asks user to make a change)?",
        options: ["Not Actionable", "Partially Actionable", "Clearly Actionable"],
        required: true,
    },
    {
        id: "clarity",
        type: "likert",
        text: "Clarity",
        description: "How well the reasoning trace explains the AI's logic for its comment.",
        options: ["Not Clear", "Somewhat Clear", "Very Clear"],
        required: true,
    },
    {
        id: "relevance",
        type: "likert",
        text: "Relevance",
        description: "How well the AI comment pertains to the specific code changed (diff) and the goal of that change.",
        options: ["No Relevance", "Somewhat Relevant", "Very Relevant"],
        required: true,
    },
]