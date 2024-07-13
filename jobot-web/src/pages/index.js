import { useState } from "react";
import ReactMarkdowm from 'react-markdown'
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Home() {
  const [apikey, setApiKey] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "You are an AI chatbot named Jobot. You are here to assist with any queries." }, 
  ]);
  

  async function sendRequest() {
    if (!apikey) {
      console.error("API key is required.");
      return;
    }

    console.log("Using API key:",  apikey);


    // update the message history
    const newMessage = {role: 'user', content: userMessage};
    const newMessages = [
      ...messages,
      newMessage
    ]

    setMessages(newMessages)
    setUserMessage("");

    console.log(apikey)
    const genAI = new GoogleGenerativeAI(apikey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are an AI chatbot named Jobot. You are here to assist with any queries."
    });

  
    const prompt = newMessage;
    console.log(prompt)
    
    const result = await model.generateContent(prompt.content);


    const results = await result.response.text();

   
    const newBotMessage = { role: 'bot', content: results};
    const newMessages2 = [...newMessages, newBotMessage]
    setMessages(newMessages2)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Navigation Bar */}
      <nav className="shadow px-4 py-2 flex flex-row justify-between items-center">
        <div className="text-xl font-bold">Jobot</div>
        <div>
          <input
            type="password"
            className="border p-2 rounded"
            onChange={(e) => setApiKey(e.target.value)}
            value={apikey}
            placeholder="API key here"
          ></input>
        </div>
      </nav>

      {/* Message History */}
      <div className="flex-1 overflow-y-scroll">
        <div className="w-full max-w-screen-md mx-auto px-4">
          {messages
          .filter((message)=> message.role !== 'system')
          .map((message, idx) => (
            <div key={idx} className="my-3">
              <div className={`font-bold ${message.role === "user" ? "text-blue-500" : "text-red-500"}`}>
                {message.role==='user' ? 'You':'Jobot'}:
              </div>
              <div className="text-lg prose"><ReactMarkdowm>{message.content}</ReactMarkdowm></div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input Box */}
      <div>
        <div className="w-full max-w-screen-md mx-auto flex px-4 pb-4">
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            className="border text-lg rounded-md p-1 flex-1"
            rows={1}
          />
          <button
            onClick={sendRequest}
            className="bg-blue-500 hover:bg-blue-600 border rounded-md text-white text-lg w-20 p-1 ml-2"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
