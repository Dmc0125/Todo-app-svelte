<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'

  import { PUBLIC_BASE_URL } from '$env/static/public';

  let showMessage = !!$page.url.searchParams.get('message')?.length
  onMount(() => {
    if (showMessage) {
      setTimeout(() => {
        showMessage = false
        goto(PUBLIC_BASE_URL, {
          keepfocus: true,
          replaceState: true,
          noscroll: true,
        })
      }, 5000)
    }
  })
</script>

<header>
  <h1>Todo App</h1>
</header>

{#if showMessage}
  <article class="popup">
    Unauthorized. You need to be signed in.
  </article>
{/if}

<main class="container">
  <a class="discord-login" role="button" href="/auth/login">
    Login with Discord
  </a>
</main>

<style>
  header {
    display: grid;
    place-items: center;
  }

  .popup {
    position: absolute;
    left: 50%;
    top: 10%;
    transform: translateX(-50%);
    padding-block: 1rem;

    background-color: #FE8D85;
    color: #FAFAFF;
  }

  main {
    max-width: 200px;
  }

  .discord-login {
    --primary: hsl(235, 86%, 65%);
    --primary-hover: hsl(235, 80%, 62%);

    width: 100%;
  }
</style>
