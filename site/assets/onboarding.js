document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const field = document.getElementById(button.dataset.copy);
    const status = button.parentElement.querySelector('[data-copy-status]');
    const en = document.documentElement.lang === 'en';
    try {
      await navigator.clipboard.writeText(field.value);
      status.textContent = en ? 'Copied. Send it in your AI project.' : 'Скопировано. Отправьте в своём AI-проекте.';
    } catch {
      field.focus();
      field.select();
      status.textContent = en ? 'Text selected. Copy it with Ctrl+C or Cmd+C.' : 'Текст выделен. Нажмите Ctrl+C или Cmd+C.';
    }
  });
});

const assessment = document.getElementById('setup-assessment');
if (assessment) {
  const output = document.querySelector('[data-assessment-result]');
  const en = document.documentElement.lang === 'en';
  const render = () => {
    const values = [...assessment.querySelectorAll('select')].map(field => ({name: field.name, value: field.value === '' ? null : Number(field.value)}));
    const known = values.filter(field => field.value !== null);
    const total = known.reduce((sum, field) => sum + field.value, 0);
    const coverage = en ? `${known.length} of 5 areas described; ${5-known.length} unknown.` : `Описано ${known.length} из 5 направлений; неизвестно ${5-known.length}.`;
    if (!known.length) {
      output.textContent = en ? 'No level assigned. Start with one completed task and what already works.' : 'Уровень не назначен. Начните с одной завершённой задачи и того, что уже работает.';
      return;
    }
    const score = known.length === 5 ? (en ? `Self-reported profile: ${total}/15. ` : `Самооценка профиля: ${total}/15. `) : (en ? 'Overall score withheld until all areas are described. ' : 'Общий балл не рассчитывается, пока не описаны все направления. ');
    const lowest = known.reduce((a,b) => a.value <= b.value ? a : b);
    const labels = {execution: ['execution','исполнение'], integration: ['integrations','интеграции'], instructions: ['persistent work rules','постоянные правила'], automation: ['automation','автоматизация'], evidence: ['result verification','проверка результата']};
    const next = known.length < 5 ? (en ? 'Next: clarify the unknowns; keep your working tools.' : 'Далее: выяснить неизвестное; сохранить работающие инструменты.') : (en ? `Next: show one example for ${labels[lowest.name][0]}, then decide whether any change is useful.` : `Далее: показать пример по направлению «${labels[lowest.name][1]}» и решить, полезно ли изменение.`);
    output.textContent = score + coverage + ' ' + next + (en ? ' Evidence has not been verified.' : ' Доказательства пока не проверены.');
  };
  assessment.addEventListener('change', render);
  render();
  document.querySelector('[data-copy-assessment]')?.addEventListener('click', async () => {
    const lines = [...document.querySelectorAll('[data-context]')].map(field => `${field.dataset.context}: ${field.value || (en ? 'unknown' : 'неизвестно')}`);
    for (const field of assessment.querySelectorAll('select')) lines.push(`${field.name}: ${field.options[field.selectedIndex].text}`);
    lines.push(output.textContent);
    const status = document.querySelector('[data-report-status]');
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      status.textContent = en ? 'Copied. You decide where to share these answers.' : 'Скопировано. Вы решаете, кому передать ответы.';
    } catch {
      status.textContent = en ? 'Clipboard unavailable. Copy your answers manually.' : 'Буфер обмена недоступен. Скопируйте ответы вручную.';
    }
  });
}
