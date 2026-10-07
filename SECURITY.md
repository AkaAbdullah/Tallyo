# Security

Tallyo stores business details, client addresses and bank information, so security reports are taken seriously.

**Please don't open a public issue for security problems.** Report them privately through
[GitHub's security advisories](https://github.com/AkaAbdullah/Tallyo/security/advisories/new). Include the steps to reproduce and what an attacker could do. You'll get a reply within a few days.

If you self-host Tallyo:

- Keep `BETTER_AUTH_SECRET` long, random and private. Changing it signs everyone out.
- Restrict your MongoDB user to the Tallyo database.
- Never commit `.env.local`. It is ignored by git for this reason.
