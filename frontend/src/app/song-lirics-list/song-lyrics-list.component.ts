import {Component, OnInit} from "@angular/core";
import {Song} from "../../../../interfaces/Song";
import {HttpClient} from "@angular/common/http";
import {FormControl, FormGroup} from "@angular/forms";
import {first} from "rxjs";
import {UserService} from "../_services/user.service";
import {User} from "../_models/User";
import {Router} from "@angular/router";
import {AuthenticationService} from "../_services/authentication.service";

@Component({
  selector: "app-song-lyrics-list",
  templateUrl: "./song-lyrics-list.component.html",
  styleUrls: ["./song-lyrics-list.component.scss"]
})
export class SongLyricsListComponent implements OnInit {
  public songList: Song[] = [];
  public formGroup: FormGroup = new FormGroup({
    title: new FormControl("")
  })
  loading = false;
  users: User[] | undefined;
  user: User | undefined;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.user.subscribe(x => this.user = x);
  }

  ngOnInit(): void {
    this.loading = true;
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.loading = false;
      this.users = users;
      this.getAllSongs();
    });
  }

  private getAllSongs(title?: string) {
    let body = {};
    if (title) body = {"title": this.formGroup?.value.title}
    this.http.get("http://localhost:8000/api/song/", {
      headers: body
    })
      .subscribe((songs: any) => {
        this.songList = songs.songs;
      })
  }

  public search() {
    this.getAllSongs(this.formGroup.value.title);
  }

  public deleteSong(id: string) {
    this.http.delete(`http://localhost:8000/api/song/${id}`)
      .subscribe((songs: any) => {
        this.getAllSongs();
      })
  }

  public handleKeyUp(e: any) {
    if (e.keyCode === 13) {
      this.search();
    }
  }

  logout() {
    this.authenticationService.logout();
  }
}
