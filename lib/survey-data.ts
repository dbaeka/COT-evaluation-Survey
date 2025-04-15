"use client"

import { useEffect, useState } from "react"

// Define the structure of a survey item based on your JSON data
export interface SurveyItem {
  id: number
  chainOfThought: string
  groundTruth: string
  prediction: string
  summary: string
  questions: {
    id: string
    type: string
    text: string
    description?: string
    options?: string[]
    required?: boolean
  }[]
}

// Static survey data from the provided JSON
const staticSurveyData = [
  {
    id: 0,
    "Chain of thought":
      "Let me analyze this code diff:\n\n1. They're adding a new error variable `errInvalidGitHubRepo` for GitHub repository validation.\n2. They're also adding a regular expression pattern `githubRepoExp` to validate GitHub repository URLs.\n\nI need to provide a formal code review in one sentence that focuses on potential issues or improvements. Looking at the regular expression:\n\n`https:\\/\\/github\\.com\\/(?P<owner>.+)\\/(?P<repo>.+)`\n\nI notice that:\n- It uses named capture groups `owner` and `repo`, which is good\n- However, it uses `.+` which is greedy and would match everything, including trailing slashes, query parameters, or fragments that might be part of the URL\n- This regex might be too permissive as it would match invalid repository paths\n\nThe regex should probably be more specific about what characters are allowed in owner and repo names, and should handle possible trailing parts of the URL properly.\n\nAlso, the regex doesn't accommodate other valid GitHub URL formats like:\n- github.com/owner/repo (without https://)\n- www.github.com/owner/repo\n- git@github.com:owner/repo (SSH format)\n\nSo a more robust implementation would handle these cases too.",
    "ground truth": "nit: error starts with capital letter",
    prediction:
      "The regular expression might be too permissive with `.+` patterns, which could capture trailing slashes, branches, or query parameters in GitHub URLs.",
    summary:
      "Validate that the passed in value is a valid  . basicNameValidation checks if the given value is a valid unique identifier.",
  },
  {
    id: 1,
    "Chain of thought":
      'This code is modifying the logic for deciding when to update previews during a drag operation in the Blockly library. Let me analyze the changes:\n\n1. The original code updates previews if both `Blockly.localConnection_` and `Blockly.highlightedConnection_` are truthy.\n2. The new code adds a new condition: if `localConnection` exists and is an output connection type, then always update previews.\n3. The comment states "Always update previews for output connections."\n\nThe issue I see here is that the code is using `localConnection` in the new condition, but the variable that\'s checked in the existing condition is `Blockly.localConnection_`. This seems inconsistent and potentially a bug.\n\nThe formal code review should point out this inconsistency between variable names.',
    "ground truth":
      "...and in turn, this should probably be var updatePreviews = true; if (!(localConnection && localConnection.type == Blockly.OUTPUT_VALUE) && (Blockly.localConnection_ && Blockly.highlightedConnection_)) { since the first clause is a no-op. If you want to leave it this way for clarity, that's fine too.",
    prediction:
      "The variable names are inconsistent: you're using `localConnection` in the new condition but `Blockly.localConnection_` in the existing code.",
    summary:
      "Block dragged bubble. The function to preview the results of the drag if the mouse is released immediately.",
  },
  {
    id: 2,
    "Chain of thought":
      "The code review task is to provide a formal code review in one sentence for the given diff hunk. \n\nThe diff hunk shows the addition of 5 new `use` statements:\n1. `Ergonode\\Core\\Application\\Security\\User\\CachedUser`\n2. `Ergonode\\Account\\Domain\\Repository\\UserRepositoryInterface`\n3. `Ergonode\\SharedKernel\\Domain\\Aggregate\\UserId`\n4. `Ergonode\\BatchAction\\Domain\\Event\\BatchActionEndedEvent`\n5. `Ergonode\\Core\\Application\\Messenger\\Stamp\\UserStamp`\n\nLooking at the code style and conventions, I notice that the imports are not alphabetically ordered, which is a common convention in many PHP codebases. A good code review comment would point this out as a style/convention issue.",
    "ground truth":
      "As far as I can see you're not rollbacking transaction anywhere. This could potentially cause further issues(and very hard to debug ones) with not synchronized transactions between message handling. Is the transaction required in this place anyway? You seem only to be fetching data here. ack method is performing some updates so it makes sense",
    prediction:
      "The use statements should be alphabetically ordered for better readability and consistency with common PHP conventions.",
    summary: "Creates a transport that processes a single batch action. Mark the last handled stamp for the message.",
  },
  {
    id: 3,
    "Chain of thought":
      'Looking at the code diff, I need to review the changes in error handling within the `openBucket` function.\n\nChanges:\n1. The first error changed from `return nil, fmt.Errorf("open file bucket: %v", err)` to `return nil, err`\n2. The second error changed from `return nil, fmt.Errorf("open file bucket: %s is not a directory", dir)` to `return nil, fmt.Errorf("%s is not a directory", dir)`\n\nIssues with these changes:\n- In the first change, removing the wrapping with context means that callers won\'t know this error came from "open file bucket". This loses important context.\n- In the second change, similarly, the "open file bucket" context is removed.\n\nBest practices for error handling typically suggest adding context to errors, especially in library code, so that users can understand where the error originated. Removing context makes it harder to trace the source of errors.\n\nA formal code review should point out that the changes are removing important context from error messages.',
    "ground truth": 'I don\'t see how removing "open file bucket" helps your purpose.',
    prediction:
      'The error handling change removes important context about the operation being performed ("open file bucket"). ',
    summary: "Private functions - functions escape returns a string with all non - hexadecimal characters escaped.",
  },
  {
    id: 4,
    "Chain of thought":
      'This code adds image dimensions to the results, but there\'s a spelling error in the field names. It should be "IMAGE_WIDTH" but it\'s written as "IMAGE_WIDH" (twice) and "ORIGINAL_IMAGE_WIDH" instead of "ORIGINAL_IMAGE_WIDTH".\n\nI\'ll write a concise code review pointing out this typo.',
    "ground truth": "I think you should use `$event->getOriginalFileUrl()` instead of `$sourceFilePath` here.",
    prediction:
      'The field names "IMAGE_WIDH" and "ORIGINAL_IMAGE_WIDH" are misspelled, should be "WIDTH" instead of "WIDH".',
    summary: "Parse loop result and create ImageEvent object Envia un event navegat This function process image loop.",
  },
]

// Format the data to match our application structure
const surveyData: SurveyItem[] = staticSurveyData.map((item, index) => ({
  id: index + 1, // Start from 1 instead of 0 for page numbering
  chainOfThought: item["Chain of thought"],
  groundTruth: item["ground truth"],
  prediction: item.prediction,
  summary: item.summary,
  questions: [
    {
      id: "actionable",
      type: "likert",
      text: "Actionable",
      description: "Does the explanation in the reasoning trace suggest actionable changes?",
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
  ],
}))

// Developer profile questions
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
  {
    id: "primary_area",
    type: "select",
    text: "What is your primary area of software development?",
    options: [
      "Web Frontend",
      "Web Backend",
      "Mobile (iOS/Android)",
      "Systems Programming",
      "Data Science/ML",
      "DevOps",
      "Embedded Systems",
      "Game Development",
      "Other",
    ],
    required: true,
  },
]

// Programming languages for proficiency rating
export const programmingLanguages = [
  "JavaScript",
  "TypeScript",
  "PHP",
  "Ruby",
  "C++",
  "Go",
  "C#",
  "Java",
  "Python",
  "R",
  "SQL",
  "Julia",
  "Scala",
]

// Hook to get survey data
export function useSurveyData() {
  const [data, setData] = useState<SurveyItem[]>(surveyData)
  const [loading, setLoading] = useState(false)

  // No need to fetch data since we're using static data
  useEffect(() => {
    setLoading(false)
  }, [])

  return { data, loading }
}

// Get a specific survey page
export function getSurveyPage(pageId: number) {
  return surveyData.find((page) => page.id === pageId) || surveyData[0]
}

// Get total number of pages
export function getTotalPages() {
  return surveyData.length
}
