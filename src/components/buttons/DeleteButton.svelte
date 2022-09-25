<script lang="ts">
  import DeleteIcon from '../icons/DeleteIcon.svelte'
</script>

<button on:click class="btn-small btn-delete" type="button">
  <DeleteIcon height="60%" />
  <slot />
</button>

<style>
  button {
    --border-color: var(--error-clr);
    --primary-focus: var(--error-shadow-clr);
    width: fit-content;
    background-color: var(--error-clr);
    gap: 0.25rem;
  }

  button:hover {
    background-color: var(--error-hover-clr);
  }
</style>
