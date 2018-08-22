class Router {
  constructor(routes, root) {
    this.routes = routes;
    this.root = document.getElementById(root);
  }

  init() {
    window.addEventListener('hashchange', () => this.hashChange());
    this.hashChange();
  }
  hashChange() {
    if(location.hash.length > 0) {
      this.routes.forEach((r) => {
        if(r.isActiveRoute(location.hash)) {
          this.follow(r.htmlFileName);
        }
      });
    } else {
      this.routes.forEach((r) => {
        if(r.isHome) {
          this.follow(r.htmlFileName);
        }
      })
    }
  }
  follow(path) {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', `${path}`);
      xhr.onloadend = () => {
          this.root.innerHTML = xhr.responseText;
      };
      xhr.onerror = function() {
          console.log(xhr.status);
      };
      xhr.send();
  }
}