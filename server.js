const http = require('http');
const fs = require('fs');
const qs = require('querystring');

const form = `
<h1>Welcome to Student Portal</h1>
<form method="POST" action="/add">
  <input name="name" placeholder="Student Name" required><br>
  <input name="roll" placeholder="Roll Number" required><br>
  <input name="course" placeholder="Course" required><br>
  <input name="email" type="email" placeholder="Email" required><br>
  <button>Add Student</button>
</form>
<a href="/students">View Students</a>`;

function readStudents() {
  if (fs.existsSync('students.json')) {
    return JSON.parse(fs.readFileSync('students.json'));
  }
  return [];
}

const server = http.createServer((req, res) => {

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(form);

  } else if (req.method === 'POST' && req.url === '/add') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const student = qs.parse(body);
      const students = readStudents();
      students.push(student);
      fs.writeFileSync('students.json', JSON.stringify(students, null, 2));
      res.writeHead(302, { Location: '/students' });
      res.end();
    });

  } else if (req.method === 'GET' && req.url === '/students') {
    const list = readStudents()
      .map(s => `<li>${s.name} | ${s.roll} | ${s.course} | ${s.email}</li>`)
      .join('');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<h2>All Students</h2><ul>${list}</ul><a href="/">Add more</a>`);

  } else {
    res.writeHead(404);
    res.end('Page not found');
  }
});

server.listen(3000, () => console.log('Server running on port 3000'));