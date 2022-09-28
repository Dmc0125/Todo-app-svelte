<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let el: 'button' | 'a' = 'button'
  export let href = ''
  export let type: 'submit' | 'button' | undefined = undefined

  const dispatch = createEventDispatcher()
  const dispatchClick = () => {
    if (el === 'button') {
      dispatch('click')
    }
  }

  let className = ''
  export { className as class }
  export let dataTooltip: string | undefined = undefined
  export let style = ''
</script>

<svelte:element
  this={el}
  class="icon-btn {className}"
  href={el === 'a' ? href : undefined}
  on:click={dispatchClick}
  data-tooltip={dataTooltip}
  {type}
  {style}
  data-sveltekit-prefetch={el === 'a' ? '' : 'off'}
>
  <slot />
</svelte:element>

<style>
  .icon-btn {
    height: 1.75rem;
    width: 1.75rem;
    padding: 0.1rem;
    margin: 0;

    --primary: rgba(0, 0, 0, 0);
    color: var(--muted-color);
    border: 0;
    border-radius: var(--border-radius);

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .icon-btn:focus,
  .icon-btn:hover {
    color: var(--primary-inverse);
  }

  .icon-btn:focus {
    box-shadow: 0 0 0 var(--outline-width) var(--primary-focus);
  }
</style>
