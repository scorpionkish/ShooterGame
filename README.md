# Space Shooter - Three.js 2D Game

A modern 2D space shooter game built with Three.js featuring smooth gameplay, beautiful visuals, and engaging mechanics.

## 🎮 Features

- **Smooth 2D Graphics**: Built with Three.js for crisp, modern visuals
- **Responsive Controls**: WASD or Arrow keys for movement, Spacebar for shooting
- **Dynamic Enemy AI**: Enemies with random movement patterns and increasing difficulty
- **Visual Effects**: Explosions, star field background, and smooth animations
- **Score System**: Track your progress and compete for high scores
- **Lives System**: Multiple lives with visual feedback
- **Modern UI**: Beautiful start screen and game over interface
- **Responsive Design**: Works on different screen sizes

## 🚀 How to Run

1. **Simple Setup**: Just open `index.html` in a modern web browser
2. **Local Server** (recommended): Use a local server to avoid CORS issues:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. **Open in Browser**: Navigate to `http://localhost:8000`

## 🎯 How to Play

### Controls
- **Movement**: WASD keys or Arrow keys
- **Shoot**: Spacebar
- **Start Game**: Click "START GAME" button
- **Restart**: Click "PLAY AGAIN" after game over

### Gameplay
1. **Objective**: Destroy enemy ships while avoiding collisions
2. **Scoring**: Each enemy destroyed = 100 points
3. **Lives**: You start with 3 lives
4. **Difficulty**: Enemy spawn rate increases over time
5. **Survival**: Don't let enemies pass you or collide with you

### Game States
- **Menu**: Start screen with game title and instructions
- **Playing**: Active gameplay with HUD showing score and lives
- **Game Over**: Final score display with restart option

## 🛠️ Technical Details

### Built With
- **Three.js**: 3D graphics library for 2D rendering
- **Vanilla JavaScript**: No frameworks, pure ES6+ code
- **HTML5 Canvas**: WebGL rendering for smooth performance
- **CSS3**: Modern styling with gradients and animations

### Architecture
- **Object-Oriented Design**: Clean class-based structure
- **Game Loop**: Efficient animation loop with requestAnimationFrame
- **Collision Detection**: Distance-based collision system
- **Particle System**: Star field background and explosion effects

### Performance Features
- **Object Pooling**: Efficient memory management
- **Culling**: Off-screen objects are removed automatically
- **Optimized Rendering**: Minimal draw calls and efficient geometry

## 🎨 Visual Features

- **Star Field Background**: Animated stars moving across the screen
- **Ship Designs**: Custom geometry for player and enemy ships
- **Explosion Effects**: Animated explosion particles
- **Color Scheme**: Modern cyan/red color palette
- **Smooth Animations**: 60fps gameplay with fluid motion

## 🔧 Customization

The game is easily customizable:

- **Difficulty**: Adjust `enemySpawnRate` and `shotCooldown` in the constructor
- **Visuals**: Modify colors, sizes, and effects in the material definitions
- **Gameplay**: Change movement speed, bullet velocity, and collision distances
- **UI**: Update the HTML/CSS for different styling

## 🌟 Future Enhancements

Potential additions:
- Power-ups and special weapons
- Different enemy types
- Boss battles
- Sound effects and background music
- High score persistence
- Mobile touch controls
- Multiplayer support

## 📱 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

Requires WebGL support for optimal performance.

## 🎮 Enjoy the Game!

Navigate through space, destroy enemy ships, and achieve the highest score possible. The game gets progressively more challenging as you play, so stay sharp and keep shooting!

---

*Built with ❤️ using Three.js* 