window.addEventListener('load', () => {

    const video = document.getElementById('videoPlayer');
    const playPauseBtn = document.getElementById('playPause');
    const slideBar = document.getElementById('sliderBar');
    const currentTime = document.getElementById('currentTime');
    const durationTime = document.getElementById('durationTime');
    const viewsNum = document.getElementsByClassName('views')[0];
    const thumbsUpNum = document.getElementById('thumbsUp');
    const thumbsDownNum = document.getElementById('thumbsDown');

    const db = firebase.database();
    const viewsRef = db.ref('views');
    const thumbsUpRef = db.ref('thumbsUp');
    const thumbsDownRef = db.ref('thumbsDown');

    let userView = localStorage.getItem("view");
    let userThumb = localStorage.getItem("thumb");

    // localStorage.removeItem("thumb");
    // localStorage.removeItem("view")

    if (userThumb === 'up') {
        thumbsUpNum.style.backgroundColor = "green";
    }

    if (userThumb === 'down') {
        thumbsDownNum.style.backgroundColor = "red";
    }


    let socialView = false;
    let views;
    viewsRef.on('value', (snap) => {
        views = snap.val();
        viewsNum.textContent = snap.val();
        if(!socialView) {
            socialView = true;
            document.getElementsByClassName("viewsContainer")[0].style.display = "block";
        }
    });

    let thumbUp = false;
    let likes;
    thumbsUpRef.on('value', (snap) => {
        likes = snap.val();
        thumbsUpNum.textContent = "thumbsUp: " + likes;
        if(!thumbUp) {
            thumbUp = true;
            thumbsUpNum.style.display = "inline-block";
        }
    });

    let thumbDown = false;
    let disLikes;
    thumbsDownRef.on('value', (snap) => {
        disLikes = snap.val();
        thumbsDownNum.textContent = "thumbsDown: " + disLikes;
        if(!thumbDown) {
            thumbDown = true;
            thumbsDownNum.style.display = "inline-block";
        }
    });

    thumbsUpNum.addEventListener('click', () => {
        thumbsUpNum.style.backgroundColor = "green";
        thumbsDownNum.style.backgroundColor = "white";
        if (!userThumb || userThumb === 'down') {
            if ( userThumb === 'down') {
                thumbsDownRef.set(disLikes - 1);
            }
            localStorage.setItem('thumb', 'up');
            userThumb = 'up';
            thumbsUpRef.set(likes + 1);
        }
    });

    thumbsDownNum.addEventListener('click', () => {
        thumbsUpNum.style.backgroundColor = "white";
        thumbsDownNum.style.backgroundColor = "red";
        if (!userThumb || userThumb === 'up') {
            if ( userThumb === 'up') {
                thumbsUpRef.set(likes - 1);
            }
            localStorage.setItem('thumb', 'down');
            userThumb = 'down';
            thumbsDownRef.set(disLikes + 1);
        }
    });


    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            if(!userView) {
                userView = true;
                localStorage.setItem("view", "true");
                viewsRef.set(views + 1);
                console.log('not viewed');
            }
            playPauseBtn.textContent = "Pause";
            video.play();
        } else {
            playPauseBtn.textContent = "Play";
            video.pause();
        }
    });

    slideBar.addEventListener('change', () => {
        const videoTime = video.duration * (slideBar.value / 100);
        video.currentTime = videoTime;
    });

    video.addEventListener('timeupdate', () => {
        const barTime = video.currentTime * (100 / video.duration);
        slideBar.value = barTime;

        const currentMinutes = Math.floor(video.currentTime/60);
        let currentSeconds = Math.floor(video.currentTime - currentMinutes*60);

        const durationMinutes = Math.floor(video.duration/60);
        let durationSeconds = Math.floor(video.duration - durationMinutes*60);

        if (currentSeconds < 10) {
            currentSeconds = "0" + currentSeconds;
        }

        if (durationSeconds < 10 ) {
            durationSeconds = "0" + durationSeconds;
        }

        currentTime.textContent = currentMinutes + ":" + currentSeconds;
        durationTime.textContent = durationMinutes + ":" + durationSeconds;
    });
});
