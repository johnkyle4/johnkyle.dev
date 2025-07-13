const fs = require('fs');
const path = require('path');

const baseUrl = 'https://johnkyle.dev';
const rootDir = '.'; // Adjust if your HTML files are in a subfolder

function getHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap(entry => {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      return getHtmlFiles(res);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      return [res];
    } else {
      return [];
    }
  });
}

const htmlFiles = getHtmlFiles(rootDir);

const urls = htmlFiles.map(filePath => {
  const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const url = `${baseUrl}/${relPath}`;
  const stats = fs.statSync(filePath);
  const lastmod = stats.mtime.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  return { url, lastmod };
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, lastmod }) =>
  `  <url>\n    <loc>${url}</loc>\n    <lastm
