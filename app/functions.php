<?php
function enqueue_style_quiz_scripts() {
    if (is_page_template('page-style-quiz.php')) {
        // Enqueue React and ReactDOM
        wp_enqueue_script('react', 'https://unpkg.com/react@17/umd/react.production.min.js');
        wp_enqueue_script('react-dom', 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js');
        
        // Enqueue our quiz app
        wp_enqueue_script(
            'style-quiz',
            get_template_directory_uri() . '/style-quiz/dist/quiz.js',
            array('react', 'react-dom'),
            '1.0.0',
            true
        );

        // Enqueue the styles
        wp_enqueue_style(
            'style-quiz-styles',
            get_template_directory_uri() . '/style-quiz/dist/quiz.css'
        );

        // Pass WordPress data to our script
        wp_localize_script('style-quiz', 'styleQuizConfig', array(
            'baseUrl' => get_site_url(),
            'nonce' => wp_create_nonce('wp_rest'),
        ));
    }
}
add_action('wp_enqueue_scripts', 'enqueue_style_quiz_scripts'); 