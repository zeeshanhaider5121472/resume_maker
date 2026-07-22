// app/components/forms/ExperienceForm.tsx
import { FormProps, User } from "./types";
import { FormInput, FormTextarea, GlassCard } from "./ui";

export default function ExperienceForm({
  user,
  updateField,
  addArrayItem,
  removeArrayItem,
}: { user: User } & FormProps) {
  return (
    <GlassCard
      title="Work Experience"
      action={
        <button
          onClick={() =>
            addArrayItem("workexperience", {
              company: "",
              role: "",
              duration: "",
              location: "",
              responsibilities: [],
            })
          }
          className="text-sm text-cyan-400 hover:text-cyan-300 font-medium"
        >
          + Add Experience
        </button>
      }
    >
      <div className="space-y-4">
        {user.workexperience.map((exp, i) => (
          <div
            key={i}
            className="p-4 bg-black/20 rounded-xl border border-white/5 relative"
          >
            <button
              onClick={() => removeArrayItem("workexperience", i)}
              className="absolute top-3 right-3 text-xs text-red-400 hover:text-red-300"
            >
              Remove
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <FormInput
                label="Company"
                value={exp.company}
                onChange={(v) => updateField(`workexperience.${i}.company`, v)}
              />
              <FormInput
                label="Role"
                value={exp.role}
                onChange={(v) => updateField(`workexperience.${i}.role`, v)}
              />
              <FormInput
                label="Duration"
                value={exp.duration}
                onChange={(v) => updateField(`workexperience.${i}.duration`, v)}
              />
              <FormInput
                label="Location"
                value={exp.location}
                onChange={(v) => updateField(`workexperience.${i}.location`, v)}
              />
            </div>
            <FormTextarea
              label="Responsibilities (One per line)"
              value={exp.responsibilities.join("\n")}
              onChange={(v) =>
                updateField(
                  `workexperience.${i}.responsibilities`,
                  v.split("\n"),
                )
              }
            />
          </div>
        ))}
        {user.workexperience.length === 0 && (
          <p className="text-sm text-slate-500">No experience added.</p>
        )}
      </div>
    </GlassCard>
  );
}
