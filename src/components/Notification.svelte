<script lang="ts">
  import { fly } from 'svelte/transition'

  import { notifications } from '$lib/store/notification'
</script>

{#each [...$notifications] as [_, { content, status }], index}
  <article
    class="notification {status}"
    style="top: calc(8% + {5.2 * index}rem)"
    transition:fly="{{ opacity: 0, x: 200 }}"
  >
    <div class="icon">
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
        <path stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" d="M12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5Z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" d="M11 15.5V12C11 11.7239 11.2239 11.5 11.5 11.5H12.5C12.7761 11.5 13 11.7239 13 12V15.5C13 15.7761 12.7761 16 12.5 16H11.5C11.2239 16 11 15.7761 11 15.5ZM12.9999 9C12.9999 9.55228 12.5522 10 11.9999 10C11.4476 10 10.9999 9.55228 10.9999 9C10.9999 8.44772 11.4476 8 11.9999 8C12.5522 8 12.9999 8.44772 12.9999 9Z" />
      </svg>
    </div>

    <p>
      {content}
    </p>
  </article>
{/each}

<style>
  .notification {
    position: absolute;
    right: 4rem;
    max-width: 22rem;
    width: 100%;
    min-height: 4.5rem;
    padding: 0;
    padding-right: 1rem;
    margin: 0;

    display: flex;
    align-items: center;

    transition: all .5s ease-in-out;
  }

  .error {
    --card-background-color: var(--error-clr);
    --color: var(--error-text-clr);
  }

  .icon {
    width: 3rem;
    height: 3rem;
    margin-left: 1rem;
    color: var(--error-text-clr);
  }

  p {
    margin: 0;
    margin-left: 1rem;
  }
</style>
