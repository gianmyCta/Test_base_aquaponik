from fastapi import FastAPI, WebSocket
from app.script_runner import run_script

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):

    await ws.accept()

    while True:

        script_name = await ws.receive_text()

        result = await run_script(script_name)

        await ws.send_text(result)

        #uvicorn app.main:app --reload