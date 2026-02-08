<script lang="ts">
	import './layout.css';
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
</script>

<svelte:head>
	<title>Cameron Slipp</title>
	<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💡</text></svg>" />
</svelte:head>
{@render children()}
<p style="margin-top: 2em; font-size: 0.8em; text-align: center;">
	<button onclick={() => { dark = !dark; }} style="color: gray; background: none; border: none; font: inherit; cursor: pointer; padding: 0;">
		{dark ? 'light mode' : 'dark mode'}
	</button>
</p>
