/* ============================================================
   Express + sakila ทีละขั้น · interactive.js
   - Mobile sidebar toggle
   - Tab handler (event delegation)
   - Quiz handler (single-pick, lock after answer)
   - Checklist + progress bar (localStorage)
   - TOC scroll-spy
   - Copy button · screenshot lightbox
   (เล่มนี้ไม่มี Vue demo — ไม่ต้องโหลด vue.global.prod.js)
   ============================================================ */

(() => {
  // Safe localStorage wrapper — บาง browser block localStorage บน file://
  const _mem = {};
  const ls = {
    getItem(k) {
      try { return localStorage.getItem(k); }
      catch { return _mem[k] ?? null; }
    },
    setItem(k, v) {
      try { localStorage.setItem(k, v); }
      catch { _mem[k] = v; }
    }
  };

  // ====================================================
  // Mobile sidebar toggle
  // ====================================================
  const navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
    });
  }

  // ====================================================
  // Sidebar collapse (desktop) — ซ่อน/แสดงสารบัญ + จำสถานะ localStorage
  // ====================================================
  const _layout = document.querySelector('.layout');
  const _collapseBtn = document.getElementById('sidebar-collapse');
  const _showBtn = document.getElementById('sidebar-show');
  if (_layout && _collapseBtn && _showBtn) {
    const SKEY = 'dl:sidebar-hidden';
    const setSidebarHidden = (hidden) => {
      _layout.classList.toggle('sidebar-hidden', hidden);
      _collapseBtn.setAttribute('aria-expanded', String(!hidden));
      ls.setItem(SKEY, hidden ? '1' : '0');
    };
    if (ls.getItem(SKEY) === '1') setSidebarHidden(true);
    _collapseBtn.addEventListener('click', () => setSidebarHidden(true));
    _showBtn.addEventListener('click', () => setSidebarHidden(false));
  }

  // ====================================================
  // Tab handler (event delegation)
  // ====================================================
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (!tab) return;
    const root = tab.closest('[data-tabs]');
    if (!root) return;
    const name = tab.dataset.tab;
    root.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('active', b === tab));
    root.querySelectorAll('[data-panel]').forEach(p => p.classList.toggle('active', p.dataset.panel === name));
  });

  // ====================================================
  // Quiz handler (single-pick, lock after answer)
  // ====================================================
  document.addEventListener('click', (e) => {
    const opt = e.target.closest('.quiz-option');
    if (!opt) return;
    const quiz = opt.closest('[data-quiz]');
    if (!quiz || quiz.dataset.answered === '1') return;
    quiz.dataset.answered = '1';
    const correct = opt.dataset.correct === 'true';
    opt.classList.add(correct ? 'correct' : 'wrong');
    if (!correct) {
      const right = quiz.querySelector('.quiz-option[data-correct="true"]');
      if (right) right.classList.add('correct');
    }
    // disabled จริง — keyboard/screen reader รู้ว่า lock แล้ว ไม่ใช่แค่ JS เมิน click
    quiz.querySelectorAll('.quiz-option').forEach(b => { b.disabled = true; });
    const exp = quiz.querySelector('.quiz-explanation');
    if (exp) exp.hidden = false;
  });

  // ====================================================
  // Flashcard quiz (Dia Learn device) — พลิกการ์ดเมื่อเลือกคำตอบ
  // ====================================================
  document.addEventListener('click', (e) => {
    const choice = e.target.closest('.dl-choice');
    if (choice) {
      const card = choice.closest('[data-flashcard]');
      if (!card || card.classList.contains('flipped')) return;
      const correct = choice.dataset.correct === 'true';
      const back = card.querySelector('.dl-card-back');
      if (!back) return;
      back.dataset.state = correct ? 'correct' : 'wrong';
      const stamp = back.querySelector('.dl-card-stamp');
      if (stamp) stamp.textContent = correct ? 'ถูกต้อง' : 'ยังไม่ใช่';
      const picked = back.querySelector('.dl-card-picked');
      if (picked) picked.textContent = choice.textContent.trim();
      const expl = back.querySelector('.dl-card-expl');
      if (expl) expl.textContent = correct
        ? (expl.dataset.correctText || '')
        : (expl.dataset.wrongText || '');
      card.classList.add('flipped');
      return;
    }
    const retry = e.target.closest('.dl-card-retry');
    if (retry) {
      const card = retry.closest('[data-flashcard]');
      if (card) card.classList.remove('flipped');
    }
  });

  // ====================================================
  // Checklist + progress bar + star trail (localStorage · per-part)
  // ====================================================
  function updateProgress() {
    const parts = Array.from(document.querySelectorAll('.part[id], #capstone'));
    let total = 0, done = 0;
    parts.forEach(part => {
      const cbs = part.querySelectorAll('.self-check input[type="checkbox"]');
      if (!cbs.length) return;
      total++;
      const complete = Array.from(cbs).every(cb => cb.checked);
      if (complete) done++;
      // Star trail: บทที่ self-check ครบ = ดาวเต็ม ★ · ยังไม่ครบ = ☆
      const link = document.querySelector(`.toc-link[href="#${part.id}"]`);
      const star = link ? link.querySelector('.toc-star') : null;
      if (link) link.classList.toggle('done', complete);
      if (star) {
        const next = complete ? '★' : '☆';
        if (star.textContent !== next) {
          star.textContent = next;
          if (complete) {
            star.classList.remove('pop');
            void star.offsetWidth; // restart animation
            star.classList.add('pop');
          }
        }
      }
    });
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
    if (!fill || !text) return;
    const pct = total ? (done / total) * 100 : 0;
    fill.style.width = pct.toFixed(1) + '%';
    text.textContent = `เรียนไป ${done} / ${total} บท`;
  }

  function resetProgress() {
    // destructive + กู้คืนไม่ได้ — ต้อง confirm ก่อนล้าง
    if (!confirm('ล้าง progress ทั้งหมด? (กู้คืนไม่ได้)')) return;
    const cbs = document.querySelectorAll('.self-check input[type="checkbox"]');
    const slugPrefixes = new Set();
    cbs.forEach(cb => {
      cb.checked = false;
      if (cb.dataset.key) {
        ls.setItem(cb.dataset.key, '0');
        const prefix = cb.dataset.key.split(':')[0];
        if (prefix) slugPrefixes.add(prefix);
      }
    });
    // Remove orphan localStorage keys with matching slug prefix
    try {
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && slugPrefixes.has(k.split(':')[0])) toRemove.push(k);
      }
      toRemove.forEach(k => localStorage.removeItem(k));
    } catch { /* localStorage blocked — _mem already cleared above */ }
    updateProgress();
  }

  document.querySelectorAll('.self-check input[type="checkbox"]').forEach(cb => {
    const key = cb.dataset.key;
    if (!key) return;
    cb.checked = ls.getItem(key) === '1';
    cb.addEventListener('change', () => {
      ls.setItem(key, cb.checked ? '1' : '0');
      updateProgress();
    });
  });
  updateProgress();

  const resetBtn = document.getElementById('progress-reset');
  if (resetBtn) resetBtn.addEventListener('click', resetProgress);

  // ====================================================
  // TOC scroll-spy (IntersectionObserver)
  // ====================================================
  const tocLinks = Array.from(document.querySelectorAll('.toc-link'));
  const sections = Array.from(document.querySelectorAll('.part[id], #capstone'));
  const visibleSections = new Set();
  // click-lock: ตอนคลิกหัวข้อแล้ว smooth-scroll กำลังวิ่ง ห้าม spy แย่ง active
  // (ไม่งั้น active "วิ่งไล่" ทุก section ระหว่างทาง + อาจลงผิด)
  let spyLockUntil = 0;
  function setTocActive(id) {
    tocLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
  }

  if (sections.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) visibleSections.add(e.target.id);
        else visibleSections.delete(e.target.id);
      });
      if (Date.now() < spyLockUntil) return;
      // Highlight topmost visible section; fallback to first section
      let activeId = null;
      for (const sec of sections) {
        if (visibleSections.has(sec.id)) { activeId = sec.id; break; }
      }
      if (!activeId) activeId = sections[0]?.id || null;
      if (activeId) setTocActive(activeId);
    }, { rootMargin: '-8% 0px -65% 0px', threshold: 0 });

    sections.forEach(s => sectionObserver.observe(s));
    tocLinks.forEach(link => link.addEventListener('click', () => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) { setTocActive(href.slice(1)); spyLockUntil = Date.now() + 1100; }
    }));
    window.addEventListener('scrollend', () => { spyLockUntil = 0; });
  } else {
    // Fallback: scroll + offsetTop (for environments without IntersectionObserver)
    function updateTocActive() {
      const y = window.scrollY + 120;
      let activeId = sections[0]?.id;
      for (const sec of sections) {
        if (sec.offsetTop <= y) activeId = sec.id;
      }
      tocLinks.forEach(l =>
        l.classList.toggle('active', l.getAttribute('href') === '#' + activeId)
      );
    }
    window.addEventListener('scroll', updateTocActive, { passive: true });
    updateTocActive();
  }

  // ====================================================
  // Copy code button (progressive enhancement)
  // ====================================================
  function initCopyButtons() {
    // Tabbed code blocks — inject button into .code-tabs-bar (right side)
    document.querySelectorAll('.code-tabs[data-tabs]').forEach(tabs => {
      const bar = tabs.querySelector('.code-tabs-bar');
      if (!bar || bar.querySelector('.code-copy-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.setAttribute('aria-label', 'Copy code');
      btn.textContent = 'copy';
      bar.appendChild(btn);
    });

    // Standalone <pre class="code-block"> — wrap in div, inject button
    document.querySelectorAll('pre.code-block').forEach(pre => {
      if (pre.parentElement.classList.contains('code-block-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'code-block-wrap';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      const btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.setAttribute('aria-label', 'Copy code');
      btn.textContent = 'copy';
      wrap.appendChild(btn);
    });
  }
  initCopyButtons();

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.code-copy-btn');
    if (!btn) return;
    const tabsRoot  = btn.closest('.code-tabs[data-tabs]');
    const blockWrap = btn.closest('.code-block-wrap');
    let text = '';
    if (tabsRoot) {
      const active = tabsRoot.querySelector('.code-panel.active');
      text = active ? active.textContent : '';
    } else if (blockWrap) {
      const pre = blockWrap.querySelector('.code-block');
      text = pre ? pre.textContent : '';
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback execCommand for file:// or older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* best-effort */ }
      document.body.removeChild(ta);
    }
    const orig = btn.textContent;
    btn.textContent = '✓ copied';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
  });

  // ====================================================
  // Lightbox — คลิกรูป .dl-shot เปิดขยายในหน้าเดิมแทนแท็บใหม่ (event delegation)
  // ไม่ใช้ scrollTo/scrollIntoView ที่ไหนเลย — ล็อกสกรอลด้วย class เฉยๆ จึงคืน
  // ตำแหน่งเดิมได้เองโดยไม่ต้องคำนวณ/ตั้งค่า scroll position ใหม่
  // ====================================================
  (function initLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'dl-lightbox';
    lightbox.id = 'dl-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'ภาพขยาย');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = `
      <button type="button" class="dl-lightbox-close" aria-label="ปิด">&times;</button>
      <figure class="dl-lightbox-figure">
        <div class="dl-lightbox-img-wrap">
          <img class="dl-lightbox-img" src="" alt="">
        </div>
        <figcaption class="dl-lightbox-caption"></figcaption>
      </figure>
    `;
    document.body.appendChild(lightbox);

    const closeBtn = lightbox.querySelector('.dl-lightbox-close');
    const imgWrap = lightbox.querySelector('.dl-lightbox-img-wrap');
    const img = lightbox.querySelector('.dl-lightbox-img');
    const caption = lightbox.querySelector('.dl-lightbox-caption');

    let lastTrigger = null;

    function setZoomed(on) {
      if (on) {
        img.classList.add('is-zoomed');
        const w = Math.max(window.innerWidth, img.naturalWidth || 0);
        img.style.width = w + 'px';
        img.style.height = 'auto';
      } else {
        img.classList.remove('is-zoomed');
        img.style.width = '';
        img.style.height = '';
        imgWrap.scrollTop = 0;
        imgWrap.scrollLeft = 0;
      }
    }

    function onKeydown(e) {
      if (e.key === 'Escape') closeLightbox();
    }

    function openLightbox(linkEl) {
      const imgEl = linkEl.querySelector('img');
      const figure = linkEl.closest('.dl-shot');
      const figcaptionEl = figure ? figure.querySelector('figcaption') : null;
      if (!imgEl) return;

      lastTrigger = linkEl;
      img.src = imgEl.currentSrc || imgEl.src;
      img.alt = imgEl.alt || '';
      caption.innerHTML = figcaptionEl ? figcaptionEl.innerHTML : '';
      setZoomed(false);

      document.documentElement.classList.add('dl-lightbox-lock');
      document.body.classList.add('dl-lightbox-lock');
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.addEventListener('keydown', onKeydown);
      // preventScroll บังคับ — closeBtn เป็น position:fixed แต่ .focus() เปล่าๆ ยัง
      // ชวน browser scrollIntoView ตามปกติ ซึ่งพัง/กระโดดผิดตำแหน่งเพราะ html{zoom}
      closeBtn.focus({ preventScroll: true });
    }

    function closeLightbox() {
      if (!lightbox.classList.contains('is-open')) return;
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('dl-lightbox-lock');
      document.body.classList.remove('dl-lightbox-lock');
      document.removeEventListener('keydown', onKeydown);
      setZoomed(false);
      img.src = '';
      if (lastTrigger) { lastTrigger.focus({ preventScroll: true }); lastTrigger = null; }
    }

    document.addEventListener('click', (e) => {
      const link = e.target.closest('.dl-shot a');
      if (link) { e.preventDefault(); openLightbox(link); return; }

      if (e.target === img) { setZoomed(!img.classList.contains('is-zoomed')); return; }
      if (e.target === closeBtn || e.target.closest('.dl-lightbox-close')) { closeLightbox(); return; }
      if (e.target === lightbox) { closeLightbox(); return; } // คลิก backdrop นอกรูป/caption
    });
  })();

})();
