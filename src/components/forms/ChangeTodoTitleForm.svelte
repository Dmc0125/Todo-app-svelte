<script lang="ts">
  import { page } from '$app/stores'
  import { onDestroy } from 'svelte'
  import type { Todo } from '@prisma/client'
  import { get } from 'svelte/store'

  import FormLabelLayout from '$lib/layouts/FormLabelLayout.svelte'
  import FormLayout from '$lib/layouts/FormLayout.svelte'
  import ModalOverlay, { closeModal } from '$lib/layouts/ModalOverlay.svelte'
  import CloseFormModalButton from '../buttons/CloseFormModalButton.svelte'
  import { todos } from '$lib/store/todos'
  import { useFetchInternal } from '$lib/hooks/useFetchInternal'
  import { useForm } from '$lib/hooks/useForm'
  import { titleSchema } from '$lib/schemas/todo'
  import { showNotification } from '$lib/store/notification'

  export let groupId: number

  const { state, parseError, parseErrorDebounced } = useForm({
    title: {
      value: '',
      errorParser: (v) => {
        const result = titleSchema.safeParse(v)
        return result.success ? null : result.error
      },
    },
  })

  let todo: Omit<Todo, 'groupId'> | null = null
  let fetchInternal: ReturnType<typeof useFetchInternal<Todo>> | null = null

  const unsub = page.subscribe(({ url }) => {
    todo = $todos[groupId]?.find(({ id }) => Number(url.searchParams.get('todoId')) === id) || null
    if (todo) {
      $state.title = {
        error: null,
        value: todo.title,
      }
      fetchInternal = useFetchInternal<Todo>(`/api/todo/${todo.id}`)
    }
  })
  onDestroy(unsub)

  let loading = false
  const handleSubmit = async () => {
    parseError('title', $state.title.value)

    if ($state.title.error) {
      return
    }
    const fetchStateUnsubscribe = fetchInternal!.state.subscribe(({ loading: _loading }) => {
      loading = _loading
    })
    await fetchInternal!.execute({
      method: 'PUT',
      body: JSON.stringify({
        groupId,
        title: $state.title.value,
      }),
    })

    const fetchState = get(fetchInternal!.state)

    if (fetchState.error) {
      showNotification({
        content: fetchState.error,
        status: 'error',
      })
    } else if (fetchState.response) {
      const { id: changedId, title: changedTitle } = fetchState.response
      todos.update((_todos) => {
        return {
          ..._todos,
          [groupId]: _todos[groupId].reduce<Omit<Todo, 'groupId'>[]>((acc, _todo) => {
            if (_todo.id === changedId) {
              return [
                ...acc,
                {
                  ..._todo,
                  title: changedTitle,
                },
              ]
            }
            return [...acc, _todo]
          }, []),
        }
      })
      closeModal()
    }
    fetchStateUnsubscribe()
  }
</script>

<ModalOverlay id="changeTodoTitle">
  <article>
    {#if todo}
      <FormLayout on:submit={handleSubmit} disabled={todo.title === $state.title.value} {loading}>
        <svelte:fragment slot="heading">Change Title</svelte:fragment>
        <CloseFormModalButton slot="header" />

        <FormLabelLayout
          id="Title"
          bind:value={$state.title.value}
          error={$state.title.error}
          on:input={(e) => parseErrorDebounced('title', e)}
        />

        <svelte:fragment slot="submit-btn">Save</svelte:fragment>
      </FormLayout>
    {:else}
      <h6>Todo does not exist</h6>
      <button class="secondary btn-small todo-not-found-btn" on:click={closeModal}> Close </button>
    {/if}
  </article>
</ModalOverlay>

<style>
  .todo-not-found-btn {
    margin: 0 auto;
  }
</style>
