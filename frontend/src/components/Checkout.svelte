<script>
  import { onMount } from 'svelte'
  import { goto } from '@sapper/app'
  import sendEmail from '../utils/sendEmail.js'

  export let selectedPrint, showSpinner, hideSpinner
  let paypal

  $: description = `${selectedPrint.x} x ${selectedPrint.y} ${selectedPrint.title} (${selectedPrint.id})`

  onMount(() => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_ID}&currency=GBP&disable-funding=credit,card,bancontact,blik,eps,giropay,ideal,mybank,p24,sepa,sofort,venmo`

    script.onload = function () {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            showSpinner()
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  description,
                  amount: {
                    currency_code: 'GBP',
                    value: selectedPrint.price.toFixed(1),
                  },
                },
              ],
            })
          },
          onCancel: () => {
            hideSpinner()
            sendEmail({
              body: {
                subject: `Paypal Cancelled`,
                html: `
                    <h3>Cancelled Paypal purchase</h3>
                    <pre>${JSON.stringify(
                      { description, selectedPrint },
                      null,
                      2
                    )}</pre>
                `,
              },
            })
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture()
            sendEmail({
              body: {
                subject: `Paypal Purchase`,
                html: `
                    <h3>Approved Paypal purchase</h3>
                    <pre>${JSON.stringify(order, null, 2)}</pre>
                `,
              },
            })
            goto(`/thankyou?order_id=${order.id}`)
          },
          onError: (err) => {
            hideSpinner()
            sendEmail({
              body: {
                subject: `Paypal Error`,
                html: `
                    <h3>Failed Paypal purchase</h3>
                    <pre>${JSON.stringify(err, null, 2)}</pre>
                `,
              },
            })
            goto('/paypal-error')
          },
        })
        .render(paypal)
    }
    document.body.appendChild(script)
  })
</script>

<div bind:this={paypal} />
