

function cickc(indi) {
    const stars = [
        document.getElementById('star1'),
        document.getElementById('star2'),
        document.getElementById('star3'),
        document.getElementById('star4'),
        document.getElementById('star5')
    ];
    stars.forEach(star => star.textContent = '☆');
    for (let i = 0; i < indi; i++) stars[i].textContent = '★';
}

function alertErrors(){
    alert('Прстите, вы пока не можете оставлять отзывы')
}