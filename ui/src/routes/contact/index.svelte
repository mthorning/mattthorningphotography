<script lang="ts">
  import { goto } from '@sapper/app'
  import Spinner from '../../components/Spinner.svelte'
  import sendEmail from '../../utils/sendEmail.js'

  let submitting = false
  let error = false

  async function submit({ target }) {
    submitting = true

    const {
      name: { value: name },
      email: { value: from },
      message: { value: message },
    } = target

    sendEmail({
      body: {
        from,
        subject: `Message from ${name}`,
        html: `
            <pre>${message}</pre>
            <hr />
            <a href="mailto:${from}">${from}</a>
            `,
      },
      onSuccess() {
        goto('/thankyou?type=message')
      },
      onError() {
        error = true
        submitting = false
      },
    })
  }
</script>

<style>
  div {
    max-width: 56em;
    margin: auto;
  }
  form {
    display: flex;
    flex-direction: column;
    margin: 56px auto;
  }
  label {
    margin-bottom: 12px;
  }
  input,
  textarea {
    margin-bottom: 24px;
    min-height: 35px;
  }
  button[type='submit'] {
    align-self: flex-end;
    width: 80px;
    height: 40px;
    cursor: pointer;
  }
  .spinner {
    display: inline-block;
    height: 10px;
    width: 10px;
  }
</style>

<div>
  <h1>Contact</h1>
  <p>
    Please leave your details in the form below and I will get back to you as
    soon as possible.
  </p>
  <form on:submit|preventDefault={submit}>
    <label for="name">Name</label>
    <input required id="name" />
    <label for="email">Email</label>
    <input required id="email" type="email" />
    <label for="message">Message</label>
    <textarea required rows="10" id="message" />
    {#if error}
      <p>
        There has been an error submitting this form, please contact
        <a href={`mailto:${process.env.EMAIL_ADDRESS}`}>
          {process.env.EMAIL_ADDRESS}
        </a>
        for assistance.
      </p>
    {/if}
    <button type="submit" disabled={submitting}>
      Submit
      {#if submitting}
        <div class="spinner">
          <Spinner />
        </div>
      {/if}
    </button>
  </form>
</div>
