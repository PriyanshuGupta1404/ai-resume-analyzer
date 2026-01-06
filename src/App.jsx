import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  BrainCircuit,
  Loader2,
  Copy,
  Terminal,
  ChevronRight,
  Target,
  FileEdit,
  Sparkles,
} from "lucide-react";

const App = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const handleTextSubmit = () => {
    if (!resumeText.trim() || resumeText.length < 50) {
      setError(
        "Please paste a more detailed resume content (at least 50 characters)."
      );
      return;
    }
    setError(null);
    setStep(2);
  };

  const analyzeResume = async () => {
    if (!resumeText || !jobDescription) {
      setError("Please provide both your resume and a job description.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    // IMPORTANT: Replace the empty string below with your actual API key from Google AI Studio
    // https://aistudio.google.com/
    const apiKey = "AIzaSyDOW90B8htruAcNxrGFGT3ubrCLlG7Lu3o";

    if (!apiKey) {
      setError(
        "API Key is missing. Please add your Gemini API key to the code (line 39) to run it locally."
      );
      setIsAnalyzing(false);
      return;
    }

    const systemPrompt = `You are an expert technical recruiter and ATS (Applicant Tracking System) optimizer. 
    Analyze the provided resume against the job description. 
    You MUST respond ONLY with a valid JSON object.
    
    Structure:
    {
      "matchScore": number (0-100),
      "executiveSummary": "string",
      "strengths": ["string"],
      "gaps": ["string"],
      "keywordsFound": ["string"],
      "keywordsMissing": ["string"],
      "suggestions": ["string"],
      "interviewPrep": ["string"]
    }`;

    const userQuery = `
      RESUME CONTENT:
      ${resumeText}

      JOB DESCRIPTION:
      ${jobDescription}
    `;

    try {
      let resultText = "";
      let retries = 0;
      const maxRetries = 3;

      while (retries < maxRetries) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: userQuery }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.1, // Low temperature for consistent analysis
                },
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error?.message || `API Error: ${response.status}`
            );
          }

          const data = await response.json();
          resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (resultText) break;
        } catch (err) {
          retries++;
          if (retries === maxRetries) throw err;
          await new Promise((res) => setTimeout(res, 1000 * retries));
        }
      }

      if (!resultText)
        throw new Error("Could not get a valid response from the AI.");

      const parsedResult = JSON.parse(resultText);
      setAnalysisResult(parsedResult);
      setStep(3);
    } catch (err) {
      setError(
        err.message ||
          "Failed to analyze. Please check your API key and connection."
      );
      console.error("Analysis Error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResumeText("");
    setJobDescription("");
    setAnalysisResult(null);
    setError(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                TalentLens AI
              </h1>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Advanced Resume Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-md p-2 rounded-2xl border border-slate-800/50">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  step === i
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110"
                    : step > i
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {step > i ? <CheckCircle className="w-5 h-5" /> : i}
              </div>
            ))}
          </div>
        </header>

        {error && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4 text-red-400 animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-sm">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Action Required</p>
              <p className="text-sm opacity-90 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Step 1: Resume Text Input */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">1. Your Resume</h2>
                <p className="text-slate-400 text-lg">
                  Paste your professional experience to see how AI reads your
                  profile.
                </p>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition duration-1000"></div>
                <textarea
                  className="relative w-full h-[450px] bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[1.5rem] p-8 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none leading-relaxed font-mono text-sm"
                  placeholder="Paste everything: Summary, Work History, Skills, and Education..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              <button
                onClick={handleTextSubmit}
                disabled={!resumeText.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-blue-500/20 active:scale-[0.98]"
              >
                Next Step: Job Targets
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="p-8 bg-slate-900/40 border border-slate-800/50 rounded-3xl backdrop-blur-sm">
                <FileEdit className="w-7 h-7 text-blue-400 mb-5" />
                <h3 className="font-bold text-lg mb-3 text-slate-100">
                  Zero Parsing Errors
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Direct text input avoids the common errors found in PDF
                  parsers, ensuring the AI sees exactly what you want it to see.
                </p>
              </div>
              <div className="p-8 bg-slate-900/40 border border-slate-800/50 rounded-3xl backdrop-blur-sm">
                <ShieldCheck className="w-7 h-7 text-emerald-400 mb-5" />
                <h3 className="font-bold text-lg mb-3 text-slate-100">
                  Private & Secure
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Your data flows directly to the Google LLM. We don't track
                  your history or store your professional details.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Job Description */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">2. Target Role</h2>
              <p className="text-slate-400 text-lg">
                Provide the job posting text for a tailored alignment score.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition duration-1000"></div>
              <textarea
                className="relative w-full h-96 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[1.5rem] p-8 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none leading-relaxed"
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={analyzeResume}
                disabled={isAnalyzing || !jobDescription}
                className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 py-5 px-8 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-blue-500/20 active:scale-[0.98]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-blue-200" />
                    Calculating Match...
                  </>
                ) : (
                  <>
                    Run AI Analysis
                    <Target className="w-6 h-6 group-hover:scale-125 transition-transform" />
                  </>
                )}
              </button>
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-8 py-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl font-bold transition-all"
              >
                Back to Resume
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && analysisResult && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
            {/* Score & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 p-10 bg-slate-900/90 border border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
                <div className="relative w-44 h-44 flex items-center justify-center mb-8">
                  <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
                    <circle
                      cx="88"
                      cy="88"
                      r="78"
                      className="fill-none stroke-slate-800 stroke-[12]"
                    />
                    <circle
                      cx="88"
                      cy="88"
                      r="78"
                      className={`fill-none stroke-[12] transition-all duration-1000 ease-out ${
                        analysisResult.matchScore > 75
                          ? "stroke-emerald-500"
                          : analysisResult.matchScore > 50
                          ? "stroke-blue-500"
                          : "stroke-amber-500"
                      }`}
                      strokeDasharray={490}
                      strokeDashoffset={
                        490 - (490 * analysisResult.matchScore) / 100
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black tracking-tighter">
                      {analysisResult.matchScore}%
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mt-2">
                      Alignment
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">ATS Score</h3>
                <p className="text-sm text-slate-500 leading-relaxed px-4">
                  Match probability based on current market standards.
                </p>
              </div>

              <div className="md:col-span-2 p-10 bg-slate-900/40 border border-slate-800/80 rounded-[2rem] flex flex-col justify-center relative backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6 text-blue-400">
                  <Terminal className="w-6 h-6" />
                  <span className="text-sm font-black uppercase tracking-widest">
                    Executive Insight
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed italic text-xl font-medium">
                  "{analysisResult.executiveSummary}"
                </p>
                <div className="mt-10 pt-8 border-t border-slate-800/50">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    Critical Keywords
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {analysisResult.keywordsFound.map((kw, i) => (
                      <span
                        key={i}
                        className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold ring-1 ring-emerald-500/20"
                      >
                        {kw}
                      </span>
                    ))}
                    {analysisResult.keywordsMissing.map((kw, i) => (
                      <span
                        key={i}
                        className="px-4 py-1.5 bg-slate-800/50 text-slate-500 border border-slate-700/50 rounded-xl text-xs font-medium line-through"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="p-8 bg-slate-900/40 border border-slate-800 rounded-3xl shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  Your Advantages
                </h3>
                <ul className="space-y-4">
                  {analysisResult.strengths.map((str, i) => (
                    <li
                      key={i}
                      className="flex gap-4 text-slate-300 p-4 bg-slate-950/40 rounded-2xl border border-slate-800/30"
                    >
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{str}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="p-8 bg-slate-900/40 border border-slate-800 rounded-3xl shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-amber-400">
                  <AlertCircle className="w-5 h-5" />
                  Optimization Needs
                </h3>
                <ul className="space-y-4">
                  {analysisResult.gaps.map((gap, i) => (
                    <li
                      key={i}
                      className="flex gap-4 text-slate-300 p-4 bg-slate-950/40 rounded-2xl border border-slate-800/30"
                    >
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{gap}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Improvements */}
            <section className="p-10 bg-blue-600/5 border border-blue-500/20 rounded-[2rem]">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-blue-400">
                <Copy className="w-6 h-6" />
                Strategic Action Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {analysisResult.suggestions.map((sug, i) => (
                  <div
                    key={i}
                    className="p-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-sm text-slate-300 leading-relaxed hover:border-blue-500/30 transition-colors shadow-lg"
                  >
                    {sug}
                  </div>
                ))}
              </div>
            </section>

            {/* Preparation */}
            <section className="p-10 bg-purple-600/5 border border-purple-500/20 rounded-[2rem]">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-purple-400">
                <Search className="w-6 h-6" />
                Anticipated Interview Questions
              </h3>
              <div className="space-y-4">
                {analysisResult.interviewPrep.map((q, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-5 p-5 bg-slate-950/40 border border-slate-800/50 rounded-2xl group hover:border-purple-500/30 transition-all"
                  >
                    <span className="text-purple-400 font-mono text-xs font-black px-3 py-1 bg-purple-500/10 rounded-lg">
                      PROMPT {i + 1}
                    </span>
                    <p className="text-sm text-slate-400 group-hover:text-slate-100 transition-colors">
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-center pt-10">
              <button
                onClick={reset}
                className="px-14 py-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                Start New Analysis
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-16 mt-20 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-slate-600 text-sm">
          <div className="flex flex-col gap-2">
            <p className="font-bold text-slate-400">TalentLens AI Engine</p>
            <p>© 2026 Professional Career Analysis. Powered by Gemini 2.5.</p>
          </div>
          <div className="flex items-center gap-10 font-bold uppercase tracking-widest text-[10px]">
            <span className="hover:text-blue-400 cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">
              Compliance
            </span>
            <span className="hover:text-blue-400 cursor-pointer transition-colors">
              Enterprise
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
