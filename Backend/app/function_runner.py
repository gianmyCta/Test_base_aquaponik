import asyncio
from app import sequenze

busy = False

FUNCTIONS = {
    "func_1": sequenze.func_1,
    "func_2": sequenze.func_2,
    "func_3": sequenze.func_3,
    "func_4": sequenze.func_4,
    "func_5": sequenze.func_5,
    "func_6": sequenze.func_6,
    "func_7": sequenze.func_7,
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