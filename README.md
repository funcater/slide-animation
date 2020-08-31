# slide-animation
Slide-animation is a stand alone library that helps users add smooth slide animations to their elements quickly. Users can invoke methods imported from slideAnimation.js and pass parameters to create their own animation.
### Usage
In the simplest case, it only takes a few lines to get a slide animation.
```
  <img src="down.png" id='demo1'>
  <script type="module">
    import slideAnimation from '../slideAnimation.js'
    slideAnimation(document.getElementById('demo1'))
  </script>
```
To create your own animation instead of using default animation, you will need to pass it some parameters.
```
  <img src="down.png" id='demo2'>
  <script type="module">
    import slideAnimation from '../slideAnimation.js'
    const demo2 = document.getElementById('demo2')
    slideAnimation(demo2, {
      translateX: -0.5,
      scale: 0.5,
      duration: 1000,
      onload: demo2.onload
    })
  </script>
```
With awesome callback and trigger, things will be different.
```
  <img src="backToTopButton.png" id='backToTopButton'>
  <script type="module">
    import slideAnimation from '../slideAnimation.js'
    const backToTopButton = document.getElementById('backToTopButton')
    slideAnimation(backToTopButton, {
      callback: () => {
        console.log('Animation has been performed')
      },
      triggerAnimation: (execute => {
        /*
          Now you get control of the animation.
          You can decide when the animation should be executed.
          You can execute your own code before the animation is performed.
          
          Execute() means it's time to perform the animation.
          Execute(true) means it's time to show the element.
          And execute(false) means it's time to hidden the element.
        */
        if (window.scrollY > window.innerHeight) {
          console.log('BackToTopButton should be shown')
          execute(true)
        } else {
          console.log('BackToTopButton should be hidden')
          execute(false)
        }
      }
    })
  </script>
```
###License
slide-animation is covered by the MIT License
