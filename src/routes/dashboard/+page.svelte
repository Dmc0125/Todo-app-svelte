<script lang="ts">
  import CreateGroupForm from '$lib/components/CreateGroupForm.svelte'
</script>

<main class="container">
  <article class="groups">
    <h4>
      Todo groups
    </h4>

    <section class="container-fluid todos">
      <div class="todo-card">
        <h6>Home stuff</h6>
        <p>Todo description</p>
      </div>
      <div class="todo-card">
        <h6>Home stuff</h6>
        <p>Todo description</p>
      </div>
      <div class="todo-card">
        <h6>Home stuff</h6>
        <p>Todo description</p>
      </div>
      <div class="todo-card">
        <h6>Home stuff</h6>
        <p>Todo description</p>
      </div>
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
    /* border: 1px solid hsl(0, 0%, 95%); */
    box-shadow: 0 0 10px 1px rgb(238, 238, 238);
    border-radius: 0.25rem;
  }

  :global([data-theme="dark"] .todo-card) {
    box-shadow: none !important;
    background-color: hsl(207, 31%, 14%);
  }

  .todo-card h6 {
    margin-bottom: .25rem;
  }

  .todo-card p {
    margin-bottom: 0;
  }
</style>
