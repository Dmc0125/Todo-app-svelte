<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData
</script>

<header>
  <h2>Todo App</h2>

  <nav>
    <div class="container-fluid user-data">
      <h6>{data.user.username}</h6>

      <img
        src="https://cdn.discordapp.com/avatars/{data.user.discord_id}/{data.user.avatar}.png"
        alt="{data.user.username} avatar"
      />
    </div>

    <a href="/auth/logout" role="button" class="outline secondary"> Logout </a>
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

  h2 {
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
    margin-right: 0.8rem;
    margin-left: 1.2rem;

    border-radius: 100%;
    border: 1px solid var(--h6-color);
  }

  :global(.icon-back-btn:hover, .icon-back-btn:focus) {
    background-color: var(--primary-hover);
  }
</style>
