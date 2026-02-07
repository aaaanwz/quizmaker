const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const TEMPLATES_DIR = path.join(__dirname, '..', 'src', 'templates');

// Clean and create dist directory
if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });
fs.mkdirSync(path.join(DIST_DIR, 'quiz'), { recursive: true });
fs.mkdirSync(path.join(DIST_DIR, 'content'), { recursive: true });
fs.mkdirSync(path.join(DIST_DIR, 'css'), { recursive: true });
fs.mkdirSync(path.join(DIST_DIR, 'js'), { recursive: true });

// Copy static assets
const cssDir = path.join(__dirname, '..', 'src', 'css');
const jsDir = path.join(__dirname, '..', 'src', 'js');

if (fs.existsSync(cssDir)) {
    fs.readdirSync(cssDir).forEach(file => {
        fs.copyFileSync(path.join(cssDir, file), path.join(DIST_DIR, 'css', file));
    });
}

if (fs.existsSync(jsDir)) {
    fs.readdirSync(jsDir).forEach(file => {
        fs.copyFileSync(path.join(jsDir, file), path.join(DIST_DIR, 'js', file));
    });
}

// Copy audio files from content
fs.readdirSync(CONTENT_DIR).forEach(file => {
    if (file.endsWith('.mp3')) {
        fs.copyFileSync(path.join(CONTENT_DIR, file), path.join(DIST_DIR, 'content', file));
    }
});

// Load templates
const indexTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'index.html'), 'utf-8');
const quizTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'quiz.html'), 'utf-8');

// Find all quiz JSON files
const quizFiles = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.json'));

// Build quiz list for index page
const quizList = quizFiles.map(file => {
    const quizName = path.basename(file, '.json');
    const quizData = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8'));
    return {
        name: quizName,
        title: quizData.title,
        questionCount: quizData.questions.length
    };
});

// Generate index.html
const indexHtml = indexTemplate
    .replace('{{QUIZ_LIST}}', JSON.stringify(quizList))
    .replace('{{QUIZ_CARDS}}', quizList.map(quiz => `
    <a href="quiz/${quiz.name}.html" class="quiz-card">
      <div class="quiz-card-content">
        <h2 class="quiz-title">${quiz.title}</h2>
        <p class="quiz-info">${quiz.questionCount}問</p>
      </div>
      <div class="quiz-card-arrow">→</div>
    </a>
  `).join('\n'));

fs.writeFileSync(path.join(DIST_DIR, 'index.html'), indexHtml);
console.log('Generated: index.html');

// Generate quiz pages
quizFiles.forEach(file => {
    const quizName = path.basename(file, '.json');
    const quizData = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8'));

    // Collect all unique answers for wrong answer pool
    const allAnswers = [...new Set(quizData.questions.map(q => q.answer))];

    const quizHtml = quizTemplate
        .replace(/\{\{\s*QUIZ_TITLE\s*\}\}/g, quizData.title)
        .replace(/\{\{\s*QUIZ_DATA\s*\}\}/g, JSON.stringify(quizData))
        .replace(/\{\{\s*ALL_ANSWERS\s*\}\}/g, JSON.stringify(allAnswers));

    fs.writeFileSync(path.join(DIST_DIR, 'quiz', `${quizName}.html`), quizHtml);
    console.log(`Generated: quiz/${quizName}.html`);
});

console.log('\nBuild completed successfully!');
