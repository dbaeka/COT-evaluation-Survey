import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function ThankYouPage() {
  return (
    <div className="simple-bg flex min-h-screen flex-col items-center justify-center py-12">
      <div className="w-full max-w-2xl px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-bold">Thank You!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-lg">
              Your responses have been successfully recorded. We appreciate your time and valuable feedback.
            </p>
            <p>
              Your insights will help us better understand and improve AI-generated code review comments for software
              development.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
