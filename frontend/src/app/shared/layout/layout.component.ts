import {Component, effect, inject, Injector, OnInit} from '@angular/core';
import {RouterModule} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {AuthService} from "../../core/services/auth.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-layout',
  standalone: true,
    imports: [RouterModule, MatIcon, NgIf],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit{
    authService = inject(AuthService)
    injector = inject(Injector)
    isLoggedIn = false

    logout() {
        this.authService.logout()
    }

    ngOnInit(): void {
        effect(() => {
            this.isLoggedIn = this.authService.isLoggedIn()
        }, {injector: this.injector});
    }
}
