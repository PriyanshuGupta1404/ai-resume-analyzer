# TalentLens AI: Advanced Resume Analyzer

TalentLens AI is a modern, high-performance web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). By leveraging the Gemini 2.5 Flash API, the tool provides deep, contextual analysis of a resume against a specific job description, offering actionable insights and interview preparation.

# 🚀 Key Features

- Contextual Match Scoring: Get a percentage-based score indicating how well your profile aligns with a specific role.

- Executive Summary: Receive an AI-generated overview of your candidacy from a recruiter's perspective.

- Keyword Intelligence: Identify which industry-standard keywords are present in your resume and which critical ones are missing.

- SWOT-style Analysis: Detailed breakdown of your key strengths and identified gaps for the target position.

- Strategic Recommendations: Tailored suggestions to improve your resume's impact and clarity.

- Interview Prep: Automatically generates anticipated interview questions based on the role requirements and your experience.

- Privacy Focused: Your data is processed in real-time via encrypted API calls and is never stored on a persistent database.

# 🛠️ Technical Stack

- Frontend: React.js (Vite)

- Styling: Tailwind CSS (Dark-themed, Glassmorphism UI)

- Icons: Lucide React

- AI Engine: Google Gemini 2.5 Flash API

- State Management: React Hooks (useState, useEffect)

# 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher recommended)

- npm or yarn

- A Google Gemini API Key from Google AI Studio

# ⚙️ Installation & Setup

1. Clone the repository:

```
git clone [https://github.com/your-username/ai-resume-analyzer.git](https://github.com/your-username/ai-resume-analyzer.git)
cd ai-resume-analyzer
```

2. Install dependencies:

```
npm install
```

3. Install UI dependencies:

```
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

4. Add your API Key:
   Open src/App.jsx and locate the following line:

```
const apiKey = ""; // Add your Gemini API key here
```

Paste your API key between the quotes.

5. Run the development server:

```
npm run dev
```

The application should now be running at http://localhost:5173.

# 🧠 How It Works

1. Input Phase: Users paste their resume text and the job description into the secure interface.

2. Analysis Phase: The application sends a structured, high-context prompt to the Gemini 2.5 Flash model.

3. Response Handling: The AI returns a structured JSON object containing scores and analysis.

4. Visualization Phase: The React frontend parses the JSON to display interactive charts, keyword tags, and detailed insights.

# ⚠️ Important Notes for Localhost

- API Rate Limits: The free tier of the Gemini API has request limits. If you encounter errors, wait 60 seconds and try again.

- CORS Policies: If you encounter CORS errors on localhost, ensure your request headers match those in App.jsx or use a browser extension to bypass CORS during development.

- Security: Never commit your App.jsx with your API key to a public repository. For production, always use environment variables (.env).

# 📄 License

This project is open-source and available under the MIT License.
