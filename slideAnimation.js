export default function slideAnimation (element, configs) {
    if (!element) return
    if (typeof configs !== 'object' || configs === null) { configs = {} }
    
    init(element, configs)
}

function init (element, configs) {
    const defaults = {
        translateX: undefined,  // the distance and direction of the horizontal axis
        translateY: 0,  // the distance and direction of the vertical axis
        duration: 500,  // the time to execute the animation
        show: false,  // affect whether the animation is performed the first time
        scale: 0.95,  // resize the element
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

    if (typeof configs.translateX === 'undefined') {
        const elementToLeft = element.offsetLeft
        const elementToRight = window.innerWidth - element.offsetLeft - element.offsetWidth
        configs.translateX = elementToLeft < elementToRight ? - 0.3 : 0.3
    }
    configs.translateX *= 100
    configs.translateY *= 100

    configs.percent = configs.show ? 1 : 0
}

function bindEvent (element, configs) {
    let {
        show,
        translateX,
        translateY,
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
            updateAnimation()
            animationFrame = requestAnimationFrame(step)
        } else {
            percent = show ? 1 : 0
            updateAnimation()
        }
    }

    function updateAnimation () {
        element.style.transform = `
            translateX(${translateX * (1 - percent)}%)
            scale(${scale + (1 - scale) * percent})
            translateY(${translateY * (1 - percent)}%)
        `
        element.style.opacity = percent
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
