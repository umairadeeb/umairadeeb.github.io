# Spec Delta

## Purpose

Defines the interactive and animated parts of the CV: career timeline slider, project Gantt, technology filter, detail toggle and motion behaviour.

## ADDED Requirements

### Requirement: Career timeline slider
The page SHALL show a Gantt of all roles from the first role to today and a slider that selects a month. The roles active in the selected month SHALL be highlighted and described.

#### Scenario: Scrub to 2012
- **WHEN** the visitor moves the slider to a month in 2012
- **THEN** the Etilize bar is highlighted and its title and summary are shown

#### Scenario: Gap between roles
- **WHEN** the slider is on a month with no role
- **THEN** a "between roles" message is shown

### Requirement: Project Gantt with navigation
The PPRO section SHALL show a Gantt of its projects. Activating a bar SHALL open and scroll to that project's card.

#### Scenario: Click a bar
- **WHEN** the visitor clicks or presses Enter on a project bar
- **THEN** the matching card opens and receives focus

### Requirement: Technology filter
The page SHALL list technologies as chips. Selecting one SHALL dim projects and bars that do not use it and state how many projects match. Selecting it again or choosing "Show all projects" SHALL clear the filter.

#### Scenario: Filter by Kubernetes
- **WHEN** the visitor selects the Kubernetes chip
- **THEN** non-matching projects are dimmed and the status text gives the match count

### Requirement: Summary and Full detail toggle
The page SHALL provide a two-state control. Summary SHALL collapse project and role details; Full detail SHALL expand all of them.

#### Scenario: Full detail
- **WHEN** the visitor selects Full detail
- **THEN** every project and earlier role shows its detail bullets

### Requirement: Animation and reduced motion
Bars, metric figures and section navigation SHALL animate on load or scroll. When the visitor's system requests reduced motion, animations and smooth scrolling SHALL be disabled and final states shown immediately.

#### Scenario: Reduced motion
- **WHEN** the system setting prefers reduced motion
- **THEN** no animation plays and all values display in their final state

### Requirement: Keyboard and screen-reader access
Interactive controls SHALL be operable by keyboard and expose pressed or expanded state and labels.

#### Scenario: Keyboard use
- **WHEN** the visitor tabs to a filter chip and presses Enter
- **THEN** the filter applies and the chip reports its pressed state
