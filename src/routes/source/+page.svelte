<script lang="ts">
	import { goto } from '$app/navigation';
	import layoutSource from '../+layout.svelte?raw';
	import pageSource from '../[[section=section]]/+page.svelte?raw';
	import pullSource from '$lib/PullToDoNothing.svelte?raw';
	import configSource from '$lib/site-config.ts?raw';
	import transitionsSource from '$lib/transitions.ts?raw';
	import cssSource from '../layout.css?raw';

	const files = [
		{ path: 'src/routes/+layout.svelte', source: layoutSource },
		{ path: 'src/routes/[[section=section]]/+page.svelte', source: pageSource },
		{ path: 'src/lib/PullToDoNothing.svelte', source: pullSource },
		{ path: 'src/lib/site-config.ts', source: configSource },
		{ path: 'src/lib/transitions.ts', source: transitionsSource },
		{ path: 'src/routes/layout.css', source: cssSource }
	];

	let scrollDelta = $state(0);
	let escapeHint = $state(0);
	const ESCAPE_THRESHOLD = 150;

	function handleWheel(e: WheelEvent) {
		if (window.scrollY === 0 && e.deltaY < 0) {
			scrollDelta += Math.abs(e.deltaY);
			escapeHint = Math.min(scrollDelta / ESCAPE_THRESHOLD, 1);
			if (scrollDelta >= ESCAPE_THRESHOLD) {
				goto('/');
			}
		} else {
			scrollDelta = 0;
			escapeHint = 0;
		}
	}

	let touchStartY = 0;

	function handleTouchStart(e: TouchEvent) {
		touchStartY = e.touches[0].clientY;
	}

	function handleTouchMove(e: TouchEvent) {
		if (window.scrollY === 0) {
			const delta = e.touches[0].clientY - touchStartY;
			if (delta > 0) {
				scrollDelta = delta;
				escapeHint = Math.min(delta / ESCAPE_THRESHOLD, 1);
				if (delta >= ESCAPE_THRESHOLD) {
					goto('/');
				}
			}
		} else {
			scrollDelta = 0;
			escapeHint = 0;
		}
	}

	function handleTouchEnd() {
		scrollDelta = 0;
		escapeHint = 0;
	}
</script>

<svelte:head>
	<title>&gt;_</title>
</svelte:head>

<svelte:window
	onwheel={handleWheel}
	ontouchstart={handleTouchStart}
	ontouchmove={handleTouchMove}
	ontouchend={handleTouchEnd}
/>

<div class="escape-hint" style:opacity={escapeHint}>↑</div>

<div class="source-page">
	{#each files as file, i (file.path)}
		<section class="file-block" style="animation-delay: {i * 80}ms">
			<header class="file-path">{file.path}</header>
			<pre class="file-source">{file.source}</pre>
		</section>
	{/each}

	<div class="cursor">▌</div>
</div>

<style>
	.source-page {
		background: #0a0a0a;
		color: #00ff41;
		font-family: 'Courier New', Courier, monospace;
		min-height: 100vh;
		padding: 2rem 1rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.file-block {
		margin-bottom: 2.5rem;
		animation: fade-in 0.6s ease both;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.file-path {
		color: #555;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		padding: 0.5rem 0;
		border-bottom: 1px solid #1a1a1a;
		margin-bottom: 0;
	}

	.file-source {
		color: #00ff41;
		font-size: 0.75rem;
		line-height: 1.5;
		margin: 0;
		padding: 1rem 0;
		white-space: pre-wrap;
		word-break: break-all;
		overflow-x: auto;
		text-shadow: 0 0 4px rgba(0, 255, 65, 0.15);
	}

	.cursor {
		color: #00ff41;
		font-size: 1.2rem;
		animation: blink 1s step-end infinite;
		text-shadow: 0 0 8px rgba(0, 255, 65, 0.6);
		padding-bottom: 4rem;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}

	.escape-hint {
		position: fixed;
		top: 1rem;
		left: 50%;
		transform: translateX(-50%);
		color: #00ff41;
		font-size: 1.5rem;
		opacity: 0;
		transition: opacity 0.15s ease;
		text-shadow: 0 0 12px rgba(0, 255, 65, 0.5);
		z-index: 10;
		pointer-events: none;
	}
</style>
