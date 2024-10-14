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
const emit = defineEmits(['click'])

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
    <div v-if="text" :style="{ marginTop: '10px', marginBottom: '10px' }">
      远程用户ID：{{ text }}
    </div>
    <div ref="videoRef" :style="{ width, height }" />
    <div class="sp-container">
      <div v-if="isSpeaking" class="speaking" />
      <div v-else class="waiting" />
    </div>
  </div>
</template>

<style scoped>
.sp-container {
  position: relative;
  width: 100%;
  height: 120px; /* 波浪线的高度 */
  overflow: hidden;
}

@keyframes wave-move {
  0% {
    background-position-x: 0;
  }
  100% {
    background-position-x: 100%;
  }
}

.speaking {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"%3E%3Cpath fill="%230099ff" fill-opacity="1" d="M0%2C128L48%2C149.3C96%2C171%2C192%2C213%2C288%2C229.3C384%2C245%2C480%2C235%2C576%2C218.7C672%2C203%2C768%2C181%2C864%2C192C960%2C203%2C1056%2C245%2C1152%2C256C1248%2C267%2C1344%2C245%2C1392%2C234.7L1440%2C224L1440%2C320L1392%2C320C1344%2C320%2C1248%2C320%2C1152%2C320C1056%2C320%2C960%2C320%2C864%2C320C768%2C320%2C672%2C320%2C576%2C320C480%2C320%2C384%2C320%2C288%2C320C192%2C320%2C96%2C320%2C48%2C320L0%2C320Z"%3E%3C/path%3E%3C/svg%3E');
  background-size: cover;
  animation: wave-move 3s linear infinite;
}

.waiting {
  position: absolute;
  width: 80%;
  height: 100%;
  margin-top: 80px;
  background-color: #349eff;
}
</style>
