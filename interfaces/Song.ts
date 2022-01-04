import {CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from "./Generic";
import {LYRICS_CATEGORY} from "../enums/LYRICS_CATEGORY";

export type SongId = string;
export type SongTitle = string;
export type SongTheme = string;
export type SongUrl = string;

export type LyricContent = string;

export type Song = {
  _id: SongId,
  title: SongTitle,
  theme: SongTheme,
  lyrics: SongLyric[],
  songUrl: SongUrl,
  createdBy: CreatedBy,
  createdAt: CreatedAt,
  updatedBy?: UpdatedBy,
  updatedAt?: UpdatedAt
}

export type SongLyric = {
  category: LYRICS_CATEGORY,
  content: LyricContent
}
