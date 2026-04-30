<script setup>
import { RouterView } from 'vue-router';
import { darkTheme } from 'naive-ui';
import Header from './components/Header.vue';
import { onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';

const auth = useAuth();

onMounted(async () => {
    if (auth.getToken()) {
        await auth.refresh();
        await auth.me();
    }
});
</script>

<template>
    <n-config-provider :theme="darkTheme">
        <n-message-provider>
            <n-loading-bar-provider>
                <div class="main">
                    <Header />
                </div>
                <RouterView class="page-content" />
            </n-loading-bar-provider>
        </n-message-provider>
    </n-config-provider>
</template>

<style scoped>
.main {
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    display: flex;
    min-width: 100%;
}
</style>
