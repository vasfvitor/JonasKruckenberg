import rss from '@astrojs/rss';
import { MarkdownInstance } from 'astro'
import { SITE_TITLE, SITE_DESCRIPTION } from '../config';

export const get = async () => {
	const posts = import.meta.glob('./blog/**/*.{md,mdx}')

	const items = await Promise.all(Object.values(posts).map(async (getPost) => {
		const post = await getPost() as MarkdownInstance<{ title: string, description: string, pubDate: string }>;

		return {
			title: post.frontmatter.title,
			description: post.frontmatter.description,
			pubDate: new Date(post.frontmatter.pubDate),
			content: post.compiledContent(),
			link: post.url
		}
	}))	

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: import.meta.env.SITE,
		items
	});
}