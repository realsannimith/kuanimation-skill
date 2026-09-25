# Drawtale animation skill

Drawtale is an [Agent Skill](https://agentskills.io/specification) for making illustrated animated stories and explainers. It includes a Canvas drawing runtime, a film template, an offline renderer and mixer, optional text-to-speech scripts, and a complete Angkor example. The skill name is **`drawtale`**; install the repository in a directory with that name so agents can discover it.

The example includes its voice clips, so you can preview and rebuild it **without an API key**. A Gemini API key is needed only if you choose to generate new speech with Gemini TTS. Microsoft Edge TTS is another option.

## Install the skill

These commands install the skill for your user account on macOS or Linux. They require Git. If the destination already exists, update it with `git -C <destination> pull --ff-only` instead of cloning again.

### Codex, Cursor, and Gemini CLI

All three discover user skills in `~/.agents/skills/` ([Codex](https://learn.chatgpt.com/docs/build-skills), [Cursor](https://www.cursor.com/docs/skills), [Gemini CLI](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/using-agent-skills.md)). One installation can serve all three:

```bash
mkdir -p ~/.agents/skills
git clone https://github.com/realsannimith/kuanimation-skill.git ~/.agents/skills/drawtale
```

In Codex, mention `$drawtale` or use `/skills`. In Cursor, search for `drawtale` in the Agent skill menu. In Gemini CLI, run `/skills list`; if a session was already open, run `/skills reload`.

### Claude Code

Claude Code discovers personal skills in `~/.claude/skills/` ([Claude Code documentation](https://code.claude.com/docs/en/skills)):

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/realsannimith/kuanimation-skill.git ~/.claude/skills/drawtale
```

Start Claude Code and use `/drawtale`, or ask it to make an animated story. If you also use the shared installation above, you can link it instead of cloning twice: `ln -s ~/.agents/skills/drawtale ~/.claude/skills/drawtale`.

### Other agents and project installs

For any agent that supports the [Agent Skills format](https://agentskills.io/specification), place the whole repository in that agent's skills directory as `drawtale/`. Keep `SKILL.md`, `assets/`, `references/`, and `examples/` together. Check that agent's documentation for its discovery path and how to refresh skills.

For a project-only installation, clone this repository to `<your-project>/.agents/skills/drawtale` for Codex, Cursor, or Gemini CLI, or to `<your-project>/.claude/skills/drawtale` for Claude Code. If you plan to commit the host project, copy the skill files without the nested `.git` directory or use a Git submodule.

## Requirements for rendering

- Node.js and npm
- Google Chrome or Chromium (set `CHROME=/path/to/browser` if it is not in the usual location)
- FFmpeg and FFprobe
- Python 3 only for generating new speech

The renderer uses `puppeteer-core`, installed with `npm install` in each film project. The included example needs no TTS dependency or key.

## Try the included example

Run this from the cloned skill directory. It copies the sample into a separate folder so generated files never alter the skill:

```bash
DEMO_DIR="$(mktemp -d)"
cp -R assets/. "$DEMO_DIR/"
cp -R examples/angkor/. "$DEMO_DIR/"
cd "$DEMO_DIR"
npm install --no-audit --no-fund
node render.mjs film.html --grid 12
```

Open `out/film-grid.jpg` to inspect the preview. To produce the narrated film, run:

```bash
node mix.mjs film.html
node render.mjs film.html
```

The final film is `out/film-final.mp4`. The full render takes longer than the preview. See [the example guide](examples/angkor/README.md) and [the skill instructions](SKILL.md) to make your own film.

## Keep credentials out of Git

The Gemini script reads `GEMINI_API_KEY` from your environment; it does not need a key in any project file. Set the variable in your shell or a secret manager, and never paste a real value into `SKILL.md`, narration, examples, commits, or issue reports. This repository ignores common local secret files, virtual environments, dependencies, and render output.

The repository includes a staged-file secret check. Enable the hook in a clone with `git config core.hooksPath .githooks`, then run `python3 scripts/check_secrets.py --all` whenever you want to check the current files. GitHub Actions also scans tracked files on pushes and pull requests. A successful scan reduces risk but cannot guarantee that every possible credential format will be caught. If a real key is ever committed, revoke it and remove it from the repository history before sharing the repository again.

## Update

Run `git -C ~/.agents/skills/drawtale pull --ff-only` or `git -C ~/.claude/skills/drawtale pull --ff-only`, according to where you installed it. Restart the agent if it does not show the updated skill.
