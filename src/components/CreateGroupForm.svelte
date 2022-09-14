<script lang="ts">
  import { writable } from 'svelte/store'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'

  import { groups, type Group } from '$lib/store/groups'
  import { groupSchema } from '$lib/schemas/group'
  import { debounce } from '$lib/utils/debounce'
  import { useFetchInternal } from '$lib/hooks/useFetchInternal'

  type FormData = Record<
    'name' | 'description',
    {
      value: string
      error: null | string
    }
  >

  const formData = writable<FormData>({
    name: {
      value: '',
      error: null,
    },
    description: {
      value: '',
      error: null,
    },
  })

  const parseError = (pick: 'name' | 'description', toParse: unknown) => {
    const result = groupSchema
      .pick({
        [pick]: true,
      })
      .safeParse({
        [pick]: toParse,
      })
    if (result.success) {
      formData.update((fd) => {
        fd[pick].error = null
        return fd
      })
      return
    }

    const err = result.error.errors[0]
    formData.update((fd) => {
      fd[pick].error = err.message.replace(/string/i, `${pick[0].toUpperCase()}${pick.slice(1)}`)
      return fd
    })
  }
  const parseErrorDebounced = debounce(parseError)

  const { execute, state: fetchState } = useFetchInternal<Group>('/api/group')
  const submit = async () => {
    parseError('name', $formData.name.value)
    parseError('description', $formData.description.value)

    if ($formData.name.error || $formData.description.error) {
      return
    }

    // TODO: Notify about error
    await execute({
      method: 'POST',
      body: JSON.stringify({
        name: $formData.name.value,
        description: $formData.description.value,
      }),
    })

    groups.update((g) => {
      if ($fetchState.response !== null) {
        g.push($fetchState.response)
      }
      return g
    })
  }

  const closeModal = () => {
    goto(`${$page.url.origin}${$page.url.pathname}`, {
      keepfocus: true,
      replaceState: true,
      noscroll: true,
    })
  }
</script>

<article>
  <form on:submit|preventDefault={submit}>
    <div class="form-header">
      <h5>Create Todo group</h5>

      <button class="secondary" type="button" on:click="{closeModal}">
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" d="m5.5 5.5 13 13m-13 0 13-13" />
        </svg>
      </button>
    </div>

    <label for="name">
      Name
      <input
        type="text"
        id="name"
        class={$formData.name.error ? 'error' : ''}
        bind:value={$formData.name.value}
        on:input={() => parseErrorDebounced('name', $formData.name.value)}
      />
      {#if $formData.name.error}
        <span class="error-message">{$formData.name.error}</span>
      {/if}
    </label>

    <label for="description">
      <span class="label">
        Description

        <div class="info-icon" data-tooltip="Description is not required">
          <svg style="width: 1.2rem; height: 1.2rem" viewBox="0 0 24 24" fill="none">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="currentColor"
              d="M12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="currentColor"
              d="M11 15.5V12C11 11.7239 11.2239 11.5 11.5 11.5H12.5C12.7761 11.5 13 11.7239 13 12V15.5C13 15.7761 12.7761 16 12.5 16H11.5C11.2239 16 11 15.7761 11 15.5ZM12.9999 9C12.9999 9.55228 12.5522 10 11.9999 10C11.4476 10 10.9999 9.55228 10.9999 9C10.9999 8.44772 11.4476 8 11.9999 8C12.5522 8 12.9999 8.44772 12.9999 9Z"
            />
          </svg>
        </div>
      </span>
      <input
        type="text"
        id="description"
        class={$formData.description.error ? 'error' : ''}
        bind:value={$formData.description.value}
        on:input={() => parseErrorDebounced('description', $formData.description.value)}
      />
      {#if $formData.description.error}
        <span class="error-message">{$formData.description.error}</span>
      {/if}
    </label>

    <button type="submit" aria-busy={$fetchState.loading}> Create</button>
  </form>
</article>

<style>
  form {
    margin-bottom: 0;
  }

  .form-header {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .form-header h5 {
    margin: 0;
  }

  .form-header button {
    height: 1.5rem;
    width: 1.5rem;
    padding: 0;
    display: grid;
    place-items: center;
  }

  label {
    position: relative;
  }

  .label {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .info-icon {
    display: grid;
    place-items: center;
  }

  .error {
    --border-color: var(--error-clr);
    --form-element-active-border-color: var(--error-clr);
    --form-element-focus-color: var(--error-shadow-clr);
  }

  .error-message {
    position: absolute;
    bottom: -0.25rem;
    left: 0;
    width: 100%;

    font-size: 0.8rem;
    color: #fe8d85;
  }

  button {
    margin-bottom: 0;
  }
</style>
