// .markdown/Note.md -> Category[Note]
// 01_Category 01_Note.md -> Category[Note]
export function toNoteId(category_, note_) {
  let category = category_;
  let note = note_;
  return `${category}:${note}`;
}

// The file name
// 01_Note.md -> Note
// .markdown/Note.md -> Note
export function toNoteTitle(note_) {
  let note = note_;

  // Remove leading digits and underscore
  note = note.replace(/^\d+_/, '')

  // Remove the extension
  note = note.replace('.MD', '').replace('.md', '');

  // Remove the `.markdown/` prefix
  note = note.replace('.markdown/', '');

  return note;
}

export function toCategoryId(category_) {
  let category = category_;
  return category + ":";
}

export function toCategoryTitle(category_) {
  let category = category_;

  // Remove leading digits and underscore
  category = category.replace(/^\d+_/, '');

  return category + ":";
}


export function pathToContent(path, defaultContent) {
  let content = defaultContent;

  if (path.includes(":")) {
    const colonIndex = path.indexOf(":");
    const category = path.slice(0, colonIndex);
    const note = path.slice(colonIndex + 1);

    let type = "null";
    if (note) {
      type = "note";
    } else {
      type = "category";
    }
    content = `[${type}]${category}:${note}`;
  }

  return content;
}
