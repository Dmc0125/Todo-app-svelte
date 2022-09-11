<script lang="ts">
  let theme: 'light' | 'dark' = 'light'
  const changeTheme = () => {
    const html = document.querySelector('html')
    const currentTheme = html?.getAttribute('data-theme')

    switch (currentTheme) {
      case 'light': {
        html?.setAttribute('data-theme', 'dark')
        break
      }
      case 'dark': {
        html?.setAttribute('data-theme', 'light')
      }
    }
  }
</script>

<slot />

<button class="contrast theme-switch" on:click="{changeTheme}">
  {#if theme === 'light'}
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
      <path stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" d="M12 4.5v2m5.5 5.5h2M12 17.5v2M6.5 12h-2m2.197-5.303L8.11 8.11m7.778 0 1.414-1.414m-1.414 9.192 1.414 1.414M8.111 15.89l-1.414 1.414M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
    </svg>
  {:else}
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
      <path stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" d="M17 12.002c0-4.142-3-7.5-7.5-7.5-1.5 0-2.5.5-2.5.5s5 1.498 5 7-5 7-5 7 1 .5 2.5.5c4.5 0 7.5-3.358 7.5-7.5Z" />
    </svg>
  {/if}
</button>

<style>
  @font-face {
    font-family: 'Inter';
    src: url('/Inter-VariableFont_slnt,wght.ttf');
    font-weight: 100 1000;
  }

  :global(:root) {
    --font-size: 16px;
    --font-family: 'Inter';
  }

  .theme-switch {
    margin: 0;
    padding: .25rem;
    position: fixed;

    --size: 2.5rem;
    bottom: var(--size);
    right: var(--size);

    width: var(--size);
    height: var(--size);

    border-radius: 100%;
    display: grid;
    place-items: center;
  }
</style>