# Extension Publishing Guide

This guide covers how to publish the DevTools Hub extensions to Chrome Web Store and VS Code Marketplace.

## Prerequisites

- GitHub repository with the extensions code
- Chrome Web Store Developer account ($5 one-time fee)
- Azure DevOps account (free)

---

## Part 1: Chrome Extension Publishing

### Step 1: Create Chrome Web Store Developer Account

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Pay the $5 one-time registration fee
3. Complete the account setup

### Step 2: Get Chrome Web Store API Credentials

You need OAuth2 credentials to automate publishing.

#### 2.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (e.g., "DevTools Hub Publishing")
3. Note the Project ID

#### 2.2 Enable Chrome Web Store API

1. Go to **APIs & Services > Library**
2. Search for "Chrome Web Store API"
3. Click **Enable**

#### 2.3 Create OAuth2 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Select **Desktop app**
4. Name it "DevTools Hub CI"
5. Download the JSON file
6. Note the **Client ID** and **Client Secret**

#### 2.4 Get Refresh Token

Run this command locally to get a refresh token:

```bash
# Install chrome-webstore-upload-cli
npm install -g chrome-webstore-upload-cli

# Get refresh token (opens browser for OAuth)
chrome-webstore-upload init
```

Follow the prompts and authorize with your Google account. This creates a `.chrome-webstore-upload-keys.json` file with:
- `clientId`
- `clientSecret`
- `refreshToken`

### Step 3: First-Time Manual Upload

For the first upload, you must do it manually:

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **New Item**
3. Upload the ZIP file from `extensions/chrome/dist/` (create it with `cd extensions/chrome/dist && zip -r ../extension.zip .`)
4. Fill in the store listing:
   - **Name:** DevTools Hub
   - **Summary:** Developer utilities: Format, convert, encode/decode data instantly
   - **Description:** (see below)
   - **Category:** Developer Tools
   - **Language:** English
5. Upload screenshots (1280x800 or 640x400)
6. Upload icons (128x128)
7. Submit for review (takes 1-3 days)

**Store Description:**
```
DevTools Hub brings powerful developer utilities directly to your browser.

Features:
• JSON Formatter - Format, minify, and validate JSON
• YAML/XML Converter - Convert between JSON, YAML, and XML
• Base64 Encoder/Decoder - Encode and decode Base64 strings
• URL Encoder/Decoder - Encode and decode URLs
• UUID Generator - Generate UUIDs instantly
• Case Converter - Convert text between camelCase, snake_case, etc.
• And more!

How to use:
1. Click the extension icon for the popup UI
2. Right-click on selected text for context menu options
3. Use keyboard shortcuts for quick access

All processing happens locally in your browser - your data never leaves your device.

Keyboard shortcuts:
• Ctrl+Shift+J (Cmd+Shift+J on Mac) - Format JSON
• Ctrl+Shift+B (Cmd+Shift+B on Mac) - Toggle Base64
• Ctrl+Shift+U (Cmd+Shift+U on Mac) - Generate UUID

Open source: https://github.com/djig/devtools_hub
```

### Step 4: Note the Extension ID

After publishing, note the Extension ID from the URL:
```
https://chrome.google.com/webstore/detail/devtools-hub/EXTENSION_ID_HERE
```

### Step 5: Add GitHub Secrets

Go to your GitHub repository **Settings > Secrets and variables > Actions** and add:

| Secret Name | Value |
|-------------|-------|
| `CHROME_EXTENSION_ID` | Your extension ID (32 characters) |
| `CHROME_CLIENT_ID` | OAuth Client ID from Step 2.3 |
| `CHROME_CLIENT_SECRET` | OAuth Client Secret from Step 2.3 |
| `CHROME_REFRESH_TOKEN` | Refresh token from Step 2.4 |

---

## Part 2: VS Code Extension Publishing

### Step 1: Create Azure DevOps Organization

1. Go to [Azure DevOps](https://dev.azure.com)
2. Sign in with Microsoft account
3. Create a new organization if you don't have one

### Step 2: Create Personal Access Token (PAT)

1. In Azure DevOps, click your profile icon (top right)
2. Select **Personal access tokens**
3. Click **New Token**
4. Configure:
   - **Name:** DevTools Hub Publish
   - **Organization:** All accessible organizations
   - **Expiration:** 1 year (or custom)
   - **Scopes:** Click "Show all scopes" and select:
     - **Marketplace > Manage**
5. Click **Create**
6. **Copy the token immediately** (you won't see it again)

### Step 3: Create Publisher

1. Go to [Visual Studio Marketplace Publisher Management](https://marketplace.visualstudio.com/manage/createpublisher)
2. Create a publisher:
   - **ID:** `devtools-hub` (must match `publisher` in package.json)
   - **Name:** DevTools Hub
   - **Email:** Your email
3. Click **Create**

### Step 4: Update package.json Publisher

Make sure `extensions/vscode/package.json` has the correct publisher:

```json
{
  "publisher": "devtools-hub",
  ...
}
```

### Step 5: First-Time Manual Publish (Optional)

You can test publishing manually first:

```bash
# Install vsce
npm install -g @vscode/vsce

# Build the extension
cd extensions/vscode
npm run build

# Package
vsce package --no-dependencies

# Publish (replace YOUR_PAT with your token)
vsce publish -p YOUR_PAT --no-dependencies
```

### Step 6: Add GitHub Secret

Go to your GitHub repository **Settings > Secrets and variables > Actions** and add:

| Secret Name | Value |
|-------------|-------|
| `VSCE_PAT` | Personal Access Token from Step 2 |

---

## Part 3: CI/CD Workflow

The workflow file `.github/workflows/publish-extensions.yml` is already created.

### Automatic Publishing

Publishing happens automatically when:
- Code is pushed/merged to `main` branch
- Changes are in `extensions/` directory

### Manual Publishing

You can also trigger publishing manually:
1. Go to **Actions** tab in GitHub
2. Select **Publish Extensions** workflow
3. Click **Run workflow**
4. Choose which extensions to publish
5. Click **Run workflow**

---

## Part 4: Required GitHub Secrets Summary

| Secret | Description | Where to get |
|--------|-------------|--------------|
| `CHROME_EXTENSION_ID` | 32-char extension ID | Chrome Web Store dashboard URL |
| `CHROME_CLIENT_ID` | OAuth2 Client ID | Google Cloud Console |
| `CHROME_CLIENT_SECRET` | OAuth2 Client Secret | Google Cloud Console |
| `CHROME_REFRESH_TOKEN` | OAuth2 Refresh Token | `chrome-webstore-upload init` |
| `VSCE_PAT` | Azure DevOps PAT | Azure DevOps > Personal Access Tokens |

---

## Part 5: Version Management

### Bumping Versions

Before publishing updates, bump the version:

**Chrome Extension** (`extensions/chrome/manifest.json`):
```json
{
  "version": "1.0.1"
}
```

**VS Code Extension** (`extensions/vscode/package.json`):
```json
{
  "version": "1.0.1"
}
```

### Semantic Versioning

Use semantic versioning:
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features
- **PATCH** (1.0.0 → 1.0.1): Bug fixes

---

## Troubleshooting

### Chrome Extension

**"The item has been taken down"**
- Check the Chrome Web Store dashboard for policy violations
- Appeal if necessary

**"Invalid manifest"**
- Ensure `manifest.json` is valid JSON
- Check required fields: `manifest_version`, `name`, `version`

### VS Code Extension

**"Personal access token is invalid"**
- Generate a new PAT
- Ensure "Marketplace > Manage" scope is selected

**"Publisher not found"**
- Create the publisher at marketplace.visualstudio.com/manage
- Ensure publisher ID matches package.json

---

## Quick Reference Commands

```bash
# Build Chrome extension
cd extensions/chrome && npm run build

# Package Chrome extension as ZIP
cd extensions/chrome/dist && zip -r ../devtools-hub.zip .

# Build VS Code extension
cd extensions/vscode && npm run build

# Package VS Code extension as VSIX
cd extensions/vscode && vsce package --no-dependencies

# Publish VS Code extension
cd extensions/vscode && vsce publish -p YOUR_PAT --no-dependencies
```
