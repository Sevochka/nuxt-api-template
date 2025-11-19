# Nuxt 3 API Template

Шаблон проекта на Nuxt 3 с реализацией паттерна Repository для организации API-вызовов и GraphQL интеграции.

## 📋 Содержание

- [Архитектура](#архитектура)
- [Repository Pattern](#repository-pattern)
- [Nuxt Layers](#nuxt-layers)
- [GraphQL Code Generator](#graphql-code-generator)
- [Установка](#установка)
- [Структура проекта](#структура-проекта)
- [Использование](#использование)
- [Скрипты](#скрипты)

## 🏗️ Архитектура

Проект построен на основе **Repository Pattern** - паттерна проектирования, который обеспечивает абстракцию между бизнес-логикой приложения и слоем доступа к данным. Это улучшает:

- ✅ **Читаемость кода** - четкая организация API-вызовов
- ✅ **Поддерживаемость** - простота внесения изменений
- ✅ **Тестируемость** - легкость написания unit-тестов
- ✅ **Переиспользование** - DRY принцип
- ✅ **Типобезопасность** - полная поддержка TypeScript

## 🎯 Repository Pattern

### Концепция

Repository Pattern изолирует логику доступа к данным от бизнес-логики. Вместо прямых вызовов API по всему приложению, создается единая точка входа через репозитории.

### Реализация

В проекте реализованы два типа фабрик для работы с API:

#### 1. HttpFactory (REST API)

```typescript
class HttpFactory {
  private readonly $fetch: $Fetch;

  constructor(fetcher: $Fetch) {
    this.$fetch = fetcher;
  }

  async call<T>(
    method: Method,
    slug: string,
    data?: object,
    extras = {},
  ): Promise<T> {
    const url = slug.endsWith('/') ? slug : slug + '/';
    const $res: T = await this.$fetch(url, {
      method,
      [HttpFactory.getParamsKey(method)]: data,
      ...extras,
      headers: {
        ...useRequestHeaders(['cookie']),
      },
    });
    return $res;
  }
}
```

#### 2. ApolloFactory (GraphQL)

```typescript
class ApolloFactory {
  private readonly client: ApolloClient;

  constructor(client: ApolloClient) {
    this.client = client;
  }

  async query<T>(query: DocumentNode, variables?: Record<string, unknown>): Promise<T> {
    try {
      const { data } = await this.client.query<T>({
        query,
        variables,
      });
      return data as T;
    }
    catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  async mutate<T>(mutation: DocumentNode, variables?: Record<string, unknown>): Promise<T> {
    try {
      const { data } = await this.client.mutate<T>({
        mutation,
        variables,
      });
      return data as T;
    }
    catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }
}
```

### Создание репозитория

Для создания нового репозитория расширьте соответствующую фабрику:

```typescript
// Пример REST репозитория
import HttpFactory from '../repository/factory';

interface User {
  id: number;
  name: string;
  email: string;
}

class UserRepository extends HttpFactory {
  private RESOURCE = '/api/users';

  async getUsers(): Promise<User[]> {
    return this.call<User[]>('GET', this.RESOURCE);
  }

  async getUserById(id: number): Promise<User> {
    return this.call<User>('GET', `${this.RESOURCE}/${id}`);
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    return this.call<User>('POST', this.RESOURCE, userData);
  }
}
```

```typescript
// Пример GraphQL репозитория
import ApolloFactory from '../repository/apollo-factory';
import GET_USERS_QUERY from './queries/getUsers.gql';

class UserGraphQLRepository extends ApolloFactory {
  async getUsers(limit?: number): Promise<UsersQuery> {
    return this.query<UsersQuery>(GET_USERS_QUERY, { limit });
  }
}
```

## 📦 Nuxt Layers

### Что такое Nuxt Layers?

**Nuxt Layers** - это мощная концепция в Nuxt 3, позволяющая создавать модульные, переиспользуемые части приложения. Слои могут содержать:

- Компоненты
- Composables
- Утилиты
- Плагины
- Middleware
- Страницы и маршруты
- Конфигурацию

### API Layer

В проекте создан отдельный слой `layers/api`, который инкапсулирует всю логику работы с API:

#### Структура слоя

```
layers/api/
├── composables/
│   └── useApi.ts         # Composable для доступа к API
├── plugins/
│   └── api.ts            # Инициализация API клиентов
├── repository/
│   ├── factory.ts        # HTTP фабрика
│   └── apollo-factory.ts # GraphQL фабрика
├── types/
│   ├── api.ts            # Типы API
│   └── graphql.ts        # Сгенерированные GraphQL типы
├── utils/
│   ├── apollo.ts         # Утилиты Apollo Client
│   └── apollo-cache.ts   # Настройки кеша
├── codegen.ts            # Конфигурация GraphQL Codegen
├── graphql.config.yml    # Конфигурация GraphQL
├── nuxt.config.ts        # Конфигурация слоя
└── package.json          # Зависимости слоя
```

#### Преимущества выделения в слой

1. **Модульность** - API логика изолирована от основного приложения
2. **Переиспользование** - слой можно использовать в других проектах
3. **Независимая разработка** - работа над API не влияет на основной код
4. **Workspace** - слой является отдельным npm пакетом в монорепе

#### Подключение слоя

В `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  extends: [
    './layers/api',
  ],
})
```

#### Использование API слоя

```typescript
// В компонентах или composables
const api = useApi();

// Доступ к Apollo Client
const { data } = await api.client.query({ query: MY_QUERY });

// Доступ к репозиториям (после их добавления в IApiInstance)
const users = await api.users.getAll();
```

## 🚀 GraphQL Code Generator

### Что такое GraphQL Code Generator?

**GraphQL Code Generator** - это инструмент CLI, который генерирует код на основе GraphQL схемы. Он автоматически создает:

- TypeScript типы для запросов, мутаций и подписок
- Типы для переменных
- Typed Document Nodes
- React Hooks (опционально)
- И многое другое

### Настройка в проекте

#### Конфигурация (`layers/api/codegen.ts`)

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3002/graphql',      // URL GraphQL схемы
  documents: ['*/**/*.gql'],                     // Паттерн для поиска .gql файлов
  generates: {
    './types/graphql.ts': {                      // Выходной файл
      plugins: [
        {
          add: {
            content: '/* eslint-disable */',     // Отключение линтера
          },
        },
        'typescript',                             // Генерация TypeScript типов
        'typescript-operations',                  // Типы для операций
      ],
    },
  },
};

export default config;
```

#### Конфигурация GraphQL (`layers/api/graphql.config.yml`)

```yaml
schema: http://localhost:3002/graphql
```

### Использование

#### 1. Создайте GraphQL запрос

Создайте файл с расширением `.gql`:

```graphql
# queries/getUsers.gql
query GetUsers($limit: Int) {
  users(limit: $limit) {
    id
    name
    email
    avatar
  }
}
```

#### 2. Запустите кодогенерацию

```bash
# Одноразовая генерация
npm run compile

# Watch режим (автоматическая генерация при изменениях)
npm run watch
```

#### 3. Используйте сгенерированные типы

```typescript
import type { GetUsersQuery, GetUsersQueryVariables } from '~/layers/api/types/graphql';
import GET_USERS_QUERY from './queries/getUsers.gql';

const result = await api.client.query<GetUsersQuery, GetUsersQueryVariables>({
  query: GET_USERS_QUERY,
  variables: {
    limit: 10,
  },
});

// TypeScript знает структуру данных!
result.data.users.forEach(user => {
  console.log(user.name); // ✅ Типобезопасно
});
```

### Плагины кодогенератора

Проект использует следующие плагины:

- **`typescript`** - генерирует базовые TypeScript типы для схемы
- **`typescript-operations`** - генерирует типы для операций (queries, mutations)
- **`@graphql-typed-document-node/core`** - создает типизированные document nodes

### Интеграция с Vite

Для загрузки `.gql` файлов используется плагин `vite-plugin-graphql-loader`:

```typescript
// nuxt.config.ts
import graphqlLoader from 'vite-plugin-graphql-loader';

export default defineNuxtConfig({
  vite: {
    plugins: [
      graphqlLoader(),
    ],
  },
});
```

## 📥 Установка

### Требования

- Node.js: `^22.12.0`
- npm или yarn

### Установка зависимостей

```bash
# Установка зависимостей для всех workspace (включая layers)
npm install
```

### Настройка окружения

Создайте файл `.env.local` в корне проекта:

```env
# Backend URL
NUXT_PUBLIC_BACKEND_URL=http://localhost:3002
NUXT_PUBLIC_ORIGIN_URL=http://localhost:3000
```

## 📁 Структура проекта

```
nuxt-api-template/
├── app/                          # Основное приложение
│   ├── assets/                   # Статические ресурсы
│   │   ├── fonts/
│   │   ├── icons/
│   │   └── scss/                 # SCSS стили
│   ├── components/               # Vue компоненты
│   ├── layouts/                  # Layouts
│   ├── pages/                    # Страницы (роутинг)
│   ├── plugins/                  # Nuxt плагины
│   ├── store/                    # Pinia store
│   ├── types/                    # TypeScript типы
│   ├── app.config.ts             # Конфигурация приложения
│   ├── app.vue                   # Корневой компонент
│   └── error.vue                 # Страница ошибки
├── config/                       # Конфигурационные файлы
│   └── variables/                # Переменные окружения
├── layers/                       # Nuxt Layers
│   └── api/                      # API слой
│       ├── composables/
│       ├── plugins/
│       ├── repository/
│       ├── types/
│       ├── utils/
│       └── codegen.ts
├── .env.local                    # Переменные окружения (не в git)
├── nuxt.config.ts                # Главная конфигурация Nuxt
├── package.json                  # Зависимости проекта
├── tsconfig.json                 # TypeScript конфигурация
└── README.md                     # Документация
```

## 💻 Использование

### Создание нового модуля API

1. **Создайте репозиторий** в `layers/api/repository/modules/`:

```typescript
// layers/api/repository/modules/products.ts
import ApolloFactory from '../apollo-factory';
import GET_PRODUCTS from './queries/getProducts.gql';
import type { GetProductsQuery } from '../../types/graphql';

class ProductRepository extends ApolloFactory {
  async getProducts(): Promise<GetProductsQuery> {
    return this.query<GetProductsQuery>(GET_PRODUCTS);
  }
}

export default ProductRepository;
```

2. **Зарегистрируйте репозиторий** в `layers/api/plugins/api.ts`:

```typescript
import ProductRepository from '../repository/modules/products';

const modules: IApiInstance = {
  products: new ProductRepository(apolloClientMain),
  client: apolloClientMain,
};
```

3. **Используйте в компонентах**:

```vue
<script setup lang="ts">
const api = useApi();

const { data: products } = await useAsyncData(
  'products',
  () => api.products.getProducts()
);
</script>

<template>
  <div>
    <div v-for="product in products?.products" :key="product.id">
      {{ product.name }}
    </div>
  </div>
</template>
```

### Работа с GraphQL

1. **Создайте `.gql` файл**:

```graphql
# layers/api/repository/modules/queries/createUser.gql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}
```

2. **Запустите кодогенерацию**:

```bash
cd layers/api
npm run compile
```

3. **Используйте в репозитории**:

```typescript
import CREATE_USER from './queries/createUser.gql';
import type { CreateUserMutation, CreateUserMutationVariables } from '../../types/graphql';

class UserRepository extends ApolloFactory {
  async createUser(input: CreateUserMutationVariables['input']): Promise<CreateUserMutation> {
    return this.mutate<CreateUserMutation>(CREATE_USER, { input });
  }
}
```

## 🛠️ Скрипты

### Основные команды

```bash
# Запуск dev сервера
npm run dev

# Production build
npm run build

# Stage build
npm run build:stage

# Запуск production сервера
npm start

# Генерация статического сайта
npm run generate
```

### Линтинг

```bash
# Проверка кода
npm run lint

# Автоматическое исправление
npm run lint:fix
```

### GraphQL Code Generator (в layers/api)

```bash
cd layers/api

# Одноразовая генерация типов
npm run compile

# Watch режим
npm run watch
```

## 📚 Дополнительные ресурсы

- [Nuxt 3 Documentation](https://nuxt.com/)
- [Repository Pattern Article by Luiz Zappa](https://medium.com/@luizzappa/nuxt-3-repository-pattern-organising-and-managing-your-calls-to-apis-with-typescript-acd563a4e046)
- [GraphQL Code Generator Documentation](https://the-guild.dev/graphql/codegen)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [Nuxt Layers Documentation](https://nuxt.com/docs/guide/going-further/layers)

