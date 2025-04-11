// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('active');
    
    if (navLinks.classList.contains('active')) {
        document.querySelectorAll('.nav-links li').forEach((item, index) => {
            item.style.setProperty('--i', index + 1);
        });
    }
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('active');
    });
});

// Particle system
const particlesContainer = document.getElementById('particles-container');
const particleCount = 15;

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 2 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = `-${size}px`;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particlesContainer.appendChild(particle);
    setTimeout(() => particle.remove(), (duration + delay) * 1000);
}

for (let i = 0; i < particleCount; i++) createParticle();
setInterval(createParticle, 1000);

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// Typing text effect
const words = ['Analysis', 'Prediction'];
let currentWord = 0, currentLetter = 0, isDeleting = false;
const typedWord = document.getElementById('typed-word');

function type() {
    const current = words[currentWord];
    const displayed = current.substring(0, currentLetter);
    typedWord.textContent = displayed;
    if (!isDeleting && currentLetter < current.length) {
        currentLetter++;
        setTimeout(type, 120);
    } else if (isDeleting && currentLetter > 0) {
        currentLetter--;
        setTimeout(type, 80);
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) currentWord = (currentWord + 1) % words.length;
        setTimeout(type, isDeleting ? 1500 : 300);
    }
}
document.addEventListener("DOMContentLoaded", () => setTimeout(type, 2000));

// Counter animation
function animateCounters() {
    document.querySelectorAll('.counter').forEach(counter => {
        const updateCount = () => {
            const target = +counter.parentElement.getAttribute('data-count');
            const count = +counter.innerText;
            const increment = target / 80;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}

function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
}

let triggered = false;
window.addEventListener('scroll', () => {
    const section = document.getElementById('facts-section');
    if (!triggered && isInViewport(section)) {
        animateCounters();
        triggered = true;
    }
});

document.querySelectorAll('.dropdown > a').forEach(dropToggle => {
    dropToggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            this.parentElement.classList.toggle('active');
        }
    });
});


// Fetch weather from WeatherAPI
async function getWeather() {
    const city = document.getElementById("city").value || "Delhi";
    const apiKey = "b65d70e038bd41019a3160947251004"; // 🔁 Replace with your WeatherAPI key
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        document.querySelector(".weather-output").innerHTML = `<p>❌ ${data.error.message}</p>`;
        return;
      }

      const temp = data.current.temp_c;
      const condition = data.current.condition.text;
      const humidity = data.current.humidity;
      const location = `${data.location.name}, ${data.location.country}`;
      const crops = suggestCrops(temp, condition, humidity);

      document.querySelector(".weather-output").innerHTML = `
        <h3>📍 ${location}</h3>
        <p>🌡️ Temperature: <strong>${temp}°C</strong></p>
        <p>🌤️ Condition: <strong>${condition}</strong></p>
        <p>💧 Humidity: <strong>${humidity}%</strong></p>
        <p>🌾 Suggested Crops: <strong>${crops}</strong></p>
      `;
    } catch (err) {
      document.querySelector(".weather-output").innerHTML = `<p>⚠️ Error fetching weather data. Please try again.</p>`;
      console.error("Weather fetch error:", err);
    }
  }

  // Crop suggestion logic
  function suggestCrops(temp, condition, humidity) {
    const lowerCondition = condition.toLowerCase();
    if (temp > 28 && lowerCondition.includes("sunny")) return "Tomatoes, Peppers, Corn";
    if (lowerCondition.includes("rain") || humidity > 80) return "Paddy, Sugarcane, Jute";
    if (temp < 18) return "Wheat, Mustard, Peas";
    return "Maize, Cotton, Soybean";
  }

  // Auto-run for default city on page load
  window.onload = getWeather;

  
