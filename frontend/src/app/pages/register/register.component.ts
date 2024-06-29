import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from "@angular/common";
import {AuthService} from "../../core/services/auth.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-register',
  standalone: true,
    imports: [
        NgClass,
        ReactiveFormsModule
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
    public form: FormGroup
    authService = inject(AuthService)
    router = inject(Router)

    constructor() {
        this.initForm()
    }

    public submit() :void {
        if (this.form.valid) {
            const phoneNumberWithPrefix = '+993' + this.form.value.phoneNumber;

            const formValueWithPrefix = {
                ...this.form.value,
                phoneNumber: phoneNumberWithPrefix
            };

            this.authService.register(formValueWithPrefix).subscribe({
                next: response => {
                    this.router.navigate(["login"])
                }
            })
        }
    }

    private initForm() :void {
        this.form = new FormGroup<any>({
            phoneNumber: new FormControl(null, [Validators.required, Validators.pattern(/^(61|62|63|64|65|71)\d{6}$/)]),
            email: new FormControl(null, [Validators.required, Validators.email]),
            password: new FormControl(null, [Validators.required, Validators.minLength(5)])
        })
    }

}
