// ICT Quiz System - Complete Application Logic
class QuizSystem {
    constructor() {
        this.currentUser = null;
        this.currentTheme = 'default';
        this.currentQuiz = null;
        this.currentQuestion = 0;
        this.quizTimer = null;
        this.violations = 0;
        this.violationLimit = 5;
        this.quizAnswers = {};
        this.quizStartTime = null;
        this.sessionCheckInterval = null;
        
        // Initialize data with localStorage persistence
        this.initializeData();
        this.initializeApp();
    }

    // CRITICAL FIX: Proper localStorage implementation
    initializeData() {
        try {
            // Load existing data from localStorage or use defaults
            const savedData = localStorage.getItem('ictQuizSystemData');
            if (savedData) {
                this.data = JSON.parse(savedData);
            } else {
                this.data = this.getDefaultData();
                this.saveData();
            }
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
            this.data = this.getDefaultData();
        }
    }

    getDefaultData() {
        return {
            adminConfig: {
                username: 'admin',
                password: 'admin123',
                currentTheme: 'default',
                globalSettings: {
                    defaultViolationLimit: 5,
                    autoSubmitEnabled: true
                }
            },
            students: [],
            quizzes: [
                {
                    id: 'quiz_001',
                    title: 'ICT Fundamentals - Class 10',
                    class: 'Class 10',
                    subject: 'ICT Fundamentals',
                    description: 'Basic concepts of Information and Communication Technology',
                    duration: 30,
                    violationLimit: 5,
                    settings: {
                        shuffle: true,
                        allowRetake: true,
                        showResults: false,
                        antiCheat: true
                    },
                    questions: [
                        {
                            id: 1,
                            question: 'What does ICT stand for?',
                            options: [
                                'Information and Communication Technology',
                                'Internet and Computer Technology',
                                'Information Control Technology',
                                'Integrated Communication Technology'
                            ],
                            correct: 0
                        },
                        {
                            id: 2,
                            question: 'Which of the following is an input device?',
                            options: [
                                'Monitor',
                                'Printer',
                                'Keyboard',
                                'Speaker'
                            ],
                            correct: 2
                        },
                        {
                            id: 3,
                            question: 'What is the main function of RAM?',
                            options: [
                                'Permanent storage',
                                'Temporary storage',
                                'Processing data',
                                'Displaying output'
                            ],
                            correct: 1
                        },
                        {
                            id: 4,
                            question: 'Which protocol is used for web browsing?',
                            options: ['FTP', 'SMTP', 'HTTP', 'POP3'],
                            correct: 2
                        },
                        {
                            id: 5,
                            question: 'What does CPU stand for?',
                            options: [
                                'Central Processing Unit',
                                'Computer Processing Unit',
                                'Central Program Unit',
                                'Computer Program Unit'
                            ],
                            correct: 0
                        }
                    ]
                },
                {
                    id: 'quiz_002',
                    title: 'Programming Basics - Class 11',
                    class: 'Class 11',
                    subject: 'Programming',
                    description: 'Introduction to programming concepts',
                    duration: 45,
                    violationLimit: 6,
                    settings: {
                        shuffle: true,
                        allowRetake: false,
                        showResults: true,
                        antiCheat: true
                    },
                    questions: [
                        {
                            id: 1,
                            question: 'What is a variable in programming?',
                            options: [
                                'A fixed value that cannot change',
                                'A storage location with an associated name',
                                'A type of loop',
                                'A programming language'
                            ],
                            correct: 1
                        },
                        {
                            id: 2,
                            question: 'Which of the following is a programming language?',
                            options: [
                                'HTML',
                                'CSS',
                                'Python',
                                'HTTP'
                            ],
                            correct: 2
                        }
                    ]
                }
            ],
            results: [],
            sessions: [],
            activityLogs: [],
            notices: [],
            violations: []
        };
    }

    // CRITICAL FIX: Robust data persistence
    saveData() {
        try {
            localStorage.setItem('ictQuizSystemData', JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
            this.showToast('Failed to save data. Storage may be full.', 'error');
        }
    }

    initializeApp() {
        this.applyTheme(this.data.adminConfig.currentTheme || 'default');
        this.setupEventListeners();
        this.showScreen('loginScreen');
        this.updateStats();
        this.setupAntiCheat();
    }

    // CRITICAL FIX: Enhanced anti-cheat system
    setupAntiCheat() {
        // Prevent context menu and key combinations during quiz
        document.addEventListener('contextmenu', (e) => {
            if (document.body.classList.contains('quiz-mode')) {
                e.preventDefault();
                this.recordViolation('Right-click attempt');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (document.body.classList.contains('quiz-mode')) {
                // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.key === 'u') ||
                    (e.ctrlKey && e.key === 'c') ||
                    (e.ctrlKey && e.key === 'v') ||
                    (e.ctrlKey && e.key === 's') ||
                    (e.altKey && e.key === 'Tab')) {
                    e.preventDefault();
                    this.recordViolation('Keyboard shortcut attempt');
                }
            }
        });

        // Tab/window focus monitoring
        document.addEventListener('visibilitychange', () => {
            if (document.body.classList.contains('quiz-mode') && document.hidden) {
                this.recordViolation('Tab/window focus lost');
            }
        });

        window.addEventListener('blur', () => {
            if (document.body.classList.contains('quiz-mode')) {
                this.recordViolation('Window focus lost');
            }
        });

        window.addEventListener('beforeunload', (e) => {
            if (document.body.classList.contains('quiz-mode')) {
                e.preventDefault();
                e.returnValue = 'Are you sure you want to leave? Your quiz progress will be lost.';
                return e.returnValue;
            }
        });
    }

    setupEventListeners() {
        // Theme selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-card')) {
                const themeCard = e.target.closest('.theme-card');
                const themeName = themeCard.dataset.theme;
                this.selectTheme(themeName);
            }
        });

        // Session monitoring
        this.sessionCheckInterval = setInterval(() => {
            this.checkActiveSessions();
        }, 30000); // Check every 30 seconds
    }

    // Theme Management
    applyTheme(themeName) {
        document.body.setAttribute('data-theme', themeName);
        this.currentTheme = themeName;
        this.data.adminConfig.currentTheme = themeName;
        this.saveData();
        
        // Update theme cards active state
        document.querySelectorAll('.theme-card').forEach(card => {
            card.classList.toggle('active', card.dataset.theme === themeName);
        });
    }

    selectTheme(themeName) {
        this.applyTheme(themeName);
        this.closeThemeModal();
        this.showToast(`Theme changed to ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}`, 'success');
        this.logActivity(`Changed theme to ${themeName}`, this.currentUser?.fullName || 'User');
    }

    // Authentication
    adminLogin(event) {
        event.preventDefault();
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value.trim();

        if (username === this.data.adminConfig.username && 
            password === this.data.adminConfig.password) {
            this.currentUser = { type: 'admin', username };
            this.showScreen('adminDashboard');
            this.updateAdminDashboard();
            this.showToast('Admin login successful', 'success');
            this.logActivity('Admin logged in', 'Admin');
            document.getElementById('currentUserDisplay').textContent = `Admin: ${username}`;
        } else {
            this.showToast('Invalid admin credentials. Use admin/admin123', 'error');
        }
    }

    studentLogin(event) {
        event.preventDefault();
        const username = document.getElementById('studentUsername').value.trim();
        const password = document.getElementById('studentPassword').value.trim();

        const student = this.data.students.find(s => 
            s.username === username && s.password === password
        );

        if (student) {
            this.currentUser = { type: 'student', ...student };
            this.showScreen('studentDashboard');
            this.updateStudentDashboard();
            this.showToast(`Welcome back, ${student.fullName}!`, 'success');
            this.logActivity('Student logged in', student.fullName);
        } else {
            this.showToast('Invalid student credentials', 'error');
        }
    }

    studentRegister(event) {
        event.preventDefault();
        const fullName = document.getElementById('regFullName').value.trim();
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }

        if (this.data.students.find(s => s.username === username)) {
            this.showToast('Username already exists', 'error');
            return;
        }

        if (password.length < 4) {
            this.showToast('Password must be at least 4 characters', 'error');
            return;
        }

        const newStudent = {
            id: Date.now().toString(),
            fullName,
            username,
            password,
            registeredAt: new Date().toISOString(),
            quizHistory: [],
            totalViolations: 0,
            totalQuizzes: 0,
            averageScore: 0
        };

        this.data.students.push(newStudent);
        this.saveData();
        this.showToast('Registration successful! Please login.', 'success');
        this.switchTab('student');
        this.logActivity('New student registered', fullName);
        
        // Clear form
        event.target.reset();
    }

    logout() {
        // Clean up any active quiz session
        if (this.currentQuiz) {
            this.endQuizSession();
        }
        
        this.currentUser = null;
        this.currentQuiz = null;
        this.currentQuestion = 0;
        this.violations = 0;
        this.quizAnswers = {};
        document.body.classList.remove('quiz-mode');
        
        if (this.quizTimer) {
            clearInterval(this.quizTimer);
        }
        
        this.showScreen('loginScreen');
        this.showToast('Logged out successfully', 'success');
    }

    // Screen Management
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.login-form').forEach(form => {
            form.classList.remove('active');
        });
        
        // Find the button that was clicked
        const clickedButton = Array.from(document.querySelectorAll('.tab-btn')).find(btn => 
            btn.textContent.toLowerCase().includes(tabName.toLowerCase())
        );
        if (clickedButton) {
            clickedButton.classList.add('active');
        }
        
        if (tabName === 'admin') {
            document.getElementById('adminLogin').classList.add('active');
        } else if (tabName === 'student') {
            document.getElementById('studentLogin').classList.add('active');
        } else if (tabName === 'register') {
            document.getElementById('studentRegister').classList.add('active');
        }
    }

    switchAdminTab(tabName) {
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.admin-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Find the button that was clicked and make it active
        const clickedButton = Array.from(document.querySelectorAll('.admin-tab-btn')).find(btn => 
            btn.textContent.toLowerCase().includes(tabName.toLowerCase())
        );
        if (clickedButton) {
            clickedButton.classList.add('active');
        }
        
        document.getElementById(tabName + 'Tab').classList.add('active');
        
        if (tabName === 'students') {
            this.updateStudentsList();
        } else if (tabName === 'monitoring') {
            this.updateLiveMonitoring();
        } else if (tabName === 'quizzes') {
            this.updateQuizList();
        } else if (tabName === 'overview') {
            this.updateAdminDashboard();
        }
    }

    // Admin Dashboard Updates
    updateAdminDashboard() {
        this.updateStats();
        this.updateRecentActivity();
        this.updateQuizList();
    }

    updateStats() {
        document.getElementById('totalStudents').textContent = this.data.students.length;
        document.getElementById('totalQuizzes').textContent = this.data.quizzes.length;
        document.getElementById('activeQuizzes').textContent = this.data.sessions.length;
        
        const totalViolations = this.data.violations.length;
        document.getElementById('totalViolations').textContent = totalViolations;
    }

    updateRecentActivity() {
        const activityContainer = document.getElementById('recentActivity');
        const recentLogs = this.data.activityLogs.slice(-10).reverse();
        
        if (recentLogs.length === 0) {
            activityContainer.innerHTML = '<p class="text-secondary">No recent activity</p>';
            return;
        }
        
        activityContainer.innerHTML = recentLogs.map(log => `
            <div class="activity-item fade-in">
                <strong>${log.student || 'System'}</strong>: ${log.action}
                <small>${new Date(log.timestamp).toLocaleString()}</small>
            </div>
        `).join('');
    }

    updateQuizList() {
        const quizList = document.getElementById('quizList');
        
        if (this.data.quizzes.length === 0) {
            quizList.innerHTML = '<p class="text-secondary">No quizzes created yet</p>';
            return;
        }
        
        quizList.innerHTML = this.data.quizzes.map(quiz => `
            <div class="quiz-item fade-in">
                <div class="quiz-info">
                    <h4>${quiz.title}</h4>
                    <div class="quiz-meta">
                        <span>Class: ${quiz.class}</span>
                        <span>Subject: ${quiz.subject}</span>
                        <span>Duration: ${quiz.duration} min</span>
                        <span>Questions: ${quiz.questions.length}</span>
                        <span>Violations: ${quiz.violationLimit}</span>
                    </div>
                </div>
                <div class="quiz-actions">
                    <button class="btn btn--secondary" onclick="quizSystem.editQuiz('${quiz.id}')">Edit</button>
                    <button class="btn btn--outline" onclick="quizSystem.deleteQuiz('${quiz.id}')">Delete</button>
                    <button class="btn btn--primary" onclick="quizSystem.viewQuizResults('${quiz.id}')">Results</button>
                </div>
            </div>
        `).join('');
    }

    updateStudentsList() {
        const studentsList = document.getElementById('studentsList');
        
        if (this.data.students.length === 0) {
            studentsList.innerHTML = '<p class="text-secondary">No students registered yet</p>';
            return;
        }
        
        studentsList.innerHTML = this.data.students.map(student => `
            <div class="student-item fade-in">
                <div class="student-info">
                    <h4>${student.fullName}</h4>
                    <p>@${student.username} • ID: ${student.id}</p>
                    <p><small>Registered: ${new Date(student.registeredAt).toLocaleDateString()}</small></p>
                </div>
                <div class="student-stats">
                    <span>Quizzes: ${student.totalQuizzes || 0}</span>
                    <span>Average: ${student.averageScore || 0}%</span>
                    <span>Violations: ${student.totalViolations || 0}</span>
                </div>
            </div>
        `).join('');
    }

    updateLiveMonitoring() {
        const liveMonitoring = document.getElementById('liveMonitoring');
        
        if (this.data.sessions.length === 0) {
            liveMonitoring.innerHTML = '<p class="text-secondary">No active quiz sessions</p>';
            return;
        }
        
        liveMonitoring.innerHTML = this.data.sessions.map(session => {
            const student = this.data.students.find(s => s.id === session.studentId);
            const quiz = this.data.quizzes.find(q => q.id === session.quizId);
            const elapsed = Math.floor((Date.now() - new Date(session.startTime)) / 1000 / 60);
            
            return `
                <div class="active-session fade-in">
                    <div class="session-header">
                        <h4>${student?.fullName || 'Unknown'}</h4>
                        <span class="session-status ${session.violations > 2 ? 'status-warning' : 'status-active'}">
                            ${session.violations > 2 ? 'Warning' : 'Active'}
                        </span>
                    </div>
                    <div class="session-details">
                        <p><strong>Quiz:</strong> ${quiz?.title || 'Unknown'}</p>
                        <p><strong>Progress:</strong> ${session.currentQuestion + 1}/${quiz?.questions.length || 0}</p>
                        <p><strong>Time Elapsed:</strong> ${elapsed} min</p>
                        <p><strong>Violations:</strong> ${session.violations}</p>
                    </div>
                    <div class="session-controls">
                        <button class="btn btn--sm btn--outline" onclick="quizSystem.terminateSession('${session.id}')">Terminate</button>
                        <button class="btn btn--sm btn--secondary" onclick="quizSystem.viewSessionDetails('${session.id}')">Details</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Quiz Management
    showCreateQuiz() {
        const modal = document.getElementById('createQuizModal');
        modal.classList.add('active');
        
        // Reset form
        document.getElementById('quizTitle').value = '';
        document.getElementById('quizClass').value = '';
        document.getElementById('quizSubject').value = '';
        document.getElementById('quizDuration').value = '30';
        document.getElementById('violationLimit').value = '5';
        
        // Clear questions and add first question
        document.getElementById('questionsList').innerHTML = '';
        this.addQuestion();
    }

    closeCreateQuiz() {
        const modal = document.getElementById('createQuizModal');
        modal.classList.remove('active');
    }

    addQuestion() {
        const questionsList = document.getElementById('questionsList');
        const questionCount = questionsList.children.length + 1;
        
        const questionHTML = `
            <div class="question-item" data-question="${questionCount}">
                <div class="flex justify-between items-center mb-8">
                    <h5>Question ${questionCount}</h5>
                    <button type="button" class="remove-question" onclick="quizSystem.removeQuestion(this)">Remove</button>
                </div>
                <div class="form-group">
                    <label class="form-label">Question Text</label>
                    <textarea class="form-control" name="question_${questionCount}" required rows="3" placeholder="Enter your question here..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Options (Select the correct answer)</label>
                    <div class="options-list">
                        <div class="option-input">
                            <input type="radio" name="correct_${questionCount}" value="0" required>
                            <input type="text" class="form-control" name="option_${questionCount}_0" placeholder="Option 1" required>
                        </div>
                        <div class="option-input">
                            <input type="radio" name="correct_${questionCount}" value="1" required>
                            <input type="text" class="form-control" name="option_${questionCount}_1" placeholder="Option 2" required>
                        </div>
                        <div class="option-input">
                            <input type="radio" name="correct_${questionCount}" value="2" required>
                            <input type="text" class="form-control" name="option_${questionCount}_2" placeholder="Option 3" required>
                        </div>
                        <div class="option-input">
                            <input type="radio" name="correct_${questionCount}" value="3" required>
                            <input type="text" class="form-control" name="option_${questionCount}_3" placeholder="Option 4" required>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        questionsList.insertAdjacentHTML('beforeend', questionHTML);
    }

    removeQuestion(button) {
        const questionItem = button.closest('.question-item');
        if (document.querySelectorAll('.question-item').length > 1) {
            questionItem.remove();
            
            // Renumber remaining questions
            const questions = document.querySelectorAll('.question-item');
            questions.forEach((question, index) => {
                const questionNum = index + 1;
                question.dataset.question = questionNum;
                question.querySelector('h5').textContent = `Question ${questionNum}`;
                
                // Update form field names
                const textarea = question.querySelector('textarea');
                textarea.name = `question_${questionNum}`;
                
                const radios = question.querySelectorAll('input[type="radio"]');
                radios.forEach(radio => {
                    radio.name = `correct_${questionNum}`;
                });
                
                const textInputs = question.querySelectorAll('input[type="text"]');
                textInputs.forEach((input, idx) => {
                    input.name = `option_${questionNum}_${idx}`;
                });
            });
        } else {
            this.showToast('At least one question is required', 'error');
        }
    }

    createQuiz(event) {
        event.preventDefault();
        
        try {
            const title = document.getElementById('quizTitle').value.trim();
            const quizClass = document.getElementById('quizClass').value;
            const subject = document.getElementById('quizSubject').value;
            const duration = parseInt(document.getElementById('quizDuration').value);
            const violationLimit = parseInt(document.getElementById('violationLimit').value);
            
            if (!title || !quizClass || !subject) {
                this.showToast('Please fill in all required fields', 'error');
                return;
            }
            
            const quiz = {
                id: Date.now().toString(),
                title,
                class: quizClass,
                subject,
                description: `${subject} quiz for ${quizClass}`,
                duration,
                violationLimit,
                settings: {
                    shuffle: document.getElementById('shuffleQuestions').checked,
                    allowRetake: document.getElementById('allowRetake').checked,
                    showResults: document.getElementById('showResults').checked,
                    antiCheat: document.getElementById('antiCheatEnabled').checked
                },
                questions: [],
                createdAt: new Date().toISOString()
            };
            
            const questions = document.querySelectorAll('.question-item');
            questions.forEach((questionItem, index) => {
                const questionNum = index + 1;
                const questionText = questionItem.querySelector(`textarea[name="question_${questionNum}"]`).value.trim();
                const correctRadio = questionItem.querySelector(`input[name="correct_${questionNum}"]:checked`);
                
                if (!questionText) {
                    throw new Error(`Please enter text for Question ${questionNum}`);
                }
                
                if (!correctRadio) {
                    throw new Error(`Please select the correct answer for Question ${questionNum}`);
                }
                
                const correctAnswer = parseInt(correctRadio.value);
                
                const options = [];
                for (let i = 0; i < 4; i++) {
                    const optionValue = questionItem.querySelector(`input[name="option_${questionNum}_${i}"]`).value.trim();
                    if (!optionValue) {
                        throw new Error(`Please fill in all options for Question ${questionNum}`);
                    }
                    options.push(optionValue);
                }
                
                quiz.questions.push({
                    id: questionNum,
                    question: questionText,
                    options: options,
                    correct: correctAnswer
                });
            });
            
            if (quiz.questions.length === 0) {
                this.showToast('Please add at least one question', 'error');
                return;
            }
            
            this.data.quizzes.push(quiz);
            this.saveData();
            this.updateQuizList();
            this.updateStats();
            this.closeCreateQuiz();
            this.showToast('Quiz created successfully!', 'success');
            this.logActivity(`Created quiz: ${quiz.title}`, 'Admin');
            
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    editQuiz(quizId) {
        this.showToast('Edit functionality coming soon!', 'info');
    }

    deleteQuiz(quizId) {
        if (confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
            const quiz = this.data.quizzes.find(q => q.id === quizId);
            this.data.quizzes = this.data.quizzes.filter(q => q.id !== quizId);
            this.saveData();
            this.updateQuizList();
            this.updateStats();
            this.showToast('Quiz deleted successfully', 'success');
            this.logActivity(`Deleted quiz: ${quiz?.title || 'Unknown'}`, 'Admin');
        }
    }

    viewQuizResults(quizId) {
        const quiz = this.data.quizzes.find(q => q.id === quizId);
        const results = this.data.results.filter(r => r.quizId === quizId);
        
        if (results.length === 0) {
            this.showToast('No results available for this quiz', 'info');
            return;
        }
        
        let resultText = `Results for: ${quiz.title}\n\n`;
        results.forEach(result => {
            const student = this.data.students.find(s => s.id === result.studentId);
            resultText += `${student?.fullName || 'Unknown'}: ${result.score}% (${result.violations} violations)\n`;
        });
        
        alert(resultText);
    }

    // Student Dashboard
    updateStudentDashboard() {
        document.getElementById('studentName').textContent = this.currentUser.fullName;
        
        // Update student stats
        document.getElementById('studentQuizzesTaken').textContent = this.currentUser.totalQuizzes || 0;
        document.getElementById('studentAverageScore').textContent = (this.currentUser.averageScore || 0) + '%';
        document.getElementById('studentViolations').textContent = this.currentUser.totalViolations || 0;
        
        // Update available quizzes
        this.updateStudentQuizList();
        this.updateQuizHistory();
        this.updateNoticeBoard();
    }

    updateStudentQuizList() {
        const quizList = document.getElementById('studentQuizList');
        
        if (this.data.quizzes.length === 0) {
            quizList.innerHTML = '<p class="text-secondary">No quizzes available</p>';
            return;
        }
        
        let filteredQuizzes = this.data.quizzes;
        
        // Apply filters
        const classFilter = document.getElementById('classFilter')?.value;
        const subjectFilter = document.getElementById('subjectFilter')?.value;
        
        if (classFilter) {
            filteredQuizzes = filteredQuizzes.filter(q => q.class === classFilter);
        }
        
        if (subjectFilter) {
            filteredQuizzes = filteredQuizzes.filter(q => q.subject === subjectFilter);
        }
        
        quizList.innerHTML = filteredQuizzes.map(quiz => {
            const hasAttempted = this.data.results.some(r => 
                r.studentId === this.currentUser.id && r.quizId === quiz.id
            );
            
            return `
                <div class="student-quiz-card fade-in" onclick="quizSystem.startQuiz('${quiz.id}')">
                    <span class="quiz-category">${quiz.class}</span>
                    <h4>${quiz.title}</h4>
                    <p><strong>Subject:</strong> ${quiz.subject}</p>
                    <p><strong>Duration:</strong> ${quiz.duration} minutes</p>
                    <p><strong>Questions:</strong> ${quiz.questions.length}</p>
                    <p><strong>Violation Limit:</strong> ${quiz.violationLimit}</p>
                    ${hasAttempted ? '<div class="result-status status-passed">Attempted</div>' : ''}
                </div>
            `;
        }).join('');
    }

    filterQuizzes() {
        this.updateStudentQuizList();
    }

    updateQuizHistory() {
        const historyContainer = document.getElementById('quizHistory');
        const studentResults = this.data.results.filter(r => r.studentId === this.currentUser.id);
        
        if (studentResults.length === 0) {
            historyContainer.innerHTML = '<p class="text-secondary">No quiz history available</p>';
            return;
        }
        
        historyContainer.innerHTML = studentResults.map(result => {
            const quiz = this.data.quizzes.find(q => q.id === result.quizId);
            const status = result.score >= 60 ? 'passed' : 'failed';
            
            return `
                <div class="quiz-history-item fade-in">
                    <h5>${quiz?.title || 'Unknown Quiz'}</h5>
                    <div class="history-details">
                        <span>Score: ${result.score}%</span>
                        <span>Violations: ${result.violations}</span>
                        <span>Duration: ${result.duration} min</span>
                        <span>Date: ${new Date(result.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div class="result-status status-${status}">${status.toUpperCase()}</div>
                </div>
            `;
        }).join('');
    }

    updateNoticeBoard() {
        const noticeBoard = document.getElementById('noticeBoard');
        
        if (this.data.notices.length === 0) {
            noticeBoard.innerHTML = '<p class="text-secondary">No notices from admin</p>';
            return;
        }
        
        noticeBoard.innerHTML = this.data.notices.slice(-5).reverse().map(notice => `
            <div class="notice-item fade-in">
                <div class="notice-date">${new Date(notice.timestamp).toLocaleDateString()}</div>
                <div class="notice-title">${notice.title}</div>
                <div class="notice-content">${notice.content}</div>
            </div>
        `).join('');
    }

    // Quiz Taking
    startQuiz(quizId) {
        const quiz = this.data.quizzes.find(q => q.id === quizId);
        if (!quiz) {
            this.showToast('Quiz not found', 'error');
            return;
        }
        
        // Check if retake is allowed
        const hasAttempted = this.data.results.some(r => 
            r.studentId === this.currentUser.id && r.quizId === quiz.id
        );
        
        if (hasAttempted && !quiz.settings.allowRetake) {
            this.showToast('Retakes are not allowed for this quiz', 'error');
            return;
        }
        
        if (confirm(`Start "${quiz.title}"?\n\nDuration: ${quiz.duration} minutes\nQuestions: ${quiz.questions.length}\nViolation Limit: ${quiz.violationLimit}\n\nOnce started, violations will be monitored.`)) {
            this.currentQuiz = quiz;
            this.currentQuestion = 0;
            this.violations = 0;
            this.violationLimit = quiz.violationLimit;
            this.quizAnswers = {};
            this.quizStartTime = Date.now();
            
            // Shuffle questions if enabled
            if (quiz.settings.shuffle) {
                this.currentQuiz.questions = this.shuffleArray([...quiz.questions]);
            }
            
            // Create session
            const session = {
                id: Date.now().toString(),
                studentId: this.currentUser.id,
                quizId: quiz.id,
                currentQuestion: 0,
                startTime: new Date().toISOString(),
                violations: 0
            };
            this.data.sessions.push(session);
            this.saveData();
            
            this.showScreen('quizScreen');
            this.setupQuizInterface();
            this.startQuizTimer();
            document.body.classList.add('quiz-mode');
            
            this.logActivity(`Started quiz: ${quiz.title}`, this.currentUser.fullName);
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    setupQuizInterface() {
        document.querySelector('#quizScreen #quizTitle').textContent = this.currentQuiz.title;
        document.getElementById('totalQuestions').textContent = this.currentQuiz.questions.length;
        document.getElementById('violationLimit').textContent = this.violationLimit;
        
        this.displayQuestion();
        this.updateQuizProgress();
    }

    // CRITICAL FIX: Proper options display
    displayQuestion() {
        const question = this.currentQuiz.questions[this.currentQuestion];
        document.getElementById('questionText').textContent = question.question;
        
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        // Generate options with proper event handling
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-item';
            optionDiv.onclick = () => this.selectOption(index);
            
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = `question_${this.currentQuestion}`;
            radioInput.value = index;
            radioInput.id = `option_${index}`;
            
            const label = document.createElement('label');
            label.htmlFor = `option_${index}`;
            label.textContent = option;
            
            optionDiv.appendChild(radioInput);
            optionDiv.appendChild(label);
            optionsContainer.appendChild(optionDiv);
        });
        
        // Restore previous answer if exists
        if (this.quizAnswers[this.currentQuestion] !== undefined) {
            this.selectOption(this.quizAnswers[this.currentQuestion], false);
        }
    }

    selectOption(optionIndex, animate = true) {
        // Remove previous selection
        document.querySelectorAll('.option-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Add selection to clicked option
        const selectedOption = document.querySelectorAll('.option-item')[optionIndex];
        selectedOption.classList.add('selected');
        selectedOption.querySelector('input').checked = true;
        
        // Store answer
        this.quizAnswers[this.currentQuestion] = optionIndex;
        
        if (animate) {
            selectedOption.style.transform = 'scale(0.98)';
            setTimeout(() => {
                selectedOption.style.transform = '';
            }, 150);
        }
    }

    updateQuizProgress() {
        document.getElementById('questionNumber').textContent = this.currentQuestion + 1;
        document.getElementById('violationCount').textContent = this.violations;
        
        // Update navigation buttons
        document.getElementById('prevBtn').disabled = this.currentQuestion === 0;
        
        const isLastQuestion = this.currentQuestion === this.currentQuiz.questions.length - 1;
        document.getElementById('nextBtn').classList.toggle('hidden', isLastQuestion);
        document.getElementById('submitBtn').classList.toggle('hidden', !isLastQuestion);
    }

    nextQuestion() {
        if (this.currentQuestion < this.currentQuiz.questions.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
            this.updateQuizProgress();
            
            // Update session
            const session = this.data.sessions.find(s => s.studentId === this.currentUser.id);
            if (session) {
                session.currentQuestion = this.currentQuestion;
                this.saveData();
            }
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
            this.updateQuizProgress();
            
            // Update session
            const session = this.data.sessions.find(s => s.studentId === this.currentUser.id);
            if (session) {
                session.currentQuestion = this.currentQuestion;
                this.saveData();
            }
        }
    }

    startQuizTimer() {
        const duration = this.currentQuiz.duration * 60; // Convert to seconds
        let timeLeft = duration;
        
        this.quizTimer = setInterval(() => {
            timeLeft--;
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById('timerDisplay').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Warning when 5 minutes left
            if (timeLeft === 300) {
                this.showToast('5 minutes remaining!', 'warning');
            }
            
            // Warning when 1 minute left
            if (timeLeft === 60) {
                this.showToast('1 minute remaining!', 'warning');
            }
            
            // Auto-submit when time runs out
            if (timeLeft <= 0) {
                this.submitQuiz(true);
            }
        }, 1000);
    }

    recordViolation(type) {
        this.violations++;
        
        // Log violation
        const violation = {
            id: Date.now().toString(),
            studentId: this.currentUser.id,
            quizId: this.currentQuiz.id,
            type: type,
            questionNumber: this.currentQuestion + 1,
            timestamp: new Date().toISOString()
        };
        this.data.violations.push(violation);
        
        // Update session
        const session = this.data.sessions.find(s => s.studentId === this.currentUser.id);
        if (session) {
            session.violations = this.violations;
        }
        
        this.saveData();
        this.updateQuizProgress();
        this.logActivity(`Violation: ${type}`, this.currentUser.fullName);
        
        if (this.violations >= this.violationLimit) {
            this.showToast(`Maximum violations reached (${this.violationLimit}). Auto-submitting quiz.`, 'error');
            setTimeout(() => this.submitQuiz(true), 2000);
        } else {
            this.showToast(`Violation recorded: ${type}. ${this.violationLimit - this.violations} remaining.`, 'warning');
        }
    }

    submitQuiz(autoSubmit = false) {
        if (!autoSubmit && !confirm('Are you sure you want to submit your quiz? This action cannot be undone.')) {
            return;
        }
        
        // Calculate score
        let correctAnswers = 0;
        this.currentQuiz.questions.forEach((question, index) => {
            if (this.quizAnswers[index] === question.correct) {
                correctAnswers++;
            }
        });
        
        const score = Math.round((correctAnswers / this.currentQuiz.questions.length) * 100);
        
        // Save result
        const result = {
            id: Date.now().toString(),
            studentId: this.currentUser.id,
            quizId: this.currentQuiz.id,
            answers: this.quizAnswers,
            score: score,
            correctAnswers: correctAnswers,
            totalQuestions: this.currentQuiz.questions.length,
            violations: this.violations,
            timestamp: new Date().toISOString(),
            duration: Math.floor((Date.now() - this.quizStartTime) / 1000 / 60),
            autoSubmitted: autoSubmit
        };
        
        this.data.results.push(result);
        
        // Update student stats
        const student = this.data.students.find(s => s.id === this.currentUser.id);
        if (student) {
            student.totalQuizzes = (student.totalQuizzes || 0) + 1;
            student.totalViolations = (student.totalViolations || 0) + this.violations;
            
            // Calculate new average score
            const studentResults = this.data.results.filter(r => r.studentId === student.id);
            const avgScore = studentResults.reduce((sum, r) => sum + r.score, 0) / studentResults.length;
            student.averageScore = Math.round(avgScore);
            
            // Update current user object
            this.currentUser = { ...this.currentUser, ...student };
        }
        
        this.endQuizSession();
        this.saveData();
        
        this.logActivity(`Completed quiz: ${this.currentQuiz.title} (Score: ${score}%)`, this.currentUser.fullName);
        
        // Show results
        const resultMessage = `Quiz Completed!\n\nScore: ${score}%\nCorrect Answers: ${correctAnswers}/${this.currentQuiz.questions.length}\nViolations: ${this.violations}\nTime Taken: ${Math.floor((Date.now() - this.quizStartTime) / 1000 / 60)} minutes\n\n${autoSubmit ? 'Quiz was auto-submitted due to violations or time limit.' : 'Thank you for taking the quiz!'}`;
        
        alert(resultMessage);
        
        this.showScreen('studentDashboard');
        this.updateStudentDashboard();
    }

    dropoutQuiz() {
        if (confirm('Are you sure you want to dropout? Your progress will be lost.')) {
            this.endQuizSession();
            this.logActivity(`Dropped out of quiz: ${this.currentQuiz.title}`, this.currentUser.fullName);
            this.showScreen('studentDashboard');
            this.showToast('Quiz dropout successful', 'success');
        }
    }

    endQuizSession() {
        // Remove session
        this.data.sessions = this.data.sessions.filter(s => s.studentId !== this.currentUser.id);
        
        if (this.quizTimer) {
            clearInterval(this.quizTimer);
            this.quizTimer = null;
        }
        
        document.body.classList.remove('quiz-mode');
        this.currentQuiz = null;
        this.currentQuestion = 0;
        this.violations = 0;
        this.quizAnswers = {};
    }

    // Session management
    checkActiveSessions() {
        // Clean up stale sessions (older than 4 hours)
        const fourHoursAgo = Date.now() - (4 * 60 * 60 * 1000);
        this.data.sessions = this.data.sessions.filter(session => {
            return new Date(session.startTime).getTime() > fourHoursAgo;
        });
        this.saveData();
    }

    terminateSession(sessionId) {
        if (confirm('Are you sure you want to terminate this session?')) {
            const session = this.data.sessions.find(s => s.id === sessionId);
            this.data.sessions = this.data.sessions.filter(s => s.id !== sessionId);
            this.saveData();
            this.updateLiveMonitoring();
            this.showToast('Session terminated', 'success');
            
            if (session) {
                const student = this.data.students.find(s => s.id === session.studentId);
                this.logActivity(`Session terminated by admin`, student?.fullName || 'Unknown');
            }
        }
    }

    viewSessionDetails(sessionId) {
        const session = this.data.sessions.find(s => s.id === sessionId);
        const student = this.data.students.find(s => s.id === session.studentId);
        const quiz = this.data.quizzes.find(q => q.id === session.quizId);
        
        const details = `Session Details\n\nStudent: ${student?.fullName || 'Unknown'}\nQuiz: ${quiz?.title || 'Unknown'}\nStarted: ${new Date(session.startTime).toLocaleString()}\nProgress: ${session.currentQuestion + 1}/${quiz?.questions.length || 0}\nViolations: ${session.violations}`;
        
        alert(details);
    }

    // Settings
    changeAdminPassword(event) {
        event.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmNewPassword').value.trim();
        
        if (currentPassword !== this.data.adminConfig.password) {
            this.showToast('Current password is incorrect', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            this.showToast('New passwords do not match', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            this.showToast('Password must be at least 6 characters', 'error');
            return;
        }
        
        this.data.adminConfig.password = newPassword;
        this.saveData();
        this.showToast('Password changed successfully', 'success');
        this.logActivity('Changed admin password', 'Admin');
        
        // Clear form
        event.target.reset();
    }

    updateGlobalSettings() {
        const defaultViolationLimit = parseInt(document.getElementById('defaultViolationLimit').value);
        const autoSubmitEnabled = document.getElementById('autoSubmitEnabled').value === 'true';
        
        this.data.adminConfig.globalSettings = {
            defaultViolationLimit,
            autoSubmitEnabled
        };
        
        this.saveData();
        this.showToast('Global settings updated', 'success');
        this.logActivity('Updated global settings', 'Admin');
    }

    // Data export functions
    exportStudentData() {
        const data = {
            students: this.data.students,
            results: this.data.results,
            violations: this.data.violations,
            exportDate: new Date().toISOString()
        };
        
        this.downloadJSON(data, 'student_data.json');
        this.showToast('Student data exported successfully', 'success');
    }

    exportQuizResults() {
        const data = {
            quizzes: this.data.quizzes,
            results: this.data.results,
            sessions: this.data.sessions,
            exportDate: new Date().toISOString()
        };
        
        this.downloadJSON(data, 'quiz_results.json');
        this.showToast('Quiz results exported successfully', 'success');
    }

    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    refreshMonitoring() {
        this.updateLiveMonitoring();
        this.showToast('Monitoring refreshed', 'success');
    }

    // Theme Modal
    openThemeModal() {
        document.getElementById('themeModal').classList.add('active');
    }

    closeThemeModal() {
        document.getElementById('themeModal').classList.remove('active');
    }

    // Utility functions
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    logActivity(action, student = null) {
        this.data.activityLogs.push({
            action,
            student,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 100 logs
        if (this.data.activityLogs.length > 100) {
            this.data.activityLogs = this.data.activityLogs.slice(-100);
        }
        
        this.saveData();
    }
}

// Initialize the application
const quizSystem = new QuizSystem();

// Global functions for HTML event handlers
function switchTab(tabName) {
    quizSystem.switchTab(tabName);
}

function adminLogin(event) {
    quizSystem.adminLogin(event);
}

function studentLogin(event) {
    quizSystem.studentLogin(event);
}

function studentRegister(event) {
    quizSystem.studentRegister(event);
}

function logout() {
    quizSystem.logout();
}

function switchAdminTab(tabName) {
    quizSystem.switchAdminTab(tabName);
}

function openThemeModal() {
    quizSystem.openThemeModal();
}

function closeThemeModal() {
    quizSystem.closeThemeModal();
}

function showCreateQuiz() {
    quizSystem.showCreateQuiz();
}

function closeCreateQuiz() {
    quizSystem.closeCreateQuiz();
}

function addQuestion() {
    quizSystem.addQuestion();
}

function createQuiz(event) {
    quizSystem.createQuiz(event);
}

function nextQuestion() {
    quizSystem.nextQuestion();
}

function previousQuestion() {
    quizSystem.previousQuestion();
}

function submitQuiz() {
    quizSystem.submitQuiz();
}

function dropoutQuiz() {
    quizSystem.dropoutQuiz();
}

function changeAdminPassword(event) {
    quizSystem.changeAdminPassword(event);
}

function updateGlobalSettings() {
    quizSystem.updateGlobalSettings();
}

function exportStudentData() {
    quizSystem.exportStudentData();
}

function exportQuizResults() {
    quizSystem.exportQuizResults();
}

function refreshMonitoring() {
    quizSystem.refreshMonitoring();
}

function filterQuizzes() {
    quizSystem.filterQuizzes();
}

// DOM Ready initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize default values
    document.getElementById('adminUsername').value = 'admin';
    document.getElementById('adminPassword').value = 'admin123';
    
    // Set up global settings if available
    if (quizSystem.data.adminConfig.globalSettings) {
        const settings = quizSystem.data.adminConfig.globalSettings;
        if (document.getElementById('defaultViolationLimit')) {
            document.getElementById('defaultViolationLimit').value = settings.defaultViolationLimit;
        }
        if (document.getElementById('autoSubmitEnabled')) {
            document.getElementById('autoSubmitEnabled').value = settings.autoSubmitEnabled.toString();
        }
    }
});