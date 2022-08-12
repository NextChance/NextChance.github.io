<template>
  <div class="create-review-form">
    <input
      type="file"
      name="imagePicker"
      id="image-picker"
      accept="image/png, image/jpeg"
      @change="onInputFileChange"
    />
    <img
      style="max-width: 150px; max-height: 150px"
      v-for="image in imagesPreview"
      :key="image"
      :src="image"
      alt=""
    />
    <br />
    <div v-if="reviewData.imageFile">
      <textarea
        name="reviewText"
        placeholder="introduzca review"
        id=""
        cols="30"
        rows="10"
        v-model="reviewData.text"
      ></textarea>
      <br />
      <input
        type="number"
        max="5"
        maxlength="1"
        min="1"
        v-model="reviewData.rating"
      />
      <br />
      <button :disabled="!isFormFilled" @click="createReview">
        crear review
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import { useGlobalStore } from "../stores/global-store.js";

const globalStore = useGlobalStore();
const establishmentId = "0558c2a4-dc7d-4a57-bc79-b59999d472e0";
const imagesPreview = reactive([]);
let reviewData = reactive({
  imageFile: null,
  text: null,
  rating: 5,
});

const onInputFileChange = async (event) => {
  imagesPreview.shift();
  reviewData.imageFile = event.target.files[0];
  const image = URL.createObjectURL(reviewData.imageFile);
  imagesPreview.push(image);

  try {
    await globalStore.uploadTicket(establishmentId, reviewData.imageFile);
  } catch (error) {
    alert("error subiendo la imagen");
  }
};

const createReview = async () => {
  const data = {
    establishmentId: "0558c2a4-dc7d-4a57-bc79-b59999d472e0",
    text: reviewData.text,
    rating: reviewData.rating,
  };

  try {
    await globalStore.createReview(data);
  } catch (error) {
    console.log(error);
  }
};

const isFormFilled = computed(() => {
  return !!reviewData.imageFile && !!reviewData.text && !!reviewData.rating;
});
</script>

<style></style>
