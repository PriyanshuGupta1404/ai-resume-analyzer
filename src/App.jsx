import React, { useState } from "react";
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
  ClipboardCheck,
  RefreshCw,
} from "lucide-react";

const App = () => {
  // --- STATE VARIABLES ---
  const [resumeContent, setResumeContent] = useState("");
  const [jobContent, setJobContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [copiedId, setCopiedId] = useState(null);

  // --- HANDLER FUNCTIONS ---

  const copyToClipboard = (text, id) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }
    document.body.removeChild(textArea);
  };

  const goToNextStep = () => {
    if (resumeContent.trim().length < 50) {
      setErrorMessage(
        "Your resume text is too short. Please paste the full content!",
      );
      return;
    }
    setErrorMessage("");
    setCurrentStep(2);
  };

  const startAnalysis = async () => {
    if (!resumeContent || !jobContent) {
      setErrorMessage("Both fields are required for analysis.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    // REPLACE WITH YOUR INDIVIDUAL API KEY FROM GOOGLE AI STUDIO (aistudio.google.com)
    const API_KEY = "";

    if (!API_KEY) {
      setErrorMessage(
        "API Key is missing! Please paste your personal API key from Google AI Studio on Line 66.",
      );
      setLoading(false);
      return;
    }

    const systemInstruction = `
      You are an expert Senior Technical Recruiter. 
      Analyze the resume against the job description with high strictness.
      
      Return ONLY a JSON object:
      {
        "matchScore": number (0-100),
        "executiveSummary": "string (2 sentences)",
        "strengths": ["list of 3 key strengths"],
        "gaps": ["list of 3 critical gaps"],
        "keywordsFound": ["top 5 found"],
        "keywordsMissing": ["top 5 missing"],
        "suggestions": ["3 actionable bullet points"],
        "interviewPrep": ["3 specific behavior or technical questions"]
      }
    `;

    const userPrompt = `
      RESUME: ${resumeContent}
      JOB DESCRIPTION: ${jobContent}
    `;

    try {
      // UPDATED MODEL: Using the generally available, stable 'gemini-2.5-flash' endpoint
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.15,
            },
          }),
        },
      );

      if (!response.ok) {
        const errDetails = await response.json();
        throw new Error(
          errDetails.error?.message || "Google API returned an error status.",
        );
      }

      const data = await response.json();
      const parsedData = JSON.parse(data.candidates[0].content.parts[0].text);

      setAnalysisData(parsedData);
      setCurrentStep(3);
    } catch (err) {
      setErrorMessage(
        "Analysis failed: " +
          err.message +
          ". Double check your API key, model and network connections.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setResumeContent("");
    setJobContent("");
    setAnalysisData(null);
    setErrorMessage("");
    setCurrentStep(1);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "text-green-600 border-green-100 bg-green-50";
    if (score >= 40) return "text-amber-600 border-amber-100 bg-amber-50";
    return "text-red-600 border-red-100 bg-red-50";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800">
              TalentLens<span className="text-blue-600">AI</span>
            </span>
          </div>

          <div className="flex gap-3">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === num
                    ? "bg-blue-600 text-white scale-110 shadow-md"
                    : currentStep > num
                      ? "bg-green-500 text-white"
                      : "bg-slate-200 text-slate-400"
                }`}
              >
                {currentStep > num ? <CheckCircle className="w-4 h-4" /> : num}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {}
      <main className="max-w-4xl mx-auto px-6 mt-10">
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span className="text-sm font-bold">{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: RESUME INPUT */}
        {currentStep === 1 && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl transition-all">
            <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
              <FileEdit className="text-blue-600" />
              1. Resume Content
            </h2>
            <p className="text-slate-500 mb-6">
              Paste your resume text. AI will look for skills and experience
              gaps.
            </p>

            <textarea
              className="w-full h-80 p-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-700 font-mono text-sm"
              placeholder="Paste text here..."
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
            />

            <div className="mt-8 flex justify-end">
              <button
                onClick={goToNextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-transform active:scale-95"
              >
                Proceed to Job Details
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: JOB INPUT */}
        {currentStep === 2 && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
            <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
              <Target className="text-blue-600" />
              2. Target Role
            </h2>
            <p className="text-slate-500 mb-6">
              Paste the job description to calculate your match accuracy.
            </p>

            <textarea
              className="w-full h-80 p-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              placeholder="Paste job description here..."
              value={jobContent}
              onChange={(e) => setJobContent(e.target.value)}
            />

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-4 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={startAnalysis}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Run AI Analysis <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RESULTS */}
        {currentStep === 3 && analysisData && (
          <div className="space-y-6 animate-in fade-in duration-700">
            {/* Score & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className={`p-8 rounded-3xl border-2 text-center shadow-sm ${getScoreColor(analysisData.matchScore)}`}
              >
                <div className="text-5xl font-black mb-1">
                  {analysisData.matchScore}%
                </div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-70">
                  ATS Score
                </div>
              </div>

              <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 flex flex-col justify-center">
                <h3 className="text-xs font-black uppercase text-blue-600 tracking-tighter mb-2">
                  AI Summary
                </h3>
                <p className="text-slate-700 italic font-medium leading-relaxed">
                  "{analysisData.executiveSummary}"
                </p>
              </div>
            </div>

            {/* Keyword Analysis */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">Keyword Mapping</h3>
              <div className="flex flex-wrap gap-2">
                {analysisData.keywordsFound.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100"
                  >
                    +{kw}
                  </span>
                ))}
                {analysisData.keywordsMissing.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-100 text-slate-400 rounded-lg text-xs font-medium border border-slate-200 line-through"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Pros/Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <h4 className="font-bold text-green-600 flex items-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4" /> Top Strengths
                </h4>
                {analysisData.strengths.map((s, i) => (
                  <div
                    key={i}
                    className="text-sm text-slate-600 mb-2 p-3 bg-slate-50 rounded-xl"
                  >
                    {s}
                  </div>
                ))}
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <h4 className="font-bold text-amber-600 flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4" /> Priority Gaps
                </h4>
                {analysisData.gaps.map((g, i) => (
                  <div
                    key={i}
                    className="text-sm text-slate-600 mb-2 p-3 bg-slate-50 rounded-xl"
                  >
                    {g}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Items */}
            <div className="bg-blue-600 p-8 rounded-3xl text-white">
              <h4 className="font-bold mb-4 flex items-center gap-2 text-xl">
                <Terminal className="w-5 h-5" /> How to Improve
              </h4>
              <div className="space-y-3">
                {analysisData.suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="bg-white/10 p-4 rounded-xl text-sm border border-white/10"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Prep */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-6 text-xl">
                Interview Preparation
              </h4>
              <div className="space-y-4">
                {analysisData.interviewPrep.map((q, i) => (
                  <div
                    key={i}
                    className="group relative p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-300 transition-all"
                  >
                    <p className="text-sm text-slate-700 pr-10">{q}</p>
                    <button
                      onClick={() => copyToClipboard(q, i)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Copy Question"
                    >
                      {copiedId === i ? (
                        <ClipboardCheck className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={resetApp}
                className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-black transition-all"
              >
                <RefreshCw className="w-4 h-4" /> New Analysis
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
