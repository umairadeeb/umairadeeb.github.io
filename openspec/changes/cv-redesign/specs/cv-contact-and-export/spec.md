# Spec Delta

## Purpose

Defines how visitors reach the owner and export the CV, while keeping the email address out of reach of scrapers.

## ADDED Requirements

### Requirement: Icon-only contact links
The header SHALL show LinkedIn, GitHub and email as icons without visible text names. Each icon SHALL have an accessible label. GitHub SHALL link to `https://github.com/umairadeeb`. Instagram SHALL NOT appear.

#### Scenario: Header icons
- **WHEN** the header renders
- **THEN** three icons are present, each with an accessible name, and no "LinkedIn" or "GitHub" visible text

### Requirement: Email absent from page source
The served HTML SHALL NOT contain the email address, its user or domain part in readable form, a `mailto:` link, or any email-shaped string (`name@domain.tld`).

#### Scenario: Source scan
- **WHEN** the served page HTML is searched for `mailto:`, `overthosehills`, `umair@` and the pattern `[\w.+-]+@[\w-]+\.\w+`
- **THEN** no match is found

### Requirement: Email icon opens mail client
Activating the email icon SHALL build the address in the browser from the YAML parts and open a `mailto:` to it.

#### Scenario: Click email icon
- **WHEN** the visitor clicks the email icon
- **THEN** the default mail client opens addressed to `umair@overthosehills.com`

### Requirement: PDF export via print
The page SHALL provide a "Save as PDF" button that opens the browser print dialog. The print layout SHALL expand all details, hide controls, sliders and filters, and use a clean single-column layout.

#### Scenario: Print layout
- **WHEN** the visitor clicks "Save as PDF"
- **THEN** the print preview shows all project details and no interactive controls

### Requirement: Email shown only in print output
The email address SHALL be added to the page only while printing and removed afterwards. This SHALL apply to both the button and the browser's own print command.

#### Scenario: PDF contains email
- **WHEN** the page is printed to PDF
- **THEN** the PDF shows `umair@overthosehills.com` in the header

#### Scenario: Removed after print
- **WHEN** the print dialog closes
- **THEN** the email text is no longer in the page DOM
