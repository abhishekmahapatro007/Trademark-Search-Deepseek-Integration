// server.js (Backend)
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import axios from "axios";
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openRouterApiKey = process.env.OPENROUTER_API_KEY;
const tmAiApiKey = process.env.TM_AI_API_KEY;

app.get("/test", (req, res) => {  // Super basic test route
    console.log("Test route hit!");
    res.send("Test successful!");
});

app.get("/api/search", async (req, res) => {
    console.log("API route hit!"); // Check if route is being hit
    const { keyword } = req.query;
    console.log("Keyword:", keyword); // Check the keyword

    const tmAiApiUrl = `https://tmsearch.ai/api/search/?keyword=${keyword}&api_key=${tmAiApiKey}`;

    try {
        const tmAiResponse = await fetch(tmAiApiUrl);
        if (!tmAiResponse.ok) {
            console.error("TM AI API Error Status:", tmAiResponse.status);
            const tmAiErrorData = await tmAiResponse.json();
            console.error("TM AI API Error Data:", tmAiErrorData);
            throw new Error(tmAiErrorData.message || `TM AI API responded with status: ${tmAiResponse.status}`);
        }

        const tmAiData = await tmAiResponse.json();
        const results = (tmAiData && Array.isArray(tmAiData.result)) ? tmAiData.result : [];

        let suggestion = null;

        if (results.length > 0) {
            try {
                const resultsToSend = results.slice(0, 10);

                const requestBody = {
                    model: 'openai/gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: `User Query: ${keyword}\nTM AI Results: ${JSON.stringify(resultsToSend)}\nAnalyze the TM AI results in the context of the user query. Suggest improvements to the query or summarize the results.`,
                        },
                    ],
                };

                const requestHeaders = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openRouterApiKey}`,
                };

                const openRouterResponse = await axios.post(
                    'https://openrouter.ai/api/v1/chat/completions',
                    requestBody,
                    { headers: requestHeaders }
                );

                if (openRouterResponse.data &&
                    openRouterResponse.data.choices &&
                    openRouterResponse.data.choices.length > 0 &&
                    openRouterResponse.data.choices[0].message &&
                    openRouterResponse.data.choices[0].message.content) {

                    suggestion = openRouterResponse.data.choices[0].message.content;
                } else {
                    console.error("Unexpected OpenRouter Response:", openRouterResponse.data);
                    suggestion = "Unexpected response format from OpenRouter.";
                }

            } catch (openRouterError) {
                console.error("OpenRouter Error:", openRouterError);
                if (openRouterError.response) {
                    console.error("OpenRouter Error Response Data:", openRouterError.response.data);
                    res.status(openRouterError.response.status).json({ error: openRouterError.response.data });
                } else if (openRouterError.request) {
                    console.error("OpenRouter Error Request:", openRouterError.request);
                    res.status(500).json({ error: "No response received from OpenRouter" });
                } else {
                    console.error("OpenRouter Error Message:", openRouterError.message);
                    res.status(500).json({ error: openRouterError.message });
                }
                suggestion = "Error analyzing with OpenRouter.";
            }
        } else {
            suggestion = "No trademark results found for your query.";
        }

        res.json({ results, suggestion });
        console.log("Response sent:", { results, suggestion }); // Check the response data

    } catch (tmAiError) {
        console.error("TM AI Error:", tmAiError);
        res.status(500).json({ error: tmAiError.message || "Error fetching data from TM AI API" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// frontend code
import React, { useEffect, useState } from 'react';
// ... other imports

const Results = () => {
    // ... other state variables

    useEffect(() => {
        if (!searchTerm) return;

        const fetchResults = async () => {
            const apiUrl = `http://localhost:5000/api/search?keyword=${encodeURIComponent(searchTerm)}`;
            console.log("Fetching from:", apiUrl); // Log the URL
            setLoading(true); // Set loading to true before fetching

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch results');
                }
                const data = await response.json();
                console.log("Data received:", data); // Log the data!
                setResults(Array.isArray(data.results) ? data.results : []);
                setAiSuggestion(data.suggestion || null);

            } catch (error) {
                console.error("Error fetching results:", error);
                setResults([]);
                setAiSuggestion("Error fetching trademark data.");
            } finally {
                setLoading(false); // Set loading to false whether successful or not
            }
        };

        fetchResults();
    }, [searchTerm]);

    // ... rest of your component code (JSX, etc.)

    return (
      <div>
        {/* ... other JSX ... */}
        {loading && <p>Loading...</p>} {/* Display loading message */}
        {results.length > 0 && (
          <div>
            {/* ... display results ... */}
          </div>
        )}
        {/* ... rest of your JSX ... */}
      </div>
    );
};

export default Results;

// import express from "express";
// import cors from "cors";
// import fetch from "node-fetch";
// import axios from "axios";
// import * as dotenv from 'dotenv';
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const openRouterApiKey = process.env.OPENROUTER_API_KEY;
// const tmAiApiKey = process.env.TM_AI_API_KEY;

// app.get("/api/search", async (req, res) => {
//     const { keyword } = req.query;
//     const tmAiApiUrl = `https://tmsearch.ai/api/search/?keyword=${keyword}&api_key=${tmAiApiKey}`;

//     try {
//         const tmAiResponse = await fetch(tmAiApiUrl);
//         if (!tmAiResponse.ok) {
//             const tmAiErrorData = await tmAiResponse.json();
//             throw new Error(tmAiErrorData.message || `TM AI API responded with status: ${tmAiResponse.status}`);
//         }

//         const tmAiData = await tmAiResponse.json();
//         const results = (tmAiData && Array.isArray(tmAiData.result)) ? tmAiData.result : [];

//         let suggestion = null;

//         if (results.length > 0) {
//             try {
//                 const resultsToSend = results.slice(0, 10); 

//                 const requestBody = {
//                     model: 'openai/gpt-3.5-turbo',
//                     messages: [
//                         {
//                             role: 'user',
//                             content: `User Query: ${keyword}\nTM AI Results: ${JSON.stringify(resultsToSend)}\nAnalyze the TM AI results in the context of the user query. Suggest improvements to the query or summarize the results.`, // Use resultsToSend
//                         },
//                     ],
//                 };

//                 const requestHeaders = {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${openRouterApiKey}`,
//                 };

//                 const openRouterResponse = await axios.post(
//                     'https://openrouter.ai/api/v1/chat/completions',
//                     requestBody,
//                     { headers: requestHeaders }
//                 );

//                 if (openRouterResponse.data &&
//                     openRouterResponse.data.choices &&
//                     openRouterResponse.data.choices.length > 0 &&
//                     openRouterResponse.data.choices[0].message &&
//                     openRouterResponse.data.choices[0].message.content) {

//                     suggestion = openRouterResponse.data.choices[0].message.content;
//                 } else {
//                     console.error("Unexpected OpenRouter Response:", openRouterResponse.data);
//                     suggestion = "Unexpected response format from OpenRouter.";
//                 }

//             } catch (openRouterError) {
//                 console.error("OpenRouter Error:", openRouterError);
//                 if (openRouterError.response) {
//                     console.error("OpenRouter Error Response Data:", openRouterError.response.data);
//                     res.status(openRouterError.response.status).json({ error: openRouterError.response.data });
//                 } else if (openRouterError.request) {
//                     console.error("OpenRouter Error Request:", openRouterError.request);
//                     res.status(500).json({ error: "No response received from OpenRouter" });
//                 } else {
//                     console.error("OpenRouter Error Message:", openRouterError.message);
//                     res.status(500).json({ error: openRouterError.message });
//                 }
//                 suggestion = "Error analyzing with OpenRouter.";
//             }
//         } else {
//             suggestion = "No trademark results found for your query.";
//         }

//         res.json({ results, suggestion });

//     } catch (tmAiError) {
//         console.error("TM AI Error:", tmAiError);
//         res.status(500).json({ error: tmAiError.message || "Error fetching data from TM AI API" });
//     }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
