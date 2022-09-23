<script lang="ts">
  import IconButton from './IconButton.svelte'
  import { closeModal } from '$lib/layouts/ModalOverlay.svelte'
</script>

<IconButton class="secondary close-btn" type="button" on:click={closeModal}>
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke-width="1.5">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke="currentColor"
      d="m5.5 5.5 13 13m-13 0 13-13"
    />
  </svg>
</IconButton>

<style>
  :global(.close-btn) {
    --secondary: rgba(0, 0, 0, 0); 
  }
</style>
