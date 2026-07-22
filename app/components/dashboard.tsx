// app/components/Dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import CategoryForm from "./forms/CategoryForm";
import EducationForm from "./forms/EducationForm";
import ExperienceForm from "./forms/ExperienceForm";
import LanguagesForm from "./forms/LanguagesForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import { User } from "./forms/types";
import ResumePage from "./resumetemplate1/resume_template1";

const createEmptyUser = (): User => ({
  id: `user_${Date.now()}`,
  personalinformation: { name: "", contact: "", email: "", address: "" },
  aboutmyself: { summary: "" },
  workexperience: [],
  educationhistory: [],
  languages: [],
  skillCategories: [],
  strengths: [],
  portfoliolink: "",
});

export default function Dashboard() {
  const [dbUsers, setDbUsers] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/db")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.resumeusers)) {
          setDbUsers(data.resumeusers);
          if (data.resumeusers.length > 0)
            setActiveUser(JSON.parse(JSON.stringify(data.resumeusers[0])));
        }
      })
      .catch(() => setDbUsers([]));
  }, []);

  const handleSelectUser = (id: string) => {
    const user = dbUsers.find((u) => u.id === id);
    if (user) {
      setActiveUser(JSON.parse(JSON.stringify(user)));
      setViewMode("edit");
    }
  };

  const handleAddUser = () => {
    setActiveUser(createEmptyUser());
    setViewMode("edit");
  };

  const handleDeleteUser = async () => {
    if (!activeUser) return;

    // Confirmation prompt to prevent accidental deletes
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${activeUser.personalinformation.name || "this user"}? This cannot be undone.`,
    );
    if (!confirmDelete) return;

    const updatedDbUsers = dbUsers.filter((u) => u.id !== activeUser.id);
    setDbUsers(updatedDbUsers);
    setIsSaving(true);

    // Save updated list to db.json
    await fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeusers: updatedDbUsers }),
    });

    setIsSaving(false);

    // Load the next available user, or set to null if empty
    if (updatedDbUsers.length > 0) {
      setActiveUser(JSON.parse(JSON.stringify(updatedDbUsers[0])));
    } else {
      setActiveUser(null);
    }
    setViewMode("edit");
  };

  const updateField = (path: string, value: any) => {
    setActiveUser((prev) => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addArrayItem = (arrayPath: string, newItem: any) => {
    setActiveUser((prev) => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = arrayPath.split(".");
      let current = newData;
      for (let i = 0; i < keys.length; i++) current = current[keys[i]];
      current.push(newItem);
      return newData;
    });
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    setActiveUser((prev) => {
      if (!prev) return prev;
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = arrayPath.split(".");
      let current = newData;
      for (let i = 0; i < keys.length; i++) current = current[keys[i]];
      current.splice(index, 1);
      return newData;
    });
  };

  const handleSubmit = async () => {
    if (!activeUser) return;
    const exists = dbUsers.some((u) => u.id === activeUser.id);
    const updatedDbUsers = exists
      ? dbUsers.map((u) => (u.id === activeUser.id ? activeUser : u))
      : [...dbUsers, activeUser];

    setDbUsers(updatedDbUsers);
    setIsSaving(true);

    await fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeusers: updatedDbUsers }),
    });

    setIsSaving(false);
    setViewMode("preview");
  };

  // PREVIEW MODE
  if (viewMode === "preview" && activeUser) {
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col items-center py-10 print:py-0 print:bg-white">
        <div className="mb-6 print:hidden w-full max-w-4xl flex justify-center px-4">
          <button
            onClick={() => setViewMode("edit")}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all"
          >
            Back to Edit
          </button>
        </div>
        <div className="w-full max-w-4xl">
          <ResumePage userData={activeUser} />
        </div>
      </div>
    );
  }

  // EDIT MODE
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-purple-950 text-white p-4 md:p-10">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-500">
            Resume Manager
          </h1>
          <div className="flex gap-3 items-center">
            <select
              className="bg-white/5 border border-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg outline-none focus:border-cyan-400/50"
              value={activeUser?.id || ""}
              onChange={(e) => handleSelectUser(e.target.value)}
            >
              {dbUsers.length === 0 && <option value="">No users yet</option>}
              {dbUsers.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-800">
                  {u.personalinformation.name || "Unnamed User"}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium"
            >
              + New User
            </button>

            {activeUser && (
              <button
                onClick={handleDeleteUser}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>
        </header>

        {!activeUser ? (
          <div className="text-center py-20 text-slate-400 bg-white/5 rounded-2xl border border-white/10">
            Select a user or click "+ New User" to begin.
          </div>
        ) : (
          <div>
            <div className="sticky top-4 z-10 flex justify-end mb-6">
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all font-semibold shadow-lg shadow-purple-500/20 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Submit & Preview"}
              </button>
            </div>

            {/* Render the broken-down components */}
            <PersonalInfoForm user={activeUser} updateField={updateField} />
            <ExperienceForm
              user={activeUser}
              updateField={updateField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
            <EducationForm
              user={activeUser}
              updateField={updateField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
            <CategoryForm
              user={activeUser}
              title="Skills"
              arrayPath="skillCategories"
              updateField={updateField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
            <CategoryForm
              user={activeUser}
              title="Strengths"
              arrayPath="strengths"
              updateField={updateField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
            <LanguagesForm
              user={activeUser}
              updateField={updateField}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
            />
          </div>
        )}
      </div>
    </div>
  );
}
