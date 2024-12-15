<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { RouterLink } from 'vue-router'
import { computed } from 'vue'

const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes['class']; to?: string }>(), {
  as: 'a',
})

// Tentukan apakah komponen ini harus menjadi RouterLink
const isRouterLink = props.as === 'router-link'

// Menghitung nilai to yang aman
const safeTo = computed(() => props.to ?? '')
</script>

<template>
  <Primitive
    v-if="!isRouterLink"
    :as="as"
    :as-child="asChild"
    :class="cn('transition-colors hover:text-foreground', props.class)"
  >
    <slot />
  </Primitive>
  <RouterLink
    v-else
    :to="safeTo"
    :class="cn('transition-colors hover:text-foreground', props.class)"
  >
    <slot />
  </RouterLink>
</template>
