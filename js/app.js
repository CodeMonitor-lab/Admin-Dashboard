const routes = {
  index:'./index.html',
  dashboard: '/pages/dashboard.html',
  projects: '/pages/projects.html',
  clients: '/pages/clients.html',
  settings: '/pages/settings.html'
};

const contentArea = document.getElementById('content');
let currentRoute = null;

function loadContent(routeKey) {
  const route = routes[routeKey] || routes['dashboard'];
  if (routeKey === currentRoute) return; // Avoid reload
  currentRoute = routeKey;

  fetch(route)
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load ${route}`);
      return response.text();
    })
    .then(html => {
      gsap.to(contentArea, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          contentArea.innerHTML = html;
          gsap.fromTo(contentArea, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        }
      });
    })
    .catch(err => {
      contentArea.innerHTML = `
        <div class="text-red-600">
          <h2 class="text-2xl font-bold">Error Loading Page</h2>
          <p class="mt-2">${err.message}</p>
        </div>
      `;
    });
}

function setupLinks() {
  document.querySelectorAll('aside a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const routeKey = link.getAttribute('href').replace('#', '');
      loadContent(routeKey);
      window.location.hash = routeKey;
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setupLinks();
  const initialRoute = window.location.hash.replace('#', '') || 'dashboard';
  loadContent(initialRoute);
});

window.addEventListener('hashchange', () => {
  const routeKey = window.location.hash.replace('#', '');
  loadContent(routeKey || 'dashboard');
});
