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
  $: showDone = (!done && $batchForComplete.has(id)) || (done && !$batchForComplete.has(id))

  let animationClassName = ''
  $: {
    if (showDone) {
      animationClassName = 'completed-animation'
      setTimeout(() => {
        animationClassName = ''
      }, 200)
    }
  }
</script>

<div class="todo-card">
  <button
    class="complete-btn {showDone ? 'complete-btn-done' : ''} {animationClassName}"
    on:click={handleCompleteBtn}
    data-tooltip="Toggle done"
  >
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke-width="1.5">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke="currentColor"
        d="m4.5 12 5 5 10-10"
      />
    </svg>
  </button>

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

    <button
      class="delete-btn"
      on:click={handleDeleteBtn}
      data-tooltip="Toggle delete"
    >
      <DeleteIcon height="100%" />
    </button>
  </div>
</div>

<style>
  .todo-card {
    padding: .5rem .75rem;

    box-shadow: 0 0 10px 1px rgb(0, 0, 0, 0.02);
    border-radius: 0.25rem;
    border: 1px solid var(--muted-border-color);

    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: 1rem;
    row-gap: .65rem
  }

  :global([data-theme='dark']) .todo-card {
    box-shadow: none !important;
    background-color: var(--bg-card-clr);
  }

  .label {
    width: fit-content;
    padding-inline: .5rem;
    padding-block: .1rem;
    display: grid;
    place-content: center;
    border-radius: .25rem;
  }

  .label span {
    display: block;
    height: 1.25rem;
    font-size: .85rem;
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

  .complete-btn {
    --primary-focus: var(--success-shadow-clr);
    --size: 2.5rem;

    width: var(--size);
    height: var(--size);
    margin: 0;
    padding: .25rem;
    flex-shrink: 0;

    border-radius: 50%;
    border: 0 solid var(--muted-border-color);
    background-color: var(--muted-border-color);
  }

  .complete-btn-done {
    background-color: var(--success-clr);
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
    font-size: .85rem;
  }

  .delete-btn {
    width: fit-content;
    height: 1.75rem;
    padding: 0.1rem;
    margin: 0;

    --primary: rgba(0, 0, 0, 0);
    --primary-hover: var(--error-clr);
    --primary-focus: var(--error-shadow-clr);
    color: var(--muted-color);
    border: 0;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .delete-btn:focus, .delete-btn:hover {
    color: var(--primary-inverse);
  }

  .completed-animation {
    animation: complete 200ms ease-in;
  }

  @keyframes complete {
    from {
      transform: scale(100%);
    }
    50% {
      transform: scale(105%);
    }
    to {
      transform: scale(100%);
    }
  }
</style>
