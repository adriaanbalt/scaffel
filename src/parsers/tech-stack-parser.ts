/**
 * Tech stack parser
 */

export interface TechStack {
  framework?: 'nextjs' | 'react' | 'vue' | 'angular' | 'express' | 'fastify' | 'nest';
  backend?: 'supabase' | 'firebase' | 'custom';
  database?: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite';
  language?: 'typescript' | 'javascript';
  styling?: 'tailwind' | 'css' | 'styled-components';
}

export class TechStackParser {
  parse(input: {
    framework?: string;
    backend?: string;
    database?: string;
    language?: string;
    styling?: string;
  }): TechStack {
    return {
      framework: this.parseFramework(input.framework),
      backend: this.parseBackend(input.backend),
      database: this.parseDatabase(input.database),
      language: this.parseLanguage(input.language),
      styling: this.parseStyling(input.styling),
    };
  }

  parseFromString(stackString: string): TechStack {
    const parts = stackString.split(',').map((s) => s.trim().toLowerCase());
    const stack: Partial<TechStack> = {};

    for (const part of parts) {
      if (['nextjs', 'react', 'vue', 'angular'].includes(part)) {
        stack.framework = part as TechStack['framework'];
      } else if (['supabase', 'firebase', 'custom'].includes(part)) {
        stack.backend = part as TechStack['backend'];
      } else if (['postgresql', 'mysql', 'mongodb', 'sqlite'].includes(part)) {
        stack.database = part as TechStack['database'];
      } else if (['typescript', 'javascript'].includes(part)) {
        stack.language = part as TechStack['language'];
      } else if (['tailwind', 'css', 'styled-components'].includes(part)) {
        stack.styling = part as TechStack['styling'];
      }
    }

    return this.parse(stack);
  }

  private parseFramework(framework?: string): TechStack['framework'] {
    const valid = ['nextjs', 'react', 'vue', 'angular', 'express', 'fastify', 'nest'];
    if (framework && valid.includes(framework.toLowerCase())) {
      return framework.toLowerCase() as TechStack['framework'];
    }
    return 'nextjs'; // Default
  }

  private parseBackend(backend?: string): TechStack['backend'] {
    const valid = ['supabase', 'firebase', 'custom'];
    if (backend && valid.includes(backend.toLowerCase())) {
      return backend.toLowerCase() as TechStack['backend'];
    }
    return 'supabase'; // Default
  }

  private parseDatabase(database?: string): TechStack['database'] {
    const valid = ['postgresql', 'mysql', 'mongodb', 'sqlite'];
    if (database && valid.includes(database.toLowerCase())) {
      return database.toLowerCase() as TechStack['database'];
    }
    return 'postgresql'; // Default
  }

  private parseLanguage(language?: string): TechStack['language'] {
    const valid = ['typescript', 'javascript'];
    if (language && valid.includes(language.toLowerCase())) {
      return language.toLowerCase() as TechStack['language'];
    }
    return 'typescript'; // Default
  }

  private parseStyling(styling?: string): TechStack['styling'] {
    const valid = ['tailwind', 'css', 'styled-components'];
    if (styling && valid.includes(styling.toLowerCase())) {
      return styling.toLowerCase() as TechStack['styling'];
    }
    return 'tailwind'; // Default
  }
}

