"use client"

import {useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {AlertCircle} from "lucide-react"
import {developerProfileQuestions} from "@/lib/survey-data"
import {saveResponses} from "@/lib/survey-store"
import {useRouter} from "next/navigation"

export function DeveloperProfile() {
    const router = useRouter()
    const [responses, setResponses] = useState<Record<string, any>>({})
    const [languageProficiency, setLanguageProficiency] = useState<Record<string, string>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [languageErrors, setLanguageErrors] = useState<Record<string, string>>({});
    const [showValidationAlert, setShowValidationAlert] = useState(false)

    const handleResponseChange = (questionId: string, value: string) => {
        setResponses((prev) => ({
            ...prev,
            [questionId]: value,
        }))

        // Clear error for this question when user provides an answer
        if (errors[questionId]) {
            setErrors((prev) => {
                const newErrors = {...prev}
                delete newErrors[questionId]
                return newErrors
            })
        }
    }

    const handleLanguageProficiencyChange = (language: string, value: string) => {
        setLanguageProficiency((prev) => ({
            ...prev,
            [language]: value,
        }))
    }

    const validateResponses = () => {
        const newErrors: Record<string, string> = {}
        const newLanguageErrors: Record<string, string> = {};
        let hasErrors = false

        // Check if all required questions have answers
        developerProfileQuestions.forEach((question) => {
            if (question.required && (!responses[question.id] || responses[question.id].trim() === "")) {
                newErrors[question.id] = "This field is required"
                hasErrors = true
            }
        })

        // Check if all required language proficiencies are filled
        languageGroups.forEach((group) => {
            group.languages.forEach((language) => {
                if (!languageProficiency[language] || languageProficiency[language].trim() === "") {
                    newLanguageErrors[language] = "This field is required";
                    hasErrors = true;
                }
            });
        });

        setErrors(newErrors)
        setLanguageErrors(newLanguageErrors);
        setShowValidationAlert(hasErrors)
        return !hasErrors
    }

    const handleSubmit = () => {
        // Validate responses before proceeding
        if (!validateResponses()) {
            // Scroll to the top to show the validation alert
            window.scrollTo({top: 0, behavior: "smooth"})
            return
        }

        // Combine regular responses with language proficiency
        const allResponses = {
            ...responses,
            language_proficiency: languageProficiency,
        }

        // Save responses
        saveResponses(allResponses)

        // Navigate to the first survey page
        router.push("/survey/1")
    }

    // Group languages into categories for more compact display
    const languageGroups = [
        {
            name: "Web",
            languages: ["Go", "JavaScript", "Java", "PHP", "Python"],
        },
    ]

    return (
        <div className="space-y-6">
            {showValidationAlert && (
                <div className="flex items-center gap-2 p-4 text-sm text-red-500 bg-red-50 rounded-md">
                    <AlertCircle className="h-4 w-4"/>
                    <span>Please complete all required fields before proceeding.</span>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Developer Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {developerProfileQuestions.map((question) => (
                        <div key={question.id} className="space-y-2">
                            <Label htmlFor={question.id} className={question.required ? "required" : ""}>
                                {question.text}
                            </Label>
                            <Select
                                value={responses[question.id] || ""}
                                onValueChange={(value) => handleResponseChange(question.id, value)}
                            >
                                <SelectTrigger id={question.id} className={errors[question.id] ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select an option"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {question.options?.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors[question.id] && (
                                <div className="flex items-center gap-2 text-sm text-red-500">
                                    <AlertCircle className="h-4 w-4"/>
                                    <span>{errors[question.id]}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Programming Language Proficiency</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                        Please select your proficiency level for languages you have experience with. You can leave
                        others blank.
                    </p>

                    <div className="space-y-6 mt-4">
                        {languageGroups.map((group) => (
                            <div key={group.name.toLowerCase()} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {group.languages.map((language) => (
                                        <div key={language} className="space-y-2">
                                            <Label className="required">{language}</Label>
                                            <Select
                                                value={languageProficiency[language] || ""}
                                                onValueChange={(value) => handleLanguageProficiencyChange(language, value)}
                                            >
                                                <SelectTrigger
                                                    className={languageErrors[language] ? "border-red-500" : ""}>
                                                    <SelectValue placeholder="Select proficiency"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="not_applicable">Not Applicable / No
                                                        Experience</SelectItem>
                                                    <SelectItem value="basic">Basic Familiarity</SelectItem>
                                                    <SelectItem value="proficient">Proficient</SelectItem>
                                                    <SelectItem value="expert">Expert</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {languageErrors[language] && (
                                                <div className="flex items-center gap-2 text-sm text-red-500">
                                                    <AlertCircle className="h-4 w-4"/>
                                                    <span>{languageErrors[language]}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSubmit} size="lg">
                    Continue to Survey
                </Button>
            </div>
        </div>
    )
}
