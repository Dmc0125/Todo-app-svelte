<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  const submit = (e: Event & { currentTarget: EventTarget & HTMLFormElement }) => {
    dispatch('submit', e)
  }

  export let loading = false
  let className = ''
  export { className as class }
</script>

<form on:submit|preventDefault={submit} class="{className}">
  <div class="form-header">
    <h5>
      <slot name="heading" />
    </h5>

    <slot name="header" />
  </div>

  <slot />

  <button type="submit" aria-busy={loading}>
    <slot name="submit-btn" />
  </button>
</form>

<style>
  form {
    margin-bottom: 0;
  }

  .form-header {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .form-header h5 {
    margin: 0;
  }

  button {
    margin-top: 1rem;
    margin-bottom: 0;
  }
</style>
