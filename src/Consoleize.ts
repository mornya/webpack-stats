import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import zlib from 'zlib';
import cliui from 'cliui';

type WebpackConfigPerformance = false | undefined | null | {
  maxAssetSize?: number;
  maxEntrypointSize?: number;
};
type Performance = {
  maxAssetSize: number;
  maxEntrypointSize: number;
};
type FormatSize = {
  size: number;
  unit: string;
};
type ColumnInfo = {
  head: Array<{
    width?: number;
    padding: [number, number, number, number];
  }>;
  body: Array<{
    padding: [number, number, number, number];
  }>;
};
type BuildWarning = {
  moduleIdentifier: string;
  moduleName: string;
  message: string;
};
type BuildError = {
  moduleIdentifier: string;
  moduleName: string;
  message: string;
};

export namespace Consoleize {
  const ui = cliui({ width: 80, wrap: false });
  const defaultStatJson: StatsJson = {
    all: true,
  };
  const defaultPerformance: Performance = {
    maxAssetSize: 4000, // 256KB
    maxEntrypointSize: 100000, // 128KB
  };
  const columnInfo: ColumnInfo = {
    head: [
      { width: 17, padding: [2, 2, 1, 4] },
      { width: 16, padding: [2, 2, 1, 2] },
      { padding: [2, 4, 1, 2] },
    ],
    body: [
      { padding: [0, 2, 0, 4] },
      { padding: [0, 2, 0, 2] },
      { padding: [0, 4, 0, 2] },
    ],
  };
  const extTypeColor = {
    html: 'white',
    css: 'blue',
    js: 'green',
  };

  /**
   * from
   * Get stats data from .json file (stats.json).
   *
   * @param statsFile {string}
   * @param dir {string}
   * @param webpackConfigPerformance {WebpackConfigPerformance}
   * @returns {string}
   */
  export function from (statsFile: string, dir: string, webpackConfigPerformance: WebpackConfigPerformance): string {
    if (fs.existsSync(statsFile)) {
      const stats = String(fs.readFileSync(statsFile));
      if (stats) {
        return generate(JSON.parse(stats), dir, webpackConfigPerformance);
      } else {
        return '';
      }
    }
    throw new Error('File not found.');
  }

  /**
   * generate
   * Generate stats data from webpack stats object.
   *
   * @param statsJson {StatsJson}
   * @param dir {string}
   * @param webpackConfigPerformance {WebpackConfigPerformance}
   * @returns {string}
   */
  export function generate (statsJson: StatsJson, dir: string, webpackConfigPerformance?: WebpackConfigPerformance): string {
    const json: StatsJson = statsJson && Object.keys(statsJson).length > 1 ? statsJson : defaultStatJson;
    const performance: Performance = { ...defaultPerformance, ...webpackConfigPerformance };
    const seenNames = new Map();

    const assets: StatsJsonAsset[] = (
      json.assets
      ?? json.children?.reduce((acc: StatsJsonAsset[], child: StatsJson) => acc.concat(child.assets), [])
      ?? []
    )
      // 특정 파일확장자명 거르기
      .filter((asset: StatsJsonAsset) => !!asset.name && !/\.(map)(\?.*)?$/.test(asset.name))
      // 쿼리스트링 제거
      .map((asset: StatsJsonAsset) => {
        asset.name = asset.name?.split('?')[0] ?? 'UNKNOWN';
        asset.type = asset.name?.match(/\.(.*)$/)?.[1] ?? 'UNKNOWN';
        return asset;
      })
      // 에셋명 중복 제거
      .filter((asset: StatsJsonAsset) => {
        if (!seenNames.has(asset.name)) {
          seenNames.set(asset.name, true);
          return true;
        }
        return false;
      });

    ui.resetOutput(); // flush memory buffer first!

    // ===== Show asset reports =====
    if (assets.length) {
      ui.div(
        {
          text: chalk.cyan.bold('Module size'),
          width: columnInfo.head[0].width,
          padding: columnInfo.head[0].padding,
        },
        (dir && {
          text: chalk.cyan.bold('GZipped size'),
          width: columnInfo.head[1].width,
          padding: columnInfo.head[1].padding,
        }),
        {
          text: chalk.cyan.bold('Asset name'),
          width: columnInfo.head[2].width,
          padding: columnInfo.head[2].padding,
        },
      );

      // generate report: resources
      generateReport(
        assets
          .filter((asset: StatsJsonAsset) => asset.type !== 'css' && asset.type !== 'js')
          .sort((assetA: StatsJsonAsset, assetB: StatsJsonAsset) => assetB.size - assetA.size),
        dir,
        performance,
      );

      // generate report: css
      generateReport(
        assets
          .filter((asset: StatsJsonAsset) => asset.type === 'css')
          .sort((assetA: StatsJsonAsset, assetB: StatsJsonAsset) => assetB.size - assetA.size),
        dir,
        performance,
      );

      // generate report: js
      generateReport(
        assets
          .filter((asset: StatsJsonAsset) => asset.type === 'js')
          .sort((assetA: StatsJsonAsset, assetB: StatsJsonAsset) => assetB.size - assetA.size),
        dir,
        performance,
      );

      ui.div({
        text: chalk.gray.bold('SourceMap files are omitted in the report.'),
        padding: [0, 2, 0, 4],
      });
    } else {
      ui.div(); // make a new line
    }

    // ===== Extra informations =====
    if (json.version) {
      ui.div({
        text: `${chalk.gray('Webpack version:')} ${json.version}`,
        padding: [0, 2, 0, 4],
      });
    }
    if (json.hash) {
      ui.div({
        text: `${chalk.gray('Webpack hash:')} ${json.hash}`,
        padding: [0, 2, 0, 4],
      });
    }
    if (json.builtAt) {
      ui.div({
        text: `${chalk.gray('Built at:')} ${new Date(json.builtAt)}`,
        padding: [0, 2, 0, 4],
      });
    }
    if (json.time) {
      ui.div({
        text: `${chalk.gray('Build time:')} ${(json.time / 1000).toFixed(2)} ${chalk.gray('seconds')}`,
        padding: [0, 2, 0, 4],
      });
    }
    if (json.publicPath) {
      ui.div({
        text: `${chalk.gray('Public path:')} ${json.publicPath}`,
        padding: [0, 2, 0, 4],
      });
    }
    if (json.outputPath) {
      ui.div({
        text: `${chalk.gray('Output path:')} ${json.outputPath}`,
        padding: [0, 2, 0, 4],
      });
    }
    if (json.filteredAssets) {
      ui.div({
        text: `${chalk.gray('Filtered assets:')} ${json.filteredAssets}`,
        padding: [0, 2, 0, 4],
      });
    }
    if (json.filteredModules) {
      ui.div({
        text: `${chalk.gray('Filtered modules:')} ${json.filteredModules}`,
        padding: [0, 2, 0, 4],
      });
    }

    // ===== Show Warnings =====
    if (json.warnings?.length) {
      ui.div({
        text: chalk.yellow.bold(
          `✔︎ Build succeed with ${json.warnings.length > 1 ? json.warnings.length + ' warnings' : 'a warning'}.\n`,
        ),
        padding: [1, 2, 0, 4],
      });
      ui.div({
        text: (json.warnings as BuildWarning[])
          .map(err => err.moduleName
            ? `${chalk.greenBright.bold(err.moduleName)}\n${err.message}`
            : err.message
          )
          .join('\n\n'),
        padding: [0, 2, 0, 4],
      });
    }

    // ===== Show Errors =====
    if (json.errors?.length) {
      ui.div({
        text: chalk.red.bold(
          `✖︎ Build failed with ${json.errors.length > 1 ? json.errors.length + ' errors' : 'an error'}.\n`,
        ),
        padding: [(json.warnings?.length ? 0 : 1), 2, 0, 4],
      });
      ui.div({
        text: (json.errors as BuildError[])
          .map(err => err.moduleName
            ? `${chalk.greenBright.bold(err.moduleName)}\n${err.message}`
            : err.message
          )
          .join('\n\n'),
        padding: [0, 2, 1, 4],
      });
    }

    const result = ui.toString();

    ui.resetOutput(); // flush memory buffer

    return result;
  }

  function generateReport (assets: StatsJsonAsset[], dir: string, performance: Performance): void {
    assets.forEach((asset: StatsJsonAsset) => {
      const assetSize = formatSize(asset.size);
      const gzipSize = dir ? getGzippedSize(asset.name, dir) : assetSize;
      const assetSizeFixed = assetSize.unit === 'B' ? assetSize.size : assetSize.size.toFixed(2);
      const gzipSizeFixed = gzipSize.unit === 'B' ? gzipSize.size : gzipSize.size.toFixed(2);

      ui.div(
        {
          text: (asset.size >= performance.maxEntrypointSize)
            ? chalk.yellow(assetSizeFixed + ' ' + assetSize.unit)
            : `${assetSizeFixed} ${chalk.gray(assetSize.unit)}`,
          width: columnInfo.head[0].width,
          padding: columnInfo.body[0].padding,
          align: 'right',
        },
        (dir && {
          text: (gzipSize.size >= performance.maxEntrypointSize)
            ? chalk.yellow(gzipSizeFixed + ' ' + gzipSize.unit)
            : `${gzipSizeFixed} ${chalk.gray(gzipSize.unit)}`,
          width: columnInfo.head[1].width,
          padding: columnInfo.body[1].padding,
          align: 'right',
        }),
        {
          text: chalk[extTypeColor[asset.type] ?? 'gray'](asset.name),
          width: columnInfo.head[2].width,
          padding: columnInfo.body[2].padding,
        },
      );
    });

    if (assets.length) {
      ui.div(); // make a new line
    }
  }

  function formatSize (assetSize: number): FormatSize {
    let size: number, unit: string;
    if (assetSize > 1000000) {
      size = assetSize / 1000000; //1048576;
      unit = 'MiB';
    } else if (assetSize > 1000) {
      size = assetSize / 1000; //1024;
      unit = 'KiB';
    } else {
      size = assetSize;
      unit = 'B';
    }
    return { size, unit };
  }

  function getGzippedSize (assetName: string, dir: string): FormatSize {
    const filepath = path.resolve(path.join(dir, assetName));
    const buffer = fs.readFileSync(filepath);
    return formatSize(zlib.gzipSync(buffer).length);
  }
}
