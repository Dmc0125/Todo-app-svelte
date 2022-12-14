<script lang="ts">
  import type { Todo } from '@prisma/client'
  import { onDestroy } from 'svelte'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  import type { PageData } from './$types'
  import { groups } from '$lib/store/groups'
  import { useFetchInternal } from '$lib/hooks/useFetchInternal'
  import { batchForComplete, todos } from '$lib/store/todos'
  import { serverErrorMessage, showNotification } from '$lib/store/notification'
  import { batchForDelete } from '$lib/store/todos'
  import CreateTodoForm from '$lib/components/forms/CreateTodoForm.svelte'
  import EmptyContainerLayout from '$lib/layouts/EmptyContainerLayout.svelte'
  import TodoCard from '$lib/components/TodoCard.svelte'
  import ConfirmPopup, {
    showConfirmPopup,
    hideConfirmPopup,
  } from '$lib/components/ConfirmPopup.svelte'
  import DeleteButton from '$lib/components/buttons/DeleteButton.svelte'
  import IconButton from '$lib/components/buttons/IconButton.svelte'
  import ArrowLeftIcon from '$lib/components/icons/ArrowLeftIcon.svelte'
  import ChangeTodoTitleForm from '$lib/components/forms/ChangeTodoTitleForm.svelte'

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
    TodosDelete = '1',
    TodosComplete = '2',
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

  const { execute: executeBatchAction, state: todosBatchActionState } =
    useFetchInternal<Todo[]>('/api/todo')

  $: {
    if ($todosBatchActionState.error) {
      showNotification({
        status: 'error',
        content: $todosBatchActionState.error,
      })
    }
  }

  // --------- DELETE TOODS ---------
  onDestroy(() => {
    batchForDelete.set(new Set())
  })
  const executeBatchDelete = async () => {
    await executeBatchAction({
      method: 'DELETE',
      body: JSON.stringify({
        todoIds: [...$batchForDelete!],
      }),
    })
    if ($todosBatchActionState.response) {
      todos.update((todosState) => {
        if (!$todosBatchActionState.response) {
          return todosState
        }

        const deletedIds = $todosBatchActionState.response.map(({ id }) => id)
        const remaining = todosState[groupId].filter(({ id: todoId }) => {
          return !deletedIds.includes(todoId)
        })
        todosState[groupId] = remaining
        return todosState
      })
      batchForDelete.set(new Set())
    }
  }

  $: {
    if (!$batchForDelete.size) {
      hideConfirmPopup(PopupIds.TodosDelete)
    }
  }

  // --------- COMPLETE TOODS ---------
  onDestroy(() => {
    batchForComplete.set(new Map())
  })
  const executeBatchComplete = async () => {
    const body: Record<number, { done: boolean }> = {}
    $batchForComplete.forEach((val, key) => {
      body[key] = val
    })

    await executeBatchAction({
      method: 'PUT',
      body: JSON.stringify(body),
    })

    const res = $todosBatchActionState.response
    if (res) {
      todos.update((todosState) => {
        const newTodosState = todosState[groupId].reduce((acc, todo) => {
          const changed = res.find(({ id }) => todo.id === id)
          if (changed) {
            return [
              ...acc,
              {
                ...todo,
                done: changed.done,
              },
            ]
          }
          return [...acc, todo]
        }, [] as Omit<Todo, 'groupId'>[])
        return {
          ...todosState,
          [groupId]: newTodosState,
        }
      })
      batchForComplete.set(new Map())
    }
  }
  $: {
    if (!$batchForComplete.size) {
      hideConfirmPopup(PopupIds.TodosComplete)
    }
  }
</script>

<svelte:head>
  <title>{group?.name || ''} &bull; Todos</title>
</svelte:head>

<CreateTodoForm {groupId} />
<ChangeTodoTitleForm {groupId} />

<main class="container">
  <article class="card-border">
    {#if !group}
      <h6 class="not-found-heading">
        Group with id {groupId} does not exist.
      </h6>
      <a role="button" href="/dashboard" class="secondary back-btn"> Go back to dashboard </a>
    {:else}
      <div class="todo-header">
        <nav class="todo-header-nav">
          <IconButton href="/dashboard" el="a" class="icon-back-btn">
            <ArrowLeftIcon />
          </IconButton>

          <h3>
            {group.name}
          </h3>
        </nav>

        <div class="todo-header-buttons">
          <DeleteButton on:click={() => showConfirmPopup(PopupIds.Group)}>
            Delete group
          </DeleteButton>
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
            <TodoCard
              {title}
              {content}
              {done}
              {id}
              deletePopupId={PopupIds.TodosDelete}
              completePopupId={PopupIds.TodosComplete}
            />
          {/each}
        </section>
        <ConfirmPopup
          loading={$todosBatchActionState.loading}
          on:save={executeBatchDelete}
          on:cancel={() => batchForDelete.set(new Set())}
          id={PopupIds.TodosDelete}
        >
          Are you sure you want to delete selected todos?
        </ConfirmPopup>
        <ConfirmPopup
          loading={$todosBatchActionState.loading}
          on:save={executeBatchComplete}
          on:cancel={() => batchForComplete.set(new Map())}
          id={PopupIds.TodosComplete}
        >
          Are you sure you want to complete selected todos?
        </ConfirmPopup>
      {/if}
    {/if}
  </article>
</main>

<style>
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

  .todo-header-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .todos-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
</style>
