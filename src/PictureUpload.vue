<script  lang="ts">

import axios from 'axios';
import { defineComponent } from 'vue';

import { access } from 'fs';
const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
console.log(apiKey)

interface SynthesizeSpeechRequest {
  input: { text: string };
  voice: { languageCode: string; ssmlGender: string };
  audioConfig: { audioEncoding: string };
}

interface SynthesizeSpeechResponse {
  audioContent: string; // Base64-encoded string of audio content
}




export default defineComponent({
  data() {

    return {
      image: "",
      text: "",
      accessToken: ""
    };
  },
  methods: {
    async fetchAccessToken(): Promise<string> {
      // Check if accessToken already exists and return it
      if (this.accessToken) {
        return this.accessToken;
      }
      const response = await fetch('https://europe-central2-leseapp-416115.cloudfunctions.net/myCloudFunction');
      if (!response.ok) {
        throw new Error('Failed to fetch access token');
      }
      const data = await response.json();
      // console.log(data);
      this.accessToken = data.accessToken; // Store the fetched token
      return data.accessToken;
    },
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
      const accessToken = await this.fetchAccessToken(); // Fetch the access token
      
      const url = `https://vision.googleapis.com/v1/images:annotate`;
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
        const response = await axios.post(url, body,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            }
          });
        console.log(response.data);
        this.text = response.data.responses[0].fullTextAnnotation.text;
        console.log(this.text);
        // Handle the response as needed
      } catch (error) {
        console.error(error);
      }
    },

    async speakText() {
      const accessToken = await this.fetchAccessToken(); // Fetch the access token

      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: {text: this.text},
          voice: {languageCode: 'de-DE', ssmlGender: 'NEUTRAL'},
          audioConfig: {audioEncoding: 'MP3'},
        })
      };
    const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', requestOptions);
    if (!response.ok) {
      throw new Error('Failed to synthesize text');
    }
    const data: SynthesizeSpeechResponse = await response.json();
    const audioContent = data.audioContent;
    if (audioContent) {
      const audioSrc = `data:audio/mp3;base64,${audioContent}`;
      const audio = new Audio(audioSrc);
      audio.play();
    }
    },
  }
});
</script>
<template>
  <h1>LeseApp</h1>  
  <div>
    <p>Bitte Bild aufnehmen</p>
    <input type="file" accept="image/*" @change="onFileChange" capture="environment"/>
    <img :src="image" />
  </div>
  <div v-if="text">
    <p>{{ text }}</p>
    <button @click="speakText">Nochmal vorlesen</button>
  </div>
</template>

<style scoped>
  img {
    max-width: 100%;
  }
</style>