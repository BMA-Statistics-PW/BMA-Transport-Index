# BMA Theme Integration Guide

## Table of Contents
1. [Introduction](#introduction)
2. [CSS Variables Reference](#css-variables-reference)
3. [Implementation Roadmap](#implementation-roadmap)
4. [Component Library](#component-library)
5. [Utility Functions](#utility-functions)
6. [Quality Assurance Checklist](#quality-assurance-checklist)

## Introduction
This guide provides comprehensive instructions for integrating the BMA theme within the BMA-Transport-Index project. It covers the CSS variables, implementation strategies for dashboards, component library usage, utility functions, and quality assurance protocols to ensure effective theme integration.

## CSS Variables Reference
Below are the CSS variables used in the BMA theme:
- `--primary-color`: Main theme color
- `--secondary-color`: Secondary theme color
- `--background-color`: Background color
- `--font-family`: Default font family

```css
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --background-color: #f8f9fa;
    --font-family: 'Arial', sans-serif;
}
```

## Implementation Roadmap
### Dashboard 1: Overview
- **Step 1**: Design layout using component library.
- **Step 2**: Implement CSS variables for styling.
- **Step 3**: Integrate charts using utility functions.

### Dashboard 2: Performance
- **Step 1**: Use predefined components from the library.
- **Step 2**: Customize CSS using theme variables.
- **Step 3**: Validate data outputs.

### Dashboard 3: Analytics
- **Step 1**: Set up layout and structure using components.
- **Step 2**: Ensure consistent theming using CSS variables.
- **Step 3**: Test interactive elements and responsiveness.

## Component Library
The component library includes:
- Buttons
- Cards
- Modals
- Navbar
- Data tables

### Example Usage:
```html
<button class="btn" style="background-color: var(--primary-color);">
    Click Me
</button>
```

## Utility Functions
Utility functions to simplify theme integration:
- `setTheme(theme)`: Function to switch themes programmatically.
- `applyStyles(element, styles)`: Function to apply multiple styles to an element.

## Quality Assurance Checklist
- [ ] Check for correct CSS variables implementation.
- [ ] Validate component rendering as per design specifications.
- [ ] Ensure responsive behavior across devices.
- [ ] Test functionality of utility functions.
- [ ] Conduct cross-browser testing.
- [ ] Review the accessibility standards compliance.

---
This guide should serve as a roadmap for successful integration of the BMA theme in your projects. Follow each section carefully to ensure a cohesive and effective design.