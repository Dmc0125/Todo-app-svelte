<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let id: string
  $: elId = id.toLowerCase()
  export let error: null | string = null
  export let value: string

  const dispatch = createEventDispatcher()
  const input = () => {
    dispatch('input')
  }
</script>

<label for={elId}>
  {#if $$slots.label}
    <span class="label">
      {id}
      <slot name="label" />
    </span>
  {:else}
    {id}
  {/if}

  <input type="text" id={elId} class={error ? 'error' : ''} bind:value on:input={input} />
  {#if error}
    <span class="error-message">{error}</span>
  {/if}
</label>

<style>
  label {
    position: relative;
  }

  .label {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .error {
    --border-color: var(--error-clr);
    --form-element-active-border-color: var(--error-clr);
    --form-element-focus-color: var(--error-shadow-clr);
  }

  .error-message {
    position: absolute;
    bottom: -0.25rem;
    left: 0;
    width: 100%;

    font-size: 0.8rem;
    color: #fe8d85;
  }
</style>
