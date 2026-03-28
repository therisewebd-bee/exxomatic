const fs = require('fs');
const path = require('path');
const mjml2html = require('mjml');
const Handlebars = require('handlebars');

const TEMPLATES_DIR = path.join(__dirname, '../../server/src/services/notification/email/templates');
const OUTPUT_FILE = path.join(__dirname, '../src/templates.js');

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`Compiling MJML templates from ${TEMPLATES_DIR}...`);

let templatesCode = 'export const templates = {\n';
const files = fs.readdirSync(TEMPLATES_DIR);
let count = 0;

files.forEach(file => {
    if (path.extname(file) === '.mjml') {
        const templateName = path.basename(file, '.mjml');
        const filePath = path.join(TEMPLATES_DIR, file);
        const mjmlContent = fs.readFileSync(filePath, 'utf8');

        try {
            const { html, errors } = mjml2html(mjmlContent, {
                filePath: filePath,
                validationLevel: 'soft'
            });

            if (errors && errors.length > 0) {
                console.warn(`Warnings for ${file}:`, errors);
            }

            // Precompile the HTML to a Handlebars spec
            const precompiled = Handlebars.precompile(html);
            templatesCode += `    "${templateName}": ${precompiled},\n`;

            console.log(`✓ Compiled ${file}`);
            count++;
        } catch (error) {
            console.error(`Error compiling ${file}:`, error);
        }
    }
});

templatesCode += '};\n';

const typeDefContent = `// Auto-generated file. Do not edit manually.
export declare const templates: {
    [key: string]: any;
};
`;

fs.writeFileSync(OUTPUT_FILE, templatesCode);
fs.writeFileSync(OUTPUT_FILE.replace('.js', '.d.ts'), typeDefContent);
console.log(`Successfully compiled ${count} templates to ${OUTPUT_FILE} and generated types`);
