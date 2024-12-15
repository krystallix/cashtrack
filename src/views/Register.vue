<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { useRouter } from 'vue-router'; // Impor useRouter
import { useToast } from '@/components/ui/toast/use-toast'
import eventBus from '@/event-bus';
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const router = useRouter(); // Inisialisasi router
const { toast } = useToast()

const handleRegister = async () => {
  // Validasi password
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }
  
  try {
    eventBus.emit('loading-state', true);
    const response = await axios.post('https://api.heiji.fun/api/register', {
      username: username.value,
      email: email.value,
      password: password.value,
    });

    // Logika pendaftaran berhasil
    // console.log('Registration successful', response.data);
    toast({
        title: 'Register Success',
        variant: 'success',
        description: 'Please login to continue',
      });
    console.log(response.data)
    // Menambahkan timeout sebelum redirect ke halaman login
    setTimeout(() => {
      router.push('/');
    }, 2000); // Menunggu 2 detik sebelum redirect
  } catch (error: any) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || 'Registration failed';
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
          <h1 class="text-3xl font-bold">Register</h1>
          <p class="text-balance text-muted-foreground">
            Enter your details below to create an account
          </p>
          <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
        </div>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Your username"
              required
              v-model="username"
            />
          </div>
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
            </div>
            <Input
              id="password"
              type="password"
              required
              v-model="password"
            />
          </div>
          <div class="grid gap-2">
            <Label for="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              required
              v-model="confirmPassword"
            />
          </div>
          <Button type="button" class="w-full" @click="handleRegister">
            Register
          </Button>
          <Button variant="outline" class="w-full">
            Register with Google
          </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          Already have an account?
          <router-link to="/login" class="underline">Sign in</router-link>
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
