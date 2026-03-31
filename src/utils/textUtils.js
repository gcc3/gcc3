// .markdown/Note.md -> Category[Note]
// 01_Category 01_Note.md -> Category[Note]
export function toNoteId(category_, note_) {
  let category = category_;

  // Remove leading digits and underscore
  category = category.replace(/^\d+_/, '');

  let note = note_;

  // Remove the `.markdown/` prefix
  note = note.replace('.markdown/', '');

  // Remove leading digits and underscore
  note = note.replace(/^\d+_/, '')

  // Remove the extension
  note = note.replace('.md', '')
    .replace('.MD', '');

  // Replace the whitespace with underscore
  note = note.replace(/\s+/g, '_');

  return `${category}:${note}`;
}

// The file name
// 01_Note.md -> Note
// .markdown/Note.md -> Note
export function toNoteTitle(note_) {
  let note = note_;

  // Remove the `.markdown/` prefix
  note = note.replace('.markdown/', '');

  // Remove leading digits and underscore
  note = note.replace(/^\d+_/, '')

  // Remove the extension
  note = note.replace('.MD', '').replace('.md', '');

  return note;
}

export function toCategoryId(category_) {
  let category = category_;

  // Remove leading digits and underscore
  category = category.replace(/^\d+_/, '');

  // Replace the whitespace with underscore
  category = category.replace(/\s+/g, '_');

  return category + ":";
}

export function toCategoryTitle(category_) {
  let category = category_;

  // Remove leading digits and underscore
  category = category.replace(/^\d+_/, '');

  return category + ":";
}
