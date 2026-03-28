import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { emailService } from './services/email.service';
import { templates } from './templates';

type Bindings = {
    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_SECURE: string;
    MAIL_USER: string;
    MAIL_PASS: string;
    MAIL_FROM_NAME: string;
    MAIL_RATE_LIMIT: string;
    DB: D1Database;
    SEND_EMAIL?: any; // Cloudflare Email Routing binding
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());

const isCurl = (c: any) => {
    const userAgent = c.req.header('User-Agent') || '';
    return userAgent.toLowerCase().includes('curl');
};

const streamText = (text: string) => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const lines = text.split('\n');
            // Target total duration of ~1000ms, but clamp delay between 5ms and 50ms
            const targetDuration = 800;
            const calculatedDelay = Math.floor(targetDuration / lines.length);
            const delay = Math.max(5, Math.min(50, calculatedDelay));

            for (const line of lines) {
                controller.enqueue(encoder.encode(line + '\n'));
                // Artificial delay for "typing" effect
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            controller.close();
        }
    });
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'X-Content-Type-Options': 'nosniff',
            'Transfer-Encoding': 'chunked'
        }
    });
};

// ASCII Art Frames (Server-side definition)
const frames = {
    idle: [
        "   _____       _     _      ",
        "  |_   _|     | |   | |     ",
        "    | |     __| |   | | ___ ",
        "   _| |_   / _\\x60 |   | |/ _ \\",
        "  |_____| | (_| |   | |  __/",
        "           \\__,_|   |_|\\___|",
        "  System Ready. Waiting for jobs...",

        "   [ 💤 ] System Idle . . .",
        "   [ 💤 ] Monitoring Queue . . .",

        "   . . . z z Z Z Z [ System Sleep ]",

        // Fun Frame 1: Coffee
        "      ( ( (  ) ) )      ",
        "       ) ) ( ( (        ",
        "     ..............     ",
        "     |   COFFEE   |]    ",
        "     \\  ________  /     ",
        "      '----------'      ",
        "   [ ☕ ] Recharging Workers...",

        // Fun Frame 2: Satellite
        "          .  .   .          ",
        "      .   |  |   .          ",
        "    .   __|__|__   .        ",
        "    |  |  |  |  |  |        ",
        "    |__|__|__|__|__|        ",
        "          |  |              ",
        "   [ 📡 ] Scanning for Signals...",

        // Fun Frame 3: Retro PC
        "      .--------------.      ",
        "      | >_ CMD.EXE   |      ",
        "      |              |      ",
        "      | [||||||||| ] |      ",
        "      '--------------'      ",
        "   [ 💻 ] System Online...",

        // Fun Frame 4: Ghost/Pacman
        "      .-.   .-.     .--.    ",
        "     | OO| | OO|   / _  \\   ",
        "     |   | |   |  | ( ) |   ",
        "     '^^^' '^^^'   '---'    ",
        "   [ 👻 ] No Ghosts in Machine...",

        // Fun Frame 5: Matrix
        "    1 0 1 0 1 0 1 0 1 0 1   ",
        "    0 1 0 1 0 1 0 1 0 1 0   ",
        "    1 0 1 0 1 0 1 0 1 0 1   ",
        "    0 1 0 1 0 1 0 1 0 1 0   ",
        "   [ 💾 ] Matrix Loaded...",

        // Fun Frame 6: Rocket Launch
        "          |          ",
        "         / \\         ",
        "        / _ \\        ",
        "       |.o '.|       ",
        "       |'._.|        ",
        "       |     |       ",
        "     ,'|  |  |\\x60 .     ",
        "    /  |  |  |  \\    ",
        "   |,-'--|--'-.|     ",
        "   [ 🚀 ] Ignition Sequence Start...",

        // Fun Frame 7: Owl
        "      ,_,    ",
        "     (O,O)   ",
        "     (   )   ",
        "     -\"-\"    ",
        "   [ 🦉 ] Night Watch Active...",

        // Fun Frame 8: DNA
        "    .   .    ",
        "     \\ /     ",
        "    --X--    ",
        "     / \\     ",
        "    '   '    ",
        "   [ 🧬 ] Sequencing Data...",

        // Fun Frame 10: City
        "        | |          ",
        "      __| |__        ",
        "     |  | |  |       ",
        "     |  |_|  |       ",
        "     |_______|       ",
        "   [ 🏙️ ] City Never Sleeps...",

        // Fun Frame 11: Robot
        "      [o_o]     ",
        "     /[___]\\    ",
        "    d |   | b   ",
        "      |___|     ",
        "      /   \\     ",
        "   [ 🤖 ] Beep Boop Processing...",

        // Fun Frame 12: Diamond
        "       / \\      ",
        "      /   \\     ",
        "      \\   /     ",
        "       \\ /      ",
        "   [ 💎 ] Crystal Clear Status...",

        // Fun Frame 13: Floppy Disk
        "    __________  ",
        "   | |__|  _  | ",
        "   |       |  | ",
        "   |_______|__| ",
        "   [ 💾 ] Saving State...",

        // Fun Frame 14: Hourglass
        "    _______   ",
        "    \\ . . /   ",
        "     \\ . /    ",
        "      ) (     ",
        "     / . \\    ",
        "    /_____\\   ",
        "   [ ⏳ ] Time is Ticking...",

        // Fun Frame 15: Cloud
        "      .--.      ",
        "   .-(    ).    ",
        "  (___.__)__)   ",
        "   [ ☁️ ] Cloud Worker Active..."
    ],
    processing: [
        [
            " [✉️] . . . . . . . . . . . . . . . . [⚙️ D1]",
            "                                      (____)",
            "                                        ||  ",
            "                                      [____]"
        ],
        [
            "     [✉️] . . . . . . . . . . . . . . [⚙️ D1]",
            "                                      (____)",
            "                                        ||  ",
            "                                      [____]"
        ],
        [
            "         [✉️] . . . . . . . . . . . . [⚙️ D1]",
            "                                      (____)",
            "                                        ||  ",
            "                                      [____]"
        ],
        [
            "             [✉️] . . . . . . . . . . [⚙️ D1]",
            "                                      (____)",
            "                                        ||  ",
            "                                      [____]"
        ],
        [
            "                 [✉️] . . . . . . . . [⚙️ D1]",
            "                                      (____)",
            "                                        ||  ",
            "                                      [____]"
        ],
        [
            "                     [✉️] . . . . . . [⚙️ D1]",
            "                                      (____)",
            "                                        ||  ",
            "                                      [____]"
        ],
        [
            "                         [✉️] . . . . [⚙️ D1] ===> [🚀 SMTP]",
            "                                      (____)      /     \\",
            "                                        ||       |       |",
            "                                      [____]      \\_____/"
        ],
        [
            "                             [✉️] . . [⚙️ D1] ===> [🚀 SMTP] ---> [✨ SENT]",
            "                                      (____)      /     \\",
            "                                        ||       |       |",
            "                                      [____]      \\_____/"
        ],
        [
            "                                     [⚙️ D1] ===> [🚀 SMTP] ---> [✨ SENT] [✉️]",
            "                                      (____)      /     \\",
            "                                        ||       |       |",
            "                                      [____]      \\_____/"
        ]
    ],
    sent: [
        "   [ ✨ ] EMAIL SENT SUCCESSFULLY! [ ✨ ]",
        "   [ 🚀 ] Delivered via SMTP [ 🚀 ]",
        "   [ ✅ ] Queue Processed [ ✅ ]"
    ],
    sending: [
        "   [ 📤 ] Sending Email . . .",
        "   [ 📨 ] Connecting to SMTP . . .",
        "   [ 📡 ] Transmitting Data . . .",
        "   [ 🚀 ] Launching Payload . . ."
    ],
    idea: [
        [
            "      .=.      ",
            "     '| |\\x60     ",
            "     /   \\     ",
            "    |  💡 |    ",
            "     \\   /     ",
            "      \\x60'\\x60      ",
            "   [ 💡 ] Idea Processing..."
        ],
        [
            "      .=.      ",
            "     '| |\\x60     ",
            "     /   \\     ",
            "    |  ✨ |    ",
            "     \\   /     ",
            "      \\x60'\\x60      ",
            "   [ ✨ ] Eureka Moment!"
        ]
    ],
    waiting: [
        [
            "    _______   ",
            "    \\ . . /   ",
            "     \\ . /    ",
            "      ) (     ",
            "     / . \\    ",
            "    /_____\\   ",
            "   [ ⏳ ] Waiting for Cron..."
        ],
        [
            "    _______   ",
            "    \\     /   ",
            "     \\ . /    ",
            "      ) (     ",
            "     / . \\    ",
            "    /_____\\   ",
            "   [ ⏳ ] Still Waiting..."
        ]
    ]
};

// Stats storage
let stats = {
    startTime: Date.now(),
    emailsQueued: 0,
    emailsProcessed: 0,
    errors: 0,
};

// Web UI
// Web UI
app.get('/', async (c) => {
    if (isCurl(c)) {
        const art = frames.idle[Math.floor(Math.random() * frames.idle.length)];
        const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
        const responseText = `${art}\n\n  [ System Ready ]\n  Status: Online\n  Uptime: ${uptime}s\n  Queued: ${stats.emailsQueued}\n  Processed: ${stats.emailsProcessed}\n  Errors: ${stats.errors}\n`;
        return streamText(responseText);
    }

    const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
    const templateList = Object.keys(templates).map(t => `<option value="${t}">${t}</option>`).join('');

    // Get queue stats from DB
    let queueCount = 0;
    let recentEmails: any[] = [];
    try {
        const countResult = await c.env.DB.prepare('SELECT COUNT(*) as count FROM email_queue WHERE status = "pending"').first();
        queueCount = countResult?.count as number || 0;

        const recentResult = await c.env.DB.prepare('SELECT * FROM email_queue ORDER BY created_at DESC LIMIT 20').all();
        recentEmails = recentResult.results || [];
    } catch (e) {
        console.error('Failed to get DB stats', e);
    }

    const rows = recentEmails.map(email => {
        const date = new Date(email.created_at * 1000).toLocaleString();
        const statusColor = email.status === 'sent' ? 'text-green-400' : email.status === 'failed' ? 'text-red-400' : 'text-yellow-400';

        let errorHtml = '-';
        if (email.error) {
            const encodedError = encodeURIComponent(email.error);
            errorHtml = `<button onclick="showError('${encodedError}')" class="text-xs bg-red-900/50 hover:bg-red-900 text-red-200 px-2 py-1 rounded border border-red-800 transition">View Error</button>`;
        }

        let statusText = email.status.toUpperCase();
        if (email.status === 'pending' && email.attempts > 0) {
            statusText += ` (Retry ${email.attempts}/5)`;
        }

        return `
      <tr>
        <td>${date}</td>
        <td>${email.to_email}</td>
        <td class="${statusColor} font-bold text-xs">${statusText}</td>
        <td>${errorHtml}</td>
      </tr>
    `;
    }).join('');

    // Inject frames safely
    const framesJson = JSON.stringify(frames).replace(/`/g, '\\\\x60');

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rise Email Service</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { background-color: #0f172a; color: #f8fafc; }
        .glass { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
      </style>
    </head>
    <body class="p-8 max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Prerna Email Service</h1>
          <p class="text-slate-400 mt-2">Cloudflare Worker • D1 Queue • Cron Trigger</p>
        </div>
        <div class="text-right">
           <div class="text-sm text-slate-400">Uptime: ${Math.floor(uptime / 60)}m ${uptime % 60}s</div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="glass p-6 rounded-xl text-center">
          <div class="text-4xl font-bold text-indigo-400 mb-2">${queueCount}</div>
          <div class="text-slate-400 text-sm uppercase tracking-wider">Pending in Queue</div>
        </div>
        <div class="glass p-6 rounded-xl text-center">
          <div class="text-4xl font-bold text-green-400 mb-2">${stats.emailsProcessed}</div>
          <div class="text-slate-400 text-sm uppercase tracking-wider">Processed (Session)</div>
        </div>
        <div class="glass p-6 rounded-xl text-center">
          <div class="text-4xl font-bold text-red-400 mb-2">${stats.errors}</div>
          <div class="text-slate-400 text-sm uppercase tracking-wider">Errors (Session)</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Send Form -->
        <div class="glass p-6 rounded-xl h-fit">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Queue New Email</h2>
            <button onclick="testConnection()" class="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded transition">Test SMTP</button>
          </div>
          <form id="emailForm" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-400 mb-1">Recipient Email</label>
              <input type="email" name="to" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-400 mb-1">Subject</label>
              <input type="text" name="subject" required class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-400 mb-1">Template</label>
              <select name="templateName" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition">
                ${templateList}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-400 mb-1">Data (JSON)</label>
              <textarea name="templateData" rows="4" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition font-mono text-sm">{"user": {"name": "Test"}}</textarea>
            </div>
            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition transform active:scale-95">
              Queue Email
            </button>
          </form>
          <div id="result" class="mt-4 hidden p-3 rounded-lg text-sm"></div>
        </div>

        <!-- Recent Activity -->
        <div class="glass p-6 rounded-xl overflow-hidden">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Recent Activity</h2>
            <div class="text-xs text-slate-400 animate-pulse">● LIVE</div>
          </div>
          
          <!-- ASCII Art Animation Container -->
          <div class="mb-6 bg-black/50 p-4 rounded-lg font-mono text-xs md:text-sm leading-tight text-green-400 overflow-x-auto whitespace-pre" id="ascii-art">
Initializing System Visualizer...
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm" id="activity-table">
              <thead class="text-slate-400 border-b border-slate-700">
                <tr>
                  <th class="pb-3">Time</th>
                  <th class="pb-3">To</th>
                  <th class="pb-3">Status</th>
                  <th class="pb-3">Error</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800" id="activity-body">
                ${rows}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Error Modal -->
      <div id="errorModal" class="fixed inset-0 bg-black/80 hidden flex items-center justify-center z-50 backdrop-blur-sm" onclick="this.classList.add('hidden')">
        <div class="glass p-8 rounded-xl max-w-2xl w-full mx-4 relative" onclick="event.stopPropagation()">
          <h3 class="text-xl font-bold text-red-400 mb-4">Error Details</h3>
          <pre id="modalErrorContent" class="bg-black/50 p-4 rounded-lg text-xs font-mono text-red-200 whitespace-pre-wrap overflow-auto max-h-[60vh]"></pre>
          <div class="mt-6 text-right">
            <button onclick="document.getElementById('errorModal').classList.add('hidden')" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition">Close</button>
          </div>
        </div>
      </div>

      <script>
        // ASCII Art Frames (Injected from Server)
        const frames = ${framesJson};

        let frameIndex = 0;
        let isProcessing = false;

        function updateAscii(queueCount, recentEmails) {
            const el = document.getElementById('ascii-art');

            // Check if we have a recently sent email (within last 5 seconds)
            const latestEmail = recentEmails && recentEmails[0];
            const now = Math.floor(Date.now() / 1000);
            const isRecentlySent = latestEmail && latestEmail.status === 'sent' && (now - latestEmail.updated_at) < 5;
            const isSending = latestEmail && latestEmail.status === 'pending' && latestEmail.attempts > 0;

            if (isSending) {
                isProcessing = true;
                const art = frames.sending[frameIndex % frames.sending.length];
                el.textContent = Array.isArray(art) ? art.join('\\n') : art;
                el.textContent += '\\n\\n  STATUS: SENDING...';
                el.className = "mb-6 bg-black/50 p-4 rounded-lg font-mono text-xs md:text-sm leading-tight text-blue-400 overflow-x-auto whitespace-pre";
                frameIndex++;
            } else if (queueCount > 0) {
                isProcessing = true;
                // Randomly switch between processing, idea, and waiting for variety
                const rand = Math.floor(frameIndex / 10) % 3;
                let art, status, color;

                if (rand === 0) {
                    art = frames.processing[frameIndex % frames.processing.length];
                    status = 'PROCESSING ' + queueCount + ' EMAILS...';
                    color = 'text-yellow-400';
                } else if (rand === 1) {
                    art = frames.idea[frameIndex % frames.idea.length];
                    status = 'GENERATING IDEAS...';
                    color = 'text-purple-400';
                } else {
                    art = frames.waiting[frameIndex % frames.waiting.length];
                    status = 'WAITING IN QUEUE...';
                    color = 'text-orange-400';
                }

                el.textContent = Array.isArray(art) ? art.join('\\n') : art;
                el.textContent += '\\n\\n  STATUS: ' + status;
                el.className = "mb-6 bg-black/50 p-4 rounded-lg font-mono text-xs md:text-sm leading-tight " + color + " overflow-x-auto whitespace-pre";
                frameIndex++;
            } else if (isRecentlySent) {
                isProcessing = false;
                const art = frames.sent[frameIndex % frames.sent.length];
                el.textContent = art + '\\n\\n  STATUS: SENT';
                el.className = "mb-6 bg-black/50 p-4 rounded-lg font-mono text-xs md:text-sm leading-tight text-green-400 overflow-x-auto whitespace-pre";
                frameIndex++;
            } else {
                isProcessing = false;
                const art = frames.idle[Math.floor(frameIndex / 5) % frames.idle.length]; // Slow down idle animation
                el.textContent = art + '\\n\\n  STATUS: IDLE';
                el.className = "mb-6 bg-black/50 p-4 rounded-lg font-mono text-xs md:text-sm leading-tight text-slate-400 overflow-x-auto whitespace-pre";
                frameIndex++;
            }
        }

        function showError(encodedError) {
            const error = decodeURIComponent(encodedError);
            document.getElementById('modalErrorContent').textContent = error;
            document.getElementById('errorModal').classList.remove('hidden');
        }

        async function pollStats() {
            try {
                const res = await fetch('/health');
                const data = await res.json();

                // Update ASCII with recent emails context
                updateAscii(data.stats.queueCount, data.recentEmails);

                // Update Table
                const tbody = document.getElementById('activity-body');
                tbody.innerHTML = data.recentEmails.map(email => {
                    const date = new Date(email.created_at * 1000).toLocaleString();
                    const statusColor = email.status === 'sent' ? 'text-green-400' : email.status === 'failed' ? 'text-red-400' : 'text-yellow-400';

                    let errorHtml = '-';
                    if (email.error) {
                        const encodedError = encodeURIComponent(email.error);
                        errorHtml = '<button onclick="showError(\\'' + encodedError + '\\')" class="text-xs bg-red-900/50 hover:bg-red-900 text-red-200 px-2 py-1 rounded border border-red-800 transition">View Error</button>';
                    }

                    let statusText = email.status.toUpperCase();
                    if (email.status === 'pending' && email.attempts > 0) {
                        statusText += ' (Retry ' + email.attempts + '/5)';
                    }

                    return '<tr>' +
                        '<td>' + date + '</td>' +
                        '<td>' + email.to_email + '</td>' +
                        '<td class="' + statusColor + ' font-bold text-xs">' + statusText + '</td>' +
                        '<td>' + errorHtml + '</td>' +
                        '</tr>';
                }).join('');

            } catch (e) {
                console.error('Polling failed', e);
            }
        }

        // Poll every 1s
        setInterval(pollStats, 1000);

        // Initial render
        updateAscii(0);

        async function testConnection() {
            const btn = document.querySelector('button[onclick="testConnection()"]');
            const originalText = btn.textContent;
            btn.textContent = 'Testing...'; btn.disabled = true;

            try {
                const res = await fetch('/test-connection', { method: 'POST' });
                const data = await res.json();
                alert(data.message || data.error);
            } catch (e) {
                alert('Failed to test connection');
            } finally {
                btn.textContent = originalText; btn.disabled = false;
            }
        }

        document.getElementById('emailForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Queueing...'; btn.disabled = true;

            const resultDiv = document.getElementById('result');
            resultDiv.classList.add('hidden');
            resultDiv.className = 'mt-4 hidden p-3 rounded-lg text-sm';

            try {
                const formData = new FormData(e.target);
                const res = await fetch('/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: formData.get('to'),
                        subject: formData.get('subject'),
                        templateName: formData.get('templateName'),
                        templateData: JSON.parse(formData.get('templateData'))
                    })
                });
                const data = await res.json();

                resultDiv.textContent = data.message || data.error;
                resultDiv.classList.remove('hidden');

                if (res.ok) {
                    resultDiv.classList.add('bg-green-900/50', 'text-green-200');
                    // Trigger immediate poll
                    pollStats();
                } else {
                    resultDiv.classList.add('bg-red-900/50', 'text-red-200');
                }
            } catch (err) {
                resultDiv.textContent = err.message;
                resultDiv.classList.remove('hidden');
                resultDiv.classList.add('bg-red-900/50', 'text-red-200');
            } finally {
                btn.textContent = originalText; btn.disabled = false;
            }
        });
      </script>
    </body>
    </html>
    `;
    return c.html(html);
});

app.post('/send', async (c) => {
    try {
        const body = await c.req.json();
        const { to, subject, templateName, templateData } = body;

        if (!to || !subject || !templateName) {
            return c.json({ error: 'Missing required fields' }, 400);
        }

        // Save to D1 Queue
        await c.env.DB.prepare(
            'INSERT INTO email_queue (to_email, subject, template_name, template_data) VALUES (?, ?, ?, ?)'
        ).bind(to, subject, templateName, JSON.stringify(templateData)).run();

        stats.emailsQueued++;

        if (isCurl(c)) {
            const art = frames.sending[Math.floor(Math.random() * frames.sending.length)];
            const responseText = `${art}\n\n  [ SUCCESS ] Email queued successfully.\n  It will be sent within 1 minute.\n`;
            return streamText(responseText);
        }

        return c.json({ success: true, message: 'Email queued successfully. It will be sent within 1 minute.' });
    } catch (error: any) {
        console.error('Error queueing email:', error);
        stats.errors++;
        if (isCurl(c)) {
            return streamText(`\n  [ ERROR ] Failed to queue email.\n  Reason: ${error.message || 'Unknown error'}\n`);
        }
        return c.json({ error: error.message || 'Failed to queue email' }, 500);
    }
});

app.post('/test-connection', async (c) => {
    try {
        const env = c.env;
        if (!env.MAIL_USER || !env.MAIL_PASS) {
            return c.json({ error: 'Missing MAIL_USER or MAIL_PASS secrets' }, 500);
        }

        emailService.initialize({
            host: env.MAIL_HOST,
            port: parseInt(env.MAIL_PORT),
            secure: env.MAIL_SECURE === 'true',
            auth: {
                user: env.MAIL_USER,
                pass: env.MAIL_PASS,
            },
            fromName: env.MAIL_FROM_NAME,
        });

        await emailService.verifyConnection();
        if (isCurl(c)) {
            return streamText(`\n  [ SUCCESS ] SMTP Connection Successful!\n`);
        }
        return c.json({ success: true, message: 'SMTP Connection Successful!' });
    } catch (error: any) {
        console.error('SMTP Connection Failed:', error);
        if (isCurl(c)) {
            return streamText(`\n  [ ERROR ] SMTP Connection Failed.\n  Reason: ${error.message || 'Unknown error'}\n`);
        }
        return c.json({ error: error.message || 'SMTP Connection Failed' }, 500);
    }
});

app.get('/health', async (c) => {
    let queueCount = 0;
    let recentEmails: any[] = [];
    try {
        const countResult = await c.env.DB.prepare('SELECT COUNT(*) as count FROM email_queue WHERE status = "pending"').first();
        queueCount = countResult?.count as number || 0;

        const recentResult = await c.env.DB.prepare('SELECT * FROM email_queue ORDER BY created_at DESC LIMIT 5').all();
        recentEmails = recentResult.results || [];
    } catch (e) {
        console.error('Failed to get DB stats', e);
    }

    return c.json({
        status: 'ok',
        stats: {
            ...stats,
            queueCount,
            uptime: Math.floor((Date.now() - stats.startTime) / 1000)
        },
        recentEmails
    });
});

export default {
    fetch: app.fetch,
    async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
        console.log('Cron triggered: Processing email queue...');
        const startTime = Date.now();
        const MAX_EXECUTION_TIME_MS = 45000; // 45 seconds safety limit

        // 1. Cleanup old stuck emails (older than 1 hour)
        try {
            await env.DB.prepare('DELETE FROM email_queue WHERE status = "pending" AND (strftime(\'%s\', \'now\') - created_at) > 3600').run();
        } catch (e) {
            console.error('Cleanup failed:', e);
        }

        // Initialize Email Service once
        emailService.initialize({
            host: env.MAIL_HOST,
            port: parseInt(env.MAIL_PORT),
            secure: env.MAIL_SECURE === 'true',
            auth: {
                user: env.MAIL_USER,
                pass: env.MAIL_PASS,
            },
            fromName: env.MAIL_FROM_NAME,
        });

        // Check for credentials
        if (!env.MAIL_USER || !env.MAIL_PASS) {
            console.error('Missing MAIL_USER or MAIL_PASS secrets');
            return;
        }

        const batchSize = parseInt(env.MAIL_RATE_LIMIT || '50');
        let hasMore = true;

        while (hasMore) {
            // Check execution time
            if (Date.now() - startTime > MAX_EXECUTION_TIME_MS) {
                console.log('Max execution time reached. Stopping for now.');
                break;
            }

            // 2. Fetch pending emails with Linear Backoff (attempts * 1 min)
            const { results } = await env.DB.prepare(`
        SELECT * FROM email_queue 
              WHERE status = 'pending'
        AND(
            attempts = 0 
                OR
                (strftime('%s', 'now') - updated_at) > (attempts * 60)
        )
              ORDER BY created_at ASC
        LIMIT ?
            `).bind(batchSize).all();

            if (!results || results.length === 0) {
                console.log('No pending emails ready for retry.');
                hasMore = false;
                break;
            }

            console.log(`Found ${results.length} pending emails in this batch.`);

            for (const row of results) {
                const email = row as any;
                try {
                    let templateData = {};
                    try {
                        templateData = JSON.parse(email.template_data);
                    } catch (e) {
                        throw new Error('Invalid JSON in template_data');
                    }

                    await emailService.sendEmail({
                        to: email.to_email,
                        subject: email.subject,
                        templateName: email.template_name,
                        templateData: templateData,
                    });

                    // Mark as sent
                    await env.DB.prepare('UPDATE email_queue SET status = "sent", updated_at = ? WHERE id = ?')
                        .bind(Math.floor(Date.now() / 1000), email.id)
                        .run();

                    console.log(`Email ${email.id} sent to ${email.to_email} `);

                } catch (error: any) {
                    console.error(`Failed to send email ${email.id}: `, error);

                    // Check for permanent errors (5xx codes)
                    // Nodemailer often puts the response code in error.responseCode
                    const isPermanentError = error.responseCode && error.responseCode >= 500 && error.responseCode < 600;

                    // Update retry count
                    const newAttempts = (email.attempts || 0) + 1;

                    if (newAttempts >= 5 || isPermanentError) {
                        // Max retries reached OR Permanent Error: Delete from queue
                        const reason = isPermanentError ? 'Permanent Error (5xx)' : 'Max Retries Reached';
                        console.log(`Email ${email.id} failed(${reason}).Deleting from queue.`);

                        // We delete it so it doesn't clog the queue
                        await env.DB.prepare('DELETE FROM email_queue WHERE id = ?').bind(email.id).run();
                    } else {
                        // Update attempts and timestamp
                        await env.DB.prepare('UPDATE email_queue SET attempts = ?, updated_at = ? WHERE id = ?')
                            .bind(newAttempts, Math.floor(Date.now() / 1000), email.id)
                            .run();
                    }
                }
            }

            // If we fetched less than batchSize, we are done
            if (results.length < batchSize) {
                hasMore = false;
            }
        }
    }
};
