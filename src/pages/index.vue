<!-- eslint-disable no-alert -->
<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { IAgoraRTCClient } from 'agora-rtc-sdk-ng/esm'
import { createClient, createMicrophoneAudioTrack, getMicrophones, getSupportedCodec, onAutoplayFailed, onMicrophoneChanged } from 'agora-rtc-sdk-ng/esm'
import VConsole from 'vconsole'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import { showDialog } from 'vant'
import { debounce } from 'lodash-es'
import useAppStore from '@/stores/modules/app'
import { createChannel, joinChannel, leaveChannel, restartChannel, stopChannel } from '@/api'
import usePageCheckAlive from '@/hooks/usePageCheckAlive'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const { isLongTimeDeactived, detectInactivity } = usePageCheckAlive()
const appStore = useAppStore()
const isInDarkMode = ref<boolean>(isDark.value)
const AI_ROBOT_USER_ID = 10000

const options = {
  clientId: uuidv4(),
  demo: false,
  appId: '895b97676546405f9077c5e1089a9c53',
  channel: null,
  token: null,
  uid: null,
}

let client: IAgoraRTCClient = null
let vconsole = null

const audioRing = ref(null)
const isConnecting = ref(false)
const isConnected = ref(false)
const scroller = ref(null)

const indexGuide = computed(() => {
  return isConnecting.value ? '正在连接中...' : '您好，有什么问题来与我聊聊吧'
})

const isSpeaking = ref(true)
// const isLocalMuted = ref(false)
const localAudioTrack = ref(null)
const logsContainerRef = ref(null)

const remoteAudioTrack = ref<{ uid: string, audioTrack: any }>(null)
const conversationList = ref<{ uniqId: string, conversationId: string, done?: boolean, userId: number, message: string }[]>([
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '新鲜羊肉从乌鲁木齐寄到深圳能收吗？' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10000, message: `羊肉寄到深圳的航空和陆运都是有条件收寄，收寄要求可以在字幕中直接查看哦。还有啊，羊肉是生鲜产品，建议您可以向客户推荐使用保鲜服务哦。<br/>
// 收寄要求：<br/>
// 单票重量≤15公斤。<br/><br/>
// 1、不含干冰<br/>
// 2、备案后可收<br/>
// 3、需满足航空包装要求。` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '帮我查一下昨晚8点派送的件妥投照片' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出图片，请在字幕中查看。<img src='/img.png' style='width: 100%;'>` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '查询昨天被投诉的那票件的通话记录' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出语音记录，可以在对话内容中播放哦。<audio loop controls src='/ring.mp3' />` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '新鲜羊肉从乌鲁木齐寄到深圳能收吗？' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10000, message: `羊肉寄到深圳的航空和陆运都是有条件收寄，收寄要求可以在字幕中直接查看哦。还有啊，羊肉是生鲜产品，建议您可以向客户推荐使用保鲜服务哦。<br/>
// 收寄要求：<br/>
// 单票重量≤15公斤。<br/><br/>
// 1、不含干冰<br/>
// 2、备案后可收<br/>
// 3、需满足航空包装要求。` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '帮我查一下昨晚8点派送的件妥投照片' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出图片，请在字幕中查看。<img src='/img.png' style='width: 100%;'>` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '查询昨天被投诉的那票件的通话记录' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出语音记录，可以在对话内容中播放哦。<audio loop controls src='/ring.mp3' />` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '新鲜羊肉从乌鲁木齐寄到深圳能收吗？' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10000, message: `羊肉寄到深圳的航空和陆运都是有条件收寄，收寄要求可以在字幕中直接查看哦。还有啊，羊肉是生鲜产品，建议您可以向客户推荐使用保鲜服务哦。<br/>
// 收寄要求：<br/>
// 单票重量≤15公斤。<br/><br/>
// 1、不含干冰<br/>
// 2、备案后可收<br/>
// 3、需满足航空包装要求。` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '帮我查一下昨晚8点派送的件妥投照片' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出图片，请在字幕中查看。<img src='/img.png' style='width: 100%;'>` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '查询昨天被投诉的那票件的通话记录' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出语音记录，可以在对话内容中播放哦。<audio loop controls src='/ring.mp3' />` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '新鲜羊肉从乌鲁木齐寄到深圳能收吗？' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10000, message: `羊肉寄到深圳的航空和陆运都是有条件收寄，收寄要求可以在字幕中直接查看哦。还有啊，羊肉是生鲜产品，建议您可以向客户推荐使用保鲜服务哦。<br/>
// 收寄要求：<br/>
// 单票重量≤15公斤。<br/><br/>
// 1、不含干冰<br/>
// 2、备案后可收<br/>
// 3、需满足航空包装要求。` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '帮我查一下昨晚8点派送的件妥投照片' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出图片，请在字幕中查看。<img src='/img.png' style='width: 100%;'>` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '查询昨天被投诉的那票件的通话记录' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出语音记录，可以在对话内容中播放哦。<audio loop controls src='/ring.mp3' />` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '新鲜羊肉从乌鲁木齐寄到深圳能收吗？' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10000, message: `羊肉寄到深圳的航空和陆运都是有条件收寄，收寄要求可以在字幕中直接查看哦。还有啊，羊肉是生鲜产品，建议您可以向客户推荐使用保鲜服务哦。<br/>
// 收寄要求：<br/>
// 单票重量≤15公斤。<br/><br/>
// 1、不含干冰<br/>
// 2、备案后可收<br/>
// 3、需满足航空包装要求。` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '帮我查一下昨晚8点派送的件妥投照片' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出图片，请在字幕中查看。<img src='/img.png' style='width: 100%;'>` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '查询昨天被投诉的那票件的通话记录' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出语音记录，可以在对话内容中播放哦。<audio loop controls src='/ring.mp3' />` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '新鲜羊肉从乌鲁木齐寄到深圳能收吗？' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10000, message: `羊肉寄到深圳的航空和陆运都是有条件收寄，收寄要求可以在字幕中直接查看哦。还有啊，羊肉是生鲜产品，建议您可以向客户推荐使用保鲜服务哦。<br/>
// 收寄要求：<br/>
// 单票重量≤15公斤。<br/><br/>
// 1、不含干冰<br/>
// 2、备案后可收<br/>
// 3、需满足航空包装要求。` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '帮我查一下昨晚8点派送的件妥投照片' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出图片，请在字幕中查看。<img src='/img.png' style='width: 100%;'>` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '查询昨天被投诉的那票件的通话记录' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出语音记录，可以在对话内容中播放哦。<audio loop controls src='/ring.mp3' />` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '新鲜羊肉从乌鲁木齐寄到深圳能收吗？' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10000, message: `羊肉寄到深圳的航空和陆运都是有条件收寄，收寄要求可以在字幕中直接查看哦。还有啊，羊肉是生鲜产品，建议您可以向客户推荐使用保鲜服务哦。<br/>
// 收寄要求：<br/>
// 单票重量≤15公斤。<br/><br/>
// 1、不含干冰<br/>
// 2、备案后可收<br/>
// 3、需满足航空包装要求。` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '帮我查一下昨晚8点派送的件妥投照片' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出图片，请在字幕中查看。<img src='/img.png' style='width: 100%;'>` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '查询昨天被投诉的那票件的通话记录' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出语音记录，可以在对话内容中播放哦。<audio loop controls src='/ring.mp3' />` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '新鲜羊肉从乌鲁木齐寄到深圳能收吗？' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10000, message: `羊肉寄到深圳的航空和陆运都是有条件收寄，收寄要求可以在字幕中直接查看哦。还有啊，羊肉是生鲜产品，建议您可以向客户推荐使用保鲜服务哦。<br/>
// 收寄要求：<br/>
// 单票重量≤15公斤。<br/><br/>
// 1、不含干冰<br/>
// 2、备案后可收<br/>
// 3、需满足航空包装要求。` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '帮我查一下昨晚8点派送的件妥投照片' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出图片，请在字幕中查看。<img src='/img.png' style='width: 100%;'>` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '查询昨天被投诉的那票件的通话记录' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出语音记录，可以在对话内容中播放哦。<audio loop controls src='/ring.mp3' />` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '新鲜羊肉从乌鲁木齐寄到深圳能收吗？' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10000, message: `羊肉寄到深圳的航空和陆运都是有条件收寄，收寄要求可以在字幕中直接查看哦。还有啊，羊肉是生鲜产品，建议您可以向客户推荐使用保鲜服务哦。<br/>
// 收寄要求：<br/>
// 单票重量≤15公斤。<br/><br/>
// 1、不含干冰<br/>
// 2、备案后可收<br/>
// 3、需满足航空包装要求。` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '帮我查一下昨晚8点派送的件妥投照片' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出图片，请在字幕中查看。<img src='/img.png' style='width: 100%;'>` },
//   { uniqId: uuidv4(), conversationId: '1', userId: 0, message: '查询昨天被投诉的那票件的通话记录' },
//   { uniqId: uuidv4(), conversationId: '1', userId: 10, message: `好的，已经帮你调出语音记录，可以在对话内容中播放哦。<audio loop controls src='/ring.mp3' />` },
])

function resetOptions() {
  options.token = null
  options.uid = null
}

const scrollToBottom = debounce(() => {
  if (scroller.value && conversationList.value.length > 0) {
    scroller.value.scrollToBottom()
  }
}, 500)

// const scrollToBottom = debounce(() => {
//   nextTick(() => {
//     if (logsContainerRef.value) {
//       logsContainerRef.value.scrollTop = logsContainerRef.value.scrollHeight
//     }
//   })
// }, 500)

async function handleUserPublished(user, mediaType) {
  // 发起订阅远端用户对象的音频轨道(10000 是我们的AI机器人)，其它用户的不管
  if (mediaType === 'audio' && user.uid === `${AI_ROBOT_USER_ID}`) {
    await client.subscribe(user, mediaType)
    // 自动播放音频
    console.log(`[AIOT]${user.uid}进入对话通道`)
    remoteAudioTrack.value = {
      uid: user.uid,
      audioTrack: user.audioTrack,
    }
  }
}

async function handleUserUnpublished(user, mediaType) {
  if (mediaType === 'audio' && user.uid === `${AI_ROBOT_USER_ID}`) {
    console.log(`[AIOT]${user.uid}离开对话通道`)
    remoteAudioTrack.value = null
  }
}

async function handleUserStreamMessage(uid, payload) {
  const decoder = new TextDecoder('utf-8')
  const strPayload = decoder.decode(payload)
  console.info(`[AIOT]received data stream message from ${uid}: `, strPayload)
  if (uid === `${AI_ROBOT_USER_ID}`) {
    const { uid: userId, taskid: conversationId, type: msgType, msg: text } = JSON.parse(strPayload) || {}
    const isLastWord = msgType !== 0
    if (userId === 0) {
      // 用户的话ASR转成文本，显示在最后一次的用户对话框内
      // 从conversationList里找出最后一条userId为0的记录，没有则新增一条
      // 如果最后一条是AI回复的，那不用找，直接追加
      const lastItem = conversationList.value[conversationList.value.length - 1]
      let lastUserConversation = null
      if (lastItem && lastItem.userId === 0 && !lastItem.done) {
        // conversationList.value.findLast(item => item.userId === 0 && item.conversationId === conversationId && !item.done)
        lastUserConversation = lastItem
      }
      if (lastUserConversation) {
        lastUserConversation.message += text
        if (isLastWord) {
          lastUserConversation.done = true
        }
      }
      else {
        conversationList.value.push({
          uniqId: uuidv4(),
          userId: 0,
          done: false,
          message: text,
          conversationId,
        })
      }
    }
    else {
      // if (!isLocalMuted.value && !localAudioTrack.value.muted) {
      //   // 有AI响应回来，就对本地的音轨静音
      //   await localAudioTrack.value.setMuted(true)
      //   isLocalMuted.value = true
      // }
      const lastUserConversation = conversationList.value.findLast(item => item.userId !== 0 && item.conversationId === conversationId)
      if (lastUserConversation) {
        lastUserConversation.message += text
      }
      else {
        conversationList.value.push({
          uniqId: uuidv4(),
          userId,
          message: text,
          conversationId,
        })
      }
    }
  }
  scrollToBottom()
}

watch(
  () => isDark.value,
  (newMode) => {
    isInDarkMode.value = newMode
  },
  { immediate: true },
)

watch(() => isLongTimeDeactived.value, (isDeactived) => {
  if (isDeactived) {
    // 太久离开页面，关闭本地音频
    clearConnection()
  }
})

function toggle() {
  toggleDark()
  appStore.switchMode(isDark.value ? 'dark' : 'light')
}

async function leave() {
  isConnected.value = false
  if (localAudioTrack.value) {
    localAudioTrack.value.close()
    localAudioTrack.value = null
  }
  // await client.unpublish()
  remoteAudioTrack.value = null
  if (client.connectionState === 'CONNECTED') {
    await client.leave()
  }
  conversationList.value = []
  if (options.token) {
    try {
      await leaveChannel(options.clientId, options.token, options.channel)
    }
    catch (e) {
      console.error(e)
    }
  }
  resetOptions()
}

function showVConsole() {
  if (!vconsole) {
    vconsole = new VConsole()
  }
  else {
    vconsole.destroy()
    vconsole = null
  }
}

async function whenMicrophoneChanged(changedDevice) {
  if (!localAudioTrack.value)
    return
  // 插入设备时，切换到新插入的设备
  if (changedDevice.state === 'ACTIVE') {
    localAudioTrack.value.setDevice(changedDevice.device.deviceId)
    // 拔出设备为当前设备时，切换到一个已有的设备
  }
  else if (changedDevice.device.label === localAudioTrack.value.getTrackLabel()) {
    const oldMicrophones = await getMicrophones()
    oldMicrophones[0] && localAudioTrack.value.setDevice(oldMicrophones[0].deviceId)
  }
}

function whenAutoplayFailed() {
  // 利用vant的弹框，提示用户来一次操作
  showDialog({
    title: '温馨提示',
    message: '请点击确认自动播放语音，再开始使用',
  })
}

onMounted(() => {
  // 如果页面url参数带上了from=aiot
  if (location.search.includes('from=aiot')) {
    options.demo = true
  }
  getSupportedCodec().then((result) => {
    console.log(`Supported video codec: ${result.video.join(',')}`)
    console.log(`Supported audio codec: ${result.audio.join(',')}`)
  })
  client = createClient({
    mode: 'live',
    role: 'host',
    codec: 'vp8',
  })
  // Add event listeners to the client.
  client.on('user-published', handleUserPublished)
  client.on('user-unpublished', handleUserUnpublished)
  client.on('stream-message', handleUserStreamMessage)

  detectInactivity(() => {
    if (false) {
      // 是否要切换后直接挂断，目前看还是不要的好
      clearConnection()
    }
  })

  onMicrophoneChanged(whenMicrophoneChanged)
  onAutoplayFailed(whenAutoplayFailed)
})

onUnmounted(async () => {
  if (vconsole) {
    vconsole.destroy()
    vconsole = null
  }
  clearConnection()
})

const pauseToAi = debounce(async () => {
  if (isSpeaking.value) {
    await localAudioTrack.value.setEnabled(false)
    await stopChannel(options.clientId, options.token, options.channel)
    isSpeaking.value = false
  }
  else {
    await localAudioTrack.value.setEnabled(true)
    await restartChannel(options.clientId, options.token, options.channel)
    isSpeaking.value = true
  }
  console.log(`[AIOT]您${isSpeaking.value ? '重新开始了' : '暂停了'}对话`)
}, 500)

// 判断是否有声音
// function detectSpeech(audioBuffer, sampleRate, timeWindow = 1 /* 时间窗口，单位为秒 */, threshold = -30 /* 分贝阈值，可调整 */) {
//   const frameSize = sampleRate * timeWindow
//   const numFrames = Math.floor(audioBuffer.length / frameSize)

//   for (let i = 0; i < numFrames; i++) {
//     const startIndex = i * frameSize
//     const endIndex = startIndex + frameSize
//     const frameData = audioBuffer.slice(startIndex, endIndex)

//     // 计算RMS
//     let sumOfSquares = 0
//     for (let j = 0; j < frameData.length; j++) {
//       sumOfSquares += frameData[j] * frameData[j]
//     }
//     const rms = Math.sqrt(sumOfSquares / frameData.length)
//     const dB = 20 * Math.log10(rms)

//     // console.log(`dB: ${dB}`)
//     if (dB > threshold) {
//       return true
//     }
//   }
//   return false
// }

function clearConnection() {
  if (client.connectionState === 'CONNECTED') {
    leave()
  }
}

const callToAi = debounce(async () => {
  if (isConnected.value && client.connectionState === 'CONNECTED') {
    leave()
  }
  else {
    isConnecting.value = true
    audioRing.value.play()
    isSpeaking.value = false
    // 动态获取token
    if (!options.token) {
      try {
        if (options.demo) {
          // options.token = await fetch(`https://v-downloads.obs.cn-south-1.myhuaweicloud.com/aiot-temp-token.json?t=${new Date().getTime()}`)
          //   .then(res => res.json())
          //   .then(res => res.token)
          const channel = window.prompt('通道：')
          options.channel = channel
          const token = window.prompt('Token：')
          options.token = token
          options.uid = null
        }
        else {
          const data = await createChannel(options.clientId)
          if (data.token) {
            options.token = data.token
            options.channel = data.channel
            options.uid = data.uid
            // options.clientId = data.event_id
          }
          console.log(`[AIOT]您的clientId是：${options.clientId}`)
        }
      }
      catch {
        isConnecting.value = false
        audioRing.value.pause()
        audioRing.value.currentTime = 0
        showNotify({ type: 'warning', message: `获取鉴权身份异常，请重试。` })
        return
      }
    }
    if (options.token) {
      try {
        if (options.uid) {
          options.uid = await client.join(options.appId, options.channel, options.token, options.uid)
        }
        else {
          options.uid = await client.join(options.appId, options.channel, options.token)
        }

        await client.setClientRole('host')

        // 成功加入频道后再推送本地音轨
        localAudioTrack.value = await createMicrophoneAudioTrack({
          encoderConfig: {
            // 音频采样率，单位为 Hz
            sampleRate: 8000,
            // 是否开启立体声
            stereo: true,
            // 音频码率，单位为 Kbps
            bitrate: 128,
          },
        })
        await client.publish([localAudioTrack.value])
        isSpeaking.value = true
        console.log(`[AIOT]您(UID:${options.uid})成功进入对话通道（${options.channel}）`)

        // 增加本地音轨通道的静音判断
        // localAudioTrack.value.setAudioFrameCallback((buffer) => {
        //   if (isSpeaking.value && isLocalMuted.value) {
        //     let checkSpeaking = false
        //     for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
        //       // Float32Array with PCM data
        //       const currentChannelData = buffer.getChannelData(channel)
        //       // console.log("PCM data in channel", channel, currentChannelData);
        //       checkSpeaking = detectSpeech(currentChannelData, 8000, 1)
        //       if (checkSpeaking)
        //         break
        //     }

        //     if (checkSpeaking) {
        //       // 取消静音
        //       localAudioTrack.value.setMuted(false)
        //       isLocalMuted.value = false
        //     }
        //   }
        // }, 8192)

        joinChannel(options.clientId, '', options.channel, `${AI_ROBOT_USER_ID}`)

        isConnected.value = true
      }
      catch (error) {
        isConnected.value = false
        // 清理当前连接
        clearConnection()
        resetOptions()
        showNotify({ type: 'warning', message: `连接异常，原因：${error.message}` })
      }
      finally {
        isConnecting.value = false
        audioRing.value.pause()
        audioRing.value.currentTime = 0
      }
    }
  }
}, 500)
// https://v-downloads.obs.cn-south-1.myhuaweicloud.com/head.jpeg
</script>

<template>
  <div class="flex flex-col items-center justify-center" style="height: calc(100vh)">
    <div v-if="!isConnected" class="pretty-init h-full w-full flex flex-col">
      <div class="mb-8 w-full flex items-center justify-end">
        <span :class="isInDarkMode ? 'text-white' : 'text-black'" class="mr-8" style="font-size: 12px;">暗夜模式</span><van-switch v-model="isInDarkMode" size="14px" aria-label="on/off Dark Mode" @click="toggle()" />
      </div>
      <div class="flex flex-col items-center justify-center" style="flex: 2">
        <p class="big-title">
          丰语智能语音助手
        </p>
        <van-image
          round
          width="10rem"
          height="10rem"
          :class="isConnecting ? 'shinimg shinning' : 'shinimg'"
          src="/logo.svg"
          @click="showVConsole"
        />
      </div>
      <div class="flex items-center justify-center" style="flex: 1; flex-direction: column">
        <p class="tips p-10">
          {{ indexGuide }}
        </p>
        <van-icon name="phone-circle" :color="isConnecting ? '#0085ff' : '#2bd14c'" size="4rem" :class="isConnecting ? 'shaking' : ''" @click="callToAi" />
      </div>
    </div>
    <div v-else class="pretty-open h-full w-full flex flex-col">
      <div class="mb-8 flex items-center justify-between">
        <div class="flex">
          <van-image
            round
            width="2rem"
            height="2rem"
            src="/logo.svg"
          />
          <span style="line-height: 2rem; padding-left: 6px">丰语智能语音助手</span>
        </div>
        <div class="pd-10 flex-1">
          <AgoraVideoPlayer v-if="remoteAudioTrack" :audio-track="remoteAudioTrack.audioTrack" />
        </div>
        <div>
          <van-icon name="phone-circle" color="#ff6a6a" size="2rem" @click="callToAi" />
        </div>
      </div>
      <div ref="logsContainerRef" class="logs">
        <!-- <van-list finished>
          <ul>
            <li v-for="item in conversationList" :key="item.conversationId" class="conversation-output">
              <div class="content" :class="item.userId === 0 ? 'user-say' : 'ai-say'" v-html="item.message" />
            </li>
          </ul>
        </van-list> -->
        <DynamicScroller
          ref="scroller"
          class="scroller"
          :items="conversationList"
          key-field="uniqId"
          :min-item-size="50"
        >
          <template #default="{ item, active }">
            <DynamicScrollerItem :item="item" :active="active" :data-index="item.uniqId">
              <div class="conversation-output">
                <div class="content" :class="item.userId === 0 ? 'user-say' : 'ai-say'" v-html="item.message" />
              </div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
      </div>
      <div class="flex flex-col" style="flex: 0 160px">
        <div class="audio" :class="isSpeaking ? 'speaking' : ''">
          <div class="wave" />
          <div class="wave" />
          <div class="wave" />
          <div class="wave" />
          <div class="wave" />
        </div>
        <p class="tips">
          {{ isSpeaking ? '已连通 , 正在倾听' : '已暂停 , 点击恢复' }}
        </p>
        <div class="text-center">
          <van-icon v-if="isSpeaking" color="#2bd14c" name="pause-circle" size="4rem" @click="pauseToAi" />
          <van-icon v-else name="play-circle" color="#2bd14c" size="4rem" @click="pauseToAi" />
        </div>
        <p class="tips2">
          AI生成内容仅供参考，重要信息请务必核查
        </p>
      </div>
    </div>
    <audio ref="audioRing" src="/ring.mp3" loop />
    <AgoraVideoPlayer v-if="localAudioTrack" :is-local="true" :show-icon="false" :audio-track="localAudioTrack" />
  </div>
</template>

<style lang="less" scoped>
.big-title {
  font-size: xx-large;
  margin-bottom: 70px;
  background: linear-gradient(90deg, lightblue, #1989fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}
.audio {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 30px;
  margin: 0 auto;
  .wave {
    height: 10px;
    display: block;
    width: 5px;
    height: 5px;
    border-radius: 8px;
    background: orange;
  }
}

.tips {
  font-size: 12px;
  text-align: center;
  margin: 4px;
  color: darkgrey;
}

.tips2 {
  font-size: 10px;
  text-align: center;
  margin: 4px;
  color: grey;
}

.logs {
  // height: 100%;
  flex: 1;
  overflow: scroll;
  border-radius: 10px;
  background: #646566;
}

.scroller {
  height: 100%; /* 确保 scroller 占满整个容器 */
}

.speaking {
  .wave {
    animation: audio-wave 2s ease-in-out infinite;

    &:nth-child(1) {
      animation-delay: 0.1s;
    }

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.3s;
    }

    &:nth-child(4) {
      animation-delay: 0.4s;
    }

    &:nth-child(5) {
      animation-delay: 0.5s;
    }
  }
}

@keyframes audio-wave {
  0% {
    height: 5px;
    transform: translateY(0px);
    background: #ff8e3a;
  }

  25% {
    height: 8px;
    transform: translateY(0px);
    background: #9c73f8;
  }

  50% {
    height: 10px;
    transform: translateY(-5px) scaleY(1.5);
    background: #ed509e;
  }

  75% {
    height: 8px;
    transform: translateY(0px);
    background: #9c73f8;
  }

  100% {
    height: 5px;
    transform: translateY(0px);
    background: #0fccce;
  }
}

@keyframes diverge {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.pretty-open {
  animation: diverge 200ms ease-in-out forwards;
}

@keyframes converge {
  0% {
    transform: scale(2);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.pretty-init {
  animation: converge 200ms ease-in-out forwards;
  /* 初始状态放大 */
  transform: scale(2);
  opacity: 0;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-2px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(2px);
  }
}

.shaking {
  animation: shake 0.5s ease-in-out infinite;
}

.shinimg {
  box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.3);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 40px 20px rgba(255, 255, 255, 0.6);
  }
  100% {
    box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.3);
  }
}

.shinning {
  animation: pulse 2s infinite;
}

.conversation-output {
  padding: 5px 10px;

  .content {
    margin: 0;
    font-size: 12px;
    line-height: 16px;
  }

  .content::before {
    content: '●';
    margin-right: 5px;
  }

  .user-say {
    color: #07c160;
  }
  .ai-say {
    color: #fff;
  }
}
</style>

<route lang="json">
{
  "name": "index",
  "meta": {
    "title": "丰语智能语音",
    "i18n": "menus.aicall"
  }
}
</route>
