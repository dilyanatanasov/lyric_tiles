import {LYRICS_CATEGORY} from "../../../../enums/LYRICS_CATEGORY";

export class SongService {
  constructor() {
  }

  public getCategoryClass(category: LYRICS_CATEGORY) {
    switch (category) {
      case LYRICS_CATEGORY.MAIN:
        return LYRICS_CATEGORY.MAIN;
      case LYRICS_CATEGORY.PREMAIN:
        return LYRICS_CATEGORY.PREMAIN;
      case LYRICS_CATEGORY.SECTION:
        return LYRICS_CATEGORY.SECTION
    }
  }
}
