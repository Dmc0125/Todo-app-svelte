<script lang="ts" context="module">
  import { get, writable } from 'svelte/store'

  type PopupState = {
    show: string | null
    error: boolean
  }

  export const confirmPopupState = writable<PopupState>({
    show: null,
    error: false,
  })

  export const showConfirmPopup = (id: string) => {
    const ps = get(confirmPopupState)
    if (ps.error) {
      return false
    }
    if (ps.show) {
      confirmPopupState.update((ps) => {
        ps.error = true
        return ps
      })
      setTimeout(() => {
        confirmPopupState.update((ps) => {
          ps.error = false
          return ps
        })
      }, 200)
      return false
    }

    confirmPopupState.set({
      show: id,
      error: false,
    })
    return true
  }

  export const hideConfirmPopup = (id: string) => {
    const ps = get(confirmPopupState)
    if (ps.show === id) {
      confirmPopupState.set({
        show: null,
        error: false,
      })
    }
  }
</script>

<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte'
  import { fly } from 'svelte/transition'
  import { page } from '$app/stores'
  import { beforeNavigate } from '$app/navigation'

  export let loading = false
  export let id: string

  let animationDuration = 200
  const { pathname } = $page.url
  beforeNavigate((nav) => {
    if (nav.to?.url.pathname !== pathname) {
      animationDuration = 0
      confirmPopupState.set({
        show: null,
        error: false,
      })
    }
  })

  const dispatch = createEventDispatcher()
  const dispatchCancel = () => {
    confirmPopupState.set({
      show: null,
      error: false,
    })
    dispatch('cancel')
  }
  const dispatchSave = () => {
    dispatch('save')
  }
</script>

{#if $confirmPopupState.show === id}
  <article
    in:fly={{ duration: 200, y: 20, opacity: 0 }}
    out:fly={{ duration: animationDuration, y: 20, opacity: 0 }}
    class={$confirmPopupState.error ? 'shake-animation' : ''}
  >
    <p>
      <slot />
    </p>
    <button class="secondary" on:click={dispatchCancel} disabled={loading}>Cancel</button>
    <button class="save-btn primary" on:click={dispatchSave} aria-busy={loading} disabled={loading}>
      {#if !loading}
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

  .shake-animation {
    animation: 200ms ease-in shake;
  }

  @keyframes shake {
    0% {
      transform: translateX(calc(-5px -50%));
    }
    25% {
      transform: translateX(calc(5px - 50%));
    }
    50% {
      transform: translateX(calc(-5px - 50%));
    }
    75% {
      transform: translateX(calc(5px - 50%));
    }
    100% {
      transform: translateX(calc(-5px - 50%));
    }
  }
</style>
