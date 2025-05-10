const axios = require('axios');
const fs = require('fs');
const { Groq } = require('groq-sdk');


const config = require('../../config/config');
const baseUrl = "https://api.elevenlabs.io/v1";
const apiKey = config.elevenLabs.apiKey;
const voiceId = config.elevenLabs.voiceId;
const outputPath = "output.mp3";


const groq = new Groq({
  apiKey: config.groq.apiKey,
});

const speechService = {
    convertTextToSpeech: async (text) => {
        try {
            const response = await axios({
                method: 'post',
                url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
                headers: {
                  'xi-api-key': apiKey,
                  'Content-Type': 'application/json',
                  'Accept': 'audio/mpeg',
                },
                responseType: 'stream',
                data: {
                  text: text,
                  model_id: "eleven_monolingual_v1",
                  voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5
                  }
                },
              });
            const writer = fs.createWriteStream(outputPath);
            response.data.pipe(writer);
            writer.on('finish', () => console.log(`✅ Audio saved to ${outputPath}`));
            writer.on('error', err => console.error('❌ Error writing file:', err));
            return response.data;
        }
        catch (error) {
            console.error('Error converting text to speech:', error);
            throw error;
        }
    },

    convertAudioToText: async (audioData) => {
        try {
            console.log("🔍 Audio data:" , audioData);
            const response = await groq.audio.transcriptions.create({
                model: config.groq.model,   
                file: audioData,
                language: "en"
            });
            return response.text;
        }
        catch (error) {

            console.error('Error converting audio to text: 123');
            throw error;
        }
        
    }
};

// const main = async () => {
//         // const text = "Hey there!  The weather in Trishal right now is quite pleasant, with scattered clouds and a temperature of 31.46°C that feels like 30.93°C.  It should be quite bearable for you today!";
//         // const speech = await speechService.convertTextToSpeech(text);
//         // console.log(speech);
//         const audioData = fs.createReadStream(outputPath);
//         const text = await speechService.convertAudioToText(audioData);
//         console.log(text);
// }

// main(); 

module.exports = speechService;
