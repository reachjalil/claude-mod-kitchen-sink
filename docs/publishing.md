# Publish this guide with GitHub Pages

The guide is a static website. It needs no server, keys, model account or third-party CDN at runtime. Its assets and download links are relative, so GitHub project-page subpaths work.

## Preview locally

From the repository root:

```sh
npm run site:build
npm run site:check
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist/site
```

Open `http://127.0.0.1:4173`. The build copies the site's static files, extracts source excerpts from the current mod, builds an allowlisted Cowork ZIP, and copies the ZIP and sample notes into the site downloads.

The source is `site/`. Generated output lives under ignored `dist/site/`. Edit the source and rebuild; do not edit the generated files.

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

Static HTML, CSS, browser-only JavaScript, the derived source-excerpt data, public reference documents, the Cowork ZIP, and synthetic notes. No Git metadata, local Claude settings, generated exact-build types, plugin store data or private session state is included.

Reference: [GitHub's custom Pages workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
