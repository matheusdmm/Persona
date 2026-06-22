import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView             from '@/views/HomeView.vue'
import CharacterCreatorView from '@/views/CharacterCreatorView.vue'
import CharacterSheetView   from '@/views/CharacterSheetView.vue'
import SavedCharactersView  from '@/views/SavedCharactersView.vue'
import ContentLibraryView   from '@/views/ContentLibraryView.vue'
import ShareView            from '@/views/ShareView.vue'

const BASE_TITLE = 'Persona'
const BASE_DESC  = 'Free D&D 5e and 5.5e character creator. Race, class, spells, and gear — complete print-ready sheet in minutes.'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: HomeView,
    meta: {
      title: 'Persona — D&D Character Creator',
      description: BASE_DESC,
    },
  },
  {
    path: '/create',
    component: CharacterCreatorView,
    meta: {
      title: `Create a Character — ${BASE_TITLE}`,
      description: 'Build your D&D 5e or 5.5e hero step by step. Choose your race, class, ability scores, skills, spells, and equipment.',
    },
  },
  {
    path: '/sheet',
    component: CharacterSheetView,
    meta: {
      title: `Character Sheet — ${BASE_TITLE}`,
      description: 'View your complete D&D character sheet with stats, skills, spells, attacks, and equipment. Export to PDF or JSON.',
    },
  },
  {
    path: '/saved',
    component: SavedCharactersView,
    meta: {
      title: `Saved Characters — ${BASE_TITLE}`,
      description: 'Browse and manage your saved D&D characters. Load any character sheet instantly.',
    },
  },
  {
    path: '/library',
    component: ContentLibraryView,
    meta: {
      title: `Content Library — ${BASE_TITLE}`,
      description: 'Browse official D&D 5e content: backgrounds, species, classes, spells, and items from Wizards of the Coast.',
    },
  },
  {
    path: '/share',
    component: ShareView,
    meta: {
      title: `Shared Character — ${BASE_TITLE}`,
      description: 'View a shared D&D character sheet.',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  document.title = (to.meta.title as string) || BASE_TITLE

  const tag = document.querySelector('meta[name="description"]')
  if (tag) tag.setAttribute('content', (to.meta.description as string) || BASE_DESC)
})

export default router
