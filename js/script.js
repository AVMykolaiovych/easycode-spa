class SignInFormHandler {
	constructor(form) {
		this.form = form;
		this.controls = this.form.elements;
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

	}
}

class LoginFormHandler {
	constructor(form) {
		this.form = form;
		this.controls = this.form.elements;
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

window.onload = function() {
    const signInFormHandler = new SignInFormHandler(document.forms[0]);
    const loginFormHandler = new LoginFormHandler(document.forms[0]);
};

