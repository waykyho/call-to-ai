<!-- eslint-disable no-console -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { createClient, createMicrophoneAudioTrack } from 'agora-rtc-sdk-ng/esm'

const AI_ROBOT_USER_ID = 10000
const options = {
  demo: false,
  appId: '895b97676546405f9077c5e1089a9c53',
  channel: uuidv4(),
  token: null,
  uid: null,
}

let client = null

const isConnected = ref(false)
const localAudioTrack = ref()
const remoteAudioTrack = ref()
const remoteUserId = ref(`${AI_ROBOT_USER_ID}`)

const isRemoteSpeaking = computed(() => {
  if (remoteAudioTrack.value) {
    return remoteAudioTrack.value.isPlaying
  }
  return false
})

async function handleUserPublished(user, mediaType) {
  // 发起订阅远端用户对象的音频轨道(10000 是我们的AI机器人)，其它用户的不管
  await client.subscribe(user, mediaType)
  if (mediaType === 'audio' && (options.demo || (!options.demo && user.uid === AI_ROBOT_USER_ID))) {
    // 自动播放音频
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
  if (isConnected.value) {
    isConnected.value = false
  }
  if (localAudioTrack.value) {
    localAudioTrack.value.close()
    localAudioTrack.value = null
  }
  await client.unpublish()
  await client.leave()
}

onMounted(() => {
  // 如果页面url参数带上了from=aiot
  if (location.search.includes('from=aiot')) {
    options.demo = true
    options.channel = 'aiot'
    // 弹出prompt，获取输入后，赋值给token
    // eslint-disable-next-line no-alert
    options.token = window.prompt('请输入临时对话token', '')
  }
  // channel和token每次都从服务端获取，不缓存
  // let lastChannel = localStorage.getItem('channel')
  // let localToken = localStorage.getItem('token')
  // if (!lastChannel) {
  //   lastChannel = uuidv4()
  //   // 需重新生成token
  //   localToken = null
  // }

  // if (localToken) {
  //   let tokenObj = null
  //   try {
  //     tokenObj = JSON.parse(localToken)
  //   }
  //   catch (err) {
  //     console.log(err)
  //   }

  //   if (tokenObj) {
  //     // 检查是否过期
  //     if (new Date().getTime() > tokenObj.expires_in) {
  //       localStorage.removeItem('token')
  //       return
  //     }
  //     options.token = tokenObj.token
  //   }
  // }

  client = createClient({
    mode: 'rtc',
    codec: 'vp8',
  })
  // Add event listeners to the client.
  client.on('user-published', handleUserPublished)
  client.on('user-unpublished', handleUserUnpublished)
})

onUnmounted(async () => {
  leave()
})

async function callToAi() {
  if (isConnected.value) {
    leave()
  }
  else {
    // 动态获取token
    if (!options.token) {
      // options.token = await fetch('https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=YOUR_API_KEY&client_secret=YOUR_SECRET_KEY')
      //   .then(res => res.json())
      //   .then(res => res.access_token)
      // temp token for test
      options.token = '007eJxTYHhxvufjAWd9j7hVCbubj2RpxLB+Wnxu7gPnrQXM3MX8SX0KDBaWpkmW5mbmZqYmZiYGpmmWBubmyaaphgYWlomWyabGt3S40hsCGRne8YQwMzJAIIjPwpCYmV/CwAAAMugd+Q=='
      // localStorage.setItem('token', JSON.stringify({
      //   token: options.token,
      //   expires_in: new Date().getTime() + 3600 * 1000,
      // }))
    }

    try {
      options.uid = await client.join(options.appId, options.channel, options.token, options.uid)
      if (options.uid) {
        // 成功加入频道后再推送本地音轨
        localAudioTrack.value = await createMicrophoneAudioTrack()
        await client.publish([localAudioTrack.value])
        isConnected.value = true
      }
    }
    catch (error) {
      showNotify({ type: 'warning', message: `连接异常，原因：${error.message}` })
    }
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div v-if="!isConnected" class="flex items-center justify-center pt-80">
      <van-image
        round
        width="10rem"
        height="10rem"
        src="https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/web/static/image/logo-icon-white-bg.f3acc228.png"
      />
    </div>
    <div v-else class="w-full">
      <div>
        <van-image
          round
          width="2rem"
          height="2rem"
          src="https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/web/static/image/logo-icon-white-bg.f3acc228.png"
        />
      </div>
      <AgoraVideoPlayer :is-local="true" :audio-track="localAudioTrack" />
      <AgoraVideoPlayer
        v-if="remoteAudioTrack"
        :text="remoteUserId"
        :audio-track="remoteAudioTrack"
        :is-speaking="isRemoteSpeaking"
      />
    </div>
    <div class="flex items-center justify-center pt-60">
      <van-icon name="phone-circle" :color="isConnected ? '#ff6a6a' : '#2bd14c'" size="4rem" @click="callToAi" />
    </div>
  </div>
</template>

<route lang="json">
{
  "name": "index",
  "meta": {
    "title": "AI对话",
    "i18n": "menus.aicall"
  }
}
</route>
