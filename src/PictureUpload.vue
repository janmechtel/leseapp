<script  lang="ts">

import axios from 'axios';
import { defineComponent } from 'vue';

import defaultImgLink from './assets/lego.jpg';
const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
console.log(apiKey)

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
        this.submitToGoogleCloudVision().then(() => {
          this.speakText();
        });
      };
      reader.readAsDataURL(file);
    },
    async submitToGoogleCloudVision() {
      const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
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
    },
    async speakText() {
      if (!this.text) return;
      
      const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
      const data = {
        input: {text: this.text},
        voice: {languageCode: 'de-DE', ssmlGender: 'NEUTRAL'},
        audioConfig: {audioEncoding: 'MP3'},
      };

      try {
        const response = await axios.post(url, data);
        const audioContent = response.data.audioContent;
        if (audioContent) {
          const audioSrc = `data:audio/mp3;base64,${audioContent}`;
          const audio = new Audio(audioSrc);
          audio.play();
        }
      } catch (error) {
        console.error('Error calling the text-to-speech API', error);
      }
    },
  }
});
</script>
<template>
  
  <div>
    <p>Bitte Bild aufnehmen oder hochladen</p>
    <input type="file" accept="image/*" @change="onFileChange" capture="environment"/>
    <img :src="image" />
    <p>{{ text }}</p>
  </div>
  <div>
    <button @click="speakText">Vorlesen</button>
  </div>
</template>
