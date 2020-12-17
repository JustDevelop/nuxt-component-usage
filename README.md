# Still in development

## Todo

- Optimise name matching --> <A and AA results in 2 matches for component A. Maybe add regex ($ to mark end of line) or check with a space)
- Refactor some code and write unit tests
- Add TS support

# nuxt-component-usage

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> View usage for each component

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

1. Add `nuxt-component-usage` dependency to your project

```bash
yarn add nuxt-component-usage # or npm install nuxt-component-usage
```

2. Add `nuxt-component-usage` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    'nuxt-component-usage',

    // With options
    ['nuxt-component-usage', { /* module options */ }]
  ]
}
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Justin Fransen

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-component-usage/latest.svg
[npm-version-href]: https://npmjs.com/package/nuxt-component-usage

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-component-usage.svg
[npm-downloads-href]: https://npmjs.com/package/nuxt-component-usage

[github-actions-ci-src]: https://github.com/JustDevelop/nuxt-component-usage/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/JustDevelop/nuxt-component-usage/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/JustDevelop/nuxt-component-usage.svg
[codecov-href]: https://codecov.io/gh/JustDevelop/nuxt-component-usage

[license-src]: https://img.shields.io/npm/l/nuxt-component-usage.svg
[license-href]: https://npmjs.com/package/nuxt-component-usage
