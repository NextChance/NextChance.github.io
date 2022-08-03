import { defineStore } from "pinia";

const API_BASE_URL = "https://dev-api.cazandogangas.com/v1";

export const useGlobalStore = defineStore("global", {
  state: () => ({
    clientAppToken: null,
    reviews: [],
  }),
  getters: {
    getReviews: (state) => state.reviews,
  },

  actions: {
    async loginApp() {
      var body = {
        key: "cbfb63b5737a4e2fba3612582ea5b182",
        secret: "bd2101d1a1744785ae57ca2f09cfecac",
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
  },
});
