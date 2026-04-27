<script setup>
import { useMessage } from 'naive-ui';
import { useFetch } from '@vueuse/core';
import { ref } from 'vue';
import { onMounted } from 'vue';
const message = useMessage();
const apiUrl = import.meta.env.VITE_API_URL;
const props = defineProps({
    data: Object,
});

const list = ref([]);

onMounted(async () => {
    const { data, error } = await useFetch(apiUrl + '/' + props.data.value.info + '/list', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).json();
    if (!error.value) {
        list.value = data.value.data;
    } else {
        console.log(error);
        message.error('Failed to get infos');
    }
});
</script>

<template>
    <h1 v-if="list.length">{{ props.data.value.title }}</h1>
    <n-carousel
        effect="card"
        prev-slide-style="transform: translateX(-150%) translateZ(-800px);"
        next-slide-style="transform: translateX(50%) translateZ(-800px);"
        style="height: 240px"
        :show-dots="false"
        v-if="list.length"
    >
        <n-carousel-item v-for="item in list" :style="{ width: '60%' }">
            <n-card :title="item.name"> {{ item.description }}</n-card>
        </n-carousel-item>
    </n-carousel>
</template>

<style scoped></style>
