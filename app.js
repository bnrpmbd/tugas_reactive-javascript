// ============================================
// DATA TUGAS - Tersimpan dalam Array
// ============================================

const tasks = [
    {
        id: 1,
        title: 'Mengerjakan ringkasan materi reactive programming',
        subject: 'Metoda Pemrograman Modern',
        deadline: '2026-05-07',
        description: 'Merangkum konsep reactive programming, event-driven flow, dan automatic update.',
        completed: false,
        createdAt: '2026-05-04'
    },
    {
        id: 2,
        title: 'Menyusun laporan tugas JavaScript',
        subject: 'Metoda Pemrograman Modern',
        deadline: '2026-05-05',
        description: 'Membuat laporan yang menjelaskan alur kerja aplikasi dan implementasinya.',
        completed: true,
        createdAt: '2026-05-02'
    },
    {
        id: 3,
        title: 'Merevisi tampilan aplikasi todo',
        subject: 'Metoda Pemrograman Modern',
        deadline: '2026-05-10',
        description: 'Memperbaiki styling, layout, dan kesesuaian tampilan dengan requirement baru.',
        completed: false,
        createdAt: '2026-05-03'
    },
    {
        id: 4,
        title: 'Ngerevisi Laporan Prak. Alprog P4 K7',
        subject: 'Praktikum Algoritma dan Pemrograman',
        deadline: '2026-05-04',
        description: "Ngecek laporan Prak. Alprog Kelompok 7 Percobaan 4, pastiin semua sesuai sama hasil yang didapat di praktek.",
        completed: true,
        createdAt: '2026-05-01'
    },
    {
        id: 5,
        title: 'Menyelesaikan Laporan Prak. RPL P3',
        subject: 'Praktikum Rekayasa Perangkat Lunak',
        deadline: '2026-05-08',
        description: "Membuat Sequence Diagram dan Class Diagram untuk laporan Prak. RPL Percobaan 3, pastiin semua sesuai sama hasil yang didapat di praktek.",
        completed: false,
        createdAt: '2026-05-02'
    },
    {
        id: 6,
        title: 'Menyelesaikan class Huawei KCloud',
        subject: 'Komputasi Terdistribusi dan Cloud',
        deadline: '2026-05-20',
        description: "Menyelesaikan class Huawei KCloud, pastiin semua materi udah dipahami dan tugas-tugasnya udah dikerjain.",
        completed: false,
        createdAt: '2026-05-05'
    }
];

const initialSubjects = [
    'Metoda Pemrograman Modern',
    'Pemrograman Web',
    'Struktur Data',
    'Pemrograman Berorientasi Objek'
];

// ============================================
// STATE & DOM REFERENCES
// ============================================

const state = {
    tasks: [...tasks],
    subjects: [...new Set([...initialSubjects, ...tasks.map(task => task.subject)])],
    filters: {
        subject: 'all',
        priority: 'all',
        status: 'all'
    },
    pagination: {
        page: 1,
        pageSize: 5
    },
    nextId: tasks.length + 1,
    modalOpen: false
};

const elements = {
    openTaskModalButton: document.getElementById('openTaskModalButton'),
    taskModal: document.getElementById('taskModal'),
    closeModalButton: document.getElementById('closeModalButton'),
    cancelTaskButton: document.getElementById('cancelTaskButton'),
    taskForm: document.getElementById('taskForm'),
    taskTitleInput: document.getElementById('taskTitleInput'),
    subjectSelect: document.getElementById('subjectSelect'),
    newSubjectField: document.getElementById('newSubjectField'),
    newSubjectInput: document.getElementById('newSubjectInput'),
    deadlineInput: document.getElementById('deadlineInput'),
    taskDescriptionInput: document.getElementById('taskDescriptionInput'),
    subjectFilter: document.getElementById('subjectFilter'),
    priorityFilter: document.getElementById('priorityFilter'),
    statusFilter: document.getElementById('statusFilter'),
    pageSizeSelect: document.getElementById('pageSizeSelect'),
    resetFiltersButton: document.getElementById('resetFiltersButton'),
    taskContainer: document.getElementById('taskContainer'),
    paginationInfo: document.getElementById('paginationInfo'),
    pageNumbers: document.getElementById('pageNumbers'),
    prevPageButton: document.getElementById('prevPageButton'),
    nextPageButton: document.getElementById('nextPageButton'),
    totalTasks: document.getElementById('totalTasks'),
    completedTasks: document.getElementById('completedTasks'),
    pendingTasks: document.getElementById('pendingTasks')
};

// ============================================
// LOGIKA REACTIVE PROGRAMMING
// ============================================

function openModal() {
    state.modalOpen = true;
    elements.taskModal.classList.remove('hidden');
    elements.taskModal.setAttribute('aria-hidden', 'false');
    elements.taskTitleInput.focus();
}

function closeModal() {
    state.modalOpen = false;
    elements.taskModal.classList.add('hidden');
    elements.taskModal.setAttribute('aria-hidden', 'true');
    elements.taskForm.reset();
    elements.newSubjectField.classList.add('hidden');
    elements.newSubjectInput.value = '';
}

function getPriorityFromDeadline(deadline) {
    const today = startOfDay(new Date());
    const targetDate = startOfDay(new Date(`${deadline}T00:00:00`));
    const diffDays = Math.ceil((targetDate - today) / 86400000);

    if (diffDays <= 3) {
        return 'high';
    }

    if (diffDays <= 7) {
        return 'middle';
    }

    return 'low';
}

function getPriorityLabel(priority) {
    const labels = {
        low: 'Low',
        middle: 'Middle',
        high: 'High'
    };

    return labels[priority] || 'Low';
}

function startOfDay(date) {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
}

function formatDate(dateString) {
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(new Date(`${dateString}T00:00:00`));
}

function getDaysRemaining(deadline) {
    const today = startOfDay(new Date());
    const targetDate = startOfDay(new Date(`${deadline}T00:00:00`));
    return Math.ceil((targetDate - today) / 86400000);
}

function addTask(taskData) {
    const title = taskData.title.trim();
    const deadline = taskData.deadline;
    const description = taskData.description.trim();
    const selectedSubject = taskData.subject;
    const newSubject = taskData.newSubject.trim();

    if (title === '' || deadline === '') {
        return;
    }

    const subject = selectedSubject === '__new__'
        ? newSubject
        : selectedSubject;

    if (subject.trim() === '') {
        return;
    }

    if (!state.subjects.includes(subject)) {
        state.subjects = [...state.subjects, subject];
    }

    state.tasks = [
        ...state.tasks,
        {
            id: state.nextId,
            title,
            subject,
            deadline,
            description,
            completed: false,
            createdAt: new Date().toISOString().slice(0, 10)
        }
    ];

    state.nextId += 1;
    closeModal();
    state.pagination.page = 1;
    renderApp();
}

function toggleTask(taskId) {
    state.tasks = state.tasks.map(task => {
        if (task.id !== taskId) {
            return task;
        }

        return {
            ...task,
            completed: !task.completed
        };
    });

    renderApp();
}

function deleteTask(taskId) {
    state.tasks = state.tasks.filter(task => task.id !== taskId);
    state.pagination.page = 1;
    renderApp();
}

function applyFilters(tasksToFilter) {
    return tasksToFilter.filter(task => {
        const taskPriority = getPriorityFromDeadline(task.deadline);
        const matchesSubject = state.filters.subject === 'all' || task.subject === state.filters.subject;
        const matchesPriority = state.filters.priority === 'all' || taskPriority === state.filters.priority;
        const matchesStatus = state.filters.status === 'all'
            || (state.filters.status === 'completed' && task.completed)
            || (state.filters.status === 'pending' && !task.completed);

        return matchesSubject && matchesPriority && matchesStatus;
    });
}

function getTaskCounts() {
    const total = state.tasks.length;
    const completed = state.tasks.filter(task => task.completed).length;
    const pending = total - completed;

    return { total, completed, pending };
}

function renderTasks() {
    const container = elements.taskContainer;
    const filteredTasks = applyFilters([...state.tasks]).sort((leftTask, rightTask) => {
        if (leftTask.completed !== rightTask.completed) {
            return Number(leftTask.completed) - Number(rightTask.completed);
        }

        return leftTask.deadline.localeCompare(rightTask.deadline);
    });

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="task-empty">
                Tidak ada tugas yang cocok dengan filter saat ini.
            </div>
        `;
        elements.paginationInfo.textContent = 'Menampilkan 0 dari 0 tugas';
        elements.pageNumbers.innerHTML = '';
        elements.prevPageButton.disabled = true;
        elements.nextPageButton.disabled = true;
        return;
    }

    const pageSize = state.pagination.pageSize === 'all'
        ? filteredTasks.length
        : Number(state.pagination.pageSize);
    const totalPages = pageSize === 0 ? 1 : Math.ceil(filteredTasks.length / pageSize);
    state.pagination.page = Math.min(Math.max(state.pagination.page, 1), totalPages);
    const startIndex = (state.pagination.page - 1) * pageSize;
    const visibleTasks = pageSize === filteredTasks.length
        ? filteredTasks
        : filteredTasks.slice(startIndex, startIndex + pageSize);

    container.innerHTML = visibleTasks.map(task => {
        const priority = getPriorityFromDeadline(task.deadline);
        const daysRemaining = getDaysRemaining(task.deadline);
        const dueText = daysRemaining < 0
            ? `Terlambat ${Math.abs(daysRemaining)} hari`
            : daysRemaining === 0
                ? 'Deadline hari ini'
                : `${daysRemaining} hari lagi`;

        return `
        <div class="task-item">
            <div class="task-content">
                <div class="task-text ${task.completed ? 'completed' : ''}">${escapeHtml(task.title)}</div>
                <div class="task-description">${escapeHtml(task.description || 'Tidak ada deskripsi')}</div>
                <div class="task-meta">
                    <span>Deadline: ${formatDate(task.deadline)}</span>
                    <span>Status: ${task.completed ? 'Selesai' : 'Belum selesai'}</span>
                </div>
                <div class="task-badges">
                    <span class="badge subject">${escapeHtml(task.subject)}</span>
                    <span class="badge ${priority}">${getPriorityLabel(priority)}</span>
                    <span class="badge due">${escapeHtml(dueText)}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="action-btn complete-btn" data-action="toggle" data-id="${task.id}" type="button">
                    ${task.completed ? 'Batal' : 'Selesai'}
                </button>
                <button class="action-btn delete-btn" data-action="delete" data-id="${task.id}" type="button">
                    Hapus
                </button>
            </div>
        </div>
    `;
    }).join('');

    const showingStart = filteredTasks.length === 0 ? 0 : startIndex + 1;
    const showingEnd = Math.min(startIndex + visibleTasks.length, filteredTasks.length);
    elements.paginationInfo.textContent = `Menampilkan ${showingStart}-${showingEnd} dari ${filteredTasks.length} tugas`;

    elements.prevPageButton.disabled = state.pagination.page <= 1;
    elements.nextPageButton.disabled = state.pagination.page >= totalPages;

    elements.pageNumbers.innerHTML = Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        const isActive = pageNumber === state.pagination.page;
        return `<button class="page-number ${isActive ? 'active' : ''}" data-page="${pageNumber}" type="button">${pageNumber}</button>`;
    }).join('');
}

function renderSubjectOptions() {
    const currentSubjectFilter = elements.subjectFilter.value || state.filters.subject;
    const currentSubjectSelect = elements.subjectSelect.value;

    const optionHTML = [
        '<option value="">Pilih mata kuliah</option>',
        ...state.subjects.map(subject => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`),
        '<option value="__new__">+ Tambah mata kuliah baru</option>'
    ].join('');

    elements.subjectSelect.innerHTML = optionHTML;
    elements.subjectSelect.value = currentSubjectSelect && currentSubjectSelect !== ''
        ? currentSubjectSelect
        : elements.subjectSelect.value;

    const filterOptions = [
        '<option value="all">Semua Mata Kuliah</option>',
        ...state.subjects.map(subject => `<option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>`)
    ].join('');

    elements.subjectFilter.innerHTML = filterOptions;
    elements.subjectFilter.value = currentSubjectFilter;
}

function updateStats() {
    const { total, completed, pending } = getTaskCounts();
    elements.totalTasks.textContent = String(total);
    elements.completedTasks.textContent = String(completed);
    elements.pendingTasks.textContent = String(pending);
}

function renderApp() {
    renderSubjectOptions();
    renderTasks();
    updateStats();
}

function escapeHtml(text) {
    const escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };

    return text.replace(/[&<>"']/g, character => escapeMap[character]);
}

// ============================================
// EVENT LISTENER
// ============================================

function setupEvents() {
    elements.openTaskModalButton.addEventListener('click', () => {
        openModal();
    });

    elements.closeModalButton.addEventListener('click', () => {
        closeModal();
    });

    elements.cancelTaskButton.addEventListener('click', () => {
        closeModal();
    });

    elements.taskModal.addEventListener('click', (event) => {
        if (event.target === elements.taskModal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && state.modalOpen) {
            closeModal();
        }
    });

    elements.subjectSelect.addEventListener('change', () => {
        const isNewSubject = elements.subjectSelect.value === '__new__';
        elements.newSubjectField.classList.toggle('hidden', !isNewSubject);
        if (isNewSubject) {
            elements.newSubjectInput.focus();
        }
    });

    elements.taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addTask({
            title: elements.taskTitleInput.value,
            subject: elements.subjectSelect.value,
            newSubject: elements.newSubjectInput.value,
            deadline: elements.deadlineInput.value,
            description: elements.taskDescriptionInput.value
        });
    });

    const filterElements = [
        elements.subjectFilter,
        elements.priorityFilter,
        elements.statusFilter,
        elements.pageSizeSelect
    ];

    filterElements.forEach(filterElement => {
        filterElement.addEventListener('change', () => {
            state.filters.subject = elements.subjectFilter.value;
            state.filters.priority = elements.priorityFilter.value;
            state.filters.status = elements.statusFilter.value;
            state.pagination.pageSize = elements.pageSizeSelect.value === 'all'
                ? 'all'
                : Number(elements.pageSizeSelect.value);
            state.pagination.page = 1;
            renderApp();
        });
    });

    elements.resetFiltersButton.addEventListener('click', () => {
        state.filters = {
            subject: 'all',
            priority: 'all',
            status: 'all'
        };
        state.pagination.page = 1;
        state.pagination.pageSize = 5;

        elements.subjectFilter.value = 'all';
        elements.priorityFilter.value = 'all';
        elements.statusFilter.value = 'all';
        elements.pageSizeSelect.value = '5';
        renderApp();
    });

    elements.prevPageButton.addEventListener('click', () => {
        if (state.pagination.page > 1) {
            state.pagination.page -= 1;
            renderApp();
        }
    });

    elements.nextPageButton.addEventListener('click', () => {
        const filteredTasks = applyFilters([...state.tasks]);
        const pageSize = state.pagination.pageSize === 'all'
            ? filteredTasks.length
            : Number(state.pagination.pageSize);
        const totalPages = pageSize === 0 ? 1 : Math.ceil(filteredTasks.length / pageSize);

        if (state.pagination.page < totalPages) {
            state.pagination.page += 1;
            renderApp();
        }
    });

    elements.pageNumbers.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-page]');

        if (!button) {
            return;
        }

        state.pagination.page = Number(button.dataset.page);
        renderApp();
    });

    elements.taskContainer.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-action]');

        if (!button) {
            return;
        }

        const taskId = Number(button.dataset.id);
        const action = button.dataset.action;

        if (action === 'toggle') {
            toggleTask(taskId);
        }

        if (action === 'delete') {
            deleteTask(taskId);
        }
    });
}

// ============================================
// INISIALISASI APLIKASI
// ============================================

function initialize() {
    setupEvents();
    elements.pageSizeSelect.value = '5';
    renderApp();
    setInterval(() => {
        renderTasks();
        updateStats();
    }, 60000);
}

document.addEventListener('DOMContentLoaded', initialize);
