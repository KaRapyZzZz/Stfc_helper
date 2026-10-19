# STFC Command Helper (Star Trek Fleet Command) 🚀🛸

[![Build and Release Windows App](https://github.com/KaRapyZzZz/Stfc_helper/actions/workflows/build.yml/badge.svg)](https://github.com/KaRapyZzZz/Stfc_helper/actions/workflows/build.yml)
[![Platform](https://img.shields.io/badge/Platform-Windows-0078D6?logo=windows)](https://github.com/KaRapyZzZz/Stfc_helper)
[![Electron](https://img.shields.io/badge/Electron-33.x-47848F?logo=electron)](https://electronjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**STFC Command Helper** — десктопное приложение для Windows, созданное для игроков **Star Trek Fleet Command (STFC)**. Приложение включает встроенную базу данных по мотивам `stfc.space` и `star-trek-fleet-command.fandom.com`, умный ассистент ответов на вопросы, калькулятор синергий экипажа с поддержкой Drag-and-Drop и навигатор по офицерам, кораблям и звездным системам.

---

## 🌟 Основные возможности

### Вкладка 1: База Знаний и Вопросы (Q&A Assistant)
- **Умный поиск и ответы**: задайте любой вопрос по игре (например, *"Кто контрит перехватчики?"*, *"Лучшая команда для фарма хостилов"*, *"Как работает Кирк и Спок?"*, *"Где искать руду?"*).
- Вывод кратких и точных ответов по боевой механике, офицерам, кораблям, системам и армадам.
- Интерактивные карточки с быстрыми подсказками.

### Вкладка 2: Калькулятор Офицеров и Синергии (Crew Builder)
- **Интерактивный мостик**:
  - Слот **Капитана** (центр)
  - Слоты **Офицеров мостика** (левый и правый фланги)
  - Слоты **Нижних палуб (Below Decks)**
- **Drag-and-Drop**: перетягивайте портреты офицеров прямо мышью из палитры в любой слот или выбирайте кликом с удобным поиском и фильтром по классам (*Command*, *Science*, *Engineering*).
- **Расчет синергии**: автоматический подсчет процента синергии мостика, капитанского маневра и разбор боевых эффектов.
- **Готовые мета-сборки в 1 клик**:
  - `PMC` (Pike + Moreau + Chen) — топ для фарма PvE
  - `PMT` (Pike + Moreau + T'Laan) — против перехватчиков и Swarm
  - `Kirk + Spock + Bones` — вечная мораль и регенерация щитов
  - `Khan + Crit` — для пробития Армад
  - `Шахтеры` (Stonn, Dupont, Barot) — ускорение добычи руды, газа, кристаллов

### Вкладка 3: Навигатор STFC.SPACE (Data Explorer)
- **Офицеры (293)**: детальные профили с редкостью, фракциями, способностями и биографиями.
- **Корабли (116)**: типы корпусов (*Interceptor*, *Explorer*, *Battleship*, *Survey*), грейды, чертежи и тиры.
- **Звездные Системы (500)**: дальность варпа, уровни, шахты ресурсов, координаты.
- **Мета-Синергии**: детальное описание механик и преимуществ связок.
- Прямой переход к просмотру каждого объекта на живом сервере [stfc.space](https://stfc.space).

---

## 📥 Как скачать готовое приложение пользователям

Пользователям **не нужно** устанавливать Node.js, Python или запускать консоль. Они могут скачать готовый установочный файл `.exe`:

1. Перейдите на страницу **[Releases](https://github.com/KaRapyZzZz/Stfc_helper/releases)** в этом репозитории.
2. В последнем релизе скачайте файл:
   - `STFC.Command.Helper.Setup.1.0.0.exe` (установщик для Windows с созданием ярлыка на рабочем столе)
   - или портативную версию `.exe` (работает сразу без установки).

---

## 🛠️ Запуск и разработка локально

Для запуска из исходного кода на вашем компьютере:

### 1. Клонирование репозитория
```bash
git clone https://github.com/KaRapyZzZz/Stfc_helper.git
cd Stfc_helper
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Запуск в режиме разработки
```bash
# Запуск веб-интерфейса
npm run dev

# Запуск десктопного Electron приложения
npm start
```

### 4. Сборка исполняемого файла `.exe` для Windows
```bash
npm run dist:win
```
Готовый установщик появится в папке `release/`.

### 5. Обновление базы данных из stfc.space
В проект встроен скрипт синхронизации:
```bash
npm run fetch:data
```

---

## 🤖 Автоматическая сборка релизов через GitHub Actions

В репозитории настроен GitHub Actions workflow (`.github/workflows/build.yml`).
При создании нового тега (например, `v1.0.0`) серверы GitHub автоматически соберут Windows `.exe` и прикрепят его к разделу Releases:

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## 📄 Лицензия
MIT License. Все игровые данные, изображения и торговые марки принадлежат Scopely / CBS / Paramount.
