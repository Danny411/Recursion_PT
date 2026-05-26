```md
# Recursion Visualizer

Recursion Visualizer is a web-based project that helps users understand recursion through visual output and execution logging.  
It uses an Express.js backend, a MySQL/MariaDB database, and a browser-based frontend.

## Project Structure

```bash
Recursion_PT/
├── Client/
│   ├── Index.html
│   ├── Script.js
│   └── Style.css
├── Database/
│   └── schema.sql
├── Server/
│   ├── db.js
│   └── server.js
├── package.json
└── README.md
```

## Features

- Browser-based recursion visualizer.
- Frontend served from the `Client` folder.
- Backend API built with Node.js and Express.
- Execution logs saved to MariaDB/MySQL.
- Works locally on Android using Termux.

## Requirements

- Node.js
- npm
- MariaDB or MySQL
- Termux on Android

## Installation

1. Copy the project into your working folder.
2. Open Termux and go into the project directory:
   ```bash
   cd ~/Recursion_PT
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a local `.env` file with your database credentials. See `.env.example` for the expected format.
5. Make sure your database is running.
6. Import the schema from `Database/schema.sql` into MariaDB.

## Database Setup

The project uses environment variables instead of hardcoded passwords. Do not commit your `.env` file to GitHub.

If you prefer a safer database account, create a dedicated user instead of using `root`:

```sql
CREATE DATABASE recursion_visualizer;
CREATE USER 'recursion_user'@'localhost' IDENTIFIED BY 'YourStrongPassword';
GRANT ALL PRIVILEGES ON recursion_visualizer.* TO 'recursion_user'@'localhost';
FLUSH PRIVILEGES;
```

Then update your local `.env` file like this:

```text
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=recursion_user
DB_PASSWORD=YourStrongPassword
DB_NAME=recursion_visualizer
```


Create the database and table using the SQL file in the `Database` folder.

Example:
```bash
mariadb -u root
```

Then run:
```sql
SOURCE /path/to/Recursion_PT/Database/schema.sql;
```

Or manually create the database first if needed:
```sql
CREATE DATABASE recursion_visualizer;
USE recursion_visualizer;
```

## Running the Project

Start the backend server with:

```bash
npm start
```

If successful, you should see:

```bash
Server running on port 5000
✅ Connected to MySQL database
```

## Opening the Website

Open the following address in your browser:

```text
http://127.0.0.1:5000
```

If you are using the same phone for demo or presentation, this will show the frontend interface while the backend keeps running in Termux.

## Saving Execution Logs

The backend exposes a POST endpoint for saving execution data:

```text
POST /save-log
```

Example test using curl:

```bash
curl -X POST http://127.0.0.1:5000/save-log \
  -H "Content-Type: application/json" \
  -d '{"example":"factorial","inputValue":5,"result":"120"}'
```

If the request is successful, the server returns:

```json
{"message":"Execution saved successfully"}
```

## Checking Saved Logs

To verify that a log was saved, open MariaDB in another Termux session:

```bash
mariadb -u root
```

Then run:

```sql
USE recursion_visualizer;
SELECT * FROM execution_logs ORDER BY id DESC;
```

This will show the most recent execution logs.

## Android/Termux Notes

- Keep the Node.js server running in one Termux session.
- Open the website in a browser using `http://127.0.0.1:5000`.
- Use another Termux session to check MariaDB if needed.
- If the app does not open correctly, ensure `server.js` is serving the `Client` folder as static files.

## Troubleshooting

### Website shows API text instead of the frontend
Make sure `Server/server.js` serves the `Client` folder and sends `Client/Index.html` at `/`.

### Port 5000 already in use
Run:

```bash
pkill node
pkill nodejs
npm start
```

### Database connection failed
Check:
- MariaDB is running.
- `Server/db.js` has the correct database name.
- The database and table were created from `schema.sql`.



## Author

EFE VICTORY OCHUKO
```

Citations:
[1] How can I select and copy the content of a code block in GitHub Markdown? https://www.reddit.com/r/github/comments/pyp8vp/how_can_i_select_and_copy_the_content_of_a_code/
[2] README.md - Pickra/copy-code-block - GitHub https://github.com/Pickra/copy-code-block/blob/master/README.md
[3] Easy way to add 'copy to clipboard' to GitHub markdown? https://stackoverflow.com/questions/31908564/easy-way-to-add-copy-to-clipboard-to-github-markdown/45476252
[4] Easy way to add 'copy to clipboard' to GitHub markdown? https://stackoverflow.com/questions/31908564/easy-way-to-add-copy-to-clipboard-to-github-markdown
[5] copyCodeSnippet - Redocly https://redocly.com/docs-legacy/developer-portal/configuration/siteconfig/copy-codesnippet
[6] What is the easiest or recommended method to add a copy code ... https://github.com/orgs/mdx-js/discussions/1948
[7] GitHub - jassibacha/swift-markdown-copy: Copy file contents as a markdown code block in vscode. https://github.com/jassibacha/swift-markdown-copy
[8] Markdown Code Copy Button - Open VSX Registry https://open-vsx.org/extension/barnim/markdown-code-copy-button
[9] Code Blocks - ReadMe Docs https://docs.readme.com/rdmd/docs/code-blocks
[10] Code Blocks - Markdown - Codecademy https://www.codecademy.com/resources/docs/markdown/code-blocks
