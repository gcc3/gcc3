export function toNoteId(cat, note) {
  return `${cat}-${note}`
    .replace('.md', '')
    .replace('.markdown/', '')
    .replace(/^\d+_/, '');
}

export function toNoteTitle(note) {
  return note.replace('.md', '')
    .replace('.markdown/', '')
    .replace(/^\d+_/, '');
}
