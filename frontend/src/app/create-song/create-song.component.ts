import {Component, OnInit} from "@angular/core";
import {Song, SongLyric, SongUrl} from "../../../../interfaces/Song";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router'
import {LYRICS_CATEGORY} from "../../../../enums/LYRICS_CATEGORY";
import {SongService} from "../services/song.service";

@Component({
  selector: "app-create-song",
  templateUrl: "./create-song.component.html",
  styleUrls: ["./create-song.component.scss"]
})
export class CreateSongComponent implements OnInit {
  private id: string = "";
  public song: Song | undefined = {} as Song;
  public form: FormGroup | undefined;
  public parts: SongLyric[] = [];
  public songUrl: SongUrl = "";

  public categoryType = LYRICS_CATEGORY;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    public songService: SongService = new SongService()
  ) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params["id"];
    this.initForm();
  }

  private initForm() {
    this.form = new FormGroup({
      "title": new FormControl("", [Validators.required, Validators.maxLength(15)]),
      "songUrl": new FormControl("", [Validators.required])
    })
  }

  public createSong() {
    this.parts.map((part, index) => {
      return part.content = this.form?.value[`lyric-${index + 1}`]
    })
    const song = {
      "title": this.form?.value.title,
      "lyrics": this.parts,
      "songUrl": this.form?.value.songUrl
    }
    console.log({song})
    this.http.post(`http://localhost:8000/api/song`, song)
      .subscribe((res: any) => {
        this.router.navigateByUrl("");
      })
  }

  public addSection(category: LYRICS_CATEGORY, content?: string) {
    this.form?.addControl(`lyric-${this.parts.length + 1}`, new FormControl("", [Validators.required, Validators.maxLength(15)]));
    this.form?.patchValue({
      [`lyric-${this.parts.length + 1}`]: content ?? ""
    });
    this.parts.push({
      category,
      content: content ?? ""
    })
  }
}

