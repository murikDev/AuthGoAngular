import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {User} from "../../core/model/common.model";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
    authService = inject(AuthService)
    user: User

    ngOnInit(): void {
        this.authService.user().subscribe({
            next: (response) => {
                this.user = response.data
            }
        })
    }


}
