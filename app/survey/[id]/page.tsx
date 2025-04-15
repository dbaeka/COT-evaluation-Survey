"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CodeReviewDisplay } from "@/components/code-review-display"
import { SurveyQuestions } from "@/components/survey-questions"
import { getSurveyPage, getTotalPages, useSurveyData } from "@/lib/survey-data"
import { saveResponses, getResponses } from "@/lib/survey-store"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SurveyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const pageId = Number.parseInt(params.id)

  const [responses, setResponses] = useState<Record<string, any>>({})
  const [currentPageData, setCurrentPageData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(5) // We know we have 5 pages
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showValidationAlert, setShowValidationAlert] = useState(false)

  const { data, loading } = useSurveyData()

  useEffect(() => {
    // Load saved responses
    const savedResponses = getResponses()
    setResponses(savedResponses || {})

    // Get current page data
    const pageData = getSurveyPage(pageId)
    setCurrentPageData(pageData)
    setTotalPages(getTotalPages())
    setIsLoading(loading)

    // Reset errors when changing pages
    setErrors({})
    setShowValidationAlert(false)
  }, [pageId, loading])

  // Redirect if page doesn't exist
  useEffect(() => {
    if (!isLoading && (isNaN(pageId) || pageId < 1 || pageId > totalPages)) {
      router.push("/")
    }
  }, [pageId, router, totalPages, isLoading])

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [`page_${pageId}_${questionId}`]: value,
    }))

    // Clear error for this question when user provides an answer
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }

    // Hide validation alert if all required fields are filled
    if (showValidationAlert) {
      setShowValidationAlert(false)
    }
  }

  const validateResponses = () => {
    const newErrors: Record<string, string> = {}
    let hasErrors = false

    // Check if all required questions have answers
    currentPageData.questions.forEach((question: any) => {
      if (question.required) {
        const responseKey = `page_${pageId}_${question.id}`
        const response = responses[responseKey]

        if (!response || response.trim() === "") {
          newErrors[question.id] = "This field is required"
          hasErrors = true
        }
      }
    })

    setErrors(newErrors)
    setShowValidationAlert(hasErrors)
    return !hasErrors
  }

  const handleNext = () => {
    // Validate responses before proceeding
    if (!validateResponses()) {
      // Scroll to the top to show the validation alert
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    // Save responses
    saveResponses(responses)

    // Navigate to next page or thank you page
    if (pageId < totalPages) {
      router.push(`/survey/${pageId + 1}`)
    } else {
      router.push("/thank-you")
    }
  }

  const handlePrevious = () => {
    // Save responses even if incomplete
    saveResponses(responses)

    // Navigate to previous page
    if (pageId > 1) {
      router.push(`/survey/${pageId - 1}`)
    }
  }

  if (isLoading) {
    return (
      <div className="simple-bg flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <div className="mt-4">Loading survey data...</div>
        </div>
      </div>
    )
  }

  const progressPercentage = (pageId / totalPages) * 100

  return (
    <div className="simple-bg min-h-screen py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {showValidationAlert && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please complete all required fields before proceeding.</AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Review Evaluation {pageId}</h1>
            <span className="text-sm text-muted-foreground">
              {pageId} of {totalPages} ({Math.round(progressPercentage)}%)
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Card className="mb-6 p-6">
          <CodeReviewDisplay
            chainOfThought={currentPageData.chainOfThought}
            groundTruth={currentPageData.groundTruth}
            prediction={currentPageData.prediction}
            summary={currentPageData.summary}
          />

          <SurveyQuestions
            questions={currentPageData.questions}
            responses={responses}
            pageId={pageId}
            onChange={handleResponseChange}
            errors={errors}
          />

          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={pageId === 1}>
              Previous
            </Button>

            <Button onClick={handleNext}>{pageId === totalPages ? "Finish Evaluation" : "Next"}</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
