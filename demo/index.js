import slideAnimation from '../slideAnimation.js'

slideAnimation(document.getElementById('demo1'))

slideAnimation(document.getElementById('demo2'), {
    translateX: 0.7
})

slideAnimation(document.getElementById('demo3'), {
    translateX: 0,
    translateY: -0.5
})

slideAnimation(document.getElementById('demo4'), {
    scale: 0
})

slideAnimation(document.getElementById('demo5'), {
    duration: 1000
})

slideAnimation(document.getElementById('demo6'), {
    show: true,
    onload: window.onload
})
