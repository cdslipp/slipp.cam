<script lang="ts">
	import { tvOn } from '$lib/transitions';
	import ExternalLink from '$lib/ExternalLink.svelte';

	let { data } = $props();
	let activeSection = $derived(data.section);

	const sections = [
		{ slug: 'software', title: 'little software projects' },
		{ slug: 'theatre', title: 'theatre projects' },
		{ slug: 'collaborators', title: 'people I\'ve worked with' },
		{ slug: 'stuff-i-use', title: 'stuff I use (and love)' },
		{ slug: 'links', title: 'links' }
	];
</script>

{#snippet theatre()}
	<ul>
		<li>Lighting Designer — <i>Homecoming</i>, MT Space (2025)</li>
		<li>Lighting Designer — <i>Before I Die</i> by Nada Homsi, MT Space (2025)</li>
		<li>Lighting Designer — <i>Sometimes It Snows In April</i></li>
		<li>Production Manager — IMPACT Festival 2023 & 2025</li>
		<li>Co-Technical Director — The Registry Theatre</li>
		<li>Composer/Lyricist — <i>All Art Is Quite Useless</i> (2020)</li>
	</ul>
{/snippet}

{#snippet collaborators()}
	<ul>
		<li><ExternalLink href="https://mtspace.ca">MT Space</ExternalLink></li>
		<li><ExternalLink href="https://unwraptheatre.ca">Unwrap Theatre</ExternalLink></li>
		<li><ExternalLink href="https://greenlight-arts.com">Green Light Arts</ExternalLink></li>
		<li><ExternalLink href="https://interartsmatrix.ca">Inter Arts Matrix</ExternalLink></li>
	</ul>
{/snippet}

{#snippet software()}
	<p>I'm big on making things that are local-first: client-side apps (normally built with SvelteKit) where your data stays on your device.</p>
	<ul>
		<li><ExternalLink href="https://plot.slipp.cam">Lost the Plot</ExternalLink> — Stage plot creator for live music. Plan your stage layout, equipment placement, and input lists with a drag-and-drop editor.</li>
		<li><ExternalLink href="https://slidemerge.vercel.app">SlideMerge</ExternalLink> — Merge PDFs and images in your browser. Nothing gets uploaded, it all runs locally.</li>
		<li><ExternalLink href="https://www.musicbingo.xyz/">Music Bingo</ExternalLink> — Made for my wife to run music bingo at Grad House.</li>
	</ul>
{/snippet}

{#snippet stuffILike()}
	<ul class="two-col">
		<li><ExternalLink href="https://qlab.app">QLab</ExternalLink></li>
		<li><ExternalLink href="https://bitfocus.io/companion">Bitfocus Companion</ExternalLink></li>
		<li><ExternalLink href="https://www.getontime.no/">Ontime</ExternalLink></li>
		<li><ExternalLink href="https://svelte.dev">Svelte</ExternalLink></li>
		<li><ExternalLink href="https://tauri.app">Tauri</ExternalLink></li>
		<li><ExternalLink href="https://sqlite.org/wasm">SQLite WASM</ExternalLink></li>
		<li><ExternalLink href="https://directus.io">Directus</ExternalLink></li>
		<li><ExternalLink href="https://www.steinberg.net/dorico/">Dorico</ExternalLink></li>
		<li><ExternalLink href="https://37signals.com">37signals</ExternalLink></li>
		<li><ExternalLink href="https://orbstack.dev">OrbStack</ExternalLink></li>
		<li><ExternalLink href="https://omarchy.org">Omarchy</ExternalLink></li>
	</ul>
{/snippet}

{#snippet links()}
	<ul>
		<li><ExternalLink href="https://github.com/cdslipp">GitHub</ExternalLink></li>
		<li><ExternalLink href="https://cdslipp.wetransfer.com">Send me files</ExternalLink></li>
	</ul>
{/snippet}

{#snippet sectionContent(slug: string)}
	{#if slug === 'theatre'}
		{@render theatre()}
	{:else if slug === 'collaborators'}
		{@render collaborators()}
	{:else if slug === 'software'}
		{@render software()}
	{:else if slug === 'stuff-i-use'}
		{@render stuffILike()}
	{:else if slug === 'links'}
		{@render links()}
	{/if}
{/snippet}

<h1>Hi!<br>I'm Cameron</h1>
<hr>
<p>I help make live events happen. I also love to make random little software things.</p>
<p>Need stage management, production management, or other live production services? Find me at <ExternalLink href="https://sherwoodsystems.com">Sherwood Systems</ExternalLink>.</p>
<hr>

{#each sections as s (s.slug)}
	<h2><a href={activeSection === s.slug ? '/' : '/' + s.slug}>{s.title}</a></h2>
	{#if activeSection === s.slug}
		<div style="display: flow-root" transition:tvOn>
			{@render sectionContent(s.slug)}
		</div>
	{/if}
	<hr>
{/each}

<p><i>Last updated: February 2026</i></p>
