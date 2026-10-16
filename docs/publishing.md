# Publish the course with GitHub Pages

The guide is a static website. It needs no server, keys, model account or third-party CDN at runtime. Its assets and download links are relative, so GitHub project-page subpaths work.

## Preview locally

From the repository root:

```sh
npm run site:build
npm run site:check
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist/site
```

Open `http://127.0.0.1:4173`. The build copies the site's static files, extracts source excerpts from the current mod, builds an allowlisted Cowork ZIP, and copies the ZIP and sample notes into the site downloads.

The lesson content and checkpoints live in `site/course-data.mjs`; `scripts/render-course.mjs` generates the homepage and eight standalone lesson pages. `site/reference.html` retains the original guide. Browser progress logic lives in `site/course.js` with pure helpers in `site/progress.mjs`. The source is `site/` and `scripts/`. Generated output lives under ignored `dist/site/`. Edit the source and rebuild; do not edit the generated files.

## GitHub Pages setup

1. Push the repository to GitHub. For a public open-source workshop, make the repository public deliberately and review all tracked files first.
2. In **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source.
3. Run the **Publish field guide** workflow manually, or push a guide change to `main`.
4. The build job checks the guide and uploads only `dist/site` as a Pages artifact. The deployment job uses the `github-pages` environment and requires `pages: write` and `id-token: write`.
5. Wait for the deploy job's success and use its returned URL. A checked-in workflow alone is not a live deployment.

The regular check workflow also builds the site on pull requests without deploying it. Deployment runs on `main` and manual dispatch, not on untrusted pull requests.

## Forks

`GITHUB_REPOSITORY` controls the generated source links and is set automatically in GitHub Actions. Local builds default to the original project. To preview your fork's source links:

```sh
GITHUB_REPOSITORY=your-name/your-repo npm run site:build
```

The handwritten README, the explainer's site link and the HTML fallback links use this project's public URL. Update those for your fork. No custom domain or paid hosting is required for this setup. GitHub account/organization policy and Pages availability still apply.

## What gets published?

Ten static HTML pages (course homepage, eight lessons, quick reference), CSS, browser-only JavaScript, the derived source-excerpt data, public reference documents, the Cowork ZIP, and synthetic notes. No Git metadata, local Claude settings, generated exact-build types, plugin store data or private session state is included.

Reference: [GitHub's custom Pages workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Progress and direct links

Each lesson is an ordinary HTML URL under `lessons/`, so refreshing or sharing a lesson works without a server rewrite. Old homepage anchors such as `#playground` and `#recipes` redirect to their new lesson when JavaScript is available.

Completion and last-visited lesson IDs are stored under one local-storage key. They are not transmitted. Checkpoint selections are not saved. If storage is blocked, the course remains usable and shows that progress will not survive navigation. The reset control clears only this course record.
