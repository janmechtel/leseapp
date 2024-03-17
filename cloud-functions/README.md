

# for local development

- `npm install`
- create a service account
- download the keyfile to keys/
- generate the base64 with the command `base64 -w 0 keys/leseapp-416115-ce11ae241b9c.json`
- store the base64 inside .env file with syntax ' KEY_JSON_BASE64=XXX'
- `npm run watch`


# for development

- create an .env.production.local file for production with YAML syntax `KEY_JSON_BASE64: XXX`

- this command  
```
 gcloud functions deploy myCloudFunction \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --env-vars-file .env.production.local
  ```
