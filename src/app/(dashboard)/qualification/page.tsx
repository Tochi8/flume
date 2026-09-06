import { QualificationEditor } from "@/features/qualification/qualification-editor";
import { requireSession } from "@/lib/auth/session";
import { getQualificationConfig } from "../../../../lib/store.js";

export const dynamic = "force-dynamic";

export default async function QualificationPage() {
  const { tenantId } = await requireSession();
  const config = await getQualificationConfig(tenantId);
  return (
    <div className="max-w-2xl mx-auto px-5 md:px-10 py-6 md:py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-[28px] text-ink">Qualification</h1>
        <p className="text-sub mt-1">Ask customers a few questions before handing them to you.</p>
      </div>
      <QualificationEditor initial={config} />
    </div>
  );
}
