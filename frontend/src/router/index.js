import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CharacterCreatorView from '@/views/CharacterCreatorView.vue'
import CharacterSheetView from '@/views/CharacterSheetView.vue'
import SavedCharactersView from '@/views/SavedCharactersView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/create', component: CharacterCreatorView },
    { path: '/sheet', component: CharacterSheetView },
    { path: '/saved', component: SavedCharactersView },
  ]
})
