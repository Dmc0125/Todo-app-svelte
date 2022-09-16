<script>
  import FormLayout from './FormLayout.svelte'
  import FormLabelLayout from './FormLabelLayout.svelte'
  import { useFetchInternal } from '$lib/hooks/useFetchInternal'

  const { execute, state: createTodoState } = useFetchInternal('/api/todo')

  let todoTitle = ''
  let todoContent = ''

  const createTodo = () => {
    
  }
</script>

<FormLayout>
  <svelte:fragment slot="heading">Create Todo</svelte:fragment>

  <FormLabelLayout id="Title" bind:value="{todoTitle}" />
  <FormLabelLayout id="Content" bind:value="{todoContent}" />

  <svelte:fragment slot="submit-btn">Submit</svelte:fragment>
</FormLayout>
