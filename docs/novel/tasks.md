# Задания
Здесь будет список заданий, которые игрок должен решить по ходу прохождения игры.

## Типы заданий
Типы заданий
- `WRITE_KNOWLEDGE`: Игрок должен составить факт или правило в формате Prolog. Введенное знание будет проверено на тестовых случаях.
- `COMPLETE_QUERY`: Игроку предлагается дополнить запрос в формате Prolog. Результат выполнения запроса будет проверен на корректность.
- `SELECT_ONE`: Игрок выбирает один вариант из предложенных. Используется для принятия решений или проверки знаний.
- `SELECT_MANY`: Игрок может выбрать несколько вариантов из списка. Подходит для заданий, где правильным ответом может быть более одного варианта.

## Правила составления задания
Общий формат:
- id или номер задания.
- Тип задания (один из: `WRITE_KNOWLEDGE`, `COMPLETE_QUERY`, `SELECT_ONE`, `SELECT_MANY`)
- Условие задания + вопрос.
  - В сумме -- не более 256 символов и не более 6 строк.
- (опционально) Как часть условия -- новые факты и правила, которые нужны при выполнении задания (это поле нельзя изменять). Остальные нужно посмотреть в меню знаний.
  - В сумме -- не более 256 символов и 6 строк.
- (опционально) Подсказка.
  - В сумме -- не более 128 символов и 2 строк.
- (для `SELECT_ONE` и `SELECT_MANY`) Варианты ответа.
  - От 3 до 5. Каждый занимает не больше 1 строки и 64 символов.
- (опционально, для `WRITE_KNOWLEDGE` и `COMPLETE_QUERY`) Поле для ввода ответа с уже написанным кодом по умолчанию (может быть пустым). Если это возможно, нужно оставить комментарий в Prolog там, где нужно дописать код.
  - Для правильного ответа должно быть достаточно ввести менее 256 символов и 6 строк.
- Тестовые случаи для проверки `WRITE_KNOWLEDGE` (от 1 до 6).
- Правильный ответ (нумерация с `[0]`)
- (опционально) Знания (факты или правила), добавляемые к базе знаний игрока в случае успеха. 
  - Важно продумать их так, чтобы они были частью единой базы знаний, которая отвечает требованиям:
    - Открывается последовательно. Никакие уже открытые знания не ссылаются на ещё не открытые.
    - Нет бесконечных рекурсий в правилах.
    - Нет конфликтов между разными знаниями.
- (опционально) Урон, получаемый при неправильном ответе (от 0 до 100 или `kill`) (по молчанию: 10)
- (опционально) Вес ошибки при подсчёте очков (по умолчанию: 5)

Другие правила:
- Соблюдайте конвенции именования.
  - Для предикатов и констант: `camel_case`
  - Для переменных: `PascalCase`

- Форматируйте блоки кода на Prolog с помощью \`\`\``prolog ...`\`\`\`:
    ```prolog
    brother(X, Y) :- 
        parent(Z, X), 
        parent(Z, Y), 
        X \= Y.
    ```

- Форматируйте однострочные (inline) элементы кода с помощью \``...`\`.

## Задания одиночной игры (Стив)

### Задание 1
#### Тип
`SELECT_MANY`
#### Условие
Выберите из списка только факты.
#### Варианты ответа
- [x] `virus(mitnik, code).`
- [ ] `capture(X, Y) :- virus(X, Y).`
- [x] `virus(code, world).`
- [ ] `capture(X, Y) :- virus(X, Z), virus(Z, Y).`
#### Правильный ответ
`[0]`: `virus(mitnik, code).`, `[2]`: `virus(code, world).`

---
### Задание 2
#### Тип
`SELECT_ONE`
#### Условие
В базе данных даны следующие факты и правило.

Что будет выведено в результате выполнения запроса `successful_investigation(fbi, X).`?

```prolog
investigation(fbi, evidence).
destroy(mitnik, virus).
successful_investigation(Org, Person) :-
    investigation(Org, evidence),
    destroy(Person, virus).
```
#### Варианты ответа
- (x) `X = mitnik`
- ( ) `X = Person`
- ( ) `X = virus`
- ( ) `X = evidence`
- ( ) `X`
#### Правильный ответ
`[0]`: `X = mitnik`

---
### Задание 3
#### Тип
`SELECT_ONE`
#### Условие
Анонимная переменная -- переменная, значение которой нам не важно. Она не связывается ни с каким значением. Мы используем её, когда хотим показать, что нам подходит любое значение. Каков её синтаксис?
#### Варианты ответа
- (x) `_` (нижнее подчёркивание)
- ( ) `-` (дефис)
- ( ) `.` (точка)
- ( ) `X`
#### Правильный ответ
`[0]`: `_` (нижнее подчёркивание)

---
### Задание 5
#### Тип
`COMPLETE_QUERY`
#### Условие
Напиши запрос, ответ на который будет `X = virus`. Используй знания:
```prolog
steal(sara, mitnik).
work(sara, fbi).
destroy(mitnik, virus).
find(Target) :- steal(sara, mitnik), destroy(mitnik, Target).
```
#### Шаблон ответа
```prolog
```
#### Правильный ответ
```prolog
find(X).
```

---
### Задание 7
#### Тип
`SELECT_ONE`
#### Условие
Что будет возвращено, когда для переменной нет подходящих значений?
#### Варианты ответа
- ( ) `true`
- (x) `false`
- ( ) `failed`
- ( ) Ошибка компиляции
- ( ) Рандомное значение
#### Правильный ответ
`[1]`: `false`

---
### Задание 8
#### Тип
`SELECT_ONE`
#### Условие
Что означает `X \= Y` в правиле?
```prolog
second_friends(X, Y) :- friends(X, Z), friends(Z, Y), X \= Y.
```
#### Варианты ответа
- (x) `X` не равно `Y`
- ( ) `X` и `Y` -- уникальные значения
- ( ) `X` равно `Y`
- ( ) Рандомное значение
#### Правильный ответ
`[0]`: `X` не равно `Y`