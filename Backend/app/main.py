import json
from fastapi import FastAPI, WebSocket
import app.function_runner as function_runner
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

app.mount(
    "/assets",
    StaticFiles(directory="static/dist/assets"),
    name="assets"
)

@app.get("/")
async def serve_frontend():

    return FileResponse(
        "static/dist/index.html"
    )

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):

    await ws.accept()

    while True:

        data = await ws.receive_text()

        # richiesta stato
        if data == "status":

            await ws.send_text(
                "busy" if function_runner.busy else "idle"
            )

            continue

        # PARSE JSON
        payload = json.loads(data)

        function_name = payload["function"]

        params = payload.get("params", {})

        print(payload)

        # funzione non valida
        if function_name not in function_runner.FUNCTIONS:

            await ws.send_text(
                "Funzione non autorizzata"
            )

            continue

        # se occupato
        if function_runner.busy:

            await ws.send_text(
                "Sistema occupato"
            )

            continue

        # busy ON
        function_runner.busy = True

        await ws.send_text("busy")

        try:

            result = await function_runner.run_function(
                function_name,
                params
            )

            await ws.send_text(result)

        except Exception as e:

            await ws.send_text(str(e))

        finally:

            # busy OFF
            function_runner.busy = False

            await ws.send_text("idle")

#  uvicorn app.main:app --host 0.0.0.0 --port 8000           