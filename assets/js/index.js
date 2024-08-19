try {
  particlesJS.load('background', '/assets/json/particlesjs.json', function() {
    console.log('particles.js config loaded');
  });
} catch (error) {
  alert("particles JS failed to load:", error)
}