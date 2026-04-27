<script setup>
import { useAuth } from '@/composables/useAuth';

const auth = useAuth();

import Carousel from '@/components/Carousel.vue';

const data = [
    { title: 'Tournois', info: 'tournament' },
    { title: 'Equipes', info: 'team' },
];
</script>

<template>
    <div v-for="value in data">
        <Suspense>
            <template #default>
                <Carousel :data="{ value }" />
            </template>

            <template #fallback>
                <div>Chargement...</div>
            </template>
        </Suspense>
    </div>
</template>

<style scoped></style>
