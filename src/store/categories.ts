// stores/categoryStore.ts
import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import axios from 'axios'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<any[]>([])

  // Fungsi untuk mengambil kategori dari API
  const getCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('https://api.heiji.fun/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      categories.value = response.data
    } catch (error) {
      console.error('Gagal mengambil kategori:', error)
      categories.value = []
    }
  }

  onMounted(async () => {
    await getCategories()
  })

  return {
    categories,
    getCategories,
  }
})
