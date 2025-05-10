const Agent = require('../service/langchain/agent');
const weatherAgent = new Agent();
const QueryHistory = require('../models/QueryHistory');
const speechService = require('../service/speech/speechService');

const textQueryController = {
    query: async (req, res) => {
        try {
            const { query } = req.body;
            console.log("🔍 Query:\n", query);

            // Check if query exists
            
            const last5Queries = await QueryHistory.findAll({
                order: [['createdAt', 'DESC']],
                limit: process.env.HISTORY_LIMIT ,
                attributes: ['query'],
                raw: true,
                logging: console.log
                
            });
            // console.log("🔍 Last 5 Queries:\n", last5Queries); 
            
            const existingQuery = await QueryHistory.findOne({ 
                where: { query: query } ,
                attributes: ['query', 'createdAt', 'response'],
                raw: true
            });
            if (existingQuery) {
                const now = new Date();
                const createdAt = new Date(existingQuery.createdAt);
                const timeDiff = now - createdAt;
                const timeDiffInMinutes = timeDiff / (1000 * 60);
                console.log("🔍 Time difference in minutes:\n", timeDiffInMinutes);
                if(timeDiffInMinutes > process.env.CACHE_TIME ){
                    console.log("🔍 Query already exists, but it is older than ", process.env.CACHE_TIME, " minutes, so we need to update the response");
                    const modifiedQuery = query + "\n\n query history: " + last5Queries.map(q => q.query).join("\n");
                    const result = await weatherAgent.execute(modifiedQuery);
                    await QueryHistory.update({
                        response: result,
                        createdAt: new Date()
                    }, {
                        where: { query: query }
                    });
                    return res.json(result);
                }
                else{
                    console.log("🔍 Query already exists, returning cached response\n", existingQuery.response);

                    return res.json(existingQuery.response);
                }
            }
            const modifiedQuery = query + "\n\n query history: " + last5Queries.map(q => q.query).join("\n");
            // Get response from agent
            console.log("🔍 Modified Query:\n", modifiedQuery);
            
            const result = await weatherAgent.execute(modifiedQuery);
            
            // Extract location and date from the analysis
            // Store in database
            await QueryHistory.create({
                query,
                response: result
            });

            res.json(result);
        } catch (error) {
            console.error('Error processing query:', error);
            res.status(500).json({ error: 'Failed to process query' });
        }
    },

    // Get query history
    getHistory: async (req, res) => {
        try {
            const history = await QueryHistory.findAll({
                order: [['createdAt', 'DESC']],
                limit: 50 // Get last 50 queries
            });
            res.json(history);
        } catch (error) {
            console.error('Error fetching history:', error);
            res.status(500).json({ error: 'Failed to fetch query history' });
        }
    }
,
    voiceQuery: async (req, res) => {
        try {
            const { audioData } = req.body;
            if(!audioData){
                return res.status(400).json(
                    {
                        success: false,
                        message: "No audio data provided"
                    }
                );
            }
            // console.log("🔍 Audio data:\n", audioData);
            
            const text = await speechService.convertAudioToText(audioData);
            // const text = "what is the weather in pakistan";
            console.log("🔍 Text:\n", text);
            const result = await weatherAgent.execute("text");
            console.log("🔍 Result:\n", result);
            
            res.json(result);
        }
        catch (error) {
            console.error('Error processing voice query:', error);
            res.status(500).json({ error: 'Failed to process voice query' });
        }
    }   
}

module.exports = {textQueryController};

