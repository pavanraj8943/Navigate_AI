# Navigate AI: Interview & Career Coach

Navigate AI is a professional AI-powered interview preparation and career coaching platform designed to help users succeed in their job search. By leveraging advanced AI models, the platform provides personalized guidance, mock interviews, and resume analysis, maintaining awareness of the user's background throughout the interaction.

## 🚀 Key Features

*   **Resume Upload & Parsing**: Extract key information from resumes to tailor the coaching experience.
*   **Context-Aware Chat**: AI coach interacts with users based on their specific background, skills, and experience.
*   **Interview Preparation**:
    *   **Behavioral Coaching**: Practice STAR method responses.
    *   **Technical Questions**: Role-specific technical interview practice.
    *   **Resume-Based Q&A**: Anticipate questions based on your actual experience.
*   **Real-time Feedback**: Instant analysis of your answers with actionable advice.

## 🛠️ Tech Stack

### Frontend
*   **React 19**: Modern UI library for building interactive interfaces.
*   **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
*   **Vite**: Next-generation frontend tooling.
*   **React Router**: Declarative routing for React applications.
*   **Lucide React**: Beautiful & consistent icons.

### Backend
*   **Node.js**: JavaScript runtime environment.
*   **Express**: Fast, unopinionated web framework for Node.js.
*   **MongoDB**: NoSQL database for flexible data storage.
*   **Mongoose**: ODM library for MongoDB and Node.js.
*   **Google Generative AI (Gemini)**: AI model for intelligence and reasoning.
*   **OpenAI**: AI model integration (configurable).
*   **JWT**: Secure JSON Web Tokens for authentication.

## 📋 Prerequisites

Before running the project, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   [MongoDB](https://www.mongodb.com/) (Local installation or Atlas URI)

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository_url>
    cd Navigate_AI
    ```

### Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    *   Create a `.env` file in the `server` directory.
    *   Copy the contents from `.env.example` or use the following template:
        ```env
        PORT=5000
        CLIENT_URL=http://localhost:5173
        MONGO_URI=mongodb://localhost:27017/navigate_ai
        JWT_SECRET=your_super_secret_jwt_key
        OPENAI_API_KEY=your_openai_api_key (if using OpenAI)
        GOOGLE_API_KEY=your_google_gemini_api_key (if using Gemini)
        ```
4.  Start the server:
    ```bash
    npm run dev
    ```
    The server should now be running on `http://localhost:5000`.

### Frontend Setup

1.  Navigate to the client directory (open a new terminal):
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application should now be accessible at `http://localhost:5173`.

## 📄 License

This project is licensed under the ISC License.
.env
server/.env