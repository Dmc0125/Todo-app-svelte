<script lang="ts">
  import truncate from 'lodash.truncate'
  import { page } from '$app/stores'

  import {
    addToDeleteBatch,
    removeFromDeleteBatch,
    batchForDelete,
    batchForComplete,
    addToCompleteBatch,
    removeFromCompleteBatch,
  } from '$lib/store/todos'
  import { showConfirmPopup, confirmPopupState } from '$lib/components/ConfirmPopup.svelte'
  import IconButton from './buttons/IconButton.svelte'
  import CompleteButton from './buttons/CompleteButton.svelte'
  import TodoMenu from './TodoMenu.svelte'

  export let id: number
  export let title: string
  export let content: string
  export let done: boolean

  export let deletePopupId: string
  export let completePopupId: string

  const action = {
    delete: () => {
      if ($batchForDelete.has(id)) {
        removeFromDeleteBatch(id)
      } else {
        addToDeleteBatch(id)
      }
    },
    complete: () => {
      if ($batchForComplete.get(id)) {
        removeFromCompleteBatch(id)
      } else {
        addToCompleteBatch(id, !done)
      }
    },
  }

  const handleDeleteBtn = () => {
    switch ($confirmPopupState.show) {
      case deletePopupId: {
        action.delete()
        return
      }
      case null:
        action.delete()
      default:
        showConfirmPopup(deletePopupId)
    }
  }

  const handleCompleteBtn = () => {
    switch ($confirmPopupState.show) {
      case completePopupId: {
        action.complete()
        return
      }
      case null:
        action.complete()
      default:
        showConfirmPopup(completePopupId)
    }
  }

  $: isSetForDelete = $batchForDelete.has(id)
  $: showDone = (!done && $batchForComplete.has(id)) || (done && !$batchForComplete.has(id))

  let showMenu = false
</script>

<div class="todo-card card-border">
  <CompleteButton on:click={handleCompleteBtn} {showDone} />

  <div class="todo-text-content">
    <h6>{truncate(title, { length: 22, separator: /[ ,]/ })}</h6>
    <p>{truncate(content, { length: 22, separator: /[ ,]/ })}</p>
  </div>

  <div class="todo-card-footer">
    <div class="labels">
      {#if isSetForDelete}
        <div class="label label-delete">
          <span>Delete</span>
        </div>
      {:else}
        <span>No labels</span>
      {/if}
    </div>

    <div class="buttons">
      <IconButton el="a" href="{$page.url.pathname}/todo-{id}" class="maximize-btn">
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="currentColor"
            d="M4.5 4.5H8M4.5 4.5V8M4.5 4.5L9 9M19.5 8V4.5M19.5 4.5H16M19.5 4.5L15 9M4.5 16V19.5M4.5 19.5H8M4.5 19.5L9 15M19.5 19.5V16M19.5 19.5H16M19.5 19.5L15 15"
          />
        </svg>
      </IconButton>
      <IconButton class="todo-menu-popup-btn" on:click={() => (showMenu = !showMenu)}>
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="currentColor"
            d="M7 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM13 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM17 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0Z"
          />
        </svg>
        <TodoMenu todoId={id} class="todo-menu-popup" show={showMenu} on:delete={handleDeleteBtn} />
      </IconButton>
    </div>
  </div>
</div>

<style>
  .todo-card {
    padding: 0.5rem 0.75rem;
    border-radius: 0.25rem;

    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: 1rem;
    row-gap: 0.65rem;
  }

  :global([data-theme='dark']) .todo-card {
    box-shadow: none !important;
    background-color: var(--bg-card-clr);
  }

  .label {
    width: fit-content;
    padding-inline: 0.5rem;
    padding-block: 0.1rem;
    display: grid;
    place-content: center;
    border-radius: 0.25rem;
  }

  .label span {
    display: block;
    height: 1.25rem;
    font-size: 0.85rem;
  }

  .label-delete {
    background-color: var(--error-clr);
    color: var(--primary-inverse);
  }

  .todo-text-content {
    width: 100%;
  }

  p,
  h6 {
    margin-bottom: 0;
  }

  .todo-card-footer {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
  }

  .labels {
    width: 100%;
  }

  .labels span {
    font-size: 0.85rem;
  }

  .buttons {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  :global(.maximize-btn:hover, .maximize-btn:focus) {
    background-color: var(--primary-hover);
  }

  :global(.todo-menu-popup-btn) {
    position: relative;
  }

  :global(.todo-menu-popup) {
    left: -0.5rem;
    transform: translateX(-100%);
  }
</style>
