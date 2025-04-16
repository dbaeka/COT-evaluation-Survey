"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {CodeReviewDisplay} from "@/components/code-review-display"
import {SurveyQuestions} from "@/components/survey-questions"
import {Progress} from "@/components/ui/progress"
import {AlertCircle, Loader2} from "lucide-react"
import {Alert, AlertDescription} from "@/components/ui/alert"
import {supabase} from "@/lib/supabase-client"
import {getResponses, saveResponses} from "@/lib/survey-store"
import {surveyResponseQuestions} from "@/lib/survey-data"

export default function SurveyPage() {
    const router = useRouter()
    const [responses, setResponses] = useState<Record<string, any>>(getResponses() || {})
    const [reviewItems, setReviewItems] = useState<any[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [showValidationAlert, setShowValidationAlert] = useState(false)

    const evaluatorUUID = typeof window !== "undefined" ? localStorage.getItem("evaluator_uuid") : null

    useEffect(() => {
        const fetchSurveyItems = async () => {
            if (!evaluatorUUID) return

            setIsLoading(true)

            const {data: evaluator, error: evalError} = await supabase
                .from("evaluators")
                .select("id")
                .eq("uuid", evaluatorUUID)
                .single()

            if (evalError || !evaluator) return

            const {data: assignments, error: assignError} = await supabase
                .from("assignments")
                .select("review_id")
                .eq("evaluator_id", evaluator.id)

            if (assignError || !assignments) return

            const reviewIds = assignments.map(a => a.review_id)

            const {data: responsesData} = await supabase
                .from("responses")
                .select("hash")
                .eq("evaluator_id", evaluatorUUID)

            const answeredHashes = new Set((responsesData || []).map(r => r.hash))

            const {data: reviews, error: reviewError} = await supabase
                .from("review_items")
                .select("id, hash, chain_of_thought, ground_truth, prediction, summary, patch")
                .in("id", reviewIds)

            if (reviewError) return

            const unanswered = reviews.filter(r => !answeredHashes.has(r.hash))

            const ordered = [...unanswered, ...reviews.filter(r => answeredHashes.has(r.hash))]

            setReviewItems(ordered)
            setIsLoading(false)
        }

        fetchSurveyItems()
    }, [evaluatorUUID])

    const handleResponseChange = (questionId: string, value: any) => {
        const current = reviewItems[currentIndex]
        const responseKey = `${current.hash}_${questionId}`

        const updatedResponses = {
            ...responses,
            [responseKey]: value,
        }

        setResponses(updatedResponses)
        saveResponses(updatedResponses)

        if (errors[questionId]) {
            const newErrors = {...errors}
            delete newErrors[questionId]
            setErrors(newErrors)
        }
    }

    const validateResponses = () => {
        const requiredIds = ["actionable", "clarity", "relevance"]
        const newErrors: Record<string, string> = {}
        let hasErrors = false
        const current = reviewItems[currentIndex]

        for (const id of requiredIds) {
            const key = `${current.hash}_${id}`
            if (!responses[key]) {
                newErrors[id] = "This field is required"
                hasErrors = true
            }
        }

        setErrors(newErrors)
        setShowValidationAlert(hasErrors)
        return !hasErrors
    }

    const handleNext = async () => {
        if (!validateResponses()) {
            window.scrollTo({top: 0, behavior: "smooth"})
            return
        }

        const current = reviewItems[currentIndex]
        const questions = ["actionable", "clarity", "relevance"]
        const questionMap: Record<string, number> = {"actionable": 1, "clarity": 2, "relevance": 3}

        for (const q of questions) {
            const {error: upsertError} = await supabase
                .from("responses")
                .upsert({
                    evaluator_id: evaluatorUUID,
                    hash: current.hash,
                    question_id: questionMap[q],
                    answer: responses[`${current.hash}_${q}`],
                }, {onConflict: "evaluator_id,hash,question_id"})

            if (upsertError) console.error("Error saving response:", upsertError.message)
        }

        if (currentIndex < reviewItems.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            await supabase
                .from("evaluators")
                .update({date_completed: new Date().toISOString()})
                .eq("uuid", evaluatorUUID)

            router.push("/thank-you")
        }
    }

    const handleJumpTo = (index: number) => {
        setErrors({})
        setShowValidationAlert(false)
        setCurrentIndex(index)
    }

    if (isLoading) {
        return (
            <div className="simple-bg flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary"/>
                    <div className="mt-4">Loading survey data...</div>
                </div>
            </div>
        )
    }

    const progressPercentage = ((currentIndex + 1) / reviewItems.length) * 100
    const current = reviewItems[currentIndex]

    return (
        <div className="simple-bg min-h-screen py-8">
            <div className="container mx-auto max-w-6xl px-4">
                {showValidationAlert && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>Please complete all required fields before proceeding.</AlertDescription>
                    </Alert>
                )}

                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-2xl font-bold">Review Evaluation {currentIndex + 1}</h1>
                        <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {reviewItems.length} ({Math.round(progressPercentage)}%)
            </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2"/>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {reviewItems.map((_, idx) => (
                            <Button
                                key={idx}
                                variant={idx === currentIndex ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleJumpTo(idx)}
                            >
                                {idx + 1}
                            </Button>
                        ))}
                    </div>
                </div>

                <Card className="mb-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-[2.6]">
                            <CodeReviewDisplay
                                chainOfThought={current.chain_of_thought}
                                groundTruth={current.ground_truth}
                                prediction={current.prediction}
                                summary={current.summary}
                                patch={current.patch}
                            />
                        </div>

                        <div className="flex-[1.4]">
                            <SurveyQuestions
                                questions={surveyResponseQuestions}
                                responses={responses}
                                currentHash={current.hash}
                                onChange={handleResponseChange}
                                errors={errors}
                            />
                        </div>
                    </div>

                    <div className="mt-8 p-4 flex justify-end">
                        <Button onClick={handleNext}>
                            {currentIndex + 1 === reviewItems.length ? "Finish Evaluation" : "Next"}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
