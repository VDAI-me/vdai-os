#!/usr/bin/env bash
# Public local setup. No sudo, prerequisite installation, UI automation or deletion.
set -euo pipefail
project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"
lang="${VDAI_LANGUAGE:-en}"
say() { if [[ "$lang" == ru ]]; then printf '%s\n' "$2"; else printf '%s\n' "$1"; fi; }
fail() { say "$1" "$2" >&2; exit 1; }
mode="${1:-}"
if [[ "$mode" != '' && "$mode" != --check ]]; then fail 'Use --check to check requirements only.' 'Используйте --check для проверки зависимостей.'; fi
say 'VDAI OS · local setup' 'VDAI OS · локальная установка'
missing=0
for tool in docker node pnpm openssl curl; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    say "Missing: $tool. See START-HERE.md for the official download." "Не найден $tool. Ссылка на установку: START-HERE.md."
    missing=1
  fi
done
[[ "$missing" == 0 ]] || exit 1
node -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a===24&&b>=5?0:1)' || fail 'Node 24.5+ (below 25) is required. Install Node 24, then retry.' 'Нужен Node 24.5+ (ниже 25). Установите Node 24 и повторите запуск.'
pnpm_version="$(pnpm --version)"
[[ "$pnpm_version" == 11.* ]] && [[ "$(printf '%s' "$pnpm_version" | cut -d. -f2)" -ge 19 ]] || fail 'pnpm 11.19+ (below 12) is required. See START-HERE.md.' 'Нужен pnpm 11.19+ (ниже 12). См. START-HERE.md.'
docker compose version >/dev/null 2>&1 || fail 'Docker Compose is missing. Install Docker Desktop.' 'Нет Docker Compose. Установите Docker Desktop.'
docker info >/dev/null 2>&1 || fail 'Docker is not running. Start your existing runtime (Docker Desktop, Colima or Docker Engine), wait until ready, then retry.' 'Docker не запущен. Запустите свою среду (Docker Desktop, Colima или Docker Engine), дождитесь готовности и повторите.'
say 'Requirements OK.' 'Зависимости готовы.'
[[ "$mode" != --check ]] || exit 0
if [[ -f .env ]]; then
  node -e 'const fs=require("fs");const entries=fs.readFileSync(".env","utf8").split(/\r?\n/).filter(s=>/^(VDAI_BIND|VDAI_PORT|SERVER_URL)=/.test(s));const allowed={VDAI_BIND:"127.0.0.1",VDAI_PORT:"3000",SERVER_URL:"http://localhost:3000"};process.exit(entries.every(s=>{const i=s.indexOf("=");return s.slice(i+1)===allowed[s.slice(0,i)]})?0:1)' || fail 'This folder has a custom configuration. Use SETUP.md; this launcher supports localhost:3000 only.' 'В папке нестандартная конфигурация. Используйте SETUP.md: мастер поддерживает только localhost:3000.'
fi
[[ "${VDAI_BIND:-127.0.0.1}" == 127.0.0.1 && "${VDAI_PORT:-3000}" == 3000 && "${SERVER_URL:-http://localhost:3000}" == http://localhost:3000 ]] || fail 'Custom server configuration is unsupported by this launcher.' 'Мастер не поддерживает нестандартную конфигурацию сервера.'
say 'This will download dependencies and run a private local database on port 3000. It does not join the shared team. Continue? [y/N]' 'Будут скачаны зависимости и запущена личная база на порту 3000. Общая команда не подключается. Продолжить? [y/N]'
read -r consent
[[ "$consent" == y || "$consent" == Y ]] || exit 0
# Refuse to attach the app to an existing unrelated service on the default port.
if [[ ! -f .env ]] && curl -s --max-time 2 http://127.0.0.1:3000/ >/dev/null 2>&1; then
  fail 'Port 3000 is already in use. Stop the other service or ask the project owner for help.' 'Порт 3000 занят. Остановите другой сервис или обратитесь к владельцу проекта.'
fi
pnpm install --frozen-lockfile
bash scripts/bootstrap.sh
say 'Waiting for the local workspace (up to 5 minutes)…' 'Ждём локальную ОС (до 5 минут)…'
ready=0
for ((attempt=0; attempt<100; attempt++)); do
  if curl --fail --silent --max-time 3 http://127.0.0.1:3000/healthz >/dev/null; then ready=1; break; fi
  sleep 3
done
[[ "$ready" == 1 ]] || fail 'Startup timed out. See: docker compose logs --tail 50 server. Your data is preserved.' 'ОС не запустилась вовремя. Диагностика: docker compose logs --tail 50 server. Данные сохранены.'
say 'Open http://localhost:3000 in your browser. Create your local administrator. Return here and press Enter when done.' 'Откройте http://localhost:3000 в браузере. Создайте локального администратора. Вернитесь сюда и нажмите Enter.'
read -r completed
say 'Next, authorize VDAI for your LOCAL workspace in the OAuth page opened by Twenty. Check the address before approving.' 'Далее разрешите VDAI доступ к ЛОКАЛЬНОЙ ОС на странице OAuth от Twenty. Проверьте адрес перед подтверждением.'
pnpm twenty remote:add --url http://localhost:3000
pnpm twenty apply
say 'VDAI application applied. Open http://localhost:3000 and check that Projects and Tasks are visible. Shared team access still requires an invitation.' 'Приложение VDAI применено. Откройте http://localhost:3000 и проверьте проекты и задачи. Для общей команды ещё нужно приглашение.'
