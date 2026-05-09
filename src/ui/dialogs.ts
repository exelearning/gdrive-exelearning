export type ConflictChoice = 'overwrite' | 'copy' | 'cancel';

export function confirmOverwriteRemoteChange(filename: string): ConflictChoice {
  const overwrite = window.confirm(
    `"${filename}" has changed in Google Drive since it was opened.\n\nPress OK to overwrite the Drive file, or Cancel to choose another option.`,
  );
  if (overwrite) {
    return 'overwrite';
  }

  const copy = window.confirm('Save the editor contents as a new copy instead? Press Cancel to stop saving.');
  return copy ? 'copy' : 'cancel';
}

export function showError(message: string): void {
  window.alert(message);
}
