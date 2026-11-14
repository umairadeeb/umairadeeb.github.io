# Spec Delta

## Purpose

Defines `_data/profile.yml` as the single editable source of CV content so the owner can update the site without touching layout, style or script code.

## ADDED Requirements

### Requirement: Single YAML content source
The site SHALL render all CV content (identity, about text, metrics, projects, roles, skills, education, links, footer date) from `_data/profile.yml`. `_config.yml` SHALL contain only site settings and no CV content.

#### Scenario: Edit text in YAML
- **WHEN** the owner changes a role title in `_data/profile.yml` and the site rebuilds
- **THEN** the new title appears on the page with no template, CSS or JS edit

#### Scenario: No CV content in site config
- **WHEN** `_config.yml` is inspected
- **THEN** it contains no role, education, skill or contact content

### Requirement: Structured entries drive timelines
Each career role and PPRO project SHALL carry start and end dates in the YAML (`YYYY-MM`, end may be `present`). Timelines SHALL be generated from these dates.

#### Scenario: Add a project
- **WHEN** a project with start and end dates, tags and bullets is added to the YAML
- **THEN** it appears as a card, as a Gantt bar and as a tag filter option without other edits

### Requirement: Summary and full-detail content
Each role or project SHALL support a short summary and an optional list of detail bullets. Entries from the previous site not covered by the new content SHALL be retained as detail bullets.

#### Scenario: Earlier role detail
- **WHEN** the Nisum role is viewed in Full detail mode
- **THEN** its previous detailed bullets are shown

#### Scenario: Summary mode hides old bullets
- **WHEN** the page is in Summary mode
- **THEN** only the role summary line is visible for earlier roles

### Requirement: Content precedence
Where the new profile content and the previous site content differ (titles, dates, employer names), the new profile content SHALL be used.

#### Scenario: Education dates
- **WHEN** the Bachelor of Commerce entry is rendered
- **THEN** it shows 2006 – 2008

### Requirement: Email stored split and aliased
The YAML SHALL store the contact email as separate `user` and `domain` fields holding `umair` and `overthosehills.com`. The previous address SHALL NOT appear in any tracked file.

#### Scenario: Old address removed
- **WHEN** tracked files are searched for the previous personal address
- **THEN** no match is found
