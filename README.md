# frogspawn
System for delivering documents and data in an interactive training exercise

## Overview

Frogspawn is a simple web-based document viewer that displays a list of documents from a JSON file and allows users to view them in an iframe. The system automatically polls for updates to the document list.

## Features

- **Split-panel interface**: Document list on the left, viewer on the right
- **Click-to-view**: Click any document in the list to display it in the iframe
- **Automatic polling**: Regularly checks for updates to the JSON file
- **Customizable**: Configure the JSON source URL and polling interval via URL parameters

## Usage

### Basic Usage

1. Open `index.html` in a web browser
2. Select an activity card on the home page
3. Click **Open Inbox** to launch `inbox.html` for that activity
4. Or click **Open Control Panel** to launch `controls.html` for that activity

The inbox viewer page is now `inbox.html`.

### Activity-based Startup

Frogspawn uses a simple URL-based startup model:

- `url`: Base URL for activity content
  - If `activity` is not provided, this points directly at an activity folder containing `documents.json` and `settings.json`.
  - Example: `inbox.html?url=https://example.org/lhfv-table-top/activities/artic-lhfv-outbreak/`
- `activity`: Optional activity name
  - When provided, `url` is treated as the repository base, and inbox loads from `activities/<activity>/` under that base.
  - Example: `inbox.html?url=https://example.org/lhfv-table-top/&activity=artic-lhfv-outbreak`

### Configuration Overrides

You can still override specific files directly:

- `docs`: URL to `documents.json`
- `settings`: URL to `settings.json`
- `status`: URL to day/status JSON
- `interval`: Polling interval in milliseconds

Example:
```
inbox.html?url=https://example.org/lhfv-table-top/activities/artic-lhfv-outbreak/&interval=60000
```

Explicit override example:
```
inbox.html?url=https://example.org/lhfv-table-top/&activity=artic-lhfv-outbreak&docs=https://example.com/custom-documents.json
```

## JSON Format

The JSON file should contain an array of document objects with the following structure:

```json
[
    {
        "title": "Document Title",
        "description": "A brief description of the document",
        "url": "https://example.com/document.html"
    },
    {
        "title": "Another Document",
        "description": "Description of another document",
        "url": "https://example.com/another-doc.html"
    }
]
```

### Fields

- `title` (optional): The title of the document, displayed prominently in the list
- `description` (optional): A description shown below the title
- `url` (required): The URL of the page to display in the iframe

If only one of `title` or `description` is provided, it will be used for both fields.

## Example

The repository includes two activity packs in `activities/` with their own `documents.json`, `settings.json`, `documents/`, and `data/` folders.

## Activity Catalog Format

By default Frogspawn loads `activities.json` from the app root.

```json
{
  "defaultActivity": "artic-table-top",
  "activities": {
    "artic-table-top": {
      "url": "activities/artic-table-top/"
    },
    "artic-lhfv-outbreak": {
      "url": "activities/artic-lhfv-outbreak/"
    }
  }
}
```

## Deployment

### Local Testing

Open `index.html` for the launcher page, then launch an activity into `inbox.html`. For testing with local JSON files, you may need to run a local web server due to CORS restrictions:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have http-server installed)
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

### Production Deployment

Host the app shell and either:

- host activity packs under `activities/<name>/`, or
- provide a remote catalog with remote activity `baseUrl` values.

If remote activity assets are on a different origin, ensure CORS allows browser fetches from the Frogspawn origin.

## Security Considerations

- The iframe will only display pages that allow embedding (check `X-Frame-Options` headers)
- Ensure your JSON source is from a trusted location
- Be aware of CORS restrictions when loading JSON from external sources

## License

See LICENSE file for details.
