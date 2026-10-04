# Optional AI work format

**1. Download and extract the starter ZIP.** Keep this folder separate from an existing project so its instructions do not replace your own.

**2. Open the extracted VDAI-Start folder as a project in Codex.** Send:

> Read AGENTS.md and confirm the source. First ask what tools, integrations, persistent rules and automation already work for me. Assess only what a real example demonstrates. Mark unknowns as unknown and suggest one optional improvement. Do not replace settings, install or publish anything.

Codex reads AGENTS.md as project instructions. For another AI tool, explicitly ask it to read and follow that file; automatic loading is not assumed. The kit uses Python 3 for optional automatic format checks; it does not require Docker, Node, Git or a CRM account. If Python is missing, the AI must follow the visible format manually and say the checker did not run.

**Proof it works:** the AI names the loaded file, produces a useful result and evidence, shows P/U/L/R/N, offers actions 1–4 or 1–5, then continues numbering in its next substantive response. The checker must report PASS if used. Ask the AI to save a draft as UTF-8 and run `python3 tools/check-response.py --task first-task --draft <path> --commit-visible`.

This installs no global preferences, native sidebar hooks or personal task registry. Your chats do not acquire Dmitrii's private IDs or colours. Agree on the real project identity and colour with its owner.

**Next:** visit https://os.vdai.me/en/install/mac/ or the Windows counterpart for the optional local OS. A local database is separate from the shared VDAI team. Personal invitation and account access remain separate.

## Русский

1. Скачайте и распакуйте стартовый комплект в отдельную папку.
2. Откройте VDAI-Start как проект в Codex. Попросите прочитать AGENTS.md, подтвердить источник и выполнить одну небольшую задачу с результатом, проверкой, критикой, ProblemOS и нумерованными следующими действиями. Комплект и установка ОС — по желанию.

Проверка: полезный ответ, P/U/L/R/N и 4–5 действий; следующий ответ продолжает номера. Для проверки формата нужен Python 3. Комплект не перезаписывает личные настройки и не меняет sidebar автоматически. Для общей работы владелец подтверждает ID, цвет и доступ.

## Control and verification prompts

Use https://os.vdai.me/en/support/ to choose a system, stage and redacted error. It generates a local prompt for diagnosis, installation, VDAI readback, Bridge check, one defect repair or workflow improvement. It does not inspect your computer or operate a cloud AI. Each stage has expected evidence, a blocker and a next check.
