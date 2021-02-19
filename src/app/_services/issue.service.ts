import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Issue } from '@app/_models/issue.model';

@Injectable({ providedIn: 'root' })
export class AccountServicee {
    private userSubject: BehaviorSubject<Issue>;
    public issue: Observable<Issue>;

    constructor( 
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<Issue>(JSON.parse(localStorage.getItem('user')));
        this.issue = this.userSubject.asObservable();
    }

    public get userValue(): Issue {
        return this.userSubject.value;
    }

    /*login(username, password) {
        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }*/

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    AddIssue(issue: Issue) {
        return this.http.post(`${environment.apiUrl}/users/post`, issue);
    }
    getAll() {
        return this.http.get<Issue[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<Issue>(`${environment.apiUrl}/users/${id}`);
    }

   update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.Id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                /*if (id == this.userValue.Id) {
                    this.logout();
                }*/
                return x;
            }));
    }
}