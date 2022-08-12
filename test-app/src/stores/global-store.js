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
    userToken: null,
    firebaseToken: null,
    reviews: [],
    firebaseInstance: null,
    user: null,
    uploadedTicketId: null,
  }),
  getters: {
    getReviews: (state) => state.reviews,
  },

  actions: {
    async loginApp() {
      const body = {
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

    async loginUser() {
      const body = {
        firebaseToken: this.firebaseToken,
      };

      const request = await fetch(`${API_BASE_URL}/user-credentials`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + this.clientAppToken,
        },
      });

      const data = await request.json();
      this.userToken = data.jwt;

      await this.getUserData();
    },

    async getUserData() {
      const request = await fetch(`${API_BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + this.userToken,
        },
      });
      const data = await request.json();
      this.user = data;
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
        .then(async (result) => {
          const user = result.user;
          console.log(user);
          this.firebaseToken = result.user.accessToken;
          await this.loginUser();
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
        this.firebaseToken = result.user.accessToken;
        await this.loginUser();
      }
    },

    async firebaseLogout() {
      const auth = getAuth();
      await signOut(auth);
      location.reload();
    },

    async uploadTicket(establishmentId, file) {
      const body = new FormData();

      body.append("establishmentId", establishmentId);
      body.append("file", file);

      const request = await fetch(`${API_BASE_URL}/tickets`, {
        method: "POST",
        body: body,
        headers: {
          authorization: "Bearer " + this.userToken,
        },
      });

      const data = await request.json();
      this.uploadedTicketId = data.id;
    },

    async createReview(payload) {
      const body = {
        ...payload,
        ticketId: this.uploadedTicketId,
      };

      const request = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + this.userToken,
        },
      });

      const data = await request.json();
      console.log(data.reviewId);
    },
  },
});
