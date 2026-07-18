# Whizzy Wiggles

A static kids website built with a single `index.html`, external CSS, and JavaScript files.

## Project structure

- `index.html` — main landing page
- `css/style.css` — site styles
- `js/main.js` — interactive behavior and game logic
- `images/` — image assets for the site
- `coloring-pages/` — printable image assets used by the site

## Hosting options

### GitHub Pages
1. Push this repo to GitHub.
2. Add the workflow file at `.github/workflows/github-pages.yml`.
3. On push to `main`, GitHub Actions will build and deploy the repo root to Pages.
4. Go to the repository Settings > Pages and confirm that the site is published from the `gh-pages` or `GitHub Pages` workflow.

> Note: This workflow deploys the repository root directly, so no build step is required for this static site.

### Custom domain
If you want to use `whizzywiggles.in`, the repo now includes a `CNAME` file. After the first successful Pages deployment, add DNS records for GitHub Pages and then enable HTTPS in repository Settings > Pages.

For an apex domain like `whizzywiggles.in`, use these GitHub Pages A records:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

After DNS is configured and the domain is verified, enable `Enforce HTTPS` in GitHub Pages settings. It may take a few minutes for SSL to provision.

### Netlify
1. Log in to Netlify and create a new site from Git.
2. Connect your GitHub repository and choose the `main` branch.
3. Set the build command to none and the publish directory to `/`.
4. Deploy.

### Vercel
1. Log in to Vercel and import the GitHub repo.
2. Choose the `main` branch.
3. Set the output directory to `/`.
4. Deploy.

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`.
2. Run `firebase login` and `firebase init hosting` in the repo.
3. Choose `build` or `public` folder as `/`.
4. Deploy with `firebase deploy`.

## Notes

- Add image assets to `images/` and printable files to `coloring-pages/`.
- If you use a custom domain like `whizzywiggles.in`, configure it in your hosting provider.
- Firebase config is currently placeholder text in `js/main.js`.

## Next steps

- Add the missing image files referenced by the site.
- Deploy with one of the hosts above.
- Verify `index.html` loads and all scripts work in the browser.
