// src/pages/api/auth/federated-logout.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const domain = env.COGNITO_HOSTED_UI_DOMAIN;
  const clientId = env.COGNITO_CLIENT_ID;
  const logoutUri = `${env.NEXTAUTH_URL}/`; 

  const url = new URL(`https://${domain}/logout`);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("logout_uri", logoutUri);

  return res.redirect(url.toString());
}
