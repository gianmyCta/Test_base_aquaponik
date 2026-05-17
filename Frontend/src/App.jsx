import { useEffect, useState } from "react";
import Button from "./components/Button";

function App() {
  const [socket, setSocket] = useState(null);

  const [message, setMessage] = useState("");

  const [busy, setBusy] = useState(false);

  const [inputValue, setInputValue] = useState("");

  // input funzioni
  const [func5Input, setFunc5Input] = useState("");

  const [func6Input, setFunc6Input] = useState("");

  const [func7Input, setFunc7Input] = useState("");

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}/ws`);
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
    }, 1000);

    return () => clearInterval(interval);
  }, [socket]);

  const runScript = (functionName) => {
    if (!socket) return;

    const payload = {
      function: functionName,
    };

    socket.send(JSON.stringify(payload));
  };
  // funzioni con parametri
  const runScriptWithInput = (functionName, value) => {
    if (!socket) return;

    const payload = {
      function: functionName,

      params: {
        text: value,
      },
    };

    socket.send(JSON.stringify(payload));
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
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          columnGap: "100px",
          alignItems: "start",
          marginTop: "5%",

          // GLASSMORPHISM
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",

          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "16px",

          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",

          padding: "20px",
        }}
      >
        <Button text="Func 1" onClick={() => runScript("func_1")} />

        <Button text="Func 2" onClick={() => runScript("func_2")} />

        <Button text="Func 3" onClick={() => runScript("func_3")} />

        <Button text="Func 4" onClick={() => runScript("func_4")} />

        {/* Funzioni  con parametri stringa */}
        {/* FUNC 5 */}

        <div style={{ display: "flex", gap: "20px" }}>
          <Button
            text="Func 5"
            onClick={() => runScriptWithInput("func_5", func5Input)}
          />

          <input
            style={{ borderRadius: "20px", textAlign: "center" }}
            placeholder="Input Func 5"
            value={func5Input}
            onChange={(e) => setFunc5Input(e.target.value)}
          />
        </div>

        {/* FUNC 6 */}

        <div style={{ display: "flex", gap: "20px" }}>
          <Button
            text="Func 6"
            onClick={() => runScriptWithInput("func_6", func6Input)}
          />

          <input
            style={{ borderRadius: "20px", textAlign: "center" }}
            placeholder="Input Func 6"
            value={func6Input}
            onChange={(e) => setFunc6Input(e.target.value)}
          />
        </div>

        {/* FUNC 7 */}

        <div style={{ display: "flex", gap: "20px" }}>
          <Button
            text="Func 7"
            onClick={() => runScriptWithInput("func_7", func7Input)}
          />

          <input
            style={{ borderRadius: "20px", textAlign: "center" }}
            placeholder="Input Func 7"
            value={func7Input}
            onChange={(e) => setFunc7Input(e.target.value)}
          />
        </div>
      </div>
      <pre>{message}</pre>
    </div>
  );
}

export default App;
