import { useEffect, useState } from "react";
import Button from "./components/Button";

function App() {
  const [socket, setSocket] = useState(null);

  const [message, setMessage] = useState("");

  const [busy, setBusy] = useState(false);

  const [inputValue, setInputValue] = useState("");

  // input funzioni
  const [camera_offsetInput, setCamera_offsetInput] = useState("");

  const [vai_aInput, setVai_aInput] = useState("");

  const [imposta_posizioneInput, setImposta_posizioneInput] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
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
          gridTemplateColumns: "0.2fr 0.2fr 0.2fr",
          gap: "30px",
          columnGap: "10px",
          alignItems: "start",
          marginTop: "5%",
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          padding: "10px",
        }}
      >
        <Button text="Spiega" onClick={() => runScript("spiega")} />

        <Button text="Dispiega" onClick={() => runScript("dispiega")} />

        <Button
          text="Passa a destra"
          onClick={() => runScript("passa_a_destra")}
        />

        <Button
          text="Passa a sinistra"
          onClick={() => runScript("Passa_a_sinistra")}
        />

        <Button
          text="Posizione fotografia"
          onClick={() => runScript("posizione_fotografia")}
        />

        <Button
          text="Posizione centrale"
          onClick={() => runScript("posizione_centrale")}
        />

        <Button text="Quota z" onClick={() => runScript("quota_z")} />

        <Button text="Test" onClick={() => runScript("test")} />

        {/* Funzioni  con parametri stringa */}

        {/* CAMERA OFFSET */}

        <div style={{ display: "flex", gap: "20px" }}>
          <Button
            text="Camera offset"
            onClick={() =>
              runScriptWithInput("camera_offset", camera_offsetInput)
            }
          />

          <input
            style={{ borderRadius: "20px", textAlign: "center" }}
            placeholder="Input camera_offset"
            value={camera_offsetInput}
            onChange={(e) => setCamera_offsetInput(e.target.value)}
          />
        </div>

        {/* VAI A*/}

        <div style={{ display: "flex", gap: "20px" }}>
          <Button
            text="Vai a "
            onClick={() => runScriptWithInput("vai_a", vai_aInput)}
          />

          <input
            style={{ borderRadius: "20px", textAlign: "center" }}
            placeholder="Input Vai a"
            value={vai_aInput}
            onChange={(e) => setVai_aInput(e.target.value)}
          />
        </div>

        {/* IMPOSTA POSIZIONE */}

        <div style={{ display: "flex", gap: "20px" }}>
          <Button
            text="Imposta posizione"
            onClick={() =>
              runScriptWithInput("imposta_posizione", imposta_posizioneInput)
            }
          />

          <input
            style={{ borderRadius: "20px", textAlign: "center" }}
            placeholder="Input Imposta posizione"
            value={imposta_posizioneInput}
            onChange={(e) => setImposta_posizioneInput(e.target.value)}
          />
        </div>
      </div>
      <pre>{message}</pre>
    </div>
  );
}

export default App;
