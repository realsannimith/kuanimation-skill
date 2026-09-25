#!/usr/bin/env python3
"""Reject common credentials in tracked or staged files without printing values."""

import argparse
import re
import subprocess
import sys


PATTERNS = {
    "Google API key": rb"AIza[0-9A-Za-z_-]{30,}",
    "OpenAI or Anthropic API key": rb"(?:sk-proj-|sk-ant-|sk-)[A-Za-z0-9_-]{20,}",
    "AWS access key": rb"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b",
    "GitHub token": rb"\b(?:ghp_|gho_|ghu_|ghs_|ghr_|github_pat_)[A-Za-z0-9_]{20,}",
    "GitLab token": rb"\bglpat-[A-Za-z0-9_-]{20,}",
    "Slack token": rb"\bxox[baprs]-[A-Za-z0-9-]{10,}",
    "Stripe secret key": rb"\b(?:sk_live_|rk_live_)[A-Za-z0-9]{10,}",
    "Private key block": rb"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----",
    "Bearer token": rb"(?i)\bBearer\s+[A-Za-z0-9._~+/-]{20,}",
    "Credential in URL": rb"(?i)[?&](?:api[_-]?key|token|access_token|client_secret|password|secret)=[^&#\s]{8,}",
    "Credential assignment": rb"(?i)\b(?:[a-z0-9_]*api[_-]?key|[a-z0-9_]*secret|[a-z0-9_]*token|password|passwd|access[_-]?key)\b\s*[:=]\s*['\"]?[A-Za-z0-9_+./=-]{20,}",
}

SENSITIVE_NAMES = re.compile(
    r"(?i)(?:^|/)(?:\.env(?:\..*)?|credentials\.json|service-account[^/]*\.json|"
    r"id_(?:rsa|ed25519)[^/]*|[^/]+\.(?:pem|key|p12|pfx|jks|keystore))$"
)


def git(*args):
    return subprocess.check_output(["git", *args])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--staged", action="store_true", help="check files in the Git index")
    group.add_argument("--all", action="store_true", help="check all tracked files")
    args = parser.parse_args()

    if args.staged:
        names = git("diff", "--cached", "--name-only", "-z", "--diff-filter=ACMRT")
    else:
        names = git("ls-files", "-z", "--cached")

    findings = []
    files = [n.decode("utf-8", "surrogateescape") for n in names.split(b"\0") if n]
    for name in files:
        if SENSITIVE_NAMES.search(name):
            findings.append(f"{name}: sensitive filename")
        try:
            data = git("show", f":{name}") if args.staged else open(name, "rb").read()
        except (OSError, subprocess.CalledProcessError) as exc:
            findings.append(f"{name}: could not read ({type(exc).__name__})")
            continue
        for label, pattern in PATTERNS.items():
            for match in re.finditer(pattern, data):
                line = data.count(b"\n", 0, match.start()) + 1
                findings.append(f"{name}:{line}: possible {label}")

    for finding in findings:
        print(finding, file=sys.stderr)
    if findings:
        print(f"Secret check failed: {len(findings)} finding(s). No values were printed.", file=sys.stderr)
        return 1
    print(f"Secret check passed: {len(files)} file(s) scanned.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
