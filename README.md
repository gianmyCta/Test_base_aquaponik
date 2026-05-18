Test_base_aquaponik

Guida rapida per installare ed eseguire il progetto.
Clonare la repository
git clone <URL_REPOSITORY>
cd Test_base_aquaponik
Setup iniziale

Il progetto include uno script automatico che:

crea il virtual environment Python
installa le dipendenze backend
installa le dipendenze frontend
esegue la build del frontend
Windows

Eseguire:

setup.bat

Attendere il completamento del setup.

Avvio del server

Dopo il setup iniziale:

start.bat

Lo script:

attiva il virtual environment
avvia FastAPI/Uvicorn

Server disponibile su:

http://127.0.0.1:8000
Struttura progetto
Test_base_aquaponik/
│
├── Backend/
│ ├── app/
│ ├── static/
│ ├── venv/
│ └── requirements.txt
│
├── setup.bat
├── start.bat
└── README.md
