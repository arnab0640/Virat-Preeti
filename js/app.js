/* ==========================================================================
   Virat & Preeti - 2nd Anniversary Interactive Logic (Advanced)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Dates Setup
    const ANNIVERSARY_START = new Date('2024-08-16T00:00:00');
    const NEXT_ANNIVERSARY = new Date('2026-08-16T00:00:00');

    // Element References
    const modalOverlay = document.getElementById('welcome-modal');
    const openSurpriseBtn = document.getElementById('open-surprise-btn');
    const heartCanvas = document.getElementById('heart-canvas');

    // Sound / Audio Setup
    let isPlayingAudio = false;
    const musicBtn = document.getElementById('music-toggle-btn');
    const musicDisc = document.getElementById('music-disc');
    const musicStatus = document.getElementById('music-status');
    const bgAudio = document.getElementById('bg-music');

    // 1. Welcome Modal & Gate
    if (openSurpriseBtn) {
        openSurpriseBtn.addEventListener('click', () => {
            modalOverlay.classList.add('hidden');
            triggerConfetti();
            toggleMusic(true);
        });
    }

    // 2. Cursor Particle Sparkles
    document.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.12) { // Sparkle frequency
            createCursorSparkle(e.clientX, e.clientY);
        }
    });

    function createCursorSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.textContent = Math.random() > 0.5 ? '✨' : '💕';
        sparkle.style.position = 'fixed';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.fontSize = '14px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.transition = 'all 0.8s ease-out';
        sparkle.style.opacity = '1';
        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.style.transform = `translateY(-25px) scale(1.4)`;
            sparkle.style.opacity = '0';
        }, 30);

        setTimeout(() => {
            sparkle.remove();
        }, 830);
    }

    // 3. Background Heart & Falling Petals Canvas
    if (heartCanvas) {
        const ctx = heartCanvas.getContext('2d');
        let width = heartCanvas.width = window.innerWidth;
        let height = heartCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = heartCanvas.width = window.innerWidth;
            height = heartCanvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = 50;

        class HeartParticle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = height + Math.random() * 100;
                this.size = Math.random() * 14 + 8;
                this.speedY = Math.random() * 1.5 + 0.8;
                this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
                this.opacity = Math.random() * 0.7 + 0.3;
                this.color = Math.random() > 0.3 ? '#ff4d6d' : '#ffb703';
                this.rotation = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.02;
            }

            update() {
                this.y -= this.speedY;
                this.x += Math.sin(this.y * 0.01) * 0.8;
                this.rotation += this.rotSpeed;

                if (this.y < -20) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                
                // Draw Heart Path
                ctx.beginPath();
                const d = this.size;
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
                ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new HeartParticle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // 4. Live Counter & Countdown Logic
    function updateCounters() {
        const now = new Date();

        // Elapsed since Aug 16, 2024
        const elapsedMs = now - ANNIVERSARY_START;
        if (elapsedMs >= 0) {
            const totalSecs = Math.floor(elapsedMs / 1000);
            const totalMins = Math.floor(totalSecs / 60);
            const totalHours = Math.floor(totalMins / 60);
            const totalDays = Math.floor(totalHours / 24);

            const years = Math.floor(totalDays / 365);
            const daysLeftAfterYear = totalDays % 365;
            const months = Math.floor(daysLeftAfterYear / 30);
            const days = daysLeftAfterYear % 30;

            const hours = Math.floor((elapsedMs / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((elapsedMs / (1000 * 60)) % 60);
            const seconds = Math.floor((elapsedMs / 1000) % 60);

            setText('elapsed-days', totalDays.toLocaleString());
            setText('elapsed-hours', hours.toString().padStart(2, '0'));
            setText('elapsed-mins', minutes.toString().padStart(2, '0'));
            setText('elapsed-secs', seconds.toString().padStart(2, '0'));

            setText('time-summary', `${years} Year, ${months} Months, ${days} Days of Togetherness`);
        }

        // Countdown to 2nd Anniversary (Aug 16, 2026)
        const countdownMs = NEXT_ANNIVERSARY - now;
        if (countdownMs > 0) {
            const cdDays = Math.floor(countdownMs / (1000 * 60 * 60 * 24));
            const cdHours = Math.floor((countdownMs / (1000 * 60 * 60)) % 24);
            const cdMins = Math.floor((countdownMs / (1000 * 60)) % 60);
            const cdSecs = Math.floor((countdownMs / 1000) % 60);

            setText('cd-days', cdDays.toString().padStart(2, '0'));
            setText('cd-hours', cdHours.toString().padStart(2, '0'));
            setText('cd-mins', cdMins.toString().padStart(2, '0'));
            setText('cd-secs', cdSecs.toString().padStart(2, '0'));
        } else {
            setText('cd-days', '00');
            setText('cd-hours', '00');
            setText('cd-mins', '00');
            setText('cd-secs', '00');
            setText('countdown-title', '🎉 Happy 2nd Anniversary Virat & Preeti! 🎉');
        }
    }

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    setInterval(updateCounters, 1000);
    updateCounters();

    // 5. Music Toggle Controller
    if (musicBtn && bgAudio) {
        musicBtn.addEventListener('click', () => {
            toggleMusic(!isPlayingAudio);
        });
    }

    const ytAudio = document.getElementById('yt-music-player');

    function toggleMusic(play) {
        const playerWidget = document.querySelector('.music-player-widget');
        if (play) {
            isPlayingAudio = true;
            if (musicDisc) musicDisc.classList.add('playing');
            if (playerWidget) playerWidget.classList.add('playing');
            if (musicStatus) musicStatus.textContent = 'Playing Ed Sheeran — Perfect 🎵';

            // 1. Try HTML5 Audio
            if (bgAudio) {
                bgAudio.play().catch(err => {
                    console.log('HTML5 audio waiting or falling back to YouTube audio engine:', err);
                });
            }

            // 2. Play Official Ed Sheeran - Perfect via YouTube Audio Engine
            if (ytAudio && ytAudio.contentWindow) {
                ytAudio.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            }
        } else {
            if (bgAudio) bgAudio.pause();
            if (ytAudio && ytAudio.contentWindow) {
                ytAudio.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
            isPlayingAudio = false;
            if (musicDisc) musicDisc.classList.remove('playing');
            if (playerWidget) playerWidget.classList.remove('playing');
            if (musicStatus) musicStatus.textContent = 'Paused (Ed Sheeran — Perfect)';
        }
    }

    // ==========================================================================
    // 6. INTERACTIVE 1-BY-1 PHOTO STORYBOOK GALLERY
    // ==========================================================================
    const stories = [
        {
            chapter: "Chapter 1 of 5",
            date: "August 16, 2024",
            title: "The Moment I Met You",
            image: "assets/images/preeti1.jpg",
            story: "The very first time I looked into your eyes, Preeti, time completely stopped. I knew right then that my life had changed forever. Those spellbinding dark eyes became my absolute favorite sight in the universe.",
            note: "Preeti, you stole my heart with a single glance. I will never forget how bright the world felt at that exact moment. 💕"
        },
        {
            chapter: "Chapter 2 of 5",
            date: "Late 2024",
            title: "Conversations Under the Stars",
            image: "assets/images/preeti2.jpg",
            story: "Remember those endless late-night phone calls where we shared our deepest dreams, secrets, and silly laughs until dawn? Listening to your sweet voice became the comforting highlight of my every single day.",
            note: "Every word you speak feels like music to my soul. You brought warmth and comfort into my life. 🌌"
        },
        {
            chapter: "Chapter 3 of 5",
            date: "2025",
            title: "Grace, Strength & Beauty",
            image: "assets/images/preeti3.jpg",
            story: "Watching you walk with such grace, dignity, and kindness makes me the proudest man alive. Your inner strength and gentle soul inspire me to be better every day.",
            note: "You carry yourself like a true queen. Your heart is pure gold, Preeti. 👑"
        },
        {
            chapter: "Chapter 4 of 5",
            date: "August 2025",
            title: "My Favorite Smile in the World",
            image: "assets/images/preeti4.jpg",
            story: "Whenever I have a long or difficult day, all it takes is one look at your smile to make everything better. You are my sunshine, my comfort, and my peace.",
            note: "Your soft laugh is my absolute favorite sound on Earth. Keep smiling forever, my love! ☀️"
        },
        {
            chapter: "Chapter 5 of 5",
            date: "August 16, 2026",
            title: "Virat & Preeti: 2 Years & Forever",
            image: "assets/images/virat_preeti_hero.png",
            story: "Happy 2nd Anniversary, Preeti! 2 full years of unconditional love, hand in hand. 730+ days of happiness and laughter. This is just the beginning of our lifetime adventure together!",
            note: "I loved you yesterday, I love you today, and I will love you forever & always! 💍"
        }
    ];

    let currentStoryIndex = 0;
    const storyCard3D = document.getElementById('story-card-3d');
    const storyBadge = document.getElementById('story-badge');
    const storyDateTag = document.getElementById('story-date-tag');
    const storyTitle = document.getElementById('story-title');
    const storyParagraph = document.getElementById('story-paragraph');
    const storyImg = document.getElementById('story-img');
    const storyNoteText = document.getElementById('story-note-text');
    const storyDots = document.querySelectorAll('.story-dot');
    const prevBtn = document.getElementById('story-prev-btn');
    const nextBtn = document.getElementById('story-next-btn');
    const flipCardBtn = document.getElementById('flip-card-btn');
    const flipBackBtn = document.getElementById('flip-back-btn');

    function renderStory(index) {
        if (index < 0) index = stories.length - 1;
        if (index >= stories.length) index = 0;
        currentStoryIndex = index;

        const data = stories[currentStoryIndex];

        // Reset flip state if flipped
        if (storyCard3D) storyCard3D.classList.remove('flipped');

        if (storyBadge) storyBadge.textContent = data.chapter;
        if (storyDateTag) storyDateTag.textContent = data.date;
        if (storyTitle) storyTitle.textContent = data.title;
        if (storyParagraph) storyParagraph.textContent = `"${data.story}"`;
        if (storyImg) storyImg.src = data.image;
        if (storyNoteText) storyNoteText.textContent = data.note;

        // Update Dots
        storyDots.forEach((dot, idx) => {
            if (idx === currentStoryIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { renderStory(currentStoryIndex - 1); triggerConfetti(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { renderStory(currentStoryIndex + 1); triggerConfetti(); });
    if (flipCardBtn && storyCard3D) flipCardBtn.addEventListener('click', () => storyCard3D.classList.add('flipped'));
    if (flipBackBtn && storyCard3D) flipBackBtn.addEventListener('click', () => storyCard3D.classList.remove('flipped'));

    // Mobile Swipe Gesture Support for iOS & Android
    let touchStartX = 0;
    let touchEndX = 0;

    if (storyCard3D) {
        storyCard3D.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        storyCard3D.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const threshold = 40;
        if (touchEndX < touchStartX - threshold) {
            // Swiped Left -> Next Story
            renderStory(currentStoryIndex + 1);
            triggerConfetti();
        }
        if (touchEndX > touchStartX + threshold) {
            // Swiped Right -> Prev Story
            renderStory(currentStoryIndex - 1);
            triggerConfetti();
        }
    }

    storyDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-index'));
            renderStory(idx);
            triggerConfetti();
        });
    });

    renderStory(0);

    // 7. Polaroid Lightbox Modal
    const polaroidCards = document.querySelectorAll('.polaroid-card');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    polaroidCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const caption = card.querySelector('.polaroid-caption');
            if (img && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = caption ? caption.textContent : 'Preeti ❤️';
                lightboxModal.classList.add('active');
                triggerSmallHearts(card);
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
        });
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
            }
        });
    }

    // 8. Interactive Love Jar (100 Reasons Generator)
    const reasons = [
        "Your beautiful dark eyes that steal my heart every single time I look at you. ✨",
        "The gentle way you smile when you're genuinely happy. 😊",
        "How you make every single day brighter just by being in my life. ☀️",
        "Your kind, caring heart that always puts others first. ❤️",
        "How Virat and Preeti fit together like two missing puzzle pieces. 🧩",
        "The sweet sound of your voice when you call my name. 🎵",
        "How you support my dreams and stand by me through everything. 🌟",
        "Your cute little expressions that make me fall in love all over again. 💖",
        "The cozy feeling of holding your hand in public. 🤝",
        "How you turn simple moments into lifelong precious memories. 📸",
        "Your incredible strength and grace in everything you do. 👑",
        "How we laugh together at the silly little jokes only we understand. 😄",
        "The warmth of your hugs that make all my worries vanish instantly. 🤗",
        "Your effortless beauty - inside and out. 🌺",
        "How you believe in us, our love, and our beautiful future. 💍",
        "Because 2 years together is just the beginning of our forever! ♾️"
    ];

    const pullReasonBtn = document.getElementById('pull-reason-btn');
    const reasonText = document.getElementById('reason-text');

    if (pullReasonBtn && reasonText) {
        pullReasonBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * reasons.length);
            reasonText.style.opacity = '0';
            reasonText.style.transform = 'translateY(10px)';

            setTimeout(() => {
                reasonText.textContent = `"${reasons[randomIndex]}"`;
                reasonText.style.opacity = '1';
                reasonText.style.transform = 'translateY(0)';
                triggerConfetti();
            }, 250);
        });
    }

    // 9. Secret Love Lock & Letter Reveal
    const unlockBtn = document.getElementById('unlock-letter-btn');
    const passInput = document.getElementById('lock-pass-input');
    const secretPaper = document.getElementById('secret-paper');

    if (unlockBtn && secretPaper) {
        unlockBtn.addEventListener('click', () => {
            secretPaper.classList.add('unlocked');
            unlockBtn.innerHTML = '❤️ Letter Unlocked for Preeti';
            unlockBtn.classList.remove('btn-gold');
            unlockBtn.classList.add('btn-primary');
            triggerConfetti();
        });
    }

    // 10. Interactive Quiz
    const quizOptions = document.querySelectorAll('.quiz-option');
    const quizFeedback = document.getElementById('quiz-feedback');

    quizOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const isCorrect = opt.getAttribute('data-correct') === 'true';
            
            const parent = opt.parentElement;
            parent.querySelectorAll('.quiz-option').forEach(o => {
                o.classList.remove('correct', 'wrong');
            });

            if (isCorrect) {
                opt.classList.add('correct');
                if (quizFeedback) {
                    quizFeedback.textContent = "🎉 Correct! That's our special memory!";
                    quizFeedback.style.color = "#2ecc71";
                }
                triggerConfetti();
            } else {
                opt.classList.add('wrong');
                if (quizFeedback) {
                    quizFeedback.textContent = "Oops! Try again sweetheart 💕";
                    quizFeedback.style.color = "#e74c3c";
                }
            }
        });
    });

    // 11. Wish Generator Wall
    const addWishBtn = document.getElementById('add-wish-btn');
    const wishInput = document.getElementById('wish-input');
    const wishesWall = document.getElementById('wishes-wall');

    if (addWishBtn && wishInput && wishesWall) {
        addWishBtn.addEventListener('click', () => {
            const text = wishInput.value.trim();
            if (text.length > 0) {
                const pill = document.createElement('div');
                pill.className = 'wish-pill';
                pill.textContent = `✨ ${text}`;
                wishesWall.prepend(pill);
                wishInput.value = '';
                triggerConfetti();
            }
        });
    }

    // 12. Helper Utilities: Confetti Trigger
    function triggerConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 75,
                spread: 70,
                origin: { y: 0.7 },
                colors: ['#ff4d6d', '#ffb703', '#ff8fa3', '#ffffff']
            });
        }
    }

    function triggerSmallHearts(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.textContent = '💖';
            heart.style.position = 'fixed';
            heart.style.left = `${rect.left + rect.width / 2 + (Math.random() * 40 - 20)}px`;
            heart.style.top = `${rect.top + (Math.random() * 40 - 20)}px`;
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '99999';
            heart.style.transition = 'all 1s ease-out';
            document.body.appendChild(heart);

            setTimeout(() => {
                heart.style.transform = `translateY(-60px) scale(1.5)`;
                heart.style.opacity = '0';
            }, 50);

            setTimeout(() => {
                heart.remove();
            }, 1050);
        }
    }
});
