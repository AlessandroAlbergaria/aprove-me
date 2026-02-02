export default () => ({
  port: +(process.env.PORT || 3000),
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL,
    queue: process.env.RABBITMQ_QUEUE,
    dlq: process.env.RABBITMQ_DLQ,
  },
});
