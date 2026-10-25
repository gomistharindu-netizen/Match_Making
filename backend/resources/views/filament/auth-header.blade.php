<div class="mb-6 text-center">
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#AD3B65] via-[#942A50] to-[#731E3C] border-2 border-[#C6A56B] shadow-xl shadow-[#AD3B65]/30 mb-3">
        <svg class="w-9 h-9 text-[#C6A56B] fill-[#C6A56B]" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    </div>
    <h2 class="text-2xl font-bold text-[#352A30] font-serif tracking-tight">
        ජයතු ජය මංගල සේවාව
    </h2>
    <p class="text-xs font-semibold text-[#C6A56B] uppercase tracking-widest mt-1">
        Agency Management Portal
    </p>

    <!-- Quick Credentials Helper Box -->
    <div class="mt-4 p-3.5 rounded-xl bg-[#FFF8FA] border border-[#F3DCE4] shadow-sm text-left">
        <p class="text-[11px] font-bold text-[#AD3B65] uppercase tracking-wider mb-2 flex items-center">
            <span class="w-2 h-2 rounded-full bg-[#AD3B65] inline-block mr-1.5"></span>
            Demo Agency Credentials:
        </p>
        <div class="grid grid-cols-2 gap-2 text-xs">
            <div 
                onclick="fillLogin('admin@jayathujaya.lk', 'admin123')"
                class="cursor-pointer p-2.5 rounded-lg bg-white border border-[#C6A56B]/40 hover:border-[#AD3B65] hover:shadow-md transition group"
                title="Click to auto-fill"
            >
                <div class="font-bold text-[#352A30] group-hover:text-[#AD3B65]">Administrator</div>
                <div class="text-[11px] text-stone-500 font-mono">admin@jayathujaya.lk</div>
                <div class="text-[10px] text-stone-400 font-mono mt-0.5">PW: admin123</div>
            </div>
            <div 
                onclick="fillLogin('staff@jayathujaya.lk', 'staff123')"
                class="cursor-pointer p-2.5 rounded-lg bg-white border border-[#C6A56B]/40 hover:border-[#AD3B65] hover:shadow-md transition group"
                title="Click to auto-fill"
            >
                <div class="font-bold text-[#352A30] group-hover:text-[#AD3B65]">Staff / Astrologer</div>
                <div class="text-[11px] text-stone-500 font-mono">staff@jayathujaya.lk</div>
                <div class="text-[10px] text-stone-400 font-mono mt-0.5">PW: staff123</div>
            </div>
        </div>
        <p class="text-[10px] text-stone-400 mt-2 text-center">
            👆 Click a card to auto-fill credentials into the fields below
        </p>
    </div>
</div>

<script>
    function fillLogin(email, password) {
        const emailInput = document.querySelector('input[type="email"]') || document.querySelector('input[autocomplete="email"]') || document.querySelector('input[name*="email"]');
        const passwordInput = document.querySelector('input[type="password"]');
        
        if (emailInput) {
            emailInput.value = email;
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            emailInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (passwordInput) {
            passwordInput.value = password;
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
            passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
</script>