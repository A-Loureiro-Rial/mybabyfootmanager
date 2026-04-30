<script setup>
import { ref } from 'vue';
import { teams, addTeam, registerTeams } from '@/composables/useTeam';
import { tournaments, addTournament } from '@/composables/useTournament';
import { useMessage } from 'naive-ui';

const message = useMessage();

// ------ REGISTRATION SECTION

// Registration forms infos
const adminRegisterForm = ref(null);

// registrations form model
const adminRegisterModel = ref({
    tournament: null,
    teams: [],
});

const adminRegisterRules = {
    tournament: {
        required: true,
        trigger: ['blur'],
    },
    teams: {
        required: true,
        trigger: ['blur'],
    },
};

// Displays the registration form
const registerForm = ref(false);

// ------ END OF REGISTRATIONS SECTION

// ------ TEAM / TOURNAMENT SECTION

// team / tournament forms infos
const adminAddForm = ref(null);

// team / tournament form model
const adminAddModel = ref({
    name: '',
    description: '',
    date: null,
});

const adminAddRules = {
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

// displays the adding team / tournament form
const addForm = ref(false);

// ------ END OF TEAM / TOURNAMENT SECTION

async function handleValidateForm() {
    switch (formInfo.value) {
        case 'team':
            adminAddForm.value?.validate(async (errors) => {
                if (!errors && addForm) {
                    addTeam(adminAddModel.value.name, adminAddModel.value.description)
                        ? message.success('Équipe créée')
                        : message.error("Erreur lors de l'ajout de l'équipe");
                    adminAddForm.value.name = '';
                    adminAddForm.value.description = '';
                } else {
                    console.error(error);
                    message.error("Erreur lors de l'ajout de l'équipe");
                }
            });
            break;
        case 'tournament':
            adminAddForm.value?.validate(async (errors) => {
                if (!errors && addForm) {
                    addTournament(
                        adminAddModel.value.name,
                        adminAddModel.value.description,
                        adminAddModel.value.date,
                    )
                        ? message.success('Tournoi créé')
                        : message.error("Erreur lors de l'ajout du tournoi");
                    adminAddForm.value.name = '';
                    adminAddForm.value.description = '';
                } else {
                    console.error(error);
                    message.error("Erreur lors de l'ajout du tournoi");
                }
            });
            break;
        case 'team/register':
            adminRegisterForm.value?.validate(async (errors) => {
                if (!errors && registerForm) {
                    registerTeams(
                        adminRegisterModel.value.teams,
                        adminRegisterModel.value.tournament,
                    )
                        ? message.success('Inscription(s) réussie(s)')
                        : message.error('Erreur lors de(s) inscription(s)');
                    adminRegisterModel.value.name = '';
                    adminRegisterModel.value.description = '';
                } else {
                    console.error(error);
                    message.error("Erreur lors de l'inscription des équipes");
                }
            });
            break;
        default:
            message.error('Erreur: ajout inconnu');
            break;
    }
    adminModal.value = false;
}

// infos for the modal (one modal for multiple forms)
const adminModal = ref(false);
const adminModalTitle = ref('');
const adminModalTitleOptions = {
    team: 'Ajouter une équipe',
    tournament: 'Ajouter un tournoi',
    'team/register': 'Inscrire des équipes à un tournoi',
};

// displays the modal and displays the title and the form needed
const formInfo = ref('');
function handleAdminModal(info) {
    addForm.value = info === 'team' || info === 'tournament' ? true : false;
    registerForm.value = info === 'team/register' ? true : false;
    adminModalTitle.value = adminModalTitleOptions[info];
    adminModal.value = true;
    formInfo.value = info;
}
</script>
<template>
    <n-flex>
        <n-float-button
            width="50"
            height="50"
            :right="50"
            :bottom="50"
            type="primary"
            menu-trigger="hover"
        >
            <n-icon> + </n-icon>
            <template #menu>
                <n-float-button
                    @click="handleAdminModal('team')"
                    width="100"
                    height="50"
                    right="25"
                    shape="square"
                >
                    <template #description>Ajouter une équipe</template>
                </n-float-button>
                <n-float-button
                    @click="handleAdminModal('tournament')"
                    width="100"
                    height="50"
                    right="25"
                    shape="square"
                >
                    <template #description>Ajouter un tournoi</template>
                </n-float-button>
                <n-float-button
                    @click="handleAdminModal('team/register')"
                    width="100"
                    height="50"
                    right="25"
                    shape="square"
                >
                    <template #description>Inscrire des équipes à un tournoi</template>
                </n-float-button>
            </template>
        </n-float-button>
        <n-modal v-model:show="adminModal">
            <n-card
                style="width: 600px"
                :title="adminModalTitle"
                :bordered="false"
                size="huge"
                role="dialog"
                aria-modal="true"
            >
                <!--Form to add a team / tournament -->
                <n-form
                    v-if="addForm"
                    ref="adminAddForm"
                    inline
                    :label-width="80"
                    :model="adminAddModel"
                    :rules="adminAddRules"
                    size="medium"
                >
                    <n-space vertical>
                        <n-form-item label="Nom" path="name">
                            <n-input v-model:value="adminAddModel.name" placeholder="Nom" />
                        </n-form-item>
                        <n-form-item label="Description" path="description">
                            <n-input
                                type="textarea"
                                v-model:value="adminAddModel.description"
                                placeholder="Description"
                            />
                        </n-form-item>
                        <div v-if="formInfo == 'tournament'">
                            Date <span :style="{ color: '#d2716c' }">*</span>
                        </div>
                        <n-date-picker
                            v-if="formInfo == 'tournament'"
                            v-model:formatted-value="adminAddModel.date"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            clearable
                        />
                    </n-space>
                </n-form>
                <!--Form to register teams to a tournament-->
                <n-form
                    v-if="registerForm"
                    ref="adminRegisterForm"
                    inline
                    :label-width="80"
                    :model="adminRegisterModel"
                    :rules="adminRegisterRules"
                    size="medium"
                >
                    <n-space vertical :style="{ width: '100%' }">
                        <n-select
                            v-model:value="adminRegisterModel.teams"
                            multiple
                            clearable
                            filterable
                            placeholder="Choisissez la/les équipe(s) à inscrire"
                            :options="teams"
                            label-field="name"
                            value-field="id"
                            path="teams"
                        />

                        <n-select
                            v-model:value="adminRegisterModel.tournament"
                            filterable
                            clearable
                            placeholder="Choisissez un tournoi"
                            :options="tournaments"
                            label-field="name"
                            value-field="id"
                            path="tournament"
                        />
                    </n-space>
                </n-form>
                <template #footer>
                    <n-button @click="handleValidateForm()"> Valider </n-button>
                </template>
            </n-card>
        </n-modal>
    </n-flex>
</template>
