# node-scan-dir

> Поиск пакетов 'https://raw.githubusercontent.com/stravnik/toxic-repos/main/data/json/toxic-repos.json' и указанных символов

## Install

```
$ npm install node-scan-dir
```

## Config example

Для настройки необходимо в папке проекта (там где package.json) разместить файл config24feb.json

Если файла нет, то будут использованы базовые настройки:
"rootDir": "node_modules/\*\*",
"charsForCheck": ["🇷🇺", "🇺🇦"]
остальные параметры со значением null (не применяются при проверке)

### example

```json
{
  "rootDir": "node_modules/**",
  "charsForCheck": ["🇷🇺", "🇺🇦"],
  "ignorePatterns": ["node_modules/es5-ext/_postinstall.js"],
  "extraPaths": ["config24feb.json"]
}
```
