# node-scan-dir

> Поиск пакетов 'https://raw.githubusercontent.com/stravnik/toxic-repos/main/data/json/toxic-repos.json' и указанных символов

## Install

```
$ npm install node-scan-dir
```

## Config example

Для настройки необходимо в папке проекта (там где package.json) разместить файл config24feb.json

Если файла нет, то будут использованы базовые настройки:
"root": "node_modules/\*\*",
"symbols": ["🇷🇺", "🇺🇦"]
остальные параметры со значением null (не применяются при проверке)

### example

```json
{
  "directories": {
    "root": "node_modules/**",
    "whiteList": ["config24feb.json"],
    "blackList": {
      "symbols": ["node_modules/es5-ext/_postinstall.js"]
    }
  },
  "review": {
    "symbols": ["🇷🇺", "🇺🇦"]
  }
}
```
