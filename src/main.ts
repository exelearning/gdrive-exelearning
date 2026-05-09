import { renderCreate } from './pages/create';
import { renderHome } from './pages/home';
import { renderOpen } from './pages/open';
import './style.css';

const root = document.querySelector<HTMLElement>('#app');
if (!root) {
  throw new Error('Missing #app root element.');
}

try {
  const path = normalizeRoute(window.location.pathname);
  if (path === '/open') {
    await renderOpen(root);
  } else if (path === '/create') {
    await renderCreate(root);
  } else {
    renderHome(root);
  }
} catch (error) {
  root.innerHTML = `<main class="app-shell"><h1>gdrive-exelearning</h1><p class="status" data-kind="error">${escapeHtml(error instanceof Error ? error.message : String(error))}</p></main>`;
}

function normalizeRoute(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (base && pathname.startsWith(base)) {
    return pathname.slice(base.length) || '/';
  }
  return pathname || '/';
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[char] ?? char;
  });
}
