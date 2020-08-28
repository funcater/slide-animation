export default function slideAnimation (element, configs) {
    if (!element) return
    if (typeof configs !== 'object' || configs === null) { configs = {} }
    
    init(element, configs)
}

function init (element, configs) {
    const defaults = {
        transformX: 0,
        transformY: 0,
        duration: 500,
        show: false,
        percent: 1,
        scale: 0.95
    }

    initConfig (configs, defaults)

    if (!configs.transformX) {
        const elementToLeft = element.offsetLeft
        const elementToRight = window.innerWidth - element.offsetLeft - element.offsetWidth
        configs.transformX = elementToLeft < elementToRight ? - 30 : 30
    }

    if (!configs.show) {
        configs.percent = 0
        element.style.opacity = configs.percent
    }
    
    bindEvent(element, configs)
}

function bindEvent (element, configs) {
    let {
        show,
        transformX,
        duration,
        percent,
        scale
    } = configs
    const elementHalfPosition = element.offsetTop + element.offsetHeight / 2
    let elementTopIn
    let elementBottomIn
    let preTime
    let animationFrame

    window.addEventListener('scroll', (e) => {
        elementTopIn = elementHalfPosition - window.scrollY
        elementBottomIn = window.scrollY + window.innerHeight - elementHalfPosition
    
        const isScrollIn =  elementTopIn > 0 && elementBottomIn > 0
        if (show ^ isScrollIn) {
            preTime = undefined
            show = !show
            cancelAnimationFrame(animationFrame)
            animationFrame = requestAnimationFrame(step)
        }
    })

    function step (timeStamp) {
        if (preTime === undefined) {
            preTime = timeStamp
        }
        let changedTime = timeStamp - preTime

        if (percent <= 1 && percent >= 0) {
            preTime = timeStamp
            percent = getPercent(percent, changedTime / duration)
            
            element.style.transform = `translateX(${transformX * (1 - percent)}%) scale(${scale + (1 - scale) * percent})`
            element.style.opacity = percent
            animationFrame = requestAnimationFrame(step)
        } else {
            percent = show ? 1 : 0
            element.style.transform = `translateX(${!show ? transformX : 0}%)`
        }

        function getPercent(percent, timePercent) {
            return percent + getChangedPercent(timePercent)
        }

        function getChangedPercent(timePercent) {
            if (!show) {
                return - timePercent
            }
            return timePercent
        }
    }
}

function initConfig (_configs, defaults) {
    for (const prop in defaults) {
        if (_configs[prop] === undefined) {
            _configs[prop] = defaults[prop]
        }
    }
}
