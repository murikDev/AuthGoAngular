import {Component, inject} from '@angular/core';
import {NgClass} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../core/services/auth.service";
import {routes} from "../../app.routes";

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
        NgClass,
        RouterLink,
        ReactiveFormsModule
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
    public form: FormGroup
    authService = inject(AuthService)
    router = inject(Router)

    constructor() {
        this.initForm()
    }

    public sumbit() :void {
       if (this.form.valid) {
           this.authService.login(this.form.value).subscribe({
               next: response => {
                  if (response.status) {
                      this.router.navigate([''])
                  }
               }
           })
       }
    }

    private initForm() :void {
        this.form = new FormGroup<any>({
            email: new FormControl(null, [Validators.required, Validators.email]),
            password: new FormControl(null, [Validators.required, Validators.minLength(5)])
        })
    }
}
