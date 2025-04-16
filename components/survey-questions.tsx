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
    pageId: number
    onChange: (questionId: string, value: any) => void
    errors: Record<string, string>
}

export function SurveyQuestions({questions, responses, pageId, onChange, errors}: SurveyQuestionsProps) {
    // Helper function to get detailed descriptions for each option
    const getOptionDescription = (questionId: string, option: string) => {
        if (questionId === "actionable") {
            if (option === "Clearly Actionable") {
                return 'Suggests a specific, understandable change. Example: "Rename variable `tmp` to `elapsed_time` for clarity."'
            } else if (option === "Partially Actionable") {
                return "Points to a specific issue but the suggestion is vague, incomplete, or requires significant interpretation by the author."
            } else if (option === "Not Actionable") {
                return "Vague, subjective, lacks specific direction, or doesn't relate to a concrete code change."
            }
        } else if (questionId === "clarity") {
            if (option === "Very Clear") {
                return "Direct, logical explanation. Easy to follow the AI's reasoning for the comment."
            } else if (option === "Somewhat Clear") {
                return "Partially explains, but may be vague, incomplete, or require interpretation. The general idea is understandable."
            } else if (option === "Not Clear") {
                return "Confusing, irrelevant, illogical, nonsensical, or missing. Does not explain the AI comment."
            }
        } else if (questionId === "relevance") {
            if (option === "Very Relevant") {
                return "Directly addresses code in the diff and relates closely to the change's purpose/impact. Improves the change."
            } else if (option === "Somewhat Relevant") {
                return "Addresses code in the diff but is tangential, minor, or only loosely connected to the change's main goal."
            } else if (option === "No Relevance") {
                return "Discusses code outside the diff, misunderstands the change's purpose, or is completely unrelated."
            }
        }
        return ""
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
                        const responseKey = `page_${pageId}_${question.id}`
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
