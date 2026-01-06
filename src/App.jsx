import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Upload,
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
} from "lucide-react";

const App = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const handleTextSubmit = () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume content first.");
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

    // API handling for the execution environment
    const apiKey = "";

    const systemPrompt = `You are an expert technical recruiter and ATS (Applicant Tracking System) optimizer. 
    Analyze the provided resume against the job description. 
    Provide a detailed analysis in JSON format with the following structure:
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
      const maxRetries = 5;

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
                  temperature: 0.2,
                  topP: 0.8,
                  topK: 40,
                },
              }),
            }
          );

          if (!response.ok)
            throw new Error(`API Request Failed: ${response.statusText}`);

          const data = await response.json();
          resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (resultText) break;
        } catch (err) {
          retries++;
          if (retries === maxRetries) throw err;
          await new Promise((res) =>
            setTimeout(res, Math.pow(2, retries - 1) * 1000)
          );
        }
      }

      if (!resultText) throw new Error("Empty response from AI");

      const parsedResult = JSON.parse(resultText);
      setAnalysisResult(parsedResult);
      setStep(3);
    } catch (err) {
      setError(
        "Failed to analyze resume. Please check your internet connection and try again."
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
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30">
              <BrainCircuit className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                TalentLens AI
              </h1>
              <p className="text-slate-500 font-medium">
                ATS Resume Optimization Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 p-1.5 rounded-full border border-slate-800">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  step === i
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : step > i
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {step > i ? <CheckCircle className="w-4 h-4" /> : i}
              </div>
            ))}
          </div>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Step 1: Resume Text Input */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-semibold mb-2">
                Your Resume Content
              </h2>
              <p className="text-slate-400 mb-8 text-lg">
                Paste your full resume text below to begin the analysis.
              </p>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
                <textarea
                  className="relative w-full h-96 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none font-sans"
                  placeholder="Paste your professional experience, skills, and education here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              <button
                onClick={handleTextSubmit}
                disabled={!resumeText.trim()}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/10"
              >
                Next: Job Description
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl">
                <FileEdit className="w-6 h-6 text-blue-400 mb-4" />
                <h3 className="font-semibold mb-2 text-slate-100">
                  Simple Input
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  No need to worry about PDF formatting errors. Just copy and
                  paste from Word, LinkedIn, or your existing file.
                </p>
              </div>
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mb-4" />
                <h3 className="font-semibold mb-2 text-slate-100">
                  Privacy First
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Your professional data is analyzed in real-time and never
                  stored on our servers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Job Description */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-2xl font-semibold mb-2">
              Target Job Description
            </h2>
            <p className="text-slate-400 mb-8">
              Paste the requirements for the role you're targeting to calculate
              your match score.
            </p>

            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
                <textarea
                  className="relative w-full h-80 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none font-sans"
                  placeholder="Paste job title, responsibilities, and requirements here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={analyzeResume}
                  disabled={isAnalyzing || !jobDescription}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 py-4 px-8 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-500/10"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Alignment...
                    </>
                  ) : (
                    <>
                      Analyze Match
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl font-medium transition-all"
                >
                  Back to Resume
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && analysisResult && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
            {/* Score Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 p-8 bg-slate-900/80 border border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center shadow-2xl">
                <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      className="fill-none stroke-slate-800 stroke-[10]"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      className={`fill-none stroke-[10] transition-all duration-1000 ease-out ${
                        analysisResult.matchScore > 70
                          ? "stroke-emerald-500"
                          : analysisResult.matchScore > 40
                          ? "stroke-blue-500"
                          : "stroke-amber-500"
                      }`}
                      strokeDasharray={440}
                      strokeDashoffset={
                        440 - (440 * analysisResult.matchScore) / 100
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold tracking-tight">
                      {analysisResult.matchScore}%
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">
                      Match Score
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Role Alignment</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Evaluation based on skills, impact metrics, and ATS
                  compatibility.
                </p>
              </div>

              <div className="md:col-span-2 p-8 bg-slate-900/40 border border-slate-800 rounded-3xl flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-100">
                  <Terminal className="w-5 h-5 text-blue-400" />
                  AI Perspective
                </h3>
                <p className="text-slate-300 leading-relaxed italic text-lg">
                  "{analysisResult.executiveSummary}"
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {analysisResult.keywordsFound.slice(0, 8).map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold"
                    >
                      {kw}
                    </span>
                  ))}
                  {analysisResult.keywordsMissing.slice(0, 4).map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-slate-800/50 text-slate-500 border border-slate-700/50 rounded-lg text-xs font-medium line-through"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Insights and Recommendations sections remain identical */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <section className="p-8 bg-slate-900/40 border border-slate-800 rounded-3xl group hover:border-emerald-500/20 transition-colors">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-100">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Key Strengths
                </h3>
                <ul className="space-y-4">
                  {analysisResult.strengths.map((str, i) => (
                    <li key={i} className="flex gap-3 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{str}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="p-8 bg-slate-900/40 border border-slate-800 rounded-3xl group hover:border-amber-500/20 transition-colors">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-100">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  Identified Gaps
                </h3>
                <ul className="space-y-4">
                  {analysisResult.gaps.map((gap, i) => (
                    <li key={i} className="flex gap-3 text-slate-300">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{gap}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-3xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-400">
                <Copy className="w-5 h-5" />
                Strategic Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.suggestions.map((sug, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-sm text-slate-300 leading-relaxed hover:bg-slate-900 transition-colors"
                  >
                    {sug}
                  </div>
                ))}
              </div>
            </section>

            <section className="p-8 bg-purple-600/5 border border-purple-500/20 rounded-3xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-purple-400">
                <Search className="w-5 h-5" />
                Interview Preparedness
              </h3>
              <div className="space-y-3">
                {analysisResult.interviewPrep.map((q, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-slate-950/30 border border-slate-800 rounded-2xl group hover:border-purple-500/40 transition-all"
                  >
                    <span className="text-purple-400 font-mono text-xs font-bold px-2 py-1 bg-purple-500/10 rounded">
                      Q{i + 1}
                    </span>
                    <p className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-center pt-8">
              <button
                onClick={reset}
                className="px-12 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-12 mt-12 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-600 text-sm">
          <p>© 2026 TalentLens AI. Advanced Career Analysis Engine.</p>
          <div className="flex items-center gap-8 font-medium">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">
              Documentation
            </span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">
              API Status
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
