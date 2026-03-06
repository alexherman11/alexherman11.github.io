/* ===========================================
   RETRO-EFFECTS.JS - Interactive RPG Effects
   =========================================== */

(function () {
    'use strict';

    // --- Sound System ---
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    let soundEnabled = localStorage.getItem('rpg-sound') !== 'off';

    function getAudioCtx() {
        if (!audioCtx) audioCtx = new AudioCtx();
        return audioCtx;
    }

    function playTone(freq, duration, gain) {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioCtx();
            const osc = ctx.createOscillator();
            const vol = ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            vol.gain.value = gain;
            vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(vol);
            vol.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch (e) { /* audio not supported */ }
    }

    function blipSound() { playTone(800, 0.1, 0.05); }
    function confirmSound() { playTone(1200, 0.15, 0.06); }

    // --- Sound Toggle Button ---
    const soundBtn = document.createElement('button');
    soundBtn.id = 'sound-toggle';
    soundBtn.textContent = soundEnabled ? '[♪]' : '[x]';
    soundBtn.style.cssText =
        'position:fixed;bottom:1rem;right:1rem;z-index:10000;' +
        "font-family:'Press Start 2P',cursive;font-size:0.6rem;" +
        'background:#1a1a4e;color:#00e5ff;border:2px solid #8888cc;' +
        'border-radius:4px;padding:6px 8px;cursor:pointer;opacity:0.7;';
    soundBtn.addEventListener('click', function () {
        soundEnabled = !soundEnabled;
        localStorage.setItem('rpg-sound', soundEnabled ? 'on' : 'off');
        soundBtn.textContent = soundEnabled ? '[♪]' : '[x]';
    });
    document.addEventListener('DOMContentLoaded', function () {
        document.body.appendChild(soundBtn);
    });

    // --- Nav Hover / Click Sounds ---
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('nav a').forEach(function (link) {
            link.addEventListener('mouseenter', blipSound);
            link.addEventListener('click', confirmSound);
        });
    });

    // --- Typewriter Effect ---
    document.addEventListener('DOMContentLoaded', function () {
        var heading = document.getElementById('hero-heading');
        if (!heading) return;

        var fullText = heading.textContent;
        heading.textContent = '';
        heading.style.borderRight = '3px solid var(--heading-color, #ffcc00)';

        var i = 0;
        var cursor = true;

        function type() {
            if (i < fullText.length) {
                heading.textContent += fullText.charAt(i);
                i++;
                setTimeout(type, 70);
            } else {
                // Blink cursor after typing
                setInterval(function () {
                    cursor = !cursor;
                    heading.style.borderRight = cursor
                        ? '3px solid var(--heading-color, #ffcc00)'
                        : '3px solid transparent';
                }, 500);
            }
        }
        setTimeout(type, 400);
    });

    // --- Pixel Star Cursor Trail ---
    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        document.addEventListener('mousemove', function (e) {
            if (Math.random() > 0.15) return;

            var star = document.createElement('div');
            star.style.cssText =
                'position:fixed;pointer-events:none;z-index:9998;' +
                'width:4px;height:4px;background:#ffcc00;' +
                'border-radius:0;opacity:1;' +
                'left:' + e.clientX + 'px;top:' + e.clientY + 'px;' +
                'transition:opacity 0.6s ease-out,transform 0.6s ease-out;';
            document.body.appendChild(star);

            requestAnimationFrame(function () {
                star.style.opacity = '0';
                star.style.transform = 'translateY(-15px) scale(0.5)';
            });

            setTimeout(function () {
                if (star.parentNode) star.parentNode.removeChild(star);
            }, 650);
        });
    }

    // --- Screen Wipe Page Transitions ---
    document.addEventListener('DOMContentLoaded', function () {
        var wipe = document.createElement('div');
        wipe.id = 'screen-wipe';
        wipe.style.cssText =
            'position:fixed;top:0;left:0;width:100%;height:100%;' +
            'background:#000;z-index:99999;pointer-events:none;' +
            'transform:translateX(-100%);transition:transform 0.4s ease-in;';
        document.body.appendChild(wipe);

        document.querySelectorAll('nav a, a.logo').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var href = link.getAttribute('href');
                if (!href || href.startsWith('#') || href.startsWith('javascript')) return;

                e.preventDefault();
                wipe.style.transform = 'translateX(0)';
                setTimeout(function () {
                    window.location.href = href;
                }, 400);
            });
        });
    });

    // --- Konami Code Easter Egg ---
    var konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    var konamiIndex = 0;

    document.addEventListener('keydown', function (e) {
        if (e.key === konamiSequence[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiSequence.length) {
                konamiIndex = 0;
                triggerEasterEgg();
            }
        } else {
            konamiIndex = 0;
        }
    });

    function triggerEasterEgg() {
        confirmSound();
        var overlay = document.createElement('div');
        overlay.style.cssText =
            'position:fixed;top:0;left:0;width:100%;height:100%;' +
            'background:rgba(0,0,0,0.85);z-index:100000;' +
            'display:flex;align-items:center;justify-content:center;';

        var dialog = document.createElement('div');
        dialog.style.cssText =
            'background:linear-gradient(180deg,#2a2a6e,#0e0e3e);' +
            'border:4px solid #8888cc;border-radius:8px;padding:2rem;' +
            'box-shadow:inset 0 0 0 2px #0e0e3e,inset 0 0 0 4px #ccccff,' +
            '0 0 40px rgba(136,136,204,0.6);' +
            'text-align:center;max-width:400px;';

        dialog.innerHTML =
            '<p style="font-family:\'Press Start 2P\',cursive;color:#ffcc00;' +
            'font-size:0.8rem;margin:0 0 1rem;text-shadow:2px 2px 0 rgba(204,153,0,0.4);">' +
            'SECRET UNLOCKED!</p>' +
            '<p style="font-family:\'VT323\',monospace;color:#fff;font-size:1.3rem;margin:0 0 1.5rem;">' +
            'You found the hidden code!<br>+9999 EXP</p>' +
            '<button style="font-family:\'Press Start 2P\',cursive;font-size:0.55rem;' +
            'background:#1a1a4e;color:#00e5ff;border:2px solid #8888cc;' +
            'padding:8px 16px;cursor:pointer;border-radius:4px;" ' +
            'onclick="this.closest(\'div\').parentNode.remove()">OK</button>';

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Game Boy green filter for 5 seconds
        document.body.style.filter = 'sepia(1) hue-rotate(70deg) saturate(1.5) brightness(0.8)';
        setTimeout(function () {
            document.body.style.filter = '';
        }, 5000);
    }

})();
