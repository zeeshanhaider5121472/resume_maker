// app/components/forms/AIProcessingScreen.tsx
"use client";
import { useEffect, useState } from "react";
import ResumePage from "../resumetemplate1/resume_template1";
import { User } from "./types";

declare global {
  interface Window {
    puter?: any;
  }
}

interface Props {
  activeUser: User;
  jobDesc: string;
  prompt: string;
  provider: string;
  model: string;
  apiKey?: string;
  onBack: () => void;
  onAccept: (newUser: User) => void;
  onEdit: (newUser: User) => void;
}

export default function AIProcessingScreen({
  activeUser,
  jobDesc,
  prompt,
  provider,
  model,
  apiKey,
  onBack,
  onAccept,
  onEdit,
}: Props) {
  const [status, setStatus] = useState<"loading" | "preview" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [aiUserData, setAiUserData] = useState<User | null>(null);
  const [aiChangesSummary, setAiChangesSummary] = useState<string>("");

  useEffect(() => {
    const generate = async () => {
      try {
        // Construct the full prompt
        const fullPrompt = `${prompt}\n\nJOB DESCRIPTION:\n${jobDesc}\n\nCURRENT RESUME JSON:\n${JSON.stringify(activeUser, null, 2)}\n\nReturn ONLY valid JSON containing "updated_resume" and "changes_summary".`;

        let responseContent = "";

        if (provider === "puter") {
          if (!window.puter) throw new Error("Puter.js not loaded");
          const resp = await window.puter.ai.chat(fullPrompt, { model: model });
          responseContent =
            typeof resp === "string" ? resp : resp.message.content;
        } else {
          const res = await fetch("/api/nvidia", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ apiKey, model, prompt: fullPrompt }),
          });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Failed to get response from Nvidia");
          }
          const data = await res.json();
          responseContent = data.content;
        }

        // Clean up markdown code blocks if AI added them
        let cleanJson = responseContent;
        if (cleanJson.startsWith("```json")) cleanJson = cleanJson.slice(7);
        if (cleanJson.startsWith("```")) cleanJson = cleanJson.slice(3);
        if (cleanJson.endsWith("```")) cleanJson = cleanJson.slice(0, -3);

        const parsedResponse = JSON.parse(cleanJson.trim());

        // Extract data from the new wrapper format
        if (parsedResponse.updated_resume) {
          setAiUserData(parsedResponse.updated_resume);
          setAiChangesSummary(
            parsedResponse.changes_summary || "No summary provided by AI.",
          );
        } else {
          // Fallback just in case the AI returned the raw resume without the wrapper
          setAiUserData(parsedResponse);
          setAiChangesSummary("AI returned raw resume data without a summary.");
        }

        setStatus("preview");
      } catch (error: any) {
        console.error(error);
        setErrorMsg(error.message || "Failed to generate AI resume");
        setStatus("error");
      }
    };

    generate();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold mb-2">Upgrading your resume...</h2>
        <p className="text-slate-400">
          Using {model} via {provider}. This may take a moment.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold text-red-400 mb-4">
          Something went wrong
        </h2>
        <p className="text-slate-400 mb-6 text-center max-w-md">{errorMsg}</p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-700 rounded-lg hover:bg-slate-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  // PREVIEW STATE
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center py-10">
      <div className="mb-6 w-full max-w-4xl flex justify-center gap-4 px-4 flex-wrap">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
        >
          Reject
        </button>
        <button
          onClick={() => aiUserData && onEdit(aiUserData)}
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition-all"
        >
          Edit
        </button>
        <button
          onClick={() => aiUserData && onAccept(aiUserData)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all"
        >
          Accept
        </button>
      </div>

      {/* AI CHANGES SUMMARY CARD */}
      {aiChangesSummary && (
        <div className="w-full max-w-4xl mb-6 bg-white border-l-4 border-cyan-500 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            ✨ What Changed & Why
          </h3>
          <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
            {aiChangesSummary}
          </p>
        </div>
      )}

      {aiUserData && (
        <div className="w-full max-w-4xl">
          <ResumePage userData={aiUserData} />
        </div>
      )}
    </div>
  );
}
