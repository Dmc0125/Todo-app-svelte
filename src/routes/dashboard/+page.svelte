<script lang="ts">
  import type { PageData } from './$types'
  import { groups } from '$lib/store/groups'
  import CreateGroupForm from '$lib/components/CreateGroupForm.svelte'
  import ModalOverlay from '$lib/components/ModalOverlay.svelte'

  export let data: PageData
  groups.set(data.groups)
</script>

<ModalOverlay>
  <CreateGroupForm />
</ModalOverlay>

<main class="container">
  <article>
    <div class="groups-header">
      <h4>Todo groups</h4>
      <a role="button" href="?showModal=true">Create group</a>
    </div>

    <section class="container-fluid todos">
      {#each $groups as { name, description, id }}
        <a class="todo-card" href="/dashboard/group/{id}">
          <h6>{name}</h6>
          <p>{description}</p>
        </a>
      {/each}
    </section>
  </article>
</main>

<style>
  article {
    padding: 2rem 2rem;
  }

  .groups-header {
    margin-bottom: 2rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .groups-header h4 {
    margin-bottom: 0;
  }

  .groups-header a {
    width: fit-content;
    margin-bottom: 0;
    padding-block: 0.5rem;
  }

  .todos {
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .todo-card {
    height: 5.5rem;
    padding: 1rem;
    display: grid;

    box-shadow: 0 0 10px 1px rgb(238, 238, 238);
    border-radius: 0.25rem;
  }

  :global([data-theme='dark'] .todo-card) {
    box-shadow: none !important;
    background-color: hsl(207, 31%, 14%);
  }

  .todo-card:hover {
    cursor: pointer;
    text-decoration: none;
  }

  .todo-card h6 {
    margin-bottom: 0.25rem;
  }

  .todo-card p {
    width: 100%;
    margin-bottom: 0;
    color: var(--h6-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: no-wrap;
  }
</style>
