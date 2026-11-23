export function isPersonalPage(pathname: string) {
  return ['/auth', '/reset-password', '/assistant', '/admin'].includes(pathname.replace(/\/$/, '')) || pathname.startsWith('/admin/');
}
export function applyIndexingPolicy(request: Request, response: Response) {
  if (!isPersonalPage(new URL(request.url).pathname)) return response;
  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}