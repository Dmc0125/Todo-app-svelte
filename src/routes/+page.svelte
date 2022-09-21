<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { browser } from '$app/environment'

  import { PUBLIC_BASE_URL } from '$env/static/public'
  import { showNotification } from '$lib/store/notification'

  let showMessage = !!$page.url.searchParams.get('message')?.length
  if (showMessage) {
    showNotification({
      content: 'Unauthorized. You need to be signed in.',
      status: 'error',
      onHide: () => {
        if (browser) {
          goto(PUBLIC_BASE_URL, {
            keepfocus: true,
            replaceState: true,
            noscroll: true,
          })
        }
      },
    })
  }
</script>

<header>
  <h1>Todo App</h1>
</header>

<main class="container">
  <a class="discord-login" role="button" href="/auth/login"> Login with Discord </a>
</main>

<style>
  header {
    display: grid;
    place-items: center;
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
