const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

// Add archiver to package.json dependencies
const packageJson = require('./package.json');
packageJson.devDependencies.archiver = "^5.3.1";
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

// Configuration
const config = {
  themeName: 'your-theme', // Change this to your WordPress theme name
  files: {
    php: [
      {
        name: 'page-style-quiz.php',
        content: `<?php
/*
Template Name: Style Quiz Page
*/

get_header(); ?>

<div id="style-quiz-root"></div>

<?php get_footer(); ?>`
      },
      {
        name: 'functions.php',
        content: `
// Style Quiz Scripts
function enqueue_style_quiz_scripts() {
    if (is_page_template('page-style-quiz.php')) {
        wp_enqueue_script('react', 'https://unpkg.com/react@17/umd/react.production.min.js');
        wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js');
        
        wp_enqueue_script(
            'style-quiz',
            get_template_directory_uri() . '/style-quiz/dist/quiz.js',
            array('react', 'react-dom'),
            '1.0.0',
            true
        );

        wp_enqueue_style(
            'style-quiz-styles',
            get_template_directory_uri() . '/style-quiz/dist/quiz.css'
        );

        wp_localize_script('style-quiz', 'styleQuizConfig', array(
            'baseUrl' => get_site_url(),
            'nonce' => wp_create_nonce('wp_rest'),
        ));
    }
}
add_action('wp_enqueue_scripts', 'enqueue_style_quiz_scripts');`
      }
    ]
  }
};

async function build() {
  try {
    console.log('🚀 Starting build process...');

    // 1. Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });

    // 2. Build the project
    console.log('🔨 Building project...');
    execSync('npm run build', { stdio: 'inherit' });

    // 3. Create dist directory if it doesn't exist
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }

    // 4. Create a temporary directory for WordPress files
    const tempDir = path.join(__dirname, 'temp_wp');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
    fs.mkdirSync(tempDir);
    fs.mkdirSync(path.join(tempDir, 'style-quiz'));
    fs.mkdirSync(path.join(tempDir, 'style-quiz', 'dist'));
    fs.mkdirSync(path.join(tempDir, 'style-quiz', 'images'));

    // 5. Copy build files
    console.log('📋 Copying files...');
    fs.copyFileSync(
      path.join(__dirname, 'dist', 'quiz.js'),
      path.join(tempDir, 'style-quiz', 'dist', 'quiz.js')
    );
    fs.copyFileSync(
      path.join(__dirname, 'dist', 'quiz.css'),
      path.join(tempDir, 'style-quiz', 'dist', 'quiz.css')
    );

    // 6. Copy images
    const imagesDir = path.join(__dirname, 'images');
    if (fs.existsSync(imagesDir)) {
      fs.readdirSync(imagesDir).forEach(file => {
        fs.copyFileSync(
          path.join(imagesDir, file),
          path.join(tempDir, 'style-quiz', 'images', file)
        );
      });
    }

    // 7. Create PHP files
    config.files.php.forEach(file => {
      fs.writeFileSync(path.join(tempDir, file.name), file.content);
    });

    // 8. Create ZIP file
    console.log('📦 Creating ZIP file...');
    const output = fs.createWriteStream(path.join(__dirname, 'style-quiz-wp.zip'));
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log('✨ Build complete! style-quiz-wp.zip has been created');
      console.log('\nTo install:');
      console.log('1. Upload and extract style-quiz-wp.zip to your WordPress theme directory');
      console.log('2. Create a new page in WordPress');
      console.log('3. Select "Style Quiz Page" as the template');
      console.log('4. Publish the page');
      
      // Clean up
      fs.rmSync(tempDir, { recursive: true });
    });

    archive.pipe(output);
    archive.directory(tempDir, false);
    await archive.finalize();

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build(); 