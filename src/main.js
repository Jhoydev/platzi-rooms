import Vue from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebase from './firebase/config';
import App from './App.vue';
import router from './router';
import store from './store';


window.firebase = firebase;
Vue.config.productionTip = false;

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    store.dispatch('FETCH_AUTH_USER');
  }
});

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    if (store.state.authId) {
      this.$store.dispatch('FETCH_USER', { id: store.state.authId });
    }
  },
}).$mount('#app');
