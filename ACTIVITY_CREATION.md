# Creating a New Frogspawn Activity

This repository uses an activity-pack model. Each activity is a self-contained
folder under `activities/` with its own settings, document list, content pages,
and data files.

## Top-Level Layout

The app shell lives at the repository root:

- `index.html` - home page / activity launcher
- `inbox.html` - participant app for a selected activity
- `controls.html` - facilitator panel for advancing the activity
- `activities.json` - catalog of available activities
- `js/` - shared JavaScript used by the app shell
- `css/` - shared styles used by the app shell
- `assets/` - shared images and logos used by the app shell

## Activity Folder Layout

Each activity should live under `activities/<activity-name>/`.

Example:

```text
activities/
  artic-table-top/
    settings.json
    documents.json
    documents/
    data/
    assets/
    css/
  artic-lhfv-outbreak/
    settings.json
    documents.json
    documents/
    data/
    assets/
    css/
```

### Required files

- `settings.json`
- `documents.json`
- `documents/`
- `data/`

### Common supporting folders

- `assets/` - activity-specific images, logos, screenshots, and media
- `css/` - activity-specific stylesheet files

## What Each File Does

### `settings.json`

Contains the activity metadata shown on the launcher and used by the inbox.

Typical fields:

```json
{
  "title": "ARTIC Table-Top exercise",
  "description": "Exercise description",
  "location": "Exercise location",
  "date": "2025-10-25",
  "jsonbinBinId": "",
  "jsonbinAccessKey": ""
}
```

Notes:

- `title`, `description`, `location`, and `date` are shown in the UI.
- `jsonbinBinId` and `jsonbinAccessKey` are used by inbox/control panel to read
  the current day from JSONBin.

### `documents.json`

Lists the documents that appear in the inbox.

Typical shape:

```json
[
  {
    "day": 0,
    "title": "Introduction",
    "description": "Welcome to the exercise",
    "url": "documents/01_introduction.html"
  },
  {
    "day": 1,
    "title": "Situation Report 1",
    "description": "First update",
    "url": "documents/02_acdc_alert.html"
  }
]
```

Notes:

- `day` controls when the document becomes visible in the inbox.
- `url` is resolved relative to the `documents.json` file.
- Keep the URLs activity-relative, not app-root-relative.

### `documents/`

Contains the HTML pages that are shown inside the inbox iframe.

These pages should usually load shared or local assets with relative paths from
themselves:

- CSS from the same activity: `../css/file.css`
- images from the same activity: `../assets/image.png`
- data pages from the same activity: `../data/page.html`
- shared app scripts from the repo root: `../../js/setup.js` only if the page is
  still nested under `documents/`

Because the document pages sit inside `activities/<activity-name>/documents/`,
a link like `../css/acdc_sitrep.css` resolves to
`activities/<activity-name>/css/acdc_sitrep.css`.

### `data/`

Contains supporting HTML and data files that are opened from the document pages.

Examples in this repo include Krona visualizations such as:

- `data/case_3_krona.html`
- `data/wastewater_krona.html`
- `data/pet_shop_env_krona.html`

Those files should open correctly on the same server as the calling document.
If they contain their own linked assets, keep those links relative to the data
file location.

### `assets/`

Use this for activity-specific logos, photos, and illustrations.

Example references from a document page:

```html
<img src="../assets/who_logo.svg" alt="WHO emblem">
<img src="../assets/sitrep3_plot_map.png" alt="Map">
```

### `css/`

Use this for activity-specific stylesheet files.

Example references from a document page:

```html
<link rel="stylesheet" href="../css/acdc_sitrep.css">
<link rel="stylesheet" href="../css/social_media.css">
```

## Creating a New Activity

1. Create a new folder under `activities/`, for example:

   ```text
   activities/new-activity/
   ```

2. Add the required files:

   - `settings.json`
   - `documents.json`
   - `documents/`
   - `data/`

3. Add any activity-specific styling or media:

   - `css/`
   - `assets/`

4. Fill out `settings.json` with the activity title, description, location, and
   start date.

5. Create `documents.json` with the documents in the order they should appear.

6. Make each HTML page in `documents/` load the right assets using relative
   paths from the document location.

7. If needed, add a JSONBin bin ID and access key to `settings.json` so the
   activity can be driven without the local server.

8. Add the activity to `activities.json` so it appears on the launcher home page.

Example catalog entry:

```json
{
  "defaultActivity": "artic-table-top",
  "activities": {
    "artic-table-top": {
      "url": "activities/artic-table-top/"
    },
    "new-activity": {
      "url": "activities/new-activity/"
    }
  }
}
```

## URL Patterns

The main ways to launch an activity are:

- `index.html` - launcher page
- `inbox.html?url=<activity-folder-url>` - participant inbox for an activity
- `controls.html?activityBase=<activity-folder-url>` - facilitator panel for an activity

## Practical Rules

- Keep each activity self-contained under its own folder.
- Prefer relative paths so the same activity can be served locally or remotely.
- Do not hardcode root-level paths inside activity documents.
- Store secrets such as JSONBin Master Keys only in the control panel session,
  not in the repo.
- If you copy an existing activity, update the title, dates, document list, and
  any asset references that are activity-specific.

## Minimal Checklist

Before an activity is ready, confirm:

- [ ] `activities/<name>/settings.json` exists
- [ ] `activities/<name>/documents.json` exists
- [ ] `activities/<name>/documents/` exists
- [ ] `activities/<name>/data/` exists
- [ ] `activities/<name>/assets/` exists if the activity uses custom media
- [ ] `activities/<name>/css/` exists if the activity uses custom styles
- [ ] `activities.json` includes the new activity
- [ ] document pages use the correct relative links
- [ ] the launcher opens the activity inbox and control panel correctly
