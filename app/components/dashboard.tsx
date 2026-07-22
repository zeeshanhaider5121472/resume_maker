// app/components/Dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import AIInputScreen from "./forms/AIInputScreen";
import AIProcessingScreen from "./forms/AIProcessingScreen";
import CategoryForm from "./forms/CategoryForm";
import EducationForm from "./forms/EducationForm";
import ExperienceForm from "./forms/ExperienceForm";
import LanguagesForm from "./forms/LanguagesForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import { User } from "./forms/types";
import ResumePage from "./resumetemplate1/resume_template1";

const createEmptyUser = (): User => ({
  id: `user_${Date.now()}`,
  filename: "",
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
  const [originalId, setOriginalId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<
    "edit" | "preview" | "ai_input" | "ai_processing"
  >("edit");
  const [isSaving, setIsSaving] = useState(false);

  const [aiConfig, setAiConfig] = useState<{
    jobDesc: string;
    prompt: string;
    provider: string;
    model: string;
    apiKey?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/db")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.resumeusers)) {
          setDbUsers(data.resumeusers);
          if (data.resumeusers.length > 0) {
            const firstUser = data.resumeusers[0];
            setActiveUser(JSON.parse(JSON.stringify(firstUser)));
            setOriginalId(firstUser.id); // <-- Set original ID
          }
        }
      })
      .catch(() => setDbUsers([]));
  }, []);

  const handleSelectUser = (id: string) => {
    const user = dbUsers.find((u) => u.id === id);
    if (user) {
      setActiveUser(JSON.parse(JSON.stringify(user)));
      setOriginalId(user.id); // <-- Set original ID
      setViewMode("edit");
    }
  };

  const handleAddUser = () => {
    const newUser = createEmptyUser();
    setActiveUser(newUser);
    setOriginalId(null); // <-- New user has no original ID
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

  const handleDeleteUser = async () => {
    if (!activeUser) return;
    const confirmDelete = window.confirm(`Delete user ID: ${activeUser.id}?`);
    if (!confirmDelete) return;

    // Use originalId to ensure we delete the right user even if ID field was changed
    const updatedDbUsers = dbUsers.filter(
      (u) => u.id !== (originalId || activeUser.id),
    );
    setDbUsers(updatedDbUsers);
    setIsSaving(true);
    await fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeusers: updatedDbUsers }),
    });
    setIsSaving(false);

    if (updatedDbUsers.length > 0) {
      setActiveUser(JSON.parse(JSON.stringify(updatedDbUsers[0])));
      setOriginalId(updatedDbUsers[0].id);
    } else {
      setActiveUser(null);
      setOriginalId(null);
    }
    setViewMode("edit");
  };

  const handleSubmit = async () => {
    if (!activeUser) return;

    // Map through users. If the original ID matches, replace it with the new activeUser data.
    // If it doesn't match any original ID, it's a new user, so add it to the end.
    let updatedDbUsers;
    const exists = dbUsers.some((u) => u.id === originalId);

    if (exists) {
      updatedDbUsers = dbUsers.map((u) =>
        u.id === originalId ? activeUser : u,
      );
    } else {
      updatedDbUsers = [...dbUsers, activeUser];
    }

    setDbUsers(updatedDbUsers);
    setOriginalId(activeUser.id); // Update originalId to the new ID
    setIsSaving(true);
    await fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeusers: updatedDbUsers }),
    });
    setIsSaving(false);
    setViewMode("preview");
  };

  const handleAIGenerate = (
    jobDesc: string,
    prompt: string,
    provider: string,
    model: string,
    apiKey?: string,
  ) => {
    setAiConfig({ jobDesc, prompt, provider, model, apiKey });
    setViewMode("ai_processing");
  };

  const handleAcceptAI = async (newUser: User) => {
    setActiveUser(newUser);
    setViewMode("edit");
    setIsSaving(true);

    let updatedDbUsers;
    if (dbUsers.some((u) => u.id === originalId)) {
      updatedDbUsers = dbUsers.map((u) => (u.id === originalId ? newUser : u));
    } else {
      updatedDbUsers = [...dbUsers, newUser];
    }
    await fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeusers: updatedDbUsers }),
    });
    setIsSaving(false);
    setDbUsers(updatedDbUsers);
    alert("AI Resume Accepted & Saved!");
  };

  const handleEditAI = (newUser: User) => {
    setActiveUser(newUser);
    setViewMode("edit");
  };

  if (viewMode === "ai_processing" && activeUser && aiConfig) {
    return (
      <AIProcessingScreen
        activeUser={activeUser}
        jobDesc={aiConfig.jobDesc}
        prompt={aiConfig.prompt}
        provider={aiConfig.provider}
        model={aiConfig.model}
        apiKey={aiConfig.apiKey}
        onBack={() => setViewMode("ai_input")}
        onAccept={handleAcceptAI}
        onEdit={handleEditAI}
      />
    );
  }

  if (viewMode === "ai_input" && activeUser) {
    return (
      <AIInputScreen
        activeUser={activeUser}
        onBack={() => setViewMode("edit")}
        onGenerate={handleAIGenerate}
      />
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white p-4 md:p-10">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Resume Manager
          </h1>
          <div className="flex gap-3 items-center flex-wrap">
            <select
              className="bg-white/5 border border-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg outline-none focus:border-cyan-400/50"
              value={originalId || ""}
              onChange={(e) => handleSelectUser(e.target.value)}
            >
              {dbUsers.length === 0 && <option value="">No users yet</option>}
              {dbUsers.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-800">
                  {u.id} {/* <-- Changed to show ID instead of Name */}
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
            <div className="sticky top-4 z-10 flex justify-end mb-6 gap-3">
              <button
                onClick={() => setViewMode("ai_input")}
                className="px-6 py-3 rounded-xl bg-white/5 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/10 transition-all font-semibold backdrop-blur-md"
              >
                Upgrade with AI ✨
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all font-semibold shadow-lg shadow-purple-500/20 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Submit & Preview"}
              </button>
            </div>

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
