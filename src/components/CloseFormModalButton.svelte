<script lang="ts">
  import { closeModal } from '$lib/layouts/ModalOverlay.svelte'
</script>

<button class="secondary" on:click={closeModal} type="button">
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke-width="1.5">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke="currentColor"
      d="m5.5 5.5 13 13m-13 0 13-13"
    />
  </svg>
</button>

<style>
  button {
    height: 1.5rem;
    width: 1.5rem;
    padding: 0;
    display: grid;
    place-items: center;
  }
</style>
