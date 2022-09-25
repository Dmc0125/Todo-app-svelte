<script lang="ts">
  import type { Todo, TodoGroup } from '@prisma/client'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  
  import type { RouteParams } from './$types'
  import { todos } from '$lib/store/todos'
  import { useFetchInternal } from '$lib/hooks/useFetchInternal'
  import { showNotification } from '$lib/store/notification'
  import IconButton from '$lib/components/IconButton.svelte'
  import ArrowLeft from '$lib/components/icons/ArrowLeftIcon.svelte'
  import DeleteButton from '$lib/components/buttons/DeleteButton.svelte'
  import ConfirmPopup, { showConfirmPopup } from '$lib/components/ConfirmPopup.svelte'

  const { todoId: todoIdParam, groupId: groupIdParam } = $page.params as RouteParams
  const groupId = Number(groupIdParam)
  const todoId = Number(todoIdParam)

  const todo = $todos[groupId]?.find(({ id }) => todoId === id)

  const { execute, state: fetchState } = useFetchInternal<[Todo, TodoGroup]>(`/api/todo/${todoId}`)
  $: {
    if ($fetchState.error) {
      showNotification({
        content: $fetchState.error,
        status: 'error',
      })
    }
  }

  const handleDeleteTodo = async () => {
    await execute({
      method: 'DELETE',
    })

    if ($fetchState.response) {
      goto(`/dashboard/group-${groupId}`)
    }
  }

  let todoTitle = todo?.title
</script>

<ConfirmPopup loading={$fetchState.loading} id="delete-todo" on:save={handleDeleteTodo}>
  Are you sure you want to delete this todo?
</ConfirmPopup>

<main class="container">
  <article class="card-border">
    {#if !todo}
      <h6 class="todo-not-found">Todo with id {todoId} does not exist</h6>
      <a href="/dashboard/group-{groupId}" class="secondary back-btn btn-small" role="button">Go back to group</a>
    {:else}
      <header>
        <IconButton
          el="a"
          href="/dashboard/group-{groupId}"
          class="icon-back-btn"
        >
          <ArrowLeft />
        </IconButton>
        <input type="text" bind:value={todoTitle} class="todo-title">
      </header>

      <textarea>{todo.content}</textarea>

      <div class="btns">
        <DeleteButton on:click={() => showConfirmPopup('delete-todo')}>
          Delete todo
        </DeleteButton>
        <button class="btn-small">
          Save
        </button>
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
    column-gap: .75rem;
  }

  .todo-title {
    --color: var(--h3-color);
    --font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 0;
  }

  :global(.icon-back-btn:hover, .icon-back-btn:focus) {
    background-color: var(--primary-hover)
  }

  textarea {
    height: 250px;
    resize: none;
  }

  .btns {
    width: fit-content;
    margin-left: auto;
    display: flex;
    gap: 1.5rem;
  }
</style>
