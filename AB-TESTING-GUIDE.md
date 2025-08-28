# A/B Testing Framework Guide

## Overview
FreePromptHub now has a complete A/B testing framework for optimizing conversion rates and user experience through data-driven experiments.

## Quick Start

### 1. Access the Dashboard
Navigate to: `/ab-testing-dashboard.html`

### 2. Available Experiments
The framework includes 15+ pre-configured experiments:

- **CTA Button Tests**: Color, text, size variations
- **Hero Section**: Headlines, layouts, images
- **Navigation**: Menu styles, search placement
- **Social Proof**: Testimonials, trust badges
- **Content Layout**: Grid vs list, card styles
- **Pricing Display**: Table vs cards, highlight strategies
- **Form Optimization**: Field reduction, progressive disclosure
- **Mobile Experience**: Touch targets, gesture controls
- **Loading Strategies**: Lazy loading, skeleton screens
- **Onboarding**: Tutorial styles, tooltips
- **Search Features**: Autocomplete, filters
- **Footer Optimization**: Newsletter placement, links
- **Category Pages**: Sorting, filtering options
- **Prompt Details**: Layout, interaction patterns
- **Performance**: Image optimization, caching

## How It Works

### User Assignment
- Users are automatically assigned to experiment variants
- Assignment is deterministic based on user ID hash
- Users see the same variant consistently

### Tracking Conversions
The framework automatically tracks:
- Page views and engagement
- Click events on tracked elements
- Form submissions
- Custom goal completions

### Statistical Analysis
- Real-time statistical significance calculations
- Confidence intervals (95% default)
- Sample size recommendations
- Automatic winner detection

## Dashboard Features

### Experiment Management
- Start/pause/stop experiments
- Adjust traffic allocation (0-100%)
- Schedule experiment duration
- Clone successful experiments

### Analytics
- Conversion rate comparison
- Statistical significance indicators
- Confidence intervals
- Sample size tracking
- Time-series graphs

### Export & Reporting
- Export results as CSV/JSON
- Generate experiment reports
- Archive completed experiments

## Technical Implementation

### Files Created
```
/js/ab-testing.js          # Core framework (853 lines)
/js/ab-experiments.js      # Experiment configs (527 lines)
/css/ab-testing.css        # Dashboard styles (495 lines)
/ab-testing-dashboard.html # Admin interface (868 lines)
```

### Integration
- Added to all 120 HTML pages
- Lightweight client-side implementation
- LocalStorage for data persistence
- No external dependencies

## Best Practices

### 1. Sample Size
- Wait for minimum 100 conversions per variant
- Don't stop tests too early (statistical significance)
- Consider weekly patterns in traffic

### 2. Test Design
- Test one major change at a time
- Use clear success metrics
- Document hypothesis before starting

### 3. Traffic Allocation
- Start with 50/50 split for new tests
- Use 90/10 for risky changes
- Gradually increase winning variant traffic

### 4. Duration
- Run tests for at least 1 week
- Consider business cycles
- Account for returning vs new users

## Advanced Features

### Multivariate Testing
Test multiple variables simultaneously:
```javascript
{
  id: 'multivariate_hero',
  variants: [
    { headline: 'A', button: 'Blue', image: '1' },
    { headline: 'A', button: 'Green', image: '2' },
    { headline: 'B', button: 'Blue', image: '1' },
    { headline: 'B', button: 'Green', image: '2' }
  ]
}
```

### Custom Goals
Track specific user actions:
```javascript
abTesting.trackGoal('experiment_id', 'custom_goal_name', value);
```

### Segmentation
Analyze results by user segments:
- New vs returning users
- Device type (mobile/desktop)
- Traffic source
- Geographic location

## Monitoring & Debugging

### Console Commands
```javascript
// View active experiments
abTesting.getActiveExperiments();

// Check user's variants
abTesting.getUserVariants();

// Force variant assignment (testing only)
abTesting.forceVariant('experiment_id', 'variant_id');

// Clear all experiment data
abTesting.clearAllData();
```

### Performance Impact
- Minimal overhead (~5KB gzipped)
- Asynchronous tracking
- Batched data updates
- Local caching

## Compliance & Privacy

### GDPR Compliance
- All data stored locally
- No PII collected
- User can opt-out
- Data automatically expires

### Cookie Policy
- Uses localStorage (not cookies)
- Transparent data usage
- Clear data retention policy

## Troubleshooting

### Common Issues

1. **Experiment not showing**
   - Check traffic allocation
   - Verify experiment is active
   - Clear browser cache

2. **Low conversion rates**
   - Verify tracking implementation
   - Check goal definitions
   - Review sample size

3. **Inconsistent results**
   - Ensure proper randomization
   - Check for external factors
   - Verify statistical calculations

## Next Steps

1. **Start Simple**: Begin with button color or text tests
2. **Document Learnings**: Keep experiment log
3. **Share Results**: Communicate wins with team
4. **Iterate**: Use insights for new hypotheses
5. **Scale**: Test bigger changes once confident

## Support

For issues or questions about the A/B testing framework:
- Check browser console for errors
- Review experiment configuration
- Verify tracking implementation
- Test in incognito mode

---

*Framework implemented successfully - 120 pages updated with A/B testing capabilities*