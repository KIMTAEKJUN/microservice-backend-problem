import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || 'unknown';

    this.logger.log(`[${method}] ${originalUrl} - ${ip} - ${userAgent}`);

    const originalEnd = res.end;

    res.end = function (...args) {
      const requestDate = new Date().toLocaleString();
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;

      if (statusCode >= 400) {
        this.logger.error(`응답 오류 [${requestDate}] [${method}] ${originalUrl} - ${responseTime}ms`);
      } else {
        this.logger.log(`응답 성공 [${requestDate}] [${method}] ${originalUrl} - ${responseTime}ms`);
      }
      originalEnd.apply(res, args);
    }.bind(this);

    next();
  }
}
