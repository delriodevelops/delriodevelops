import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const HERO_FALL = [118, 152, 104, 172, 134, 112];

// Reveals use explicit end states (fromTo) so a rebuild after new data never
// captures a half-hidden element as its "final" state.
const SHOWN = { autoAlpha: 1, x: 0, y: 0, xPercent: 0, yPercent: 0, scaleX: 1 };

// Drop-in for gsap.from(): the listed visual props are the start state, everything
// else (duration, ease, scrollTrigger…) goes to the tween.
export function revealFrom(targets, vars) {
  const fromVars = {};
  const toVars = {};
  Object.entries(vars).forEach(([key, value]) => {
    if (key in SHOWN) {
      fromVars[key] = value;
      toVars[key] = SHOWN[key];
    } else {
      toVars[key] = value;
    }
  });
  return gsap.fromTo(targets, fromVars, toVars);
}

// Splits a heading into masked chars that rise with the scroll (scrubbed).
function riseChars(el, vars = {}) {
  const split = SplitText.create(el, { type: 'chars', charsClass: 'gb-char', mask: 'chars' });
  revealFrom(split.chars, {
    yPercent: 110,
    ease: 'none',
    stagger: 0.06,
    ...vars,
    scrollTrigger: { trigger: el, start: 'top 98%', end: 'top 45%', scrub: true, ...(vars.scrollTrigger || {}) },
  });
}

// Scrubbed fade-up for a group: each child arrives in turn as the group scrolls in.
function riseGroup(targets, trigger, vars = {}) {
  return revealFrom(targets, {
    y: 80,
    autoAlpha: 0,
    ease: 'none',
    stagger: 0.12,
    ...vars,
    scrollTrigger: { trigger, start: 'top 95%', end: 'top 45%', scrub: true },
  });
}

/**
 * Intro: counter 000→100 on an ink grid, cells drop away, hero letters rise.
 * `short` skips the counter (repeat visits in the same session).
 * Resolves when the hero is fully on screen.
 */
export function playGridbreakIntro(root, { reduced, short } = {}) {
  const q = gsap.utils.selector(root);
  const counter = q('.gb-loader-count')[0];
  const cells = q('.gb-loader-cell');
  const letters = q('.gb-hero-letter');

  return new Promise((resolve) => {
    if (reduced) {
      gsap.set(q('.gb-loader'), { autoAlpha: 0 });
      resolve();
      return;
    }

    const state = { v: 0 };
    gsap.set(letters, { yPercent: 115 });
    gsap.set(q('.gb-cut-line'), { scaleX: 0 });
    gsap.set(q('.gb-hero-info > *'), { autoAlpha: 0, y: 24 });

    const tl = gsap.timeline({ onComplete: resolve });
    if (short) {
      tl.set(q('.gb-loader-meta'), { autoAlpha: 0 });
    } else {
      tl.to(state, {
        v: 100,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counter) counter.textContent = String(Math.round(state.v)).padStart(3, '0');
        },
      }).to(q('.gb-loader-meta'), { autoAlpha: 0, duration: 0.25 }, '+=0.1');
    }

    tl.to(cells, {
        scaleY: 0,
        duration: 0.7,
        ease: 'power3.inOut',
        stagger: { grid: [7, 12], from: 'random', amount: 0.55 },
      })
      .set(q('.gb-loader'), { autoAlpha: 0 })
      .to(letters, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.06 }, '-=0.55')
      .to(q('.gb-cut-line'), { scaleX: 1, duration: 1.1, ease: 'expo.inOut' }, '-=1.1')
      .to(q('.gb-hero-info > *'), { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, '-=0.9');
  });
}

/**
 * All scroll choreography for the home page. Returns a gsap.matchMedia
 * instance — call .revert() to tear everything down.
 */
export function initGridbreakMotion(root, { onSection, forceMotion = false } = {}) {
  const mm = gsap.matchMedia(root);
  const q = gsap.utils.selector(root);
  // forceMotion ignores the OS reduced-motion preference (preview via ?motion=full)
  const motionOk = forceMotion ? 'all' : '(prefers-reduced-motion: no-preference)';
  const motionOff = forceMotion ? 'not all' : '(prefers-reduced-motion: reduce)';
  const withMotion = (query) => (forceMotion ? query : `${query} and ${motionOk}`);

  mm.add(
    {
      desktop: withMotion('(min-width: 900px)'),
      mobile: withMotion('(max-width: 899px)'),
      reduce: motionOff,
    },
    (ctx) => {
      const { desktop, reduce } = ctx.conditions;
      const cleanups = [];

      if (reduce) return;

      // Pinning uses CSS sticky inside a tall wrapper instead of ScrollTrigger pins:
      // the wrapper's height is the scroll distance, so every later trigger measures
      // real layout with no pin-spacing compensation involved.
      const stickyRun = (wrap, length) => {
        const apply = () => {
          wrap.style.height = `${window.innerHeight + length()}px`;
          wrap.classList.add('is-sticky');
        };
        apply();
        ScrollTrigger.addEventListener('refreshInit', apply);
        cleanups.push(() => {
          ScrollTrigger.removeEventListener('refreshInit', apply);
          wrap.style.height = '';
          wrap.classList.remove('is-sticky');
        });
      };

      // A video scrubbed by the scroll is loaded whole into memory first. The hosting answers
      // range requests with the full file and no Accept-Ranges, and then Chrome will not seek
      // the video at all: it stays on its first frame. A blob URL can always be sought
      const makeSeekable = (video) => {
        const src = video.getAttribute('src');
        if (!src || src.startsWith('blob:')) return;
        let url = null;
        let cancelled = false;
        fetch(src)
          .then((res) => (res.ok ? res.blob() : null))
          .then((blob) => {
            if (!blob || cancelled) return;
            url = URL.createObjectURL(blob);
            video.src = url;
          })
          .catch(() => {});
        cleanups.push(() => {
          cancelled = true;
          if (!url) return;
          video.src = src;
          URL.revokeObjectURL(url);
        });
      };

      // ---------- hero: letters fall like bars, grid swallows the red ----------
      const hero = q('.gb-hero')[0];
      const heroWrap = q('.gb-hero-wrap')[0];
      if (hero && heroWrap) {
        stickyRun(heroWrap, () => window.innerHeight * 1.7);
        gsap
          .timeline({
            scrollTrigger: { trigger: heroWrap, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
          })
          .to(
            q('.gb-hero-letter'),
            {
              yPercent: (i) => HERO_FALL[i % HERO_FALL.length],
              rotate: (i) => (i % 2 ? 7 : -5),
              ease: 'none',
              duration: 1,
            },
            0
          )
          .to(q('.gb-hero-ghost'), { xPercent: -38, ease: 'none', duration: 1 }, 0)
          .to(q('.gb-hero-portrait'), { scale: 2.4, rotate: -6, ease: 'none', duration: 0.5 }, 0)
          .to(q('.gb-hero-info'), { yPercent: -40, autoAlpha: 0, ease: 'none', duration: 0.45 }, 0.05)
          .to(q('.gb-cut'), { autoAlpha: 0, ease: 'none', duration: 0.3 }, 0.12)
          .to(
            q('.gb-hero .gb-cover-cell'),
            { scale: 1.02, ease: 'power2.in', duration: 0.5, stagger: { grid: [7, 12], from: 'start', amount: 0.55 } },
            0.5
          );
      }

      // ---------- manifesto scene: subtitles, then a dive into "SHIP." ----------
      const maniWrap = q('.gb-manifesto-wrap')[0];
      const lines = q('.gb-manifesto-wrap .gb-mline');
      const hl = q('.gb-manifesto-wrap .gb-hl')[0];
      if (maniWrap) {
        stickyRun(maniWrap, () => window.innerHeight * 3);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: maniWrap, start: 'top top', end: 'bottom bottom', scrub: 1 },
        });
        lines.forEach((line, i) => {
          const at = i * 1.1;
          tl.fromTo(
            line,
            { yPercent: 90, autoAlpha: 0, filter: 'blur(14px)' },
            { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out' },
            at
          ).fromTo(line.querySelectorAll('.gb-wx'), { fontStretch: '62%' }, { fontStretch: '125%', duration: 1.2, ease: 'none' }, at);
          // the previous line steps back so one line reads at a time
          if (i > 0) tl.to(lines[i - 1], { autoAlpha: 0.2, duration: 0.6, ease: 'none' }, at);
        });
        if (hl) {
          const linesDone = (lines.length - 1) * 1.1 + 1;
          tl.fromTo(hl, { '--hl': 0 }, { '--hl': 1, duration: 0.5, ease: 'none' }, 1.6)
            // hold: the whole sentence lit for a beat
            .to(lines, { autoAlpha: 1, duration: 0.5, ease: 'none' }, linesDone + 0.2)
            .addLabel('dive', linesDone + 1.1)
            .to(lines.filter((l) => !l.contains(hl)), { autoAlpha: 0, yPercent: -40, duration: 0.6, ease: 'power1.in' }, 'dive')
            .to(q('.gb-manifesto-wrap .gb-section-head, .gb-manifesto-wrap .gb-bignum'), { autoAlpha: 0, duration: 0.4 }, 'dive')
            .to(hl.previousElementSibling, { autoAlpha: 0, duration: 0.4 }, 'dive')
            // the letters dissolve so only the red block is left to fly through
            .to(hl, { color: 'rgba(255,255,255,0)', duration: 0.5, ease: 'none' }, 'dive+=0.3')
            // camera pushes through the red block until it is the whole frame
            .to(hl, { scale: 34, duration: 2, ease: 'power3.in' }, 'dive+=0.2');
        }
      } else {
        lines.forEach((line) => {
          const fromRight = line.classList.contains('gb-mline--r');
          revealFrom(line, {
            xPercent: fromRight ? 35 : -35,
            autoAlpha: 0,
            ease: 'none',
            scrollTrigger: { trigger: line, start: 'top 100%', end: 'top 50%', scrub: true },
          });
        });
        if (hl) {
          gsap.fromTo(
            hl,
            { '--hl': 0 },
            { '--hl': 1, ease: 'none', scrollTrigger: { trigger: hl, start: 'top 80%', end: 'top 50%', scrub: true } }
          );
        }
      }

      riseGroup(q('.gb-footnotes > div'), q('.gb-footnotes')[0]);

      // ---------- marquee: speed and direction follow scroll velocity ----------
      const mtrack = q('.gb-marquee-track')[0];
      if (mtrack) {
        const loop = gsap.to(mtrack, { xPercent: -50, ease: 'none', duration: 26, repeat: -1 });
        // park far from zero so reversing never hits the start
        loop.totalTime(loop.duration() * 50);
        ScrollTrigger.create({
          trigger: mtrack,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const boost = Math.min(7, 1 + Math.abs(self.getVelocity()) / 350);
            gsap.to(loop, {
              timeScale: self.direction * boost,
              duration: 0.2,
              overwrite: true,
              onComplete: () => gsap.to(loop, { timeScale: self.direction, duration: 1.2 }),
            });
          },
        });
      }

      // ---------- work: pinned horizontal track ----------
      const work = q('.gb-work')[0];
      const workWrap = q('.gb-work-wrap')[0];
      const track = q('.gb-track')[0];
      const projectPanels = q('.gb-panel[data-project]');
      const bar = q('.gb-work-bar > div')[0];
      const count = q('.gb-work-count')[0];
      const total = projectPanels.length;

      if (work && workWrap && track && desktop) {
        // Per-panel reveals are driven from each panel's on-screen position while the
        // track slides; cheaper and more predictable than one trigger per element.
        const clamp01 = gsap.utils.clamp(0, 1);
        const panelFx = projectPanels.map((panel) => {
          const title = panel.querySelector('.gb-panel-title');
          return {
            panel,
            media: panel.querySelector('.gb-panel-media'),
            img: panel.querySelector('.gb-panel-media img'),
            chars: title ? SplitText.create(title, { type: 'chars', charsClass: 'gb-char', mask: 'chars' }).chars : [],
          };
        });

        const allPanels = q('.gb-panel');
        const updatePanels = () => {
          const vw = window.innerWidth;
          // camera depth: panels turn and recede as they leave the centre of the frame
          allPanels.forEach((panel) => {
            const { left, width } = panel.getBoundingClientRect();
            const off = gsap.utils.clamp(-1.2, 1.2, (left + width / 2 - vw / 2) / vw);
            panel.style.transform = `rotateY(${(off * -22).toFixed(2)}deg) scale(${(1 - Math.abs(off) * 0.14).toFixed(3)})`;
          });
          panelFx.forEach(({ panel, media, img, chars }) => {
            const { left, width } = panel.getBoundingClientRect();
            const reveal = clamp01((vw * 0.95 - left) / (vw * 0.65));
            const travel = clamp01((vw - left) / (vw + width));
            const type = clamp01((vw * 0.75 - left) / (vw * 0.5));
            if (media) media.style.clipPath = `inset(0% 0% 0% ${((1 - reveal) * 100).toFixed(2)}%)`;
            if (img) img.style.transform = `translateX(${(-16 * (1 - travel)).toFixed(2)}%)`;
            const step = 0.6 / Math.max(1, chars.length);
            chars.forEach((char, i) => {
              const p = clamp01((type - i * step) / 0.4);
              char.style.transform = `translateY(${(105 * (1 - p)).toFixed(1)}%)`;
            });
          });
        };

        cleanups.push(() => {
          panelFx.forEach(({ media, img }) => {
            if (media) media.style.clipPath = '';
            if (img) img.style.transform = '';
          });
          allPanels.forEach((panel) => {
            panel.style.transform = '';
          });
        });

        const distance = () => track.scrollWidth - window.innerWidth;
        stickyRun(workWrap, distance);
        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          onUpdate: updatePanels,
          scrollTrigger: {
            trigger: workWrap,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar) gsap.set(bar, { scaleX: self.progress });
              if (count && total) {
                const idx = Math.min(total, Math.max(1, Math.round(self.progress * (total + 1))));
                count.textContent = `${String(idx).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
              }
            },
          },
        });

        updatePanels();
        cleanups.push(() => slide.kill());
      } else if (work) {
        projectPanels.forEach((panel) => {
          const media = panel.querySelector('.gb-panel-media');
          if (!media) return;
          gsap.fromTo(
            media,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              ease: 'none',
              scrollTrigger: { trigger: media, start: 'top 95%', end: 'top 45%', scrub: true },
            }
          );
        });
      }

      // ---------- featured films: one camera move of a launch film each, the scrollbar is its playhead ----------
      const pad = (n) => String(n).padStart(2, '0');
      q('.gb-feature-wrap').forEach((featureWrap) => {
        const featureVideo = featureWrap.querySelector('.gb-feature-video');
        if (!featureVideo) return;
        makeSeekable(featureVideo);
        const featureLength = () => (featureVideo.duration > 0 ? featureVideo.duration : 3.1);
        stickyRun(featureWrap, () => window.innerHeight * 2.2);

        const featureTc = featureWrap.querySelector('.gb-feature-tc');
        const head = { t: 0 };
        let lastSeek = -1;
        const seek = () => {
          const t = Math.min(head.t, featureLength() - 0.04);
          // seeking is expensive: skip moves of less than a frame (the clip runs at 30 fps)
          if (featureVideo.readyState >= 1 && Math.abs(t - lastSeek) > 1 / 60) {
            featureVideo.currentTime = t;
            lastSeek = t;
          }
          const f = Math.round(t * 30);
          if (featureTc) featureTc.textContent = `00:00:${pad(Math.floor(f / 30))}:${pad(f % 30)}`;
        };

        // the two lines share one masked slot: the first leaves halfway through the move
        const [lineA, lineB] = featureWrap.querySelectorAll('.gb-feature-line');
        const tl = gsap.timeline({
          scrollTrigger: { trigger: featureWrap, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true },
        });
        tl.fromTo(head, { t: 0 }, { t: () => featureLength(), duration: 1, ease: 'none', onUpdate: seek }, 0);
        if (lineA) {
          tl.fromTo(lineA, { yPercent: 110 }, { yPercent: 0, duration: 0.14, ease: 'power3.out' }, 0.04).to(
            lineA,
            { yPercent: -110, duration: 0.1, ease: 'power3.in' },
            0.5
          );
        }
        if (lineB) tl.fromTo(lineB, { yPercent: 110 }, { yPercent: 0, duration: 0.14, ease: 'power3.out' }, 0.58);
        tl.fromTo(featureWrap.querySelector('.gb-feature-cta'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.8);

        const onFeatureMeta = () => ScrollTrigger.refresh();
        featureVideo.addEventListener('loadedmetadata', onFeatureMeta);
        cleanups.push(() => featureVideo.removeEventListener('loadedmetadata', onFeatureMeta));
      });

      // ---------- showreel: letterbox in, the scrollbar drives the video playhead ----------
      const reelWrap = q('.gb-reel-wrap')[0];
      const video = q('.gb-reel-video')[0];
      const reelTitles = q('.gb-reel-title');
      if (reelWrap && video && reelTitles.length) {
        makeSeekable(video);
        const shots = reelTitles.length;
        const shotSeconds = Number(video.dataset.shot) || 2;
        // timeline units: 1 unit = one shot; the video spans all shots plus its last tail
        const videoLength = () => (video.duration > 0 ? video.duration : shots * shotSeconds + 0.5);
        stickyRun(reelWrap, () => window.innerHeight * (0.9 * shots + 1));

        const tc = q('.gb-reel-tc')[0];
        const reelCount = q('.gb-reel-count')[0];
        const pad = (n) => String(n).padStart(2, '0');
        const head = { t: 0 };
        let lastSeek = -1;
        const seek = () => {
          const t = Math.min(head.t, videoLength() - 0.05);
          // seeking is expensive: skip sub-frame moves
          if (video.readyState >= 1 && Math.abs(t - lastSeek) > 1 / 48) {
            video.currentTime = t;
            lastSeek = t;
          }
          const f = Math.round(t * 24);
          if (tc) tc.textContent = `00:${pad(Math.floor(f / 1440))}:${pad(Math.floor(f / 24) % 60)}:${pad(f % 24)}`;
          if (reelCount) reelCount.textContent = `${pad(Math.min(shots, Math.floor(t / shotSeconds) + 1))} / ${pad(shots)}`;
        };

        const tl = gsap.timeline({
          scrollTrigger: { trigger: reelWrap, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true },
        });
        tl.fromTo(q('.gb-reel-bar'), { scaleY: 4.6 }, { scaleY: 1, duration: 0.5, ease: 'power2.inOut' }, 0)
          .fromTo(head, { t: 0 }, { t: () => videoLength(), duration: shots + 0.25, ease: 'none', onUpdate: seek }, 0.3);
        reelTitles.forEach((title, i) => {
          const at = 0.3 + i;
          tl.fromTo(title, { yPercent: 110 }, { yPercent: 0, duration: 0.3, ease: 'power3.out' }, at + 0.15);
          if (i < shots - 1) tl.to(title, { yPercent: -110, duration: 0.25, ease: 'power3.in' }, at + 0.85);
        });
        tl.to(q('.gb-reel-bar'), { scaleY: 4.6, duration: 0.5, ease: 'power2.inOut' }, '>+0.1');

        // once the real duration is known, rebuild the playhead range
        const onMeta = () => ScrollTrigger.refresh();
        video.addEventListener('loadedmetadata', onMeta);
        cleanups.push(() => video.removeEventListener('loadedmetadata', onMeta));
      }

      // ---------- portrait scene: full-bleed face, camera pulls back to a frame ----------
      const pWrap = q('.gb-pscene-wrap')[0];
      if (pWrap) {
        stickyRun(pWrap, () => window.innerHeight * 1.8);
        const frame = q('.gb-pscene-frame')[0];
        gsap
          .timeline({ scrollTrigger: { trigger: pWrap, start: 'top top', end: 'bottom bottom', scrub: 1 } })
          .fromTo(frame.querySelector('img'), { scale: 1.35 }, { scale: 1, duration: 3, ease: 'none' }, 0)
          .fromTo(
            frame,
            { clipPath: 'inset(0% 0% 0% 0%)' },
            { clipPath: 'inset(16% 36% 16% 36%)', duration: 2.2, ease: 'power2.inOut' },
            0.8
          )
          .fromTo(q('.gb-pscene-cap--a'), { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6 }, 0)
          .to(q('.gb-pscene-cap--a'), { yPercent: -40, autoAlpha: 0, duration: 0.6 }, 1.2)
          .fromTo(q('.gb-pscene-cap--b'), { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6 }, 1.5)
          .to(frame, { yPercent: -8, duration: 0.6, ease: 'none' }, 2.5);
      }

      // ---------- end credits: the roll travels from below the frame to above it ----------
      const creditsWrap = q('.gb-credits-wrap')[0];
      const roll = q('.gb-credits-roll')[0];
      const fin = q('.gb-credits-fin')[0];
      if (creditsWrap && roll && fin) {
        // the roll stops with "Fin." dead centre, then holds for a beat
        const restY = () => window.innerHeight / 2 - (fin.offsetTop + fin.offsetHeight / 2);
        stickyRun(creditsWrap, () => window.innerHeight - restY() + window.innerHeight * 0.4);
        gsap
          .timeline({ scrollTrigger: { trigger: creditsWrap, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true } })
          .fromTo(roll, { y: () => window.innerHeight }, { y: restY, duration: 1, ease: 'none' }, 0)
          .fromTo(fin, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.2, ease: 'power2.out' }, 0.8)
          .to({}, { duration: 0.25 });
      }

      // ---------- info ----------
      const infoTitle = q('.gb-info-title')[0];
      if (infoTitle) riseChars(infoTitle);

      const portrait = q('.gb-portrait')[0];
      if (portrait) {
        gsap.fromTo(
          portrait,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: { trigger: portrait, start: 'top 95%', end: 'top 35%', scrub: true },
          }
        );
        gsap.fromTo(
          portrait.querySelector('img'),
          { yPercent: -12 },
          { yPercent: 0, ease: 'none', scrollTrigger: { trigger: portrait, start: 'top bottom', end: 'bottom top', scrub: true } }
        );
      }

      // counters are tied to the scroll: scroll back up and they count down
      q('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count);
        const state = { v: 0 };
        gsap.to(state, {
          v: target,
          ease: 'none',
          onUpdate: () => {
            el.firstChild.textContent = String(Math.round(state.v)).padStart(2, '0');
          },
          scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 50%', scrub: true },
        });
      });

      q('.gb-exp-rule').forEach((rule) => {
        revealFrom(rule, {
          scaleX: 0,
          ease: 'none',
          scrollTrigger: { trigger: rule, start: 'top 90%', end: 'top 55%', scrub: true },
        });
      });

      // ---------- stack ----------
      const stackTitle = q('.gb-stack-title')[0];
      if (stackTitle) riseChars(stackTitle, { stagger: 0.04 });

      q('.gb-stack-col').forEach((col, i) => {
        // each column flies in from in front of the camera, then its rows settle
        gsap.fromTo(
          col,
          { scale: 1.5, autoAlpha: 0, filter: 'blur(16px)' },
          {
            scale: 1,
            autoAlpha: 1,
            filter: 'blur(0px)',
            ease: 'power2.out',
            scrollTrigger: { trigger: col, start: `top ${100 - i * 4}%`, end: `top ${55 - i * 4}%`, scrub: 1 },
          }
        );
        riseGroup(col.querySelectorAll('li'), col, { y: 40, stagger: 0.08 });
      });

      // ---------- notes ----------
      const notesTitle = q('.gb-notes-title')[0];
      if (notesTitle) riseChars(notesTitle);

      // rows slide in from alternating sides, each on its own stretch of scroll
      q('.gb-note').forEach((note, i) => {
        revealFrom(note, {
          xPercent: i % 2 ? 12 : -12,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: { trigger: note, start: 'top 100%', end: 'top 65%', scrub: true },
        });
      });

      const preview = q('.gb-note-preview')[0];
      if (preview && desktop) {
        const img = preview.querySelector('img');
        const xTo = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3' });
        const move = (e) => {
          xTo(e.clientX);
          yTo(e.clientY);
        };
        const notes = q('.gb-note');
        const handlers = notes.map((note) => {
          const enter = () => {
            if (note.dataset.image && img) {
              img.src = note.dataset.image;
              preview.classList.add('is-visible');
            }
          };
          const leave = () => preview.classList.remove('is-visible');
          note.addEventListener('mouseenter', enter);
          note.addEventListener('mouseleave', leave);
          note.addEventListener('mousemove', move);
          return { note, enter, leave };
        });
        cleanups.push(() => {
          handlers.forEach(({ note, enter, leave }) => {
            note.removeEventListener('mouseenter', enter);
            note.removeEventListener('mouseleave', leave);
            note.removeEventListener('mousemove', move);
          });
        });
      }

      return () => cleanups.forEach((fn) => fn());
    }
  );

  mm.add(motionOk, () => {
    const contact = q('.gb-contact')[0];
    if (!contact) return;

    gsap.fromTo(
      q('.gb-contact .gb-cover-cell'),
      { scale: 1.02 },
      {
        scale: 0,
        ease: 'power2.out',
        stagger: { grid: [7, 12], from: 'end', amount: 0.6 },
        scrollTrigger: { trigger: contact, start: 'top 95%', end: 'top 15%', scrub: true },
      }
    );

    const title = q('.gb-contact-title')[0];
    if (title) {
      const split = SplitText.create(title, { type: 'chars', charsClass: 'gb-char', mask: 'chars' });
      revealFrom(split.chars, {
        yPercent: 110,
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: { trigger: contact, start: 'top 60%', end: 'top 5%', scrub: true },
      });
    }

    riseGroup(q('.gb-contact-row > *, .gb-footer > *'), q('.gb-contact-row')[0], { y: 60 });
  });

  mm.add(motionOff, () => {
    gsap.set(q('.gb-contact .gb-cover-cell'), { scale: 0 });
  });

  // Progress bar + section spy are created last so their positions include the pin spacing above them
  mm.add('all', () => {
    gsap.to(q('.gb-progress'), {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true },
    });

    q('[data-section]').forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => self.isActive && onSection?.(section.dataset.section),
      });
    });
  });

  return mm;
}
