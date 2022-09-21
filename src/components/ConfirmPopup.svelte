<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fly } from 'svelte/transition'

  const dispatch = createEventDispatcher()
  const dispatchCancel = () => {
    dispatch('cancel')
  }
  const dispatchSave = () => {
    dispatch('save')
  }

  export let show: boolean
  export let saveLoading: boolean
</script>

{#if show}
  <article transition:fly={{ duration: 200, y: 20, opacity: 0 }}>
    <p>
      <slot />
    </p>
    <button class="secondary" on:click={dispatchCancel} disabled={saveLoading}>Cancel</button>
    <button
      class="save-btn primary"
      on:click={dispatchSave}
      aria-busy={saveLoading}
      disabled={saveLoading}
    >
      {#if !saveLoading}
        Save
      {/if}
    </button>
  </article>
{/if}

<style>
  article {
    position: absolute;
    bottom: 3.5%;
    left: 50%;
    transform: translateX(-50%);

    width: fit-content;
    min-width: 30rem;
    margin: 0;
    padding: 0.75rem 1.25rem;

    display: flex;
    align-items: center;
  }

  p {
    margin: 0;
    margin-right: 2rem;
    font-weight: 500;
  }

  button {
    width: 6rem;
    height: 2.5rem;
    padding: 0;
    margin: 0;
  }

  .save-btn {
    margin-left: 1rem;
  }
</style>
