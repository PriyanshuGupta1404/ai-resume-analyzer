// Function to call the Gemini API using the official SDK
const startAnalysis = async () => {
  if (!resumeContent || !jobContent) {
    setErrorMessage("Please make sure both fields are filled in.");
    return;
  }

  setLoading(true);
  setErrorMessage("");

  // Your working AQ API Key
  const API_KEY = "";

  if (API_KEY === "") {
    setErrorMessage("Missing API Key! Please add it to the code.");
    setLoading(false);
    return;
  }

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
    // Initialize the Google Gen AI client with your AQ key
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // Run the request against the compatible gemini-2.5-flash model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    // The SDK auto-extracts the returned text block safely
    const aiResponseText = response.text;

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
