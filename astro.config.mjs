// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const _blogDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src/content/blog');
const _postLastmodMap = new Map();
let _latestLastmodMs = 0;

function _toIsoDate(raw) {
	if (!raw) return null;
	const cleaned = raw.trim().replace(/^['"]|['"]$/g, '');
	const ms = Date.parse(cleaned);
	return Number.isNaN(ms) ? null : { ms, iso: new Date(ms).toISOString() };
}

function _collectBlogDates(dir, prefix = '') {
	if (!fs.existsSync(dir)) return;
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			_collectBlogDates(fullPath, `${prefix}${entry.name}/`);
			continue;
		}
		if (!/\.(md|mdx)$/i.test(entry.name)) continue;
		const content = fs.readFileSync(fullPath, 'utf-8');
		const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
		if (!fmMatch) continue;
		const fm = fmMatch[1];
		const updatedMatch = fm.match(/^updatedDate:\s*(.+)$/m);
		const pubMatch = fm.match(/^pubDate:\s*(.+)$/m);
		const chosen = _toIsoDate(updatedMatch?.[1]) || _toIsoDate(pubMatch?.[1]);
		if (!chosen) continue;
		if (chosen.ms > _latestLastmodMs) _latestLastmodMs = chosen.ms;
		const slug = `${prefix}${entry.name.replace(/\.(md|mdx)$/i, '')}`;
		_postLastmodMap.set(`/blog/${slug}/`, chosen.iso);
		_postLastmodMap.set(`/blog/${slug.toLowerCase()}/`, chosen.iso);
	}
}
_collectBlogDates(_blogDir);
const _fallbackLastmodIso = _latestLastmodMs > 0 ? new Date(_latestLastmodMs).toISOString() : undefined;

export default defineConfig({
	site: 'https://saikyotakutore.ariawriter.com',
	integrations: [mdx(), sitemap({
		serialize(item) {
			let _pathname = new URL(item.url).pathname;
			try { _pathname = decodeURIComponent(_pathname); } catch {}
			if (!_pathname.endsWith('/')) _pathname += '/';
			const _matchedLastmod = _postLastmodMap.get(_pathname) || _postLastmodMap.get(_pathname.toLowerCase()) || _fallbackLastmodIso;
			if (_matchedLastmod) { item.lastmod = _matchedLastmod; } else { delete item.lastmod; }
			item.changefreq = 'weekly';
			item.priority = item.url === 'https://coffeegurasi.ariawriter.com/' || item.url === 'https://saikyotakutore.ariawriter.com/' || item.url === 'https://yohukashinomeisakudana.ariawriter.com/' || item.url === 'https://en-manga.ariawriter.com/' ? 1.0 : 0.8;
			return item;
		}
	})],
	image: {
		domains: [
			'thumbnail.image.rakuten.co.jp',
			'ebook-assets.dmm.com',
			'pics.dmm.co.jp',
			'pics.dmm.com'
		]
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
