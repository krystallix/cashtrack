<script setup lang=ts>
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  AudioWaveform,
  Blocks,
  Hash,
  LifeBuoy,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Banknote,
  Settings2,
  Sparkles,
  ClipboardList,
} from 'lucide-vue-next'
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './store/auth'
const route = useRoute();
const router = useRouter();
const handleLogout = () => {
  useAuthStore().logout();
  
  // Redirect ke halaman login setelah logout
  router.push('');
};
// This is sample data.
const data = {
  user: {
    name: useAuthStore().username,
    email: useAuthStore().email,
    avatar: '/src/assets/img/avatars/default.jpg',
  },
  // teams: [
  //   {
  //     name: 'Acme Inc',
  //     logo: GalleryVerticalEnd,
  //     plan: 'Enterprise',
  //   },
  // ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Blocks,
      isActive: true,
      items: [
        {
          title: 'Overview',
          url: '/dashboard',
        },
        {
          title: 'Statistics',
          url: '/dashboard/statistics',
        },
      ],
    },
    {
      title: 'Expense',
      url: '/dashboard/expense',
      icon: ClipboardList, // Ikon untuk Categorization
    },
    {
      title: 'Category',
      url: '/dashboard/category',
      icon: Hash, // Ikon untuk Categorization
    },
    {
      title: 'Budgeting',
      url: '/dashboard/budgeting',
      icon: Banknote, // Ikon untuk Budgeting
    },
  ],

  ControlCenter: [
    {
      title: 'Settings',
      url: '/dashboard/settings/',
      icon: Settings2,
    },
    {
      title: 'Help',
      url: '#',
      icon: LifeBuoy,
      isActive: false, // Ikon untuk Help
      items: [
        {
          title: 'User Guide',
          url: '/dashboard/help',
        },
        {
          title: 'Contact Support',
          url: '/dashboard/help/contact-support',
        },
      ],
    },
  ],
}

const breadcrumbs = computed(() =>
  route.path
    .split('/')
    .filter(Boolean)
    .map((segment, index, segments) => ({
      path: `/${segments.slice(0, index + 1).join('/')}`,
      label: segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    }))
);

const isActive = (path: string) => route.path === path;


</script>
<template>
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-white">
                <AudioWaveform class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">CashTrack</span>
                <span class="truncate text-xs">Stay on track!</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            <template v-for="item in data.navMain" :key="item.title">
              <div v-if="item.items && item.items.length">
                <Collapsible :default-open="isActive(item.url)" class="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger as-child>
                      <SidebarMenuButton :class="{ 'bg-sidebar-active': isActive(item.url) }" tooltip="item.title">
                        <component :is="item.icon" />
                        <span>{{ item.title }}</span>
                        <ChevronRight
                          class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                          <SidebarMenuSubButton as-child :class="{ 'bg-sidebar-active': isActive(subItem.url) }">
                            <router-link :to="subItem.url">
                              <span>{{ subItem.title }}</span>
                            </router-link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </div>
              <div v-else>
                <SidebarMenuItem>
                  <SidebarMenuButton as-child :class="{ 'bg-sidebar-active': isActive(item.url) }">
                    <router-link :to="item.url">
                      <component :is="item.icon" />
                      <span>{{ item.title }}</span>
                    </router-link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </template>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup class="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Control Center</SidebarGroupLabel>
          <SidebarMenu>
            <template v-for="item in data.ControlCenter" :key="item.title">
              <div v-if="item.items && item.items.length">
                <Collapsible :default-open="isActive(item.url)" class="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger as-child>
                      <SidebarMenuButton :class="{ 'bg-sidebar-active': isActive(item.url) }" tooltip="item.title">
                        <component :is="item.icon" />
                        <span>{{ item.title }}</span>
                        <ChevronRight
                          class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                          <SidebarMenuSubButton as-child :class="{ 'bg-sidebar-active': isActive(subItem.url) }">
                            <router-link :to="subItem.url">
                              <span>{{ subItem.title }}</span>
                            </router-link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </div>
              <div v-else>
                <SidebarMenuItem>
                  <SidebarMenuButton as-child :class="{ 'bg-sidebar-active': isActive(item.url) }">
                    <router-link :to="item.url">
                      <component :is="item.icon" />
                      <span>{{ item.title }}</span>
                    </router-link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </template>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarImage :src="data.user.avatar" :alt="data.user.name" />
                    <AvatarFallback class="rounded-lg">
                      CN
                    </AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ data.user.name }}</span>
                    <span class="truncate text-xs">{{ data.user.email }}</span>
                  </div>
                  <ChevronsUpDown class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="bottom"
                align="end" :side-offset="4">
                <DropdownMenuLabel class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage :src="data.user.avatar" :alt="data.user.name" />
                      <AvatarFallback class="rounded-lg">
                        CN
                      </AvatarFallback>
                    </Avatar>
                    <div class="grid">
                      <span class="truncate font-semibold leading-none">{{ data.user.name }}</span>
                      <span class="truncate text-xs text-muted-foreground">{{ data.user.email }}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <CreditCard class="size-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings2 class="size-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Sparkles class="size-4" />
                    <span>New Feature</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="handleLogout">
                  <LogOut class="size-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
                <BreadcrumbItem>
                  <BreadcrumbLink v-if="index < breadcrumbs.length - 1" :as="'router-link'" :to="breadcrumb.path">
                    {{ breadcrumb.label }}
                  </BreadcrumbLink>
                  <BreadcrumbPage v-else>{{ breadcrumb.label }}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
              </template>
            </BreadcrumbList>
          </Breadcrumb>

        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <router-view> </router-view>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>


<style scoped>
.bg-sidebar-active {
  background-color: hsl(var(--sidebar-accent));
}
</style>
