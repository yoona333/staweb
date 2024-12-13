document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentIndex = 0;
    let autoplayInterval; // 用于存储自动播放的interval ID
    
    // 创建导航点
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index, direction = 'next') {
        // 在切换幻灯片之前停止所有视频
        slides.forEach(slide => {
            const videoPlayer = slide.querySelector('.video-player');
            const thumbnail = slide.querySelector('img');
            const playButton = slide.querySelector('.play-button');
            if (videoPlayer) {
                videoPlayer.innerHTML = '';
                videoPlayer.classList.remove('active');
                thumbnail.style.opacity = '1';
                playButton.style.display = 'flex';
            }
        });
        
        // 处理从最后一张到第一张的特殊情况
        if (currentIndex === slides.length - 1 && index === 0) {
            const firstSlideClone = slides[0].cloneNode(true);
            track.appendChild(firstSlideClone);
            
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(-${slides.length * 100}%)`;
            
            setTimeout(() => {
                track.style.transition = 'none';
                track.style.transform = 'translateX(0)';
                track.removeChild(firstSlideClone);
            }, 500);
        }
        // 处理从第一张到最后一张的特殊情况
        else if (currentIndex === 0 && index === slides.length - 1) {
            const lastSlideClone = slides[slides.length - 1].cloneNode(true);
            track.insertBefore(lastSlideClone, slides[0]);
            
            track.style.transition = 'none';
            track.style.transform = 'translateX(-100%)';
            
            requestAnimationFrame(() => {
                track.style.transition = 'transform 0.5s ease-in-out';
                track.style.transform = `translateX(0)`;
                
                setTimeout(() => {
                    track.style.transition = 'none';
                    track.style.transform = `translateX(-${(slides.length - 1) * 100}%)`;
                    track.removeChild(lastSlideClone);
                }, 500);
            });
        }
        else {
            // 正常滑动
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(-${index * 100}%)`;
        }
        
        currentIndex = index;
        updateDots();
    }
    
    // 开始自动播放
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            const newIndex = (currentIndex + 1) % slides.length;
            goToSlide(newIndex, 'next');
        }, 3000);  // 从2000改为3000，即3秒
    }
    
    // 停止自动播放
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
    
    // 修改视频播放功能
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            stopAutoplay(); // 点击播放按钮时停止自动轮播
            const videoUrl = this.getAttribute('data-video');
            const slide = this.closest('.carousel-slide');
            const videoPlayer = slide.querySelector('.video-player');
            const thumbnail = slide.querySelector('img');
            
            videoPlayer.innerHTML = `
                <iframe 
                    src="${videoUrl}&volume=100" 
                    scrolling="no" 
                    border="0" 
                    frameborder="no" 
                    framespacing="0" 
                    allowfullscreen="true">
                </iframe>`;
            
            videoPlayer.classList.add('active');
            thumbnail.style.opacity = '0';
            this.style.display = 'none';
        });
    });
    
    // 修改箭头点击事件
    prevButton.addEventListener('click', () => {
        stopAutoplay();
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(newIndex);
    });
    
    nextButton.addEventListener('click', () => {
        stopAutoplay();
        const newIndex = (currentIndex + 1) % slides.length;
        goToSlide(newIndex);
    });
    
    // 开始自动播放
    startAutoplay();
});
