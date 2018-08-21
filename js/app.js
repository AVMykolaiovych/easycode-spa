const router = new Router([
  new Route('home', 'views/home.html'),
  new Route('new_task', 'views/new_task.html'),
  new Route('login', 'views/login.html', true),
  new Route('sign_in', 'views/sign_in.html')
], 'app');

router.init();


/**
 * window => hashchange (часть урла после # изменилась);
 * проверяем location.hash - id указанное в href элемента ссылки куда кликнули
 * когда создавали файлы с контентом их имена совпадали с href значениями
 * ajax файловую систему по относительному пути, соответствующему кликнутому href
 * ответ => innerHTML <div id="app"></div>
 *
 */

