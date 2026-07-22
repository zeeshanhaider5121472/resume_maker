// app/components/forms/AIInputScreen.tsx
"use client";
import { useEffect, useState } from "react";
import { User } from "./types";

interface Props {
  activeUser: User;
  onBack: () => void;
  onGenerate: (
    jobDesc: string,
    prompt: string,
    provider: string,
    model: string,
    apiKey?: string,
  ) => void;
}

const DEFAULT_PROMPT = `
I have uploaded my resume in JSON format and a job description. I need you to optimize my resume profile section to align with the job description and pass ATS (Applicant Tracking System) screening at the highest possible success rate.

**Critical requirements:**

1. **Preserve the JSON schema exactly.** Return the response in the identical JSON structure I provided—do not alter, rename, or restructure any fields. Only modify the content within existing fields.

2. **Match the job description comprehensively.** Extract and incorporate every relevant keyword, required skill, competency, and qualification from the job description into my profile. Use the exact language and terminology the job posting uses for technical skills, industry standards, and role-specific competencies. Ensure critical keywords appear naturally throughout the profile text—this is essential for ATS parsing and keyword matching.

3. **Optimize for ATS keyword recognition.** Use clear, direct language without special characters, symbols, or formatting that breaks ATS parsing. Include industry-standard terminology and acronyms exactly as they appear in the job description. Prioritize incorporating all hard-requirement keywords and skills that ATS systems scan for. The profile should read naturally while maximizing keyword density and relevance signals.

4. **Humanize the language.** Write the profile in natural, conversational English that reads as genuinely written by a person—not as AI-generated text. Vary sentence structure, use active voice appropriately, and avoid robotic phrasing or obvious AI patterns. The writing should feel authentic and professional.

5. **Maintain authenticity.** Do not fabricate experience, skills, or achievements. Reframe and reorganize my existing qualifications to highlight their relevance to this specific role, but keep all claims truthful.

Return only the updated JSON with the optimized profile section. Show no working, no explanations, and no text outside the JSON structure.`;

export default function AIInputScreen({
  activeUser,
  onBack,
  onGenerate,
}: Props) {
  const [jobDesc, setJobDesc] = useState("");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [provider, setProvider] = useState<"puter" | "nvidia">("puter");

  // Provider states
  const [puterModel, setPuterModel] = useState("gpt-4o");
  const [nvidiaModel, setNvidiaModel] = useState(
    "meta/llama-3.1-405b-instruct",
  );
  const [nvidiaApiKey, setNvidiaApiKey] = useState("");

  // UI states
  const [puterLoggedIn, setPuterLoggedIn] = useState(false);
  const [confirmedModel, setConfirmedModel] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    // Load saved Nvidia API key
    const savedKey = localStorage.getItem("nvidia_api_key");
    if (savedKey) {
      setNvidiaApiKey(savedKey);
      setShowApiKeyInput(false);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  const handlePuterLogin = async () => {
    if (typeof window !== "undefined" && window.puter) {
      try {
        await window.puter.auth.signIn();
        setPuterLoggedIn(true);
        alert("Logged in to Puter successfully!");
      } catch (err) {
        alert("Puter login failed.");
      }
    }
  };

  const handleSaveNvidiaKey = () => {
    if (nvidiaApiKey) {
      localStorage.setItem("nvidia_api_key", nvidiaApiKey);
      setShowApiKeyInput(false);
      alert("Nvidia API Key saved!");
    }
  };

  const handleDeleteNvidiaKey = () => {
    localStorage.removeItem("nvidia_api_key");
    setNvidiaApiKey("");
    setShowApiKeyInput(true);
  };

  const handleConfirmModel = () => {
    if (provider === "puter" && !puterLoggedIn)
      return alert("Please login to Puter first.");
    if (provider === "nvidia" && !nvidiaApiKey)
      return alert("Please add your Nvidia API key first.");

    const selectedModel = provider === "puter" ? puterModel : nvidiaModel;
    setConfirmedModel(selectedModel);
    alert(`${selectedModel} confirmed!`);
  };

  const handleGenerateClick = () => {
    if (!confirmedModel)
      return alert(
        "Please select an AI, configure it, and click 'Done' to confirm the model.",
      );
    onGenerate(
      jobDesc,
      prompt,
      provider,
      confirmedModel,
      provider === "nvidia" ? nvidiaApiKey : undefined,
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-purple-950 text-white p-4 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        {/* SIDE MENU */}
        <div className="md:w-1/4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4">Select AI</h3>
          <select
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mb-4 outline-none"
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value as any);
              setConfirmedModel("");
            }}
          >
            <option value="puter" className="bg-slate-800">
              Puter.js (Free)
            </option>
            <option value="nvidia" className="bg-slate-800">
              Nvidia NIM
            </option>
          </select>

          {provider === "puter" ? (
            <div className="space-y-3">
              <button
                onClick={handlePuterLogin}
                className="w-full px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-all text-sm"
              >
                {puterLoggedIn ? "✓ Logged In" : "Login to Puter"}
              </button>

              {/* PUTER MODELS DROPDOWN */}
              <select
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none"
                value={puterModel}
                onChange={(e) => {
                  setPuterModel(e.target.value);
                  setConfirmedModel("");
                }}
              >
                <optgroup label="⭐ Flagship Models" className="bg-slate-800">
                  <option value="gpt-4o" className="bg-slate-800">
                    OpenAI - GPT-4o
                  </option>
                  <option value="claude-3-5-sonnet" className="bg-slate-800">
                    Anthropic - Claude 3.5 Sonnet
                  </option>
                  <option value="gemini-1.5-pro" className="bg-slate-800">
                    Google - Gemini 1.5 Pro
                  </option>
                  <option value="grok-beta" className="bg-slate-800">
                    xAI - Grok Beta
                  </option>
                </optgroup>

                <optgroup label="OpenAI" className="bg-slate-800">
                  <option value="gpt-4-turbo" className="bg-slate-800">
                    GPT-4 Turbo
                  </option>
                  <option value="gpt-4o-mini" className="bg-slate-800">
                    GPT-4o Mini
                  </option>
                  <option value="gpt-3.5-turbo" className="bg-slate-800">
                    GPT-3.5 Turbo
                  </option>
                </optgroup>

                <optgroup label="Anthropic (Claude)" className="bg-slate-800">
                  <option value="claude-3-opus" className="bg-slate-800">
                    Claude 3 Opus
                  </option>
                  <option value="claude-3-sonnet" className="bg-slate-800">
                    Claude 3 Sonnet
                  </option>
                  <option value="claude-3-haiku" className="bg-slate-800">
                    Claude 3 Haiku
                  </option>
                </optgroup>

                <optgroup label="Google (Gemini)" className="bg-slate-800">
                  <option value="gemini-1.5-flash" className="bg-slate-800">
                    Gemini 1.5 Flash
                  </option>
                  <option value="gemini-1.0-pro" className="bg-slate-800">
                    Gemini 1.0 Pro
                  </option>
                </optgroup>

                <optgroup label="Meta (Llama)" className="bg-slate-800">
                  <option
                    value="meta-llama/llama-3.1-405b-instruct"
                    className="bg-slate-800"
                  >
                    Llama 3.1 405B
                  </option>
                  <option
                    value="meta-llama/llama-3.1-70b-instruct"
                    className="bg-slate-800"
                  >
                    Llama 3.1 70B
                  </option>
                  <option
                    value="meta-llama/llama-3.1-8b-instruct"
                    className="bg-slate-800"
                  >
                    Llama 3.1 8B
                  </option>
                </optgroup>

                <optgroup label="Mistral" className="bg-slate-800">
                  <option value="mistral-large-latest" className="bg-slate-800">
                    Mistral Large
                  </option>
                  <option value="open-mixtral-8x22b" className="bg-slate-800">
                    Mixtral 8x22B
                  </option>
                  <option value="open-mistral-7b" className="bg-slate-800">
                    Mistral 7B
                  </option>
                </optgroup>

                <optgroup label="DeepSeek" className="bg-slate-800">
                  <option value="deepseek-chat" className="bg-slate-800">
                    DeepSeek Coder
                  </option>
                  <option value="deepseek-coder" className="bg-slate-800">
                    DeepSeek 33B
                  </option>
                </optgroup>

                <optgroup label="Qwen" className="bg-slate-800">
                  <option
                    value="qwen/qwen2.5-72b-instruct"
                    className="bg-slate-800"
                  >
                    Qwen 2.5 72B
                  </option>
                  <option
                    value="qwen/qwen2.5-coder-32b-instruct"
                    className="bg-slate-800"
                  >
                    Qwen 2.5 Coder 32B
                  </option>
                </optgroup>

                <optgroup label="Z.AI (GLM)" className="bg-slate-800">
                  <option value="glm-4-plus" className="bg-slate-800">
                    GLM-4-Plus
                  </option>
                  <option value="glm-4" className="bg-slate-800">
                    GLM-4
                  </option>
                </optgroup>

                <optgroup label="Moonshot AI (Kimi)" className="bg-slate-800">
                  <option value="moonshot-v1-128k" className="bg-slate-800">
                    Kimi v1 128k
                  </option>
                  <option value="moonshot-v1-32k" className="bg-slate-800">
                    Kimi v1 32k
                  </option>
                </optgroup>

                <optgroup label="Google (Gemma)" className="bg-slate-800">
                  <option
                    value="google/gemma-2-27b-it"
                    className="bg-slate-800"
                  >
                    Gemma 2 27B
                  </option>
                  <option value="google/gemma-2-9b-it" className="bg-slate-800">
                    Gemma 2 9B
                  </option>
                </optgroup>

                <optgroup label="Microsoft (Phi)" className="bg-slate-800">
                  <option
                    value="microsoft/phi-3.5-mini-128k-instruct"
                    className="bg-slate-800"
                  >
                    Phi 3.5 Mini
                  </option>
                  <option
                    value="microsoft/phi-3-medium-4k-instruct"
                    className="bg-slate-800"
                  >
                    Phi 3 Medium
                  </option>
                </optgroup>
              </select>
            </div>
          ) : (
            <div className="space-y-3">
              {!showApiKeyInput ? (
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-300 rounded-lg text-xs flex items-center">
                    API Key Saved
                  </div>
                  <button
                    onClick={handleDeleteNvidiaKey}
                    className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-xs"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="password"
                    placeholder="Enter Nvidia API Key"
                    value={nvidiaApiKey}
                    onChange={(e) => setNvidiaApiKey(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mb-2 text-sm outline-none"
                  />
                  <button
                    onClick={handleSaveNvidiaKey}
                    className="w-full px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-all text-sm"
                  >
                    Save Key
                  </button>
                </div>
              )}

              {/* NVIDIA MODELS DROPDOWN */}
              <select
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none"
                value={nvidiaModel}
                onChange={(e) => {
                  setNvidiaModel(e.target.value);
                  setConfirmedModel("");
                }}
              >
                <optgroup label="⭐ Top Recommended" className="bg-slate-800">
                  <option
                    value="meta/llama-3.1-405b-instruct"
                    className="bg-slate-800"
                  >
                    Meta - Llama 3.1 405B
                  </option>
                  <option
                    value="nvidia/llama-3.1-nemotron-70b-instruct"
                    className="bg-slate-800"
                  >
                    Nvidia - Llama 3.1 Nemotron 70B
                  </option>
                  <option
                    value="mistralai/mixtral-8x22b-instruct-v0.1"
                    className="bg-slate-800"
                  >
                    Mistral - Mixtral 8x22B
                  </option>
                </optgroup>

                <optgroup label="Nvidia" className="bg-slate-800">
                  <option
                    value="nvidia/nemotron-4-340b-instruct"
                    className="bg-slate-800"
                  >
                    Nemotron 4 340B
                  </option>
                  <option
                    value="nvidia/llama-3.1-nemotron-51b-instruct"
                    className="bg-slate-800"
                  >
                    Nemotron 51B
                  </option>
                </optgroup>

                <optgroup label="Meta (Llama)" className="bg-slate-800">
                  <option
                    value="meta/llama-3.1-70b-instruct"
                    className="bg-slate-800"
                  >
                    Llama 3.1 70B
                  </option>
                  <option
                    value="meta/llama-3.1-8b-instruct"
                    className="bg-slate-800"
                  >
                    Llama 3.1 8B
                  </option>
                  <option
                    value="meta/llama-3.2-3b-instruct"
                    className="bg-slate-800"
                  >
                    Llama 3.2 3B
                  </option>
                  <option
                    value="meta/llama-3.2-1b-instruct"
                    className="bg-slate-800"
                  >
                    Llama 3.2 1B
                  </option>
                </optgroup>

                <optgroup label="Mistral" className="bg-slate-800">
                  <option
                    value="mistralai/mistral-7b-instruct-v0.3"
                    className="bg-slate-800"
                  >
                    Mistral 7B Instruct
                  </option>
                  <option
                    value="mistralai/mixtral-8x7b-instruct-v0.1"
                    className="bg-slate-800"
                  >
                    Mixtral 8x7B
                  </option>
                  <option
                    value="mistralai/mamba-codestral-7b-v0.1"
                    className="bg-slate-800"
                  >
                    Mamba Codestral 7B
                  </option>
                </optgroup>

                <optgroup label="Google (Gemma)" className="bg-slate-800">
                  <option
                    value="google/gemma-2-27b-it"
                    className="bg-slate-800"
                  >
                    Gemma 2 27B
                  </option>
                  <option value="google/gemma-2-9b-it" className="bg-slate-800">
                    Gemma 2 9B
                  </option>
                  <option value="google/gemma-2-2b-it" className="bg-slate-800">
                    Gemma 2 2B
                  </option>
                </optgroup>

                <optgroup label="Microsoft (Phi)" className="bg-slate-800">
                  <option
                    value="microsoft/phi-3.5-mini-instruct"
                    className="bg-slate-800"
                  >
                    Phi 3.5 Mini
                  </option>
                  <option
                    value="microsoft/phi-3.5-moe-instruct"
                    className="bg-slate-800"
                  >
                    Phi 3.5 MoE
                  </option>
                  <option
                    value="microsoft/phi-3-medium-4k-instruct"
                    className="bg-slate-800"
                  >
                    Phi 3 Medium
                  </option>
                </optgroup>

                <optgroup label="Qwen" className="bg-slate-800">
                  <option
                    value="qwen/qwen2.5-7b-instruct"
                    className="bg-slate-800"
                  >
                    Qwen 2.5 7B
                  </option>
                  <option
                    value="qwen/qwen2.5-coder-7b-instruct"
                    className="bg-slate-800"
                  >
                    Qwen 2.5 Coder 7B
                  </option>
                  <option
                    value="qwen/qwen2-7b-instruct"
                    className="bg-slate-800"
                  >
                    Qwen 2 7B
                  </option>
                </optgroup>
              </select>
            </div>
          )}

          <button
            onClick={handleConfirmModel}
            className="w-full mt-4 px-4 py-2 bg-linear-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all font-semibold rounded-lg shadow-lg text-sm"
          >
            Done
          </button>
          {confirmedModel && (
            <p className="text-xs text-center text-green-400 mt-2">
              Ready: {confirmedModel}
            </p>
          )}
        </div>

        {/* MAIN AREA */}
        <div className="md:w-3/4 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Upgrade with AI ✨</h2>
            <button
              onClick={onBack}
              className="text-slate-400 hover:text-white text-sm"
            >
              ← Back to Edit
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4">
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
              1. Current Resume JSON
            </label>
            <textarea
              readOnly
              value={JSON.stringify(activeUser, null, 2)}
              className="w-full h-48 bg-black/20 rounded-lg p-3 text-xs text-slate-400 font-mono resize-none outline-none"
            />
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4">
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
              2. Job Description
            </label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-48 bg-black/20 rounded-lg p-3 text-white text-sm resize-none outline-none focus:border-cyan-400/50 border border-white/10"
            />
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4">
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
              3. AI Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-48 bg-black/20 rounded-lg p-3 text-white text-sm resize-none outline-none focus:border-cyan-400/50 border border-white/10"
            />
          </div>

          <button
            onClick={handleGenerateClick}
            className="px-8 py-4 rounded-xl bg-linear-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all font-bold shadow-lg shadow-purple-500/20"
          >
            Generate AI Resume
          </button>
        </div>
      </div>
    </div>
  );
}
