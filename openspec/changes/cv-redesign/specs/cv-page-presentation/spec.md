# Spec Delta

## Purpose

Defines the visual design of the CV page: layout, colour palette, pill styling, circular photo, light and dark themes, and responsive behaviour.

## ADDED Requirements

### Requirement: White default theme
The page SHALL load with a white background and dark ink text.

#### Scenario: First visit
- **WHEN** a visitor opens the page with no saved theme preference
- **THEN** the background is white

### Requirement: Dark theme toggle
The page SHALL provide a control to switch to a dark theme and back, and SHALL remember the choice in the browser. Printing SHALL always use the light theme.

#### Scenario: Switch theme
- **WHEN** the visitor activates the theme control
- **THEN** the page switches theme and keeps it on reload

#### Scenario: Print is light
- **WHEN** the page is printed while in dark theme
- **THEN** the printed output has a white background

### Requirement: Specified palette
The page SHALL use the colours `#1AB8CF`, `#0A8AA2`, `#0B3C49`, `#101820` and `#E0FBFC`. Text on coloured fills SHALL meet WCAG AA contrast (4.5:1): white text on `#0B3C49`, `#101820` text on `#1AB8CF`, `#0B3C49` text on `#E0FBFC`. `#0A8AA2` SHALL NOT carry small white text.

#### Scenario: Pill contrast
- **WHEN** role, date and location pills are checked with a contrast tool
- **THEN** each text/fill pair is at least 4.5:1

### Requirement: Pill boxes for key facts
Positions, dates and locations SHALL render as button-like pill boxes with distinct fills. Technology tags SHALL render as outlined pills.

#### Scenario: Project header
- **WHEN** a project card is shown
- **THEN** its role and date range each appear in a separate pill

### Requirement: Circular profile photo
The profile photo SHALL display in a circle cropped to the face, and its file SHALL be under 150 KB.

#### Scenario: Photo shape
- **WHEN** the header renders at any viewport width
- **THEN** the photo is a circle with no distortion

### Requirement: Responsive layout
The page SHALL be usable from 360 px width up, without horizontal scrolling.

#### Scenario: Phone width
- **WHEN** the viewport is 360 px wide
- **THEN** all content is readable and nothing overflows horizontally
