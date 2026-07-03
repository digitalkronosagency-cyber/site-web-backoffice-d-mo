export function magicLinkTemplate(loginUrl: string) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #0b2545;">Connexion à l'espace admin</h2>
      <p>Cliquez sur le bouton ci-dessous pour vous connecter. Ce lien est valable 15 minutes et à usage unique.</p>
      <p style="text-align: center; margin: 32px 0;">
        <a href="${loginUrl}" style="background: #f5a623; color: #0b2545; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
          Se connecter
        </a>
      </p>
      <p style="color: #666; font-size: 14px;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
    </div>
  `;
}
