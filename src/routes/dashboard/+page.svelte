<script lang="ts">
  import type { PageData } from './$types'
  import CreateGroupForm from '$lib/components/CreateGroupForm.svelte'
  import { groups } from '$lib/store/groups'

  export let data: PageData
  groups.set(data.groups)
</script>

<main class="container">
  <article class="groups">
    <h4>Todo groups</h4>

    <section class="container-fluid todos">
      {#each $groups as { name, description }}
        <div class="todo-card">
          <h6>{name}</h6>
          <p>{description}</p>
        </div>
      {/each}
    </section>
  </article>

  <article>
    <CreateGroupForm />
  </article>
</main>

<style>
  main {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 5%;
  }

  article {
    padding: 2rem 2rem;
  }

  .todos {
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .todo-card {
    padding: 1rem;
    box-shadow: 0 0 10px 1px rgb(238, 238, 238);
    border-radius: 0.25rem;
  }

  :global([data-theme='dark'] .todo-card) {
    box-shadow: none !important;
    background-color: hsl(207, 31%, 14%);
  }

  .todo-card:hover {
    cursor: pointer;
  }

  .todo-card h6 {
    margin-bottom: 0.25rem;
  }

  .todo-card p {
    margin-bottom: 0;
  }
</style>
