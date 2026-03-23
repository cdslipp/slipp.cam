<script lang="ts">
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';

	let { children }: { children: Snippet } = $props();

	// --- Top pull (pull to do nothing) ---
	let pullDistance = $state(0);
	let pulling = $state(false);
	let releasing = $state(false);
	let flashing = $state(false);
	let touchStartY = 0;

	const MAX_PULL = 400;
	const FLASH_THRESHOLD = 380;
	const RESISTANCE = 0.35;

	let wheelTimer: ReturnType<typeof setTimeout>;

	// --- Bottom pull (ASCII art reveal) ---
	let bottomPull = $state(0);
	let bottomPulling = $state(false);
	let bottomReleasing = $state(false);
	let bottomLocked = $state(false);
	let bottomTouchStartY = 0;

	const BOTTOM_MAX_PULL = 400;
	const BOTTOM_RESISTANCE = 0.4;

	let bottomWheelTimer: ReturnType<typeof setTimeout>;

	const ASCII_ART = ` ░▒▓██████▓▒░ ░▒▓██████▓▒░░▒▓██████████████▓▒░░▒▓████████▓▒░▒▓███████▓▒░ ░▒▓██████▓▒░░▒▓███████▓▒░        ░▒▓███████▓▒░▒▓█▓▒░      ░▒▓█▓▒░▒▓███████▓▒░░▒▓███████▓▒░
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░      ░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓██████▓▒░ ░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░       ░▒▓██████▓▒░░▒▓█▓▒░      ░▒▓█▓▒░▒▓███████▓▒░░▒▓███████▓▒░
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░             ░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░             ░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░
 ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░      ░▒▓███████▓▒░░▒▓████████▓▒░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░`;

	function isAtTop() {
		return window.scrollY <= 0;
	}

	function isAtBottom() {
		return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
	}

	function release() {
		if (pullDistance >= FLASH_THRESHOLD) {
			flashing = true;
			releasing = true;
			pullDistance = 0;
			pulling = false;
			setTimeout(() => {
				flashing = false;
				releasing = false;
			}, 1200);
		} else if (pullDistance > 0) {
			releasing = true;
			pullDistance = 0;
			pulling = false;
			setTimeout(() => {
				releasing = false;
			}, 500);
		} else {
			pulling = false;
		}
	}

	function bottomRelease() {
		if (bottomPull / BOTTOM_MAX_PULL > 0.8) {
			// Lock the art in place once sufficiently revealed
			bottomPull = BOTTOM_MAX_PULL;
			bottomPulling = false;
			bottomLocked = true;
		} else if (bottomPull > 0) {
			bottomReleasing = true;
			bottomPull = 0;
			bottomPulling = false;
			setTimeout(() => {
				bottomReleasing = false;
			}, 500);
		} else {
			bottomPulling = false;
		}
	}

	function handleWheel(e: WheelEvent) {
		if (releasing || flashing || bottomReleasing) return;

		// When bottom art is locked, scroll up to dismiss or down to navigate
		if (bottomLocked) {
			if (e.deltaY < 0) {
				e.preventDefault();
				bottomReleasing = true;
				bottomPull = 0;
				bottomLocked = false;
				setTimeout(() => {
					bottomReleasing = false;
				}, 500);
			} else if (e.deltaY > 0) {
				e.preventDefault();
				goto('/source');
			}
			return;
		}

		// Top pull: scrolling up at top
		if (e.deltaY < 0 && isAtTop() && !pulling && !bottomPulling) {
			pulling = true;
		}

		// Bottom pull: scrolling down at bottom
		if (e.deltaY > 0 && isAtBottom() && !bottomPulling && !pulling) {
			bottomPulling = true;
		}

		if (pulling) {
			e.preventDefault();

			if (e.deltaY < 0) {
				pullDistance = Math.min(MAX_PULL, pullDistance + Math.abs(e.deltaY) * RESISTANCE);
			} else {
				pullDistance = Math.max(0, pullDistance - Math.abs(e.deltaY) * RESISTANCE);
				if (pullDistance === 0) {
					pulling = false;
				}
			}

			clearTimeout(wheelTimer);
			if (pulling) {
				wheelTimer = setTimeout(release, 200);
			}
			return;
		}

		if (bottomPulling) {
			e.preventDefault();

			if (e.deltaY > 0) {
				bottomPull = Math.min(BOTTOM_MAX_PULL, bottomPull + Math.abs(e.deltaY) * BOTTOM_RESISTANCE);
			} else {
				bottomPull = Math.max(0, bottomPull - Math.abs(e.deltaY) * BOTTOM_RESISTANCE);
				if (bottomPull === 0) {
					bottomPulling = false;
				}
			}

			clearTimeout(bottomWheelTimer);
			if (bottomPulling) {
				bottomWheelTimer = setTimeout(bottomRelease, 200);
			}
			return;
		}
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartY = e.touches[0].clientY;
		bottomTouchStartY = e.touches[0].clientY;
	}

	function handleTouchMove(e: TouchEvent) {
		if (releasing || flashing || bottomReleasing) return;

		if (bottomLocked) {
			const touchY = e.touches[0].clientY;
			const diff = touchY - bottomTouchStartY;
			if (diff > 30) {
				bottomReleasing = true;
				bottomPull = 0;
				bottomLocked = false;
				setTimeout(() => {
					bottomReleasing = false;
				}, 500);
			} else if (diff < -30) {
				goto('/source');
			}
			return;
		}

		const touchY = e.touches[0].clientY;
		const diff = touchY - touchStartY;
		const bottomDiff = touchY - bottomTouchStartY;

		// Top pull: dragging down at top
		if (diff > 0 && isAtTop() && !pulling && !bottomPulling) {
			pulling = true;
		}

		// Bottom pull: dragging up at bottom
		if (bottomDiff < 0 && isAtBottom() && !bottomPulling && !pulling) {
			bottomPulling = true;
		}

		if (pulling) {
			e.preventDefault();
			pullDistance = Math.min(MAX_PULL, Math.max(0, diff * RESISTANCE));
			if (pullDistance === 0) {
				pulling = false;
			}
			return;
		}

		if (bottomPulling) {
			e.preventDefault();
			bottomPull = Math.min(BOTTOM_MAX_PULL, Math.max(0, Math.abs(bottomDiff) * BOTTOM_RESISTANCE));
			if (bottomPull === 0) {
				bottomPulling = false;
			}
			return;
		}
	}

	function handleTouchEnd() {
		if (pulling) release();
		if (bottomPulling) bottomRelease();
	}

	$effect(() => {
		window.addEventListener('wheel', handleWheel, { passive: false });
		window.addEventListener('touchstart', handleTouchStart, { passive: true });
		window.addEventListener('touchmove', handleTouchMove, { passive: false });
		window.addEventListener('touchend', handleTouchEnd, { passive: true });

		return () => {
			window.removeEventListener('wheel', handleWheel);
			window.removeEventListener('touchstart', handleTouchStart);
			window.removeEventListener('touchmove', handleTouchMove);
			window.removeEventListener('touchend', handleTouchEnd);
			clearTimeout(wheelTimer);
			clearTimeout(bottomWheelTimer);
		};
	});

	let progress = $derived(pullDistance / MAX_PULL);
	let nearFlash = $derived(pullDistance >= FLASH_THRESHOLD);
	let bottomProgress = $derived(bottomPull / BOTTOM_MAX_PULL);
</script>

<!-- Gradient overlay revealed by pulling -->
<div
	class="pull-overlay"
	style="height: {pullDistance}px; opacity: {progress};"
	class:releasing
>
	<div class="sparkle-field">
		{#each { length: 14 } as _, i (i)}
			<span
				class="sparkle"
				style="--x: {((i * 37 + 13) % 100)}%; --y: {((i * 53 + 7) % 80 + 10)}%; --delay: {i * 0.11}s; --size: {(i % 3 === 0 ? 3 : 4)}px;"
			></span>
		{/each}
	</div>
	<p class="pull-text" style="opacity: {Math.max(0, (progress - 0.2) / 0.5)};">
		pull to do nothing
	</p>
	{#if nearFlash}
		<p class="pull-hint">let go...</p>
	{/if}
</div>

<!-- Full-screen NOTHING flash -->
{#if flashing}
	<div class="flash-overlay">
		<span class="flash-text">NOTHING</span>
	</div>
{/if}

<div
	class="pull-content"
	class:releasing
	class:bottom-releasing={bottomReleasing}
	style="transform: translateY({pullDistance - bottomPull}px);"
>
	{@render children()}
</div>

<!-- Bottom overlay: ASCII art revealed by overscrolling past bottom -->
<div
	class="bottom-overlay"
	style="height: {bottomPull}px; opacity: {bottomProgress};"
	class:bottom-releasing={bottomReleasing}
>
	<pre class="ascii-art" style="opacity: {Math.max(0, (bottomProgress - 0.3) / 0.7)};">{ASCII_ART}</pre>
	{#if bottomLocked}
		<span class="source-hint">keep scrolling...</span>
	{/if}
</div>

<style>
	.pull-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		overflow: hidden;
		background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5em;
	}

	.pull-overlay.releasing {
		transition:
			height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.pull-text {
		color: white;
		font-size: 0.9em;
		font-style: italic;
		letter-spacing: 0.15em;
		margin: 0;
		z-index: 2;
		pointer-events: none;
		white-space: nowrap;
	}

	.pull-hint {
		color: rgba(255, 255, 255, 0.9);
		font-size: 0.75em;
		font-style: italic;
		letter-spacing: 0.1em;
		margin: 0;
		z-index: 2;
		pointer-events: none;
		animation: pulse 0.6s ease-in-out infinite alternate;
	}

	@keyframes pulse {
		from {
			opacity: 0.5;
		}
		to {
			opacity: 1;
		}
	}

	.sparkle-field {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.sparkle {
		position: absolute;
		width: var(--size);
		height: var(--size);
		background: white;
		border-radius: 50%;
		opacity: 0;
		left: var(--x);
		top: var(--y);
		animation: twinkle 1.5s ease-in-out infinite;
		animation-delay: var(--delay);
	}

	@keyframes twinkle {
		0%,
		100% {
			opacity: 0;
			transform: scale(0);
		}
		50% {
			opacity: 0.85;
			transform: scale(1);
		}
	}

	/* Full-screen flash */
	.flash-overlay {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		animation: flash-in-out 1.2s ease-out forwards;
	}

	.flash-text {
		color: #764ba2;
		font-size: 20vw;
		font-weight: bold;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		animation: flash-scale 1.2s ease-out forwards;
		text-shadow:
			0 0 30px rgba(118, 75, 162, 0.4),
			0 0 60px rgba(240, 147, 251, 0.3);
	}

	:global(html.dark) .flash-text {
		color: #f093fb;
		text-shadow:
			0 0 30px rgba(240, 147, 251, 0.5),
			0 0 60px rgba(118, 75, 162, 0.4);
	}

	@keyframes flash-in-out {
		0% {
			opacity: 1;
		}
		60% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes flash-scale {
		0% {
			transform: scale(0.5);
			opacity: 0;
		}
		15% {
			transform: scale(1.1);
			opacity: 1;
		}
		30% {
			transform: scale(1);
		}
		60% {
			transform: scale(1);
			opacity: 1;
		}
		100% {
			transform: scale(1.5);
			opacity: 0;
		}
	}

	.pull-content {
		position: relative;
		z-index: 51;
		will-change: transform;
		background: inherit;
	}

	.pull-content.releasing,
	.pull-content.bottom-releasing {
		transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	/* Bottom overlay */
	.bottom-overlay {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		overflow: hidden;
		background: #0a0a0a;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bottom-overlay.bottom-releasing {
		transition:
			height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.ascii-art {
		font-family: 'Courier New', Courier, monospace;
		color: #00ff41;
		font-size: clamp(0.2rem, 0.65vw, 0.75rem);
		line-height: 1.2;
		margin: 0;
		text-align: center;
		white-space: pre;
		text-shadow: 0 0 8px rgba(0, 255, 65, 0.4);
	}

	.source-hint {
		color: #00ff41;
		font-family: 'Courier New', Courier, monospace;
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		margin-top: 0.5em;
		text-shadow: 0 0 6px rgba(0, 255, 65, 0.3);
		animation: pulse 0.8s ease-in-out infinite alternate;
	}
</style>
