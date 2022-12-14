<script lang="ts">
  import truncate from 'lodash.truncate'

  import type { PageData } from './$types'
  import { groups } from '$lib/store/groups'
  import CreateGroupForm from '$lib/components/forms/CreateGroupForm.svelte'
  import EmptyContainerLayout from '$lib/layouts/EmptyContainerLayout.svelte'

  export let data: PageData
  groups.set(data.groups)
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<CreateGroupForm />

<main class="container">
  <article class="card-border">
    <div class="groups-header">
      <h4>Todo groups</h4>

      <a role="button" href="?showModal=true" class="btn-small">Create group</a>
    </div>

    {#if $groups.length}
      <section class="container-fluid groups">
        {#each $groups as { name, description, id }}
          <a class="group-card card-border" href="/dashboard/group-{id}" data-sveltekit-prefetch>
            <h6>{name}</h6>
            <p>{truncate(description, { length: 22, separator: /[ ,]/ })}</p>
          </a>
        {/each}
      </section>
    {:else}
      <EmptyContainerLayout>All groups created by you will be shown here.</EmptyContainerLayout>
    {/if}
  </article>
</main>

<style>
  .groups-header {
    margin-bottom: 2rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .groups-header h4 {
    margin-bottom: 0;
  }

  .groups {
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .group-card {
    --text-decoration: none;

    height: 5.5rem;
    padding: 1rem;
    display: grid;

    border-radius: 0.25rem;
  }

  :global([data-theme='dark'] .group-card) {
    box-shadow: none !important;
    background-color: var(--bg-card-clr);
  }

  .group-card:hover {
    cursor: pointer;
    text-decoration: none;
  }

  .group-card h6 {
    margin-bottom: 0.25rem;
  }

  .group-card p {
    width: 100%;
    margin-bottom: 0;
    color: var(--h6-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: no-wrap;
  }
</style>
