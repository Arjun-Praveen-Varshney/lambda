// import logo from './logo.svg';
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import "./App.css";

function App() {
  const [inputvalue, setinputvalue] = useState("");
  const [startchat, setstartchat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setloading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "querybox") {
      setinputvalue(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valueofinput = inputvalue;
    appendMessage("user", inputvalue);
    setinputvalue("");
    setstartchat(true);
    setloading(true);

    let result = await fetch(
      `https://schptrorye.execute-api.us-east-1.amazonaws.com/llama_lambda_medical_new?query=${valueofinput}`
    );
    const answer = await result.text().then((responseText) => {
      return responseText.substring(1, responseText.length - 1);
    });
    setloading(false);
    appendMessage("bot", answer);
  };

  function appendMessage(sender, message) {
    const newMessage = {
      sender,
      message,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }

  return (
    <div className="flex text-white h-screen">
      <div className="bg-black opacity-[0.88] w-2/12"></div>
      <div className="bg-chatblack-50 w-10/12">
        <div className="flex flex-col justify-between h-full">
          {!startchat ? (
            <div className="flex items-center justify-center w-full h-4/5 text-5xl font-semibold">
              Lambda
            </div>
          ) : (
            <div id="chat-window" className="overflow-y-auto h-4/5">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-6 ${
                    message.sender === "user"
                      ? "user-message"
                      : "bot-message bg-[#444654]"
                  }`}
                >
                  {message.sender === "user"
                    ? `User: ${message.message}`
                    : `Bot: ${message.message}`}
                </div>
              ))}
              {loading && (
                <div className="p-6">
                  <ThreeDots
                    height="50"
                    width="50"
                    radius="9"
                    color="white"
                    ariaLabel="three-dots-loading"
                  />
                </div>
              )}
            </div>
          )}
          <form
            className="flex items-center justify-center h-1/5 bottom-0 w-10/12 right-0 z-10 fixed bg-chatblack-50"
            onSubmit={handleSubmit}
          >
            <div className="bg-gray-500 bg-opacity-25 rounded-xl w-3/5 flex">
              <input
                onChange={handleChange}
                value={inputvalue}
                className="flex-1 p-4 bg-transparent outline-none hover:cursor-pointer"
                placeholder="Ask your Query!"
                name="querybox"
                type="text"
              />
              <button type="submit" className="hover:cursor-pointer px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4"
                    fill="#ffffff"
                    fillOpacity="0.25"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
