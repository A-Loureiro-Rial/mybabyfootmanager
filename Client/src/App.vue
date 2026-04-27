<script setup>
import { RouterView } from 'vue-router';
import { darkTheme } from 'naive-ui';
import Header from './components/Header.vue';
import { onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = useAuth();

onMounted(() => {
    if (auth.getToken()) {
        auth.me();
        auth.refresh();
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
                <RouterView />
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
