
const {GoogleAuth} = require('google-auth-library');

exports.myCloudFunction = async (req, res) => {
  
  // Create a JWT client with the service account email
  const targetAudience = 'https://texttospeech.googleapis.com/v1/text:synthesize';
  const auth = new GoogleAuth({
    // Specify the path to your service account key file here
    keyFilename: 'keys/leseapp-416115-ce11ae241b9c.json',
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