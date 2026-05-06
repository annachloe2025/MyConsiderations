// 読み上げボタン (Web Speech API)
// Material for MkDocs の navigation.instant に対応するため、
// ページ遷移ごとにボタンを再生成する

(function() {
  'use strict';

  const STATE = {
    speaking: false,
    paused: false,
    utterance: null,
  };

  // 読み上げ対象から除外するセレクタ
  const EXCLUDE_SELECTORS = [
    'ul.md-tags',                  // タグ一覧（記事冒頭）
    'nav.md-tags',                 // タグナビ
    '.md-tag',                     // 個別のタグチップ
    '.md-source-file',             // ソースファイル情報
    '.md-source-file__action',     // 編集リンクなどのアクション
    '.md-content__button',         // 編集ボタン
    'a.headerlink',                // 見出しの # アンカー
    '.headerlink',
    '.md-typeset__scrollwrap',     // 横スクロール用の包み
    'details summary',             // 折りたたみのサマリは飛ばさない方がいいか…一旦は読む
    '.md-feedback',                // ページフィードバック
    '.md-source-date',             // 最終更新日表示
  ];

  function getArticleText() {
    const article = document.querySelector('article.md-content__inner') ||
                    document.querySelector('article');
    if (!article) return '';

    // クローンして元のDOMを汚さずに不要要素を取り除く
    const clone = article.cloneNode(true);

    EXCLUDE_SELECTORS.forEach(sel => {
      clone.querySelectorAll(sel).forEach(el => el.remove());
    });

    // detail要素のsummaryは残してdetailsの中身は読む（折りたたみ全展開扱い）
    // 実装上は何もしなくても innerText が中身を返すのでOK

    return clone.innerText.trim();
  }

  function stopSpeaking() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    STATE.speaking = false;
    STATE.paused = false;
    STATE.utterance = null;
  }

  function startSpeaking(btn) {
    const text = getArticleText();
    if (!text) {
      alert('読み上げる本文が見つかりませんでした');
      return;
    }
    if (!('speechSynthesis' in window)) {
      alert('お使いのブラウザは読み上げに対応していません');
      return;
    }

    stopSpeaking();

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ja-JP';
    utt.rate = 1.0;
    utt.pitch = 1.0;

    utt.onend = () => {
      STATE.speaking = false;
      STATE.paused = false;
      STATE.utterance = null;
      updateButton(btn);
    };
    utt.onerror = () => {
      STATE.speaking = false;
      STATE.paused = false;
      STATE.utterance = null;
      updateButton(btn);
    };

    STATE.utterance = utt;
    STATE.speaking = true;
    STATE.paused = false;

    // iOS Safari は voiceschanged の後でないと日本語音声が選ばれないことがある
    window.speechSynthesis.cancel();
    setTimeout(() => {
      window.speechSynthesis.speak(utt);
    }, 50);
  }

  function updateButton(btn) {
    if (!btn) return;
    if (!STATE.speaking) {
      btn.innerHTML = '<span aria-hidden="true">▶</span> 読み上げ';
      btn.setAttribute('aria-label', '記事を読み上げる');
      btn.dataset.state = 'idle';
      if (stopBtn) stopBtn.style.display = 'none';
    } else if (STATE.paused) {
      btn.innerHTML = '<span aria-hidden="true">▶</span> 再開';
      btn.setAttribute('aria-label', '読み上げを再開');
      btn.dataset.state = 'paused';
      if (stopBtn) stopBtn.style.display = 'inline-flex';
    } else {
      btn.innerHTML = '<span aria-hidden="true">⏸</span> 一時停止';
      btn.setAttribute('aria-label', '読み上げを一時停止');
      btn.dataset.state = 'speaking';
      if (stopBtn) stopBtn.style.display = 'inline-flex';
    }
  }

  let stopBtn = null;

  function createButton() {
    const existing = document.getElementById('tts-container');
    if (existing) existing.remove();

    const article = document.querySelector('article.md-content__inner') ||
                    document.querySelector('article');
    if (!article) return;

    const container = document.createElement('div');
    container.id = 'tts-container';

    const btn = document.createElement('button');
    btn.id = 'tts-btn';
    btn.type = 'button';

    stopBtn = document.createElement('button');
    stopBtn.id = 'tts-stop-btn';
    stopBtn.type = 'button';
    stopBtn.innerHTML = '<span aria-hidden="true">■</span> 停止';
    stopBtn.setAttribute('aria-label', '読み上げを停止');
    stopBtn.style.display = 'none';

    btn.addEventListener('click', () => {
      if (!STATE.speaking) {
        startSpeaking(btn);
      } else if (!STATE.paused) {
        window.speechSynthesis.pause();
        STATE.paused = true;
      } else {
        window.speechSynthesis.resume();
        STATE.paused = false;
      }
      updateButton(btn);
    });

    stopBtn.addEventListener('click', () => {
      stopSpeaking();
      updateButton(btn);
    });

    container.appendChild(btn);
    container.appendChild(stopBtn);
    document.body.appendChild(container);

    updateButton(btn);
  }

  function init() {
    createButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Material for MkDocs の navigation.instant 対応
  if (typeof document$ !== 'undefined' && document$.subscribe) {
    document$.subscribe(() => {
      stopSpeaking();
      createButton();
    });
  }
})();
