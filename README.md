# webpack-stats
![npm](https://img.shields.io/npm/v/webpack-stats)
![node](https://img.shields.io/node/v/webpack-stats)
![types](https://img.shields.io/npm/types/webpack-stats)
![downloads](https://img.shields.io/npm/dw/webpack-stats)
![license](https://img.shields.io/npm/l/webpack-stats)

Copyright 2023. mornya. All rights reserved.

> This project has been created by [Vessel CLI](https://www.npmjs.com/package/@mornya/vessel).
  For a simple and quick reference about it, click [here](https://mornya.github.io/documents/guide/vessel.md).

## About
The library for displaying the contents of `Stats` generated after building the webpack to the console.

![스크린샷](https://mornya.github.io/assets/webpack-stats-screenshot.jpg)

## Installation
해당 라이브러리를 사용 할 프로젝트에서는 아래와 같이 의존성 모듈로 설치한다.
```bash
$ npm install --save webpack-stats
or
$ yarn add webpack-stats
```

## Usage
아래와 같이 모듈을 import하여 사용한다. 아래 Consoleize.generate 설정에 사용된 값은 예시로 표기.
```typescript
import { Consoleize } from 'webpack-stats';
import webpack from 'webpack';

/* ... */

const isWebpackDevServerRun = false;
const webpackConfig = { ... };
const compiler = webpack(webpackConfig);

compiler.hooks.done.tap('done', (stats: webpack.Stats) => {

  // Display generated message in console
  const result = Consoleize.generate(stats.toJson({
      all: false,
      assets: true,
      children: true,
      warnings: stats.hasWarnings(),
      errors: stats.hasErrors(),
      // optional info
      version: !isWebpackDevServerRun,
      hash: !isWebpackDevServerRun,
      builtAt: !isWebpackDevServerRun,
      timings: !isWebpackDevServerRun,
      publicPath: true,
      outputPath: true,
    }),
    (isWebpackDevServerRun ? '' : 'dist'),
    webpackConfig.performance,
  );

  if (result) {
    console.log(result);
  }

});
```

## Modules in the package
본 패키지에는 아래와 같은 모듈들을 포함한다.<br>
제공되는 모듈과 메소드 사용법 등은 코드 스니핏을 참고한다.

### Consoleize module
Consoleize 모듈은 다음과 같은 메소드들을 제공한다.

#### `Consoleize.from`
Generates a message from stats file
- `statsFile`: filename (ex, stats.json)
- `dir`: the webpack build output directory name from project root (empty string does not display GZipped-size)
- `webpackConfigPerformance`: the webpack configuration of `performance` section object.
```typescript
function from(statsFile: string, dir: string, webpackConfigPerformance: WebpackConfigPerformance) {}
```

#### `Consoleize.generate`
Generates a message from stats object
- `statsJson`: result stats value of called by toJson() method
```typescript
function generate(statsJson: webpack.Stats.ToJsonOutput, dir: string, webpackConfigPerformance: WebpackConfigPerformance) {}
```

## Change Log
프로젝트 변경사항은 [CHANGELOG.md](CHANGELOG.md) 파일 참조.

## License
프로젝트 라이센스는 [LICENSE](LICENSE) 참조.
