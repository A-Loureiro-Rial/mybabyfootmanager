<script setup>
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import { darkTheme } from 'naive-ui';
import Header from './components/Header.vue';
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
