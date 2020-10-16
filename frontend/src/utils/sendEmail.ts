export default async function({ body, onSuccess, onError}) {
    try {
        const response = await fetch('/contact', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        if (Number(response.status) >= 400) {
            if(onError) onError()
        } else {
            const data = await response.json()
            if(onSuccess) onSuccess(data)
        }

    } catch (e) {
      if(onError) onError()
    }
}

