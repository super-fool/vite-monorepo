# Monorepo

## root/package.json

workspaces: 里面保存所有需要管理的项目[具有`package.json`的项目], 当子项目需要install/update的依赖, 只需要一条cli即可处理所有的package.json的依赖.

# pnpm

-C <path> 指定路径运行pnpm.
-w 在根目录运行pnpm.

# Lerna

管理模式
- 固定模式:执行lerna publish, 

参考: https://bitbucket.org/letsdebugit/vite-monorepo-example/src/master/
https://www.letsdebug.it/post/12-monorepo-with-vue-vite-lerna/