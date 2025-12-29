import type { AuditResult, DetailItem } from './types';

interface SchemaData {
    type: string;
    properties: string[];
}

export function analyzeSchemaMarkup(doc: Document): AuditResult {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const details: DetailItem[] = [];

    const schemas: SchemaData[] = [];
    let hasJsonLd = false;
    let hasMicrodata = false;

    // Check for JSON-LD
    try {
        const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');

        jsonLdScripts.forEach((script) => {
            hasJsonLd = true;
            try {
                const content = script.textContent || '';
                const parsed = JSON.parse(content);

                const extractTypes = (obj: any): void => {
                    if (Array.isArray(obj)) {
                        obj.forEach(extractTypes);
                    } else if (obj && typeof obj === 'object') {
                        if (obj['@type']) {
                            const types = Array.isArray(obj['@type']) ? obj['@type'] : [obj['@type']];
                            types.forEach((type: string) => {
                                schemas.push({
                                    type,
                                    properties: Object.keys(obj).filter(k => !k.startsWith('@')),
                                });
                            });
                        }
                        Object.values(obj).forEach(extractTypes);
                    }
                };

                extractTypes(parsed);
            } catch {
                issues.push('Invalid JSON-LD found - contains syntax errors');
            }
        });
    } catch {
        // Query failed
    }

    // Check for Microdata
    try {
        const microdataElements = doc.querySelectorAll('[itemscope]');
        if (microdataElements.length > 0) {
            hasMicrodata = true;
            microdataElements.forEach((el) => {
                const itemType = el.getAttribute('itemtype') || 'Unknown';
                const typeName = itemType.split('/').pop() || 'Unknown';
                const props = el.querySelectorAll('[itemprop]');
                schemas.push({
                    type: `Microdata: ${typeName}`,
                    properties: Array.from(props).map(p => p.getAttribute('itemprop') || '').filter(Boolean),
                });
            });
        }
    } catch {
        // Query failed
    }

    // Build details
    details.push({
        label: 'JSON-LD Present',
        value: hasJsonLd ? 'Yes' : 'No',
        status: hasJsonLd ? 'pass' : 'warning'
    });
    details.push({
        label: 'Microdata Present',
        value: hasMicrodata ? 'Yes' : 'No',
        status: 'pass' // Microdata is optional
    });
    details.push({
        label: 'Schema Types Found',
        value: schemas.length,
        status: schemas.length > 0 ? 'pass' : 'warning'
    });

    // Common schema types
    const schemaTypes = schemas.map(s => s.type);
    const hasOrganization = schemaTypes.some(t => t.includes('Organization') || t.includes('LocalBusiness'));
    const hasWebsite = schemaTypes.some(t => t.includes('WebSite') || t.includes('WebPage'));
    const hasBreadcrumb = schemaTypes.some(t => t.includes('BreadcrumbList'));

    details.push({ label: 'Organization/Business Schema', value: hasOrganization ? 'Yes' : 'No', status: hasOrganization ? 'pass' : 'warning' });
    details.push({ label: 'WebSite/WebPage Schema', value: hasWebsite ? 'Yes' : 'No', status: hasWebsite ? 'pass' : 'warning' });
    details.push({ label: 'Breadcrumb Schema', value: hasBreadcrumb ? 'Yes' : 'No', status: 'pass' });

    // Calculate score
    let score = 50; // Start at 50 since schema is enhancement

    if (hasJsonLd || hasMicrodata) {
        score += 25;
    } else {
        issues.push('No structured data found');
        suggestions.push('Add JSON-LD structured data to improve search appearance');
    }

    if (hasOrganization) score += 10;
    if (hasWebsite) score += 10;
    if (hasBreadcrumb) score += 5;

    if (!hasOrganization && (hasJsonLd || hasMicrodata)) {
        suggestions.push('Add Organization or LocalBusiness schema for brand visibility');
    }

    if (!hasWebsite && (hasJsonLd || hasMicrodata)) {
        suggestions.push('Add WebSite schema with SearchAction for sitelinks search box');
    }

    score = Math.min(100, score);

    const schemaTypesStr = schemas.length > 0
        ? schemas.map(s => s.type).slice(0, 5).join(', ')
        : 'None detected';

    return {
        module: 'Schema Markup',
        status: score >= 80 ? 'pass' : score >= 50 ? 'warning' : 'fail',
        score,
        priority: 'medium',
        category: 'technical',
        summary: `Schema types: ${schemaTypesStr}`,
        issues,
        suggestions,
        details,
        data: { schemas },
    };
}
