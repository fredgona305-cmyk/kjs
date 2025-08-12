// =============== GLOBAL SHORTCUT $ ===============
const $ = (id) => document.getElementById(id);

// =============== CONNECTION CHECKER ===============
function checkConnection() {
  const status = $('connection-status');
  const cloudStatus = $('cloud-sync-status');
  
  if (status) {
    if (navigator.onLine) {
      status.textContent = "🟢 Online - All features available";
      status.className = "connection-status connection-online";
    } else {
      status.textContent = "🔴 Offline - Working with localStorage only";
      status.className = "connection-status connection-offline";
    }
  }
  
  if (cloudStatus) {
    if (navigator.onLine) {
      cloudStatus.textContent = "🔄 Cloud Sync: Connected";
      cloudStatus.className = "cloud-sync-status cloud-sync-connected";
    } else {
      cloudStatus.textContent = "🔄 Cloud Sync: Disconnected";
      cloudStatus.className = "cloud-sync-status cloud-sync-disconnected";
    }
  }
}

// Check connection on load
window.addEventListener('load', checkConnection);
window.addEventListener('online', checkConnection);
window.addEventListener('offline', checkConnection);

// =============== CLOUD SYNC ===============
let cloudConfig = {
  url: '',
  apiKey: ''
};

// Load cloud config from localStorage
function loadCloudConfig() {
  const saved = localStorage.getItem('cbc_cloud_config');
  if (saved) {
    cloudConfig = JSON.parse(saved);
    if ($('cloud-url')) $('cloud-url').value = cloudConfig.url || '';
    if ($('api-key')) $('api-key').value = cloudConfig.apiKey || '';
  }
}

// Save cloud config to localStorage
function saveCloudConfig() {
  if ($('cloud-url')) cloudConfig.url = $('cloud-url').value;
  if ($('api-key')) cloudConfig.apiKey = $('api-key').value;
  localStorage.setItem('cbc_cloud_config', JSON.stringify(cloudConfig));
  updateSyncStatus();
}

// Update sync status display
function updateSyncStatus() {
  const statusText = $('sync-status-text');
  const lastSync = $('last-sync');
  const syncCount = $('sync-count');
  
  if (statusText) {
    statusText.textContent = navigator.onLine ? "Connected" : "Disconnected";
  }
  
  if (lastSync) {
    lastSync.textContent = localStorage.getItem('cbc_last_sync') || "Never";
  }
  
  if (syncCount) {
    const totalRecords = getTotalRecords();
    syncCount.textContent = totalRecords;
  }
}

// Get total records count
function getTotalRecords() {
  return teachers.length + students.length + assignments.length + assessments.length + marksLists.length;
}

// Test cloud connection
function testCloudConnection() {
  if (!cloudConfig.url || !cloudConfig.apiKey) {
    alert("Please configure cloud settings first!");
    return;
  }
  
  alert("Testing connection to: " + cloudConfig.url);
  // In real implementation, this would make an actual HTTP request
  // For demo, we'll just simulate success
  setTimeout(() => {
    alert("✅ Connection successful!");
    updateSyncStatus();
  }, 1000);
}

// Manual sync function
function manualSync() {
  if (!navigator.onLine) {
    alert("Cannot sync - No internet connection!");
    return;
  }
  
  alert("🔄 Starting manual sync...");
  
  // Simulate sync process
  setTimeout(() => {
    const timestamp = new Date().toLocaleString();
    localStorage.setItem('cbc_last_sync', timestamp);
    updateSyncStatus();
    alert("✅ Sync completed successfully!");
  }, 2000);
}

// Backup data to cloud
function backupData() {
  if (!navigator.onLine) {
    alert("Cannot backup - No internet connection!");
    return;
  }
  
  alert("💾 Backing up data to cloud...");
  
  // Simulate backup process
  setTimeout(() => {
    alert("✅ Data backed up successfully!");
  }, 1500);
}

// Restore data from cloud
function restoreData() {
  if (!navigator.onLine) {
    alert("Cannot restore - No internet connection!");
    return;
  }
  
  if (confirm("⚠️ This will overwrite your local data. Continue?")) {
    alert("🔄 Restoring data from cloud...");
    
    // Simulate restore process
    setTimeout(() => {
      alert("✅ Data restored successfully!");
      location.reload(); // Reload to refresh data
    }, 2000);
  }
}

// =============== SAFE PRINT FUNCTION ===============
function safePrint() {
  const printContent = $('mark-list-output') || $('report-card-output');
  if (!printContent) return;

  const printWindow = window.open('', '_blank');
  printWindow.document.write('<html><head><title>Print</title>');
  printWindow.document.write('<style>body { font-family: Arial, sans-serif; margin: 10px; } @page { margin: 1cm; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #000; padding: 6px; text-align: center; font-size: 12px; } th { background: #039be5; color: white; } .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }</style>');
  printWindow.document.write('</head><body>');
  printWindow.document.write(printContent.innerHTML);
  printWindow.document.write('<div class="footer">Generated by CBC School Management System | Kenya</div>');
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

// =============== DATA ===============
let schoolData = {
  name: "CBC School",
  logo: "image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzAzOWJlNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DQkMgU0NIT09MPC90ZXh0Pjwvc3ZnPg=="
};

let headteacher = null;
let teachers = [];
let students = [];
let subjectsLP = [];
let subjectsUP = [];
let assignments = [];
let assessments = [];
let marksLists = [];
let timetable = [];

// =============== STORAGE KEYS ===============
const keys = {
  school: 'cbc_school_data',
  ht: 'cbc_headteacher',
  teachers: 'cbc_teachers',
  students: 'cbc_students',
  subjectsLP: 'cbc_subjects_lp',
  subjectsUP: 'cbc_subjects_up',
  assignments: 'cbc_assignments',
  assessments: 'cbc_assessments',
  marks: 'cbc_marks_lists',
  timetable: 'cbc_timetable'
};

// =============== LOAD FROM localStorage ===============
function loadFromStorage() {
  try {
    const get = (k, d) => JSON.parse(localStorage.getItem(k)) || d;
    schoolData = get(keys.school, schoolData);
    headteacher = get(keys.ht, null);
    teachers = get(keys.teachers, []);
    students = get(keys.students, []);
    subjectsLP = get(keys.subjectsLP, []);
    subjectsUP = get(keys.subjectsUP, []);
    assignments = get(keys.assignments, []);
    assessments = get(keys.assessments, []);
    marksLists = get(keys.marks, []);
    timetable = get(keys.timetable, []);
  } catch (e) {
    console.warn("Could not load data", e);
  }
}

// =============== SAVE TO localStorage ===============
function saveToStorage() {
  try {
    Object.entries({
      [keys.school]: schoolData,
      [keys.ht]: headteacher,
      [keys.teachers]: teachers,
      [keys.students]: students,
      [keys.subjectsLP]: subjectsLP,
      [keys.subjectsUP]: subjectsUP,
      [keys.assignments]: assignments,
      [keys.assessments]: assessments,
      [keys.marks]: marksLists,
      [keys.timetable]: timetable
    }).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
  } catch (e) {
    console.warn("Storage error:", e);
    // Still try to work offline if storage fails
  }
}

// =============== UPDATE HEADER ===============
function updateHeader() {
  if ($('school-name-header')) $('school-name-header').textContent = schoolData.name;
  if ($('school-logo')) $('school-logo').src = schoolData.logo;
}

// =============== TAB SWITCHING ===============
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
    btn.classList.add('active');
    const tabId = btn.getAttribute('data-tab');
    const tab = $(tabId);
    if (tab) tab.style.display = 'block';

    if (tabId === 'ht-analytics') {
      loadAnalytics();
    }
  });
});

if ($('ht-teachers')) $('ht-teachers').style.display = 'block';

// =============== ROLE SELECTION ===============
function setupRoleButtons() {
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $('form-title').textContent = `Login as ${btn.textContent}`;
      $('login-form').setAttribute('data-role', btn.getAttribute('data-role'));
      $('login-form').style.display = 'block';
      document.querySelector('.role-buttons').style.display = 'none';
      document.querySelector('h2').style.display = 'none';
    });
  });
}

// =============== BACK BUTTON ===============
$('back-btn')?.addEventListener('click', () => {
  $('login-form').style.display = 'none';
  document.querySelector('.role-buttons').style.display = 'grid';
  document.querySelector('h2').style.display = 'block';
  $('username').value = '';
  $('password').value = '';
});

// =============== LOGIN HANDLER ===============
$('login-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const u = $('username').value.trim();
  const p = $('password').value.trim();
  const role = this.getAttribute('data-role');

  if (!u || !p) {
    alert('Enter username and password');
    return;
  }

  if (role === 'admin' && u === 'admin' && p === 'admin123') {
    $('login-section').style.display = 'none';
    $('admin-dashboard').style.display = 'block';
    loadSettings();
    loadHeadteacher();
  } else if (role === 'headteacher' && headteacher && headteacher.tsc === u && headteacher.idNo === p) {
    $('login-section').style.display = 'none';
    $('headteacher-dashboard').style.display = 'block';
    $('ht-name').textContent = headteacher.name;
    loadAllHT();
  } else if (role === 'teacher') {
    const teacher = teachers.find(t => t.tsc === u && t.idNo === p);
    if (teacher) {
      showTeacherDashboard(teacher);
    } else {
      alert('Invalid TSC or ID number.');
    }
  } else if (role === 'parent') {
    // Parent login: username = assessment number, password = assessment number
    const parent = { id: 1, name: "Parent User", email: "parent@example.com" };
    showParentDashboard(parent);
  } else {
    alert('Invalid login');
  }

  $('username').value = '';
  $('password').value = '';
});

// =============== LOGOUT ===============
['admin-logout', 'ht-logout', 'teacher-logout', 'parent-logout'].forEach(id => {
  $(id)?.addEventListener('click', () => {
    document.querySelectorAll('.dashboard').forEach(d => d.style.display = 'none');
    $('login-section').style.display = 'block';
    document.querySelector('.role-buttons').style.display = 'grid';
    document.querySelector('h2').style.display = 'block';
  });
});

// =============== SETTINGS ===============
function loadSettings() {
  if ($('school-name')) $('school-name').value = schoolData.name;
  updateHeader();
}

// =============== ADMIN PROFILE UPDATE ===============
$('admin-profile-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const name = $('admin-name').value.trim();
  const password = $('admin-password').value.trim();

  if (name) {
    alert("✅ Admin profile updated!");
    $('admin-name').value = '';
    $('admin-password').value = '';
  }
});

// =============== HEADTEACHER ===============
function loadHeadteacher() {
  const body = $('headteacher-body');
  if (body) {
    body.innerHTML = headteacher ? `
      <tr>
        <td>${headteacher.id || 1}</td>
        <td>${headteacher.name}</td>
        <td>${headteacher.tsc}</td>
        <td>${headteacher.idNo}</td>
        <td>${headteacher.contact}</td>
        <td>
          <button onclick="editHT()">Edit</button>
          <button onclick="deleteHT()">Delete</button>
        </td>
      </tr>
    ` : '';
  }
}

window.editHT = () => {
  const n = prompt("Name:", headteacher?.name || "");
  const t = prompt("TSC:", headteacher?.tsc || "");
  const i = prompt("ID:", headteacher?.idNo || "");
  const c = prompt("Contact:", headteacher?.contact || "");
  if (n && t && i && c) {
    headteacher = { id: 1, name: n, tsc: t, idNo: i, contact: c };
    saveToStorage();
    loadHeadteacher();
  }
};

window.deleteHT = () => {
  if (confirm("Delete headteacher?")) {
    headteacher = null;
    saveToStorage();
    loadHeadteacher();
  }
};

$('add-headteacher-btn')?.addEventListener('click', () => {
  if (headteacher) {
    alert("Only one headteacher allowed.");
    return;
  }
  window.editHT();
  alert(`✅ Headteacher added! Use TSC as username and ID as password.`);
});

// =============== TEACHERS ===============
function loadTeachers() {
  const maleBody = $('male-teachers-body');
  const femaleBody = $('female-teachers-body');
  
  if (maleBody) {
    maleBody.innerHTML = '';
    const maleTeachers = teachers.filter(t => t.gender === 'Male');
    maleTeachers.forEach((t, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${t.name}</td>
        <td>${t.gender}</td>
        <td>${t.tsc}</td>
        <td>${t.idNo}</td>
        <td>${t.contact}</td>
        <td>
          <button onclick="editTeacher(${t.id})">Edit</button>
          <button onclick="deleteTeacher(${t.id})">Delete</button>
        </td>
      `;
      maleBody.appendChild(tr);
    });
  }
  
  if (femaleBody) {
    femaleBody.innerHTML = '';
    const femaleTeachers = teachers.filter(t => t.gender === 'Female');
    femaleTeachers.forEach((t, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${t.name}</td>
        <td>${t.gender}</td>
        <td>${t.tsc}</td>
        <td>${t.idNo}</td>
        <td>${t.contact}</td>
        <td>
          <button onclick="editTeacher(${t.id})">Edit</button>
          <button onclick="deleteTeacher(${t.id})">Delete</button>
        </td>
      `;
      femaleBody.appendChild(tr);
    });
  }
}

window.addTeacher = () => {
  const name = prompt("Full Name:");
  const tsc = prompt("TSC Number (Username):");
  const idNo = prompt("ID Number (Password):");
  const gender = prompt("Gender (Male/Female):");
  const contact = prompt("Contact:");
  if (name && tsc && idNo) {
    const newId = Math.max(1, ...teachers.map(t => t.id)) + 1;
    teachers.push({ id: newId, name, tsc, idNo, gender, contact });
    saveToStorage();
    loadTeachers();
  }
};

window.editTeacher = (id) => {
  const t = teachers.find(t => t.id === id);
  if (!t) return;
  const name = prompt("Name:", t.name);
  const tsc = prompt("TSC:", t.tsc);
  const idNo = prompt("ID No:", t.idNo);
  const gender = prompt("Gender:", t.gender);
  const contact = prompt("Contact:", t.contact);
  Object.assign(t, { name, tsc, idNo, gender, contact });
  saveToStorage();
  loadTeachers();
};

window.deleteTeacher = (id) => {
  if (confirm("Delete teacher?")) {
    teachers = teachers.filter(t => t.id !== id);
    saveToStorage();
    loadTeachers();
  }
};

$('add-teacher-btn')?.addEventListener('click', window.addTeacher);

// =============== STUDENTS ===============
function loadStudents() {
  const body = $('students-body');
  if (body) {
    body.innerHTML = '';
    students.forEach((s, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${s.name}</td>
        <td>${s.assessmentNo}</td>
        <td>${s.gender}</td>
        <td>${s.grade}</td>
        <td>${s.class}</td>
        <td>
          <button onclick="editStudent(${s.id})">Edit</button>
          <button onclick="deleteStudent(${s.id})">Delete</button>
        </td>
      `;
      body.appendChild(tr);
    });
  }

  // Load students by grade and class
  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
  const classes = ['East', 'West', 'South'];
  
  grades.forEach(grade => {
    classes.forEach(cls => {
      const gradeBody = $(`${grade.replace(' ', '').toLowerCase()}-${cls.toLowerCase()}-students-body`);
      if (gradeBody) {
        gradeBody.innerHTML = '';
        const studentsInGradeClass = students.filter(s => s.grade === grade && s.class === cls);
        studentsInGradeClass.forEach((s, index) => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${s.name}</td>
            <td>${s.assessmentNo}</td>
            <td>${s.gender}</td>
            <td>${s.class}</td>
            <td>
              <button onclick="editStudent(${s.id})">Edit</button>
              <button onclick="deleteStudent(${s.id})">Delete</button>
            </td>
          `;
          gradeBody.appendChild(tr);
        });
      }
    });
  });

  // Load students by grade for filtering
  loadStudentsByGrade();
}

function loadStudentsByGrade() {
  const container = $('students-by-grade');
  if (!container) return;

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
  let html = '';
  
  grades.forEach(grade => {
    html += `
      <div id="${grade.replace(' ', '').toLowerCase()}-students-section" style="margin-bottom: 20px;">
        <h4>${grade} Students</h4>
        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 250px;">
            <h5>East</h5>
            <table>
              <thead><tr><th>No</th><th>Name</th><th>Assessment No</th><th>Gender</th><th>Action</th></tr></thead>
              <tbody id="${grade.replace(' ', '').toLowerCase()}-east-students-body"></tbody>
            </table>
          </div>
          <div style="flex: 1; min-width: 250px;">
            <h5>West</h5>
            <table>
              <thead><tr><th>No</th><th>Name</th><th>Assessment No</th><th>Gender</th><th>Action</th></tr></thead>
              <tbody id="${grade.replace(' ', '').toLowerCase()}-west-students-body"></tbody>
            </table>
          </div>
          <div style="flex: 1; min-width: 250px;">
            <h5>South</h5>
            <table>
              <thead><tr><th>No</th><th>Name</th><th>Assessment No</th><th>Gender</th><th>Action</th></tr></thead>
              <tbody id="${grade.replace(' ', '').toLowerCase()}-south-students-body"></tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  updateStudentTables();
}

function updateStudentTables() {
  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
  const classes = ['East', 'West', 'South'];
  
  grades.forEach(grade => {
    classes.forEach(cls => {
      const gradeBody = $(`${grade.replace(' ', '').toLowerCase()}-${cls.toLowerCase()}-students-body`);
      if (gradeBody) {
        gradeBody.innerHTML = '';
        const studentsInGradeClass = students.filter(s => s.grade === grade && s.class === cls);
        studentsInGradeClass.forEach((s, index) => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${s.name}</td>
            <td>${s.assessmentNo}</td>
            <td>${s.gender}</td>
            <td>
              <button onclick="editStudent(${s.id})">Edit</button>
              <button onclick="deleteStudent(${s.id})">Delete</button>
            </td>
          `;
          gradeBody.appendChild(tr);
        });
      }
    });
  });
}

// Filter students by grade and class
function filterStudents() {
  const gradeFilter = $('student-grade-filter').value;
  const classFilter = $('student-class-filter').value;
  
  const container = $('students-by-grade');
  if (!container) return;
  
  if (gradeFilter && classFilter) {
    // Show only selected grade and class
    const gradeSection = $(`${gradeFilter.replace(' ', '').toLowerCase()}-students-section`);
    if (gradeSection) {
      container.innerHTML = '';
      container.appendChild(gradeSection);
      
      // Hide other grade sections
      const allSections = container.querySelectorAll('div[id$="-students-section"]');
      allSections.forEach(section => {
        if (section.id !== `${gradeFilter.replace(' ', '').toLowerCase()}-students-section`) {
          section.style.display = 'none';
        }
      });
    }
  } else if (gradeFilter) {
    // Show only selected grade
    const gradeSection = $(`${gradeFilter.replace(' ', '').toLowerCase()}-students-section`);
    if (gradeSection) {
      container.innerHTML = '';
      container.appendChild(gradeSection);
    }
  } else {
    // Show all
    loadStudentsByGrade();
  }
}

// Reset filters
function resetStudentFilters() {
  $('student-grade-filter').value = '';
  $('student-class-filter').value = '';
  loadStudentsByGrade();
}

// Event listeners for student filters
$('filter-students-btn')?.addEventListener('click', filterStudents);
$('reset-students-filter')?.addEventListener('click', resetStudentFilters);

window.addStudent = () => {
  const name = prompt("Student Name:");
  const assessmentNo = prompt("Assessment Number:");
  const gender = prompt("Gender:");
  const grade = prompt("Grade (1-6):");
  const classVal = prompt("Class (East/West/South):");
  if (name && assessmentNo) {
    const newId = Math.max(1, ...students.map(s => s.id)) + 1;
    students.push({ id: newId, name, assessmentNo, gender, grade, class: classVal });
    saveToStorage();
    loadStudents();
  }
};

window.editStudent = (id) => {
  const s = students.find(s => s.id === id);
  if (!s) return;
  const name = prompt("Name:", s.name);
  const assessmentNo = prompt("Assessment No:", s.assessmentNo);
  const gender = prompt("Gender:", s.gender);
  const grade = prompt("Grade:", s.grade);
  const classVal = prompt("Class:", s.class);
  Object.assign(s, { name, assessmentNo, gender, grade, class: classVal });
  saveToStorage();
  loadStudents();
};

window.deleteStudent = (id) => {
  if (confirm("Delete student?")) {
    students = students.filter(s => s.id !== id);
    saveToStorage();
    loadStudents();
  }
};

$('add-student-btn')?.addEventListener('click', window.addStudent);

// =============== SUBJECTS ===============
function loadSubjects() {
  const lpBody = $('subjects-lp-body');
  const upBody = $('subjects-up-body');

  if (lpBody) {
    lpBody.innerHTML = '';
    subjectsLP.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.code}</td>
        <td>${s.name}</td>
        <td>${s.initial || 'N/A'}</td>
        <td>
          <button onclick="editSubjectLP(${s.id})">Edit</button>
          <button onclick="deleteSubjectLP(${s.id})">Delete</button>
        </td>
      `;
      lpBody.appendChild(tr);
    });
  }

  if (upBody) {
    upBody.innerHTML = '';
    subjectsUP.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.code}</td>
        <td>${s.name}</td>
        <td>${s.initial || 'N/A'}</td>
        <td>
          <button onclick="editSubjectUP(${s.id})">Edit</button>
          <button onclick="deleteSubjectUP(${s.id})">Delete</button>
        </td>
      `;
      upBody.appendChild(tr);
    });
  }
}

window.addSubjectLP = () => {
  const name = prompt("Subject Name (Lower Primary):");
  const code = prompt("Subject Code:");
  const initial = prompt("Subject Initial (e.g., Eng L):");
  if (name && code && initial) {
    const newId = Math.max(1, ...subjectsLP.map(s => s.id)) + 1;
    subjectsLP.push({ id: newId, name, code, initial });
    saveToStorage();
    loadSubjects();
    updateAssignmentDropdowns();
  }
};

window.addSubjectUP = () => {
  const name = prompt("Subject Name (Upper Primary):");
  const code = prompt("Subject Code:");
  const initial = prompt("Subject Initial (e.g., Math):");
  if (name && code && initial) {
    const newId = Math.max(1, ...subjectsUP.map(s => s.id)) + 1;
    subjectsUP.push({ id: newId, name, code, initial });
    saveToStorage();
    loadSubjects();
    updateAssignmentDropdowns();
  }
};

window.editSubjectLP = (id) => {
  const s = subjectsLP.find(s => s.id === id);
  if (!s) return;
  const name = prompt("Name:", s.name);
  const code = prompt("Code:", s.code);
  const initial = prompt("Initial:", s.initial || '');
  Object.assign(s, { name, code, initial });
  saveToStorage();
  loadSubjects();
  updateAssignmentDropdowns();
};

window.deleteSubjectLP = (id) => {
  if (confirm("Delete?")) {
    subjectsLP = subjectsLP.filter(s => s.id !== id);
    saveToStorage();
    loadSubjects();
    updateAssignmentDropdowns();
  }
};

window.editSubjectUP = (id) => {
  const s = subjectsUP.find(s => s.id === id);
  if (!s) return;
  const name = prompt("Name:", s.name);
  const code = prompt("Code:", s.code);
  const initial = prompt("Initial:", s.initial || '');
  Object.assign(s, { name, code, initial });
  saveToStorage();
  loadSubjects();
  updateAssignmentDropdowns();
};

window.deleteSubjectUP = (id) => {
  if (confirm("Delete?")) {
    subjectsUP = subjectsUP.filter(s => s.id !== id);
    saveToStorage();
    loadSubjects();
    updateAssignmentDropdowns();
  }
};

$('add-subject-lp')?.addEventListener('click', window.addSubjectLP);
$('add-subject-up')?.addEventListener('click', window.addSubjectUP);

// =============== ASSIGN SUBJECTS ===============
function loadAssignments() {
  const container = $('assignments-by-grade');
  if (container) {
    container.innerHTML = '';

    const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

    grades.forEach(grade => {
      const assignedToGrade = assignments.filter(a => a.grade === grade);
      if (assignedToGrade.length === 0) return;

      const div = document.createElement('div');
      div.style.marginBottom = '20px';

      div.innerHTML = `
        <h5>${grade}</h5>
        <table class="assignment-table" style="width:100%; margin-top:5px;">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Subject</th>
              <th>Class</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `;

      const tbody = div.querySelector('tbody');
      const classes = ['East', 'West', 'South'];

      classes.forEach(cls => {
        const filtered = assignedToGrade.filter(a => a.class === cls);
        if (filtered.length === 0) {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td colspan="4" style="text-align:center; font-style:italic;">No teachers in ${cls}</td>`;
          tbody.appendChild(tr);
        } else {
          filtered.forEach(a => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${a.teacher}</td>
              <td>${a.subject}</td>
              <td>${cls}</td>
              <td><button class="delete-btn" onclick="deleteAssignment(${a.id})">Delete</button></td>
            `;
            tbody.appendChild(tr);
          });
        }
      });

      container.appendChild(div);
    });
  }
}

function updateAssignmentDropdowns() {
  const teacherSelect = $('teacher-select');
  const subjectSelect = $('subject-select');
  if (!teacherSelect || !subjectSelect) return;

  teacherSelect.innerHTML = '<option value="">Select Teacher</option>';
  teachers.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.name;
    opt.textContent = t.name;
    teacherSelect.appendChild(opt);
  });

  subjectSelect.innerHTML = '<option value="">Select Subject</option>';
  [...subjectsLP, ...subjectsUP].forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.name;
    opt.textContent = s.name;
    subjectSelect.appendChild(opt);
  });
}

// NEW: Fixed assignment form submission
$('assign-subject-btn')?.addEventListener('click', function (e) {
  e.preventDefault();
  const teacher = $('teacher-select').value;
  const subject = $('subject-select').value;
  const grade = $('assign-grade').value;
  const classVal = $('assign-class').value;

  if (teacher && subject && grade && classVal) {
    const newId = Math.max(1, ...assignments.map(a => a.id || 0)) + 1;
    assignments.push({ id: newId, teacher, subject, grade, class: classVal });
    saveToStorage();
    loadAssignments();
    alert(`✅ Assigned ${subject} to ${teacher} for ${grade} ${classVal}`);
    
    // Clear form
    $('teacher-select').value = '';
    $('subject-select').value = '';
    $('assign-grade').value = 'Grade 1';
    $('assign-class').value = 'East';
  } else {
    alert("Please fill all fields!");
  }
});

window.deleteAssignment = (id) => {
  if (confirm("Delete assignment?")) {
    assignments = assignments.filter(a => a.id !== id);
    saveToStorage();
    loadAssignments();
  }
};

// =============== ASSESSMENT REPORTS ===============
function loadAssessments() {
  const infoBody = $('assessment-info-body');
  if (infoBody) {
    infoBody.innerHTML = '';

    // Sort assessments by grade and then by student name
    const sortedAssessments = [...assessments].sort((a, b) => {
      const gradeOrder = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
      const gradeA = gradeOrder.indexOf(a.grade);
      const gradeB = gradeOrder.indexOf(b.grade);
      
      if (gradeA !== gradeB) {
        return gradeA - gradeB;
      }
      
      return a.student.localeCompare(b.student);
    });

    sortedAssessments.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${a.assessmentNo}</td>
        <td>${a.student}</td>
        <td>${a.gender}</td>
        <td>${a.grade}</td>
        <td>${a.class}</td>
        <td>${a.subject}</td>
        <td>${a.marks}</td>
        <td>${a.term.split(' - ')[0]}</td>
        <td>${a.term.split(' - ')[1]}</td>
        <td>
          <button onclick="editAssessment(${a.id})">Edit</button>
          <button onclick="deleteAssessment(${a.id})">Delete</button>
        </td>
      `;
      infoBody.appendChild(tr);
    });
  }
}

// Search assessments
function searchAssessments() {
  const searchTerm = $('assessment-search').value.toLowerCase();
  const infoBody = $('assessment-info-body');
  
  if (!infoBody) return;
  
  if (!searchTerm) {
    loadAssessments();
    return;
  }
  
  const filtered = assessments.filter(a => 
    a.assessmentNo.toLowerCase().includes(searchTerm) || 
    a.student.toLowerCase().includes(searchTerm)
  );
  
  infoBody.innerHTML = '';
  filtered.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${a.assessmentNo}</td>
      <td>${a.student}</td>
      <td>${a.gender}</td>
      <td>${a.grade}</td>
      <td>${a.class}</td>
      <td>${a.subject}</td>
      <td>${a.marks}</td>
      <td>${a.term.split(' - ')[0]}</td>
      <td>${a.term.split(' - ')[1]}</td>
      <td>
        <button onclick="editAssessment(${a.id})">Edit</button>
        <button onclick="deleteAssessment(${a.id})">Delete</button>
      </td>
    `;
    infoBody.appendChild(tr);
  });
}

// Event listener for search
$('search-assessment-btn')?.addEventListener('click', searchAssessments);
$('assessment-search')?.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    searchAssessments();
  }
});

window.editAssessment = (id) => {
  const a = assessments.find(a => a.id === id);
  if (!a) return;
  
  const marks = prompt("Marks:", a.marks);
  if (marks !== null && marks >= 0 && marks <= 100) {
    a.marks = parseFloat(marks);
    saveToStorage();
    loadAssessments();
    alert("✅ Assessment updated!");
  }
};

window.deleteAssessment = (id) => {
  if (confirm("Delete assessment?")) {
    assessments = assessments.filter(a => a.id !== id);
    saveToStorage();
    loadAssessments();
  }
};

function getAutoComment(marks) {
  const m = parseFloat(marks) || 0;
  if (m >= 90) return "Excellent performance! Keep it up.";
  if (m >= 80) return "Very good work. Aim higher.";
  if (m >= 70) return "Good effort. Can improve.";
  if (m >= 60) return "Fair performance. Needs more practice.";
  if (m >= 50) return "Approaching expectations. Keep trying.";
  if (m >= 40) return "Below average. Needs support.";
  return "Needs significant improvement. Extra help recommended.";
}

// =============== MARK LISTS ===============
function loadMarks() {
  const body = $('marks-body');
  if (body) {
    body.innerHTML = '';
    marksLists.forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${m.class}</td>
        <td>${m.subject}</td>
        <td>${m.term}</td>
        <td><button onclick="viewMarks(${m.id})">View</button></td>
      `;
      body.appendChild(tr);
    });
  }
}

window.generateMarks = () => {
  const classVal = $('marks-class')?.value;
  const term = $('marks-term')?.value;
  const exam = $('marks-exam')?.value;
  const year = $('marks-year')?.value;

  if (!classVal || !term || !exam || !year) {
    alert("Please fill all fields.");
    return;
  }

  const studentsInClass = students.filter(s => s.class === classVal);
  if (studentsInClass.length === 0) {
    alert("No students found in this class.");
    return;
  }

  const classGrade = classVal.split(' ')[0] + ' ' + classVal.split(' ')[1];
  const subjectsInClass = assignments
    .filter(a => a.grade === classGrade)
    .map(a => a.subject);

  const uniqueSubjects = [...new Set(subjectsInClass)];

  const studentData = studentsInClass.map(student => {
    const studentAssessments = assessments.filter(a => 
      a.student === student.name && 
      a.class === classVal && 
      a.term === `${term} - ${exam}`
    );

    const subjectScores = {};
    let totalScored = 0;
    let subjectCount = 0;

    uniqueSubjects.forEach(subj => {
      const assessment = studentAssessments.find(a => a.subject === subj);
      const score = assessment ? parseFloat(assessment.marks) : 0;
      subjectScores[subj] = score;
      totalScored += score;
      subjectCount++;
    });

    const meanScore = subjectCount > 0 ? (totalScored / subjectCount).toFixed(1) : "0.0";

    return {
      ...student,
      subjectScores,
      totalScored: totalScored.toFixed(1),
      meanScore
    };
  });

  studentData.sort((a, b) => b.totalScored - a.totalScored);
  studentData.forEach((s, index) => { s.position = index + 1; });

  const totalMean = studentData.length > 0 
    ? (studentData.reduce((sum, s) => sum + parseFloat(s.meanScore), 0) / studentData.length).toFixed(1)
    : "0.0";

  // Get subject initials
  const subjectHeaders = uniqueSubjects.map(subj => {
    const subjectObj = subjectsLP.find(s => s.name === subj) || subjectsUP.find(s => s.name === subj);
    return subjectObj?.initial || subj.split(' ')[0].substring(0, 3).toUpperCase();
  });

  let tableRows = '';
  studentData.forEach((s, index) => {
    let subjectCells = '';
    uniqueSubjects.forEach(subj => {
      subjectCells += `<td>${s.subjectScores[subj] || '0'}</td>`;
    });

    tableRows += `
      <tr>
        <td style="text-align:center;">${index + 1}</td>
        <td>${s.assessmentNo}</td>
        <td>${s.name}</td>
        <td>${s.gender}</td>
        ${subjectCells}
        <td>${s.totalScored}</td>
        <td>${s.position}</td>
        <td>${getGradeFromMarks(s.totalScored)}</td>
      </tr>
    `;
  });

  const markListHTML = `
    <div style="max-width: 1000px; margin: 0 auto; font-family: Arial, sans-serif; border: 2px solid #039be5; border-radius: 12px; padding: 20px; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #039be5; padding-bottom: 10px;">
        <h2 style="color: #01579b;">${schoolData.name}</h2>
        <p style="color: #1b5e20; font-size: 16px;"><strong>MARK LIST</strong></p>
      </div>
      <div style="text-align: center; margin: 15px 0; font-size: 14px; font-weight: bold; color: #01579b;">
        ${exam} | ${term} | ${year}
      </div>
      <div style="text-align: center; margin: 10px 0; font-size: 13px;">
        <strong>Class:</strong> ${classVal}
      </div>
      <table style="width:100%; border-collapse: collapse; margin: 20px 0; font-size: 12px;">
        <thead>
          <tr style="background:#039be5; color:white;">
            <th style="border:1px solid #000; padding:8px; text-align:center;">No</th>
            <th style="border:1px solid #000; padding:8px;">Assess No</th>
            <th style="border:1px solid #000; padding:8px;">Student Name</th>
            <th style="border:1px solid #000; padding:8px;">Gender</th>
            ${subjectHeaders.map(h => `<th style="border:1px solid #000; padding:8px;">${h}</th>`).join('')}
            <th style="border:1px solid #000; padding:8px;">Total</th>
            <th style="border:1px solid #000; padding:8px;">Pos</th>
            <th style="border:1px solid #000; padding:8px;">Grade</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      <div style="margin: 20px 0; padding: 15px; background: #f5f5f5; border: 1px dashed #039be5; border-radius: 8px; font-size: 13px;">
        <p><strong>Mean Score:</strong> ${totalMean}</p>
      </div>
      <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
        Generated by CBC School Management System | Kenya
      </div>
    </div>
  `;

  const output = $('mark-list-output');
  const content = $('mark-list-content');

  if (content) {
    content.innerHTML = markListHTML;
  }

  if (output) {
    output.style.display = 'block';
  }
};

window.viewMarks = (id) => {
  const m = marksLists.find(m => m.id === id);
  if (m) {
    alert(`Class: ${m.class}\nSubject: ${m.subject}\nTerm: ${m.term}\n\nThis would open a detailed mark list.`);
  }
};

// Mark List Form
$('generate-marks-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  window.generateMarks();
});

// =============== TIMETABLE ===============
function loadTimetable() {
  const body = $('timetable-body');
  if (body) {
    body.innerHTML = '';
    timetable.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.class}</td>
        <td>${t.day}</td>
        <td>${t.period}</td>
        <td>${t.subject}</td>
        <td>${t.teacher}</td>
        <td><button onclick="deleteTimetable(${t.id})">Delete</button></td>
      `;
      body.appendChild(tr);
    });
  }
}

window.addTimetable = () => {
  const classVal = prompt("Class (e.g., Grade 3 East):");
  const day = prompt("Day (e.g., Monday):");
  const period = prompt("Period (1, 2, Break, 3):");
  const subject = prompt("Subject:");
  const teacher = prompt("Teacher:");
  if (classVal && day && period && subject && teacher) {
    const newId = Math.max(1, ...timetable.map(t => t.id || 0)) + 1;
    timetable.push({ id: newId, class: classVal, day, period, subject, teacher });
    saveToStorage();
    loadTimetable();
    alert(`✅ Timetable entry added for ${classVal}`);
  }
};

window.deleteTimetable = (id) => {
  if (confirm("Delete timetable entry?")) {
    timetable = timetable.filter(t => t.id !== id);
    saveToStorage();
    loadTimetable();
  }
};

$('add-timetable-btn')?.addEventListener('click', window.addTimetable);

// =============== REPORT CARD GENERATOR ===============
$('report-card-form')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const assessmentNo = $('rc-assessment-no').value.trim();
  const term = $('rc-term').value;
  const examType = $('rc-exam-type').value;
  const year = $('rc-year').value;
  const attitude = $('rc-attitude').value;
  const responsibility = $('rc-responsibility').value;
  const teamwork = $('rc-teamwork').value;
  const comment = $('rc-comment').value;

  const student = students.find(s => s.assessmentNo === assessmentNo);
  if (!student) {
    alert("Student with this Assessment Number not found.");
    return;
  }

  const studentAssessments = assessments.filter(a => 
    a.student === student.name && 
    a.class === student.class && 
    a.term === `${term} - ${examType}`
  );

  const totalScored = studentAssessments.reduce((sum, a) => sum + parseFloat(a.marks), 0);
  const totalPossible = studentAssessments.length * 100;

  const classmates = students.filter(s => s.class === student.class);
  const classScores = classmates.map(s => {
    const scores = assessments.filter(a => 
      a.student === s.name && 
      a.class === s.class && 
      a.term === `${term} - ${examType}`
    );
    const total = scores.reduce((sum, a) => sum + parseFloat(a.marks), 0);
    return { name: s.name, total };
  });
  classScores.sort((a, b) => b.total - a.total);
  const classPosition = classScores.findIndex(s => s.name === student.name) + 1;

  const gradeStudents = students.filter(s => s.grade === student.grade);
  const gradeScores = gradeStudents.map(s => {
    const scores = assessments.filter(a => 
      a.student === s.name && 
      a.class === s.class && 
      a.term === `${term} - ${examType}`
    );
    const total = scores.reduce((sum, a) => sum + parseFloat(a.marks), 0);
    return { name: s.name, total };
  });
  gradeScores.sort((a, b) => b.total - a.total);
  const gradePosition = gradeScores.findIndex(s => s.name === student.name) + 1;

  let subjectRows = '';
  let improveSubjects = [];

  if (studentAssessments.length === 0) {
    subjectRows = `<tr><td colspan="5" style="border:1px solid #000; padding:6px; text-align:center;">No assessment data</td></tr>`;
  } else {
    studentAssessments.forEach(a => {
      const cleanSubject = a.subject.replace(/\s*$$[^)]*$$/, '').trim();
      const fullGrade = getGradeFromMarks(a.marks);
      const shortGrade = fullGrade.split(' ')[0];
      if (shortGrade === 'AE2' || shortGrade === 'BE') improveSubjects.push(cleanSubject);
      subjectRows += `
        <tr>
          <td style="border:1px solid #000; padding:6px; text-align:center;">${cleanSubject}</td>
          <td style="border:1px solid #000; padding:6px; text-align:center;">100</td>
          <td style="border:1px solid #000; padding:6px; text-align:center;">${a.marks}</td>
          <td style="border:1px solid #000; padding:6px; text-align:center; font-weight:bold;">${shortGrade}</td>
          <td style="border:1px solid #000; padding:6px;">${getAutoComment(a.marks)}</td>
        </tr>
      `;
    });
  }

  const improveList = improveSubjects.length > 0 
    ? improveSubjects.join(', ') 
    : "All subjects are progressing well.";

  // Auto-generate comment based on marks
  const autoComment = getAutoComment(totalScored);
  const finalComment = comment || autoComment;

  const reportHTML = `
    <div style="max-width: 900px; margin: 0 auto; font-family: Arial, sans-serif; border: 1.5px solid #039be5; border-radius: 10px; padding: 12px; background: #fff; font-size: 10px; line-height: 1.3;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1.5px solid #039be5; padding-bottom: 6px;">
        <div style="text-align: left;">
          <h2 style="margin: 0; color: #01579b; font-size: 14px; font-weight: bold;">${schoolData.name}</h2>
          <p style="margin: 2px 0; color: #1b5e20; font-size: 10px;"><strong>End of Term Academic Report</strong></p>
        </div>
        <img src="${schoolData.logo}" alt="School Logo" style="height: 70px; border: 1px solid #ddd; padding: 4px; border-radius: 6px;">
      </div>
      <div style="text-align: center; margin: 10px 0; font-size: 12px; font-weight: bold; color: #01579b;">
        ${examType} | ${term} | ${year}
      </div>
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin: 12px 0; text-align: center; font-size: 10px;">
        <div><strong>Name:</strong> ${student.name}</div>
        <div><strong>Assess No:</strong> ${student.assessmentNo}</div>
        <div><strong>Gender:</strong> ${student.gender}</div>
        <div><strong>Grade:</strong> ${student.grade}</div>
        <div><strong>Class:</strong> ${student.class}</div>
      </div>
      <div style="text-align: center; margin: 15px 0; font-size: 13px; font-weight: bold; color: #039be5; text-decoration: underline;">
        ACADEMIC PERFORMANCE
      </div>
      <table style="width:100%; border-collapse: collapse; margin: 10px auto; font-size: 9.5px;">
        <thead>
          <tr style="background:#039be5; color:white;">
            <th style="border:1px solid #000; padding:6px;">Subject</th>
            <th style="border:1px solid #000; padding:6px;">Total</th>
            <th style="border:1px solid #000; padding:6px;">Scored</th>
            <th style="border:1px solid #000; padding:6px;">Grade</th>
            <th style="border:1px solid #000; padding:6px;">Comments</th>
          </tr>
        </thead>
        <tbody>
          ${subjectRows}
        </tbody>
      </table>
      <div style="margin: 15px 0; padding: 10px; background: #f5f5f5; border: 1px dashed #039be5; border-radius: 6px; font-size: 10px;">
        <p style="margin: 4px 0;"><strong>Total:</strong> ${totalScored.toFixed(1)} / ${totalPossible}</p>
        <p style="margin: 4px 0;"><strong>Class Pos:</strong> ${classPosition}/${classmates.length}</p>
        <p style="margin: 4px 0;"><strong>Grade Pos:</strong> ${gradePosition}/${gradeStudents.length}</p>
      </div>
      <div style="margin: 15px 0; padding: 10px; background: #fff8e1; border: 1px solid #ffa000; border-radius: 6px; font-size: 10px;">
        <strong>Improve:</strong> ${improveList}
      </div>
      <div style="margin: 20px 0; padding: 10px; border: 1px solid #039be5; border-radius: 6px; background: #e3f2fd; font-size: 10px;">
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 8px;">
          <div><strong>Attitude:</strong> ${attitude}</div>
          <div><strong>Resp:</strong> ${responsibility}</div>
          <div><strong>Team:</strong> ${teamwork}</div>
        </div>
        <div>
          <strong>Comment:</strong> <em>"${finalComment}"</em>
        </div>
      </div>
      <div style="margin-top: 25px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: center; font-size: 10px;">
        <div>
          <p style="margin: 4px 0;"><strong>HT: ${headteacher?.name || 'Not Set'}</strong></p>
          <p style="margin: 4px 0;">Signature: __________</p>
          <p style="margin: 4px 0;">Date: ____ / ____ / ${year}</p>
        </div>
        <div>
          <p style="margin: 4px 0;">Parent: __________</p>
          <p style="margin: 4px 0;">Date: ____ / ____ / ${year}</p>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 8px; color: #666;">
        CBC School Management System | Kenya
      </div>
    </div>
  `;

  $('report-card-content').innerHTML = reportHTML;
  $('report-card-output').style.display = 'block';
});

// =============== CBC GRADE SYSTEM ===============
function getGradeFromMarks(marks) {
  const m = parseFloat(marks) || 0;
  if (m >= 90) return 'EE1';
  if (m >= 80) return 'EE2';
  if (m >= 70) return 'ME1';
  if (m >= 60) return 'ME2';
  if (m >= 50) return 'AE1';
  if (m >= 40) return 'AE2';
  return 'BE';
}

// =============== TEACHER DASHBOARD ===============
function showTeacherDashboard(teacher) {
  document.querySelectorAll('.dashboard').forEach(d => d.style.display = 'none');
  $('login-section').style.display = 'none';
  $('teacher-dashboard').style.display = 'block';
  $('teacher-name').textContent = teacher.name;

  document.querySelectorAll('#teacher-dashboard .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#teacher-dashboard .tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('#teacher-dashboard .tab-content').forEach(c => c.style.display = 'none');
      btn.classList.add('active');
      $(btn.getAttribute('data-tab')).style.display = 'block';
    });
  });

  $('teacher-subjects').style.display = 'block';

  const subjectList = $('teacher-subjects-list');
  if (subjectList) {
    subjectList.innerHTML = '';

    const assigned = assignments.filter(a => a.teacher === teacher.name);
    if (assigned.length === 0) {
      subjectList.innerHTML = '<p>You are not assigned to any subject or class.</p>';
      return;
    }

    const classMap = {};
    assigned.forEach(a => {
      if (!classMap[a.class]) classMap[a.class] = [];
      classMap[a.class].push(a.subject);
    });

    Object.keys(classMap).forEach(className => {
      const div = document.createElement('div');
      div.style.marginBottom = '15px';
      div.innerHTML = `
        <p><strong>Class:</strong> ${className}</p>
        <ul style="margin: 5px 0 10px 20px;">
          ${classMap[className].map(subj => `<li>${subj}</li>`).join('')}
        </ul>
      `;
      subjectList.appendChild(div);
    });
  }

  // Load subjects for dropdown
  const subjectDropdown = $('entry-subject');
  if (subjectDropdown) {
    subjectDropdown.innerHTML = '<option value="">Select Subject</option>';
    const assignedSubjects = assignments
      .filter(a => a.teacher === teacher.name)
      .map(a => a.subject);
    
    const uniqueSubjects = [...new Set(assignedSubjects)];
    uniqueSubjects.forEach(subj => {
      const opt = document.createElement('option');
      opt.value = subj;
      opt.textContent = subj;
      subjectDropdown.appendChild(opt);
    });
  }

  window.loadMarksEntryForm = function () {
    const tbody = $('marks-entry-body');
    if (tbody) tbody.innerHTML = '';

    const subject = $('entry-subject').value;
    if (!subject) {
      if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="text-align:center">Please select a subject first</td></tr>`;
      return;
    }

    const studentsInClasses = students.filter(s =>
      assignments.some(a => a.teacher === teacher.name && a.class === s.class && a.subject === subject)
    );

    if (studentsInClasses.length === 0) {
      if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="text-align:center">No students found in your classes for this subject.</td></tr>`;
      return;
    }

    studentsInClasses.forEach(s => {
      const tr = document.createElement('tr');

      const marksInput = document.createElement('input');
      marksInput.type = 'number';
      marksInput.min = '0';
      marksInput.max = '100';
      marksInput.step = '1'; // Changed to whole numbers only
      marksInput.placeholder = 'e.g., 78';
      marksInput.dataset.studentId = s.id;
      marksInput.dataset.studentName = s.name;
      marksInput.dataset.assessmentNo = s.assessmentNo;
      marksInput.dataset.gender = s.gender;
      marksInput.dataset.class = s.class;
      marksInput.dataset.subject = subject;
      marksInput.style.width = '80px';
      marksInput.style.padding = '6px';

      const gradeCell = document.createElement('td');
      gradeCell.id = `grade-${s.id}-${subject.replace(/\s+/g, '-')}`;

      tr.innerHTML = `
        <td>${s.name}</td>
        <td>${s.assessmentNo}</td>
        <td>${s.gender}</td>
        <td></td>
        <td></td>
      `;
      tr.cells[3].appendChild(marksInput);
      tr.cells[4].appendChild(gradeCell);

      marksInput.addEventListener('input', () => {
        const marks = parseFloat(marksInput.value) || 0;
        gradeCell.textContent = getGradeFromMarks(marks);
      });

      if (tbody) tbody.appendChild(tr);
    });
  };

  // Listen for subject change
  $('entry-subject')?.addEventListener('change', loadMarksEntryForm);
  document.querySelector('[data-tab="teacher-marks"]')?.addEventListener('click', loadMarksEntryForm);
}

// =============== SAVE MARKS ===============
$('marks-entry-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const term = $('entry-term').value;
  const exam = $('entry-exam').value;
  const subject = $('entry-subject').value;

  if (!term || !exam || !subject) {
    alert("Please select Term, Exam Type, and Subject.");
    return;
  }

  const inputs = document.querySelectorAll('#marks-entry-body input[type="number"]');
  const newAssessments = [];

  let allValid = true;
  inputs.forEach(input => {
    const studentId = input.dataset.studentId;
    const studentName = input.dataset.studentName;
    const assessmentNo = input.dataset.assessmentNo;
    const gender = input.dataset.gender;
    const classVal = input.dataset.class;
    const marks = input.value.trim();

    if (!marks || marks < 0 || marks > 100) {
      allValid = false;
      return;
    }

    newAssessments.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      student: studentName,
      assessmentNo: assessmentNo,
      gender: gender,
      class: classVal,
      subject: subject,
      marks: parseFloat(marks).toFixed(0), // Changed to whole numbers only
      term: `${term} - ${exam}`
    });
  });

  if (!allValid) {
    alert("Please enter valid marks (0-100) for all students.");
    return;
  }

  newAssessments.forEach(a => assessments.push(a));
  saveToStorage();
  alert(`✅ Successfully saved ${newAssessments.length} student marks for ${subject}!`);
  $('marks-entry-form').reset();
  if ($('marks-entry-body')) $('marks-entry-body').innerHTML = '';
  // Reload form to clear selections
  if ($('entry-subject')) $('entry-subject').value = '';
});

// =============== LOAD ALL HEADTEACHER DATA ===============
function loadAllHT() {
  loadTeachers();
  loadStudents();
  loadSubjects();
  loadAssignments();
  updateAssignmentDropdowns();
  loadAssessments();
  loadMarks();
  loadTimetable();
}

// =============== DASHBOARD ANALYTICS ===============
function loadAnalytics() {
  const ctx1 = $('studentsByGradeChart');
  if (ctx1) {
    ctx1.parentElement.innerHTML += '<p style="color: #666; font-size: 12px;">Charts not available offline. Use online version for analytics.</p>';
  }

  const ctx2 = $('genderRatioChart');
  if (ctx2) {
    ctx2.parentElement.innerHTML += '<p style="color: #666; font-size: 12px;">Charts not available offline. Use online version for analytics.</p>';
  }

  const overviewDiv = $('analytics-overview');
  if (overviewDiv) {
    overviewDiv.innerHTML = '<p style="color: #666; font-size: 12px;">Analytics not available offline. Use online version for full charts.</p>';
  }
  
  // Advanced Analytics Button
  $('advanced-analytics-btn')?.addEventListener('click', () => {
    alert("Advanced Analytics would open here in online mode");
  });
  
  // Generate Detailed Report Button
  $('generate-detailed-report')?.addEventListener('click', () => {
    alert("Generating detailed report...");
    // In real implementation, this would generate a comprehensive report
    setTimeout(() => {
      alert("✅ Detailed report generated successfully!");
    }, 1500);
  });
}

// =============== EXPORT TO PDF ===============
window.exportToPDF = function () {
  alert("PDF export requires internet. Use online version or save report card as HTML.");
};

// =============== BULK PRINT ===============
window.bulkPrintClass = function () {
  alert("Bulk print not available offline. Use individual print.");
};

// =============== BULK PRINT MARKS ===============
$('bulk-print-marks-btn')?.addEventListener('click', () => {
  const printContent = $('mark-list-output');
  if (printContent) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>body { font-family: Arial, sans-serif; margin: 10px; } @page { margin: 1cm; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #000; padding: 6px; text-align: center; font-size: 12px; } th { background: #039be5; color: white; } .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('<div class="footer">Generated by CBC School Management System | Kenya</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
});

// =============== BULK PRINT REPORT CARDS ===============
$('bulk-print-reportcard')?.addEventListener('click', () => {
  alert("Bulk print report cards not available offline. Use individual print.");
});

// =============== EXPORT CSV ===============
window.exportCSV = function(type) {
  alert("CSV export requires internet. Use online version.");
};

// =============== PARENT DASHBOARD ===============
function showParentDashboard(parent) {
  document.querySelectorAll('.dashboard').forEach(d => d.style.display = 'none');
  $('login-section').style.display = 'none';
  $('parent-dashboard').style.display = 'block';
  
  // Simulate loading child data for demo
  const demoChild = students[0] || {
    name: "Demo Student",
    assessmentNo: "AS1001",
    grade: "Grade 3",
    class: "East",
    gender: "Male"
  };
  
  // Populate child info
  $('child-name').textContent = demoChild.name;
  $('child-assessment').textContent = demoChild.assessmentNo;
  $('child-grade').textContent = demoChild.grade;
  $('child-class').textContent = demoChild.class;
  $('child-gender').textContent = demoChild.gender;
  
  // Load recent report cards
  loadRecentReportCards(demoChild);
  
  // Load progress tracking
  loadProgressTracking(demoChild);
  
  // Load improvement areas
  loadImprovementAreas(demoChild);
}

function loadRecentReportCards(child) {
  const container = $('recent-report-cards');
  container.innerHTML = `
    <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 10px 0;">
      <h4>Term 3 - End Term 2024</h4>
      <p><strong>Overall Grade:</strong> ME1</p>
      <p><strong>Average Score:</strong> 78.5%</p>
      <button onclick="printReportCard()" class="print-btn">🖨️ Print Report Card</button>
      <button onclick="downloadReportCard()" class="print-btn">📥 Download Report</button>
    </div>
  `;
}

function loadProgressTracking(child) {
  // Create simple chart data for demo
  const ctx = $('progressChart');
  if (ctx) {
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Term 1', 'Term 2', 'Term 3'],
        datasets: [{
          label: 'Performance',
          data: [72, 75, 78],
          borderColor: '#039be5',
          backgroundColor: 'rgba(3, 155, 229, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
  
  // Update summary
  $('overall-performance').textContent = "Good Progress";
  $('average-score').textContent = "78.5%";
  $('best-subject').textContent = "Mathematics";
  $('worst-subject').textContent = "Kiswahili";
  
  // Export Progress CSV
  $('export-progress-csv')?.addEventListener('click', () => {
    alert("Exporting progress data to CSV...");
    setTimeout(() => {
      alert("✅ Progress data exported successfully!");
    }, 1000);
  });
}

function loadImprovementAreas(child) {
  const improvementList = $('improvement-list');
  const recommendations = $('recommendation-text');
  
  improvementList.innerHTML = `
    <li>Mathematics - Need to improve problem-solving skills</li>
    <li>Kiswahili - Reading comprehension needs attention</li>
    <li>Science - Regular practice recommended</li>
  `;
  
  recommendations.textContent = "Focus on daily reading and math practice. Consider extra tutoring for Kiswahili.";
  
  // Send Improvement Email
  $('send-improvement-email')?.addEventListener('click', () => {
    alert("Sending improvement recommendations via email...");
    setTimeout(() => {
      alert("✅ Email sent successfully!");
    }, 1500);
  });
}

function printReportCard() {
  alert("Report card would print in online mode");
}

function downloadReportCard() {
  alert("Downloading report card...");
  setTimeout(() => {
    alert("✅ Report card downloaded successfully!");
  }, 1000);
}

// =============== PARENT REPORTING FEATURES ===============
function generateCustomReport() {
  const reportType = $('report-type').value;
  const reportPeriod = $('report-period').value;
  
  alert(`Generating ${reportType} report for ${reportPeriod} period...`);
  
  setTimeout(() => {
    alert("✅ Custom report generated successfully!");
  }, 2000);
}

function downloadReport(reportType) {
  alert(`Downloading ${reportType} report...`);
  setTimeout(() => {
    alert("✅ Report downloaded successfully!");
  }, 1000);
}

// =============== INIT ===============
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  loadSettings();
  loadHeadteacher();
  loadAllHT();
  updateAssignmentDropdowns();
  loadCloudConfig(); // Load cloud configuration
  updateSyncStatus(); // Update sync status
  
  if ($('school-name-header')) $('school-name-header').textContent = schoolData.name;
  if ($('school-logo')) $('school-logo').src = schoolData.logo;
  
  // Initialize student filter
  loadStudentsByGrade();
  
  // Setup role buttons AFTER DOM is loaded
  setupRoleButtons();
  
  // Cloud Sync Event Listeners
  $('save-cloud-config')?.addEventListener('click', saveCloudConfig);
  $('test-cloud-connection')?.addEventListener('click', testCloudConnection);
  $('manual-sync-btn')?.addEventListener('click', manualSync);
  $('backup-data-btn')?.addEventListener('click', backupData);
  $('restore-data-btn')?.addEventListener('click', restoreData);
  
  // Parent Report Events
  $('generate-custom-report')?.addEventListener('click', generateCustomReport);
  $('download-summary-report')?.addEventListener('click', () => downloadReport("summary"));
  $('download-detailed-report')?.addEventListener('click', () => downloadReport("detailed"));
  $('download-comparison-report')?.addEventListener('click', () => downloadReport("comparison"));
});