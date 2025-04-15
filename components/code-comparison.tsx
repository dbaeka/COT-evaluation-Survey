import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CodeComparisonProps {
  snippetA: string
  snippetB: string
}

export function CodeComparison({ snippetA, snippetB }: CodeComparisonProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Code Snippet A</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-slate-950 p-4">
            <code className="text-sm font-mono text-slate-50 whitespace-pre">{snippetA}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Code Snippet B</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-slate-950 p-4">
            <code className="text-sm font-mono text-slate-50 whitespace-pre">{snippetB}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
