<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useMessage } from 'naive-ui';
import { useFetch } from '@vueuse/core';
import { useRouter } from 'vue-router';

const router = useRouter();

const apiUrl = import.meta.env.VITE_API_URL;

const auth = useAuth();
const showModal = ref(false);

const message = useMessage();
const register = ref(false);
const size = ref('medium');

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
            message: 'Please input username',
            trigger: 'blur',
        },
        password: {
            required: true,
            message: 'Please input your password',
            trigger: ['input', 'blur'],
        },
    },
};

// validates infos from the form and call the api to auth
function validateSignIn(e) {
    e.preventDefault();
    signInForm.value?.validate(async (errors) => {
        if (!errors) {
            console.log(signInValue);
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
                auth.setAuth(data.value.accessToken, {
                    username: signInValue.value.username,
                    password: signInValue.value.password,
                });
                message.success('Signed in');
                router.push('/dashboard');
                showModal.value = false;
            } else {
                console.log(error);
                message.error('Failed to authenticate');
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
            message: 'Please input username',
            trigger: 'blur',
        },
    ],
    password: [
        {
            required: true,
            message: 'Password is required',
        },
    ],
    reenteredPassword: [
        {
            required: true,
            message: 'Re-entered password is required',
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
                auth.setAuth(data.value.accessToken, {
                    id: data.value.user.id,
                    username: data.value.user.username,
                    password: data.value.user.password,
                    role: data.value.user.role,
                });
                message.success('Registered');
                router.push('/dashboard');
                showModal.value = false;
            } else {
                console.log(error);
                message.error('Failed to register');
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
    <n-button v-if="!auth.isAuthenticated.value" @click="showModal = true">Sign in</n-button>
    <!--if register is false (it is by default), show a modal with the Sign in form-->
    <n-modal v-if="!register" v-model:show="showModal">
        <n-card
            style="width: 600px"
            title="Sign in"
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
                <n-form-item label="Username" path="user.username">
                    <n-input v-model:value="signInValue.user.username" placeholder="Username" />
                </n-form-item>
                <n-form-item label="Password" path="user.password">
                    <n-input
                        type="password"
                        v-model:value="signInValue.user.password"
                        placeholder="Password"
                    />
                </n-form-item>
                <n-form-item>
                    <n-button @click="validateSignIn"> Sign in </n-button>
                </n-form-item>
            </n-form>
            <template #footer>
                <div>
                    Not registered ? Sign up <a class="link" @click="register = true">here</a>
                </div>
            </template>
        </n-card>
    </n-modal>
    <!--if register is true, show the modal with the registration form -->
    <n-modal v-else v-model:show="showModal">
        <n-card
            style="width: 600px"
            title="Sign up"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <n-form ref="registerForm" :model="registerValues" :rules="registerRules">
                <n-form-item path="username" label="Username">
                    <n-input v-model:value="registerValues.username" placeholder="Username" />
                </n-form-item>
                <n-form-item path="password" label="Password">
                    <n-input
                        v-model:value="registerValues.password"
                        type="password"
                        @input="handlePasswordInput"
                        @keydown.enter.prevent
                    />
                </n-form-item>
                <n-form-item
                    ref="rPasswordFormItemRef"
                    first
                    path="reenteredPassword"
                    label="Re-enter Password"
                >
                    <n-input
                        v-model:value="registerValues.reenteredPassword"
                        :disabled="!registerValues.password"
                        type="password"
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
                                Register
                            </n-button>
                        </div>
                    </n-col>
                </n-row>
            </n-form>
            <template #footer>
                <div>
                    Already registered ? Sign in <a class="link" @click="register = false">here</a>
                </div>
            </template>
        </n-card>
    </n-modal>
</template>
<style scoped></style>
