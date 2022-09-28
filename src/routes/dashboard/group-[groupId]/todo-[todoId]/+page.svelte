<script lang="ts">
  import type { Todo, TodoGroup } from '@prisma/client'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'

  import type { RouteParams } from './$types'
  import { todos } from '$lib/store/todos'
  import { useFetchInternal } from '$lib/hooks/useFetchInternal'
  import { showNotification } from '$lib/store/notification'
  import IconButton from '$lib/components/buttons/IconButton.svelte'
  import ArrowLeft from '$lib/components/icons/ArrowLeftIcon.svelte'
  import DeleteButton from '$lib/components/buttons/DeleteButton.svelte'
  import ConfirmPopup, { hideConfirmPopup, showConfirmPopup } from '$lib/components/ConfirmPopup.svelte'
  import ModifyTodoForm from '$lib/components/forms/ModifyTodoForm.svelte'
  import CompleteButton from '$lib/components/buttons/CompleteButton.svelte'

  const { todoId: todoIdParam, groupId: groupIdParam } = $page.params as RouteParams
  const groupId = Number(groupIdParam)
  const todoId = Number(todoIdParam)

  $: todo = $todos[groupId]?.find(({ id }) => todoId === id)

  const { execute: deleteTodo, state: deleteTodoState } = useFetchInternal<[Todo, TodoGroup]>(`/api/todo/${todoId}`)
  $: {
    if ($deleteTodoState.error) {
      showNotification({
        content: $deleteTodoState.error,
        status: 'error',
      })
    }
  }

  const handleDeleteTodo = async () => {
    await deleteTodo({
      method: 'DELETE',
    })

    if ($deleteTodoState.response) {
      goto(`/dashboard/group-${groupId}`)
    }
  }

  const { execute: completeTodo, state: completeTodoState } = useFetchInternal<Todo>(`/api/todo/${todoId}`)
  $: {
    if ($completeTodoState.error) {
      showNotification({
        content: $completeTodoState.error,
        status: 'error',
      })
    }
  }

  let unsavedCompleteState = todo?.done || false
  const handleCompleteTodo = async () => {
    if (todo) {
      await completeTodo({
        method: 'PUT',
        body: JSON.stringify({
          done: !todo.done,
          groupId,
        }),
      })
      if ($completeTodoState.response) {
        todos.update((ts) => {
          return {
            ...ts,
            [groupId]: ts[groupId].reduce<typeof $todos[number]>((acc, _todo) => {
              return _todo.id === todoId
                ? [
                    ...acc,
                    {
                      ..._todo,
                      done: !todo?.done,
                    },
                  ]
                : [...acc, _todo]
            }, []),
          }
        })
        hideConfirmPopup('complete-todo')
      }
    }
  }
</script>

<ConfirmPopup loading={$deleteTodoState.loading} id="delete-todo" on:save={handleDeleteTodo}>
  Are you sure you want to delete this todo?
</ConfirmPopup>

<ConfirmPopup loading={$completeTodoState.loading} id="complete-todo" on:save={handleCompleteTodo} on:cancel={() => {
  unsavedCompleteState = todo?.done || false
}}>
  Are you sure you want to {todo?.done ? 'undo' : ''} complete this todo?
</ConfirmPopup>

<main class="container">
  <article class="card-border">
    {#if !todo}
      <h6 class="todo-not-found">Todo with id {todoId} does not exist</h6>
      <a href="/dashboard/group-{groupId}" class="secondary back-btn btn-small" role="button"
        >Go back to group</a
      >
    {:else}
      <ModifyTodoForm todo={{ groupId, ...todo }} />
      <header>
        <div class="header-left-side">
          <IconButton el="a" href="/dashboard/group-{groupId}" class="icon-back-btn">
            <ArrowLeft />
          </IconButton>
          <h3>{todo.title}</h3>
        </div>

        <CompleteButton on:click={() => {
          showConfirmPopup('complete-todo')
          unsavedCompleteState = !unsavedCompleteState
        }} showDone={unsavedCompleteState} />
      </header>

      <div class="todo-content">
        <p>{todo.content}</p>
      </div>

      <div class="btns">
        <DeleteButton on:click={() => showConfirmPopup('delete-todo')}>Delete todo</DeleteButton>
        <a class="btn-small modify-btn" role="button" href="?showModal=true ">
          <svg style="aspect-ratio: 1" height="60%" viewBox="0 0 24 24" fill="none">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="currentColor"
              d="m14 7 1.793-1.793a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414L17 10m-3-3-9.207 9.207a1 1 0 0 0-.293.707V19.5h2.586a1 1 0 0 0 .707-.293L17 10m-3-3 3 3"
            />
          </svg>
          Modify
        </a>
      </div>
    {/if}
  </article>
</main>

<style>
  main {
    max-width: 700px;
  }

  .todo-not-found {
    width: fit-content;
    margin-inline: auto;
    margin-bottom: 0;
    display: block;
  }

  .back-btn {
    width: fit-content;
    margin-top: 1rem;
    margin-inline: auto;
  }

  header {
    margin: 0;
    margin-bottom: 1.5rem;
    padding: 0;
    border: 0;
    background-color: rgba(0, 0, 0, 0);

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-left-side {
    display: flex;
    align-items: center;
    column-gap: 0.75rem;
  }

  .header-left-side h3 {
    margin-bottom: 0;
  }

  .modify-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .todo-content {
    min-height: 150px;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.25rem;
    overflow-x: auto;
  }

  .btns {
    width: fit-content;
    margin-left: auto;
    display: flex;
    gap: 1.5rem;
  }
</style>
