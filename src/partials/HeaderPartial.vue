<template>
  <header class="bg-white py-5 shadow">
    <div class="container">
      <div class="flex items-center justify-between flex-wrap">
        <div class="flex items-center flex-no-shrink mr-6">
          <router-link
            class="text-black hover:text-grey-darkest no-underline font-semibold text-lg"
            :to="{ name: 'HomePage'}">
            Platzi Rooms
          </router-link>
        </div>
        <div class="flex items-center w-auto">
          <div class="items__controls">
            <div class="flex" v-if="user">
              <router-link class="mr-2 flex items-center no-underline text-grey-darkest "
                :to="{ name: 'CreateHousePage'}">
                <i class="material-icons">add</i>
              </router-link>
              <button class="mr-4 flex items-center">
                <i class="material-icons">notifications</i>
              </button>
              <div class="flex items-center mr-5">
                <img class="w-8 h-8 rounded-full mr-2"
                     :src="(user.avatar) ? user.avatar : ''"
                     :alt="'Avatar of '+user.name" @error="setAltImg">
                <div class="text-sm">
                  <p class="text-black leading-none">{{ user.name }}</p>
                  <p class="text-grey-dark">Online</p>
                </div>
              </div>
              <button class="flex items-center" @click.prevent="signOut">
                <i class="material-icons">logout</i>
              </button>
            </div>
            <div v-else>
              <button class="btn__outline btn__outline--teal rounded mr-2"
                @click.prevent="getLogin">Login</button>
              <button
                class="bg-yellow-dark text-yellow-darker font-semibold py-2 px-4 rounded"
                @click.prevent="signUp"
              >
                Register</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'HeaderPartial',
  data() {
    return {
      isAuthenticated: true,
    };
  },
  methods: {
    getLogin() {
      this.$store.dispatch('TOGGLE_MODAL_STATE', {
        name: 'login',
        value: true,
      });
    },
    signUp() {
      this.$store.dispatch('TOGGLE_MODAL_STATE', {
        name: 'singUp',
        value: true,
      });
    },
    setAltImg(event) {
      event.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDB8fGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60';
    },
    signOut() {
      this.$store.dispatch('SIGN_OUT');
    },
  },
  computed: {
    ...mapGetters({
      user: 'authUser',
    }),
  },
};
</script>
