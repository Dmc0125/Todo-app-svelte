<script lang="ts">
  export let showDone: boolean

  let animationClassName = ''
  $: {
    if (showDone) {
      animationClassName = 'completed-animation'
      setTimeout(() => {
        animationClassName = ''
      }, 200)
    }
  }
</script>

<button
  on:click
  class="complete-btn {showDone ? 'complete-btn-done' : ''} {animationClassName}"
  data-tooltip="Toggle done"
>
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke-width="1.5">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke="currentColor"
      d="m4.5 12 5 5 10-10"
    />
  </svg>
</button>

<style>
  .complete-btn {
    --primary-focus: var(--success-shadow-clr);
    --size: 2.5rem;

    width: var(--size);
    height: var(--size);
    margin: 0;
    padding: 0.25rem;
    flex-shrink: 0;

    border-radius: 50%;
    border: 0 solid var(--muted-border-color);
    background-color: var(--muted-border-color);
  }

  .complete-btn-done {
    background-color: var(--success-clr);
  }

  .completed-animation {
    animation: complete 200ms ease-in;
  }

  @keyframes complete {
    from {
      transform: scale(100%);
    }
    50% {
      transform: scale(105%);
    }
    to {
      transform: scale(100%);
    }
  }
</style>
