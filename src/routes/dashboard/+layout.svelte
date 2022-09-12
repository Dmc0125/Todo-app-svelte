<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData
</script>

<header>
  <h1>Todo App</h1>

  <nav>
    <div class="container-fluid user-data">
      <h6>{data.user.username}</h6>

      <img
        src="https://cdn.discordapp.com/avatars/{data.user.discord_id}/{data.user.avatar}.png"
        alt="{data.user.username} avatar"
      >
    </div>

    <a href="/auth/logout" role="button" class="outline secondary">
      Logout
    </a>
  </nav>
</header>

<slot />

<style>
  header {
    --block-spacing-vertical: 1rem;
    padding-inline: 5%;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    margin-bottom: 0;
  }

  nav {
    display: flex;
    align-items: center;
  }

  .user-data {
    display: flex;
    align-items: center;
  }

  .user-data h6 {
    margin-bottom: 0;
  }

  .user-data img {
    --size: 2.5rem;
    width: var(--size);
    height: var(--size);
    margin-right: .8rem;
    margin-left: 1.2rem;

    border-radius: 100%;
    border: 2px solid var(--h6-color);
  }
</style>