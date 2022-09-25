<script lang="ts">
  import type { TodoGroup } from '@prisma/client'
  import { writable } from 'svelte/store'

  import { groups } from '$lib/store/groups'
  import { groupSchema } from '$lib/schemas/group'
  import { debounce } from '$lib/utils/debounce'
  import { useFetchInternal } from '$lib/hooks/useFetchInternal'
  import ModalOverlay, { closeModal } from '$lib/layouts/ModalOverlay.svelte'
  import { serverErrorMessage, showNotification } from '$lib/store/notification'
  import FormLayout from '$lib/layouts/FormLayout.svelte'
  import FormLabelLayout from '$lib/layouts/FormLabelLayout.svelte'
  import CloseFormModalButton from './CloseFormModalButton.svelte'

  type FormData = Record<
    'name' | 'description',
    {
      value: string
      error: null | string
    }
  >

  const defaultData = () => ({
    name: {
      value: '',
      error: null,
    },
    description: {
      value: '',
      error: null,
    },
  })

  const formData = writable<FormData>(defaultData())

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

  const { execute, state: fetchState } = useFetchInternal<TodoGroup>('/api/group')
  const submit = async () => {
    parseError('name', $formData.name.value)
    parseError('description', $formData.description.value)

    if ($formData.name.error || $formData.description.error) {
      return
    }

    await execute({
      method: 'POST',
      body: JSON.stringify({
        name: $formData.name.value,
        description: $formData.description.value,
      }),
    })

    if ($fetchState.response !== null) {
      groups.update((g) => {
        g.push($fetchState.response!)
        return g
      })
      closeModal()
    } else {
      showNotification({
        content: serverErrorMessage,
        status: 'error',
      })
    }
  }
</script>

<ModalOverlay on:close={() => $formData = defaultData()}>
  <article>
    <FormLayout loading={$fetchState.loading} on:submit={submit}>
      <svelte:fragment slot="heading">Create Group</svelte:fragment>
      <CloseFormModalButton slot="header" />
  
      <FormLabelLayout
        id="Name"
        bind:value={$formData.name.value}
        error={$formData.name.error}
        on:input={() => parseErrorDebounced('name', $formData.name.value)}
      />
      <FormLabelLayout
        id="Description"
        bind:value={$formData.description.value}
        error={$formData.description.error}
        on:input={() => parseErrorDebounced('description', $formData.description.value)}
      >
        <div class="info-icon" data-tooltip="Description is not required" slot="label">
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
      </FormLabelLayout>
  
      <svelte:fragment slot="submit-btn">Create</svelte:fragment>
    </FormLayout>
  </article>
</ModalOverlay>

<style>
  .info-icon {
    display: grid;
    place-items: center;
  }
</style>
