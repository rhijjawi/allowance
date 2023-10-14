import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import jwt from "jsonwebtoken";

const afterCallback = async (req, res, session) => {
  const payload = {
    userId: session.user.sub,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  session.user.accessToken = jwt.sign(
    payload,
    process.env.NEXT_PUBLIC_SUPABASE_SIGNING_KEY
  );

  return session;
};

export default handleAuth({
  callback: async(req, res) => {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (error) {
      console.log(error)
      return await res.redirect("/api/auth/login");
    }
  },
});