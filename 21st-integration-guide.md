# 21st Integration Guide for Dani Bezerra Blog

## Quick Start with 21st Canvas

### 1. Using Canvas for Prototyping
```bash
# Open your project in 21st Canvas
# Connect to GitHub repo: https://github.com/bezerradaniels/blog-do-dani.git
```

### 2. Canvas Prompts for This Project

#### Create New Components
```
Create a newsletter subscription component with:
- Email input field
- Subscribe button with primary color (#0ea5e9)
- Success/error message handling
- TypeScript interfaces
- Tailwind CSS styling matching the design system
```

#### Modify Existing Components
```
Update the PostCard component to:
- Add a bookmark button
- Include social share buttons
- Add estimated read time badge
- Maintain responsive design
- Keep TypeScript types consistent
```

#### Create New Pages
```
Create a newsletter page with:
- Hero section with gradient background
- Subscription form with validation
- Recent posts preview
- Newsletter archive section
- Footer with social links
```

### 3. Community Components Integration

#### Find Components
```
@community search "blog components"
@community search "newsletter forms"
@community search "card layouts"
```

#### Use Components in Canvas
```
@component https://21st.dev/components/[component-id]
Add this newsletter component to the blog homepage
```

### 4. AI Coding Assistant Prompts

#### For Cursor/Claude Code
```
Based on the Dani Bezerra blog project:
- Use TypeScript with strict typing
- Follow Tailwind CSS utility patterns
- Maintain responsive design principles
- Use the existing color palette from .21st-config.json
- Ensure mobile-first approach
- Keep component structure consistent
```

#### Component Generation
```
Generate a React component for a blog author card with:
- Author avatar (rounded)
- Name and role
- Bio text
- Social media links
- Follow button
- TypeScript interfaces
- Tailwind CSS classes
- Responsive design
```

## Project Structure for 21st

### Component Patterns
```typescript
// Standard component pattern
interface ComponentProps {
  // Props with TypeScript types
}

export default function Component({ props }: ComponentProps) {
  return (
    <div className="bg-white rounded-xl border border-border p-6">
      {/* Component content */}
    </div>
  );
}
```

### Color Usage
```typescript
// Use color variables from config
const colors = {
  primary: '#0ea5e9',
  text: '#1e293b',
  textMuted: '#64748b',
  border: '#e2e8f0'
};
```

### Tailwind Patterns
```html
<!-- Common design patterns -->
<div className="bg-white rounded-xl border border-border p-6">
<div className="bg-primary text-white px-6 py-3 rounded-lg">
<div className="text-text-muted text-sm">
<div className="hover:text-primary transition">
```

## Integration Commands

### Canvas Commands
```
@github - Connect to repository
@codebase - Use existing components
@component [url] - Add community component
@theme - Apply color scheme
@responsive - Make responsive
```

### Export Options
```
# Copy component code
# Download as React component
# Export prompt for other AI tools
# Generate variations
```

## Best Practices

### 1. Component Structure
- Use TypeScript interfaces for props
- Follow existing naming conventions
- Maintain consistent Tailwind patterns
- Keep components reusable

### 2. Design System
- Use colors from .21st-config.json
- Follow typography guidelines
- Maintain border radius consistency
- Use proper spacing scales

### 3. Responsive Design
- Mobile-first approach
- Use Tailwind breakpoints (sm, md, lg)
- Test component variations
- Maintain aspect ratios

### 4. Code Quality
- TypeScript strict mode
- Proper error handling
- Loading states
- Accessibility considerations

## Example Workflows

### Workflow 1: Add Newsletter Feature
1. Open Canvas with GitHub repo
2. Prompt: "Create newsletter subscription component"
3. Generate 3 variations
4. Select best option
5. Copy code to project
6. Test integration

### Workflow 2: Redesign Blog Card
1. Use @community to find card components
2. Prompt: "Modify PostCard with bookmark feature"
3. Generate variations
4. Apply to existing component
5. Update TypeScript types

### Workflow 3: Create Landing Page
1. Prompt: "Create marketing landing page"
2. Use existing color scheme
3. Generate with sections
4. Add responsive behavior
5. Export complete page

## Troubleshooting

### Common Issues
- **TypeScript errors**: Ensure proper interfaces
- **Tailwind conflicts**: Check class names
- **Responsive issues**: Verify breakpoints
- **Import errors**: Check file paths

### Solutions
```
# Fix TypeScript
"Add proper TypeScript interfaces for all props"

# Fix Tailwind
"Use only Tailwind utility classes, avoid custom CSS"

# Fix responsive
"Apply mobile-first responsive design with Tailwind breakpoints"
```

## Resources

### Documentation
- [21st Canvas Docs](https://help.21st.dev/canvas)
- [Community Components](https://help.21st.dev/community)
- [GitHub Integration](https://help.21st.dev/canvas/github-integration)

### Support
- Discord: https://discord.gg/Qx4rFunHfm
- Twitter: https://x.com/21st_dev
- Email: support@21st.dev
