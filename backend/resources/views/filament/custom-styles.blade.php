<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Sinhala:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">

<style>
    :root {
        --royal-rose: #AD3B65;
        --royal-rose-dark: #8E2E52;
        --royal-gold: #C6A56B;
        --royal-gold-light: #E8D8BA;
        --royal-ivory: #FFF8FA;
        --royal-plum: #352A30;
        --royal-border: #F3DCE4;
    }

    /* Font applications */
    .fi-brand, 
    .fi-header-heading, 
    .fi-section-header-heading,
    .fi-modal-heading,
    .fi-ta-header-heading {
        font-family: 'Playfair Display', 'Noto Serif Sinhala', serif !important;
        letter-spacing: -0.01em;
    }

    /* Soft royal background for auth pages */
    .fi-simple-layout {
        background: linear-gradient(135deg, #FFF8FA 0%, #FDF0F4 50%, #FAF5F0 100%) !important;
        position: relative;
    }
    
    .fi-simple-layout::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 5px;
        background: linear-gradient(90deg, var(--royal-rose), var(--royal-gold), var(--royal-rose));
    }

    /* Card styling on simple layout (Login page) */
    .fi-simple-main {
        border-radius: 1.25rem !important;
        border: 1px solid rgba(198, 165, 107, 0.25) !important;
        box-shadow: 0 20px 40px -15px rgba(173, 59, 101, 0.12), 0 0 1px 1px rgba(198, 165, 107, 0.15) !important;
        background-color: #ffffff !important;
    }

    /* Primary buttons */
    .fi-btn-primary {
        background: linear-gradient(135deg, var(--royal-rose) 0%, var(--royal-rose-dark) 100%) !important;
        border: 1px solid rgba(198, 165, 107, 0.4) !important;
        box-shadow: 0 4px 12px rgba(173, 59, 101, 0.25) !important;
        transition: all 0.2s ease-in-out !important;
        font-weight: 600 !important;
    }
    .fi-btn-primary:hover {
        background: linear-gradient(135deg, #be3f6f 0%, var(--royal-rose) 100%) !important;
        box-shadow: 0 6px 16px rgba(173, 59, 101, 0.35) !important;
        transform: translateY(-1px);
    }

    /* Active Sidebar Navigation Item */
    .fi-sidebar-item-active > a,
    .fi-sidebar-item-active > button {
        background: linear-gradient(90deg, rgba(173, 59, 101, 0.12) 0%, rgba(198, 165, 107, 0.08) 100%) !important;
        border-left: 3.5px solid var(--royal-rose) !important;
        color: var(--royal-rose) !important;
        font-weight: 700 !important;
    }

    .fi-sidebar-item-active .fi-sidebar-item-icon {
        color: var(--royal-rose) !important;
    }

    /* Sidebar Group Labels */
    .fi-sidebar-group-label {
        color: #8E2E52 !important;
        font-weight: 700 !important;
        font-size: 0.72rem !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
    }

    /* Topbar border accent */
    .fi-topbar {
        border-bottom: 2px solid rgba(198, 165, 107, 0.2) !important;
    }

    /* Table headers styling */
    .fi-ta-header {
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
    }
    .fi-ta-table thead th {
        font-size: 0.75rem !important;
        text-transform: uppercase !important;
        letter-spacing: 0.04em !important;
        color: #634d58 !important;
    }

    /* Badges */
    .fi-badge {
        font-weight: 600 !important;
        letter-spacing: 0.02em !important;
    }

    /* Selection highlight */
    ::selection {
        background-color: var(--royal-rose);
        color: #ffffff;
    }
</style>
