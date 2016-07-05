// carousel
$(function() {
    $('#carousel ul').carouFredSel({
        width: '100%',
        items: {
            visible: 1,
            start: -1
        },
        scroll: {
            items: 1,
            duration: 1500,
            timeoutDuration: 4000
        },
        pagination: "#pager",
        auto: true,
        swipe: { onTouch: true, onMouse: true },
        pauseOnHover: true,
        align: 'center',
        responsive: true,
        next: '#next'
    });
});
