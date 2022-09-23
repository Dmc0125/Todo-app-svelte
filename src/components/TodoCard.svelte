<script lang="ts">
  import truncate from 'lodash.truncate'

  import DeleteIcon from './DeleteIcon.svelte'
  import {
    addToDeleteBatch,
    removeFromDeleteBatch,
    batchForDelete,
    batchForComplete,
    addToCompleteBatch,
    removeFromCompleteBatch,
  } from '$lib/store/todos'
  import { showConfirmPopup, confirmPopupState } from '$lib/components/ConfirmPopup.svelte'

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
    }
  }

  const handleDeleteBtn = () => {
    switch ($confirmPopupState.show) {
      case deletePopupId: {
        action.delete()
        return
      }
      case null: action.delete()
      default: showConfirmPopup(deletePopupId)
    }
  }

  const handleCompleteBtn = () => {
    switch ($confirmPopupState.show) {
      case completePopupId: {
        action.complete()
        return
      }
      case null: action.complete()
      default: showConfirmPopup(completePopupId)
    }
  }

  $: isSetForDelete = $batchForDelete.has(id)
  $: showDoneLabel = (!done && $batchForComplete.has(id)) || (done && !$batchForComplete.has(id))
</script>

<div class="todo-card">
  <div class="todo-header">
    <h6>{title}</h6>

    <div class="todo-header-bts">
      <button class="done-btn btn" on:click={handleCompleteBtn} data-tooltip="Toggle done">
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke-width="1.5">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="currentColor"
            d="m4.5 12 5 5 10-10"
          />
        </svg>
      </button>

      <button
        class="delete-btn btn outline"
        on:click={handleDeleteBtn}
        data-tooltip="Toggle delete"
      >
        <DeleteIcon height="100%" />
      </button>
    </div>
  </div>
  <p>{truncate(content, { length: 22, separator: /[ ,]/ })}</p>

  <div class="todo-labels">
    {#if isSetForDelete}
      <div class="todo-label todo-label-delete">
        <span>Delete</span>
      </div>
    {/if}
    {#if showDoneLabel}
      <div class="todo-label todo-label-completed">
        <span>Done</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .todo-card {
    padding: .5rem .75rem;

    box-shadow: 0 0 10px 1px rgb(0, 0, 0, 0.05);
    border-radius: 0.25rem;
    border: 1px solid rgba(0, 0, 0, 0);
  }

  :global([data-theme='dark']) .todo-card {
    box-shadow: none !important;
    background-color: var(--bg-card-clr);
  }

  .todo-labels {
    --height: 1.35rem;

    width: 100%;
    min-height: var(--height);
    margin-top: .25rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: .5rem;
  }

  .todo-label {
    width: fit-content;
    height: var(--height);
    padding-inline: .5rem;
    display: grid;
    place-content: center;
    border-radius: .25rem;
  }

  .todo-label span {
    display: block;
    height: 1.25rem;
    font-size: .85rem;
  }

  .todo-label-completed {
    background-color: #85D55D;
    color: var(--primary-inverse);
  }

  .todo-label-delete {
    background-color: var(--error-clr);
    color: var(--primary-inverse);
  }

  p,
  h6 {
    margin-bottom: 0;
  }

  .todo-header {
    width: 100%;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .todo-header-bts {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn {
    width: fit-content;
    height: 1.6rem;
    padding: 0.1rem;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .delete-btn {
    --border-color: var(--error-clr);
    --primary-focus: var(--error-shadow-clr);
    color: var(--error-clr);
  }
</style>
