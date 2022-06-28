<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo">
        <vuexy-logo />
        <h2 class="brand-text text-primary ml-1">
          Vuexy
        </h2>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col
        lg="8"
        class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
            fluid
            :src="imgUrl"
            alt="Login V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
        >
          <b-card-title
            class="mb-1 font-weight-bold"
            title-tag="h2"
          >
            Bem-vindo(a) ao Atomic Planner! 👋<br>
            <p v-if="usuario">
              {{ usuario.name }}
            </p>
          </b-card-title>
          <b-card-text class="mb-2">
            Please sign-in to your account and start the adventure
          </b-card-text>

          <b-alert
            variant="primary"
            show
          >
            <div class="alert-body font-small-2">
              <p>
                <small class="mr-50"><span class="font-weight-bold">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eius. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span></small>
              </p>
            </div>
          </b-alert>

          <!-- form -->
          <validation-observer
            ref="loginForm"
            #default="{invalid}"
          >
            <b-form
              class="auth-login-form mt-2"
              @submit.prevent="login"
            >
              <!-- email -->
              <b-form-group
                label="Email"
                label-for="login-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  vid="email"
                  rules="required|email"
                >
                  <b-form-input
                    id="login-email"
                    v-model="userEmail"
                    :state="errors.length > 0 ? false:null"
                    name="login-email"
                    placeholder="john@example.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- forgot password -->
              <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="login-password">Password</label>
                  <b-link :to="{name:'auth-forgot-password'}">
                    <small>Forgot Password?</small>
                  </b-link>
                </div>
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  vid="password"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid':null"
                  >
                    <b-form-input
                      id="login-password"
                      v-model="password"
                      :state="errors.length > 0 ? false:null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="login-password"
                      placeholder="Password"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- checkbox -->
              <b-form-group>
                <b-form-checkbox
                  id="remember-me"
                  v-model="status"
                  name="checkbox-1"
                >
                  Remember Me
                </b-form-checkbox>
              </b-form-group>

              <!-- submit buttons -->
              <b-overlay
                style="width: 100%"
                :show="busy"
                rounded
                opacity="0.6"
                spinner-small
                spinner-variant="primary"
                class="d-inline-block"
                @hidden="onHidden"
              >
                <b-button
                  ref="button"
                  type="submit"
                  variant="primary"
                  block
                  :disabled="invalid"
                >
                  Sign in
                </b-button>
              </b-overlay>
            </b-form>
          </validation-observer>

          <b-card-text class="text-center mt-2">
            <span>New on our platform? </span>
            <b-link :to="{name:'auth-register'}">
              <span>&nbsp;Create an account</span>
            </b-link>
          </b-card-text>

          <!-- divider -->
          <div class="divider my-2">
            <div class="divider-text">
              or
            </div>
          </div>

          <!-- social buttons -->
          <div class="auth-footer-btn d-flex justify-content-center">
            <b-button
              variant="facebook"
              href="javascript:void(0)"
            >
              <feather-icon icon="FacebookIcon" />
            </b-button>
            <b-button
              variant="twitter"
              href="javascript:void(0)"
            >
              <feather-icon icon="TwitterIcon" />
            </b-button>
            <b-button
              variant="google"
              href="javascript:void(0)"
            >
              <feather-icon icon="MailIcon" />
            </b-button>
            <b-button
              variant="github"
              href="javascript:void(0)"
            >
              <feather-icon icon="GithubIcon" />
            </b-button>
          </div>
        </b-col>
      </b-col>
    <!-- /Login-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
  BOverlay, BRow, BCol, BLink, BFormGroup, BFormInput, BInputGroupAppend, BInputGroup, BFormCheckbox, BCardText, BCardTitle, BImg, BForm, BButton, BAlert, VBTooltip,
} from 'bootstrap-vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
import useJwt from '@/auth/jwt/useJwt'
import jwt from 'jsonwebtoken'

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BRow,
    BCol,
    BLink,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BFormCheckbox,
    BCardText,
    BCardTitle,
    BImg,
    BForm,
    BButton,
    BAlert,
    VuexyLogo,
    ValidationProvider,
    ValidationObserver,
    BOverlay,
  },
  mixins: [togglePasswordVisibility],
  data: () => ({
    busy: false,
    password: '',
    userEmail: '',
    usuario: false,
    status: '',
    sideImg: require('@/assets/images/pages/login-v2.svg'),
    // validation rules
    required,
    email,
  }),
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  created() {
    // const userData = localStorage.getItem('userData')
    // if (userData) {
    //   this.usuario = JSON.parse(userData)
    //   location.href = '/';
    // }
  },
  methods: {
    onHidden() {
      // Return focus to the button once hidden
      this.$refs.button.focus()
    },
    makeToast(text, variant) {
      this.$bvToast.toast(text, {
        title: 'Login',
        variant,
        solid: true,
      })
    },
    async login() {
      // this.$refs.loginForm.validate().then(success => {
      //   if (success) {
      //     this.$http.post('login', { email: this.userEmail, password: this.password })
      //       .then(response => {
      //         if (response.data.access_token) {
      //           // localStorage.setItem('userData', JSON.stringify(response.data))
      //           // this.$router.push('/')
      //           // VARIAVEIS RELACIOANDAS AO JWT
      //           const jwtConfig = {
      //             secret: 'dd5f3089-40c3-403d-af14-d0c228b05cb4',
      //             refreshTokenSecret: '7c4c1c50-3230-45bf-9eae-c9b2e401c767',
      //             expireTime: '10m',
      //             refreshTokenExpireTime: '10m',
      //           }
      //           //const accessToken = jwt.sign({ id: response.data.id }, jwtConfig.secret, { expiresIn: jwtConfig.expireTime })
      //           //const refreshToken = undefined
      //           const jsonUsuario = {
      //             token: response.data.access_token,
      //             email: response.data.email,
      //             username: response.data.nome,
      //             fullName: '',
      //             avatar: null,
      //             role: response.data.role,
      //             ability: [{ action: 'manage', subject: 'all' }],
      //             id: response.data.id,
      //           }
      //           // SETAR AS INFORMAÇÕES E MANDAR USUARIO PARA A HOME
      //           //useJwt.setToken(accessToken)
      //           //useJwt.setRefreshToken(refreshToken)
      //           localStorage.setItem('userData', JSON.stringify(jsonUsuario))
      //           this.$ability.update(jsonUsuario.ability)
      //           location.href = '/';
      //         } else if (!response.data.status) {
      //           console.log('Login ou Senha incorreto(s)')
      //           this.makeToast('Login ou Senha incorreto(s)', 'danger')
      //         } else {
      //           console.log('ERRO DE VALIDACAO')
      //           this.makeToast('ERRO DE VALIDACAO', 'danger')
      //         }
      //       })
      //       .catch(response => {
      //         console.log(response)
      //         this.makeToast(response.data, 'danger')
      //       })
      //   }
      // }).catch(response => {
      //   console.log(response)

      // })
      this.busy = true
      await this.$http.post('login', { email: this.userEmail, password: this.password }).then( response => {
        const jsonUsuario = { 
            token: response.data.access_token,
            email: response.data.email,
            username: response.data.nome,
            fullName: '',
            avatar: null,
            role: response.data.role,
            ability: [{ action: 'manage', subject: 'all' }],
            id: response.data.id,
        }

        localStorage.setItem('userData', JSON.stringify(jsonUsuario))
        this.$ability.update(jsonUsuario.ability)
        location.href = '/';
      }).catch( error => {
        this.makeToast(error.response, 'danger')
      }).finally(() => {
        this.busy = false
      })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
