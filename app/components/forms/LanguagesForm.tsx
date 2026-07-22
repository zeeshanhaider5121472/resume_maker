// app/components/forms/LanguagesForm.tsx
import { FormProps, User } from "./types";
import { FormInput, GlassCard } from "./ui";

export default function LanguagesForm({
  user,
  updateField,
  addArrayItem,
  removeArrayItem,
}: { user: User } & FormProps) {
  return (
    <GlassCard
      title="Languages"
      action={
        <button
          onClick={() => addArrayItem("languages", { name: "", level: "" })}
          className="text-sm text-cyan-400 hover:text-cyan-300 font-medium"
        >
          + Add Language
        </button>
      }
    >
      <div className="space-y-4">
        {user.languages.map((lang, i) => (
          <div
            key={i}
            className="p-4 bg-black/20 rounded-xl border border-white/5 relative flex gap-3 items-end"
          >
            <button
              onClick={() => removeArrayItem("languages", i)}
              className="absolute top-3 right-3 text-xs text-red-400 hover:text-red-300"
            >
              Remove
            </button>
            <div className="flex-1">
              <FormInput
                label="Language"
                value={lang.name}
                onChange={(v) => updateField(`languages.${i}.name`, v)}
              />
            </div>
            <div className="flex-1">
              <FormInput
                label="Proficiency Level"
                value={lang.level}
                onChange={(v) => updateField(`languages.${i}.level`, v)}
              />
            </div>
          </div>
        ))}
        {user.languages.length === 0 && (
          <p className="text-sm text-slate-500">No languages added.</p>
        )}
      </div>
    </GlassCard>
  );
}
