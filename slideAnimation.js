export default function slideAnimation (element, configs) {
    if (!element) return
    if (typeof configs !== 'object' || configs === null) { configs = {} }
    
    init(element, configs)
}

function init (element, configs) {
    const defaults = {
        transformX: undefined,
        transformY: 0,
        duration: 500,
        show: false,
        scale: 0.95,
        onload: null
    }

    initConfig (element, configs, defaults)

    if (configs.onload) {
        configs.onload = bindEvent(element, configs)
    } else {
        bindEvent(element, configs)()
    }
}

function initConfig (element, configs, defaults) {
    for (const prop in defaults) {
        if (configs[prop] === undefined) {
            configs[prop] = defaults[prop]
        }
    }

    if (typeof configs.transformX === 'undefined') {
        const elementToLeft = element.offsetLeft
        const elementToRight = window.innerWidth - element.offsetLeft - element.offsetWidth
        configs.transformX = elementToLeft < elementToRight ? - 30 : 30
    }

    configs.percent = configs.show ? 1 : 0
    element.style.opacity = configs.percent
    element.style.transform = `translateX(${configs.transformX * (1 - configs.percent)}%)`
}

function bindEvent (element, configs) {
    let {
        show,
        transformX,
        duration,
        percent,
        scale
    } = configs

    let preTime,
        animationFrame
    const elementHalfPosition = element.offsetTop + element.offsetHeight / 2

    function scrollCallback () {
        let elementTopIn = elementHalfPosition > window.scrollY
        let elementBottomIn = window.scrollY + window.innerHeight > elementHalfPosition
        const isScrollIn =  elementTopIn && elementBottomIn
        if (show ^ isScrollIn) {
            preTime = undefined
            show = !show
            cancelAnimationFrame(animationFrame)
            animationFrame = requestAnimationFrame(step)
        }
    }

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

    window.addEventListener('scroll', scrollCallback)

    return scrollCallback
}
