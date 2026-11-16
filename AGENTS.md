# AGENTS.md: irara-irt-templates

The guide to this repo for anyone changing it, person or coding tool. Read it before changing an
email.

## What this repo is

The email templates for the IRARA IRT API, which lives in its own repo,
[`Rocketmakers/irara-irt`](https://github.com/Rocketmakers/irara-irt). Each email is a **layout**:
a Handlebars HTML and plain-text pair, generated from react-email source, with a payload model and
a JSON schema for that payload.

The API fetches the layouts at runtime from this repo's `main`, in every environment, local and
production alike. It caches them, and refreshes the cache when it starts and every hour after. So:

- A merge into `main` changes production's emails within the hour, with no deploy.
- A template change and the API change that sends it are two PRs in two repos, merged at
  different times. Each must work with the other side as it is deployed in between
  ([Safe changes](#safe-changes)).

## Reality check

1. **`README.md` and `docs/` are the starter template's generic docs.** They describe `production`
   and `test` branches, SendGrid, and a `POST /templates/update` endpoint. None of that applies
   here. Where they differ from this file, this file is right.
2. **The API renders in Handlebars strict mode**, as the tests do. A `{{field}}` the payload doesn't
   carry fails the whole email: nothing is sent. Use an optional field only inside
   `{{#if field}}...{{/if}}`, which is safe when it is missing.
3. **CI doesn't check `payloadSchema.json` or formatting.** It checks the `.handlebars` files are
   current, but a stale payload schema passes CI and then validates the API's payloads wrongly in
   production. Regenerate it yourself ([step 4](#changing-or-adding-a-layout)).
4. **The repo is public**, and must stay so: the API fetches the layouts from
   `raw.githubusercontent.com` with no credentials. Never commit anything that isn't meant to be
   public.

## How the repo works

- `resend.json` registers each layout:
  `"<layoutId>": { "path": "layouts/<layoutId>", "templates": ["html", "txt"] }`. The API renders a
  layout by that id.
- `layouts/<layoutId>/`:
  - `model.ts`: `IModel`, the payload, and `sampleData`, the payloads the tests render.
  - `payloadSchema.json`: generated from `IModel`, with `sampleData` as its `examples`. The API
    validates every payload against it, and a payload that fails isn't sent. Fields it doesn't list
    are allowed.
  - `html.handlebars` and `txt.handlebars`: generated from the react-email source. Never edit them
    by hand.
- `packages/typescript-scripts/emails/src/emails/`: `index.ts` calls
  `generate("<layoutId>", { ... })` for each layout, with its copy and its `{{field}}`
  placeholders. `base.tsx` (its `IBaseEmailProps` lists what a layout can have) and `styles.ts` are
  the shared design.
- `packages/typescript-scripts/core/`: the `compile-layouts` script.
- `assets/`: images the emails link to. They load from `main` on `raw.githubusercontent.com`.
- The subject line isn't in this repo: the API sets it when it sends.
- CI (`.github/workflows/main.yml`, on every PR and on `main`): ESLint, the scripts' build,
  regenerating the emails with nothing left to commit, and `test-templates` for `resend`.

Node and pnpm versions are in `.tool-versions`, which CI installs with asdf.

## Changing or adding a layout

1. **Copy and design.** Edit the layout's `generate(...)` call in `index.ts`, or add one for a new
   layout. A shared design change goes in `base.tsx` or `styles.ts`, and changes every layout.
2. **Payload.** Edit `IModel` and `sampleData` in `layouts/<layoutId>/model.ts`. A new layout
   copies an existing layout's `model.ts`. The first `sampleData` entry holds every field,
   optional ones included, since the screenshots render only that one. When the layout has optional
   fields, add an entry without them too, so the tests render the fallbacks.
3. **Register** a new layout in `resend.json`.
4. **Regenerate and check**, from the checkout root:

   ```bash
   pnpm install
   pnpm turbo run build --filter=@repo/typescript-scripts*
   pnpm turbo generate-emails                      # rewrites layouts/*/html.handlebars and txt.handlebars
   pnpm gen-payload-schemas --serviceNames=resend  # rewrites layouts/*/payloadSchema.json
   pnpm test-templates --serviceNames=resend       # every registered layout renders every sampleData entry
   pnpm format-fix && pnpm turbo lint
   ```

   This reproduces every check CI runs, and adds the payload schemas and formatting, which CI
   doesn't check. The tests read `sampleData` from `payloadSchema.json`, so they run after
   `gen-payload-schemas`. When `format-fix` rewrites a file your change doesn't touch, leave it out
   of your change.

   Commit the regenerated files with their source: CI fails when `generate-emails` leaves a diff.
   Read the generated `html.handlebars` and `txt.handlebars` diffs, since they are what is sent.

A conflicted generated file (`html.handlebars`, `txt.handlebars`, `payloadSchema.json`) is never
merged by hand: take either side, then regenerate it with step 4.

## Screenshots

After step 4, screenshot the HTML of every layout the change adds or alters. A shared design change
alters every layout. `compile-layouts` renders each registered layout with its first `sampleData`
entry, read from its `payloadSchema.json`, into `compiledLayouts/<layoutId>.html` and
`compiledLayouts/<layoutId>.txt`, which are gitignored. Playwright then captures each one. This
repo has no Playwright of its own, so `pnpm dlx` fetches it:

```bash
pnpm compile-layouts -- --serviceName=resend
rm -rf ../screenshots && mkdir -p ../screenshots
pnpm dlx playwright install chromium   # a no-op once installed
pnpm dlx playwright screenshot --full-page --viewport-size=800,900 \
  "file://$PWD/compiledLayouts/<layoutId>.html" ../screenshots/1-<layoutId>.png
```

The screenshots go outside the checkout, so they are never committed. Name each one after its
layout id, numbered `1-`, `2-` and so on in the order a reviewer should see them. Look at every
image before you use it: a blank page, or raw `{{field}}` text, means the render failed. Images
such as the logo load from `main`, so an asset added on your branch shows as broken until it
merges. Say so rather than treating it as a failure.

## Safe changes

This is the release rule. Every environment reads `main` at runtime, production included, and a
merge is live within the hour. So every change must work with the API deployed now, and with the
API about to ship, because the two merge apart. Match the payload the API sends: field names,
types, and which are optional.

| Change                                                             | Safe?                                                                                                                                         |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Copy or design, using fields the API already sends                 | Yes                                                                                                                                           |
| A new layout                                                       | Yes: nothing sends it until the API that does deploys                                                                                         |
| A new optional field (`field?:`), used only inside `{{#if field}}` | Yes                                                                                                                                           |
| An optional field used outside `{{#if}}`                           | No: a payload without it fails to render, and the email isn't sent                                                                            |
| A new required field on an existing layout                         | No: the deployed API's payloads fail the schema. Make it optional, or add a new layout                                                        |
| Renaming or retyping a field                                       | No: add the new field as optional beside the old one, make the old one optional, and render whichever the payload has. Drop the old one later |
| Removing a field from a layout                                     | Yes: the schema allows fields it doesn't list, so the API's payloads still pass                                                               |
| Removing a layout                                                  | Only after the API that stops sending it has deployed                                                                                         |
| Renaming a layout id                                               | No: add a layout under the new id, and remove the old one later, as above                                                                     |

A change that isn't safe is made the safe way, or split into a later change. It never ships as it
is.

## Merge order with the API

- A templates PR merges **before** the API PR that sends what it adds: a new layout, or a new
  field.
- A templates PR that stops using a field merges before the API stops sending it.
- A templates PR that removes a layout, or the old field of a rename, waits until the API that
  stops using it has deployed to every environment.
- Copy and design changes don't depend on the API: merge them when they are ready.

## What a change owns

A change to an email's copy or layout is a PR into this repo's `main`, never into a
`Rocketmakers/irara-irt` branch, even when the API's side of it is on a feature branch there. It
owns:

- `layouts/<layoutId>/`: `model.ts`, and the generated `payloadSchema.json`, `html.handlebars` and
  `txt.handlebars`
- the react-email source in `packages/typescript-scripts/emails/src/emails/`
- `resend.json` and `assets/`

It leaves the tooling, CI and dependencies alone unless that is what it is for.

## The API's side

The API's side is in `Rocketmakers/irara-irt`: `sendTemplatedEmail` in
`apps/api/src/shared/handlers.ts`, and its callers, name the layout, build its payload and set the
subject. Before changing a layout's fields, read them there, at the branch of the API change when
there is one. irara-irt's `_docs/email-templates.md` covers that side, including sending a
templates branch's emails from a local irara-irt stack. This repo runs no stack of its own.

## Pull requests

The PR template (`.github/pull_request_template.md`) has headings that say "MR", as in **What does
this MR do?**: keep them as they are.

- **How can the reviewer test this?** Name each changed layout, the fields its payload takes, and
  how to send it from the app. Say that a local irara-irt stack can send this branch's emails.
- **Screenshots (if applicable).** One per layout added or changed, listed as
  `` `<file name>`: <layoutId>, <what it shows> ``.

## Dependency updates

Renovate runs from `.github/workflows/renovate.yaml` on weekdays, configured by `renovate.json`.
npm updates come as two grouped PRs, "Major packages" and "Non-major packages", and wait for review.
GitHub Actions minor and patch updates merge themselves once CI passes.

To fix a Renovate PR, check out its branch and run step 4 of
[Changing or adding a layout](#changing-or-adding-a-layout): it is the gate, and reproduces every
check CI runs. A dependency update that changes the generated `.handlebars` files changes what
every environment sends once it merges. Commit them with it, and say so in the PR body, with what
changed.

## Commits

Commit messages are conventional commits, `<type>(<scope>): <Subject>`, with the subject
capitalised, as in `feat(survey): Add the surveyInvitation email layout`. The types are in
`.commit-config.js`. The husky `prepare-commit-msg` hook opens commitizen's prompt when there is a
terminal, and does nothing otherwise.
