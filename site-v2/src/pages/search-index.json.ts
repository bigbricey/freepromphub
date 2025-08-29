import fs from 'node:fs';
import path from 'node:path';

export async function GET() {
  const root = path.join(import.meta.dirname, '..', 'data', 'prompts');
  const items: any[] = [];
  function walk(dir: string, category?: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full, e.name);
      else if (e.isFile() && e.name.endsWith('.json')) {
        try {
          const raw = fs.readFileSync(full, 'utf8');
          const data = JSON.parse(raw);
          items.push({
            title: data.title,
            description: data.description || '',
            tags: data.tags || [],
            category: data.category || category || '',
            url: `/prompts/${data.category || category}/${data.slug}`
          });
        } catch {}
      }
    }
  }
  if (fs.existsSync(root)) walk(root);
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
}

