import json

out = open('history.txt', 'w')
with open('/Users/yanpeizhi/.gemini/antigravity-cli/brain/38e55eb1-5190-4eb7-a8c7-3f42bca6bf88/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
        except: continue
        
        if data.get('type') == 'PLANNER_RESPONSE':
            calls = data.get('tool_calls', [])
            for c in calls:
                if c['name'] in ('replace_file_content', 'write_to_file') and 'index.html' in c['args'].get('TargetFile', ''):
                    out.write(f"=== {c['name']} ===\n")
                    if c['name'] == 'write_to_file':
                        out.write(c['args']['CodeContent'] + '\n')
                    else:
                        out.write(c['args']['ReplacementContent'] + '\n')
        
out.close()
