import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="simple-bg flex min-h-screen flex-col items-center justify-center py-12">
      <div className="w-full max-w-3xl px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Code Review Comment Evaluation</CardTitle>
            <CardDescription className="text-lg">
              Thinking through Code Review Comment Generation with LLM CoT Models
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">
              Thank you for participating in our research on automated code review comment generation. As an evaluator,
              you'll assess the quality of AI-generated code review comments compared to ground-truth human reviews.
            </p>
            <p className="mb-6">
              You'll evaluate 60 code review instances, each containing the AI's reasoning trace, the original human
              review comment, and an AI-generated review comment. Your expert assessment will help us improve the
              clarity, actionability, and relevance of AI-generated code reviews.
            </p>
            <p>
              <strong>Note:</strong> We'll first collect some information about your development experience to help
              contextualize the results.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/profile">
              <Button size="lg" className="px-8">
                Start
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
