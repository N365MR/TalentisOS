let registrationStarted = false

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || registrationStarted) return
  registrationStarted = true

  const register = async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js')
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            document.documentElement.dataset.updateAvailable = 'true'
            document.querySelector('#update-notice')?.removeAttribute('hidden')
          }
        })
      })
    } catch (error) { console.warn('TalentisOS offline support could not be registered.', error) }
  }

  if (document.readyState === 'complete') register()
  else window.addEventListener('load', register, { once: true })
}
