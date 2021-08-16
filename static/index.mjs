import * as rts from './rts.mjs';
import module from './wasm-pandoc.wasm.mjs';
import req from './wasm-pandoc.req.mjs';

async function handleModule(m) {

  const asterius = await rts.newAsteriusInstance(Object.assign(req, { module: m }));

  let from = 'markdown';
  let to = 'html';

  const toMode = function(format) {
    if (format === 'html') {
        return 'xml';
    }
    if (format === 'latex') {
        return 'stex';
    }
    return format;
  }

  const input = CodeMirror.fromTextArea(document.getElementById('input-text'), {
    lineNumbers: true,
    lineWrapping: true,
    mode: toMode(from),
  });
  input.setSize(null, '100%');

  const output = CodeMirror.fromTextArea(document.getElementById('output-text'), {
    lineNumbers: true,
    lineWrapping: true,
    mode: toMode(to),
    readOnly: true,
  });
  output.setSize(null, '100%');

  const convert = async function() {
    const inputString = input.getValue();
    try {
      const outputString = await asterius.exports.convert(from, to, inputString);
      if (outputString) {
        output.setValue(outputString);
      }
    } catch (err) {
      console.error(err);
    }
  }

  input.on('change', async function(cm, change) {
    await convert();
  });

  const fromButton = document.getElementById('from-button');
  const toButton = document.getElementById('to-button');

  document.getElementById('from-markdown').onclick = async function() {
    from = 'markdown';
    fromButton.innerHTML = 'Markdown <i class="icon icon-caret"</i>';
    input.setOption('mode', toMode(from));
    input.setValue(defaultMarkdown);
    await convert();
  };

  document.getElementById('from-html').onclick = async function() {
    from = 'html';
    fromButton.innerHTML = 'HTML <i class="icon icon-caret"</i>';
    input.setOption('mode', toMode(from));
    input.setValue(defaultHTML);
    await convert();
  };

  document.getElementById('from-latex').onclick = async function() {
    from = 'latex';
    fromButton.innerHTML = 'LaTeX <i class="icon icon-caret"</i>';
    input.setOption('mode', toMode(from));
    input.setValue(defaultLaTeX);
    await convert();
  };

  document.getElementById('to-markdown').onclick = async function() {
    to = 'markdown';
    toButton.innerHTML = 'Markdown <i class="icon icon-caret"</i>';
    output.setOption('mode', toMode(to));
    await convert();
  };

  document.getElementById('to-html').onclick = async function() {
    to = 'html';
    toButton.innerHTML = 'HTML <i class="icon icon-caret"</i>';
    output.setOption('mode', toMode(to));
    await convert();
  };

  document.getElementById('to-latex').onclick = async function() {
    to = 'latex';
    toButton.innerHTML = 'LaTeX <i class="icon icon-caret"</i>';
    output.setOption('mode', toMode(to));
    await convert();
  };

  const defaultMarkdown = `Pandoc in Wasm
==============

This convertor is powered by [Asterius](https://github.com/tweag/asterius).

Supported Formats
-----------------

* Markdown
* HTML
* LaTeX

How to Serve Locally
--------------------

1. \`git clone https://github.com/y-taka-23/wasm-pandoc\`
1. \`cd wasm-pandoc\`
1. \`make start\`
`;

  const defaultHTML = `<h1>Pandoc in Wasm</h1>

<p>This convertor is powered by <a href="https://github.com/tweag/asterius">Asterius</a>.</p>

<h2>Supported Formats</h2>

<ul>
  <li>Markdown</li>
  <li>HTML</li>
  <li>LaTeX</li>
</ul>

<h2>How to Serve Locally</h2>

<ol>
  <li><code>git clone https://github.com/y-taka-23/wasm-pandoc</code></li>
  <li><code>cd wasm-pandoc</code></li>
  <li><code>make start</code></li>
</ol>
`;

  const defaultLaTeX = `\\section{Pandoc in Wasm}

This convertor is powered by \\href{https://github.com/tweag/asterius}{Asterius}.

\\subsection{Supported Formats}

\\begin{itemize}
  \\item Markdown
  \\item HTML
  \\item LaTeX
\\end{itemize}

\\subsection{How to Serve Locally}

\\begin{enumerate}
  \\item \\texttt{git\\ clone\\ https://github.com/y-taka-23/wasm-pandoc}
  \\item \\texttt{cd\\ wasm-pandoc}
  \\item \\texttt{make\\ start}
\\end{enumerate}
`;

  input.setValue(defaultMarkdown);
}

module.then(handleModule);
