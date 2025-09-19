// Utilities
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const out = $('#output');
const preview = $('#preview');
const STORAGE_KEY = 'academy-codelab-web';

const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt',
        '"': '&quot',
      }[c])
  );

function log(msg, type = 'info') {
  const color =
    type === 'error'
      ? 'var(--err)'
      : type === 'warn'
      ? 'var(--warn)'
      : 'var(--brand)';

  const time = new Date().toLocaleTimeString();

  const line = document.createElement('div');

  line.innerHTML = `<span style="color:${color}">[${time}]</span> ${escapeHtml(
    msg
  )}`;

  out.appendChild(line);
  out.scrollTop = out.scrollHeight;
}

function clearOut() {
  out.innerHTML = '';
}

$('#clearOut')?.addEventistener('click', clearOut);

// === ACE EDITOR
function makeEditor(id, more) {
  const ed = ace.edit(id, {
    theme: 'ace/theme/dracula',
    mode,
    tabSize: 2,
    useSoftTabs: true,
    showPrintMargin: false,
    wrap: true,
  });

  ed.session.setUseWrapMode(true);
  ed.commands.addCommand({
    name: 'run',
    bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
    exec() {
      runWeb(false);
    },
  });

  ed.commands.addCommand({
    name: 'save',
    bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
    exec() {
      saveProject();
    },
  });

  return ed;
}

const ed_html = makeEditor('ed_html', 'ace/mode/html');
const ed_css = makeEditor('ed_css', 'ace/mode/css');
const ed_js = makeEditor('ed_js', 'ace/mode/javascript');

// ===== Tabs
const TABS_ORDER = ['html', 'css', 'js'];
const wraps = Object.fromEntries(
  $$('#webEditors .editor-wrap').map((w) => [w.dataset.pane, w])
);

const editors = { html: ed_html, css: ed_css, js: ed_js };

function activePane() {
  const t = $('#webTabs .tab.active');
  return t ? t.dataset.pane : 'html';
}

function showPane(name) {
  TAB_ORDER.forEach((k) => {
    if (wraps[k]) wraps[k].hidden = k !== name;
  });
  $$('#webTabs .tab').forEach((t) => {
    const on = t.dataset.pane === name;
    t.classList.toggle('active', on);
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
  });

  requestAnimationFrame(() => {
    const ed = editors[name];
    if (ed && ed.resize) {
      ed.resize(true);
      ed.focus();
    }
  });
}

$('#webTabs')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab');
  if (!btn) return;
  showPane(btn.dataset.pane);
});

$('#webTabs')?.addEventListener('keydown', (e) => {
  const idx = TAB_ORDER.indexOf(activePane());
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const delta = e.key === 'ArrowLeft' ? -1 : 1;
    showPane(TAB_ORDER[(idx + delta + TAB_ORDER.length) % TAB_ORDER.length]);
    e.preventDefault();
  }
});

showPane('html');

// ==== PREVIEW
function buildWebSrcdoc(withTests = false) {
  const html = ed_html.getValue();
  const css = ed_css.getValue();
  const js = ed_js.getValue();
  const tests = ($('#testArea')?.value || '').trim();

  return `<!doctype html>
  
  <html lang="en" dir="ltr">
  


<head>

<meta charset="utf-8">

<meta name="viewport" content="width=device-width,initial-scale=1">


<style>${css}\n</style></head>

<body>${html}

<script>

try{

${js}

${withTests && tests ? `\n/* tests */\n${tests}` : ''}

}catch(e){console.error(e)}<\/script>

</body>

</html>`;
}

function runWeb(withTests = false) {
  preview.srcdoc = buildWebSrcdoc(withTests);
  log(withTests ? 'Run with tests.' : 'Web preview updated.');
}

$('#runWeb')?.addEventListener('click', () => runWeb(false));

$('#runTests')?.addEventListener('click', () => runWeb(true));

$('#openPreview')?.addEventListener('click', () => {
  const src = buildWebSrcdoc(false);

  const w = window.open('about:blank');

  w.document.open();
  w.document.write(src);
  w.document.close();
});
