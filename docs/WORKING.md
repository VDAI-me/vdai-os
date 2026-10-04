# How we work / Как мы работаем

## ProblemOS

P: the observable problem. U: the main bottleneck. L: the rule or constraint. R: the chosen action. N: the next check. Example: P — English installation is confusing; U — too many manual commands; L — do not hide account approval; R — one guided launcher; N — a new participant sees Projects and Tasks on their own machine.

P — наблюдаемая проблема. U — главное узкое место. L — правило или ограничение. R — выбранное действие. N — следующая проверка. Пример: P — непонятная установка на английском; U — много команд; L — подтверждение аккаунта нельзя скрывать; R — один мастер запуска; N — участник видит проекты и задачи на своём компьютере.

## A result / Выдача

Deliver: what changed, the exact artifact, how to check it, known limits and the next check. The task owner records accept / request changes / defer. A test is evidence for what it tested; it is not delivery, owner acceptance or payment.

Выдача: что изменилось, точный артефакт, проверка, границы и следующий шаг. Владелец принимает результат, просит изменения или откладывает решение. Тест не означает доставку, приёмку или оплату.

## Lessons / Уроки

Keep one short lesson with its source task: what failed, what changed and one check that prevents the same failure. Remove private conversations and credentials before sharing. Example: an empty Releases page is not an installer; check the actual download and first launch.

Урок рядом с исходной задачей: что не сработало, что изменилось, какая проверка предотвращает повтор. Перед общим доступом уберите переписки и ключи. Пример: пустая страница Releases не является установщиком; проверять нужно скачивание и первый запуск.

## Names, colours and status / Имена, цвета и статусы

Use the project's existing task identity and assigned colour. A colour identifies the project, not progress. The owner assigns it; contributors do not invent another project or task ID. Status has a text label as well as an icon: ▶ in progress, ⏳ waiting, ✓ accepted. An accepted result requires the owner's decision. Keep the same task identity when continuing work.

Используйте существующий ID и назначенный цвет проекта. Цвет обозначает проект, не прогресс. Цвет назначает владелец; участник не придумывает новый проект или ID. Статус сопровождается текстом: ▶ в работе, ⏳ ожидание, ✓ принято. Приёмку подтверждает владелец. Продолжение сохраняет ID задачи.

Display example only / Только пример отображения: `01/3 🟩 ▶ 🔧 English installation · 14:20`. Here `01` is the daily number, `3` is the day, the square is the assigned project colour and the time is in the workspace's declared timezone. The example does not allocate a real ID, colour or timezone to your project.

## Participation and code / Участие и код

Agree on one task, owner, expected result and permissions before starting. Use synthetic examples; keep client data private. Ask before sending messages, publishing, changing access or spending money. Participation does not automatically grant an account, role or paid contract.

Сначала согласуйте задачу, владельца, результат и полномочия. Для примеров используйте синтетические данные. Перед отправкой, публикацией, изменением доступа или тратой получите разрешение. Участие само по себе не даёт аккаунт, роль или платный договор.

Download the public source, make a branch, implement one bounded improvement, run the relevant checks and propose a pull request in the existing repository. Include trigger, before/after, verification and limits. The owner reviews before merging. The code is MIT; Twenty has separate dependency terms. Never include `.env`, credentials or private data.

Скачайте код, создайте ветку, внесите одно улучшение, выполните подходящие проверки и предложите pull request в существующий репозиторий. Укажите сценарий, до/после, проверку и границы. Merge — после решения владельца. Код MIT; у Twenty отдельные условия. `.env`, ключи и приватные данные не публикуются.
