# TODO

## Разбить script.js на модули
Сейчас вся логика игры лежит в одном большом файле `script.js` (741 строка).
В папке `scripts/` уже есть файлы-заготовки под будущее разделение
(state.js, audio.js, effects.js, dictionary.js, navigation.js, game.js,
results.js, pause.js, endgame.js) — но они пустые, index.html их не
использует, script.js подключён напрямую (см. фикс от [дата]).

План: аккуратно перенести код из script.js в эти файлы по смыслу
(звук → audio.js, словари → dictionary.js, и т.д.), обновить теги
<script> в index.html, проверить что игра работает так же, как раньше.

Статус: не начато.