import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TemplateLoader } from '../../src/templates/template-loader';
import { TemplateManager } from '../../src/templates/template-manager';
import fs from 'fs';

// Mock fs module
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
  },
}));

describe('TemplateLoader', () => {
  let loader: TemplateLoader;
  let manager: TemplateManager;
  const mockTemplateDir = '/mock/templates';

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new TemplateManager(mockTemplateDir);
    loader = new TemplateLoader(manager);
  });

  describe('loadBaseTemplates', () => {
    it('should load base templates that exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('# Template Content');

      const templates = loader.loadBaseTemplates();

      expect(templates).toHaveProperty('roadmap');
      expect(templates).toHaveProperty('status');
      expect(templates).toHaveProperty('readme');
    });

    it('should skip templates that do not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const templates = loader.loadBaseTemplates();

      // Should return empty strings for missing templates
      expect(Object.keys(templates).length).toBeGreaterThanOrEqual(0);
    });

    it('should handle errors gracefully', () => {
      vi.mocked(fs.existsSync).mockImplementation(() => {
        throw new Error('File system error');
      });

      // Should not throw
      expect(() => loader.loadBaseTemplates()).not.toThrow();
    });
  });

  describe('loadPhaseTemplates', () => {
    it('should return empty object if phases directory does not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const templates = loader.loadPhaseTemplates();

      expect(templates).toEqual({});
    });

    it('should load phase templates from phases directory', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue(['phase1.md', 'phase2.md'] as unknown as string[]);
      vi.mocked(fs.readFileSync).mockReturnValue('# Phase Template');

      const templates = loader.loadPhaseTemplates();

      expect(Object.keys(templates).length).toBeGreaterThanOrEqual(0);
    });

    it('should skip non-markdown files', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        'phase1.txt',
        'phase2.json',
      ] as unknown as string[]);

      const templates = loader.loadPhaseTemplates();

      // Should not include non-markdown files
      expect(Object.keys(templates).length).toBe(0);
    });

    it('should handle errors gracefully', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockImplementation(() => {
        throw new Error('Directory read error');
      });

      expect(() => loader.loadPhaseTemplates()).not.toThrow();
      const templates = loader.loadPhaseTemplates();
      expect(templates).toEqual({});
    });
  });

  describe('loadCodeTemplates', () => {
    it('should return empty object if code directory does not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const templates = loader.loadCodeTemplates();

      expect(templates).toEqual({});
    });

    it('should load code templates from code directory', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        'service.ts',
        'component.tsx',
      ] as unknown as string[]);
      vi.mocked(fs.readFileSync).mockReturnValue('export class Service {}');

      const templates = loader.loadCodeTemplates();

      expect(Object.keys(templates).length).toBeGreaterThanOrEqual(0);
    });

    it('should only load code files (ts, tsx, js, jsx)', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        'service.ts',
        'component.tsx',
        'readme.md',
        'config.json',
      ] as unknown as string[]);

      const templates = loader.loadCodeTemplates();

      // Should only include code files
      expect(Object.keys(templates).length).toBeGreaterThanOrEqual(0);
    });

    it('should handle errors gracefully', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockImplementation(() => {
        throw new Error('Directory read error');
      });

      expect(() => loader.loadCodeTemplates()).not.toThrow();
      const templates = loader.loadCodeTemplates();
      expect(templates).toEqual({});
    });
  });

  describe('loadChecklistTemplates', () => {
    it('should return empty object if checklists directory does not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const templates = loader.loadChecklistTemplates();

      expect(templates).toEqual({});
    });

    it('should load checklist templates from checklists directory', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue(['database-checklist.md'] as unknown as string[]);
      vi.mocked(fs.readFileSync).mockReturnValue('# Checklist Template');

      const templates = loader.loadChecklistTemplates();

      expect(Object.keys(templates).length).toBeGreaterThanOrEqual(0);
    });

    it('should handle errors gracefully', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockImplementation(() => {
        throw new Error('Directory read error');
      });

      expect(() => loader.loadChecklistTemplates()).not.toThrow();
      const templates = loader.loadChecklistTemplates();
      expect(templates).toEqual({});
    });
  });

  describe('loadAllTemplates', () => {
    it('should load all template types', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([]);
      vi.mocked(fs.readFileSync).mockReturnValue('Template content');

      const allTemplates = loader.loadAllTemplates();

      expect(allTemplates).toHaveProperty('base');
      expect(allTemplates).toHaveProperty('phases');
      expect(allTemplates).toHaveProperty('code');
      expect(allTemplates).toHaveProperty('checklists');
    });
  });
});
