import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { SPASHIP_ROUTER_HOST } from '../config/env';
import logger from '../utils/logger';

const useSecureSSL = process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0";

function resolver ( req: Request, res: Response, next: NextFunction ): void {
  const proxy = createProxyMiddleware( {
    target: SPASHIP_ROUTER_HOST,
    secure: useSecureSSL,
    changeOrigin: true,
    toProxy: true,
    ignorePath: false,
    headers: {
      'X-OP-Authenticated': req.oidc.isAuthenticated() ? 'true' : 'false',
    },
    logProvider: logger.info
  } );

  proxy( req, res, next );
}

export default resolver;
