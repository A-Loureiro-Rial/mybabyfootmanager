<script setup>
import { username, role, useAuth } from '@/composables/useAuth';
import { useMessage } from 'naive-ui';
import { ref } from 'vue';

const message = useMessage();
const auth = useAuth();
const disabledForm = ref(true);
const updateUserForm = ref(null);
const rPasswordFormItemRef = ref(null);
const updateUserValues = ref({
    newUsername: username.value,
    oldPassword: null,
    password: null,
    reenteredPassword: null,
});

// checks confirm password on type
function validatePasswordStartWith(rule, value) {
    return (
        !!updateUserValues.value.password &&
        updateUserValues.value.password.startsWith(value) &&
        updateUserValues.value.password.length >= value.length
    );
}

// checks if confirm password is the same as password on input
function handlePasswordInput() {
    if (updateUserValues.value.reenteredPassword) {
        rPasswordFormItemRef.value?.validate({ trigger: 'password-input' });
    }
}

function validatePasswordSame(rule, value) {
    return value === updateUserValues.value.password;
}

const updateUserRules = {
    newUsername: [
        {
            required: true,
            message: "Merci d'entrer un nom d'utilisateur",
            trigger: 'blur',
        },
    ],
    oldPassword: [
        {
            required: true,
            message: "Merci d'entrer un mot de passe",
        },
    ],
    password: [
        {
            required: true,
            message: "Merci d'entrer un mot de passe",
        },
    ],
    reenteredPassword: [
        {
            required: true,
            message: 'Les mots de passe ne correspondent pas',
            trigger: ['input', 'blur'],
        },
        {
            validator: validatePasswordStartWith,
            message: 'Password is not same as re-entered password!',
            trigger: 'input',
        },
        {
            validator: validatePasswordSame,
            message: 'Password is not same as re-entered password!',
            trigger: ['blur', 'password-input'],
        },
    ],
};

// validates the data from registerForm and update user
function validateUpdateUser(e) {
    e.preventDefault();
    updateUserForm.value?.validate(async (errors) => {
        if (!errors) {
            auth.updateUser(
                updateUserValues.value.oldPassword,
                updateUserValues.value.newUsername,
                updateUserValues.value.password,
            )
                ? message.success('Profil mis à jour')
                : message.error('Erreur lors de la mise à jour du profil');
        } else {
            console.error(errors);
            message.error('Invalid');
        }
    });
}

function toggleUpdateForm() {
    disabledForm.value = disabledForm.value ? false : true;
    updateUserValues.value.newUsername = '';
    updateUserValues.value.oldPassword = '';
    updateUserValues.value.password = '';
    updateUserValues.value.reenteredPassword = '';
}
</script>

<template>
    <!--If we're updating the profil, displays the form-->
    <n-form
        v-if="!disabledForm"
        ref="updateUserForm"
        :style="{ 'margin-left': '1%' }"
        :model="updateUserValues"
        :rules="updateUserRules"
    >
        <n-space vertical :style="{ width: '30%' }">
            <n-form-item path="newUsername" label="Nouveau nom d'utilisateur">
                <n-input
                    v-model:value="updateUserValues.newUsername"
                    :disabled="disabledForm"
                    placeholder="Nom d'utilisateur"
                />
            </n-form-item>
            <n-form-item path="oldPassword" label="Ancien mot de passe">
                <n-input
                    v-model:value="updateUserValues.oldPassword"
                    :disabled="disabledForm"
                    type="password"
                    placeholder="Ancien mot de passe"
                />
            </n-form-item>
            <n-form-item path="password" label="Nouveau mot de passe">
                <n-input
                    v-model:value="updateUserValues.password"
                    :disabled="disabledForm"
                    type="password"
                    placeholder="Nouveau mot de passe"
                    @input="handlePasswordInput"
                    @keydown.enter.prevent
                />
            </n-form-item>
            <n-form-item
                ref="rPasswordFormItemRef"
                first
                path="reenteredPassword"
                label="Confirmer le mot de passe"
            >
                <n-input
                    v-model:value="updateUserValues.reenteredPassword"
                    :disabled="!updateUserValues.password || disabledForm"
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    @keydown.enter.prevent
                />
            </n-form-item>
        </n-space>

        <n-row :gutter="[0, 24]">
            <n-col :span="24">
                <n-space justify="space-around" :style="{ 'margin-top': '1%', width: '30%' }">
                    <n-button
                        :disabled="updateUserValues.username === null"
                        round
                        type="primary"
                        @click="validateUpdateUser"
                    >
                        Modifier mon compte
                    </n-button>
                    <n-button round @click="toggleUpdateForm"> Annuler </n-button>
                </n-space>
            </n-col>
        </n-row>
    </n-form>
    <!--otherwise, dislpays user infos and a button to toggle the update form-->
    <n-card v-else title="Mon profil" size="huge">
        <n-space vertical :style="{ 'margin-bottom': '2%' }">
            <span> Nom d&apos;utilisateur : {{ username }} </span>
            <span> Type de compte : {{ role }} </span>
        </n-space>
        <n-button round @click="toggleUpdateForm"> Modifier mon profil </n-button>
    </n-card>
</template>

<style scoped></style>
