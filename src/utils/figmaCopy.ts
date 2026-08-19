let isScriptLoading = false;
let isScriptLoaded = false;

async function loadFigmaScript(): Promise<boolean> {
  if (isScriptLoaded || typeof (window as any).figma?.captureForDesign === 'function') {
    return true;
  }
  
  if (isScriptLoading) {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if ((window as any).figma?.captureForDesign) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100);
    });
  }

  isScriptLoading = true;
  return new Promise(resolve => {
    const s = document.createElement('script');
    s.src = 'https://mcp.figma.com/mcp/html-to-design/capture.js';
    s.async = true;
    s.onload = () => {
      isScriptLoaded = true;
      isScriptLoading = false;
      resolve(true);
    };
    s.onerror = () => {
      isScriptLoading = false;
      resolve(false);
    };
    document.head.appendChild(s);
  });
}

function extractAllStyles(): string {
  let cssString = '';
  try {
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (rules) {
          for (let j = 0; j < rules.length; j++) {
            cssString += rules[j].cssText + '\n';
          }
        }
      } catch (e) {
        // Safe catch for cross-origin stylesheet security restrictions
        console.warn("Could not read rules from stylesheet:", sheet.href, e);
      }
    }
  } catch (e) {
    console.error("Error extracting document stylesheets:", e);
  }
  return cssString;
}

function sanitizeAndFormatForFigma(rawHtml: string): string {
  // Normalize typography: enforce Inter font and strip OS system fonts
  let cleaned = rawHtml.replace(
    /font-family:[^;}"']*(Segoe UI|-apple-system|BlinkMacSystemFont|system-ui)[^;}"']*/gi,
    "font-family: 'Inter', sans-serif !important"
  );
  
  // Clean font references in CSS rules if applicable
  cleaned = cleaned.replace(/(Segoe UI|-apple-system|BlinkMacSystemFont|system-ui)/gi, "Inter");

  const fontHeader = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      html, body { 
        width: 390px; 
        height: 844px; 
        margin: 0; 
        padding: 0; 
        font-family: 'Inter', sans-serif !important; 
        overflow: hidden; 
        box-sizing: border-box;
      }
      * { 
        font-family: 'Inter', sans-serif !important; 
      }
    </style>`;

  if (cleaned.includes('<head>')) {
    return cleaned.replace('<head>', `<head>${fontHeader}`);
  } else {
    return `<!DOCTYPE html><html><head>${fontHeader}</head><body>${cleaned}</body></html>`;
  }
}

async function copyToClipboard(htmlData: string): Promise<boolean> {
  // Attempt modern navigator.clipboard.write API
  if (navigator.clipboard && navigator.clipboard.write && typeof ClipboardItem !== 'undefined') {
    try {
      const blobHtml = new Blob([htmlData], { type: 'text/html' });
      const blobText = new Blob([htmlData], { type: 'text/plain' });
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText
        })
      ]);
      return true;
    } catch (e) {
      console.warn("navigator.clipboard.write failed, trying listener fallback:", e);
    }
  }

  // Fallback intercept copy listener
  return new Promise((resolve) => {
    let copied = false;
    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData('text/html', htmlData);
        e.clipboardData.setData('text/plain', htmlData);
        copied = true;
      }
    };
    
    document.addEventListener('copy', onCopy);
    try {
      copied = document.execCommand('copy');
    } catch (e) {
      console.error("execCommand('copy') failed:", e);
    }
    document.removeEventListener('copy', onCopy);
    resolve(copied);
  });
}

export async function captureAndCopyToFigma(selector: string): Promise<void> {
  const target = document.querySelector(selector) as HTMLElement;
  if (!target) {
    throw new Error(`Target element "${selector}" not found in DOM.`);
  }

  // Temporarily reset CSS scale transforms on parent nodes to guarantee 1:1 scale capture
  const scaleParents: { el: HTMLElement; transform: string }[] = [];
  let curr: HTMLElement | null = target;
  while (curr && curr !== document.body) {
    const style = window.getComputedStyle(curr);
    if (style.transform && style.transform !== 'none') {
      scaleParents.push({ el: curr, transform: curr.style.transform || style.transform });
      curr.style.transform = 'none';
    }
    curr = curr.parentElement;
  }

  try {
    const loaded = await loadFigmaScript();
    let capturePayload: string | null = null;

    if (loaded && typeof (window as any).figma?.captureForDesign === 'function') {
      const payload = await (window as any).figma.captureForDesign(target);
      if (payload) {
        capturePayload = typeof payload === 'string' ? payload : (payload.html || JSON.stringify(payload));
      }
    }

    // Fallback: extract inline + document styles if official script fails or returns empty
    if (!capturePayload) {
      console.warn("Figma script failed or returned empty payload. Activating CSS extraction fallback.");
      const styles = extractAllStyles();
      capturePayload = `
        <div style="width: 390px; height: 844px; overflow: hidden; position: relative;">
          <style>${styles}</style>
          ${target.outerHTML}
        </div>
      `;
    }

    const finalHtml = sanitizeAndFormatForFigma(capturePayload);
    const success = await copyToClipboard(finalHtml);
    if (!success) {
      throw new Error("Unable to write layout data to system clipboard.");
    }
  } finally {
    // Restore layout preview scale transforms immediately
    scaleParents.forEach(p => {
      p.el.style.transform = p.transform;
    });
  }
}
