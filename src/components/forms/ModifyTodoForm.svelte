<script lang="ts">
  import type { Todo } from '@prisma/client'

  import { useForm } from '$lib/hooks/useForm'
  import { contentSchema, titleSchema } from '$lib/schemas/todo'
  import ModalOverlay from '$lib/layouts/ModalOverlay.svelte'
  import FormLayout from '$lib/layouts/FormLayout.svelte'
  import CloseFormModalButton from '../CloseFormModalButton.svelte'
  import FormLabelLayout from '$lib/layouts/FormLabelLayout.svelte'

  export let todo: Todo

  const {
    parseError,
    parseErrorDebounced,
    state: formState,
  } = useForm({
    todoTitle: {
      value: todo.title,
      errorParser: (v: string) => {
        const result = titleSchema.safeParse(v)
        return !result.success ? result.error : null
      },
    },
    todoContent: {
      value: todo.content,
      errorParser: (v: string) => {
        const result = contentSchema.safeParse(v)
        return !result.success ? result.error : null
      },
    },
  })

  $: saveDisabled =
    $formState.todoTitle.value === todo.title && $formState.todoContent.value === todo.content

  const clearForm = () => {
    $formState.todoTitle = {
      value: todo.title,
      error: null,
    }
    $formState.todoContent = {
      value: todo.content,
      error: null,
    }
  }

  const clearErrors = () => {
    $formState.todoTitle.error = null
    $formState.todoContent.error = null
  }
</script>

<ModalOverlay on:close={clearForm} on:show={clearErrors}>
  <article class="card-border">
    <FormLayout disabled={saveDisabled}>
      <svelte:fragment slot="heading">Modify Todo</svelte:fragment>
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

      <svelte:fragment slot="submit-btn">Save</svelte:fragment>
    </FormLayout>
  </article>
</ModalOverlay>
