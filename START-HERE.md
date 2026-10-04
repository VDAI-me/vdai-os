# Start VDAI OS / Запуск VDAI OS

## English

1. Extract the downloaded ZIP into a new folder. Keep all files together.
2. On Mac double-click **Start VDAI.command**; on Windows double-click **Start VDAI.cmd**. Read and approve the local setup prompt. The launcher checks requirements and guides you through startup, local administrator creation and application authorization.

This is a source bundle with a guided launcher, not a signed application installer. macOS or Windows may block downloaded scripts. Do not disable OS security globally. Read the script first; you can run `bash scripts/start-guided.sh` in Terminal / Git Bash from the extracted folder instead.

### Before starting

- [Docker Desktop](https://docs.docker.com/desktop/), or your existing Docker runtime (such as Colima on Mac): keep a working runtime and start it. It downloads container images and stores a local database; check Docker's license terms for your organization.
- [Node.js 24](https://nodejs.org/en/download): version 24.5 or later, below 25.
- pnpm 11.19: with Node installed, run `npm install --global pnpm@11.19.0` once.
- Windows also needs [Git for Windows](https://git-scm.com/downloads/win), including Git Bash.
- The launcher also checks OpenSSL and curl. Install missing tools using your platform's trusted package manager.

The launcher never installs prerequisites, asks for sudo, bypasses OS security or removes data. `bash scripts/start-guided.sh --check` checks requirements without starting or installing anything. If a tool is missing, fix that requirement and rerun the same launcher.

### What you will see

The terminal shows progress. Once Twenty is ready, open **http://localhost:3000**, create your own local administrator, return to the terminal and press Enter. The Twenty CLI opens an OAuth authorization page; approve only your local workspace. The launcher then applies the VDAI application. Check that Projects and Tasks appear before calling the installation complete.

Your local copy is separate from the VDAI team's database. To work together, ask Dmitrii for a named project invitation. Do not share your local administrator password or API keys.

Stop safely with `docker compose down` from the extracted folder. This preserves data. Rerunning the launcher uses the existing local configuration. Never add `--volumes` unless you intend to delete the database.

## Русский

1. Распакуйте ZIP в новую папку. Не перемещайте запускной файл отдельно.
2. Mac: **Start VDAI.command**. Windows: **Start VDAI.cmd**. Прочитайте и подтвердите запуск локальной установки.

Это исходники с мастером запуска, а не подписанный установщик. Защита ОС может остановить скачанный скрипт. Не отключайте её целиком. После проверки кода можно запустить `bash scripts/start-guided.sh` из папки комплекта в Terminal / Git Bash.

Сначала установите Docker Desktop и запустите его, Node 24.5+ (ниже 25) и pnpm 11.19 (`npm install --global pnpm@11.19.0`). Windows также нужен Git for Windows с Git Bash. Мастер проверяет OpenSSL и curl; недостающие инструменты устанавливаются через доверенный менеджер пакетов вашей системы. Ссылки выше ведут к официальным источникам.

Мастер проверит зависимости, запросит согласие и запустит локальную ОС. Откройте **http://localhost:3000**, создайте администратора, вернитесь в терминал и нажмите Enter. Подтвердите OAuth только для своей локальной ОС; затем мастер применит приложение VDAI. Готовность: в браузере видны проекты и задачи.

Общая база команды не подключается автоматически: нужно персональное приглашение. Пароли и API-ключи никому не передавайте. Для остановки с сохранением данных: `docker compose down`. Проверка без установки: `bash scripts/start-guided.sh --check`.
