import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SongLyricsListComponent } from "./song-lirics-list/song-lyrics-list.component";
import {SongManagementComponent} from "./song-management/song-management.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./_helpers/auth.guard";

const routes: Routes = [
  { path: "", component: SongLyricsListComponent, canActivate: [AuthGuard] },
  { path: "songs/:type", component: SongManagementComponent },
  { path: "songs/:type/:id", component: SongManagementComponent },
  { path: 'login', component: LoginComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
