"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {InfoIcon as InfoCircle} from "lucide-react"
import ReactDiffViewer, {DiffMethod} from "react-diff-viewer"
import {useMemo} from "react"

interface CodeReviewDisplayProps {
    chainOfThought: string
    groundTruth: string
    prediction: string
    summary: string
    patch: string
}

// Helper to parse Git diff hunk
function parseGitDiffHunk(hunk: string): { oldValue: string; newValue: string } {
    const lines = hunk.split('\n')
    const oldLines: string[] = []
    const newLines: string[] = []

    for (const line of lines) {
        if (line.startsWith('@@')) continue
        if (line.startsWith('-')) {
            oldLines.push(line.slice(1))
        } else if (line.startsWith('+')) {
            newLines.push(line.slice(1))
        } else {
            const clean = line.startsWith(' ') ? line.slice(1) : line
            oldLines.push(clean)
            newLines.push(clean)
        }
    }

    return {
        oldValue: oldLines.join('\n'),
        newValue: newLines.join('\n'),
    }
}

export function CodeReviewDisplay({chainOfThought, groundTruth, prediction, summary, patch}: CodeReviewDisplayProps) {
    const {oldValue, newValue} = useMemo(() => parseGitDiffHunk(patch), [chainOfThought])

    return (
        <div>
            <div className="">
                <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-3">
                    {/* Code Summary */}
                    <Card className={"rounded-none"}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">What Code Change Does (Summary)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800">
                                <p className="text-sm">{summary}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ground Truth */}
                    <Card className={"rounded-none"}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Ground-truth Review Comment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800">
                                <p className="text-sm">{groundTruth}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Comment */}
                    <Card className="rounded-none border-2 border-blue-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">AI Generated Review Comment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800">
                                <p className="text-sm">{prediction}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className={"border-none"}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center justify-between">
                                <span>Code Patch</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-y-auto w-full">
                                <div className="w-full text-sm whitespace-pre-wrap break-words">
                                    <ReactDiffViewer
                                        oldValue={oldValue}
                                        newValue={newValue}
                                        splitView={true}
                                        compareMethod={DiffMethod.WORDS}
                                        useDarkTheme={true}
                                        styles={{
                                            variables: {
                                                dark: {
                                                    diffViewerBackground: "#000000",
                                                    addedBackground: "#044B53",
                                                    removedBackground: "#632F34",
                                                    wordAddedBackground: "#055d67",
                                                    wordRemovedBackground: "#7d383e",
                                                    addedColor: "#c9f7ff",
                                                    removedColor: "#ffc9c9",
                                                },
                                            },
                                            diffContainer: {
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-word",
                                            },
                                            codeFoldGutter: {
                                                whiteSpace: "pre-wrap",
                                            },
                                            contentText: {
                                                whiteSpace: "pre-wrap",
                                            },
                                            line: {
                                                whiteSpace: "pre-wrap",
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div>
                <Card className="border-none pt-3">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                            <span>Explanation of AI Generated Review Comment</span>
                            <div className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                                <InfoCircle className="h-3 w-3 mr-1"/>
                                <span>This is the reasoning trace that explains the AI review comment</span>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="border-2 border-black rounded-md p-7 max-h-[400px] overflow-y-auto">
                            <pre className="text-sm whitespace-pre-wrap">{chainOfThought}</pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
