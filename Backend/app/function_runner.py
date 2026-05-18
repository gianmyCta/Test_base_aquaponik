import asyncio
from app.python_test import sequenze
from app.python_test import test

busy = False

FUNCTIONS = {
    "spiega": sequenze.spiega,
    "dispiega": sequenze.dispiega,
    "passa_a_destra": sequenze.passa_a_destra,
    "Passa_a_sinistra": sequenze.passa_a_sinistra,
    "posizione_fotografia": sequenze.posizione_fotografia,
    "posizione_centrale": sequenze.posizione_centrale,
    "quota_z": sequenze.quota_z,
    "camera_offset": sequenze.camera_offset,
    "imposta_posizione": sequenze.imposta_posizione,
    "test":test.test,
}


async def run_function(
    function_name: str,
    params: dict = None
):

    func = FUNCTIONS[function_name]

    # funzione senza parametri
    if not params:

        result = await asyncio.to_thread(func)

    # funzione con parametri
    else:

        result = await asyncio.to_thread(
            func,
            **params
        )

    return str(result)