// Configuration file for environment variables
require('dotenv').config({ path: '../../.env' });

module.exports = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API Keys
  openWeatherMap: {
    apiKey: process.env.OPENWEATHERMAP_API_KEY,
    baseUrl: 'https://api.openweathermap.org/data/2.5'
  },
  
  // ElevenLabs configuration
  elevenLabs: {
    apiKey: process.env.ELEVENLABS_API_KEY,
    voiceId: process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL' // Default voice ID
  },
  
  // LLM configuration (Groq or Gemini)
  llm: {
    provider: process.env.LLM_PROVIDER || 'groq', // 'groq' or 'gemini'
    apiKey: process.env.LLM_API_KEY ,
    model: process.env.LLM_MODEL || "llama-3.3-70b-versatile" // Default model for Groq
  },
  
  // Database configuration
  database: {
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite'
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || "whisper-1"
  }
};