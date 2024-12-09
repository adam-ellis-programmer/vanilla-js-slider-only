import { get } from './utils.js' // Utility function to select DOM elements
import products from './data.js' // Array of products data

const sliderContainer = get('.slide-container') // The container for the slider
const paginationContainer = get('.pagination') // The container for pagination dots

let data = [...products] // Clone the products array to avoid mutating the original

// Function to initialize the slider
const slider = () => {
  // Populate the slider container with slides
  sliderContainer.innerHTML = data
    .map(({ productName, url }, slideIndex) => {
      let possition = 'next' // Default position for a slide is 'next'

      if (slideIndex === 0) {
        possition = 'active' // The first slide is 'active'
      }

      if (slideIndex === data.length - 1) {
        possition = 'last' // The last slide is 'last'
      }

      // Return the HTML for each slide with its position class
      return `
        <article data-id="${slideIndex}" class="slide ${possition}">
        <div class="img-container">
          <img
            class="slider-img"
            src="${url}"
            alt=""
          />
          <div class="img-text-box">
            <p>${productName}</p>
          </div>
          <p class="index">${slideIndex}</p>
        </div>
      </article>
        `
    })
    .join(' ') // Join the slide strings to create the full slider HTML
}

slider() // Call the slider function to initialize the slider

// Buttons to navigate the slider
const nextBtn = get('.next-btn') // Select the "next" button
const prevBtn = get('.prev-btn') // Select the "previous" button

// Function to handle slider movement
const startSlider = (type) => {
  const active = get('.active') // Get the current active slide
  const last = get('.last') // Get the last slide
  const firstEl = sliderContainer.firstElementChild // Get the first slide

  let next = active.nextElementSibling // Get the next slide

  if (!next) {
    // If no next slide exists, wrap to the first slide
    next = sliderContainer.firstElementChild
  }

  // Remove current position classes
  active.classList.remove('active')
  last.classList.remove('last')
  next.classList.remove('next')

  // Update classes based on the direction (type)
  if (type === 'prev') {
    last.classList.add('active') // Move last slide to active
    active.classList.add('next') // Move current active to next
    next = last.previousElementSibling // Get the new "last" slide
    if (!next) {
      next = sliderContainer.lastElementChild // Wrap to the last slide
    }

    firstEl.classList.add('next') // Always set the first element as next
    if (firstEl.classList.contains('active')) {
      firstEl.classList.remove('next') // Ensure active slide is not also 'next'
    }

    active.nextElementSibling?.classList.add('next') // Update next class for the slide after active

    next.classList.add('last') // Move next to last
    next.classList.remove('next') // Ensure it's no longer marked as next

    return // Exit the function after handling 'prev'
  }

  // Default case: Move to the next slide
  active.classList.add('last') // Current active becomes last
  next.classList.add('active') // Next slide becomes active
  last.classList.add('next') // Last slide becomes next
}

let slideIndex = 0 // Track the index of the active slide

// Event listener for the "next" button
nextBtn.addEventListener('click', () => {
  startSlider() // Move to the next slide
  const activeSlide = sliderContainer.querySelector('.active') // Update active slide
  slideIndex = activeSlide.dataset.id // Update the slide index
  updateActiveDot() // Update pagination dots
})

// Event listener for the "previous" button
prevBtn.addEventListener('click', () => {
  startSlider('prev') // Move to the previous slide
  const activeSlide = sliderContainer.querySelector('.active') // Update active slide
  slideIndex = activeSlide.dataset.id // Update the slide index
  updateActiveDot() // Update pagination dots
})

// Initialize pagination dots
paginationContainer.innerHTML = data
  .map(() => {
    return `<div class="dot"></div>` // Create a dot for each slide
  })
  .join(' ') // Join all dots into one string

const dots = document.querySelectorAll('.dot') // Select all dots

// Function to update the active pagination dot
function updateActiveDot() {
  dots.forEach((i) => i.classList.remove('pagination-active')) // Remove active class from all dots
  dots[slideIndex].classList.add('pagination-active') // Add active class to the current dot
}
updateActiveDot() // Set the initial active dot

// Event listener for keyboard navigation
window.addEventListener('keydown', (e) => {
  const keyCode = e.key
  if (keyCode === 'ArrowLeft') {
    startSlider('prev') // Move to the previous slide on left arrow
    const activeSlide = sliderContainer.querySelector('.active')
    slideIndex = activeSlide.dataset.id
    updateActiveDot()
  }

  if (keyCode === 'ArrowRight') {
    startSlider() // Move to the next slide on right arrow
    const activeSlide = sliderContainer.querySelector('.active')
    slideIndex = activeSlide.dataset.id
    updateActiveDot()
  }
})

export default slider // Export the slider for use elsewhere
