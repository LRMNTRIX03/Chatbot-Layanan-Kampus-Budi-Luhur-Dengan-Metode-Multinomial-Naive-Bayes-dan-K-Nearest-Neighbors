import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import useTraining from "../../hooks/useTraining";

export default function LayananPage() {
  const { messages, sendMessage, chatEndRef, loading } = useTraining();
  const [input, setInput] = useState("");
  const [model, setModel] = useState("NB");

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage(input, model);
      setInput("")
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-400 p-2 rounded-2xl shadow-lg mb-4">
           <img src="src/assets/img/logo-bl.png" alt="Logo Universitas Budi Luhur" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent">
           Blutizen Assistant
          </h1>
            <p className="text-gray-600 mt-2">Siap membantu Blutizen 24/7</p>
          <div className="flex gap-3 mt-4 justify-center">
            <div className="flex gap-3 justify-center">
           
            <input type="radio" name="radio1" id="radio1"
            value="NB"
            onChange={(e) => setModel(e.target.value)}
            checked={model === "NB"} />
             <label htmlFor="radio1">Model 1</label>
            </div>
            <div className="flex gap-2 justify-center">
           
            <input type="radio" name="radio2" id="radio2"
            value="KNN"
            onChange={(e) => setModel(e.target.value)}
            checked={model === "KNN"} />
             <label htmlFor="radio2">Model 2</label>
            </div>
          </div>
        
        </div>

        {/* Chat Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl flex flex-col h-[650px] overflow-hidden border border-white/20">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-3 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } animate-in slide-in-from-bottom-4 duration-300`}
              >
                {msg.sender === "bot" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    <img src="src/assets/img/logo-bl.png" className="w-full h-full text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-md px-5 py-3 rounded-2xl shadow-md ${
                    msg.sender === "user"
                      ? "bg-gray-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>

                {msg.sender === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex items-end gap-3 justify-start animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white text-gray-800 px-5 py-3 rounded-2xl rounded-bl-sm shadow-md border border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ketik pesan Anda di sini..."
                className="flex-1 border border-gray-300 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm"
              />
              <button
                onClick={() => sendMessage(input, model)}
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white p-3 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

       
        <p className="text-center text-gray-500 text-sm mt-4">
          Copyrights @Lutfi Rizaldi Mahida - 2211501180
        </p>
      </div>
    </div>
  );
}