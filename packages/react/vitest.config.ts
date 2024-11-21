import { mergeConfig, defineProject } from 'vitest/config';
import sharedConfig from '../../vitest.shared';

export default mergeConfig(
  sharedConfig,
  defineProject({
    define: {
      'process.env.NODE_ENV': JSON.stringify('test'),
    },
  }),
);