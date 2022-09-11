<header>
  <h1>Todo App</h1>
</header>

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

  main {
    max-width: 20%;
  }

  .discord-login {
    --primary: hsl(235, 86%, 65%);
    --primary-hover: hsl(235, 86%, 68%);

    width: 100%;
  }
</style>
