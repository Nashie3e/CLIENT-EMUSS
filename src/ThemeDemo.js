import React, { useState } from 'react';
import './ThemeDemo.css';

function ThemeDemo() {
  const [currentTheme, setCurrentTheme] = useState('deped');

  const themes = [
    { name: 'primary', label: 'Primary Blue', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'secondary', label: 'Pink Gradient', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'medical', label: 'Medical Blue', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'dark', label: 'Dark Theme', gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' },
    { name: 'light', label: 'Light Theme', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { name: 'deped', label: 'DepED Building', image: '/background.jpg' }
  ];

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    const theme = themes.find(t => t.name === themeName);
    
    // Update the login container background
    const loginContainer = document.querySelector('.login-container');
    if (loginContainer) {
      if (theme.image) {
        loginContainer.style.backgroundImage = `url(${theme.image})`;
      } else {
        loginContainer.style.backgroundImage = theme.gradient;
      }
      loginContainer.style.backgroundSize = 'cover';
      loginContainer.style.backgroundPosition = 'center';
      loginContainer.style.backgroundRepeat = 'no-repeat';
    }
  };

  return (
    <div className="theme-demo">
      <h2>Background Theme Switcher</h2>
      <p>Click on a theme to change the login page background:</p>
      
      <div className="theme-buttons">
        {themes.map((theme) => (
          <button
            key={theme.name}
            className={`theme-button ${currentTheme === theme.name ? 'active' : ''}`}
            onClick={() => changeTheme(theme.name)}
          >
            {theme.label}
          </button>
        ))}
      </div>
      
      <div className="theme-info">
        <h3>How to change backgrounds in the future:</h3>
        <ol>
          <li><strong>Using Inline Styles:</strong> Modify the <code>backgroundStyle</code> object in <code>Login.js</code></li>
          <li><strong>Adding New Images:</strong> Place new images in the <code>public</code> folder and update the path</li>
          <li><strong>Using Gradients:</strong> Replace the <code>backgroundImage</code> with gradient values</li>
        </ol>
      </div>
    </div>
  );
}

export default ThemeDemo; 