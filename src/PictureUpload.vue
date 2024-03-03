<script  lang="ts">

import axios from 'axios';
import { defineComponent } from 'vue';

import defaultImgLink from './assets/lego.jpg';

export default defineComponent({
  data() {

    return {
      image: defaultImgLink,
      text: "27 190 2 Der Käpt'n will eine Piraten-Turmuhr, aber ich kann die Kiste mit der Bauanleitung einfach nicht öffnen. Hilfst du mir?\" A Annehmen 8 Abbrechen NE"
    };
  },
  methods: {
    processFile(file: any) {
      console.log("processFile");
      console.log(import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY)
      console.log(file.target.files[0]);
    }, 
    onFileChange(e: any) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file: File) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.image = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    async submitToGoogleCloudVision() {
      const url = `https://vision.googleapis.com/v1/images:annotate?key=${import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY}`;
      const body = {
        requests: [
          {
            image: {
              content: this.image.split(',')[1]
            },
            features: [
              {
                type: "TEXT_DETECTION"
              }
            ]
          }
        ]
      };

      try {
        const response = await axios.post(url, body);
        console.log(response.data);
        this.text = response.data.responses[0].fullTextAnnotation.text;
        console.log(this.text);
        // Handle the response as needed
      } catch (error) {
        console.error(error);
      }
    }
  }
});
</script>
<template>
  
  <div>
    <p>Bitte Bild aufnehmen oder hochladen</p>
    <input type="file" accept="image/*" @change="onFileChange" />
    <button @click="submitToGoogleCloudVision">Los</button>
    <img :src="image" />
    <p>{{ text }}</p>
  </div>
</template>
