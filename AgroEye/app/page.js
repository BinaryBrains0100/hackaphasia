"use client";
import { useState,useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [chatEnabled, setChatEnabled] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [isInitialScreen,setIsInitialScreen]=useState(true);
  useEffect(() => {
    // Generate random values for leaves after component mounts (on client)
    const generatedLeaves = Array.from({ length: 5 }).map(() => ({
      left: Math.random() * 100, // Random horizontal position
      duration: Math.random() * 3 + 5, // Random duration between 5 and 8 seconds
    }));
    setLeaves(generatedLeaves);
  }, []);
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setChatEnabled(true);

      const formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      setResponse("");
      setShowResponse(false); // Hide the response until fetched

      try {
        const res = await axios.post("http://127.0.0.1:8001/predict", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const ans=await axios.post("http://127.0.0.1:8000/chat/",
          {message:`Tell me about this ${res.data.prediction} in few lines`},
          { headers: { "Content-Type": "application/json" } }
        );

        setResponse(ans.data.response || "No response received from the server.");
        setShowResponse(true); // Show the response after fetching
      } catch (err) {
        console.error("Error:", err);
        setResponse("Error uploading image or fetching response.");
        setShowResponse(true); // Show error message
      } finally {
        setLoading(false);
      }
    }
  };
  //Handling Click
  const handleLogoClick=()=>{
    setIsInitialScreen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResponse("");
    setShowResponse(false); // Hide the response until fetched

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/chat/",
        { message: input },
        { headers: { "Content-Type": "application/json" } }
      );
      setResponse(res.data.response);
      setShowResponse(true); // Show the response after fetching
    } catch (err) {
      console.error("Error: ", err);
      setResponse("Error fetching response from server.");
      setShowResponse(true); // Show error message
    } finally {
      setLoading(false);
      setInput(""); // Clear input after submission
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    
    <div
      style={{
        backgroundColor: "#d4edda",
        height: "100vh",
        overflow: "auto",
        fontFamily: "Arial, sans-serif",
        color: "#155724",
        position: "relative",
      }}
    >
     <div className="falling-leaves">
      {leaves.map((leaf, i) => (
        <div
          key={i}
          className="leaf"
          style={{
            left: `${leaf.left}%`,
            animationDuration: `${leaf.duration}s`,
          }}
        ></div>
      ))}
    </div>
      {/* Logo */}
      {isInitialScreen ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            cursor: "pointer",
          }}
          onClick={handleLogoClick}
        >
          <img
            src="/logo.jpg"
            alt="Logo"
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "50%",
            }}
          /></div>):(
      <>
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!image ? (
          <label htmlFor="camera" style={{ cursor: "pointer" }}>
            <img
              src="camera-icon.jpg"
              alt="Camera Icon"
              style={{
                width: "150px",
                height: "150px",
                mixBlendMode: "color-burn",
              }}
            />
            <h1
              style={{
                fontSize: "50px",
              }}
              className="jaro"
            >
              AgroEye
            </h1>
            <input
              id="camera"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </label>
        ) : (
          <img
            src={image}
            alt="Uploaded"
            style={{
              width: "20rem",
              height: "20rem",
              borderRadius: "10%",
              objectFit: "cover",
            }}
          />
        )}
      </div>

      {/* Chat Response */}
      {showResponse && (
        <div
          style={{
            marginLeft: "5rem",
            marginRight: "5rem",
            marginBottom: "6rem",
            marginTop: "2rem",
            maxWidth: "90%",
            padding: "1rem",
            backgroundColor: "#ffffff",
            border: "1px solid #155724",
            borderRadius: "5px",
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}

      {/* Chatbox */}
      <div
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt here..."
          rows="2"
          disabled={!chatEnabled}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            padding: "0.5rem",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "1px solid #155724",
            backgroundColor: chatEnabled ? "#ffffff" : "#e9ecef",
            color: chatEnabled ? "#155724" : "#6c757d",
            resize: "none",
          }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!chatEnabled}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: chatEnabled ? "#155724" : "#6c757d",
            color: "#ffffff",
            fontSize: "1.5rem",
            border: "none",
            cursor: chatEnabled ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "..." : "➤"}
        </button>
      </div>
      </>)}
      <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Jaro:opsz@6..72&family=Jersey+25+Charted&family=Playwrite+GB+S:ital,wght@0,100..400;1,100..400&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
  `}</style>
      <style jsx>
    {`
    .falling-leaves {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    }
    .jaro{
      font-family: "Jaro", sans-serif;
      font-optical-sizing: auto;
      font-weight: 400;
      font-style:normal;
    }
    .leaf {
      position: absolute;
      width: 35px;
      height: 30px;
      background-image: url('/leaf.png');
      background-size: cover;
      animation: fall linear infinite;
    }
    @keyframes fall {
      0% {
        transform: translateY(-100%) rotate(0deg);
        opacity: 1;
      }
      80% {
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
  }
`}</style>
    </div>
  );
}
