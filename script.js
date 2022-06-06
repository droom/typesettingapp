// Register GSAP plugins
gsap.registerPlugin(SplitText, ScrollTrigger);
gsap.config({ trialWarn: false });

// GSAP Split text into words (could also just use spans, but this makes it easier) 
// using position: 'absolute' for the modifiers plugin
const marqueeText = new SplitText(".wrapper", { type: "words", position: 'absolute', });

// words array constant
const words = marqueeText.words;

// get gap between words (cause we are useing SplitText's absolute)
const space = gsap.getProperty(words[1], "left") - (gsap.getProperty(words[0], "width") + gsap.getProperty(words[0], "left"));

let currentWidth = 0;
let prevWidest = 0;
let widest = 0;

// loop through words
words.forEach((el, i) => {
  // get width of element plus space
  const width = gsap.getProperty(el, "width") + space;
  // set widest for modifiers plugin negative value to make sure scrolling word is completely off page/container 
  if (width > prevWidest) {
    widest = width + space;
  }
  // set absolute to left, and use transform instead (for animation performance) 
  gsap.set(el, { x: currentWidth, left: 0 });
  
  // update current x distance  
  currentWidth += width;
  prevWidest = widest;
});

// total width of the words; used for animation calculations
const totalWidth = currentWidth;

// set visibility with gsap to avoid FOUC
gsap.set('.wrapper', { autoAlpha: 1 })
// if there's room to loop setup animation
if (window.innerWidth < currentWidth + widest) {
  const tl = gsap.to(words, {
    x: `-=${totalWidth}`,
    repeat: -1,
    duration: words.length * 1.5,
    ease: "none",
    repeatRefresh: true,
    modifiers: {
      //  use widest element to determine looping points     
      x: gsap.utils.unitize((x) =>
        gsap.utils.wrap(-widest, totalWidth - widest, x)
      )
    }
  });
}