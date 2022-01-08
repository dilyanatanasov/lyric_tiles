import {Injectable} from "@angular/core";
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {delay, mergeMap, materialize, dematerialize} from "rxjs/operators";
import {User} from "../_models/User";

const users: User[] = [{id: 1, username: "dna", password: "P@$$w0rd1", firstName: "Test", lastName: "User"}];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log({request})
    const {url, method, headers, body} = request;

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))

    function handleRoute() {
      switch (true) {
        case url.endsWith("/users/authenticate") && method === "POST":
          return authenticate();
        case url.endsWith("/users") && method === "GET":
          return getUsers();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const {username, password} = body;
      console.log({users});
      console.log({username});
      console.log({password});
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) return error("Username or password is incorrect");
      return ok({
        // @ts-ignore
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      })
    }

    function getUsers() {
      if (!isLoggedIn()) return unauthorized();
      return ok(users);
    }

    // helper functions

    function ok(body?: User[]) {
      return of(new HttpResponse({status: 200, body}))
    }

    function error(message: string) {
      return throwError({error: {message}});
    }

    function unauthorized() {
      return throwError({status: 401, error: {message: "Unauthorised"}});
    }

    function isLoggedIn() {
      return headers.get("Authorization") === `Basic ${window.btoa("dna:P@$$w0rd1")}`;
    }

    return of(null)
      // @ts-ignore
      .pipe(mergeMap(handleRoute))
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
