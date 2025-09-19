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
