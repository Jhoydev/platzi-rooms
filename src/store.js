import Vue from 'vue';
import Vuex from 'vuex';
import {
  getDatabase, ref, child, onValue, query, limitToFirst, push, update, set,
} from 'firebase/database';
import {
  getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword,
} from 'firebase/auth';
import countObjectProperties from './utils';
import firebaseApp from './firebase/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: {},
    services: {},
    rooms: {},
    authId: null,
    modals: {
      login: false,
      singUp: false,
    },
  },
  mutations: {
    SET_MODAL_STATE: (state, { name, value }) => {
      state.modals[name] = value;
    },
    SET_ROOM(state, { newRoom, roomId }) {
      Vue.set(state.rooms, roomId, newRoom);
    },
    APPEND_ROOM_TO_USER(state, { roomId, userId }) {
      Vue.set(state.users[userId].rooms, roomId, roomId);
    },
    SET_ITEM(state, { item, id, resource }) {
      const newItem = item;
      newItem['.key'] = id;
      Vue.set(state[resource], id, newItem);
    },
    SET_AUTHID(state, id) {
      state.authId = id;
    },
  },
  actions: {
    TOGGLE_MODAL_STATE: ({ commit }, { name, value }) => {
      commit('SET_MODAL_STATE', { name, value });
    },
    CREATE_ROOM: ({ state, commit }, room) => {
      console.log('CREATE_ROOM');
      const newRoom = room;
      const roomId = push(ref(getDatabase(), 'rooms')).key;
      newRoom.userId = state.authId;
      newRoom.publishedAt = Math.floor(Date.now() / 1000);
      newRoom.meta = { likes: 0 };
      const updates = {};
      updates[`rooms/${roomId}`] = newRoom;
      updates[`users/${newRoom.userId}/rooms/${roomId}`] = roomId;
      update(ref(getDatabase()), updates).then(() => {
        commit('SET_ROOM', { newRoom, roomId });
        commit('APPEND_ROOM_TO_USER', { roomId, userId: newRoom.userId });
        return Promise.resolve(state.rooms[roomId]);
      });
    },
    FETCH_ROOMS: ({ state, commit }, limit) => new Promise((resolve) => {
      let instance = ref(getDatabase(), 'rooms');
      if (limit) {
        instance = query(instance, limitToFirst(limit));
      }
      onValue(instance, ((snapshot) => {
        const rooms = snapshot.val();
        Object.keys(rooms).forEach((roomId) => {
          const room = rooms[roomId];
          commit('SET_ITEM', { resource: 'rooms', id: roomId, item: room });
        });
      }));
      resolve(Object.values(state.rooms));
    }),
    FETCH_USER: ({ state, commit }, { id }) => new Promise((resolve) => {
      const instance = ref(getDatabase(), 'users');
      onValue(child(instance, id), (snapshot) => {
        commit('SET_ITEM', { resource: 'users', id: snapshot.key, item: snapshot.val() });
        resolve(state.users[id]);
      });
    }),
    CREATE_USER: ({ state, commit }, { name, email, password }) => new Promise((resolve) => {
      const auth = getAuth(firebaseApp);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // eslint-disable-next-line prefer-destructuring
          const id = userCredential.user.uid;
          const registeredAt = Math.floor(Date.now() / 1000);
          const newUser = { email, name, registeredAt };
          const dbRef = ref(getDatabase());
          set(child(dbRef, `users/${id}`), newUser)
            .then(() => {
              commit('SET_ITEM', { resource: 'users', id, item: newUser });
              resolve(state.users[id]);
            });
        });
    }),
    FETCH_AUTH_USER: ({ dispatch, commit }) => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        return dispatch('FETCH_USER', { id: user.uid })
          .then(() => {
            commit('SET_AUTHID', user.uid);
          });
      }
    },
    SIGN_IN(context, { email, password }) {
      const auth = getAuth();
      return signInWithEmailAndPassword(auth, email, password);
    },
    SIGN_OUT: ({ commit }) => {
      const auth = getAuth();
      signOut(auth).then(() => {
        commit('SET_AUTHID', null);
      });
    },
  },
  getters: {
    modals: state => state.modals,
    authUser: state => state.users[state.authId],
    rooms: state => state.rooms,
    userRoomsCount: state => id => countObjectProperties(state.users[id].rooms),
  },
});
