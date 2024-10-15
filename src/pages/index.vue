<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { createClient, createMicrophoneAudioTrack } from 'agora-rtc-sdk-ng/esm'
import VConsole from 'vconsole'
import { debounce } from 'lodash-es'
import useAppStore from '@/stores/modules/app'

const appStore = useAppStore()
const isInDarkMode = ref<boolean>(isDark.value)

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
const localAudioTrack = ref(null)
// const remoteAudioTrack = ref(null)
const remoteUserId = ref(`${AI_ROBOT_USER_ID}`)

const remoteUsers = ref<{ uid: string, audioTrack: any }[]>([])
const conversationList = ref([])

async function handleUserPublished(user, mediaType) {
  // 发起订阅远端用户对象的音频轨道(10000 是我们的AI机器人)，其它用户的不管
  await client.subscribe(user, mediaType)
  if (mediaType === 'audio' && (options.demo || (!options.demo && user.uid === AI_ROBOT_USER_ID))) {
    // 自动播放音频
    conversationList.value.push({
      role: '系统',
      text: `${user.uid}进入对话通道`,
    })
    remoteUsers.value.push({
      uid: user.uid,
      audioTrack: user.audioTrack,
    })
  }
}

async function handleUserUnpublished(user, mediaType) {
  if (mediaType === 'audio' && (options.demo || (!options.demo && user.uid === AI_ROBOT_USER_ID))) {
    // await client.unsubscribe(user, mediaType);
    // remoteAudioTrack.value = null
    conversationList.value.push({
      role: '系统',
      text: `${user.uid}离开对话通道`,
    })
    const index = remoteUsers.value.findIndex(d => d.uid === user.uid)
    if (index !== -1) {
      remoteUsers.value.splice(index, 1)
    }
  }
}

watch(
  () => isDark.value,
  (newMode) => {
    isInDarkMode.value = newMode
  },
  { immediate: true },
)

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
  await client.leave()
  conversationList.value = []
}

onMounted(() => {
  vconsole = new VConsole()
  // 如果页面url参数带上了from=aiot
  if (location.search.includes('from=aiot')) {
    options.demo = true
    options.channel = 'aiot'
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

const pauseToAi = debounce(async () => {
  if (isSpeaking.value) {
    isSpeaking.value = false
  }
  else {
    isSpeaking.value = true
  }
  conversationList.value.push({
    role: '系统',
    text: `您${isSpeaking.value ? '重新开始了' : '暂停了'}对话`,
  })
}, 500)

const callToAi = debounce(async () => {
  if (isConnected.value) {
    leave()
  }
  else {
    isConnecting.value = true
    isSpeaking.value = false
    // 动态获取token
    if (!options.token) {
      try {
        options.token = await fetch(`https://v-downloads.obs.cn-south-1.myhuaweicloud.com/aiot-temp-token.json?t=${new Date().getTime()}`)
          .then(res => res.json())
          .then(res => res.token)
      }
      catch {
        isConnecting.value = false
        showNotify({ type: 'warning', message: `获取鉴权身份异常，请点击重试。` })
        return
      }
    }
    if (options.token) {
      try {
        options.uid = await client.join(options.appId, options.channel, options.token, options.uid)
        if (options.uid) {
          // 成功加入频道后再推送本地音轨
          localAudioTrack.value = await createMicrophoneAudioTrack()
          await client.publish([localAudioTrack.value])
          isConnected.value = true
          isSpeaking.value = true
          conversationList.value.push({
            role: '系统',
            text: `您成功进入对话通道`,
          })
        }
      }
      catch (error) {
        showNotify({ type: 'warning', message: `连接异常，原因：${error.message}` })
      }
      finally {
        isConnecting.value = false
      }
    }
  }
}, 500)
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
          src="https://v-downloads.obs.cn-south-1.myhuaweicloud.com/head.jpeg"
        />
      </div>
      <div class="flex items-center justify-center pt-60" style="flex-direction: column">
        <p class="tips">
          点击与小哥AI通话
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
            src="https://v-downloads.obs.cn-south-1.myhuaweicloud.com/head.jpeg"
          />
          <span style="line-height: 2rem; padding-left: 6px">{{ remoteUserId }}</span>
        </div>
        <div />
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
        <van-tab title="字幕">
          <div class="logs">
            <van-list finished>
              <van-cell v-for="item in conversationList" :key="item" :title="item.role" :label="item.text" />
            </van-list>
          </div>
        </van-tab>
      </van-tabs>
      <p class="tips">
        {{ isSpeaking ? '播放中 , 正在倾听' : '已暂停 , 点击恢复' }}
      </p>
      <div class="mt-8 w-full flex items-center justify-center" style="flex-direction: column">
        <van-icon v-if="isSpeaking" color="#2bd14c" name="pause-circle" size="4rem" @click="pauseToAi" />
        <van-icon v-else name="play-circle" color="#2bd14c" size="4rem" @click="pauseToAi" />
      </div>
      <p class="tips2">
        AI生成内容仅供参考，重要信息请务必核查
      </p>
    </div>
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
  height: 500px;
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
