<script setup>
import { onMounted } from 'vue';
import Carousel from '@/components/Carousel.vue';
import AdminOptions from '@/components/AdminOptions.vue';
import { role } from '@/composables/useAuth';
import { getTeams } from '@/composables/useTeam';
import { getTournaments } from '@/composables/useTournament';

onMounted(async () => {
    await getTeams();
    await getTournaments();
});
const data = [
    { title: 'Tournois', info: 'tournament' },
    { title: 'Equipes', info: 'team' },
];
</script>

<template>
    <n-space style="height: 100%; width: 100%" vertical justify="space-around">
        <!--for each row in data, load a carousel (or a wheel while the component is loading)-->
        <div v-for="value in data" :key="value.info">
            <Suspense>
                <template #default>
                    <Carousel :data="value" />
                </template>

                <template #fallback>
                    <n-spin size="large" />
                </template>
            </Suspense>
        </div>
        <!--if the user is an admin, load admin options-->
        <div v-if="role === 'admin'">
            <AdminOptions />
        </div>
    </n-space>
</template>
