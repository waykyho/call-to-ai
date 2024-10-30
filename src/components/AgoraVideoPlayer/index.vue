<script setup>
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  audioTrack: {
    type: Object,
    default: null,
  },
  isLocal: {
    type: Boolean,
    default: false,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
})

const { audioTrack, isLocal, showIcon } = props

const isPlaying = ref(false)
onMounted(() => {
  if (!isLocal) {
    audioTrack?.play()
    isPlaying.value = true
  }
})

watch(() => props.audioTrack, (track) => {
  if (!isLocal) {
    track?.play()
    isPlaying.value = true
  }
})

function toggerPlay() {
  if (audioTrack?.isPlaying) {
    audioTrack?.stop()
  }
  else {
    audioTrack?.play()
  }
  isPlaying.value = !isPlaying.value
}

onUnmounted(() => {
  audioTrack?.close()
})
</script>

<template>
  <div>
    <div v-if="showIcon" @click="toggerPlay">
      <van-icon v-if="isPlaying" name="volume-o" />
      <van-icon v-else name="bullhorn-o" />
    </div>
  </div>
</template>
