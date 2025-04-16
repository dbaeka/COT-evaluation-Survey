"use client"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {supabase} from "@/lib/supabase-client"
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function LandingPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleStart = async () => {
        setLoading(true)

        const existingUUID = localStorage.getItem("evaluator_uuid")

        if (existingUUID) {
            await supabase
                .from("evaluators")
                .update({spot_taken: true})
                .eq("uuid", existingUUID)

            const {data: existingEvaluator, error} = await supabase
                .from("evaluators")
                .select("dev_experience")
                .eq("uuid", existingUUID)
                .single()

            if (!error && existingEvaluator) {
                if (!existingEvaluator.dev_experience) {
                    router.push("/profile")
                } else {
                    router.push("/survey")
                }
                return
            }

            localStorage.removeItem("evaluator_uuid")
        }

        const {data, error} = await supabase
            .from("evaluators")
            .select("*")
            .eq("spot_taken", false)
            .limit(1)
            .single()

        if (error || !data) {
            alert("No available evaluator slot. Please try again later.")
            setLoading(false)
            return
        }

        await supabase
            .from("evaluators")
            .update({spot_taken: true})
            .eq("id", data.id)

        localStorage.setItem("evaluator_uuid", data.uuid)

        router.push("/profile")
    }


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
                            Thank you for participating in our research on automated code review comment generation. As
                            an evaluator,
                            you'll assess the quality of AI-generated code review comments compared to ground-truth
                            human reviews.
                        </p>
                        <p className="mb-6">
                            You'll evaluate 60 code review instances, each containing the AI's reasoning trace, the
                            original human
                            review comment, and an AI-generated review comment. Your expert assessment will help us
                            improve the
                            clarity, actionability, and relevance of AI-generated code reviews.
                        </p>
                        <p>
                            <strong>Note:</strong> We'll first collect some information about your development
                            experience to help
                            contextualize the results.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button onClick={handleStart} size="lg" className="px-8" disabled={loading}>
                            {loading ? "Reserving slot..." : "Start"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
