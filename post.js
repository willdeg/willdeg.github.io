(() => {
  const body = document.querySelector('.post-body');
  const notes = [...document.querySelectorAll('.margin-note')];
  const dialog = document.querySelector('#note-dialog');
  if (!body || !notes.length || !dialog || typeof dialog.showModal !== 'function') return;
  const wide = matchMedia('(min-width: 1120px)');
  let opener;
  document.documentElement.classList.add('notes-enhanced');

  function positionNotes() {
    body.style.minHeight = '';
    notes.forEach(note => note.style.top = '');
    if (!wide.matches) return;
    const origin = body.getBoundingClientRect().top;
    let bottom = 0;
    notes.forEach((note, index) => {
      const ref = document.getElementById(`note-ref-${index + 1}`);
      const top = Math.max(ref.getBoundingClientRect().top - origin - 4, bottom);
      note.style.top = `${top}px`;
      bottom = top + note.offsetHeight + 28;
    });
    body.style.minHeight = `${bottom}px`;
  }
  notes.forEach((note, index) => {
    const ref = document.getElementById(`note-ref-${index + 1}`);
    ref.addEventListener('click', event => {
      if (wide.matches) return; // Native anchors keep desktop notes linkable.
      event.preventDefault();
      opener = ref;
      document.getElementById('note-dialog-title').textContent = `Note ${index + 1}`;
      document.getElementById('note-dialog-content').innerHTML = note.querySelector('.note-content').innerHTML;
      dialog.showModal();
      document.body.classList.add('note-is-open');
    });
  });
  dialog.querySelector('.note-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('note-is-open');
    opener?.focus({preventScroll: true});
  });
  wide.addEventListener('change', () => {
    if (dialog.open) dialog.close();
    positionNotes();
  });
  let frame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(positionNotes);
  });
  document.fonts.ready.then(positionNotes);
  document.querySelectorAll('.article-figure img').forEach(image => image.addEventListener('load',positionNotes));
  positionNotes();
})();
