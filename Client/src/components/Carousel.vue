<script setup>
import { computed } from 'vue';
import { useMessage } from 'naive-ui';
import { ref } from 'vue';
import { role } from '@/composables/useAuth';
import { useApiFetch } from '@/composables/useApiFetch';
import { teams } from '@/composables/useTeam';
import { tournaments } from '@/composables/useTournament';
import { formatDateFR } from '@/composables/useDate';

const message = useMessage();
const props = defineProps({
    data: Object,
});
const list = computed(() => (props.data?.info === 'tournament' ? tournaments : teams));
const size = ref('medium');
const formId = ref(0);
const formValue = ref({
    name: '',
    description: '',
    date: '',
});
const rules = {
    name: {
        required: true,
        message: "Merci d'entrer un nom",
        trigger: ['blur', 'input'],
        validator(value) {
            if (value.length == 0) {
                return new Error("Merci d'entrer un nom");
            } else if (value.length > 64) {
                return new Error('Le nom ne peut pas dépasser 64 caractères');
            }
            return true;
        },
    },
    description: {
        required: false,
        trigger: ['blur', 'input'],
        validator(value) {
            if (value.length > 255) {
                return new Error('La description ne peut pas dépasser 255 caractères');
            }
            return true;
        },
    },
};

function openUpdate(data) {
    formId.value = data.id;
    formValue.value.name = data.name;
    formValue.value.description = data.description;
    if (props.data?.info == 'tournament') {
        formValue.value.date = new Date(data.date).toISOString().slice(0, 19).replace('T', ' ');
    }
    showModal.value = true;
}

async function handleUpdate() {
    const body =
        props.data?.info == 'tournament'
            ? {
                  id: formId.value,
                  name: formValue.value.name,
                  description: formValue.value.description,
                  date: formValue.value.date,
              }
            : {
                  id: formId.value,
                  name: formValue.value.name,
                  description: formValue.value.description,
              };
    const { data, error } = await useApiFetch(`/${props.data.info}/update`, {
        method: 'PUT',
        body: JSON.stringify(body),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).json();
    if (!error.value) {
        showModal.value = false;
        if (props.data?.info == 'tournament') {
            const item = tournaments.value.find((search) => search.id === data.value.data.id);
            if (item) {
                item.name = data.value.data.name;
                item.description = data.value.data.description;
                item.date = new Date(data.value.data.date)
                    .toISOString()
                    .slice(0, 19)
                    .replace('T', ' ');
                message.success('Modification réussie');
            }
        } else if (props.data?.info == 'team') {
            const item = teams.value.find((search) => search.id === data.value.data.id);
            if (item) {
                item.name = data.value.data.name;
                item.description = data.value.data.description;
                message.success('Modification réussie');
            }
        } else {
            message.error('Erreur lors de la mise à jour de la liste');
        }
    } else {
        console.error(error);
        message.error('Erreur lors de la modification');
    }
}

async function handleDelete(id) {
    const { data, error } = await useApiFetch(`/${props.data.info}/delete`, {
        method: 'DELETE',
        body: JSON.stringify({
            id: id,
        }),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    }).json();
    if (!error.value) {
        showModal.value = false;
        if (props.data?.info == 'tournament') {
            tournaments.value = tournaments.value.filter((item) => item.id !== id);
        } else if (props.data?.info == 'team') {
            teams.value = teams.value.filter((item) => item.id !== id);
        } else {
            message.error('Erreur lors de la mise à jour de la liste');
        }
        message.success('Suppression réussie');
    } else {
        console.error(error);
        message.error('Erreur lors de la suppression');
    }
}

const showModal = ref(false);
</script>

<template>
    <h1 v-if="list?.value.length">{{ props.data.title }}</h1>
    <n-carousel
        effect="card"
        prev-slide-style="transform: translateX(-150%) translateZ(-800px);"
        next-slide-style="transform: translateX(50%) translateZ(-800px);"
        style="height: 200px"
        :show-dots="false"
        v-if="list.value.length"
    >
        <n-carousel-item
            v-for="item in list.value"
            :key="item"
            :style="{ width: '60%', display: 'flex' }"
        >
            <n-card :title="item.name">
                <!--if info is a tournament, displays the french date-->
                <template v-if="props.data?.info == 'tournament'" #header-extra>
                    {{ formatDateFR(item.date) }}
                </template>
                <n-ellipsis
                    :style="{ width: '100%' }"
                    expand-trigger="click"
                    line-clamp="2"
                    :tooltip="false"
                >
                    {{ item.description }}
                </n-ellipsis>
                <!--if user is admin, displays a button to update or delete the item -->
                <template #footer>
                    <n-space>
                        <router-link
                            v-if="props.data?.info == 'tournament'"
                            :to="'/tournament/' + item.id"
                        >
                            <n-button size="small" type="info">Détails</n-button>
                        </router-link>
                        <n-button v-if="role === 'admin'" size="small" @click="openUpdate(item)"
                            >Modifier</n-button
                        >
                        <n-popconfirm
                            v-if="role === 'admin'"
                            negative-text="Annuler"
                            positive-text="Supprimer"
                            @positive-click="handleDelete(item.id)"
                        >
                            <template #trigger>
                                <n-button ghost type="error" size="small">Supprimer</n-button>
                            </template>
                            Voulez vous vraiment supprimer cet élément ?
                        </n-popconfirm>
                    </n-space>
                </template>
            </n-card>
        </n-carousel-item>
    </n-carousel>
    <n-modal v-model:show="showModal">
        <n-card
            style="width: 400px"
            title="Modifier"
            :bordered="false"
            size="medium"
            role="dialog"
            aria-modal="true"
        >
            <n-form inline :model="formValue" :rules="rules" :size="size">
                <n-space style="width: 100%" vertical>
                    <n-form-item label="Nom" path="name">
                        <n-input v-model:value="formValue.name" placeholder="Nom" />
                    </n-form-item>
                    <n-form-item label="Description" path="description">
                        <n-input
                            type="textarea"
                            v-model:value="formValue.description"
                            placeholder="Description"
                        />
                    </n-form-item>
                    <div v-if="props?.data.info == 'tournament'">
                        Date <span :style="{ color: '#d2716c' }">*</span>
                    </div>
                    <n-date-picker
                        v-if="props.data?.info == 'tournament'"
                        v-model:formatted-value="formValue.date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="Date"
                        clearable
                    />
                    <n-form-item>
                        <n-button @click="handleUpdate"> Modifier </n-button>
                    </n-form-item>
                </n-space>
            </n-form>
        </n-card>
    </n-modal>
</template>
