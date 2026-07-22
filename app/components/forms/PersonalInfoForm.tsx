// app/components/forms/PersonalInfoForm.tsx
import { User } from "./types";
import { FormInput, FormTextarea, GlassCard } from "./ui";

export default function PersonalInfoForm({
  user,
  updateField,
}: { user: User } & { updateField: (path: string, value: any) => void }) {
  return (
    <>
      <GlassCard title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Name"
            value={user.personalinformation.name}
            onChange={(v) => updateField("personalinformation.name", v)}
          />
          <FormInput
            label="Email"
            value={user.personalinformation.email}
            onChange={(v) => updateField("personalinformation.email", v)}
          />
          <FormInput
            label="Contact"
            value={user.personalinformation.contact}
            onChange={(v) => updateField("personalinformation.contact", v)}
          />
          <FormInput
            label="Address"
            value={user.personalinformation.address}
            onChange={(v) => updateField("personalinformation.address", v)}
          />
        </div>
      </GlassCard>

      <GlassCard title="Profile">
        <div className="space-y-4">
          <FormTextarea
            label="About Myself"
            value={user.aboutmyself.summary}
            onChange={(v) => updateField("aboutmyself.summary", v)}
          />
          <FormInput
            label="Portfolio Link"
            value={user.portfoliolink}
            onChange={(v) => updateField("portfoliolink", v)}
          />
        </div>
      </GlassCard>
    </>
  );
}
