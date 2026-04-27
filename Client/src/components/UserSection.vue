<script setup>
import { ref, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useMessage } from 'naive-ui';
import { useFetch } from '@vueuse/core';
import { useRouter } from 'vue-router';

const router = useRouter();

const isAuthenticated = computed(() => !!localStorage.getItem('token'));

const apiUrl = import.meta.env.VITE_API_URL;

const auth = useAuth();

const showModal = ref(false);

const message = useMessage();
const register = ref(false);
const size = ref('medium');

const options = [
    {
        label: 'Profil',
        key: 'profile',
        props: {
            onClick: () => {
                router.push('/profile');
            },
        },
    },
    {
        label: 'Se déconnecter',
        key: 'signout',
        props: {
            onClick: async () => {
                await auth.clearAuth();
                router.push('/');
                window.location.reload();
            },
        },
    },
];

const user = auth.getUser();

// SIGN IN SECTION -------------------------------
const signInForm = ref(null);
const signInValue = ref({
    user: {
        username: '',
        password: '',
    },
});

const signInRules = {
    user: {
        username: {
            required: true,
            message: "Merci d'entrer un nom d'utilisateur",
            trigger: 'blur',
        },
        password: {
            required: true,
            message: "Merci d'entrer un mot de passe",
            trigger: ['input', 'blur'],
        },
    },
};

// validates infos from the form and call the api to auth
function validateSignIn(e) {
    e.preventDefault();
    signInForm.value?.validate(async (errors) => {
        if (!errors) {
            const { data, error } = await useFetch(apiUrl + '/user/auth', {
                method: 'POST',
                body: JSON.stringify({
                    username: signInValue.value.user.username,
                    password: signInValue.value.user.password,
                }),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).json();
            if (!error.value) {
                await auth.setToken(data.value.accessToken);
                await auth.setUser(data.value.user);
                message.success('Connecté');
                showModal.value = false;
                window.location.reload();
            } else {
                console.log(error);
                message.error('l&apos;');
            }
        } else {
            console.log(errors);
            message.error('Invalid');
        }
    });
}

// END OF SIGNIN SECTION ------------------------
// REGISTER SECTION -----------------------------
const registerForm = ref(null);
const rPasswordFormItemRef = ref(null);
const registerValues = ref({
    username: null,
    password: null,
    reenteredPassword: null,
});

function validatePasswordStartWith(rule, value) {
    return (
        !!registerValues.value.password &&
        registerValues.value.password.startsWith(value) &&
        registerValues.value.password.length >= value.length
    );
}

function validatePasswordSame(rule, value) {
    return value === registerValues.value.password;
}

const registerRules = {
    username: [
        {
            required: true,
            message: "Merci d'entrer un nom d'utilisateur",
            trigger: 'blur',
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

// checks if confirm password is the same as password on input
function handlePasswordInput() {
    if (registerValues.value.reenteredPassword) {
        rPasswordFormItemRef.value?.validate({ trigger: 'password-input' });
    }
}

// checks if the form infos are valid and send a register request to the API
async function validateRegister(e) {
    e.preventDefault();
    registerForm.value?.validate(async (errors) => {
        if (!errors) {
            const { data, error } = await useFetch(apiUrl + '/user/register', {
                method: 'POST',
                body: JSON.stringify({
                    username: registerValues.value.username,
                    password: registerValues.value.password,
                }),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).json();
            if (!error.value) {
                await auth.setAuth(data.value.accessToken, {
                    id: data.value.user.id,
                    username: data.value.user.username,
                    role: data.value.user.role,
                });
                message.success('Inscription réussie !');
                showModal.value = false;
                window.location.reload();
            } else {
                console.log(error);
                message.error('Echec de l&apos;inscription');
            }
        } else {
            console.log(errors);
            message.error('Invalid');
        }
    });
}
// END OF REGISTER SECTION ----------------------
</script>
<template>
    <!--if you're not authenticated, show the Sign in buttonin the header-->
    <n-button v-if="!isAuthenticated" @click="showModal = true">Se connecter</n-button>
    <!--if register is false (it is by default), show a modal with the Sign in form-->
    <n-modal v-if="!register" v-model:show="showModal">
        <n-card
            style="width: 600px"
            title="Se connecter"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-form
                ref="signInForm"
                inline
                :label-width="80"
                :model="signInValue"
                :rules="signInRules"
                :size="size"
            >
                <n-form-item label="Nom d'utilisateur" path="user.username">
                    <n-input
                        v-model:value="signInValue.user.username"
                        placeholder="Nom d'utilisateur"
                    />
                </n-form-item>
                <n-form-item label="Mot de passe" path="user.password">
                    <n-input
                        type="password"
                        v-model:value="signInValue.user.password"
                        placeholder="Mot de passe"
                    />
                </n-form-item>
                <n-form-item>
                    <n-button @click="validateSignIn">Se connecter</n-button>
                </n-form-item>
            </n-form>
            <template #footer>
                <div>
                    Pas de compte ? Tu peux en créer un
                    <a class="link" @click="register = true">ici</a>
                </div>
            </template>
        </n-card>
    </n-modal>
    <!--if register is true, show the modal with the registration form -->
    <n-modal v-else v-model:show="showModal">
        <n-card
            style="width: 600px"
            title="Créer un compte"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-form ref="registerForm" :model="registerValues" :rules="registerRules">
                <n-form-item path="username" label="Nom d'utilisateur">
                    <n-input
                        v-model:value="registerValues.username"
                        placeholder="Nom d'utilisateur"
                    />
                </n-form-item>
                <n-form-item path="password" label="Mot de passe">
                    <n-input
                        v-model:value="registerValues.password"
                        type="password"
                        placeholder="Mot de passe"
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
                        v-model:value="registerValues.reenteredPassword"
                        :disabled="!registerValues.password"
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        @keydown.enter.prevent
                    />
                </n-form-item>
                <n-row :gutter="[0, 24]">
                    <n-col :span="24">
                        <div style="display: flex; justify-content: flex-end">
                            <n-button
                                :disabled="registerValues.username === null"
                                round
                                type="primary"
                                @click="validateRegister"
                            >
                                S&apos;inscrire
                            </n-button>
                        </div>
                    </n-col>
                </n-row>
            </n-form>
            <template #footer>
                <div>
                    Tu as déjà un compte ? Tu peux te connecter
                    <a class="link" @click="register = false">ici</a>
                </div>
            </template>
        </n-card>
    </n-modal>
    <n-dropdown v-if="isAuthenticated" trigger="hover" :options="options">
        <router-link to="/profile">
            <n-button>{{ user?.username }}</n-button>
        </router-link>
    </n-dropdown>
</template>
<style scoped></style>
