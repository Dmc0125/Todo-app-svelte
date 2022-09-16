<script>
  import FormLayout from '../layouts/FormLayout.svelte'
  import FormLabelLayout from '../layouts/FormLabelLayout.svelte'
  import CloseFormModalButton from './CloseFormModalButton.svelte'
  import { useFetchInternal } from '$lib/hooks/useFetchInternal'

  const { execute, state: createTodoState } = useFetchInternal('/api/todo')

  let todoTitle = ''
  let todoContent = ''

  const createTodo = () => {}
</script>

<article>
  <FormLayout>
    <svelte:fragment slot="heading">Create Todo</svelte:fragment>
    <CloseFormModalButton slot="header" />

    <FormLabelLayout id="Title" bind:value={todoTitle} />
    <FormLabelLayout id="Content" bind:value={todoContent} />

    <svelte:fragment slot="submit-btn">Submit</svelte:fragment>
  </FormLayout>
</article>
