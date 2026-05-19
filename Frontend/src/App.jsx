import { useEffect, useState } from "react";
import Button from "./components/Button";
import functions from "./functions.json";

function App() {
  const [socket, setSocket] = useState(null);

  const [message, setMessage] = useState("");

  const [busy, setBusy] = useState(false);

  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8001/ws");
    ws.onopen = () => {
      console.log("Connected");

      // richiesta stato iniziale
      ws.send("status");
    };

    ws.onmessage = (event) => {
      const data = event.data;

      console.log(data);

      // gestione stato
      if (data === "busy") {
        setBusy(true);
        return;
      }

      if (data === "idle") {
        setBusy(false);
        return;
      }

      // output normale
      setMessage(data);
    };

    setSocket(ws);

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const interval = setInterval(() => {
      socket.send("status");
    }, 3000);

    return () => clearInterval(interval);
  }, [socket]);

  const runScript = (functionName) => {
    if (!socket) return;

    // invia solo il nome funzione
    socket.send(functionName);
  };

  // funzioni con parametri
  const runScriptWithInput = (functionName, value) => {
    if (!socket) return;

    // formato:
    // funzione parametro
    const message = `${functionName} ${value}`;

    socket.send(message);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "1rem",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <h1>Aquaponik platform</h1>

        <div
          style={{
            width: 100,
            height: 50,
            borderRadius: 10,
            backgroundColor: busy ? "red" : "green",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 5,
          }}
        >
          <p>{busy ? "Occupato" : "Libero"}</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",

          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",

          width: "100%",

          maxWidth: "1400px",

          gap: "20px",

          alignItems: "start",

          margin: "5%",

          background: "rgba(255, 255, 255, 0.08)",

          backdropFilter: "blur(12px)",

          WebkitBackdropFilter: "blur(12px)",

          border: "1px solid rgba(255,255,255,0.2)",

          borderRadius: "16px",

          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",

          padding: "10px",
        }}
      >
        {functions.map((func) => (
          <div
            key={func.name}
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <Button
              text={func.label}
              onClick={() => {
                if (func.hasInput) {
                  runScriptWithInput(func.name, inputValues[func.name] || "");
                } else {
                  runScript(func.name);
                }
              }}
            />

            {func.hasInput && (
              <input
                style={{
                  borderRadius: "20px",
                  textAlign: "center",
                  padding: "10px",
                }}
                placeholder={`Input ${func.label}`}
                value={inputValues[func.name] || ""}
                onChange={(e) =>
                  setInputValues({
                    ...inputValues,
                    [func.name]: e.target.value,
                  })
                }
              />
            )}
          </div>
        ))}
      </div>
      <pre>{message}</pre>
    </div>
  );
}

export default App;
