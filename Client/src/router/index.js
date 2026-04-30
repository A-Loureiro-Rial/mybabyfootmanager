import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import Profile from '@/views/Profile.vue';
import TournamentInfos from '@/views/TournamentInfos.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
        },
        {
            path: '/tournament/:id',
            name: 'tournament',
            component: TournamentInfos,
        },
    ],
});

export default router;
