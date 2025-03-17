import React, { useState } from 'react';
import './bot.css';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { SampleJSONData } from './jsondata';
import { LuLanguages, LuLoader } from "react-icons/lu";
import GitHubRedirect from './GitHubRedirect'; // Ensure this import path is correct

function HelpBot() {
  // Direct API key (⚠️ Not recommended for production)
  const API_KEY = "AIzaSyBBpeI6IpfhoYgMJSOz3Od_7CoIYL_YOkY";

  const genAI = new GoogleGenerativeAI(API_KEY);
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];
  const model = genAI.getGenerativeModel({ model: "gemini-pro-latest", safetySettings });


  const [selectedJSON, setSelectedJSON] = useState(SampleJSONData[0].data);
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('English'); // Default language
  const [response, setResponse] = useState('Welcome to Help Desk 🙏');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleJSONSelect = (event) => {
    const selectedId = parseInt(event.target.value);
    const selectedData = SampleJSONData.find(item => item.id === selectedId)?.data;
    setSelectedJSON(selectedData);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setResponse(''); // Clear previous response

    try {
      const inputText = JSON.stringify({
        jsonInput: selectedJSON,
        instruction: `You have to use the given data to answer this question. If it's not in the data, say that it's not mentioned. Answer as an Indian traffic police officer bot, and speak only in ${language}. Also, mention all the acts, clauses, and actions the Indian Government can take based on the crime. Do not use markdown.`,
        userPrompt: prompt,
      });

    const result = await model.generateContent({
  contents: [{ role: "user", parts: [{ text: prompt }] }]
});

      const textResponse = await result.response.text(); // Ensure text is accessed correctly
      setResponse(textResponse || "⚠️ No response from AI");
    } catch (error) {
      console.error("API Request Failed:", error);
      setResponse("⚠️ Error: Unable to fetch response. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <GitHubRedirect />
      <h1 style={{ textAlign: 'center' }}>✦ Traffic BOT ✦</h1>

      {isLoading ? (
        <div className="botloading">
          <LuLoader fontSize={40} />
        </div>
      ) : (
        <p className="output">{response}</p>
      )}

      <form onSubmit={handleSubmit}>
        {/* JSON Selection */}
        <div className="BOT_optionContainer">
          {SampleJSONData.map(json => (
            <div className="BOT_optionblock" key={json.id}>
              <input
                type="radio"
                id={`json${json.id}`}
                name="jsonData"
                value={json.id}
                checked={selectedJSON === json.data}
                onChange={handleJSONSelect}
              />
              <label htmlFor={`json${json.id}`}>{json.name}</label>
            </div>
          ))}
        </div>

        {/* Language Selection */}
        <div className="BOT_optionContainer">
          <div className="BOT_optionblock">
            <LuLanguages />
            <input
              type="radio"
              id="englishLanguage"
              name="language"
              value="English"
              checked={language === "English"}
              onChange={handleLanguageChange}
            />
            <label htmlFor="englishLanguage">English</label>
          </div>
          <div className="BOT_optionblock">
            <LuLanguages />
            <input
              type="radio"
              id="hindiLanguage"
              name="language"
              value="Hindi"
              checked={language === "Hindi"}
              onChange={handleLanguageChange}
            />
            <label htmlFor="hindiLanguage">Hindi</label>
          </div>
        </div>

        {/* Input Box */}
        <div>
          <input
            type="text"
            id="promptInput"
            autoComplete="off"
            className="BOT_inputbox"
            placeholder="Enter Your Query / अपनी समस्या दर्ज करें"
            value={prompt}
            onChange={handlePromptChange}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            color: 'white',
            cursor: 'pointer',
            background: 'linear-gradient(45deg, #535353, #767676, #4c4c4c)',
            width: '50%',
            margin: '4vh 25%',
            fontSize: '2rem',
            borderRadius: '0.7rem',
            padding: '0 1rem',
            border: 'none',
          }}
        >
          Submit / जमा करें
        </button>
      </form>
    </div>
  );
}

export default HelpBot;
