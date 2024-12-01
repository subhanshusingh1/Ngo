import winston from 'winston';

// Define custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

// Create winston logger
const logger = winston.createLogger({
  level: 'info', 
  format: logFormat,
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
    // File transport for production logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      level: 'info',
    }),
    // Error file transport
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
});

export default logger;
