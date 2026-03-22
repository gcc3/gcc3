// .markdown/Note.md -> Category-Note
// 01_Category 01_Note.md -> Category-Note
export function toNoteId(category_, note_) {
  const note = note_.replace(/^\d+_/, '')
    .replace('.md', '')
    .replace('.markdown/', '');

  const category = category_.replace(/^\d+_/, '');
  return `${category}-${note}`;
}

// The file name
// 01_Note.md -> Note
// .markdown/Note.md -> Note
export function toNoteTitle(note) {
  return note.replace('.md', '')
    .replace('.markdown/', '')
    .replace(/^\d+_/, '');
}

export function toCategoryTitle(category) {
  return category.replace(/^\d+_/, '');
}
