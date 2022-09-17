<script lang="ts">
  import FormLayout from '../layouts/FormLayout.svelte'
  import FormLabelLayout from '../layouts/FormLabelLayout.svelte'
  import CloseFormModalButton from './CloseFormModalButton.svelte'
  import { useFetchInternal } from '$lib/hooks/useFetchInternal'
  import { useForm } from '$lib/hooks/useForm'
  import { titleSchema, contentSchema } from '$lib/schemas/todo'
  import { todos, type Todo } from '$lib/store/todos'
  import { closeModal } from '$lib/layouts/ModalOverlay.svelte'

  const { execute, state: createTodoState } = useFetchInternal<Todo>('/api/todo')

  const schemas = {
    todoTitle: titleSchema,
    todoContent: contentSchema,
  }

  const parse = (prop: keyof typeof schemas, v: string) => {
    const result = schemas[prop].safeParse(v)
    return !result.success ? result.error : null
  }

  const {
    parseError,
    parseErrorDebounced,
    state: formState,
  } = useForm({
    todoTitle: {
      value: '',
      errorParser: (v) => parse('todoTitle', v),
    },
    todoContent: {
      value: '',
      errorParser: (v) => parse('todoContent', v),
    },
  })

  export let groupId: number

  const createTodo = async () => {
    parseError('todoTitle')
    parseError('todoContent')

    if ($formState.todoTitle.error || $formState.todoContent.error) {
      return
    }

    await execute({
      method: 'POST',
      body: JSON.stringify({
        title: $formState.todoTitle.value,
        content: $formState.todoContent.value,
        groupId,
      }),
    })

    if ($createTodoState.response !== null) {
      const { groupId: _, ...todo} = $createTodoState.response
      todos.update((t) => {
        t[groupId] = [...(t[groupId] || []), todo]
        return t
      })

      closeModal()
    }
  }
</script>

<article>
  <FormLayout on:submit={createTodo} loading={$createTodoState.loading}>
    <svelte:fragment slot="heading">Create Todo</svelte:fragment>
    <CloseFormModalButton slot="header" />

    <FormLabelLayout
      id="Title"
      bind:value={$formState.todoTitle.value}
      on:input={() => parseErrorDebounced('todoTitle')}
      error={$formState.todoTitle.error}
    />
    <FormLabelLayout
      id="Content"
      bind:value={$formState.todoContent.value}
      on:input={() => parseErrorDebounced('todoContent')}
      error={$formState.todoContent.error}
    />

    <svelte:fragment slot="submit-btn">Submit</svelte:fragment>
  </FormLayout>
</article>
