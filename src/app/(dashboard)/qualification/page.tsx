import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { QualificationQuestionList, BotBehaviorPicker } from "@/features/qualification/qualification-flow";
import { mockQualificationConfig } from "@/lib/api/mock-data";
export default function QualificationPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 md:px-10 py-6 md:py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-[28px] text-ink">Qualification</h1>
        <p className="text-sub mt-1">Ask customers a few questions before handing them to you.</p>
      </div>
      <Card className="p-5 md:p-6 mb-6"><CardTitle className="mb-4">Questions</CardTitle><QualificationQuestionList initialQuestions={mockQualificationConfig.questions} /></Card>
      <Card className="p-5 md:p-6 mb-6">
        <CardTitle className="mb-1">Bot behavior</CardTitle>
        <p className="text-sm text-sub mb-4">Choose what happens once a customer finishes answering.</p>
        <BotBehaviorPicker initial={mockQualificationConfig.behavior} />
      </Card>
      <Button className="w-full sm:w-auto">Save</Button>
    </div>
  );
}
