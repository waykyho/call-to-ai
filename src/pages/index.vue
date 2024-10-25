<!-- eslint-disable no-alert -->
<!-- eslint-disable no-console -->
<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { IAgoraRTCClient } from 'agora-rtc-sdk-ng/esm'
import { createClient, createMicrophoneAudioTrack, getSupportedCodec } from 'agora-rtc-sdk-ng/esm'
import VConsole from 'vconsole'
import { debounce } from 'lodash-es'
import useAppStore from '@/stores/modules/app'
import { createChannel, joinChannel, leaveChannel } from '@/api'
import usePageCheckAlive from '@/hooks/usePageCheckAlive'

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

const indexGuide = computed(() => {
  return isConnecting.value ? '正在连接中...' : '点击与小哥AI通话'
})

const isSpeaking = ref(false)
// const isLocalMuted = ref(false)
const localAudioTrack = ref(null)
const logsContainerRef = ref(null)

const remoteUsers = ref<{ uid: string, audioTrack: any }[]>([])
const conversationList = ref<{ conversationId: string, done?: boolean, userId: number, message: string }[]>([])

function resetOptions() {
  options.token = null
  options.uid = null
}

const scrollToBottom = debounce(() => {
  nextTick(() => {
    if (logsContainerRef.value) {
      logsContainerRef.value.scrollTop = logsContainerRef.value.scrollHeight
    }
  })
}, 500)

async function handleUserPublished(user, mediaType) {
  // 发起订阅远端用户对象的音频轨道(10000 是我们的AI机器人)，其它用户的不管
  // user.uid === AI_ROBOT_USER_ID
  await client.subscribe(user, mediaType)
  if (mediaType === 'audio' && (options.demo || (!options.demo && true))) {
    // 自动播放音频
    console.log(`[AIOT]${user.uid}进入对话通道`)
    remoteUsers.value.push({
      uid: user.uid,
      audioTrack: user.audioTrack,
    })
  }
}

async function handleUserUnpublished(user, mediaType) {
  if (mediaType === 'audio' && (options.demo || (!options.demo && true))) {
    // await client.unsubscribe(user, mediaType);
    // remoteAudioTrack.value = null
    console.log(`[AIOT]${user.uid}离开对话通道`)
    const index = remoteUsers.value.findIndex(d => d.uid === user.uid)
    if (index !== -1) {
      remoteUsers.value.splice(index, 1)
    }
  }
}

async function handleUserStreamMessage(uid, payload) {
  const decoder = new TextDecoder('utf-8')
  const strPayload = decoder.decode(payload)
  console.info(`[AIOT]received data stream message from ${uid}: `, strPayload)
  // if (uid === AI_ROBOT_USER_ID) {
  const { uid: userId, taskid: conversationId, type: msgType, msg: text } = JSON.parse(strPayload) || {}
  const isLastWord = msgType !== 0
  if (userId === 0) {
    // 用户的话ASR转成文本，显示在最后一次的用户对话框内
    // 从conversationList里找出最后一条userId为0的记录，没有则新增一条
    const lastUserConversation = conversationList.value.findLast(item => item.userId === 0 && item.conversationId === conversationId && !item.done)
    if (lastUserConversation) {
      lastUserConversation.message = text
      if (isLastWord) {
        lastUserConversation.done = true
      }
    }
    else {
      conversationList.value.push({
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
        userId,
        message: text,
        conversationId,
      })
    }
  }
  // }
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
  remoteUsers.value = []
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

  detectInactivity(clearConnection)
})

onUnmounted(async () => {
  if (vconsole) {
    vconsole.destroy()
    vconsole = null
  }
  clearConnection()
})

// const pauseToAi = debounce(async () => {
//   if (isSpeaking.value) {
//     await localAudioTrack.value.setEnabled(false)
//     isSpeaking.value = false
//   }
//   else {
//     await localAudioTrack.value.setEnabled(true)
//     isSpeaking.value = true
//   }
//   console.log(`[AIOT]您${isSpeaking.value ? '重新开始了' : '暂停了'}对话`)
// }, 500)

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
  <div class="flex flex-col items-center justify-center">
    <div v-if="!isConnected" class="pretty-init w-full">
      <div class="mb-8 w-full flex items-center justify-end">
        <span :class="isInDarkMode ? 'text-white' : 'text-black'" class="mr-8" style="font-size: 12px;">暗夜模式</span><van-switch v-model="isInDarkMode" size="14px" aria-label="on/off Dark Mode" @click="toggle()" />
      </div>
      <div class="flex items-center justify-center pt-80">
        <van-image
          round
          width="10rem"
          height="10rem"
          :class="isConnecting ? 'shinimg shinning' : 'shinimg'"
          src="/header.png"
          @click="showVConsole"
        />
      </div>
      <div class="flex items-center justify-center pt-60" style="flex-direction: column">
        <p class="tips">
          {{ indexGuide }}
        </p>
        <van-icon name="phone-circle" :color="isConnecting ? '#0085ff' : '#2bd14c'" size="4rem" :class="isConnecting ? 'shaking' : ''" @click="callToAi" />
      </div>
    </div>
    <div v-else class="pretty-open w-full">
      <div class="mb-8 flex items-center justify-between">
        <div class="flex">
          <van-image
            round
            width="2rem"
            height="2rem"
            src="/header.png"
          />
          <span style="line-height: 2rem; padding-left: 6px">小哥AI</span>
        </div>
        <div />
        <div>
          <!-- <van-icon name="phone-circle" color="#ff6a6a" size="2rem" @click="callToAi" /> -->
        </div>
      </div>
      <!-- <van-tabs>
        <van-tab title="语音">
          <div class="audio" :class="isSpeaking ? 'speaking' : ''">
            <div class="wave" />
            <div class="wave" />
            <div class="wave" />
            <div class="wave" />
            <div class="wave" />
          </div>
        </van-tab>
        <van-tab title="字幕">
          <div class="logs">
            <van-list finished>
              <van-cell v-for="item in conversationList" :key="item.conversationId" :title="item.userId === 0 ? '您' : 'AI'" :label="item.message" />
            </van-list>
          </div>
        </van-tab>
      </van-tabs> -->

      <div class="audio" :class="isSpeaking ? 'speaking' : ''">
        <div class="wave" />
        <div class="wave" />
        <div class="wave" />
        <div class="wave" />
        <div class="wave" />
      </div>
      <div ref="logsContainerRef" class="logs">
        <van-list finished>
          <van-cell v-for="item in conversationList" :key="item.conversationId" :title="item.userId === 0 ? '您' : 'AI'" :label="item.message" />
        </van-list>
      </div>

      <!-- <p class="tips">
        <span @click="isLocalMuted = !isLocalMuted">{{ isLocalMuted ? '您已静音' : '您已开麦' }}</span> ! {{ isSpeaking ? '已连通 , 正在倾听' : '已暂停 , 点击恢复' }}
      </p> -->
      <div>
        <div class="mt-8 w-full flex items-center justify-center" style="flex-direction: column">
          <!-- <van-icon v-if="isSpeaking" color="#2bd14c" name="pause-circle" size="4rem" @click="pauseToAi" />
          <van-icon v-else name="play-circle" color="#2bd14c" size="4rem" @click="pauseToAi" /> -->

          <van-icon name="phone-circle" color="#ff6a6a" size="4rem" @click="callToAi" />
        </div>
        <p class="tips2">
          AI生成内容仅供参考，重要信息请务必核查
        </p>
      </div>
    </div>
    <audio ref="audioRing" src="/ring.mp3" loop />
    <AgoraVideoPlayer v-if="localAudioTrack" :is-local="true" :audio-track="localAudioTrack" />
    <AgoraVideoPlayer v-for="item in remoteUsers" :key="item.uid" :audio-track="item.audioTrack" />
  </div>
</template>

<style lang="less" scoped>
.audio {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  width: 60px;
  // height: 500px;
  height: 80px;
  margin: 0 auto;
  .wave {
    height: 40px;
    display: block;
    width: 10px;
    height: 6px;
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

// (32+30+80+80+18+32)
.logs {
  height: calc(100vh - 310px);
  overflow: scroll;
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
    height: 6px;
    transform: translateY(0px);
    background: #ff8e3a;
  }

  25% {
    height: 6px;
    transform: translateY(0px);
    background: #9c73f8;
  }

  50% {
    height: 30px;
    transform: translateY(-5px) scaleY(1.5);
    background: #ed509e;
  }

  75% {
    height: 6px;
    transform: translateY(0px);
    background: #9c73f8;
  }

  100% {
    height: 6px;
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
</style>

<route lang="json">
{
  "name": "index",
  "meta": {
    "title": "AI对话",
    "i18n": "menus.aicall"
  }
}
</route>
