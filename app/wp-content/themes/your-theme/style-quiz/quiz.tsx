import React from 'react';
import ReactDOM from 'react-dom';

// Replace Next.js Image with regular img
const StyleImage = ({ src, alt, className }: { src: string, alt: string, className: string }) => (
  <img 
    src={`${window.styleQuizConfig.baseUrl}/wp-content/themes/your-theme/style-quiz/images${src}`}
    alt={alt}
    className={className}
  />
);

// Modify the quiz component to use regular img
const StyleQuiz = () => {
  // ... (rest of the component code, replacing Image with StyleImage)
};

// Mount the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('style-quiz-root');
  if (root) {
    ReactDOM.render(<StyleQuiz />, root);
  }
}); 