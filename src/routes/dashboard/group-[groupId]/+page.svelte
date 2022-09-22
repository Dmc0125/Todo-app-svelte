<script lang="ts">
  import type { Todo } from '@prisma/client'
  import { onDestroy } from 'svelte'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  import type { PageData } from './$types'
  import { groups } from '$lib/store/groups'
  import { useFetchInternal } from '$lib/hooks/useFetchInternal'
  import { todos } from '$lib/store/todos'
  import { serverErrorMessage, showNotification } from '$lib/store/notification'
  import { deleteStashedBatch } from '$lib/store/todos'
  import ModalOverlay from '$lib/layouts/ModalOverlay.svelte'
  import CreateTodoForm from '$lib/components/CreateTodoForm.svelte'
  import EmptyContainerLayout from '$lib/layouts/EmptyContainerLayout.svelte'
  import TodoCard from '$lib/components/TodoCard.svelte'
  import DeleteIcon from '$lib/components/DeleteIcon.svelte'
  import ConfirmPopup, {
    showConfirmPopup,
    hideConfirmPopup,
  } from '$lib/components/ConfirmPopup.svelte'

  export let data: PageData

  if ('groups' in data) {
    groups.set(data.groups)
  }

  let groupId = Number($page.params.groupId)
  let group = $groups.find(({ id }) => id === groupId)

  todos.update((t) => {
    t[groupId] = data.todos
    return t
  })

  enum PopupIds {
    Group = '0',
    Todos = '1',
  }

  // --------- DELETE GROUP ---------
  const { execute, state: deleteGroupState } = useFetchInternal(`/api/group/${groupId}`)
  const deleteGroup = async () => {
    await execute({ method: 'DELETE' })
    if ($deleteGroupState.error) {
      showNotification({
        content: serverErrorMessage,
        status: 'error',
      })
    }
  }
  const unsubscribe = deleteGroupState.subscribe((_state) => {
    if (_state.executed && !_state.error) {
      hideConfirmPopup(PopupIds.Group)
      showNotification({
        content: `Group ${group?.name} was successfully deleted.`,
        status: 'success',
      })
      goto('/dashboard')
    }
  })
  onDestroy(unsubscribe)

  // --------- DELETE TOODS ---------
  onDestroy(() => {
    deleteStashedBatch.set(null)
  })
  const { execute: executeBatchAction, state: deleteTodosBatchState } =
    useFetchInternal<Todo[]>('/api/todo')
  const showBatchActionError = () => {
    if ($deleteTodosBatchState.error) {
      console.log('SHOW ERROR', $deleteTodosBatchState.error)
      showNotification({
        status: 'error',
        content:
          typeof $deleteTodosBatchState.error === 'string'
            ? $deleteTodosBatchState.error
            : $deleteTodosBatchState.error.join('. '),
      })
    }
  }
  const deleteStashed = async () => {
    await executeBatchAction({
      method: 'DELETE',
      body: JSON.stringify({
        todoIds: [...$deleteStashedBatch!],
      }),
    })
    showBatchActionError()
    if ($deleteTodosBatchState.response) {
      todos.update((todosState) => {
        if (!$deleteTodosBatchState.response) {
          return todosState
        }

        const deletedIds = $deleteTodosBatchState.response.map(({ id }) => id)
        const remaining = todosState[groupId].filter(({ id: todoId }) => {
          return !deletedIds.includes(todoId)
        })
        todosState[groupId] = remaining
        return todosState
      })
      deleteStashedBatch.set(null)
    }
  }

  $: {
    if (!$deleteStashedBatch) {
      hideConfirmPopup(PopupIds.Todos)
    }
  }
</script>

<ModalOverlay>
  <CreateTodoForm {groupId} />
</ModalOverlay>

<main class="container">
  <article>
    {#if !group}
      <h6 class="not-found-heading">
        Group with id {groupId} does not exist.
      </h6>
      <a role="button" href="/dashboard" class="secondary back-btn"> Go back to dashboard </a>
    {:else}
      <div class="todo-header">
        <nav class="todo-header-nav">
          <a href="/dashboard" class="todo-header-back-btn" data-sveltekit-prefetch>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke-width="1.5">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke="currentColor"
                d="M19.5 12L4.5 12M4.5 12L11 18.5M4.5 12L11 5.5"
              />
            </svg>
          </a>

          <h3>
            {group.name}
          </h3>
        </nav>

        <div class="todo-header-buttons">
          <button
            class="delete-btn btn-small"
            on:click={() => showConfirmPopup(PopupIds.Group)}
            type="button"
          >
            <DeleteIcon height="60%" />
            <span>Delete group</span>
          </button>
          <ConfirmPopup
            loading={$deleteGroupState.loading}
            on:save={deleteGroup}
            id={PopupIds.Group}
          >
            Are you sure you want to delete this group?
          </ConfirmPopup>

          <a role="button" class="primary btn-small" href="?showModal=true"> Create todo </a>
        </div>
      </div>

      {#if !Object.values($todos).length}
        <EmptyContainerLayout>
          All todos created in this group will be shown here.
        </EmptyContainerLayout>
      {:else}
        <section class="container-fluid todos-container">
          {#each $todos[groupId] as { title, content, done, id }}
            <TodoCard {title} {content} {done} {id} popupId={PopupIds.Todos} />
          {/each}
        </section>
        <ConfirmPopup
          loading={$deleteTodosBatchState.loading}
          on:save={deleteStashed}
          on:cancel={() => deleteStashedBatch.set(null)}
          id={PopupIds.Todos}
        >
          Are you sure you want to delete selected todos?
        </ConfirmPopup>
      {/if}
    {/if}
  </article>
</main>

<style>
  article {
    padding: 2rem;
  }

  .not-found-heading {
    width: fit-content;
    margin-inline: auto;
    margin-bottom: 0;
    display: block;
  }

  .back-btn {
    width: fit-content;
    margin-top: 1rem;
    margin-inline: auto;
    display: block;
  }

  .todo-header {
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .todo-header-nav {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .todo-header-nav h3 {
    margin-bottom: 0;
  }

  .todo-header-back-btn {
    --size: 2rem;
    width: var(--size);
    height: var(--size);
    padding: 0;
    margin: 0;
  }

  .todo-header-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .delete-btn {
    --border-color: none;
    --primary-focus: var(--error-shadow-clr);
    width: fit-content;
    background-color: var(--error-clr);
    gap: 0.25rem;
  }

  .delete-btn:hover {
    background-color: var(--error-hover-clr);
  }

  .todos-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
</style>
