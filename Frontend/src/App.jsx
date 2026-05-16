import { useEffect, useState } from "react";

function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      console.log("Connesso al backend");
    };

    ws.onmessage = (event) => {
      setMessage(event.data);
    };

    setSocket(ws);

    return () => ws.close();
  }, []);

  const runScript = () => {
    if (socket) {
      socket.send("test");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Test Platform</h1>

      <button onClick={runScript}>Avvia Script</button>

      <pre>{message}</pre>
    </div>
  );
}

export default App;
