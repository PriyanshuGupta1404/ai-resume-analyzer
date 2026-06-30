# TalentLens AI: Advanced Resume Analyzer

TalentLens AI is a modern, AI-powered full-stack web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). This project demonstrates the secure integration of Generative AI using a Node.js/Express backend and a clean, responsive React frontend.

# 🌟 Overview

Most job seekers struggle to get past automated filters. TalentLens AI solves this by using the Gemini 2.5 Flash API to "read" your resume like a recruiter would, providing a match score and specific advice on how to improve your alignment with a job description.

By utilizing a dedicated backend server, this application ensures that sensitive API keys are kept entirely secure and out of the browser, demonstrating enterprise-level security practices.

# 🚀 Key Features

- 3-Step Analysis Workflow:

1. Resume Input: Paste raw resume text (eliminates PDF parsing errors).
2. Job Context: Paste the target job description.
3. AI Dashboard: View a comprehensive report with match scores, strengths, and gaps.

- ATS Intelligence: Identifies missing keywords that are crucial for passing automated HR filters.

- Strategic Advice: Generates actionable "Action Items" to improve resume impact.

- Interview Prep: Provides custom practice questions tailored to the specific role and your background.

- Secure Architecture: Uses a Node.js intermediary server to protect API credentials.

# 🛠️ Technical Stack

- Frontend framework: React.js (Vite)

- Styling: Tailwind CSS (Dark-themed, Glassmorphism UI)

- Icons: Lucide React

- Backend (Runtime): Node.js

- Backend (Framework): Express.js

- AI SDK: @google/genai (Google Gemini 2.5 Flash API)

- Security: dotenv for secret management, cors for cross-origin requests

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

4. Set up the Backend (Server)
-Next, create a secure environment file to hold your API key. Inside the server directory, create a file named exactly .env and add the following:

```
PORT=5000
GEMINI_API_KEY=your_actual_api_key_here
```

Paste your API key between the quotes.

5. Run the development server:

```
npm run dev
```

The application should now be running at http://localhost:5173.

# 🧠 How It Works

1. Input Phase: Users paste their resume and target job description into the React interface.

2. Secure Transmission: React sends this data via a POST request to the local Node.js/Express backend.

3. AI Processing: The backend securely attaches the hidden API key, formats a strict JSON-demanding prompt, and communicates with the Gemini 2.5 Flash model.

4. Data Parsing: The Express server receives the raw data, parses it into a clean JSON object, and sends it back to the client.

5. Visualization Phase: The React frontend receives the JSON and dynamically maps the data into interactive charts, tags, and detailed insights.

# ⚠️ Important Notes for Localhost

- API Rate Limits: The free tier of the Gemini API has request limits. If you encounter errors or the app gets stuck loading, wait 60 seconds and try again.

- Security: Ensure your .env file inside the server folder is listed in your .gitignore file before pushing to GitHub. Never expose your API keys publicly!
  
# 📄 License

This project is open-source and available under the MIT License.

## 📬 Contact

- 🔗 GitHub: [@PriyanshuGupta1404](https://github.com/priyanshugupta1404)
- 🧑‍💻 LinkedIn: [@PriyanshuGupta1404](https://linkedin.com/in/priyanshugupta0551)
- 📩 Email: priyanshugupta1404@gmail.com
