import React, { useState } from "react";
// Importing icons from the lucide-react library
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
  // --- STATE VARIABLES ---
  // Using simple states to manage the user input and app flow
  const [resumeContent, setResumeContent] = useState("");
  const [jobContent, setJobContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  // --- HANDLER FUNCTIONS ---

  // Function to move from Step 1 to Step 2
  const goToNextStep = () => {
    if (resumeContent.trim().length < 50) {
      setErrorMessage("Please paste a bit more of your resume first!");
      return;
    }
    setErrorMessage("");
    setCurrentStep(2);
  };

  // Function to call the Gemini API
  const startAnalysis = async () => {
    if (!resumeContent || !jobContent) {
      setErrorMessage("Please make sure both fields are filled in.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    // API Key - Users should put their key here
    const API_KEY = "AIzaSyDOW90B8htruAcNxrGFGT3ubrCLlG7Lu3o";

    if (API_KEY === "") {
      setErrorMessage("Missing API Key! Please add it to the code (line 52).");
      setLoading(false);
      return;
    }

    // Creating the instruction for the AI
    const systemInstruction = `
      You are a professional hiring manager. 
      Analyze the resume against the job description.
      
      You must return ONLY a JSON object with this exact structure:
      {
        "matchScore": number,
        "executiveSummary": "string",
        "strengths": ["list of strings"],
        "gaps": ["list of strings"],
        "keywordsFound": ["list of strings"],
        "keywordsMissing": ["list of strings"],
        "suggestions": ["list of strings"],
        "interviewPrep": ["list of strings"]
      }
    `;

    const userPrompt = `
      RESUME: ${resumeContent}
      JOB DESCRIPTION: ${jobContent}
    `;

    try {
      // Basic fetch request to Google Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          }),
        }
      );

      // Checking if response is okay
      if (!response.ok) {
        throw new Error(
          "API call failed. Please check your internet or API key."
        );
      }

      const data = await response.json();
      const aiResponseText = data.candidates[0].content.parts[0].text;

      // Parsing the JSON string into a JavaScript object
      const parsedData = JSON.parse(aiResponseText);

      setAnalysisData(parsedData);
      setCurrentStep(3); // Move to results page
    } catch (err) {
      console.error(err);
      setErrorMessage("Could not finish analysis. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset function to clear everything and start over
  const resetApp = () => {
    setResumeContent("");
    setJobContent("");
    setAnalysisData(null);
    setErrorMessage("");
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Simple Navigation / Header */}
      <nav className="bg-white border-b border-slate-200 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-800">
              TalentLens AI
            </span>
          </div>

          <div className="flex gap-2">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep === stepNumber
                    ? "bg-blue-600 text-white"
                    : currentStep > stepNumber
                    ? "bg-green-500 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {currentStep > stepNumber ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  stepNumber
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {/* STEP 1: Paste Resume */}
        {currentStep === 1 && (
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
            <div className="mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileEdit className="text-blue-600" />
                Step 1: Paste Your Resume
              </h2>
              <p className="text-slate-500 mt-1">
                Copy the text from your resume and paste it below.
              </p>
            </div>

            <textarea
              className="w-full h-80 p-5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-700 leading-relaxed"
              placeholder="E.g. Professional Summary, Experience, Skills..."
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
            />

            <div className="mt-8 flex justify-end">
              <button
                onClick={goToNextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-lg font-bold flex items-center gap-2 transition-transform active:scale-95"
              >
                Next Step
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Job Description */}
        {currentStep === 2 && (
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">Step 2: Job Description</h2>
              <p className="text-slate-500">
                Paste the job requirements you are applying for.
              </p>
            </div>

            <textarea
              className="w-full h-80 p-5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700"
              placeholder="Paste the job title, responsibilities, and requirements here..."
              value={jobContent}
              onChange={(e) => setJobContent(e.target.value)}
            />

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 border border-slate-300 text-slate-600 font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={startAnalysis}
                disabled={loading}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-3 transition-colors disabled:bg-blue-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Start Analysis
                    <Target className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Results Dashboard */}
        {currentStep === 3 && analysisData && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Main Score Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-10 rounded-xl border border-slate-200 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-blue-50 bg-blue-50 mb-4">
                  <span className="text-4xl font-black text-blue-600">
                    {analysisData.matchScore}%
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Match Score
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  How well your resume fits this job.
                </p>
              </div>

              <div className="md:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-blue-600">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-bold text-lg uppercase tracking-tight">
                    AI Summary
                  </h3>
                </div>
                <p className="text-slate-700 italic leading-relaxed text-lg">
                  "{analysisData.executiveSummary}"
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <p className="text-xs font-bold text-slate-400 w-full mb-1">
                    Keywords Identified:
                  </p>
                  {analysisData.keywordsFound.map((kw, i) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-bold uppercase"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-green-600 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Top Strengths
                </h4>
                <ul className="space-y-3">
                  {analysisData.strengths.map((str, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-green-500">•</span>
                      {str}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-amber-600 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Areas to Improve
                </h4>
                <ul className="space-y-3">
                  {analysisData.gaps.map((gap, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-amber-500">•</span>
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Tips */}
            <div className="bg-blue-600 p-8 rounded-xl text-white shadow-lg">
              <h4 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Copy className="w-6 h-6" />
                Action Items
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisData.suggestions.map((sug, i) => (
                  <div
                    key={i}
                    className="bg-white/10 p-4 rounded-lg border border-white/20 text-sm"
                  >
                    {sug}
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Prep */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-xl">
                <Search className="w-6 h-6 text-blue-600" />
                Practice Questions
              </h4>
              <div className="space-y-4">
                {analysisData.interviewPrep.map((q, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 text-sm"
                  >
                    <span className="font-bold text-blue-600 mr-2">
                      Q{i + 1}:
                    </span>{" "}
                    {q}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center pb-10">
              <button
                onClick={resetApp}
                className="bg-slate-800 text-white font-bold px-12 py-4 rounded-full hover:bg-slate-900 transition-all shadow-xl"
              >
                Restart New Check
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-10 border-t border-slate-200 text-slate-400 text-sm">
        <p>Built as a Student Portfolio Project &copy; 2026</p>
      </footer>
    </div>
  );
};

export default App;
