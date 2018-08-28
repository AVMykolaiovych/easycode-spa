const router = new Router([
    new Route('', 'index.html', true),
    new Route('login', 'views/login.html'),
    new Route('sign_in', 'views/sign_in.html'),
    new Route('home', 'views/home.html'),
    new Route('new_task', 'views/new_task.html'),
], 'app');

router.init();

