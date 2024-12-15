<template>
  <div class="sk-cube-overlay" v-if="isLoading">
    <div class="sk-cube-grid">
      <div class="sk-cube sk-cube1"></div>
      <div class="sk-cube sk-cube2"></div>
      <div class="sk-cube sk-cube3"></div>
      <div class="sk-cube sk-cube4"></div>
      <div class="sk-cube sk-cube5"></div>
      <div class="sk-cube sk-cube6"></div>
      <div class="sk-cube sk-cube7"></div>
      <div class="sk-cube sk-cube8"></div>
      <div class="sk-cube sk-cube9"></div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import eventBus from '@/event-bus';

const isLoading = ref(false);

const updateLoadingState = (state: boolean) => {
  isLoading.value = state;
};

onMounted(() => {
  eventBus.on('loading-state', updateLoadingState);
});

onUnmounted(() => {
  eventBus.off('loading-state', updateLoadingState);
});
</script>

<style scoped>
.sk-cube-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1); /* Warna hitam dengan opacity 10% */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Z-index tinggi untuk menutupi konten lain */
}

.sk-cube-grid {
  width: 50px;
  height: 50px;
}

.sk-cube {
  width: 33%;
  height: 33%;
  background-color: #333;
  float: left;
  animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
}

.sk-cube1 { animation-delay: 0.2s; }
.sk-cube2 { animation-delay: 0.3s; }
.sk-cube3 { animation-delay: 0.4s; }
.sk-cube4 { animation-delay: 0.1s; }
.sk-cube5 { animation-delay: 0.2s; }
.sk-cube6 { animation-delay: 0.3s; }
.sk-cube7 { animation-delay: 0s; }
.sk-cube8 { animation-delay: 0.1s; }
.sk-cube9 { animation-delay: 0.2s; }

@keyframes sk-cubeGridScaleDelay {
  0%, 70%, 100% {
    transform: scale3D(1, 1, 1);
  }
  35% {
    transform: scale3D(0, 0, 1);
  }
}

</style>
