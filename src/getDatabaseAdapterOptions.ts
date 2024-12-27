import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';

let cached: null | string[] = null;

export const getDatabaseAdapterOptions = async (): Promise<string[]> => {
  if (cached) {
    return cached;
  }
  const dir = path.dirname(vscode.window.activeTextEditor.document.fileName);

  const segments = dir.split(path.sep).reverse();

  for (let i = 0; i < segments.length; i++) {
    if (segments[i] === 'test') {
      const normalizedPath = segments.slice(i).reverse().join(path.sep);
      const generateDbAdapterPath = path.join(normalizedPath, 'generateDatabaseAdapter.ts');

      if (fs.existsSync(generateDbAdapterPath)) {
        const file = fs.readFileSync(generateDbAdapterPath, 'utf8');

        const adapterNames: string[] = [];

        for (const line of file.split('\n')) {
          if (line.includes(': `')) {
            adapterNames.push(line.split(': `')[0].trim().replace(/'/g, '').replace(/"/g, ''));
          }
        }

        cached = adapterNames;

        return adapterNames;
      }
    }
  }

  return ['mongodb', 'postgres', 'sqlite'];
};
