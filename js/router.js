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
        if (location.hash.length > 0) {
            this.routes.forEach((r) => {
                if (r.isActiveRoute(location.hash)) {
                    this.follow(r.htmlFileName);
                }
            });
        } else {
            this.routes.forEach((r) => {
                if (r.isHome) {
                    this.follow(r.htmlFileName);
                }
            })
        }
    }

    follow(path) {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', `${path}`);
        xhr.onloadend = () => {
            switch (location.hash) {
                case '#login':
                    this.root.innerHTML = xhr.responseText;
                    const login = new LoginFormHandler(document.forms['login']);
                    break;
                case '#sign_in':
                    this.root.innerHTML = xhr.responseText;
                    const signIn = new SignInFormHandler(document.forms['signIn']);
                    break;
                case '#home':
                    this.root.innerHTML = xhr.responseText;
                    document.querySelector('nav.home-header').style.display = 'block';
                    document.querySelector('nav.index-header').style.display = 'none';
                    const taskList = new HomePageHandler(document.querySelector('.card-columns'));
                    taskList.getTaskList();
                    sessionStorage.removeItem('edit');
                    break;
                case '#new_task':
                    this.root.innerHTML = xhr.responseText;
                    document.querySelector('nav.home-header').style.display = 'block';
                    document.querySelector('nav.index-header').style.display = 'none';
                    document.querySelector('nav.home-header .add').style.display = 'none';
                    const newTask = new NewTaskFormHandler(document.forms['newTask']);
                    break;
                case '':
                    this.root.innerHTML = xhr.responseText;
                    sessionStorage.removeItem('userId');
                    break;
            }
        };
        xhr.send();
    }
}