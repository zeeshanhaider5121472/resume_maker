// app/components/forms/EducationForm.tsx
import { FormProps, User } from "./types";
import { FormInput, GlassCard } from "./ui";

export default function EducationForm({
  user,
  updateField,
  addArrayItem,
  removeArrayItem,
}: { user: User } & FormProps) {
  return (
    <GlassCard
      title="Education"
      action={
        <button
          onClick={() =>
            addArrayItem("educationhistory", {
              name: "",
              location: "",
              degree: "",
              cgpa: "",
            })
          }
          className="text-sm text-cyan-400 hover:text-cyan-300 font-medium"
        >
          + Add Education
        </button>
      }
    >
      <div className="space-y-4">
        {user.educationhistory.map((edu, i) => (
          <div
            key={i}
            className="p-4 bg-black/20 rounded-xl border border-white/5 relative"
          >
            <button
              onClick={() => removeArrayItem("educationhistory", i)}
              className="absolute top-3 right-3 text-xs text-red-400 hover:text-red-300"
            >
              Remove
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormInput
                label="Institution"
                value={edu.name}
                onChange={(v) => updateField(`educationhistory.${i}.name`, v)}
              />
              <FormInput
                label="Location"
                value={edu.location}
                onChange={(v) =>
                  updateField(`educationhistory.${i}.location`, v)
                }
              />
              <FormInput
                label="Degree"
                value={edu.degree}
                onChange={(v) => updateField(`educationhistory.${i}.degree`, v)}
              />

              {/* FIX: Regex strips out anything that isn't a number or a dot */}
              <FormInput
                label="CGPA"
                value={edu.cgpa}
                onChange={(v) =>
                  updateField(
                    `educationhistory.${i}.cgpa`,
                    v.replace(/[^0-9.]/g, ""),
                  )
                }
              />
            </div>
          </div>
        ))}
        {user.educationhistory.length === 0 && (
          <p className="text-sm text-slate-500">No education added.</p>
        )}
      </div>
    </GlassCard>
  );
}
