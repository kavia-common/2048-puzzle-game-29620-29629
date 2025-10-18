#!/bin/bash
cd /home/kavia/workspace/code-generation/2048-puzzle-game-29620-29629/2048_game_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

