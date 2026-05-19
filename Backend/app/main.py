import socket

from fastapi import FastAPI, WebSocket

app = FastAPI()

UDP_IP = "127.0.0.1"
UDP_PORT = 8000

udp_socket = socket.socket(
    socket.AF_INET,
    socket.SOCK_DGRAM
)


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):

    await ws.accept()

    while True:

        message = await ws.receive_text()

        print(f"SENDING UDP: {message}")

        udp_socket.sendto(
            message.encode(),
            (UDP_IP, UDP_PORT)
        )

        await ws.send_text(
            f"SENT: {message}"
        )