<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router'; // Impor useRouter
import { useToast } from '@/components/ui/toast/use-toast';
import eventBus from '@/event-bus';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter(); // Inisialisasi router
const { toast } = useToast()

const handleLogin = async () => {
  try {
    eventBus.emit('loading-state', true);
    const response = await axios.post('https://api.heiji.fun/api/login', {
      email: email.value,
      password: password.value,
    });

    // Log response untuk debug
    // console.log("Response data:", response.data); 

    // Memastikan bahwa response.data memiliki username dan token
    if (response.data && response.data.username && response.data.token) {
      const store = useAuthStore();
      // Panggil action login dengan data yang sesuai
      store.login({ username: response.data.username, email: response.data.email }, response.data.token);
      toast({
        title: 'login Success',
        variant: 'success',
        description: 'Successfully logged in',
      });
    
    // Menambahkan timeout sebelum redirect ke halaman login
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000); 
    } else {
      errorMessage.value = 'Invalid response from server. Please check the data structure.';
    }
  } catch (error: any) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || 'Login failed';
    } else {
      errorMessage.value = 'An error occurred. Please try again.';
    }
  } finally {
    eventBus.emit('loading-state', false);
  }
};

</script>

<template>
  <div class="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">Login</h1>
          <p class="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
          <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
        </div>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              v-model="email"
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <a href="/forgot-password" class="ml-auto inline-block text-sm underline">
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              required
              v-model="password"
            />
          </div>
          <Button type="button" class="w-full" @click="handleLogin">
            Login
          </Button>
          <Button variant="outline" class="w-full">
            Login with Google
          </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <router-link to="/register" class="underline">Sign up</router-link>
        </div>
      </div>
    </div>
    <div class="hidden bg-muted lg:block">
      <img
        src="@/assets/img/loginpage_img.png"
        alt="Image"
        width="1920"
        height="1080"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      >
    </div>
  </div>
</template>
