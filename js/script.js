const BASE_URI = 'http://localhost:8000';

class FormHandler {
	constructor(form) {
		this.form = form;
		this.controls = this.form.elements;
	}
}

class LoginFormHandler extends FormHandler {
	constructor(form) {
		super(form);
		console.log(form)
		Array.from(this.controls).forEach(el => el.addEventListener('blur', this.validate));
		this.form.addEventListener('submit', this.onsubmit.bind(this));
	}

	validate(e) {
		if(e.target.tagName === 'BUTTON') return true;
		e.target.classList.remove('border-danger');

		if(!e.target.value) {
			e.target.classList.add('border-danger');
			return false;
		}

		const regexp = new RegExp(e.target.dataset.reg);
		if(!regexp.test(e.target.value)) {
			e.target.classList.add('border-danger');
			return false;
		}

		return true;
	}

	onsubmit(e) {
		e.preventDefault();


	}
}


class SignInFormHandler extends FormHandler{
	constructor(form) {
		super(form);
		console.log(form)
		Array.from(this.controls).forEach(el => el.addEventListener('blur', this.validate));
		this.form.addEventListener('submit', this.onsubmit.bind(this));
	}

	validate(e) {
        const password = this.form[1];
        const repeatPassword = this.form[2];
		if(e.target.tagName === 'BUTTON') return true;
		e.target.classList.remove('border-danger');

		if(!e.target.value) {
			e.target.classList.add('border-danger');
			return false;
		}

		const regexp = new RegExp(e.target.dataset.reg);
		if(!regexp.test(e.target.value)) {
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
		controls.forEach(el => this.validate({ target: el }));
		const valid = controls.every(el => !el.classList.contains('border-danger'));
		const email = this.form.email.value;
		const password = this.form.password.value;
		if(valid) {

            const xhr = new XMLHttpRequest();
            const body = JSON.stringify({ email, password });

            xhr.open('POST', `${BASE_URI}/user/register`);
			xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.withCredentials = true;
            xhr.onloadend = function() {
            	console.log(xhr.status);
			};
            xhr.onreadystatechange = function() {
				location.replace('views/login.html')
			};
            xhr.onerror = function () {
                console.log(xhr.status);
            };
            xhr.send(body);
        }

	}
}

// window.addEventListener('hashchange', () => {
//         if (location.href === 'http://localhost:63342/easycode-spa/index.html#login') {
//
//         }
//         if (location.href === 'http://localhost:63342/easycode-spa/index.html#sign_in') {
//             const signInFormHandler = new SignInFormHandler(document.forms[0]);
//         }
// });

document.querySelector('a[href="#login"]').addEventListener('click', () => new LoginFormHandler(document.forms[0]));
document.querySelector('a[href="#sign_in"]').addEventListener('click', () => new SignInFormHandler(document.forms[0]));




