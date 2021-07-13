# 教程

1. install `nvm`: node version manager
2. `nvm use stable`: use LTS node
3. `npm run initialize`: initialize all projects
4. `npm run start:<app-name>`: app-name: hardware | city

## IDE

`VSCode + Vetur`. Make sure to enable `vetur.experimental.templateInterpolationService` in settings!

## 7-12

1. vite 使用 ~2.3.0, 解决了 lerna 中可以使用`--stream`进行流输出.

2. 在 config 中添加`package.json`中, 解决了 vite.config.js 中可以 import config 目录中的文件

3. 使用`vue-class-component` & `vue-property-decorator`实现 class vue component

```js
import { Vue, Component } from "vue-property-decorator";
@Component
class HelloClassComponent extends Vue {}
```

## 7-13

1. 使用 husky commit-msg 添加了 [commitlint](https://github.com/conventional-changelog/commitlint), 在文档中使用了`npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'`, 这里不知道为什么无法执行npx. 所以我直接在package.json中添加了`commitlint`脚本, 在husky中直接调用了`npm run commitlint`.


## 7-14

1. class 中的属性需要默认值.
参考: https://stackoverflow.com/questions/49699067/property-has-no-initializer-and-is-not-definitely-assigned-in-the-construc
## Conclusion

- use `ts-node` to exec scripts shell is not recognize `ts` file extension

  - delete `type:module` in `package.json`

- use `vite: ~2.3.0`, if you use a higher version, the `--stream` is invalid.

- import is invalid in `vite.config.js`, if import other directory
  - you need to create a file `package.json` in directory which is imported file root.

## refer

vite config 详解: https://github.com/Asarua/vite2-config-description/blob/master/vite.config.ts
ts config 详解: https://lq782655835.github.io/blogs/project/ts-tsconfig.html
