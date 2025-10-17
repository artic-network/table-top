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
2. The page will load documents from `documents.json` by default
3. Click on any document in the list to view it in the iframe
4. The document list will automatically refresh every 30 seconds

### Custom Configuration

You can customize the behavior using URL parameters:

- `json`: Specify the URL of the JSON file to load
  - Example: `index.html?json=https://example.com/my-documents.json`
- `interval`: Set the polling interval in milliseconds
  - Example: `index.html?interval=60000` (polls every 60 seconds)

Combined example:
```
index.html?json=https://example.com/docs.json&interval=60000
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

The repository includes an example `documents.json` file with sample documents. You can modify this file to point to your own documents.

## Deployment

### Local Testing

Simply open `index.html` in your web browser. For testing with a local JSON file, you may need to run a local web server due to CORS restrictions:

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

Upload the `index.html` file to any web server or hosting service. Configure it to point to your JSON document list using the `?json=` URL parameter.

## Security Considerations

- The iframe will only display pages that allow embedding (check `X-Frame-Options` headers)
- Ensure your JSON source is from a trusted location
- Be aware of CORS restrictions when loading JSON from external sources

## License

See LICENSE file for details.
