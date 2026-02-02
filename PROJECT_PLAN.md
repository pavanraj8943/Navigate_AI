# Interview & Career Coach - Project Plan

## Project Overview
A professional AI-powered interview preparation and career coaching platform that uses resume context to provide personalized guidance. The AI maintains awareness of the user's background, skills, and experience throughout conversations.

---

## 🎯 Key Features

### Phase 1: Foundation (Core Interview Coach)
- **Resume Upload & Parsing**: Extract and store resume data
- **Context-Aware Chat**: AI remembers resume details in conversations
- **Interview Preparation**:
  - Behavioral question coaching (STAR method)
  - Technical question practice
  - Resume-specific Q&A
  - Real-time feedback

### Phase 2: Enhanced Experience
- **Interview Simulation**: Mock interview scenarios
- **Performance Analytics**: Track progress, identify weak areas
- **Suggested Questions**: Auto-generate Q&A based on resume
- **Refinement Tools**: Resume improvement suggestions
- **Interview History**: Track past sessions and improvements

### Phase 3: Career Development
- **Career Path Recommendations**: Based on skills and experience
- **Salary Insights**: Industry benchmarking
- **Skill Gap Analysis**: What to learn next
- **Job Match Scoring**: Rank job descriptions against resume

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
├─────────────────────────────────────────────────────┤
│  • Resume Upload & Parser UI                         │
│  • Chat Interface (Context-aware)                    │
│  • Interview Simulation Dashboard                    │
│  • Analytics & Progress Tracking                     │
│  • Settings & Resume Management                      │
└────────────────────┬────────────────────────────────┘
                     │ REST API / WebSocket
┌─────────────────────────────────────────────────────┐
│                Backend (Node/Express)                │
├─────────────────────────────────────────────────────┤
│  • Auth System (JWT)                                 │
│  • Resume Processing Service                        │
│  • Context Management (Store & Retrieve)            │
│  • AI Orchestration Layer                           │
│  • Interview Session Manager                        │
│  • Analytics Engine                                 │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────────┐  ┌────────┐  ┌────────┐
    │MongoDB │  │OpenAI  │  │Redis   │
    │(Data)  │  │(AI)    │  │(Cache) │
    └────────┘  └────────┘  └────────┘
```

---

## 🧠 Context Management Strategy

### Resume Context Store
```javascript
// User Context Object (stored in DB + Redis cache)
{
  userId: "user123",
  resume: {
    personalInfo: { name, email, phone, location },
    summary: "2 years of full-stack experience...",
    skills: [{ category, items, proficiency }],
    experience: [{ company, role, duration, achievements }],
    education: [{ school, degree, field, graduation }],
    projects: [{ name, description, technologies }],
    certifications: []
  },
  metadata: {
    uploadedAt: timestamp,
    lastUpdated: timestamp,
    keywords: [], // Extracted for search/matching
    strengths: [], // AI-identified strengths
    gaps: [] // Skill/experience gaps
  }
}
```

### AI Prompt Engineering
Every AI request includes:
1. **System Context**: Resume summary + key achievements
2. **Conversation History**: Last 5-10 exchanges (relevance-based)
3. **User Profile**: Experience level, interview stage, target roles
4. **Session Goal**: Current coaching focus (behavioral, technical, etc.)

### Context Injection Pattern
```javascript
// Every API call to AI includes:
const systemPrompt = `
You are an expert interview coach. The candidate:
- Has ${yearsOfExperience} years of experience
- Key skills: ${keySkills.join(", ")}
- Notable achievements: ${achievements.join("; ")}
- Current role: ${currentRole}
- Target role(s): ${targetRoles.join(", ")}

Use this context to provide personalized, specific feedback.
Reference their actual experience when coaching.
`
```

---

## 📁 Recommended File Structure

### Frontend (client/)
```
Frontend (client/)
src/
├── components/
│   ├── chat/
│   │   ├── ChatInterface.jsx
│   │   ├── MessageList.jsx
│   │   └── ContextPanel.jsx
│   │
│   ├── resume/
│   │   ├── ResumeUpload.jsx
│   │   ├── ResumeParsing.jsx
│   │   └── ResumePreview.jsx
│   │
│   ├── interview/
│   │   ├── InterviewSimulation.jsx
│   │   ├── QuestionDisplay.jsx
│   │   └── ResponseRecorder.jsx
│   │
│   ├── dashboard/
│   │   ├── Analytics.jsx
│   │   └── ProgressChart.jsx
│   │
│   └── common/
│       ├── Header.jsx
│       ├── Sidebar.jsx
│       └── Layout.jsx
│
├── hooks/
│   ├── useResume.js
│   ├── useChat.js
│   ├── useInterview.js
│   └── useAuth.js
│
├── services/
│   ├── api.js
│   ├── resumeParser.js
│   ├── aiOrchestration.js
│   └── storage.js
│
├── context/
│   ├── ResumeContext.jsx
│   ├── UserContext.jsx
│   └── ChatContext.jsx
│
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── CoachPage.jsx
│   ├── InterviewPage.jsx
│   └── AnalyticsPage.jsx
├       
│
├── utils/
│   ├── validators.js
│   ├── formatters.js
│   └── constants.js
│
├── App.jsx
└── main.jsx

```

### Backend (server/)
```
routes/
├── auth.js (Login, register, JWT)
├── resume.js (Upload, parse, store, retrieve)
├── chat.js (Chat messages, context retrieval)
├── interview.js (Interview sessions, feedback)
└── analytics.js (Progress tracking, insights)

controllers/
├── authController.js
├── resumeController.js (Resume processing)
├── chatController.js (AI orchestration)
├── interviewController.js (Session management)
└── analyticsController.js

services/
├── resumeParsingService.js (PDF/text extraction)
├── aiOrchestrationService.js (OpenAI integration + context)
├── contextManagementService.js (Store/retrieve/cache context)
├── interviewService.js (Scoring, feedback generation)
└── analyticsService.js

models/
├── User.js
├── Resume.js
├── ChatMessage.js
├── InterviewSession.js
└── AnalyticsRecord.js

middleware/
├── auth.js (JWT verification)
├── errorHandler.js
├── validation.js
└── contextInjection.js (Auto-add resume context)

utils/
├── resumeExtractor.js (PDF/text parsing)
├── promptTemplates.js (AI system prompts)
├── validators.js
└── logger.js

server.js (Main entry point)
```

---

## 🤖 AI Orchestration Implementation

### Context-Aware Chat Flow
```
User Message
    ↓
[Retrieve Resume Context from DB/Cache]
    ↓
[Build Enhanced Prompt]
  • System context (resume)
  • Conversation history (last 5 messages)
  • User profile metadata
  • Current coaching mode
    ↓
[Send to OpenAI with Context Tokens]
    ↓
[Parse Response + Extract Insights]
    ↓
[Store in Chat History + Analytics]
    ↓
Send Response to Client
```

### Prompt Templates
```javascript
// Coach Mode: Behavioral Interview
const behavioralPrompt = `
You are an expert behavioral interview coach. The candidate has ${exp} years 
at ${company} as ${role}, working with ${skills.join(", ")}.

Key achievement: "${topAchievement}"

The user is practicing the STAR method. Guide them through:
1. Situation (2-3 sentences)
2. Task (what was your responsibility?)
3. Action (what did you do?)
4. Result (quantifiable outcomes)

Provide constructive feedback specific to their experience.
`

// Coach Mode: Technical Interview
const technicalPrompt = `
The candidate specializes in ${specializations.join(", ")} with experience in 
${technologies.join(", ")}.

Ask technical questions appropriate to their level and target role.
After their answer, provide:
- What they explained well
- What could be clearer
- Follow-up question if applicable
- How it relates to their experience
`

// Coach Mode: Resume-Based Q&A
const resumeQAPrompt = `
Here's the candidate's resume:
${resumeText}

Generate and answer likely interview questions about:
- This specific role/achievement
- Their skill progression
- Technical depth of listed projects

Frame answers using the STAR method where applicable.
`
```

---

## 📊 Data Models

### Resume Model (MongoDB)
```javascript
{
  _id: ObjectId,
  userId: "user123",
  filename: "john_doe_resume.pdf",
  uploadedAt: Date,
  lastModified: Date,
  
  // Extracted data
  parsed: {
    personalInfo: { name, email, phone, location },
    summary: String,
    experience: [
      {
        company: String,
        role: String,
        startDate: Date,
        endDate: Date,
        description: String,
        achievements: [String],
        technologies: [String]
      }
    ],
    skills: [
      {
        category: String, // "Languages", "Frameworks", etc.
        items: [String],
        proficiency: "beginner" | "intermediate" | "advanced"
      }
    ],
    education: [
      {
        school: String,
        degree: String,
        field: String,
        graduationDate: Date
      }
    ],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        link: String
      }
    ]
  },
  
  // AI-generated insights
  insights: {
    strengths: [String],
    gaps: [String],
    keywordsExtracted: [String],
    suggestedQuestions: [String],
    industryMatch: [String]
  },
  
  // Raw file storage (for re-parsing)
  rawText: String,
  fileBuffer: Buffer // or store in S3
}
```

### Chat Message Model
```javascript
{
  _id: ObjectId,
  userId: "user123",
  resumeId: ObjectId, // Reference to resume
  coachingMode: "behavioral" | "technical" | "general" | "resume-qa",
  
  messages: [
    {
      role: "user" | "assistant",
      content: String,
      timestamp: Date,
      metadata: {
        tokensUsed: Number,
        insights: [String] // AI-detected patterns
      }
    }
  ],
  
  sessionMetadata: {
    startedAt: Date,
    duration: Number,
    questionsAnswered: Number,
    focusAreas: [String],
    performanceScore: Number
  },
  
  contextSnapshot: { /* resume context used in this session */ }
}
```

### Interview Session Model
```javascript
{
  _id: ObjectId,
  userId: "user123",
  resumeId: ObjectId,
  
  sessionType: "full-mock" | "quick-practice" | "specific-skills",
  targetRole: String, // e.g., "Senior Full-Stack Engineer"
  difficulty: "junior" | "mid" | "senior",
  
  questions: [
    {
      question: String,
      category: "behavioral" | "technical" | "system-design",
      userResponse: String,
      aiEvaluation: {
        score: Number, // 1-10
        feedback: String,
        strengths: [String],
        improvements: [String]
      },
      durationSeconds: Number
    }
  ],
  
  overallFeedback: {
    score: Number,
    summary: String,
    strengths: [String],
    areasForImprovement: [String],
    nextSteps: [String]
  },
  
  startedAt: Date,
  completedAt: Date
}
```

---

## 🔄 Development Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up authentication (JWT + login/register)
- [ ] Build resume upload & basic parsing
- [ ] Create resume storage (MongoDB)
- [ ] Build basic chat interface
- [ ] Implement context retrieval system
- [ ] Integrate OpenAI API with context injection
- [ ] Deploy basic working MVP

**Deliverable**: Simple chat interface that remembers resume details

### Phase 2: Interview Coach (Weeks 3-4)
- [ ] Implement behavioral interview coaching
- [ ] Build STAR method guidance
- [ ] Create interview simulation mode
- [ ] Add real-time feedback system
- [ ] Implement interview session storage
- [ ] Build progress analytics dashboard

**Deliverable**: Full interview preparation suite with feedback

### Phase 3: Polish & Scale (Weeks 5+)
- [ ] Advanced context management (semantic search)
- [ ] Performance optimization (caching, indexing)
- [ ] Advanced analytics & reporting
- [ ] Mobile-responsive UI improvements
- [ ] Testing & bug fixes
- [ ] Production deployment

---

## 🛠️ Tech Stack Details

### Frontend
- **React 18** + Vite (already set up)
- **Tailwind CSS** + custom components
- **Zustand** or **Context API** for state
- **Axios** for API calls
- **React Router** for navigation
- **React Query** for server state
- **pdf-parse** / **pdfjs-dist** for client-side PDF parsing

### Backend
- **Node.js + Express.js**
- **MongoDB** + Mongoose (document storage)
- **Redis** (context caching, session management)
- **OpenAI API** (GPT-4 for coaching)
- **JWT** for authentication
- **multer** for file uploads
- **pdfjs-dist** / **pdf-parse** for backend PDF parsing

### Deployment
- **Frontend**: Vercel or Netlify
- **Backend**: Railway, Render, or AWS EC2
- **Database**: MongoDB Atlas
- **Cache**: Redis Cloud
- **Storage**: AWS S3 (for resume files)

---

## ⚡ Key Technical Considerations

### 1. Context Management Performance
- **Problem**: Sending full resume context every request → token overhead
- **Solution**: 
  - Summarize resume to key points (~500 tokens max)
  - Use Redis to cache user context (expires hourly)
  - Only send relevant context for current coaching mode
  - Implement token usage tracking

### 2. AI Cost Optimization
- **Use GPT-4 Turbo** (cheaper than GPT-4, same quality)
- **Implement request batching** for analytics
- **Cache common responses** (behavioral questions, etc.)
- **Track costs per user** for future monetization

### 3. Resume Parsing Accuracy
- Implement **hybrid parsing** (client + server)
- Use **structured extraction** (specific fields, not free-form)
- Validate extracted data and show user for correction
- Store original file for re-parsing with updated algorithms

### 4. Conversation Quality
- Store last **5-10 relevant messages** (not all history)
- Implement **conversation summarization** for long chats
- Use **embeddings** to find contextually relevant past exchanges
- Maintain coaching mode throughout session

---

## 📈 Success Metrics

- **User Engagement**: Sessions per week, avg session duration
- **Feature Adoption**: % using interview simulation, analytics
- **AI Quality**: User ratings, follow-up questions rate
- **Performance**: API response time < 2s, context retrieval < 500ms
- **Cost Efficiency**: Tokens per session, cost per user

---

## 🚀 Next Steps

1. **Start Phase 1** with authentication + resume upload
2. **Test resume parsing** with 5-10 sample resumes
3. **Build context injection** for AI prompts
4. **Create simple chat UI** with Tailwind
5. **Get early feedback** from test users on context awareness

