import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'convohub-server' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Always log to console for visibility in cloud platforms
logger.add(new winston.transports.Console({
  format: winston.format.combine(
    process.env.NODE_ENV !== 'production' ? winston.format.colorize() : winston.format.simple(),
    winston.format.simple()
  ),
}));

export default logger;
