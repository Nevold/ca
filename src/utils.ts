import { IncomingMessage, ServerResponse } from 'http';

export const parseJSONBody = <T>(req: IncomingMessage): Promise<T | null> => {
  return new Promise((resolve) => {
    const decoder = new TextDecoder();
    let buffer = Buffer.from([]);

    req.on('data', (data: Buffer) => {
      buffer = Buffer.concat([buffer, data]);
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(decoder.decode(buffer)));
      } catch {
        resolve(null);
      }
    });
  });
};

export class Utils {
  static sendResponse = (res: ServerResponse, statusCode: number, payload?: unknown): void => {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(statusCode);
    res.end(payload ? JSON.stringify(payload) : '');
  };
}

export const parseUrlParams = (path: string, pattern: string): Record<string, string> | null => {
  const pathParts = path.split('/');
  const patternParts = pattern.split('/');

  if (pathParts.length !== patternParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      const paramName = patternParts[i].substring(1);
      params[paramName] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }

  return params;
};
