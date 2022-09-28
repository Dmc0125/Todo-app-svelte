<script lang="ts">
  import { goto } from '$app/navigation'
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'

  import DeleteIcon from './icons/DeleteIcon.svelte'

  const dispatch = createEventDispatcher()
  const handleDeleteBtn = () => {
    dispatch('delete')
  }

  export let todoId: number

  let className = ''
  export { className as class }
  export let show: boolean

  const openPopup = () => {
    goto(`?showModal=changeTodoTitle&todoId=${todoId}`, {
      keepfocus: true,
      replaceState: true,
      noscroll: true,
    })
  }
</script>

{#if show}
  <article
    class="card-border {className}"
    transition:fade={{ duration: 200 }}
    on:click|stopPropagation
  >
    <ul class="todo-menu">
      <li class="todo-menu-item">
        <button class="delete-btn btn-small" on:click={handleDeleteBtn}>
          <DeleteIcon />
          Delete
        </button>
      </li>
      <li>
        <a
          class="btn-small default-btn"
          href="?showModal=changeTodoTitle&todoId={todoId}"
          on:click|preventDefault={openPopup}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="currentColor"
              d="m14 7 1.793-1.793a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414L17 10m-3-3-9.207 9.207a1 1 0 0 0-.293.707V19.5h2.586a1 1 0 0 0 .707-.293L17 10m-3-3 3 3"
            />
          </svg>
          Change title
        </a>
      </li>
    </ul>
  </article>
{/if}

<style>
  article {
    padding: 0.5rem;
    margin: 0;
    position: absolute;
    z-index: 1000;
  }

  .todo-menu {
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
  }

  .todo-menu li {
    list-style: none;
    margin: 0;
  }

  a {
    text-decoration: none;
    display: block;
    border-radius: 0.25rem;
  }

  button,
  a {
    width: 10rem;
    margin: 0;
    padding: 0 0.5rem;

    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;

    background: none;
    color: var(--muted-color);
    border: none;
    font-size: 0.9rem;
  }

  .default-btn:hover {
    background: var(--muted-border-color);
  }

  .delete-btn:hover,
  .delete-btn:focus {
    background-color: var(--error-clr);
    color: var(--primary-inverse);
  }

  .delete-btn:focus {
    --primary-focus: var(--error-shadow-clr);
  }

  :global(.todo-menu li svg) {
    --size: 1.7rem;

    width: var(--size);
    height: var(--size);
  }
</style>
