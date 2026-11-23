#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 StudyOS WS 26/27 Lernplattform läuft auf http://localhost:8080"
python3 -m http.server 8080
