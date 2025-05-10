const config = require('../../config/config.js');

const { ChatGroq } = require('@langchain/groq');
const { PromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { RunnableSequence } = require('@langchain/core/runnables');
const weatherService = require('../weather/weatherService');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');

// LLM Setup


const model = new ChatGoogleGenerativeAI({
    apiKey: config.llm.apiKey,
    model: config.llm.model,
});

const outputParser = new StringOutputParser();

// Prompt 1: Query Analyzer
const queryAnalyzer = new PromptTemplate({
    template: `
    You are a weather assistant that helps analyze weather-related queries. Analyze user sentiment and provide appropriate response.
    If user greets you, then you need to greet them back. if user asks about time, then you need to tell the current time.
    if user asks about date, then you need to tell the current date. If user praises you, then you need to say "Thank you"
    donot engage in verbal argument with user.
    if user asks about something you dont know, then you need to say "I'm sorry, I don't know that information."

    for forecast, you need to extract number of days for forecast in NumberOfDays
    if queryHistory is provided, then you need to use it to analyze the query. 
    if in the main query, the user hasnot provided location or date, then you need to use the queryHistory to get the location and date.
    Given the following query, extract the following information:
    1. Location (city name) [if not specified, then analyze the queryHistory to get the location, if not found then use Dhaka]
    2. Time reference (today, tomorrow, yesterday, specific date) [if not specified, then use today]
    3. Weather attribute of interest (temperature, rain, sun, wind, etc.) [if not specified, then use general weather]
    4. Any specific conditions mentioned (heavy rain, light snow, etc.) [if not specified, then use none]
    5. Type of weather data (current weather, forecast) [if not specified, then use current weather]
    6. Number of days for forecast (0,1,2,3,4,5,6,7,8,9,10)[week=7,month=30,today=0,tomorrow=1, yesterday=-1] (calculate the number of days from today)

    Query: {query}

    Provide the extracted information in a structured format:
    Location: [extracted location or 'not specified']
    TimeReference: [extracted time reference or 'not specified'] Donot write something after date
    WeatherAttribute: [extracted weather attribute or 'general weather']
    Type: "current weather" or "forecast"
    SpecificConditions: [extracted specific conditions or 'none']
    NumberOfDays: [extracted only **number** of days for forecast or 'not specified']
    `,
    inputVariables: ["query"]
});

// Prompt 2: Response Generator
const responseGenerator = new PromptTemplate({
    template: `
    You are a helpful and friendly weather assistant.
    Based on the following weather data and query analysis, generate a natural-sounding response.
    Make the response conversational and engaging.

    Note:
    if the query is about forecast, then you need to give the weather data for the next "number of days" days.
    if the query is about current weather, then you need to give the weather data for the current day.
    if Number of Days >5 then response should be "I'm sorry, I can't provide weather data for more than 5 days."
    

    Query: {query}
    Query Analysis: {queryAnalysis}
    Weather Data: {weatherData}
    Number of Days: {numberOfDays}

    If the weather data indicates rain or precipitation, mention that clearly.
    If the user asked about "raining cats and dogs", interpret this as heavy rain.
    If the weather data shows sunny conditions, emphasize the good weather.
    If the query mentions a time that's not covered by the weather data, acknowledge the limitation.
    Describe the weather in a way that is easy to understand.
    

    Your response should be concise (2-3 sentences) but informative and natural-sounding.
    `,
    inputVariables: ["query", "queryAnalysis", "weatherData", "numberOfDays"]
});

const analyzeQuery = async (input) => {

    const today = new Date();
    // console.log("🔍 Today:\n", weekDays[today.getDay()]);
    const modifiedQuery= input.query + " [note : today is " + weekDays[today.getDay()] + "]";
    const analysis = await queryAnalyzer.pipe(model).pipe(outputParser).invoke({ query: modifiedQuery });

    // Simulate weather data for now
    
    // console.log("🔍 Query Analysis:\n", analysis);
    // Parse location & date (simple example, refine as needed)
    const locationMatch = analysis.match(/Location:\s*(.*)/i);
    const dateMatch = analysis.match(/TimeReference:\s*(.*)/i);
    
    const location = locationMatch?.[1]?.trim().replace(/\*/g, '').trim() || 'Dhaka';
    const date = dateMatch?.[1]?.trim().replace(/\*/g, '').trim() || 'today';
    const type = analysis.match(/Type:\s*(.*)/i)?.[1]?.trim() || 'current weather';
    const numberOfDays = analysis.match(/NumberOfDays:\s*(.*)/i)?.[1]?.trim() || 0;

    // console.log("🔍 Modified Query:\n", modifiedQuery);
    console.log("🔍 Type:\n", type);
    console.log("🔍 Number of Days:\n", numberOfDays);

    var weatherData = null;
    weatherService.getForecast2(location, parseInt(numberOfDays)+2);
    
    if (type.trim().toLowerCase() === "forecast") {
        weatherData = await weatherService.getForecast(location, numberOfDays);
        console.log("🔍 Weather Data:\n", weatherData);
    } else {
        weatherData = await weatherService.getCurrentWeather(location);
    }
    
    // console.log("🔍 Weather Data:\n", weatherData);

    return {
        query: modifiedQuery,
        queryAnalysis: analysis,
        weatherData,
        numberOfDays
    };
}

const weekDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// Final Chain: Query → Analysis → [mocked weather data] → Response
const chain = RunnableSequence.from([
    analyzeQuery,
    responseGenerator,
    model,
    outputParser
]);

// Executable agent class
class Agent {
    constructor() {
        this.chain = chain;
    }

    async execute(query) {
        const result = await this.chain.invoke({ query });
        return result;
    }
}



// Test run
// async function main() {
//     const agent = new Agent();
//     const result = await agent.execute("could you tell me if there's any chance of downpour in dhaka this afternoon?");
//     console.log("💬 Final Response:\n", result);
// }

// main();

module.exports = Agent  
