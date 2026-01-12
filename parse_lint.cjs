const fs = require('fs');
const content = fs.readFileSync('lint_final.json', 'utf8');
const jsonStart = content.indexOf('[');
if (jsonStart !== -1) {
    const json = content.substring(jsonStart);
    try {
        const results = JSON.parse(json);
        let errorCount = 0;
        results.forEach(result => {
            if (result.messages.length > 0) {
                console.log(`File: ${result.filePath}`);
                result.messages.forEach(msg => {
                    console.log(`  ${msg.line}:${msg.column} [${msg.severity === 2 ? 'ERROR' : 'WARN'}] ${msg.ruleId} - ${msg.message}`);
                    if (msg.severity === 2) errorCount++;
                });
            }
        });
        console.log(`Total Errors: ${errorCount}`);
    } catch (e) {
        console.error("Failed to parse JSON", e);
        console.log("Raw content snippet:", content.substring(0, 500));
    }
} else {
    console.log("No JSON found");
    console.log(content);
}
