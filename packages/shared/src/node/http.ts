import http from 'node:http';

export function httpListenAsync(server: http.Server, port: number) {
  return new Promise<void>((resolve) => server.listen(port, resolve));
}

export function httpGetAsync(url: string) {
  return new Promise<http.IncomingMessage>((resolve, reject) => {
    http.get(url, resolve).on('error', reject);
  });
}

export function httpCloseAsync(server: http.Server) {
  return new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
