# Weather AI Agent 🌤️

An intelligent AI agent that processes weather-related queries through text and voice inputs, providing accurate weather information with natural voice responses.

## Features ✨

- 🤖 AI-powered weather query processing
- 🎤 Voice input support
- 🔊 Voice response generation
- 📊 Real-time weather data integration
- 🔄 Historical and forecast weather information
- 💬 Natural language understanding
- 🎯 Context-aware responses

## Tech Stack 🛠️

### Backend
- Node.js
- LangChain/LangGraph
- Google ADK
- OpenWeatherMap API
- ElevenLabs API (Speech-to-Text & Text-to-Speech)
- Groq/Gemini (LLM)

### Frontend
- React.js
- Modern UI components
- Responsive design

## Prerequisites 📋

- Node.js (v14 or higher)
- npm (v6 or higher)
- API Keys for:
  - OpenWeatherMap
  - ElevenLabs
  - Groq/Gemini

## Installation 🚀

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (like .env.development) in the backend directory with your API keys:
```env
OPENWEATHER_API_KEY=your_openweather_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
GROQ_API_KEY=your_groq_api_key
# or
GEMINI_API_KEY=your_gemini_api_key
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage 💡

1. Open your browser and navigate to `http://localhost:5173`
2. Choose between text or voice input
3. Ask weather-related questions like:
   - "Will it rain today?"
   - "Was it sunny yesterday?"
   - "Is tomorrow going to rain cats and dogs?"
4. Receive voice responses with accurate weather information

## Project Structure 📁

```
weather-ai-agent/
├── backend/
│   ├── config/
│   │   └── config.js
│   │   └── database.js
│   │   └── initDatabse.js
│   ├── controller/
│   │   └── queryController.js
│   ├── routes/
│   │   └── history.js
│   │   └── query.js
│   ├── models/
│   │   └── QueryHistory.js
│   ├── service/
│   │   ├── langchain/agent.js
|   |   ├── speech/speechService.js
|   |   ├── weather/weatherService.js
│   └── index.js
│   ├── .env.development
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   |   ├── AudioPlayer.jsx
│   │   |   ├── QueryInput.jsx
│   │   |   ├── ResponseDisplay.jsx
│   │   |   ├── Sidebar.jsx
│   │   ├── hooks/
│   │   |   ├── useQueryHistory.js
│   │   └── pages/WeatherAgent.jsx
│   │   └── App.jsx
│   │   └── App.css 
│   │   └── index.css
│   │   └── main.jsx
│   │   └── theme.js
│   └── package.json
└── README.md
```

## API Integration 🔌

### OpenWeatherMap API
- Provides current weather data
- Historical weather information
- Weather forecasts
- [Documentation](https://openweathermap.org/api)

### ElevenLabs API
- Speech-to-Text conversion
- Text-to-Speech synthesis
- [Documentation](https://docs.elevenlabs.io)

### LLM Integration
- Groq or Gemini for natural language processing
- Query understanding and response generation

## Error Handling ⚠️

The application includes comprehensive error handling for:
- Invalid API responses
- Network connectivity issues
- Invalid user inputs
- Voice processing errors

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- OpenWeatherMap for weather data
- ElevenLabs for voice processing
- LangChain for AI agent development
- Groq/Gemini for LLM capabilities
