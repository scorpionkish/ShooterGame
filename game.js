class SpaceShooter {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.bullets = [];
        this.enemies = [];
        this.stars = [];
        this.explosions = [];
        
        this.score = 0;
        this.lives = 3;
        this.gameState = 'menu'; // menu, playing, gameOver
        
        this.keys = {};
        this.lastShot = 0;
        this.shotCooldown = 200; // milliseconds
        
        this.enemySpawnRate = 2000; // milliseconds
        this.lastEnemySpawn = 0;
        
        this.gameWidth = 800;
        this.gameHeight = 600;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
        
        // Create camera (orthographic for 2D)
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.OrthographicCamera(
            -this.gameWidth / 2, this.gameWidth / 2,
            this.gameHeight / 2, -this.gameHeight / 2,
            0.1, 1000
        );
        this.camera.position.z = 100;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('gameCanvas'),
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Create stars background
        this.createStars();
        
        // Create player
        this.createPlayer();
        
        // Setup lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 1, 1);
        this.scene.add(directionalLight);
    }
    
    createStars() {
        for (let i = 0; i < 200; i++) {
            const starGeometry = new THREE.SphereGeometry(0.5 + Math.random() * 2, 8, 8);
            const starMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.3 + Math.random() * 0.7
            });
            const star = new THREE.Mesh(starGeometry, starMaterial);
            
            star.position.x = (Math.random() - 0.5) * this.gameWidth * 2;
            star.position.y = (Math.random() - 0.5) * this.gameHeight * 2;
            star.position.z = -50;
            
            star.velocity = 0.5 + Math.random() * 2;
            
            this.stars.push(star);
            this.scene.add(star);
        }
    }
    
    createPlayer() {
        // Create player ship geometry
        const playerGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            // Main body
            0, 15, 0,    // top
            -8, -10, 0,  // bottom left
            8, -10, 0,   // bottom right
            // Wings
            -12, 0, 0,   // left wing
            12, 0, 0,    // right wing
            // Engine glow
            0, -15, 0    // engine
        ]);
        
        const indices = new Uint16Array([
            0, 1, 2,  // main body
            1, 3, 0,  // left wing
            0, 4, 2,  // right wing
        ]);
        
        playerGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        playerGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
        playerGeometry.computeVertexNormals();
        
        // Create player material with gradient
        const playerMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4ecdc4,
            shininess: 100,
            emissive: 0x1a4a4a
        });
        
        this.player = new THREE.Mesh(playerGeometry, playerMaterial);
        this.player.position.set(0, -this.gameHeight / 2 + 50, 0);
        this.scene.add(this.player);
    }
    
    createEnemy() {
        const enemyGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            // Main body
            0, -12, 0,   // bottom
            -6, 8, 0,    // top left
            6, 8, 0,     // top right
            // Wings
            -10, 0, 0,   // left wing
            10, 0, 0,    // right wing
        ]);
        
        const indices = new Uint16Array([
            0, 1, 2,  // main body
            1, 3, 0,  // left wing
            0, 4, 2,  // right wing
        ]);
        
        enemyGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        enemyGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
        enemyGeometry.computeVertexNormals();
        
        const enemyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff6b6b,
            shininess: 50,
            emissive: 0x4a1a1a
        });
        
        const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
        
        // Random position at top of screen
        enemy.position.x = (Math.random() - 0.5) * (this.gameWidth - 100);
        enemy.position.y = this.gameHeight / 2 + 50;
        enemy.position.z = 0;
        
        // Random movement pattern
        enemy.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: -1 - Math.random() * 2
        };
        
        enemy.health = 1;
        
        this.enemies.push(enemy);
        this.scene.add(enemy);
    }
    
    createBullet(x, y, isPlayerBullet = true) {
        const bulletGeometry = new THREE.SphereGeometry(2, 8, 8);
        const bulletMaterial = new THREE.MeshBasicMaterial({ 
            color: isPlayerBullet ? 0x4ecdc4 : 0xff6b6b,
            emissive: isPlayerBullet ? 0x1a4a4a : 0x4a1a1a
        });
        
        const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
        bullet.position.set(x, y, 0);
        bullet.velocity = isPlayerBullet ? 10 : -8;
        bullet.isPlayerBullet = isPlayerBullet;
        
        this.bullets.push(bullet);
        this.scene.add(bullet);
    }
    
    createExplosion(x, y) {
        const explosionGeometry = new THREE.SphereGeometry(15, 16, 16);
        const explosionMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffaa00,
            transparent: true,
            opacity: 1
        });
        
        const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
        explosion.position.set(x, y, 0);
        explosion.scale.set(0.1, 0.1, 0.1);
        explosion.life = 1.0;
        explosion.decay = 0.02;
        
        this.explosions.push(explosion);
        this.scene.add(explosion);
    }
    
    shoot() {
        const now = Date.now();
        if (now - this.lastShot > this.shotCooldown) {
            this.createBullet(this.player.position.x, this.player.position.y + 20);
            this.lastShot = now;
        }
    }
    
    updatePlayer() {
        const speed = 5;
        
        if (this.keys['w'] || this.keys['ArrowUp']) {
            this.player.position.y += speed;
        }
        if (this.keys['s'] || this.keys['ArrowDown']) {
            this.player.position.y -= speed;
        }
        if (this.keys['a'] || this.keys['ArrowLeft']) {
            this.player.position.x -= speed;
        }
        if (this.keys['d'] || this.keys['ArrowRight']) {
            this.player.position.x += speed;
        }
        
        // Keep player in bounds
        this.player.position.x = Math.max(-this.gameWidth / 2 + 20, Math.min(this.gameWidth / 2 - 20, this.player.position.x));
        this.player.position.y = Math.max(-this.gameHeight / 2 + 20, Math.min(this.gameHeight / 2 - 20, this.player.position.y));
        
        // Add some rotation for visual effect
        this.player.rotation.z = (this.keys['a'] || this.keys['ArrowLeft'] ? 0.1 : 0) + 
                                (this.keys['d'] || this.keys['ArrowRight'] ? -0.1 : 0);
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.position.y += bullet.velocity;
            
            // Remove bullets that are off screen
            if (bullet.position.y > this.gameHeight / 2 + 50 || bullet.position.y < -this.gameHeight / 2 - 50) {
                this.scene.remove(bullet);
                this.bullets.splice(i, 1);
            }
        }
    }
    
    updateEnemies() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.position.x += enemy.velocity.x;
            enemy.position.y += enemy.velocity.y;
            
            // Bounce off walls
            if (enemy.position.x < -this.gameWidth / 2 + 20 || enemy.position.x > this.gameWidth / 2 - 20) {
                enemy.velocity.x *= -1;
            }
            
            // Remove enemies that are off screen
            if (enemy.position.y < -this.gameHeight / 2 - 50) {
                this.scene.remove(enemy);
                this.enemies.splice(i, 1);
                this.lives--;
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    updateStars() {
        this.stars.forEach(star => {
            star.position.y -= star.velocity;
            if (star.position.y < -this.gameHeight) {
                star.position.y = this.gameHeight;
                star.position.x = (Math.random() - 0.5) * this.gameWidth * 2;
            }
        });
    }
    
    updateExplosions() {
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            explosion.scale.addScalar(0.5);
            explosion.life -= explosion.decay;
            explosion.material.opacity = explosion.life;
            
            if (explosion.life <= 0) {
                this.scene.remove(explosion);
                this.explosions.splice(i, 1);
            }
        }
    }
    
    checkCollisions() {
        // Check bullet-enemy collisions
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            if (bullet.isPlayerBullet) {
                for (let j = this.enemies.length - 1; j >= 0; j--) {
                    const enemy = this.enemies[j];
                    
                    const distance = bullet.position.distanceTo(enemy.position);
                    if (distance < 20) {
                        // Collision detected
                        this.createExplosion(enemy.position.x, enemy.position.y);
                        this.scene.remove(enemy);
                        this.enemies.splice(j, 1);
                        this.scene.remove(bullet);
                        this.bullets.splice(i, 1);
                        this.score += 100;
                        this.updateUI();
                        break;
                    }
                }
            }
        }
        
        // Check player-enemy collisions
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const distance = this.player.position.distanceTo(enemy.position);
            
            if (distance < 25) {
                this.createExplosion(enemy.position.x, enemy.position.y);
                this.scene.remove(enemy);
                this.enemies.splice(i, 1);
                this.lives--;
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    spawnEnemies() {
        const now = Date.now();
        if (now - this.lastEnemySpawn > this.enemySpawnRate) {
            this.createEnemy();
            this.lastEnemySpawn = now;
            
            // Increase spawn rate over time
            this.enemySpawnRate = Math.max(500, this.enemySpawnRate - 10);
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = `Score: ${this.score}`;
        document.getElementById('lives').textContent = `Lives: ${this.lives}`;
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = `Final Score: ${this.score}`;
        document.getElementById('gameOver').style.display = 'block';
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.enemySpawnRate = 2000;
        
        // Clear existing enemies and bullets
        this.enemies.forEach(enemy => this.scene.remove(enemy));
        this.bullets.forEach(bullet => this.scene.remove(bullet));
        this.explosions.forEach(explosion => this.scene.remove(explosion));
        
        this.enemies = [];
        this.bullets = [];
        this.explosions = [];
        
        // Reset player position
        this.player.position.set(0, -this.gameHeight / 2 + 50, 0);
        
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameOver').style.display = 'none';
        this.updateUI();
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            if (e.code === 'Space' && this.gameState === 'playing') {
                e.preventDefault();
                this.shoot();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Button events
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.gameState === 'playing') {
            this.updatePlayer();
            this.updateBullets();
            this.updateEnemies();
            this.updateStars();
            this.updateExplosions();
            this.checkCollisions();
            this.spawnEnemies();
        } else {
            this.updateStars();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new SpaceShooter();
}); 