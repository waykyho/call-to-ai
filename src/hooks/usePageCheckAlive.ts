import { ref } from 'vue'

export default function usePageCheckAlive() {
  // 设置不活跃时间阈值，例如 10 分钟
  const INACTIVE_THRESHOLD = 10 * 60 * 1000 // 10 minutes in milliseconds

  let lastActivityTime = new Date().getTime()
  let inactivityTimeout

  const isLongTimeDeactived = ref(false)

  // 更新最后活动时间
  function updateLastActivityTime() {
    lastActivityTime = new Date().getTime()
    clearTimeout(inactivityTimeout)
    setInactivityTimeout()
  }

  // 设置不活跃超时
  function setInactivityTimeout() {
    inactivityTimeout = setTimeout(checkInactivity, INACTIVE_THRESHOLD)
  }

  // 检查不活跃状态
  function checkInactivity() {
    const currentTime = new Date().getTime()
    if (currentTime - lastActivityTime > INACTIVE_THRESHOLD) {
      // statusElement.innerText = 'Page has been inactive for a long time';
      isLongTimeDeactived.value = true
    }
  }

  const detectInactivity = (afterInvisible: () => void) => {
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // statusElement.innerText = 'Page is hidden';
        afterInvisible && afterInvisible()
      }
      else {
        // statusElement.innerText = 'Page is active';
        updateLastActivityTime()
      }
    })

    // 监听用户活动
    document.addEventListener('mousemove', updateLastActivityTime)
    document.addEventListener('keydown', updateLastActivityTime)
    document.addEventListener('click', updateLastActivityTime)
  }

  return { isLongTimeDeactived, detectInactivity }
}
