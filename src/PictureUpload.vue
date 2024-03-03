<script  lang="ts">

export default {
  methods: {
    processFile(file: any) {
      console.log("processFile");
      console.log(file.target.files[0]);
    }, 
  }
} 
</script>
<template>
  
  <div>
    <p>Bitte Bild aufnehmen oder hochladen</p>
    <form @submit.prevent="processFile" >
      <input type="file" accept="image/*" @change="processFile"/>
    </form>
  </div>
</template>
