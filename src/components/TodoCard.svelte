<script lang="ts">
  import DeleteIcon from './DeleteIcon.svelte'
  import { addToDeleteBatch, removeFromDeleteBatch, deleteStashedBatch } from '$lib/store/todos'
  import { showConfirmPopup, confirmPopupState } from '$lib/components/ConfirmPopup.svelte'

  export let id: number
  export let title: string
  export let content: string
  export let done: boolean

  export let popupId: string

  const handleDeleteBtn = () => {
    if (!$confirmPopupState.show && !$deleteStashedBatch) {
      showConfirmPopup(popupId)
    } else if ($confirmPopupState.show && !$deleteStashedBatch) {
      showConfirmPopup(popupId)
      return
    }

    if ($deleteStashedBatch?.has(id)) {
      removeFromDeleteBatch(id)
    } else {
      addToDeleteBatch(id)
    }
  }
</script>

<div class="todo-card {$deleteStashedBatch?.has(id) ? 'stashed-delete' : ''}">
  <div class="todo-header">
    <h6>{title}</h6>

    <div class="todo-header-bts">
      <button class="done-btn btn" data-tooltip="Toggle done">
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
  <p>{content}</p>
</div>

<style>
  .todo-card {
    padding: 1rem;

    box-shadow: 0 0 10px 1px rgb(0, 0, 0, 0.05);
    border-radius: 0.25rem;
    border: 1px solid rgba(0, 0, 0, 0);
  }

  :global([data-theme='dark']) .todo-card {
    box-shadow: none !important;
    background-color: var(--bg-card-clr);
  }

  .selected-batch-complete {
    border: 1px solid hsl(138, 51%, 56%);
  }

  .stashed-delete {
    border: 1px solid var(--error-clr);
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

  .done-btn {
    /* --primary: hsl(138, 51%, 56%);
    --primary-hover: hsl(138, 51%, 62%); */
  }

  .delete-btn {
    --border-color: var(--error-clr);
    --primary-focus: var(--error-shadow-clr);
    color: var(--error-clr);
  }
</style>
