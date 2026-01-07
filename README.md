# TalentLens AI: Advanced Resume Analyzer

TalentLens AI is a modern, AI-powered web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). This project demonstrates the integration of Generative AI with a clean, responsive React frontend.

# 🌟 Overview

Most job seekers struggle to get past automated filters. TalentLens AI solves this by using the Gemini 2.5 Flash API to "read" your resume like a recruiter would, providing a match score and specific advice on how to improve your alignment with a job description.

# 🚀 Key Features

- 3-Step Analysis Workflow:

1. Resume Input: Paste raw resume text (eliminates PDF parsing errors).
2. Job Context: Paste the target job description.
3. AI Dashboard: View a comprehensive report with match scores, strengths, and gaps.

- ATS Intelligence: Identifies missing keywords that are crucial for passing automated HR filters.

- Strategic Advice: Generates actionable "Action Items" to improve resume impact.

- Interview Prep: Provides custom practice questions tailored to the specific role and your background.

# 🛠️ Technical Stack

- Frontend: React.js (Vite)

- Styling: Tailwind CSS (Dark-themed, Glassmorphism UI)

- Icons: Lucide React

- AI Engine: Google Gemini 2.5 Flash API

- Deployment Ready: Optimized for Vite

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

## 📬 Contact

- 🔗 GitHub: [@PriyanshuGupta1404](https://github.com/priyanshugupta1404)
- 🧑‍💻 LinkedIn: [@PriyanshuGupta1404](https://linkedin.com/in/priyanshugupta0551)
- 📩 Email: priyanshugupta1404@gmail.com
