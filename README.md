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

 删除 tsconfig.js 和 tsconfig.node.js 文件，后续在根目录下会新建全局 tsconfig.json 和 tsconfig.node.json 文件

## 配置

在根目录创建一些必要额配置文件

### postcss

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

### 全局 ts 规则

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

## 创建 monorepo 模式下的依赖路径

**根目录下 pnpm install 会建立整个项目和子包以及子包内的连接关系**

**Scope: all 8 workspace projects**

![image-20241119123727559](README.assets/image-20241119123727559.png)

## [创建各个分包入口](https://ericwxy.github.io/eric-wiki/my-projects/eric-ui/start.html#创建各个分包-入口)

### utils

组件库需要作为插件被挂载到全局

一个插件可以是一个install方法，也可以是一个有install方法的对象

install函数有两个参数，第一个参数是应用实例，第二个参数是传递给app.use的额外选项

```
app.use(myPlugin, {
  /* 可选的选项 */
})
type InstallFunction = (app: App, options?: any) => any
```

创建`install.ts`，包含

- withInstall方法用于给组件添加install方法将组件插件化
- makeInstall方法用于创建注册插件化组件list的install函数

```
import type { App, Plugin } from 'vue';
import { each } from 'lodash-es';

type SFCWithInstall<T> = T & Plugin;

/**
 * 注册所有插件化的组件
 * 该插件是一个install函数
 * @param components 需要被注册的插件
 * @returns 注册函数
 */
export function install(components: Plugin[]) {
  return (app: App) => each(components, (c) => app.use(c));
}

/**
 * 给component添加install方法，使之成为plugin
 * 该插件是一个具有install方法的component对象
 * https://cn.vuejs.org/guide/reusability/plugins.html
 * @param component 作为插件的组件
 * @returns 插件化的组件
 */
export function withInstall<T>(component: T) {
  (component as SFCWithInstall<T>).install = (app: App) => {
    const name = (component as any).name;
    app.component(name, component as Plugin);
  };
  return component;
}
```

### components

创建 `index.ts` 以及第一个开胃菜 Button 组件的目录

我们先在 Button 目录创建一个最简陋的 vue sfc

```
<template>
  <button style="color: red; background-color: #fff;">test button</button>
</template>

<script setup>
  // 在 <script setup> 中声明组件选项
  // https://cn.vuejs.org/api/sfc-script-setup.html#defineoptions
  defineOptions({
    name: 'YuButton'
  })
</script>
```

并在 Button 目录中创建 入口 `index.ts` 导出我们的 Button 组件

> 注： 这里说明一下，我们这次的组件库项目每个组件的目录大致结构如下,简单统一规范一下
>
> ```
>- Xxx.test.tsx
> - Xxx.vue
> - types.ts
> - style.css
> - index.ts
> - * constants.ts
> ```

在 components/index.ts 中导出我们的 Button 组件

改 package.json 中 入口为 `index.ts`



> 如果无法识别.vue文件，需要在component内添加env.d.ts文件
>
> ```
> // env.d.ts
> declare module '*.vue' {
>   import { ComponentOptions } from 'vue';
>   const componentOptions: ComponentOptions;
>   export default componentOptions;
> }
> ```

### core

创建 `index.ts` 、`components.ts`

```
import { YuButton } from '../components';
import type { Plugin } from 'vue';

export default [YuButton] as Plugin[];

```

在 core/index.ts 中导出我们的 components

```
import { install } from '@yu-element/utils';
import components from './components';
// 全局导入样式
import '@yu-element/theme/index.css';

// 注册所有组件的函数
const installer = install(components);

export * from '@yu-element/components';
export default installer;
```

改 package.json 中 入口为 `index.ts`

### theme

theme 创建 `index.css` 、`reset.css` 在 theme/index.css 中导入 reset.css

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

```
/** index.css */
@import "./reset.css";
```

改 package.json 中 入口为 `index.css` 

```
{
  "name": "@yu-element/theme",
  "version": "1.0.0",
  "description": "",
  "main": "index.css",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

在 core/index.ts 中导入样式

## 在play中演练实时效果

### 添加脚本

在 根目录 `package.json` 中添加命令，-- filter用于指定分包

```
  "scripts": {
    "dev": "pnpm --filter @yu-element/play dev"
  },
```

### 启动工程

```
pnpm dev
```



## [创建 VitePress 文档](https://ericwxy.github.io/eric-wiki/my-projects/eric-ui/start.html#创建vitepress文档)

直接参考官方文档 https://vitepress.dev/zh/guide/getting-started

```
cd packages/docs
npx vitepress init
```

```
➜  docs git:(dev) ✗ npx vitepress init

┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./
│
◇  Site title:
│  Yu-Element
│
◇  Site description:
│  A ElementPlus-like component library!
│
◇  Theme:
│  Default Theme
│
◇  Use TypeScript for config and theme files?
│  Yes
│
◇  Add VitePress npm scripts to package.json?
│  Yes
│
└  Done! Now run npm run docs:dev and start writing.

```

修改package.json

```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "vitepress dev",
    "build": "vitepress build",
    "preview": "vitepress preview"
  },
```

根目录下添加npm script

```
  "scripts": {
    "dev": "pnpm --filter @yu-element/play dev",
    "docs:dev": "pnpm --filter @yu-element/docs dev",
    "docs:build": "pnpm --filter @yu-element/docs build",
    "docs:preview": "pnpm --filter @yu-element/docs preview"
  },
```

根目录下执行`pnpm docs:dev`，会5                                                                                                                                                                                                                                                                                                                                                                               

## [gihub actions](https://ericwxy.github.io/eric-wiki/my-projects/eric-ui/start.html#npm-script-以及-gihub-actions)

创建一个 `.github/workflows/test-and-deploy.yml` 文件，内容如下

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
