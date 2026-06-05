# AGENTS.md

Памятка для будущих агентов и разработчиков, работающих с этим репозиторием.

## Проект

`portfolio-viewer` - Next.js приложение для просмотра и управления DeFi-портфелем. Сейчас основной пользовательский сценарий находится на странице `/aave`: выбор сети, просмотр Aave borrow-позиций, модалки `Borrow` и `Repay`, отправка транзакций через Web3Auth/Privy.

## Технологии

- Next.js `16.1.6` с App Router.
- React `19.2.3`.
- TypeScript в строгом режиме (`strict: true`).
- Tailwind CSS v4 через `@tailwindcss/postcss`.
- `@aave/react` для Aave data/actions hooks.
- `@aave/react/privy` для отправки транзакций.
- `@xchng/web3-auth` для подключения кошелька и Web3Auth/Privy состояния.
- `ethers` v6 для прямого чтения балансов.
- Пакетный менеджер: `pnpm` (`pnpm-lock.yaml` присутствует и должен оставаться источником истины).

## Команды

- `pnpm dev` - локальный dev-сервер Next.js.
- `pnpm build` - production build.
- `pnpm start` - запуск production-сборки.
- `pnpm lint` - ESLint.

Перед завершением нетривиальных изменений минимум запускайте `pnpm lint`. Для изменений в routing, Web3/Aave логике или конфигурации запускайте также `pnpm build`.

## Переменные окружения

Используются публичные переменные:

- `NEXT_PUBLIC_PRIVY_APP_ID`
- `NEXT_PUBLIC_PRIVY_CLIENT_ID`

Они читаются в `src/utils/constants.ts` и передаются в `initWeb3Auth`. Не коммитьте приватные секреты. Если меняете инициализацию Web3Auth, проверьте `src/app/layout.tsx` и `src/app/components/system/Web3AuthWrapper.tsx`: сейчас `initWeb3Auth` вызывается в обоих местах.

## Структура

- `src/app/layout.tsx` - корневой layout, шрифты Geist, metadata, `Header`, `Web3AuthWrapper`.
- `src/app/page.tsx` - простая главная страница.
- `src/app/aave/page.tsx` - клиентская страница Aave dashboard, создает `AaveClient` и `AaveProvider`.
- `src/app/aave/components/` - Aave UI и транзакционные модалки.
- `src/app/components/layouts/` - layout-компоненты, сейчас `Header`.
- `src/app/components/blocks/` - небольшие блоки интерфейса, сейчас `UserMenuBlock`.
- `src/app/components/wallet/` - кнопка подключения кошелька.
- `src/app/components/system/` - системные провайдеры.
- `src/utils/` - константы сетей, типы, storage helpers, форматирование строк, чтение балансов.
- `public/` - статические ассеты.

## Импорты и стиль кода

- Алиас `@/*` указывает на корень репозитория, поэтому текущий стиль импортов: `@/src/...`.
- Компоненты обычно экспортируются default-экспортом из файла и re-export через локальный `index.ts`.
- Отступы в существующем коде - 4 пробела.
- Компоненты с hooks/browser APIs должны иметь `'use client'`.
- Избегайте больших рефакторингов без необходимости: кодовая база маленькая, явные компоненты здесь читаются лучше преждевременных абстракций.
- Для общих утилит используйте `src/utils`, для UI рядом с фичей - локальную папку `components`.

## Aave и Web3 детали

- `/aave` обернут в `AaveProvider`, созданный через `AaveClient.create()`.
- `ChainSelector` берет доступные сети через `useAaveChains({ filter: ChainsFilter.MAINNET_ONLY, suspense: true })`, но показывает только сети из `CHAINS`.
- `CHAINS` в `src/utils/constants.ts` - локальный allowlist сетей и block explorer metadata.
- `Borrows` получает рынки через `useAaveMarkets`.
- `BorrowAssetTable` получает borrow-позиции через `useUserBorrows` и открывает `BorrowModal`/`RepayModal`.
- `BorrowModal` использует `useBorrow`, `useAaveHealthFactorPreview`, `useUserMarketState` и `useSendTransaction`.
- `RepayModal` использует `useRepay` и `useSendTransaction`.
- `fetchBalance` в `src/utils/balance.ts` читает native/token balance через provider из `getAppStore()`.

Когда меняете borrow/repay flow, проверяйте:

- корректную сеть (`chainId` из Web3Auth должен соответствовать Aave market chain);
- наличие `wallet`, `walletAddress`, `provider`;
- обработку `ApprovalRequired`, `TransactionRequest`, `InsufficientBalanceError`;
- disabled-состояния кнопок при пустой/нулевой сумме и во время отправки;
- ошибки и success-состояния после транзакции.

## UI

- Tailwind v4 подключен в `src/app/globals.css` через `@import "tailwindcss";`.
- Цветовая схема в основном `zinc` + акцент `blue`.
- Приложение поддерживает dark mode через `.dark` variant и `prefers-color-scheme`.
- Страницы ограничены `max-w-6xl`.
- Таблицы должны оставаться горизонтально прокручиваемыми на узких экранах (`overflow-x-auto` уже используется).

## Известные особенности

- В нескольких файлах есть mojibake в русских строках/комментариях, например `Р“Р»Р°РІРЅР°СЏ` вместо `Главная` и `Loading вЂ¦`. Если правите эти строки, сохраняйте файлы в UTF-8 и исправляйте текст осознанно.
- В `RepayModal` загрузка баланса сейчас вызывает `fetchBalance(...).then(...)` внутри `try/finally`, поэтому `finally` срабатывает до завершения promise. Если будете трогать этот участок, лучше заменить на `.then/.catch/.finally` или async IIFE.
- В `BorrowAssetTable` empty-state `td` использует `colSpan={columns.length}`, хотя есть дополнительная колонка `Action`; при правках таблицы стоит сделать `columns.length + 1`.
- В `storage.ts` типы `StorageNetworkKeys` и `StorageWalletKeys` сейчас пустые строки. Перед добавлением новых ключей расширяйте эти union-типы явно.
- `git status` может падать с `dubious ownership` для этого пути. Не меняйте глобальный git config без согласия пользователя.

## Docker

- `Dockerfile` использует `node:25-alpine`, устанавливает `pnpm`, собирает через `pnpm run build`, затем запускает `pnpm start`.
- `docker-compose.yml` пробрасывает `3001:3000` и выставляет `NODE_ENV=production`.
- Если production-контейнеру нужны `NEXT_PUBLIC_*` переменные, добавьте их в окружение compose/deploy-среды.

## Перед сдачей изменений

1. Проверьте формат и типы через `pnpm lint`.
2. Для изменений в Next config, layout, routing, Aave/Web3 hooks или Docker запустите `pnpm build`.
3. Для UI-изменений откройте страницу, которую меняли, и проверьте light/dark, desktop/mobile, подключенный и неподключенный кошелек.
4. Не исправляйте unrelated mojibake, generated files, lockfile или IDE-настройки без причины.
