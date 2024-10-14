<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  videoTrack: {
    type: Object,
    default: null,
  },
  audioTrack: {
    type: Object,
    default: null,
  },
  config: {
    type: Object,
    default: () => ({}),
  },
  isSpeaking: {
    type: Boolean,
    default: false,
  },
  isLocal: {
    type: Boolean,
    default: false,
  },
  text: {
    type: [String, Number],
    default: '',
  },
  width: {
    type: String,
    default: '0px',
  },
  height: {
    type: String,
    default: '0px',
  },
  style: {
    type: Object,
    default: () => ({}),
  },
})
// const emit = defineEmits(['click'])

const videoRef = ref()

const { videoTrack, audioTrack, config, isLocal } = props

onMounted(() => {
  videoTrack?.play(videoRef.value, config)
  if (!isLocal) {
    audioTrack?.play()
  }
})

watch(() => props.videoTrack, (track) => {
  if (track && videoRef.value) {
    track.play(videoRef.value)
  }
})

watch(() => props.audioTrack, (track) => {
  if (!isLocal) {
    track?.play()
  }
})

onUnmounted(() => {
  videoTrack?.close()
  audioTrack?.close()
})
</script>

<template>
  <div :style="style">
    <div ref="videoRef" :style="{ width, height }" />
  </div>
</template>
