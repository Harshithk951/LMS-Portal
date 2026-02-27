# InclusiveLMS 🎓♿

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=26&pause=1200&center=true&vCenter=true&width=900&lines=InclusiveLMS+-+Accessibility-First+Learning+Platform;Voice+Commands+%7C+AI+Learning+Tools+%7C+Gamified+Progress;Built+with+React+%2B+TypeScript+%2B+Vite" alt="Typing animation" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Voice-Web%20Speech%20API-black" />
  <img src="https://img.shields.io/badge/Status-Active-success" />
</p>

---

## 🚀 Overview

**InclusiveLMS** is an accessibility-first LMS built for inclusive learning experiences.  
It supports voice-driven navigation, AI-assisted learning content, adaptive settings, and gamified progress tracking.

---

## ✨ Key Features

- 🎤 **Voice Commands** for navigation and course actions
- 📚 **Courses Explorer** with search and filtering
- ▶️ **Course Player** with captions, quiz, and playback controls
- 🤖 **AI Generator** for summaries, captions, and quiz content
- 🧩 **Accessibility Settings** (reading preferences, motion control, assistive options)
- 🏆 **Leaderboard + XP + Badges + Streaks**
- 🌐 **Responsive React SPA** with smooth interactions

---

## 🎬 Demo Animations

> Add your real GIFs in `public/demo/` and keep these paths.

<p align="center">
  <img src="./public/demo/landing.gif" alt="Landing demo" width="90%" />
</p>

<p align="center">
  <img src="./public/demo/voice-commands.gif" alt="Voice commands demo" width="90%" />
</p>

<p align="center">
  <img src="./public/demo/course-player.gif" alt="Course player demo" width="90%" />
</p>

---

## 🛠 Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Routing:** React Router
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **State/Context:** React Context API
- **Voice:** Web Speech API (Chrome)

---

## 📁 Project Structure

```text
src/
  components/
  contexts/
    ThemeContext.tsx
    UserContext.tsx
    VoiceContext.tsx
  data/
    courses.ts
    badges.ts
  pages/
    Landing.tsx
    Login.tsx
    Dashboard.tsx
    Courses.tsx
    CoursePlayer.tsx
    AIGenerator.tsx
    Leaderboard.tsx
    Settings.tsx
  App.tsx
  main.tsx
```

---

## ⚙️ Local Setup

```bash
git clone https://github.com/Harshithk951/LMS-Portal.git
cd LMS-Portal
npm install
npm run dev
```

Open: `http://localhost:5173`

---

## 🎙 Voice Commands (Examples)

- “open dashboard”
- “go to courses”
- “open settings”
- “open leaderboard”
- “play [course name]”
- “pause”, “next”, “previous”, “mute”

---

## ✅ Browser Support

- Chrome / Chromium (recommended for voice features)
- Other browsers may have limited SpeechRecognition support

---

## 📌 Roadmap

- [ ] Improve command accuracy with confidence scoring
- [ ] Add instructor/admin panel
- [ ] Add real backend + authentication
- [ ] Add progress sync + certificates

---

## 🤝 Contributing

1. Fork the repo  
2. Create a feature branch  
3. Commit changes  
4. Open a Pull Request

---

## 📄 License

MIT License

---

## 👤 Author

**Harshith Kumar M**  
GitHub: [@Harshithk951](https://github.com/Harshithk951)
