<script lang="ts">
  import { onDestroy } from 'svelte'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  import type { PageData } from './$types'
  import { groups } from '$lib/store/groups'
  import { useFetchInternal } from '$lib/hooks/useFetchInternal'
  import { todos } from '$lib/store/todos'
  import ModalOverlay from '$lib/layouts/ModalOverlay.svelte'
  import CreateTodoForm from '$lib/components/CreateTodoForm.svelte'
  import EmptyContainerLayout from '$lib/layouts/EmptyContainerLayout.svelte'

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

  const { execute, state: deleteGroupState } = useFetchInternal(`/api/group/${groupId}`)
  const deleteGroup = async () => {
    await execute({ method: 'DELETE' })
  }
  const unsubscribe = deleteGroupState.subscribe((_state) => {
    if (_state.executed && !_state.error) {
      goto('/dashboard')
    }
  })
  onDestroy(unsubscribe)
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
      <a role="button" href="/dashbard" class="secondary">
        Go back to dashboard
      </a>
    {:else}
      <div class="todo-header">
        <nav class="todo-header-nav">
          <a href="/dashboard" class="todo-header-back-btn" data-sveltekit-prefetch>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" d="M19.5 12L4.5 12M4.5 12L11 18.5M4.5 12L11 5.5" />
            </svg>
          </a>

          <h3>
            {group.name}
          </h3>
        </nav>

        <div class="todo-header-buttons">
          <button
            class="delete-btn btn-small"
            on:click={deleteGroup}
            aria-busy={$deleteGroupState.loading}
          >
            {#if !$deleteGroupState.loading}
              <svg
                height="60%"
                viewBox="0 0 24 24"
                fill="none"
                style="aspect-ratio: 1"
                stroke-width="1.2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke="currentColor"
                  d="M10.5 11.5V15.5M4.5 8.5H6.5H4.5ZM19.5 8.5H17.5H19.5ZM17.5 8.5V18.5C17.5 19.0523 17.0523 19.5 16.5 19.5H7.5C6.94771 19.5 6.5 19.0523 6.5 18.5V8.5H17.5ZM17.5 8.5H16H17.5ZM6.5 8.5H8H6.5ZM8 8.5V6.5C8 5.94772 8.44772 5.5 9 5.5H15C15.5523 5.5 16 5.94772 16 6.5V8.5H8ZM8 8.5H16H8ZM13.5 11.5V15.5V11.5Z"
                />
              </svg>
            {/if}
            <span>Delete group</span>
          </button>

          <a role="button" class="primary btn-small" href="?showModal=true"> Create todo </a>
        </div>
      </div>

      {#if !Object.values($todos).length}
        <EmptyContainerLayout>
          All todos created in this group will be shown here.
        </EmptyContainerLayout>
      {:else}
        <section class="container-fluid todos-container">
          {#each $todos[groupId] as {title, content, done}}
            <div class="todo-card">
              <h6>{title}</h6>
              <p>{content}</p>
            </div>
          {/each}
        </section>
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

  .todo-card {
    padding: 1rem;

    box-shadow: 0 0 10px 1px rgb(0, 0, 0, 0.05);
    border-radius: 0.25rem;
  }

  :global([data-theme='dark'] .todo-card) {
    box-shadow: none !important;
    background-color: var(--bg-card-clr);
  }

  .todo-card p, .todo-card h6 {
    margin-bottom: 0;
  }
</style>
