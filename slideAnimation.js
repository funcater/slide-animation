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
        onload: null,  // perform animation after onload event
        callback: null,  // execute something after animation
        triggerAnimation: null,
        triggerEvent: 'scroll'
    }

    initConfig (element, configs, defaults)

    const originTransform = getTransformArray(element)

    if (configs.onload) {
        configs.onload = bindEvent(element, configs, originTransform)
    } else {
        bindEvent(element, configs, originTransform)()
    }
}

function getTransformArray (element) {
    const transformStyle = getStyle(element, 'transform')

    if (transformStyle === 'none') return [1, 0, 0, 1, 0, 0]

    return transformStyle.split('(')[1].split(')')[0].split(', ')
}

function getStyle (obj, prop) {
    if (obj.currentStyle) {
        return obj.currentStyle[prop]
    } else if (window.getComputedStyle) {
        let propprop = prop.replace(/([A-Z])/g, "-$1")
        propprop = prop.toLowerCase()
        return document.defaultView.getComputedStyle(obj, null)[propprop]
    }
    return null;
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
    element.style.opacity = configs.percent
}

function bindEvent (element, configs, originTransform) {
    let {
        show,
        translateX,
        translateY,
        duration,
        percent,
        scale,
        triggerAnimation,
        callback,
        triggerEvent
    } = configs

    let preTime,
        animationFrame

    if (!triggerAnimation){
        triggerAnimation = function (execute) {
            const elementHalfPosition = element.offsetTop + element.offsetHeight / 2
            let elementTopIn = elementHalfPosition > window.scrollY
            let elementBottomIn = window.scrollY + window.innerHeight > elementHalfPosition
            const isScrollIn =  elementTopIn && elementBottomIn
            execute(isScrollIn)
        }
    }

    function scrollCallback () {
        triggerAnimation(executeAnimation)
    }

    function executeAnimation (isShown) {
        if (isShown === undefined || show ^ isShown) {
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
            callback && callback()
        }
    }

    function updateAnimation () {
        const transformChanged = originTransform.join(',').split(',')

        transformChanged[4] = +originTransform[4] + translateX * (1 - percent)
        transformChanged[5] = +originTransform[5] + translateY * (1 - percent)
        transformChanged[0] = +originTransform[0] * (scale + (1 - scale) * percent)
        transformChanged[3] = +originTransform[3] * (scale + (1 - scale) * percent)

        element.style.transform = 'matrix(' + transformChanged.join(',') + ')'
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

    window.addEventListener(triggerEvent, scrollCallback)

    return scrollCallback
}
