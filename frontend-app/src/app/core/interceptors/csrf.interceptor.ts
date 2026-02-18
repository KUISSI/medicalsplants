import { HttpInterceptorFn } from '@angular/common/http';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  // Récupère le token CSRF depuis le cookie (nommé 'XSRF-TOKEN' par défaut)
  const csrfToken = getCookie('XSRF-TOKEN');
  // Ajoute le token uniquement pour les requêtes sensibles
  if (csrfToken && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const cloned = req.clone({
      headers: req.headers.set('X-CSRF-Token', csrfToken)
    });
    return next(cloned);
  }
  return next(req);
};

// Fonction utilitaire pour lire un cookie
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}