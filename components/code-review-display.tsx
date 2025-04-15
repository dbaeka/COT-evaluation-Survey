"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoIcon as InfoCircle } from "lucide-react"

interface CodeReviewDisplayProps {
  chainOfThought: string
  groundTruth: string
  prediction: string
  summary: string
}

export function CodeReviewDisplay({ chainOfThought, groundTruth, prediction, summary }: CodeReviewDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* AI Comment */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">AI Review Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-sm">{prediction}</p>
            </div>
          </CardContent>
        </Card>

        {/* Ground Truth */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ground-truth Review Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-sm">{groundTruth}</p>
            </div>
          </CardContent>
        </Card>

        {/* Code Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Code Change Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-sm">{summary}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chain of Thought (COT) - Now on the right side */}
      <div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Reasoning Trace</span>
              <div className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                <InfoCircle className="h-3 w-3 mr-1" />
                <span>This is the reasoning trace that explains the AI review comment</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md bg-black p-4 max-h-[600px] overflow-y-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap text-white">
                <span className="text-green-400">{"// AI's reasoning process\n"}</span>
                <span className="text-blue-400">{"function"}</span>
                <span className="text-yellow-400">{" analyzeCodeChange"}</span>
                <span className="text-white">{"() {\n"}</span>
                {chainOfThought.split("\n").map((line, index) => {
                  // Add some color variations to make the text more engaging
                  if (line.match(/^[0-9]+\./)) {
                    // Numbered points
                    return <span key={index} className="text-yellow-300">{`  ${line}\n`}</span>
                  } else if (line.includes(":")) {
                    // Lines with colons (often key-value pairs or section headers)
                    const [part1, ...rest] = line.split(":")
                    return (
                      <span key={index}>
                        <span className="text-pink-400">{`  ${part1}`}</span>
                        <span className="text-white">{`:${rest.join(":")}\n`}</span>
                      </span>
                    )
                  } else if (line.match(/^-/)) {
                    // Bullet points
                    return <span key={index} className="text-cyan-300">{`  ${line}\n`}</span>
                  } else if (line.includes("`")) {
                    // Lines with code snippets
                    return <span key={index} className="text-orange-400">{`  ${line}\n`}</span>
                  } else {
                    // Regular text
                    return <span key={index} className="text-gray-300">{`  ${line}\n`}</span>
                  }
                })}
                <span className="text-white">{"}"}</span>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
