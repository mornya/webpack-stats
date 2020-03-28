# Vessel
![npm](https://img.shields.io/npm/v/@mornya/vessel)
![node](https://img.shields.io/node/v/@mornya/vessel)
![NPM](https://img.shields.io/npm/l/@mornya/vessel)
<br>Copyright 2020. mornya. All rights reserved.

## About
JavaScript 라이브러리 개발을 위한 TypeScript 기반의 코드 템플릿을 생성해 주는 프로젝트.
빠른 개발/배포를 위해 초기 환경을 미리 설정해 두어, 컴파일/테스트/배포 등 관련 세부 설정에 대해 신경쓰지 않고 코드 개발에 집중하도록 스케폴딩을 제공.

## Features
- TypeScript / ES6+ support with [TypeScript](https://www.typescriptlang.org/).
- No Babel
- Linting TypeScript / JavaScript codes with [ESLint](http://eslint.org/).
- Testing codes with [Jest](https://facebook.github.io/jest/).
- Your package can be created with a template, and fewer preferences.
- Created packages can be published in places such as [NPM Registry](https://www.npmjs.com/).

## Installation
생성된 프로젝트의 빌드/테스트 등 개발 전반에 필요한 `vessel`은 기본적으로 전역 모듈로 설치되어 있어야 한다.<br>
아래와 같이 커맨드 라인에서 실행 가능하도록 한다.
> `npm` 대신 `yarn` 사용시, 프로젝트 루트 경로에 `package-lock.json` 파일이 존재하면 제거하고 `yarn.lock` 파일만 참조되도록 한다.
```bash
$ npm install -g @mornya/vessel
or
$ yarn global add @mornya/vessel
```

## Available scripts
`package.json`에 정의된 script 항목에 대한 내용은 아래와 같다.

### `Clean`
> 빌드 output 디렉토리 경로를 삭제한다.
```bash
$ npm run clean
```

### `Build`
> TypeScript로 작성된 모듈들은 컴파일러에 의해 transpiling 된 후 minify 되어 `./dist` 디렉토리에 출력된다.<br>
 tsconfig.json 설정에 따라 `vessel`에서 제공되는 컴파일 스텝이 진행되며 완료시 퍼블리시가 가능한 환경을 제공한다.
```bash
$ npm run build
```

### `Watch`
> TypeScript 컴파일러의 watch 기능을 수행한다.
```bash
$ npm run watch
```

### `Lint`
> ESLint를 실행하여 문법 오류 등을 체크한다.
```bash
$ npm run lint
```

### `Lint:fix`
> ESLint를 실행하여 문법 오류 등을 체크 및 자동으로 고친다.
```bash
$ npm run lint:fix
```

### `Test`
> Jest를 실행하여 테스트케이스를 수행한다.
```bash
$ npm run test
```

### `Test:watch`
> Jest를 실행하여 watch mode로 테스트케이스를 수행한다.
```bash
$ npm run test:watch
```

### `Test:coverage`
> Jest를 실행하여 테스트 커버리지 데이터를 수집하여 `/coverage` 디렉토리에 출력한다.
```bash
$ npm run test:coverage
```

### `Login`
> package.json의 publishConfig 항목에 설정되거나 기본 NPM Registry로의 퍼블리시를 위해 NPM 로그인 처리를 수행한다.
`npm login`에 scope를 선언하여 처리하는 방식과 동일.
```bash
$ npm run login (not "npm login")
```

### `Publish`
> 설정된 registry로 퍼블리시를 수행하기 이전에 로그인/빌드/버전체크 등을 실행한 후 퍼블리시 진행한다.
```bash
$ npm publish
```
