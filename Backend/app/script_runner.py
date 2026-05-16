import asyncio

ALLOWED_SCRIPTS = {
    "test": "app/scripts/test.py"
}

async def run_script(script_name: str):

    if script_name not in ALLOWED_SCRIPTS:
        return "Script non autorizzato"

    script_path = ALLOWED_SCRIPTS[script_name]

    process = await asyncio.create_subprocess_exec(
        "python",
        script_path,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )

    stdout, stderr = await process.communicate()

    if stderr:
        return stderr.decode()

    return stdout.decode()