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

  function getArticleText() {
    // Material for MkDocs の本文領域を取得
    const article = document.querySelector('article.md-content__inner') ||
                    document.querySelector('article') ||
                    document.querySelector('main');
    if (!article) return '';
    // タイトルから本文末尾までを読み上げ対象に
    return article.innerText.trim();
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

    // 既に再生中なら停止
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
    // 少し遅らせてから speak する
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
    // 既存のボタンを削除（navigation.instant でページ遷移したとき用）
    const existing = document.getElementById('tts-container');
    if (existing) existing.remove();

    const article = document.querySelector('article.md-content__inner') ||
                    document.querySelector('article');
    if (!article) return;

    // index.md, tags.md, archive.md にはボタンを出さない
    const path = window.location.pathname;
    if (path === '/' || path.endsWith('/MyConsiderations/') ||
        path.includes('/tags/') || path.includes('/archive/')) {
      // タグやアーカイブのページは読み上げる意味が薄いのでスキップ
      // ただし普通の記事ページでは付ける
    }

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

  // 初回ロード
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Material for MkDocs の navigation.instant 対応
  // ページが切り替わるたびに再初期化
  if (typeof document$ !== 'undefined' && document$.subscribe) {
    document$.subscribe(() => {
      stopSpeaking();
      createButton();
    });
  }
})();
