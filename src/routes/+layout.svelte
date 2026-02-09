<script lang="ts">
	import './layout.css';
	import { siteConfig } from '$lib/site-config';

	let { children } = $props();

	let dark = $state(false);

	$effect(() => {
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		dark = mq.matches;
		const handler = (e: MediaQueryListEvent) => { dark = e.matches; };
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	$effect(() => {
		document.documentElement.classList.toggle('dark', dark);
	});

	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: siteConfig.name,
		url: siteConfig.url,
		jobTitle: 'Live Events Producer & Software Developer',
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Kitchener',
			addressRegion: 'Ontario',
			addressCountry: 'CA'
		},
		sameAs: [siteConfig.github]
	});
</script>

<svelte:head>
	<title>slipp.cam</title>
	<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💡</text></svg>" />
	<link rel="canonical" href={siteConfig.url} />
	<meta name="description" content={siteConfig.description} />
	<meta name="keywords" content={siteConfig.keywords.join(', ')} />
	<meta name="author" content={siteConfig.author} />
	<meta name="robots" content="index, follow" />
	<meta name="theme-color" content={siteConfig.themeColor} />

	<!-- Open Graph -->
	<meta property="og:title" content={siteConfig.title} />
	<meta property="og:description" content={siteConfig.description} />
	<meta property="og:url" content={siteConfig.url} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content={siteConfig.locale} />
	<meta property="og:site_name" content={siteConfig.name} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={siteConfig.title} />
	<meta name="twitter:description" content={siteConfig.description} />

	<!-- JSON-LD -->
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>
{@render children()}
<p style="margin-top: 2em; font-size: 0.8em; text-align: center;">
	Made in Kitchener, Ontario ·
	<button onclick={() => { dark = !dark; }} style="color: gray; background: none; border: none; font: inherit; cursor: pointer; padding: 0;">
		{dark ? 'light mode' : 'dark mode'}
	</button>
</p>
