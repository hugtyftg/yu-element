# 项目亮点

- Vite + Vitest + Vitepress 工具链

- monorepo 分包管理

- github actions 实现 CI/CD 自动化部署

# 目录结构简介

- components 开发的组件

- core npm 包入口

- docs 项目文档

- hooks 自定义钩子（利用 vue 的 composition api 封装实现）

- play 组件使用、体验的示范工程

- theme 样式

- utils 工具函数

注意：本 monorepo 工程下的所有包，只有 core 和工程同名，其他包需要加上前缀`@yu-element/`以防和其他开源库重名

# 项目搭建

## [项目初始化](https://ericwxy.github.io/eric-wiki/my-projects/eric-ui/start.html#项目初始化)

```
mkdir yu-element

cd yu-element

git init

code .
```

创建 pnpm-workspace.yaml 文件配置 monorepo

```
mkdir packages

echo -e 'packages:\n  - "packages/*"' > pnpm-workspace.yaml

pnpm init
```

创建 `.gitignore`

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
coverage
dist
dist-ssr
*.local

/cyperss/videos/
/cypress/srceenshots/

.vitepress/dist
.vitepress/cache

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

为了目录扁平，只创建 packages 这么一个 pnpm 工作区，下面大概介绍一下这个项目计划的分包结构

```
- components # 组件目录
- core # npm 包入口
- docs # 文档目录
- hooks # 组合式API hooks 目录
- play # 组件开发实验室
- theme # 主题目录
- utils # 工具函数目录
```

在 packages 目录下创建 `init.shell`，执行脚本自动化创建这些子包的目录

```
cd packages
```

```
# init.shell
for i in components core docs hooks theme utils; do
  mkdir $i
  cd $i
  pnpm init
  cd ..
done
```

执行后删除 `init.shell`

手动用 vite 来创建一个 vue 开发项目作为 playground

```
pnpm create vite play --template vue-ts
```

只有 core 目录下的子包的 name 与项目同名，其他各个子包需要手动到目录中修改 `package.json` 中的 `name`。为了避免和第三方开源库重名 ，使用`@项目名/子目录`方式

![image-20241118121537230](README.assets/image-20241118121537230.png)

## [安装基础依赖](https://ericwxy.github.io/eric-wiki/my-projects/eric-ui/start.html#安装基础依赖)

```
pnpm add -Dw typescript@^5.2.2 vite@^5.1.4 vitest@^1.4.0 vue-tsc@^1.8.27 postcss-color-mix@^1.1.0 postcss-each@^1.1.0 postcss-each-variables@^0.3.0 postcss-for@^2.1.1 postcss-nested@^6.0.1 @types/node@^20.11.20 @types/lodash-es@^4.17.12 @vitejs/plugin-vue@^5.0.4 @vitejs/plugin-vue-jsx@^3.1.0 @vue/tsconfig@^0.5.1

pnpm add -w lodash-es@^4.17.21 vue@^3.4.19
```

在 根目录 package.json 中添加 monorepo 所需的如下内容

```
  "dependencies": {
    "yu-element": "workspace:*",
    "@yu-element/hooks": "workspace:*",
    "@yu-element/theme": "workspace:*",
    "@yu-element/utils": "workspace:*"
  }
```

> 接下来，添加 分包 中的依赖

- components

  ```
  pnpm add -D @vue/test-utils@^2.4.5 @vitest/coverage-v8@^1.4.0 jsdom@^24.0.0 --filter @yu-element/components
  pnpm add @popperjs/core@^2.11.8 async-validator@^4.2.5 --filter @yu-element/components
  ```

- core

  在 core/package.json 中添加如下内容，说明 core 子包依赖内部子包@yu-element/components

  ```
  {
    "dependencies": {
      "@yu-element/components": "workspace:*"
    }
  }
  ```

- docs

  ```
  pnpm add -D vitepress@1.0.0-rc.44 --filter @yu-element/docs
  ```

- play

  将 play/package.json 中冗余部分删除（根目录中已经有了）
  
  ![image-20241118232542777](README.assets/image-20241118232542777.png)

​	删除tsconfig.js和tsconfig.node.js文件，后续在根目录下会新建全局tsconfig.json和tsconfig.node.json文件

## 配置

在根目录创建一些必要额配置文件

postcss.config.cjs

```
/* eslint-env node */
module.exports = {
  plugins: [
    require("postcss-nested"),
    require("postcss-each-variables"),
    require("postcss-each")({
      plugins: {
        beforeEach: [require("postcss-for"), require("postcss-color-mix")],
      },
    }),
  ],
};
```

tsconfig.json

```
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "jsxImportSource": "vue",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["packages/**/*.ts", "packages/**/*.tsx", "packages/**/*.vue"]
}
```

tsconfig.node.json

```
{
  "extends": "@tsconfig/node18/tsconfig.json",
  "include": ["packages/**/**.config.ts"],
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"]
  }
}
```

## [创建各个分包入口](https://ericwxy.github.io/eric-wiki/my-projects/eric-ui/start.html#创建各个分包-入口)

- components

  创建 `index.ts` 以及第一个开胃菜 Button 组件的目录

  我们先在 Button 目录创建一个最简陋的 vue sfc

  vue

  ```
  <template>
    <button style="color:red;">test button</button>
  </template>
  ```

  并在 Button 目录中创建 入口 `index.ts` 导出我们的 Button 组件

  > 注： 这里说明一下，我们这次的组件库项目每个组件的目录大致结构如下,简单统一规范一下
  >
  > shell
  >
  > ```
  > - Xxx.test.tsx
  > - Xxx.vue
  > - types.ts
  > - style.css
  > - index.ts
  > - * constants.ts
  > ```

  在 components/index.ts 中导出我们的 Button 组件

  改 package.json 中 入口为 `index.ts`

- core

  创建 `index.ts` 、`components.ts`

  typescript

  ```
  // components.ts

  import { ErButton } from "@yu-element/components";
  import type { Plugin } from "vue";

  export default [ErButton] as Plugin[];
  ```

  创建 第一个 utils 文件 `install.ts` 用于 vue plugin 安装的一系列操作

  typescript

  ```
  import type { App, Plugin } from "vue";
  import { each } from "lodash-es";

  type SFCWithInstall<T> = T & Plugin;

  export function makeInstaller(components: Plugin[]) {
    const install = (app: App) =>
      each(components, (c) => {
        app.use(c);
      });

    return install;
  }

  export const withInstall = <T>(component: T) => {
    (component as SFCWithInstall<T>).install = (app: App) => {
      const name = (component as any)?.name || "UnnamedComponent";
      app.component(name, component as SFCWithInstall<T>);
    };
    return component as SFCWithInstall<T>;
  };
  ```

  在 core/index.ts 中导出我们的 components

  typescript

  ```
  import { makeInstaller } from "@yu-element/utils";
  import components from "./components";

  const installer = makeInstaller(components);

  export * from "@yu-element/components";
  export default installer;
  ```

  改 package.json 中 入口为 `index.ts`

- theme 创建 `index.css` 、`reset.css` 在 theme/index.css 中导入 reset.css

  css

  ```
  /** reset.css */
  body {
    font-family: var(--er-font-family);
    font-weight: 400;
    font-size: var(--er-font-size-base);
    line-height: calc(var(--er-font-size-base) * 1.2);
    color: var(--er-text-color-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
  }
  
  a {
    color: var(--er-color-primary);
    text-decoration: none;
  
    &:hover,
    &:focus {
      color: var(--er-color-primary-light-3);
    }
  
    &:active {
      color: var(--er-color-primary-dark-2);
    }
  }
  
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--er-text-color-regular);
    font-weight: inherit;
  
    &:first-child {
      margin-top: 0;
    }
  
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  h1 {
    font-size: calc(var(--er-font-size-base) + 6px);
  }
  
  h2 {
    font-size: calc(var(--er-font-size-base) + 4px);
  }
  
  h3 {
    font-size: calc(var(--er-font-size-base) + 2px);
  }
  
  h4,
  h5,
  h6,
  p {
    font-size: inherit;
  }
  
  p {
    line-height: 1.8;
  
    &:first-child {
      margin-top: 0;
    }
  
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  sup,
  sub {
    font-size: calc(var(--er-font-size-base) - 1px);
  }
  
  small {
    font-size: calc(var(--er-font-size-base) - 2px);
  }
  
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid var(--er-border-color-lighter);
  }
  ```

  css

  ```
  /** index.css */
  @import "./reset.css";
  ```

  改 package.json 中 入口为 `index.css` 在 core/index.ts 中导出我们的 theme

  好，我们去 play 目录中看看效果

## [创建 VitePress 文档](https://ericwxy.github.io/eric-wiki/my-projects/eric-ui/start.html#创建vitepress文档)

直接参考官方文档 https://vitepress.dev/zh/guide/getting-started

```
npx vitepress init
```

## [npm script 以及 gihub actions](https://ericwxy.github.io/eric-wiki/my-projects/eric-ui/start.html#npm-script-以及-gihub-actions)

首先我们创建一些 必要的 npm script

在 根目录 `package.json` 中添加

json

```
{
  "scripts": {
    "dev": "pnpm --filter @yu-element/play dev",
    "docs:dev": "pnpm --filter @yu-element/docs dev",
    "docs:build": "pnpm --filter @yu-element/docs build",
    "test": "echo \"todo\""
  }
}
```

跑一跑试一下

接下来去 github 创建一个仓库，复制仓库地址

shell

```
git remote add origin https://github.com/your-name/your-repo.git
```

创建一个 `.github/workflows/test-and-deploy.yml` 文件，内容如下

yaml

```
name: Test and deploy

on:
  push:
    branches:
      - master

jobs:
  test:
    name: Run Lint and Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: npm run test

  build:
    name: Build docs
    runs-on: ubuntu-latest
    needs: test

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build docs
        run: npm run docs:build

      - name: Upload docs
        uses: actions/upload-artifact@v3
        with:
          name: docs
          path: ./packages/docs/.vitepress/dist

  deploy:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Download docs
        uses: actions/download-artifact@v3
        with:
          name: docs

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GH_TOKEN }}
          publish_dir: .
```

去 github 仓库的 setting 中设置 secrets

好了，我们可以提交我们的 “first commit” 了

## 参考

https://ericwxy.github.io/eric-wiki/my-projects/eric-ui/start.html
