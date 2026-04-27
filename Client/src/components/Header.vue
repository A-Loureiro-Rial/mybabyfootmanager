<script setup>
import { RouterLink } from 'vue-router';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import babyfoot from '@/assets/babyfoot.png';
import UserSection from './UserSection.vue';
import { useAuth } from '@/composables/useAuth';

const auth = useAuth();
const route = useRoute();
const router = useRouter();

const breadcrumbs = computed(() => {
    return route.matched
        .filter((r) => r.meta && r.meta.title) // only routes with a title
        .map((r) => ({
            name: r.meta.title,
            path: r.path,
        }));
});

function handleClick(path) {
    router.push(path);
}
</script>

<template>
    <n-page-header
        class="header"
        subtitle="Parce que les seules roulettes qui tournent, c'est celles dans notre tête!"
    >
        <template #title>
            <router-link to="/">My Babyfoot Manager</router-link>
        </template>
        <template #header>
            <n-breadcrumb classname="routeList">
                <n-breadcrumb-item
                    v-for="(item, index) in breadcrumbs"
                    :key="index"
                    @click="handleClick(item.path)"
                    style="cursor: pointer"
                >
                    {{ item.name }}
                </n-breadcrumb-item>
            </n-breadcrumb>
        </template>
        <template #avatar>
            <n-avatar size="large" class="avatar" :src="babyfoot" />
        </template>
        <template #extra>
            <n-space class="authSection">
                <UserSection />
            </n-space>
        </template>
    </n-page-header>
</template>

<style scoped>
.header {
    width: 100%;
    margin-bottom: 2%;
}

.avatar {
    background-color: transparent;
}

.authSection {
    margin-left: 10px;
}
</style>
