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

    /* Overall page background in Royal Ivory */
    html, body, .fi-body, .fi-layout, .fi-main {
        background-color: #FFF8FA !important;
        color: #352A30 !important;
    }

    /* Font applications */
    .fi-brand, 
    .fi-header-heading, 
    .fi-section-header-heading,
    .fi-modal-heading,
    .fi-ta-header-heading,
    .fi-wi-stats-overview-stat-value {
        font-family: 'Playfair Display', 'Noto Serif Sinhala', serif !important;
        letter-spacing: -0.01em;
    }

    /* Sidebar full height & layout */
    .fi-sidebar {
        width: 20rem !important;
        min-width: 20rem !important;
        background-color: #FFFFFF !important;
        border-right: 1.5px solid rgba(198, 165, 107, 0.35) !important;
        box-shadow: 4px 0 24px -10px rgba(173, 59, 101, 0.08) !important;
        padding-left: 0.5rem !important;
        padding-right: 0.5rem !important;
    }

    /* Sidebar header & anchored Heart logo */
    .fi-sidebar-header-ctn {
        padding: 0.75rem 0.5rem !important;
        border-bottom: 1.5px solid rgba(198, 165, 107, 0.25) !important;
        margin-bottom: 0.5rem !important;
        background: linear-gradient(180deg, #FFFFFF 0%, #FFF8FA 100%) !important;
        border-radius: 0.75rem !important;
    }

    .fi-sidebar-header {
        display: flex !important;
        align-items: center !important;
        height: auto !important;
        padding: 0 !important;
    }

    .fi-sidebar-header-logo-ctn {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
    }

    .fi-sidebar-header-logo-ctn a {
        display: block !important;
        width: 100% !important;
    }

    .fi-sidebar-header-logo-ctn .fi-logo {
        height: auto !important;
    }

    /* Completely hide topbar if any trace exists */
    .fi-topbar-ctn, .fi-topbar, .fi-topbar-start {
        display: none !important;
    }

    /* Active Sidebar Navigation Item */
    .fi-sidebar-item-active > a,
    .fi-sidebar-item-active > button {
        background: linear-gradient(90deg, rgba(173, 59, 101, 0.12) 0%, rgba(198, 165, 107, 0.08) 100%) !important;
        border-left: 4px solid var(--royal-rose) !important;
        color: var(--royal-rose) !important;
        font-weight: 700 !important;
        border-radius: 0 0.5rem 0.5rem 0 !important;
    }

    .fi-sidebar-item-active .fi-sidebar-item-icon {
        color: var(--royal-rose) !important;
    }

    /* Sidebar Group Labels */
    .fi-sidebar-group-label {
        color: #8E2E52 !important;
        font-weight: 700 !important;
        font-size: 0.75rem !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
    }

    /* Main Content Container */
    .fi-main-ctn {
        background-color: #FFF8FA !important;
        padding: 1.5rem !important;
    }

    /* Cards & Stats Widgets */
    .fi-wi-stats-overview-stat,
    .fi-section,
    .fi-card {
        background-color: #FFFFFF !important;
        border: 1px solid rgba(198, 165, 107, 0.35) !important;
        border-radius: 1.25rem !important;
        box-shadow: 0 10px 25px -5px rgba(173, 59, 101, 0.06), 0 0 1px 1px rgba(198, 165, 107, 0.15) !important;
    }

    .fi-wi-stats-overview-stat-value {
        color: #352A30 !important;
        font-size: 1.75rem !important;
        font-weight: 800 !important;
    }

    .fi-wi-stats-overview-stat-label {
        color: #AD3B65 !important;
        font-weight: 700 !important;
        font-size: 0.85rem !important;
    }

    /* Tables styling */
    .fi-ta-ctn {
        background-color: #FFFFFF !important;
        border: 1px solid rgba(198, 165, 107, 0.3) !important;
        border-radius: 1.25rem !important;
        box-shadow: 0 10px 25px -5px rgba(173, 59, 101, 0.06) !important;
        overflow: hidden !important;
    }

    .fi-ta-header {
        background-color: #FFF8FA !important;
        border-bottom: 1px solid rgba(198, 165, 107, 0.25) !important;
    }

    .fi-ta-table thead th {
        font-size: 0.75rem !important;
        text-transform: uppercase !important;
        letter-spacing: 0.04em !important;
        color: #634d58 !important;
        background-color: #FFF8FA !important;
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

    /* Login page styling */
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
        height: 6px;
        background: linear-gradient(90deg, var(--royal-rose), var(--royal-gold), var(--royal-rose));
    }

    .fi-simple-main {
        border-radius: 1.5rem !important;
        border: 1px solid rgba(198, 165, 107, 0.3) !important;
        box-shadow: 0 25px 50px -12px rgba(173, 59, 101, 0.15), 0 0 1px 1px rgba(198, 165, 107, 0.2) !important;
        background-color: #ffffff !important;
    }

    /* Selection highlight */
    ::selection {
        background-color: var(--royal-rose);
        color: #ffffff;
    }
</style>
