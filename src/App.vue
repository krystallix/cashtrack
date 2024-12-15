<script setup lang="ts">
import { Toaster } from '@/components/ui/toast'
import { onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import Spinner from '@/components/ui/spinner/Spinner.vue';
const authStore = useAuthStore();

onMounted(() => {
    authStore.checkExpiry();
});

</script>

<template>
    <div>
        <Toaster />
        <Spinner />
        <router-view></router-view>
    </div>
</template>

<style scoped></style>
