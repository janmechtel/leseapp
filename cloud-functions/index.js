
const {GoogleAuth} = require('google-auth-library');
const { json } = require('stream/consumers');

exports.myCloudFunction = async (req, res) => {
  
  // Create a JWT client with the service account email
  const targetAudience = 'https://texttospeech.googleapis.com/v1/text:synthesize';
  const base64String = process.env.KEY_JSON_BASE64;
  // console.log(base64String);
  
  const jsonString = Buffer.from(base64String, 'base64').toString('ascii');
  // console.log('-----');
  // console.log(jsonString);
  const keyJson = JSON.parse(
    jsonString
  );
  
  const auth = new GoogleAuth({
    // Specify the path to your service account key file here
    credentials: keyJson,
    // Specify the scopes your application requests here
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });

  const client = await auth.getClient();
  const accessTokenResponse = await client.getAccessToken();
  const accessToken = accessTokenResponse.token;

  // Here you can return the access token to the caller, log it, or send it to your client
  // console.log(`Generated access token: ${accessToken}`);


  res.set('Access-Control-Allow-Origin', '*');
  // Send the JWT token to the client
  res.json({
    accessToken: accessToken,
  });
};