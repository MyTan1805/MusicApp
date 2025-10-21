// File: config/gluestack-ui.config.ts
// Đây là file config mặc định được export từ thư viện

import { config as defaultConfig } from '@gluestack-ui/config';

export const config = {
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    // Bạn có thể ghi đè hoặc thêm các giá trị theme ở đây nếu muốn
  },
};