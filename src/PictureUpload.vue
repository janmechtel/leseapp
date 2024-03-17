<script  lang="ts">

import axios from 'axios';
import { defineComponent } from 'vue';

import defaultImgLink from './assets/lego.jpg';
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


async function fetchAccessToken(): Promise<string> {
  const response = await fetch('https://b371-158-181-76-113.ngrok-free.app');
  if (!response.ok) {
    throw new Error('Failed to fetch access token');
  }
  const data = await response.json();
  console.log(data);
  return data.accessToken; // Assuming the token is returned in this field
}

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
      const accessToken = await fetchAccessToken(); // Fetch the access token

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
