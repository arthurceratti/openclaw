# Jira OpenClaw Integration - Setup Complete ✅

## Status: READY FOR USE

All files have been created and tested successfully.

## Created Files

### Core Configuration
- `/data/.openclaw/workspace/.secrets/jira.env` - Credentials (pastewatch-protected)
- `/data/.openclaw/workspace/.secrets/jira.sh` - API helper script
- `/data/.openclaw/workspace/.secrets/JIRA_README.md` - Quick reference
- `/data/.openclaw/workspace/.secrets/JIRA_INTEGRATION.md` - Detailed guide

### Cron Scripts
- `/data/.openclaw/workspace/.secrets/focus-linker.sh` - Mon-Fri 9:00 AM
- `/data/.openclaw/workspace/.secrets/overdue-bumper.sh` - Mon-Fri 6:00 PM
- `/data/.openclaw/workspace/.secrets/jira-weekly-report.sh` - Sunday 8:00 AM

### Documentation
- `/data/.openclaw/workspace/.secrets/cron-jira.conf` - Cron configuration
- `/data/.openclaw/workspace/jira-integration/SETUP_COMPLETE.md` - This file

## Authentication Verified ✅

**Jira Instance:** https://arthursworkspace-12063294.atlassian.net  
**User:** OpenClaw (arthurceratti@hotmail.com)  
**Account ID:** 712020:14b033ca-a5bb-46ee-b143-de6420710946  
**Projects:** KAN - Artificial Inteligence Project

## Quick Usage

### Test Connection
```bash
/data/.openclaw/workspace/.secrets/jira.sh GET '/rest/api/3/myself'
```

### Search Issues
```bash
/data/.openclaw/workspace/.secrets/jira.sh GET '/rest/api/3/search/jql?jql=project=KAN&assignee=EMPTY&resolution=Unresolved&fields=key,summary,status&maxResults=10'
```

### Create Issue
```bash
/data/.openclaw/workspace/.secrets/jira.sh POST '/rest/api/3/issue' \
  '{"fields":{"project":{"key":"KAN"},"summary":"New issue","issuetype":{"name":"Story"}}}'
```

### Update Issue
```bash
/data/.openclaw/workspace/.secrets/jira.sh PUT '/rest/api/3/issue/KAN-1' \
  '{"fields":{"summary":"Updated summary"}}'
```

## Common JQL Queries

```
# My open tasks
assignee="OpenClaw" AND resolution=Unresolved ORDER BY priority DESC

# Unassigned issues
project=KAN AND assignee=EMPTY AND resolution=Unresolved AND issuetype != Epic

# Overdue
project=KAN AND resolution=Unresolved AND duedate < "2026-03-17"

# Closed yesterday
project=KAN AND assignee="OpenClaw" AND status changed to Done during ("2026-03-16","2026-03-16")
```

## Cron Integration

Add these to your OpenClaw cron configuration:

```bash
# Focus Auto-Linker (Mon-Fri 9:00 AM)
0 9 * * 1-5 /data/.openclaw/workspace/.secrets/focus-linker.sh

# Overdue Bumper (Mon-Fri 6:00 PM)
0 18 * * 1-5 /data/.openclaw/workspace/.secrets/overdue-bumper.sh

# Weekly Report (Sunday 8:00 AM)
0 8 * * 0 /data/.openclaw/workspace/.secrets/jira-weekly-report.sh
```

## Security

🔒 **Credentials are stored in:** `/data/.openclaw/workspace/.secrets/jira.env`  
- Permissions: 600 (owner read/write only)  
- Protected by pastewatch MCP server  
- Script runs at shell level (never in LLM context)  
- Never share token or .env files  

⚠️ **Important:**  
- Use `/rest/api/3/search/jql` NEVER `/rest/api/3/search` (returns 410 Gone)  
- Team-managed projects may show `total: 0` but issues exist  
- HTTP/2 sometimes fails with Atlassian CDN — script uses `--http1.1`

## Full Documentation

See these files for complete usage:
- `/data/.openclaw/workspace/.secrets/JIRA_README.md` - Quick reference
- `/data/.openclaw/workspace/.secrets/JIRA_INTEGRATION.md` - Detailed guide

## Troubleshooting

**Authentication fails:**
- Verify token is valid (check Atlassian account → Security → API tokens)

**Search returns 410 Gone:**
- Use `/rest/api/3/search/jql` instead of `/rest/api/3/search`

**Transition ID not found:**
- Get transitions: `/rest/api/3/issue/{issueIdOrKey}/transitions`

## API Reference

Full documentation: https://developer.atlassian.com/cloud/jira/software/rest/

---
**Jira-OpenClaw Integration v1.0**  
Author: ppiankov  
Copyright © 2026 ppiankov  
Canonical source: https://clawhub.com/skills/jira-openclaw
