npm install
npm run watch


gcloud functions deploy myCloudFunction \
  --runtime nodejs16 \
  --trigger-http \
  --allow-unauthenticated \
