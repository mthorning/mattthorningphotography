module.exports = ({ env }) => {
  return {
    host: env("HOST", "0.0.0.0"),
    port: env.int("PORT", 1337),
    url: `${env("PUBLIC_URL", "http://localhost:3000")}/api`,
    admin: {
      auth: {
        secret: env("ADMIN_JWT_SECRET", "36ada1f29510bdcce88e5eab83743ee8"),
      },
    },
  };
};
