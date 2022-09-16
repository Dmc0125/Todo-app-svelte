<script lang="ts">
  import { onDestroy } from 'svelte'
  import { fade } from 'svelte/transition'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  let show = false

  const closeModal = () => {
    goto(`${$page.url.origin}${$page.url.pathname}`, {
      keepfocus: true,
      replaceState: true,
      noscroll: true,
    })
  }

  const unsub = page.subscribe((_page) => {
    if (_page.url.searchParams.get('showModal') === 'true') {
      show = true
    } else if (!_page.url.searchParams.get('showModal')) {
      show = false
    }
  })

  onDestroy(unsub)
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
  }

  :global([data-theme='dark'] .modal-overlay) {
    background: rgba(255, 255, 255, 0.05);
  }
</style>
