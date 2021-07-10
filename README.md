# 教程

1. install `nvm`: node version manager
2. `nvm use stable`: use LTS node
3. `npm run initialize`: initialize all projects
4. `npm run start:<app-name>`: app-name: hardware | city

## IDE

`VSCode + Vetur`. Make sure to enable `vetur.experimental.templateInterpolationService` in settings!

## Conclusion

- use `ts-node` to exec scripts shell is not recognize `ts` file extension
  - delete `type:module` in `package.json`
