import type { AppStore } from '@/stores/modules/app'

export default function useAutoThemeSwitcher(appStore: AppStore) {
  const handleAttributeChange = () => {
    const rootElement = document.documentElement
    const darkCk1 = rootElement.classList.contains('dark')
    // const darkCk2 = rootElement.classList.contains('van-theme-dark')
    const mode = darkCk1 ? 'dark' : 'light'
    appStore.switchMode(mode)
    // if (mode === 'dark' && darkCk1 !== darkCk2) {
    //   rootElement.classList.toggle('dark', true)
    // }
  }

  const observerOptions = {
    attributes: true,
    attributeFilter: ['class'],
  }

  const observer = new MutationObserver(handleAttributeChange)

  const targetElement = document.querySelector('html')

  const initializeThemeSwitcher = () => {
    observer.observe(targetElement, observerOptions)
  }

  return { initializeThemeSwitcher }
}
