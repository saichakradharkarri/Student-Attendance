import re
import glob
import os

files_to_modify = [
    "frontend/app/dashboard/page.tsx",
    "frontend/app/student/updatedetails/page.tsx",
    "frontend/app/student/registrationform/page.tsx",
    "frontend/app/student/view-attendance/page.tsx",
    "frontend/app/student/demo-session/page.tsx",
    "frontend/app/teacher/dashboard/page.tsx",
    "frontend/app/teacher/start-session/page.tsx",
    "frontend/app/teacher/updatedetails/page.tsx"
]

replacements = {
    # Backgrounds and containers
    r'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50': 'min-h-screen relative',
    r'bg-gradient-to-br from-slate-50 to-blue-50': 'min-h-screen relative',
    r'bg-white/80 backdrop-blur-lg': 'glass-card border-b border-white/5',
    r'bg-white/70 backdrop-blur-lg': 'glass-card',
    r'bg-white/95 backdrop-blur-lg': 'glass-card',
    r'bg-white/60': 'glass-input',
    r'bg-white/50': 'glass-card',
    r'bg-white/70': 'glass-card',
    r'bg-slate-100': 'bg-white/5',
    r'bg-slate-200': 'bg-white/10',
    r'bg-gray-100': 'bg-white/5',
    r'bg-gray-200': 'bg-white/10',
    r'bg-blue-50': 'bg-primary/10',
    r'bg-blue-100': 'bg-primary/20',
    r'from-blue-50 to-indigo-50': 'glass-card',
    r'bg-white\b': 'glass-card', # fallback
    
    # Texts
    r'text-slate-900': 'text-primary',
    r'text-slate-800': 'text-foreground',
    r'text-slate-700': 'text-foreground/90',
    r'text-slate-600': 'text-muted-foreground',
    r'text-slate-500': 'text-muted-foreground/70',
    r'text-gray-800': 'text-foreground',
    r'text-gray-700': 'text-foreground/90',
    r'text-gray-600': 'text-muted-foreground',
    r'text-gray-500': 'text-muted-foreground/70',
    r'text-blue-600': 'text-primary',
    r'text-blue-700': 'text-primary',
    r'text-blue-500': 'text-primary',
    
    # Borders
    r'border-slate-200': 'border-white/10',
    r'border-gray-200': 'border-white/10',
    r'border-gray-300': 'border-white/20',
    r'border-blue-500': 'border-primary',
    r'border-blue-200': 'border-primary/20',
    r'border-blue-300': 'border-primary/30',
    
    # Hover specific colors to dark theme
    r'hover:bg-blue-100': 'hover:bg-white/10',
    r'hover:bg-gray-50': 'hover:bg-white/5',
    r'hover:bg-slate-50': 'hover:bg-white/5',
    
    # Gradients text
    r'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent': 'text-gradient',
    
    # Replace the fixed animated backgrounds with nothing (or mesh logic)
    r'<div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>': '',
    r'<div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "2s" }}></div>': '',
    r'<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "4s" }}></div>': '',
    r'min-h-screen bg-gradient-to-br from-slate-50 to-blue-50': 'min-h-screen relative',
}

for filepath in files_to_modify:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        # apply replacements
        new_content = content
        for k, v in replacements.items():
            new_content = re.sub(k, v, new_content)
            
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Refactored {filepath}")
    else:
        print(f"Did not find {filepath}")
