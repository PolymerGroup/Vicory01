// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // 纯静态输出（SSG）—— Cloudflare Pages 直接托管 dist/
  output: 'static',
  site: 'https://dchemi.com',
  trailingSlash: 'never',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  // 全站 119 个产品页 + 静态页，构建时全部预渲染
  compressHTML: true,
});
