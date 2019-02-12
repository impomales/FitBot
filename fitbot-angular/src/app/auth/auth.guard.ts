import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let url: string = state.url
    return this.checkLogin(url)
  }

  checkLogin(url) {
    if (this.authService.isLoggedIn) return true;

    this.authService.redirectUrl = url;

    this.router.navigate(['/login']);

    return false;
  }
}
