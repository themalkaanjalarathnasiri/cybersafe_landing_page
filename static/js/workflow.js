/**
 * CyberSafe Insurance - Workflow Timeline Functionality
 * Handles interactive step transitions in the How It Works section
 */

document.addEventListener('DOMContentLoaded', function() {
    initWorkflowTimeline();
});

/**
 * Initialize the interactive workflow timeline
 */
function initWorkflowTimeline() {
    const workflowSteps = document.querySelectorAll('.workflow-step');
    const stepDots = document.querySelectorAll('.step-dot');
    
    if (workflowSteps.length === 0) return;
    
    // Add mouse enter listeners to each step
    workflowSteps.forEach((step, index) => {
        step.addEventListener('mouseenter', () => {
            // Remove active class from all dots
            stepDots.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current dot
            stepDots[index].classList.add('active');
        });
    });
    
    // Set up automatic cycling through steps
    let currentStep = 0;
    
    function cycleSteps() {
        // Remove active class from all dots
        stepDots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current dot
        stepDots[currentStep].classList.add('active');
        
        // Increment step counter
        currentStep = (currentStep + 1) % stepDots.length;
    }
    
    // Initial state - first step active
    stepDots[0].classList.add('active');
    
    // Set interval for automatic cycling
    // Only cycle if user isn't hovering the workflow
    const workflowTimeline = document.querySelector('.workflow-timeline');
    let cycling = setInterval(cycleSteps, 3000);
    
    // Pause cycling on mouse enter
    workflowTimeline.addEventListener('mouseenter', () => {
        clearInterval(cycling);
    });
    
    // Resume cycling on mouse leave
    workflowTimeline.addEventListener('mouseleave', () => {
        // Reset to first step when mouse leaves
        stepDots.forEach(dot => dot.classList.remove('active'));
        stepDots[0].classList.add('active');
        currentStep = 1;
        
        // Restart the interval
        cycling = setInterval(cycleSteps, 3000);
    });
}