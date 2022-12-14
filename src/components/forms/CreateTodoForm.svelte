<script lang="ts">
  import type { Todo } from '@prisma/client'

  import FormLayout from '../../layouts/FormLayout.svelte'
  import FormLabelLayout from '../../layouts/FormLabelLayout.svelte'
  import CloseFormModalButton from '../buttons/CloseFormModalButton.svelte'
  import { useFetchInternal } from '$lib/hooks/useFetchInternal'
  import { useForm } from '$lib/hooks/useForm'
  import { titleSchema, contentSchema } from '$lib/schemas/todo'
  import { todos } from '$lib/store/todos'
  import ModalOverlay, { closeModal } from '$lib/layouts/ModalOverlay.svelte'
  import { serverErrorMessage, showNotification } from '$lib/store/notification'

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
      errorParser: (v: string) => parse('todoTitle', v),
    },
    todoContent: {
      value: '',
      errorParser: (v: string) => parse('todoContent', v),
    },
  })

  const clearForm = () => {
    $formState.todoTitle = {
      value: '',
      error: null,
    }
    $formState.todoContent = {
      value: '',
      error: null,
    }
  }

  export let groupId: number

  const createTodo = async () => {
    parseError('todoTitle', $formState.todoTitle.value)
    parseError('todoContent', $formState.todoContent.value)

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
      const { groupId: _, ...todo } = $createTodoState.response
      todos.update((t) => {
        t[groupId] = [...(t[groupId] || []), todo]
        return t
      })
      clearForm()
      closeModal()
    } else {
      showNotification({
        content: serverErrorMessage,
        status: 'error',
      })
    }
  }
</script>

<ModalOverlay on:close={clearForm}>
  <article>
    <FormLayout on:submit={createTodo} loading={$createTodoState.loading}>
      <svelte:fragment slot="heading">Create Todo</svelte:fragment>
      <CloseFormModalButton slot="header" />

      <FormLabelLayout
        id="Title"
        bind:value={$formState.todoTitle.value}
        on:input={(e) => parseErrorDebounced('todoTitle', e)}
        error={$formState.todoTitle.error}
      />
      <FormLabelLayout
        id="Content"
        inputType="textArea"
        bind:value={$formState.todoContent.value}
        on:input={(e) => parseErrorDebounced('todoContent', e)}
        error={$formState.todoContent.error}
      />

      <svelte:fragment slot="submit-btn">Submit</svelte:fragment>
    </FormLayout>
  </article>
</ModalOverlay>
