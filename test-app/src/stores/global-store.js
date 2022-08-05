import { defineStore } from "pinia";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { signOut } from "@firebase/auth";

const API_BASE_URL = "https://dev-api.cazandogangas.com/v1";

export const useGlobalStore = defineStore("global", {
  state: () => ({
    clientAppToken: null,
    reviews: [],
    firebaseInstance: null,
    user: null,
  }),
  getters: {
    getReviews: (state) => state.reviews,
  },

  actions: {
    async loginApp() {
      var body = {
        key: import.meta.env.VITE_APP_KEY,
        secret: import.meta.env.VITE_APP_SECRET,
      };

      const request = await fetch(`${API_BASE_URL}/client-app-credentials`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await request.json();
      this.clientAppToken = data.jwt;
    },

    async getReviewsByEstablishmentId(
      establishmentId = "0558c2a4-dc7d-4a57-bc79-b59999d472e0" // docamar
    ) {
      this.reviews = [];

      const queryParams = { limit: 30, offset: 0 };
      const endpoint = new URL(
        `${API_BASE_URL}/establishments/${establishmentId}/reviews`
      );
      for (let qp in queryParams) {
        endpoint.searchParams.append(qp, queryParams[qp]);
      }

      const request = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + this.clientAppToken,
        },
      });
      const data = await request.json();

      if (data.items.length > 0) {
        this.reviews.push(...data.items);
      } else {
        this.reviews.push(...data.externalReviews);
      }
    },

    createFirebaseInstance() {
      const firebaseConfig = {
        apiKey: import.meta.env.VITE_API_KEY,
        authDomain: import.meta.env.VITE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_APP_ID,
        measurementId: import.meta.env.VITE_MEASUREMENT_ID,
      };

      this.firebaseInstance = initializeApp(firebaseConfig);
    },

    async googleLoginWithModal() {
      if (!this.firebaseInstance) {
        this.createFirebaseInstance();
      }

      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          console.log(token);
          console.log(user);
          this.user = user;
        })
        .catch((error) => {
          console.log(error);
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(credential);
          alert("error login with google");
        });
    },

    async googleLoginWithRedirection() {
      if (!this.firebaseInstance) {
        this.createFirebaseInstance();
      }

      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      await signInWithRedirect(auth, provider);
    },

    async getLoginDataFromRedirection() {
      if (!this.firebaseInstance) {
        this.createFirebaseInstance();
      }

      const auth = getAuth();
      const result = await getRedirectResult(auth);
      if (result) {
        this.user = result.user;
      }
    },

    async firebaseLogout() {
      const auth = getAuth();
      await signOut(auth);
      location.reload();
    },
  },
});
