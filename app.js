// Render the headings and paragraphs used by this repository's README.
// Serve this directory over HTTP so the browser can fetch README.md.
async function loadStory() {
  const container = document.getElementById('story');

  try {
    const response = await fetch('README.md');
    if (!response.ok) throw new Error(`Story request failed: ${response.status}`);

    const markdown = await response.text();
    const fragment = document.createDocumentFragment();

    for (const block of markdown.trim().split(/\r?\n\s*\r?\n/)) {
      const heading = block.match(/^(#{1,2})\s+([\s\S]+)$/);
      const element = document.createElement(heading ? `h${heading[1].length}` : 'p');
      if (heading) {
        element.textContent = heading[2];
      } else if (block.startsWith('*') && block.endsWith('*')) {
        const emphasis = document.createElement('em');
        emphasis.textContent = block.slice(1, -1);
        element.append(emphasis);
      } else {
        element.textContent = block;
      }
      fragment.append(element);
    }

    container.replaceChildren(fragment);
  } catch (error) {
    const message = document.createElement('p');
    message.textContent = 'Unable to load the story. Serve this folder over HTTP, or open README.md directly.';
    const link = document.createElement('a');
    link.href = 'README.md';
    link.textContent = 'Read README.md';
    container.replaceChildren(message, link);
    console.error(error);
  } finally {
    container.setAttribute('aria-busy', 'false');
  }
}

loadStory();
