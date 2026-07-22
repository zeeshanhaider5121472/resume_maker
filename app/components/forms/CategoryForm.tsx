// app/components/forms/CategoryForm.tsx
import { FormProps, User } from "./types";
import { ArrayInput, FormInput, GlassCard } from "./ui"; // <-- Imported ArrayInput

interface Props extends FormProps {
  user: User;
  title: string;
  arrayPath: "skillCategories" | "strengths";
}

export default function CategoryForm({
  user,
  title,
  arrayPath,
  updateField,
  addArrayItem,
  removeArrayItem,
}: Props) {
  const items = user[arrayPath];

  return (
    <GlassCard
      title={title}
      action={
        <button
          onClick={() => addArrayItem(arrayPath, { category: "", skills: [] })}
          className="text-sm text-cyan-400 hover:text-cyan-300 font-medium"
        >
          + Add Category
        </button>
      }
    >
      <div className="space-y-4">
        {items.map((cat, i) => (
          <div
            key={i}
            className="p-4 bg-black/20 rounded-xl border border-white/5 relative"
          >
            <button
              onClick={() => removeArrayItem(arrayPath, i)}
              className="absolute top-3 right-3 text-xs text-red-400 hover:text-red-300"
            >
              Remove
            </button>
            <div className="mb-3">
              <FormInput
                label="Category Name"
                value={cat.category}
                onChange={(v) => updateField(`${arrayPath}.${i}.category`, v)}
              />
            </div>
            {/* Replaced FormTextarea with ArrayInput */}
            <ArrayInput
              label="Items (Comma separated)"
              value={cat.skills}
              onChange={(arr) => updateField(`${arrayPath}.${i}.skills`, arr)}
            />
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-slate-500">Nothing added.</p>
        )}
      </div>
    </GlassCard>
  );
}
