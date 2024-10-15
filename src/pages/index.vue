<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { createClient } from 'agora-rtc-sdk-ng/esm'
import VConsole from 'vconsole'
import { debounce } from 'lodash-es'

const AI_ROBOT_USER_ID = 10000
const options = {
  demo: false,
  appId: '895b97676546405f9077c5e1089a9c53',
  channel: uuidv4(),
  token: null,
  uid: null,
}

let client = null
let vconsole = null

const isConnecting = ref(false)
const isConnected = ref(false)
const isSpeaking = ref(false)
const localAudioTrack = ref()
const remoteAudioTrack = ref()
const remoteUserId = ref(`${AI_ROBOT_USER_ID}`)

const conversationList = ref([
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
])

async function handleUserPublished(user, mediaType) {
  // 发起订阅远端用户对象的音频轨道(10000 是我们的AI机器人)，其它用户的不管
  await client.subscribe(user, mediaType)
  if (mediaType === 'audio' && (options.demo || (!options.demo && user.uid === AI_ROBOT_USER_ID))) {
    // 自动播放音频
    conversationList.value.unshift(`[系统]${user.uid}进入对话通道`)
    remoteUserId.value = user.uid
    remoteAudioTrack.value = user.audioTrack
    remoteAudioTrack.value.play()
  }
}

async function handleUserUnpublished(user, mediaType) {
  if (mediaType === 'audio' && (options.demo || (!options.demo && user.uid === AI_ROBOT_USER_ID))) {
    // await client.unsubscribe(user, mediaType);
    remoteAudioTrack.value = null
  }
}

async function leave() {
  isConnected.value = false
  if (localAudioTrack.value) {
    localAudioTrack.value.close()
    localAudioTrack.value = null
  }
  // await client.unpublish()
  await client.leave()
  conversationList.value = []
}

onMounted(() => {
  vconsole = new VConsole()
  // 如果页面url参数带上了from=aiot
  if (location.search.includes('from=aiot')) {
    options.demo = true
    options.channel = 'aiot'
    // 弹出prompt，获取输入后，赋值给token
    // eslint-disable-next-line no-alert
    options.token = window.prompt('请输入临时对话token', '007eJxTYIjRP+X/M9FPUVrs68FHKX1sS16WCmq9VFRdOntX+XaesL0KDBaWpkmW5mbmZqYmZiYGpmmWBubmyaaphgYWlomWyabGXBa86Q2BjAzd+/4zMjJAIIjPwpCYmV/CwAAAw28dPg==')
  }
  client = createClient({
    mode: 'rtc',
    codec: 'vp8',
  })
  // Add event listeners to the client.
  client.on('user-published', handleUserPublished)
  client.on('user-unpublished', handleUserUnpublished)
})

onUnmounted(async () => {
  if (vconsole) {
    vconsole.destroy()
  }
  leave()
})

const callToAi = debounce(async () => {
  if (isConnected.value) {
    leave()
  }
  else {
    isConnecting.value = true
    // 动态获取token
    if (!options.token) {
      // options.token = await fetch('https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=YOUR_API_KEY&client_secret=YOUR_SECRET_KEY')
      //   .then(res => res.json())
      //   .then(res => res.access_token)
    }

    if (options.token) {
      // try {
      //   options.uid = await client.join(options.appId, options.channel, options.token, options.uid)
      //   if (options.uid) {
      //     // 成功加入频道后再推送本地音轨
      //     localAudioTrack.value = await createMicrophoneAudioTrack()
      //     await client.publish([localAudioTrack.value])
      //     isConnected.value = true
      //   }
      //   isConnecting.value = false
      // }
      // catch (error) {
      //   isConnecting.value = false
      //   showNotify({ type: 'warning', message: `连接异常，原因：${error.message}` })
      // }
      isConnecting.value = false
      isConnected.value = true
      isSpeaking.value = true
    }
    else {
      isConnecting.value = false
      showNotify({ type: 'warning', message: `获取鉴权身份异常，请点击重试。` })
    }
  }
}, 500)
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div v-if="!isConnected">
      <div class="flex items-center justify-center pt-80">
        <van-image
          round
          width="10rem"
          height="10rem"
          src="/head.jpeg"
        />
      </div>
      <div class="flex items-center justify-center pt-60">
        <van-icon name="phone-circle" :color="isConnecting ? '#0085ff' : '#2bd14c'" size="4rem" @click="callToAi" />
      </div>
    </div>
    <div v-else class="w-full">
      <div class="mb-8 flex items-center justify-between">
        <div class="flex">
          <van-image
            round
            width="2rem"
            height="2rem"
            src="/head.jpeg"
          />
          <span style="line-height: 2rem; padding-left: 6px">{{ remoteUserId }}</span>
        </div>
        <div>
          <van-icon name="phone-circle" color="#ff6a6a" size="2rem" @click="callToAi" />
        </div>
      </div>
      <van-tabs>
        <van-tab title="语音">
          <div class="audio" :class="isSpeaking ? 'speaking' : ''">
            <div class="wave" />
            <div class="wave" />
            <div class="wave" />
            <div class="wave" />
            <div class="wave" />
          </div>
        </van-tab>
        <van-tab title="文字">
          <div class="logs">
            <van-list finished>
              <van-cell v-for="item in conversationList" :key="item" :title="item" />
            </van-list>
          </div>
        </van-tab>
      </van-tabs>

      <AgoraVideoPlayer :is-local="true" :audio-track="localAudioTrack" />
      <AgoraVideoPlayer v-if="remoteAudioTrack" :audio-track="remoteAudioTrack" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.audio {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  width: 60px;
  height: 500px;
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
