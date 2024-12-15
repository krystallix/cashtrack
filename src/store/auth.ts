import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    username: JSON.parse(localStorage.getItem('user') as string)?.username || null,
    email: JSON.parse(localStorage.getItem('user') as string)?.email || null,
    isAuthenticated: Boolean(localStorage.getItem('token')),
  }),

  actions: {
    // Action untuk login, menyimpan token, username, dan email ke localStorage
    login(userData: { username: string; email: string }, token: string) {
      this.username = userData.username;
      this.email = userData.email;
      this.isAuthenticated = true;
      
      // Simpan data ke localStorage
      const expiry = Date.now() + 24 * 60 * 60 * 1000; // 1 hari dari sekarang
      localStorage.setItem('user', JSON.stringify(userData)); // Simpan username dan email
      localStorage.setItem('token', token);
      localStorage.setItem('expiry', expiry.toString());
    },
    
    // Action untuk logout, menghapus data dari localStorage
    logout() {
      this.username = null;
      this.email = null;
      this.isAuthenticated = false;

      // Hapus data dari localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('expiry');
    },

    // Method untuk mengecek apakah sesi kadaluarsa
    checkExpiry() {
      const expiry = localStorage.getItem('expiry');
      if (expiry && Date.now() > parseInt(expiry)) {
        this.logout();
      }
    },
  },
});

// Di komponen utama, panggil checkExpiry() saat aplikasi dimuat
