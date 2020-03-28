/*
 * index.d.ts
 * This definition file will typed to "src/index.ts" and sub-modules.
 */

// Sample declaration for test
import webpack from 'webpack';

declare global {
  type StatsJsonAsset = {
    chunks: Array<number | string>;
    chunkNames: string[];
    emitted: boolean;
    isOverSizeLimit?: boolean;
    name: string;
    size: number;
    // custom
    type: string; // js|css|html|...
  };
  type Stats = webpack.Stats;
  type StatsJson = Stats.ToJsonOutput;
}
