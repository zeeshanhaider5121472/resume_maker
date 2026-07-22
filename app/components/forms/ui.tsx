// app/components/forms/ui.tsx
import React, { useEffect, useState } from "react";

export const GlassCard = ({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-white tracking-wide">
        {title}
      </h2>
      {action}
    </div>
    {children}
  </div>
);

export const FormInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <div>
    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
      {label}
    </label>
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:border-cyan-400/50 transition-all"
    />
  </div>
);

export const FormTextarea = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <div>
    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
      {label}
    </label>
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:border-cyan-400/50 transition-all h-24 resize-none"
    />
  </div>
);

// NEW: Component for comma-separated arrays.
// It uses local state so typing spaces/commas works smoothly,
// and only updates the database when the user clicks away (onBlur).
export const ArrayInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (arr: string[]) => void;
}) => {
  const [text, setText] = useState(value.join(", "));

  // Sync local text if the array changes externally (e.g. user loaded)
  useEffect(() => {
    setText(value.join(", "));
  }, [value]);

  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
        {label}
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:border-cyan-400/50 transition-all h-20 resize-none"
      />
    </div>
  );
};
