# 教程

1. install `nvm`: node version manager
2. `nvm use stable`: use LTS node
3. `npm run initialize`: initialize all projects
4. `npm run start:<app-name>`: app-name: hardware | city

## IDE

`VSCode + Vetur`. Make sure to enable `vetur.experimental.templateInterpolationService` in settings!

## 7-12

1. vite 使用 ~2.3.0, 解决了lerna中可以使用`--stream`进行流输出.

2. 在config中添加`package.json`中, 解决了vite.config.js中可以import config目录中的文件

3. 使用`vue-class-component` & `vue-property-decorator`实现 class vue component

```js
import { Vue, Component} from 'vue-property-decorator';
@Component
class HelloClassComponent extends Vue {}
```

## Conclusion

- use `ts-node` to exec scripts shell is not recognize `ts` file extension
  - delete `type:module` in `package.json`

- use `vite: ~2.3.0`, if you use a higher version, the `--stream` is invalid.

- import is invalid in `vite.config.js`, if import other directory
  -  you need to create a file `package.json` in directory which is imported file root.