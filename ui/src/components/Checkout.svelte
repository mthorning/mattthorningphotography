<script lang="ts">
  import { loadScript } from '@paypal/paypal-js'
  import { onMount } from 'svelte'
  import { goto } from '@sapper/app'
  import sendEmail from '../utils/sendEmail.js'
  import type { PrintSize } from '../types'

  interface PurchasedPrint extends PrintSize {
    title: string
    id: string
  }

  export let purchasedPrint: PurchasedPrint,
    showSpinner: () => void,
    hideSpinner: () => void

  let paypalContainer: HTMLElement

  $: description = `${purchasedPrint.x} x ${purchasedPrint.y} ${purchasedPrint.title} (${purchasedPrint.id})`

  onMount(() => {
    loadScript({
      'client-id': process.env.PAYPAL_ID,
      'disable-funding':
        'credit,card,bancontact,blik,eps,giropay,ideal,mybank,p24,sepa,sofort,venmo',
      currency: 'GBP',
    }).then((paypal) =>
      paypal
        .Buttons({
          createOrder: (_: any, actions: any) => {
            showSpinner()
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  description,
                  amount: {
                    currency_code: 'GBP',
                    value: purchasedPrint.price.toFixed(1),
                  },
                },
              ],
            })
          },
          onCancel: () => {
            hideSpinner()
            const body = {
              subject: `Paypal Cancelled`,
              html: `
                    <h3>Cancelled Paypal purchase</h3>
                    <pre>${JSON.stringify(
                      { description, purchasedPrint },
                      null,
                      2
                    )}</pre>
                `,
            }
            sendEmail({ body })
          },
          onApprove: async (_: any, actions: any) => {
            const order = await actions.order.capture()
            const body = {
              subject: `Paypal Purchase`,
              html: `
                    <h3>Approved Paypal purchase</h3>
                    <pre>${JSON.stringify(order, null, 2)}</pre>
                `,
            }
            sendEmail({ body })
            goto(`/thanky,ou?order_id=${order.id}`)
          },
          onError: (err: Error) => {
            hideSpinner()
            const body = {
              subject: `Paypal Error`,
              html: `
                    <h3>Failed Paypal purchase</h3>
                    <pre>${JSON.stringify(err, null, 2)}</pre>
                `,
            }
            sendEmail({ body })
            goto('/paypal-error')
          },
        })
        .render(paypalContainer)
    )
  })
</script>

<div data-test="paypalButton" bind:this={paypalContainer} />
