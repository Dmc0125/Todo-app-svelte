<script lang="ts" context="module">
  import { page } from '$app/stores'
  import { get } from 'svelte/store'
  
  export const closeModal = () => {
    const { origin, pathname } = get(page).url
    goto(`${origin}${pathname}`, {
      keepfocus: true,
      replaceState: true,
      noscroll: true,
    })
  }
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import { fade } from 'svelte/transition'
  import { goto } from '$app/navigation'
  import { createEventDispatcher } from 'svelte'
  import { browser } from '$app/environment'

  const dispatch = createEventDispatcher()

  let show = false

  const unsub = page.subscribe((_page) => {
    if (_page.url.searchParams.get('showModal') === 'true') {
      show = true
    } else {
      dispatch('close')
      show = false
    }
  })

  const closeListener = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal()
    }
  }

  $: {
    if (browser) {
      if (show) {
        document.addEventListener('keydown', closeListener)
      } else {
        document.removeEventListener('keydown', closeListener)
      }
    }
  }
  onDestroy(() => {
    unsub()
    if (browser) {
      document.removeEventListener('keydown', closeListener)
    }
  })
</script>

{#if show}
  <div class="modal-overlay" on:click={closeModal} transition:fade={{ duration: 100 }}>
    <div on:click|stopPropagation>
      <slot />
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.05);
    display: grid;
    place-items: center;
    z-index: 1000;
  }

  :global([data-theme='dark'] .modal-overlay) {
    background: rgba(255, 255, 255, 0.05);
  }
</style>
