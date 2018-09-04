const BASE_URI = 'http://localhost:8000';

class LoginFormHandler {
    constructor(form) {
        this.form = form;
        this.controls = this.form.elements;
        Array.from(this.controls).forEach(el => el.addEventListener('blur', this.validate));
        this.form.addEventListener('submit', this.onsubmit.bind(this));
    }

    validate(e) {
        const regexp = new RegExp(e.target.dataset.reg);

        if (e.target.tagName === 'BUTTON') return true;
        e.target.classList.remove('border-danger');

        if (!e.target.value) {
            e.target.classList.add('border-danger');
            return false;
        }

        if (!regexp.test(e.target.value)) {
            e.target.classList.add('border-danger');
            return false;
        }
        return true;
    }

    onsubmit(e) {
        e.preventDefault();

        const controls = Array.from(this.controls);
        controls.forEach(el => this.validate({target: el}));
        const valid = controls.every(el => !el.classList.contains('border-danger'));
        const email = this.form.email.value;
        const password = this.form.password.value;

        if (valid) {
            const xhr = new XMLHttpRequest();
            const body = JSON.stringify({email, password});

            xhr.open('POST', `${BASE_URI}/user/login`);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.withCredentials = true;
            xhr.onloadend = () => sessionStorage.setItem('userId', xhr.responseText);
            xhr.onreadystatechange = function () {
                location.hash = '#home';
            };
            xhr.send(body);
        }
    }
}

class SignInFormHandler {
    constructor(form) {
        this.form = form;
        this.controls = this.form.elements;
        Array.from(this.controls).forEach(el => el.addEventListener('blur', this.validate));
        this.form.addEventListener('submit', this.onsubmit.bind(this));
    }

    validate(e) {
        const regexp = new RegExp(e.target.dataset.reg);
        const password = this.form[1];
        const repeatPassword = this.form[2];

        if (e.target.tagName === 'BUTTON') return true;
        e.target.classList.remove('border-danger');

        if (!e.target.value) {
            e.target.classList.add('border-danger');
            return false;
        }

        if (!regexp.test(e.target.value)) {
            e.target.classList.add('border-danger');
            return false;
        }

        if (password.value !== repeatPassword.value) {
            repeatPassword.classList.add('border-danger');
            return false;
        }
        return true;
    }

    onsubmit(e) {
        e.preventDefault();

        const controls = Array.from(this.controls);
        controls.forEach(el => this.validate({target: el}));
        const valid = controls.every(el => !el.classList.contains('border-danger'));
        const email = this.form.email.value;
        const password = this.form.password.value;

        if (valid) {
            const xhr = new XMLHttpRequest();
            const body = JSON.stringify({email, password});

            xhr.open('POST', `${BASE_URI}/user/register`);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.withCredentials = true;
            xhr.onreadystatechange = function () {
                location.hash = '#login'
            };
            xhr.send(body);
        }
    }
}

class HomePageHandler {
    constructor(home) {
        this.home = home;
        this.controls = this.home.children;
        this.getTaskList = this.getTaskList.bind(this);
        this.showTaskList = this.showTaskList.bind(this);
    }

    getTaskList() {
        const xhr = new XMLHttpRequest();
        const body = JSON.stringify({user_id: sessionStorage.getItem('userId')});

        xhr.open('POST', `${BASE_URI}/task/all`);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.withCredentials = true;
        xhr.onloadend = () => {
            const tasks = JSON.parse(xhr.responseText);
            this.showTaskList(tasks);
        };
        xhr.send(body);
    }

    showTaskList(tasks) {
        this.home.innerHTML = tasks.map((task) => {
            return `
    		<div class="card mb-5 text-white bg-secondary">
				<div class="card-header">
               		<h5 data-id=${task.id} class="card-title">${task.header}</h5>
            	</div>
        		<div class="card-body">
        			<p class="card-text ">${task.details}</p>
        		</div>
        		<div class="card-footer">
               		<div class="d-flex justify-content-around">
                   		<a data-id=${task.id} data-target="edit" class="header-control-btn">Edit</a>
                   		<a data-id=${task.id} data-target="delete" class="header-control-btn">Delete</a>
               		</div>
            	</div>
    		</div>`
        }).join('');
        this.init();
    }

    deleteTask(e) {
        if (e.target.dataset.target === 'delete') {
            const id = e.target.dataset.id;
            const xhr = new XMLHttpRequest();

            xhr.open('GET', `${BASE_URI}/task/one/${id}`);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.withCredentials = true;
            xhr.onloadend = function () {
                location.hash = '#home'
            };
            xhr.send();
        }
    }

    editTask(e) {
        if (e.target.dataset.target === 'edit') {
            const id = e.target.dataset.id;
            const xhr = new XMLHttpRequest();

            xhr.open('GET', `${BASE_URI}/task/one/${id}`);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.withCredentials = true;
            xhr.onloadend = function () {
                const task = JSON.parse(xhr.responseText);
                sessionStorage.setItem('edit', JSON.stringify(task));
                location.hash = '#new_task';
            };
            xhr.send();
        }
    }

    logout() {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', `${BASE_URI}/user/logout`);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.withCredentials = true;
        xhr.onreadystatechange = function () {
            location.hash = ''
        };
        xhr.send();
    }

    init() {
        document.querySelector('.logout').addEventListener('click', this.logout);
        Array.from(this.controls).forEach(el => el.addEventListener('click', this.deleteTask.bind(this)));
        Array.from(this.controls).forEach(el => el.addEventListener('click', this.editTask.bind(this)));
    }
}

class NewTaskFormHandler {
    constructor(form) {
        this.form = form;
        this.form.addEventListener('submit', this.onsubmit.bind(this));
        this.editTask();
    }

    editTask() {
        const editingTask = JSON.parse(sessionStorage.getItem('edit'));
        if (editingTask) {
            let date = editingTask.date
            date = date.substring(1, 11)
            this.form.header.value = editingTask.header;
            this.form.details.value = editingTask.details;
            this.form.deadline.value = date;
        }
    }

    onsubmit(e) {
        e.preventDefault();
        const editingTask = JSON.parse(sessionStorage.getItem('edit'));
        const inputDate = this.form[2].value;
        const taskDate = new Date(inputDate);
        const task = {
            user_id: sessionStorage.getItem('userId'),
            header: this.form[0].value,
            details: this.form[1].value.substring(0, 16),
            date: JSON.stringify(taskDate),
        };
        const xhr = new XMLHttpRequest();
        const body = JSON.stringify(task);
        if (editingTask) {
            xhr.open('PUT', `${BASE_URI}/task/${editingTask.id}`);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.withCredentials = true;
            xhr.onreadystatechange = function () {
                document.querySelector('nav.home-header .add').style.display = 'inline-block';
                location.hash = '#home'
            };
            xhr.send(body);
        } else {
            xhr.open('POST', `${BASE_URI}/task/add`);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.withCredentials = true;
            xhr.onreadystatechange = function () {
                document.querySelector('nav.home-header .add').style.display = 'inline-block';
                location.hash = '#home'
            };
            xhr.send(body);
        }
    }
}







