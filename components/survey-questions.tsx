"use client"

import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Label} from "@/components/ui/label"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {AlertCircle} from "lucide-react"
import {
    Tooltip,
    TooltipArrow,
    TooltipContent,
    TooltipPortal,
    TooltipProvider,
    TooltipTrigger
} from "@radix-ui/react-tooltip";

interface Question {
    id: string
    type: string
    text: string
    description?: string
    options?: string[]
    required?: boolean
}

interface SurveyQuestionsProps {
    questions: Question[]
    responses: Record<string, any>
    currentHash: string
    onChange: (questionId: string, value: any) => void
    errors: Record<string, string>
}

export function SurveyQuestions({questions, responses, currentHash, onChange, errors}: SurveyQuestionsProps) {
    // Helper function to get detailed descriptions for each option
    const getOptionDescription = (questionId: string, option: string) => {
        if (questionId === "actionable") {
            switch (option) {
                case "Not Actionable":
                    return "Vague, subjective, lacks specific direction, or doesn't relate to a concrete code change.";
                case "Slightly Actionable":
                    return "Mentions a potential issue but is too vague to be followed without guesswork.";
                case "Moderately Actionable":
                    return "Points to a specific issue but the suggestion is incomplete or requires interpretation by the author.";
                case "Mostly Actionable":
                    return 'Gives a clear suggestion, but may miss some context or minor detail. Example: "Consider renaming this variable for clarity."';
                case "Clearly Actionable":
                    return 'Suggests a specific, understandable change. Example: "Rename variable `tmp` to `elapsed_time` for clarity."';
            }
        } else if (questionId === "clarity") {
            switch (option) {
                case "Not Clear":
                    return "Confusing, irrelevant, illogical, or missing. Does not explain the comment at all.";
                case "Slightly Clear":
                    return "Some elements are understandable, but overall lacks clarity or is disorganized.";
                case "Moderately Clear":
                    return "Partially explains the reasoning, but may be vague, incomplete, or require interpretation.";
                case "Mostly Clear":
                    return "Generally easy to follow, with only minor ambiguities.";
                case "Very Clear":
                    return "Direct, logical explanation. Easy to follow the AI's reasoning for the comment.";
            }
        } else if (questionId === "relevance") {
            switch (option) {
                case "No Relevance":
                    return "Completely unrelated to the code change, or misunderstands the change’s purpose.";
                case "Slightly Relevant":
                    return "Touches on code aspects outside the diff or is only marginally related to the change.";
                case "Moderately Relevant":
                    return "Addresses code in the diff but is tangential or only loosely connected to the main change.";
                case "Mostly Relevant":
                    return "Pertinent to the change and addresses it directly, but may lack depth or precision.";
                case "Very Relevant":
                    return "Directly addresses code in the diff and relates closely to the change's purpose/impact. Improves the change.";
            }
        }
        return "";
    }

    return (
        <Card className="mt-8">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Evaluation Criteria</CardTitle>
                <p className="text-sm text-gray-500">
                    Please rate the following criteria (Hover over icon on response options
                    for more details):
                </p>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-8">
                    {questions.map((question) => {
                        const responseKey = `${currentHash}_${question.id}`
                        const currentValue = responses[responseKey] || ""
                        const hasError = errors[question.id]

                        return (
                            <div key={question.id} className="space-y-3">
                                <div>
                                    <h3 className={`text-lg font-medium ${question.required ? "required" : ""}`}>{question.text}</h3>
                                    {question.description &&
                                        <p className="text-sm text-gray-500">{question.description}</p>}
                                </div>

                                {question.type === "likert" && (
                                    <>
                                        <RadioGroup
                                            value={currentValue}
                                            onValueChange={(value) => onChange(question.id, value)}
                                            className="space-y-3"
                                        >
                                            {question.options?.map((option, index) => (
                                                <div key={option}
                                                     className="flex flex-col space-y-1 border rounded-md p-3">
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value={option} id={`${question.id}-${index}`}/>
                                                        <Label htmlFor={`${question.id}-${index}`}
                                                               className="font-medium">
                                                            {option}
                                                        </Label>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <AlertCircle
                                                                        className="h-4 w-4 text-gray-500 cursor-pointer"/>
                                                                </TooltipTrigger>
                                                                <TooltipPortal>
                                                                    <TooltipContent className="TooltipContent">
                                                                        {getOptionDescription(question.id, option)}
                                                                        <TooltipArrow className="TooltipArrow"/>
                                                                    </TooltipContent>
                                                                </TooltipPortal>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                        {hasError && (
                                            <div className="flex items-center gap-2 text-sm text-red-500">
                                                <AlertCircle className="h-4 w-4"/>
                                                <span>{hasError}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
