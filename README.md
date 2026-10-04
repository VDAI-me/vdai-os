# VDAI · Club + OS

**Единый вход / One entry: [os.vdai.me](https://os.vdai.me/)**

Переключите RU / EN и начните с одного полезного вклада. Для первого разговора установка не нужна.
Switch to RU / EN and start with one useful contribution. No installation is needed for the first conversation.

VDAI Club — люди, обучение и совместная работа. VDAI OS — открытый код для проектов, задач, обсуждений и проверяемых результатов.
VDAI Club connects people, learning and shared work. VDAI OS keeps projects, tasks, discussion and reviewed results together.

- [Идея / Idea](docs/IDEA.md)
- [Стратегия / Strategy](docs/STRATEGY.md)
- [Как присоединиться / How to join](docs/JOIN.md)
- [Общий доступ / Shared access](docs/SHARED_ACCESS.md)
- [Установка разработчику / Developer setup](SETUP.md)

## Optional setup check / Диагностика по желанию

- [Questionnaire and copy/paste test prompt · EN](https://os.vdai.me/en/#assessment)
- [Опросник и тестовый промпт · RU](https://os.vdai.me/#assessment)
- [Agent-readable assessment protocol](site/assets/vdai-agent-check.md)
- [English test prompt](site/assets/vdai-test-prompt-en.txt) / [Русский промпт](site/assets/vdai-test-prompt-ru.txt)
- [Download AI work-format starter](site/assets/vdai-agent-starter.zip) / [Source instructions](onboarding/agent-starter/AGENTS.md)
- [Download guided local OS source bundle](site/assets/vdai-os-starter.zip) / [Setup requirements](START-HERE.md)
- [Step-by-step setup helper · EN](https://os.vdai.me/en/support/) / [RU](https://os.vdai.me/support/)
- [Result, lessons, naming and participation rules](docs/WORKING.md)

Keep your working tools. The kit is optional. The five-area 0–3 rubric is a working self-assessment, not a certification or Club role; unknown is not zero. Native sidebar automation is not installed by this kit.
Сохраните работающие инструменты. Комплект — по желанию. Шкала 0–3 по пяти направлениям — рабочая самооценка, не сертификация или роль в Club; неизвестное — не ноль. Комплект не устанавливает автоматизацию sidebar.

The source bundle checks prerequisites and guides setup; it is not a signed installer. A fresh full OS install has not been verified for this version. Do not disable OS security or send credentials. Build download bundles with `python3 scripts/build-starter.py`.

## Сейчас / Available now

Можно обсудить участие и выбрать первую задачу. Код открыт для изучения и разработки. Общий вход, приглашения и подключение внешнего участника ещё требуют проверки. Подписанного установщика и GitHub Release пока нет; доступен комплект исходников с мастером запуска.
You can discuss participation and agree on a first task. Source is open for inspection and development. Shared login, invitations and external-participant connection still require verification. There is no signed installer or GitHub Release yet; a guided source bundle is available.

## Developers

VDAI OS is an application layer on Twenty, not a Twenty fork. The public code includes project/task objects, roles, synthetic examples and installation/backup/export tools. A local instance does not join you to the shared team database.

```bash
git clone https://github.com/VDAI-me/vdai-os.git
cd vdai-os
```

Read [SETUP.md](SETUP.md) before starting. Never publish `.env`, credentials, private client data or personal conversations.
VDAI OS code is MIT licensed. Twenty is a separate upstream dependency with its own licensing. See [LICENSE](LICENSE) and dependency notices.

This corporate repository preserves the history of the original public `vasilevdasfo/vdai-os` repository. The participant entry remains **https://os.vdai.me/**.
