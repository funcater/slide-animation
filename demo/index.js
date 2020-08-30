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

const demo7 = document.getElementById('demo7')
demo7.addEventListener('click', () =>{
    demo7.classList.toggle('msg')
    demo7.classList.toggle('active')
})

slideAnimation(demo7, {
    callback: () => {
        demo7.classList.add('msg')
    },
    triggerAnimation: (execute) => {
        let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        if (scrollHeight - window.scrollY - window.innerHeight < 5) {
            demo7.classList.remove('msg')
            execute(true)
        } else {
            demo7.classList.remove('msg')
            execute(false)
        }
    },
    translateX: 0.5,
    duration: 1000
})

slideAnimation(document.getElementById('demo8'), {
    translateX: 1
})
