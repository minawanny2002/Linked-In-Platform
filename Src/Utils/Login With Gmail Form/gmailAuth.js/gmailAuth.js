import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();
async function verify(idToken) {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return payload;
}
export default verify;

