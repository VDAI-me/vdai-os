#!/usr/bin/env bash
cd "$(dirname "$0")" || exit 1
bash scripts/start-guided.sh
vdai_exit=$?
printf '\nPress Enter to close / Enter — закрыть\n'
read -r vdai_close
exit "$vdai_exit"
