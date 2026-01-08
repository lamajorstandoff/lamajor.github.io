document.addEventListener('DOMContentLoaded', () => {
    
    // Плавное следование подсветки за курсором
    const glow = document.querySelector('.cursor-glow');
    window.addEventListener('mousemove', (e) => {
        glow.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, rgba(255, 215, 0, 0.08) 0%, transparent 40%)`;
    });

    // Анимация появления при скролле
    const options = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.animate([
                    { opacity: 0, transform: 'translateY(20px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ], {
                    duration: 700,
                    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                    fill: 'forwards'
                });
                observer.unobserve(entry.target);
            }
        });
    }, options);

    document.querySelectorAll('.card-main, .news-card, .hero-content').forEach(el => {
        el.style.opacity = "0";
        observer.observe(el);
    });
});
